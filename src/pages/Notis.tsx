/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  RefreshControl,
  FlatList,
  Image,
} from 'react-native';
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
import FriendProfileModal from '../components/FriendProfileModal';
import {useNavigation} from '@react-navigation/native';
import AnimatedButton from '../components/AnimatedButton';

type itemProps = {
  item: {
    // notificationId:number;
    // notificationType:string;
    // targetEntity:string;
    // redirectTargetId:number;
    // title:string;
    // content:string;
    // createdAt:string;
    // isRead:boolean;
    accountId: number;
    content: string;
    friendNickname: string;
    isRead: boolean;
    isClicked: boolean;
    notificationId: number;
    notificationType: string;
    redirectTargetId: number;
    status: string;
    targetEntity: string;
  };
  index: number;
};

type NotisScreenProps = NativeStackScreenProps<RootStackParamList, 'Notis'>;

export default function Notis({}: NotisScreenProps) {
  const navigation = useNavigation();

  const dispatch = useAppDispatch();
  const [isEnabled, setIsEnabled] = useState(true);
  const [noNotis, setNoNotis] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [cursorId, setCursorId] = useState(0);
  const [loading, setLoading] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  // const [modalData, setmodalData] = useState('');
  // const [friendMsg, setFriendMsg] = useState('');
  // const [modalDataId, setmodalDataId] = useState(-1);
  const [showProfileModal, setShowProfileModal] = useState(0);
  const [deleteFriend, setDeleteFriend] = useState(-1);
  const [refresh, setRefresh] = useState(false);
  const [popup, setPopup] = useState('');
  const [popupName, setPopupName] = useState('');
  const [isNotClicked, setIsNotClicked] = useState(false);
  const [notisData, setNotisData] = useState([
    //   {
    //   notificationId:6,
    //   notificationType:"CREATE_FEED_COMMENT",
    //   targetEntity:"FEED",
    //   redirectTargetId:106,
    //   title:"댓글 알림",
    //   body:"나의 피드에 누가 댓글을 달았습니다.",
    //   createdAt:"몇년몇월며칠",
    //   isRead:false
    // },
    // {
    //   notificationId:7,
    //   notificationType:"CREATE_FEED_COMMENT",
    //   targetEntity:"FEED",
    //   redirectTargetId:1,
    //   title:"피드 알림",
    //   body:"나의 피드에 누가 대댓글을 달았습니다.나의 피드에 누가 대댓글을 달았습니다.나의 피드에 누가 대댓글을 달았습니다.나의 피드에 누가 대댓글을 달았습니다.",
    //   createdAt:"몇년몇월며칠",
    //   isRead:false
    // }
  ]);

  useFocusEffect(
    useCallback(() => {
      const getNotis = async () => {
        try {
          const response = await axios.get(
            `${Config.API_URL}/notifications/accounts/me`,
          );
          // console.log(response.data.data);
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

  useEffect(() => {
    const temp = [...notisData];

    for (let i = 0; i < temp.length; i++) {
      if (temp[i].isClicked === false) {
        setIsNotClicked(true);
        return;
      } else {
        setIsNotClicked(false);
      }
    }
  }, [notisData]);

  const refreshNoti = async () => {
    try {
      const response = await axios.get(
        `${Config.API_URL}/notifications/accounts/me`,
      );
      // console.log(response.data.data);
      if (response.data.data.content.length == 0) setNoNotis(true);
      else {
        setIsLast(response.data.data.last);
        setNotisData(response.data.data.content);
        // console.log(response.data.data)
        if (response.data.data.content.length != 0) {
          setCursorId(
            response.data.data.content[response.data.data.content.length - 1]
              .notificationId,
          );
        }
      }
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse?.data.status);
      if (errorResponse?.data.status == 500) {
        dispatch(
          userSlice.actions.setToken({
            accessToken: '',
          }),
        );
      }
    }
    setRefresh(false);
  };

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

  const deleteNotis = async (
    notificationId: number,
    friendshipRequestId: any = null,
  ) => {
    // when delete friend request
    if (friendshipRequestId != null) {
      try {
        const response = await axios.post(
          `${Config.API_URL}/friendships/request/${friendshipRequestId}/reject`,
        );

        console.log(response.data);
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse.data);
      }
    }

    try {
      const response = await axios.delete(
        `${Config.API_URL}/notifications/${notificationId}`,
      );
      // console.log(response.data.data)
      refreshNoti();
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  const approveFriendship = async (
    friendshipRequestId: number,
    accountId: number,
    name: string,
    notificationId: number,
  ) => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/friendships/request/${friendshipRequestId}/approval`,
      );
      console.log(response.data);
      setPopupName(name);
      setPopup('getFriend');
      // setShowProfileModal(accountId);

      deleteNotis(notificationId);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  const writeKnock = async (notificationId: number) => {
    try {
      navigation.navigate('FeedList', {isKnock: true});
      deleteNotis(notificationId);
    } catch (error) {
      console.log(error);
    }
  };

  const goToFeed = (feedId: number) => {
    navigation.navigate('FeedDetail', {feedId: feedId});
  };

  // const getFriendMsg = useCallback(
  //   (friendshipRequestId: number) => {
  //     const getMSG = async () => {
  //       try {
  //         const response = await axios.get(
  //           `${Config.API_URL}/friendships/request/${friendshipRequestId}/message`,
  //         );
  //         setFriendMsg(response.data.data.message);
  //         setShowModal(true);
  //       } catch (error) {
  //         const errorResponse = (error as AxiosError<{message: string}>)
  //           .response;
  //         console.log(errorResponse.data);
  //       }
  //     };
  //     getMSG();
  //   },
  //   [friendMsg],
  // );

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

  const deleteFriends = async () => {
    try {
      console.log(deleteFriend);
      const response = await axios.delete(
        `${Config.API_URL}/friendships/${deleteFriend}`,
      );
      // console.log(response.data)
      // popup: 이도님께 친구 요청을 보냈어요!
      setPopup('deletedFriend');
      // setPopupName(name);
      setDeleteFriend(-1);
      setRefresh(!refresh);
      console.log(response.data);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  const notiNavigation = async (
    notificationType: string,
    redirectTargetId: number,
    notificationId: number,
    accountId: number,
  ) => {
    if (notificationType.includes('FEED')) {
      if (await isDeleted(redirectTargetId)) {
        setPopup('deleted');
        deleteNotis(notificationId);
      } else {
        goToFeed(redirectTargetId);
      }
    } else if (notificationType == 'APPROVE_FRIENDSHIP_REQUEST') {
      setShowProfileModal(accountId);
    } else if (notificationType == 'CREATE_FRIENDSHIP_REQUEST') {
      setShowProfileModal(accountId);
    } else if (notificationType == 'SEND_KNOCK') {
      navigation.navigate('FeedList');
    } else if (notificationType == 'REACT_EMOTICON_ON_COMMENT') {
      goToFeed(redirectTargetId);
    } else if (notificationType == 'CREATE_KNOCK_FEED') {
      goToFeed(redirectTargetId);
    }
  };

  const noticeClicked = async (index: number, notificationId: number) => {
    // change isClicked of front
    const temp = [...notisData];
    temp[index].isClicked = true;
    setNotisData(temp);

    // call api for check is clicked
    try {
      await axios.put(
        `${Config.API_URL}/notifications/${notificationId}/click`,
      );
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  const isClickedAll = async () => {
    const temp = [...notisData];
    for (var i = 0; i < temp.length; i++) {
      temp[i].isClicked = true;
    }
    setNotisData(temp);

    // call api for check is clicked
    try {
      await axios.put(`${Config.API_URL}/notifications/click`);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
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
      {/* {console.log(notisData)} */}
      {!noNotis && (
        <FlatList
          data={notisData}
          style={styles.notisEntire}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          refreshing={refresh}
          onRefresh={refreshNoti}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={refreshNoti}
              tintColor="#F0F0F0"
            />
          }
          ListHeaderComponent={
            isNotClicked ? (
              <View style={styles.notisHeader}>
                <AnimatedButton
                  onPress={() => {
                    // console.log('SDSDS');
                    isClickedAll();
                    setIsNotClicked(false);
                  }}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                  }}>
                  <Text style={styles.notisHeaderTxt}>
                    전체 읽음으로 표시하기
                  </Text>
                </AnimatedButton>
              </View>
            ) : null
          }
          renderItem={({item, index}: itemProps) => {
            return (
              <Pressable
                style={
                  item.isClicked === false
                    ? styles.eachNotis_notRead
                    : styles.eachNotis
                }
                onPress={async () => {
                  noticeClicked(index, item.notificationId);

                  notiNavigation(
                    item.notificationType,
                    item.redirectTargetId,
                    item.notificationId,
                    item.accountId,
                  );
                }}>
                <View style={styles.notisView}>
                  {!item.notificationType.includes('MESSAGE') && (
                    <Pressable
                      style={styles.notisProfile}
                      onPress={() => {
                        // navigation.navigate('Profile', {
                        //   whose: 1,
                        //   accountId: item.accountId,
                        // });
                        setShowProfileModal(item.accountId);
                      }}>
                      {item.profileImageUrl == null ? (
                        <SvgXml
                          width={32}
                          height={32}
                          xml={svgXml.profile.null}
                        />
                      ) : (
                        <Image
                          style={styles.prifileImage}
                          source={{uri: item.profileImageUrl}}
                          resizeMode="contain"
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
                      }
                      ellipsizeMode="tail"
                      numberOfLines={2}>
                      {item.content
                        .replace('\n', '')
                        .replace('""', '내가 올린 이미지')}
                    </Text>
                  </View>
                </View>
                {
                  item.notificationType === 'CREATE_FRIENDSHIP_REQUEST' ? (
                    <Pressable
                      style={styles.notisCheckBtn}
                      onPress={() => {
                        approveFriendship(
                          item.redirectTargetId,
                          item.accountId,
                          item.friendNickname,
                          item.notificationId,
                        );
                        // getFriendMsg(item.redirectTargetId);
                        // setmodalData(item.content);
                        // setmodalDataId(item.redirectTargetId);
                      }}>
                      <Text style={styles.notisCheckBtnTxt}>수락하기</Text>
                    </Pressable>
                  ) : item.notificationType === 'SEND_KNOCK' ? (
                    <Pressable
                      style={styles.notisCheckBtn}
                      onPress={() => {
                        writeKnock(item.notificationId);
                      }}>
                      <Text style={styles.notisCheckBtnTxt}>글쓰기</Text>
                    </Pressable>
                  ) : null // </Pressable> //   <Text style={styles.notisCheckBtnTxt}>글쓰기</Text> //   }}> //     console.log('글쓰기'); //   onPress={() => { //   style={styles.notisCheckBtn} // <Pressable
                }
                <Pressable
                  style={styles.xBtn}
                  onPress={() => {
                    if (item.notificationType === 'CREATE_FRIENDSHIP_REQUEST') {
                      deleteNotis(item.notificationId, item.redirectTargetId);
                    } else {
                      deleteNotis(item.notificationId);
                    }
                  }}>
                  <SvgXml width={24} height={24} xml={svgXml.icon.notisX} />
                </Pressable>
              </Pressable>
            );
          }}
        />
      )}
      <FriendProfileModal
        showWhoseModal={showProfileModal}
        setShowWhoseModal={setShowProfileModal}
      />

      {/* <Modal
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
      </Modal> */}
      {popup == 'deleted' && (
        <ToastScreen
          height={21}
          marginBottom={48}
          onClose={() => setPopup('')}
          message={`삭제된 글이에요.`}
        />
      )}
      {popup == 'getFriend' && (
        <ToastScreen
          height={21}
          marginBottom={48}
          onClose={() => setPopup('')}
          message={`${popupName}님과 친구가 되었어요.`}
        />
      )}
      {popup === 'deletedFriend' && (
        <ToastScreen
          height={21}
          marginBottom={48}
          onClose={() => setPopup('')}
          message="친구를 삭제했어요."
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#202020',
  },
  notisHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingRight: 16,
    height: 32,
    backgroundColor: '#333333',
  },
  notisHeaderTxt: {
    textAlign: 'center',
    color: '#F0F0F0',
    fontWeight: '500',
    fontSize: 13,
    textDecorationLine: 'underline',
    paddingBottom: 1,
    // marginRight: 3,
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
    minHeight: 56,
    backgroundColor: '#202020',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  eachNotis_notRead: {
    width: '100%',
    flexDirection: 'row',
    flex: 1,
    minHeight: 56,
    backgroundColor: 'rgba(165, 95, 255, 0.3)',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  notisView: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red',
    flex: 1,
  },
  notisProfile: {
    marginVertical: 12,
    marginRight: 10,
  },
  notisTextView: {
    flex: 1,
    justifyContent: 'center',
    flexShrink: 1,
    paddingVertical: 11,
    // backgroundColor: 'red',
  },
  notisText: {
    // backgroundColor: 'blue',
    color: '#F0F0F0',
    fontWeight: '400',
    fontSize: 15,
    textAlignVertical: 'center',
  },
  notisCheckBtn: {
    width: 84,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A55FFF',
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
    marginLeft: 4,
    // backgroundColor: 'red',
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
    backgroundColor: '#333333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  modalTitleTxt: {
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalContentTxt: {
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 10,
    marginTop: 10,
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
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
    marginTop: 16,
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 13,
    backgroundColor: '#A55FFF',
  },
  btnGray: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 13,
    backgroundColor: '#888888',
  },
  btnTxt: {
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '600',
  },
  prifileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
