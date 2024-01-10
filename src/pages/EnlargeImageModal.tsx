import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, Pressable, FlatList} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/image/svgXml';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import Modal from 'react-native-modal';
import {useFocusEffect} from '@react-navigation/native';
import ToastScreen from '../components/ToastScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';

type itemProps = {
  item: {
    accountId: number;
    content: string;
    friendNickname: string;
    isRead: boolean;
    notificationId: number;
    notificationType: string;
    redirectTargetId: number;
    status: string;
    targetEntity: string;
  };
};

type EnlargeImageProps = NativeStackScreenProps<
  RootStackParamList,
  'EnlargeImage'
>;

//모달로 변경 필요
export default function EnlargeImageModal({
  navigation,
  route,
}: EnlargeImageProps) {
  const dispatch = useAppDispatch();
  const [isEnabled, setIsEnabled] = useState(true);
  const [noNotis, setNoNotis] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [cursorId, setCursorId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setmodalData] = useState('');
  const [friendMsg, setFriendMsg] = useState('');
  const [modalDataId, setmodalDataId] = useState(-1);
  const [refresh, setRefresh] = useState(false);
  const [popup, setPopup] = useState(false);
  const [notisData, setNotisData] = useState([]);

  const [test, setTest] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const getNotis = async () => {
        try {
          const response = await axios.get(
            `${Config.API_URL}/notifications/accounts/me`,
          );
          // console.log(response.data.data)
          if (response.data.data.content.length == 0) setNoNotis(true);
          else {
            setIsLast(response.data.data.last);
            setNotisData(response.data.data.content);
            // console.log(response.data.data)
            if (response.data.data.content.length != 0) {
              setCursorId(
                response.data.data.content[
                  response.data.data.content.length - 1
                ].notificationId,
              );
            }
          }
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>)
            .response;
          console.log(errorResponse?.data.status);
          if (errorResponse?.data.status == 500) {
            dispatch(
              userSlice.actions.setToken({
                accessToken: '',
              }),
            );
          }
        }
      };

      getNotis();
      dispatch(
        userSlice.actions.setNotis({
          notis: false,
        }),
      );
    }, [refresh, noNotis]),
  );

  const getData = async () => {
    if (!isLast) {
      setLoading(true);
      try {
        // console.log(cursorId)
        const response = await axios.get(
          `${Config.API_URL}/notifications/accounts/me?cursorId=${cursorId}`,
        );
        // console.log(response.data.data)
        setIsLast(response.data.data.last);
        setNotisData(notisData.concat(response.data.data.content));
        if (response.data.data.content.length != 0) {
          setCursorId(
            response.data.data.content[response.data.data.content.length - 1]
              .notificationId,
          );
        }
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse.data);
      }
    }
    setLoading(false);
  };

  const onEndReached = () => {
    if (!loading) {
      getData();
    }
  };

  const deleteNotis = async (notificationId: number) => {
    try {
      const response = await axios.delete(
        `${Config.API_URL}/notifications/${notificationId}`,
      );
      // console.log(response.data.data)
      setRefresh(!refresh);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  const approveFriendship = async (friendshipRequestId: number) => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/friendships/request/${friendshipRequestId}/approval`,
      );
      // console.log(response.data);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  const goToFeed = (feedId: number) => {
    navigation.navigate('FeedDetail', {feedId: feedId});
  };

  const getFriendMsg = useCallback(
    (friendshipRequestId: number) => {
      const getMSG = async () => {
        try {
          const response = await axios.get(
            `${Config.API_URL}/friendships/request/${friendshipRequestId}/message`,
          );
          setFriendMsg(response.data.data.message);
          setShowModal(true);
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>)
            .response;
          console.log(errorResponse.data);
        }
      };
      getMSG();
    },
    [friendMsg],
  );

  const testcall = useCallback(
    (x: number) => {
      console.log(x);
    },
    [friendMsg],
  );

  const isDeleted = async (feedId: number) => {
    try {
      const response = await axios.get(`${Config.API_URL}/feeds/${feedId}`);
      if (response.data.data) return false;
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      if (
        errorResponse?.data.statusCode == 4030 ||
        errorResponse?.data.statusCode == 4010
      ) {
        return true;
      }
      console.log(errorResponse.data);
    }
  };

  return (
    <View style={styles.entire}>
      {noNotis && (
        <View style={styles.empty}>
          <Text style={styles.emptyTxt}>알림을 다 읽었어요</Text>
        </View>
      )}
      {!noNotis && (
        <FlatList
          data={notisData}
          style={styles.notisEntire}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          renderItem={({item}: itemProps) => {
            return (
              <Pressable
                style={styles.eachNotis}
                onPress={async () => {
                  if (item.notificationType.includes('FEED')) {
                    if (await isDeleted(item.redirectTargetId)) {
                      setPopup(true);
                      deleteNotis(item.notificationId);
                    } else goToFeed(item.redirectTargetId);
                  } else if (
                    item.notificationType == 'APPROVE_FRIENDSHIP_REQUEST'
                  ) {
                    navigation.navigate('Profile', {
                      whose: 1,
                      accountId: item.accountId,
                    });
                  } else if (item.notificationType.includes('MESSAGE')) {
                    navigation.navigate('NoteBox');
                  }
                }}>
                <View style={styles.notisView}>
                  {!item.notificationType.includes('MESSAGE') && (
                    <Pressable
                      style={styles.notisProfile}
                      onPress={() => {
                        navigation.navigate('Profile', {
                          whose: 1,
                          accountId: item.accountId,
                        });
                      }}>
                      {item.status == 'SMILE' && (
                        <SvgXml
                          width={32}
                          height={32}
                          xml={svgXml.status.smile}
                        />
                      )}
                      {item.status == 'HAPPY' && (
                        <SvgXml
                          width={32}
                          height={32}
                          xml={svgXml.status.happy}
                        />
                      )}
                      {item.status == 'SAD' && (
                        <SvgXml
                          width={32}
                          height={32}
                          xml={svgXml.status.sad}
                        />
                      )}
                      {item.status == 'MAD' && (
                        <SvgXml
                          width={32}
                          height={32}
                          xml={svgXml.status.mad}
                        />
                      )}
                      {item.status == 'EXHAUSTED' && (
                        <SvgXml
                          width={32}
                          height={32}
                          xml={svgXml.status.exhauseted}
                        />
                      )}
                      {item.status == 'COFFEE' && (
                        <SvgXml
                          width={32}
                          height={32}
                          xml={svgXml.status.coffee}
                        />
                      )}
                      {item.status == 'MEAL' && (
                        <SvgXml
                          width={32}
                          height={32}
                          xml={svgXml.status.meal}
                        />
                      )}
                      {item.status == 'ALCOHOL' && (
                        <SvgXml
                          width={32}
                          height={32}
                          xml={svgXml.status.alcohol}
                        />
                      )}
                      {item.status == 'CHICKEN' && (
                        <SvgXml
                          width={32}
                          height={32}
                          xml={svgXml.status.chicken}
                        />
                      )}
                      {item.status == 'SLEEP' && (
                        <SvgXml
                          width={32}
                          height={32}
                          xml={svgXml.status.sleep}
                        />
                      )}
                      {item.status == 'WORK' && (
                        <SvgXml
                          width={32}
                          height={32}
                          xml={svgXml.status.work}
                        />
                      )}
                      {item.status == 'STUDY' && (
                        <SvgXml
                          width={32}
                          height={32}
                          xml={svgXml.status.study}
                        />
                      )}
                      {item.status == 'MOVIE' && (
                        <SvgXml
                          width={32}
                          height={32}
                          xml={svgXml.status.movie}
                        />
                      )}
                      {item.status == 'MOVE' && (
                        <SvgXml
                          width={32}
                          height={32}
                          xml={svgXml.status.move}
                        />
                      )}
                      {item.status == 'DANCE' && (
                        <SvgXml
                          width={32}
                          height={32}
                          xml={svgXml.status.dance}
                        />
                      )}
                      {item.status == 'READ' && (
                        <SvgXml
                          width={32}
                          height={32}
                          xml={svgXml.status.read}
                        />
                      )}
                      {item.status == 'WALK' && (
                        <SvgXml
                          width={32}
                          height={32}
                          xml={svgXml.status.walk}
                        />
                      )}
                      {item.status == 'TRAVEL' && (
                        <SvgXml
                          width={32}
                          height={32}
                          xml={svgXml.status.travel}
                        />
                      )}
                    </Pressable>
                  )}
                  <View style={styles.notisTextView}>
                    <Text
                      style={
                        !item.notificationType.includes('MESSAGE')
                          ? styles.notisText
                          : [styles.notisText, {marginVertical: 10}]
                      }>
                      {item.content.replace('\n', '')}
                    </Text>
                  </View>
                </View>
                {item.notificationType == 'CREATE_FRIENDSHIP_REQUEST' && (
                  <Pressable
                    style={styles.notisCheckBtn}
                    onPress={() => {
                      getFriendMsg(item.redirectTargetId);
                      setmodalData(item.content);
                      setmodalDataId(item.redirectTargetId);
                    }}>
                    <Text style={styles.notisCheckBtnTxt}>보기</Text>
                  </Pressable>
                )}
                <Pressable
                  style={styles.xBtn}
                  onPress={() => deleteNotis(item.notificationId)}>
                  <SvgXml width={16} height={16} xml={svgXml.icon.notisX} />
                </Pressable>
              </Pressable>
            );
          }}
        />
      )}
      <Modal
        isVisible={showModal}
        onBackButtonPress={() => setShowModal(false)}
        backdropColor="#222222"
        backdropOpacity={0.5}>
        <Pressable
          style={styles.modalBGView}
          onPress={() => {
            setShowModal(false);
          }}>
          <Pressable
            style={styles.modalView}
            onPress={e => e.stopPropagation()}>
            <Text style={styles.modalTitleTxt}>친구 요청 메시지</Text>
            <View style={styles.changeView}>
              <Text
                style={
                  friendMsg.trim() == ''
                    ? [styles.nameChangeTxtInput, {color: '#848484'}]
                    : styles.nameChangeTxtInput
                }>
                {friendMsg.trim() == '' ? '우리 친구해요!' : friendMsg}
              </Text>
            </View>
            <View style={styles.modalBtnView}>
              <Pressable
                style={styles.btnWhite}
                onPress={() => {
                  setShowModal(false);
                  setmodalData('');
                }}>
                <Text style={styles.btnWhiteTxt}>닫기</Text>
              </Pressable>
              <Pressable
                style={styles.btnYellow}
                onPress={() => {
                  approveFriendship(modalDataId);
                  setShowModal(false);
                  setmodalData('');
                  setmodalDataId(-1);
                }}>
                <Text style={styles.btnYellowTxt}>수락하기</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      {popup && (
        <ToastScreen
          height={21}
          marginBottom={48}
          onClose={() => setPopup(false)}
          message={`삭제된 글이에요.`}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    // flex: 1,
    height: 2000,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  notisHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 16,
    height: 40,
    backgroundColor: '#333333',
  },
  notisHeaderTxt: {
    color: '#F0F0F0',
    fontWeight: '500',
    fontSize: 12,
    marginRight: 3,
  },
  toggleView: {
    width: 48,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 2,
    paddingVertical: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleActiveTxt: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
    marginRight: 4,
    top: -2,
  },
  toggleActiveCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  toggleInactiveTxt: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
    marginRight: 6,
    top: -2,
  },
  toggleInactiveCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    left: 3,
    backgroundColor: '#FFFFFF',
  },
  empty: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTxt: {
    color: '#888888',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  notisEntire: {
    width: '100%',
  },
  eachNotis: {
    width: '100%',
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F7F7F7',
  },
  notisView: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notisProfile: {
    marginVertical: 12,
    marginRight: 10,
  },
  notisTextView: {
    justifyContent: 'center',
    flexShrink: 1,
    paddingVertical: 11,
  },
  notisText: {
    color: '#222222',
    fontWeight: '400',
    fontSize: 14,
    textAlignVertical: 'center',
    flex: 1,
  },
  notisCheckBtn: {
    width: 84,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFB443',
    borderRadius: 10,
    marginLeft: 12,
    marginVertical: 12,
  },
  notisCheckBtnTxt: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  xBtn: {
    marginLeft: 10,
  },
  btnWhite: {
    height: 44,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFB443',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
  },
  btnYellow: {
    height: 44,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFB443',
    backgroundColor: '#FFB443',
    marginHorizontal: 4,
  },
  btnWhiteTxt: {
    color: '#FFB443',
    fontSize: 15,
    fontWeight: '600',
  },
  btnYellowTxt: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  modalBGView: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  modalTitleTxt: {
    color: '#222222',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalContentTxt: {
    color: '#848484',
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    // marginBottom: 12
  },
  changeView: {
    width: '100%',
    flexDirection: 'row',
  },
  modalBtnView: {
    flexDirection: 'row',
    width: '100%',
  },
  nameChangeTxtInput: {
    width: '100%',
    fontSize: 15,
    fontWeight: '400',
    color: '#222222',
    borderRadius: 5,
    backgroundColor: '#F7F7F7',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 10,
  },
});
