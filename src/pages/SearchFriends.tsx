/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import axios, {AxiosError} from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import Clipboard from '@react-native-clipboard/clipboard';
import {useAppDispatch} from '../store';
import ToastScreen from '../components/ToastScreen';
import Modal from 'react-native-modal';
import {SvgXml} from 'react-native-svg';
import _ from 'lodash';
import {throttleTime} from '../hooks/Throttle';
import {svgXml} from '../../assets/image/svgXml';
import userSlice from '../slices/user';
import FriendProfileModal from '../components/FriendProfileModal';
import {Dimensions} from 'react-native';
import ImageModal from 'react-native-image-modal';
import {useNavigation} from '@react-navigation/native';
import StatucIcon from '../components/StatusIcon';

type friendListItemProps = {
  item: {
    accountId: number;
    nickname: string;
    friendshipId: number;
    status: string;
    profileImageUrl: string | null;
  };
};

export default function SearchFriends() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const [myCode, setMyCode] = useState('');
  const [myName, setMyName] = useState('');
  const [myStatus, setMyStatus] = useState('');
  const [myProfileImg, setMyProfileImg] = useState<string | null>('');
  const [placeholder, setPlaceholder] = useState('아이디로 친구 찾기');
  const [searchCode, setSearchCode] = useState('');
  // const [message, setMessage] = useState('');
  // const [otherUser, setOtherUser] = useState({
  //   accountId: -1,
  //   nickname: '',
  //   isFriend: 0,
  // });
  const [reset, setReset] = useState(false);
  // const [friendData, setFriendData] = useState([{accountId:-1, friendshipId:-1, friendNickname:'',status:''}]);
  const [friendData, setFriendData] = useState<any[]>([
    //   {
    //   accountId: response.data.data.accountId,
    //   friendNickname: response.data.data.nickname,
    //   friendshipId: 0,
    //   status: response.data.data.status,
    //   profileImageUrl: response.data.data.profileImageUrl,
    // }
  ]);
  const [isLast, setIsLast] = useState(false);
  const [cursorId, setCursorId] = useState(0);
  const [loading, setLoading] = useState(false);

  const [whichPopup, setWhichPopup] = useState('');
  const [popupName, setPopupName] = useState('');
  const token = useSelector((state: RootState) => state.user.accessToken);
  const inp = useRef(null);

  const [showWhoseModal, setShowWhoseModal] = useState(0);
  const [deleteFriend, setDeleteFriend] = useState(-1);

  useEffect(() => {
    const getMyCode = async () => {
      try {
        const response = await axios.get(`${Config.API_URL}/friendships`);
        setMyCode(response.data.data.code);
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse.data);
        if (errorResponse?.data.status == 500) {
          dispatch(
            userSlice.actions.setToken({
              accessToken: '',
            }),
          );
        }
      }
    };
    getMyCode();
    getFriendProfile();
    const getMyProfile = async () => {
      try {
        const response = await axios.get(`${Config.API_URL}/accounts/me`);
        setMyName(response.data.data.nickname);
        setMyStatus(response.data.data.status);
        setMyProfileImg(response.data.data.profileImageUrl);
        // console.log('내 프로필 조회')
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse?.data);
        if (errorResponse?.data.status == 500) {
          dispatch(
            userSlice.actions.setToken({
              accessToken: '',
            }),
          );
        }
      }
    };
    getMyProfile();
  }, [isLast, reset]);

  useEffect(() => {
    getFriendProfile();
  }, [showWhoseModal]);

  const getFriendProfile = async () => {
    // if (searchCode == '') return;
    try {
      const response = await axios.get(
        `${Config.API_URL}/accounts/search?keyword=${searchCode}`,
      );
      console.log(response.data.data.equalKeywordAccount);
      console.log(response.data.data.containKeywordAccounts);
      // let friendData;
      setIsLast(response.data.data.containKeywordAccounts.content.last);
      // console.log(response.data.data);
      if (response.data.data.containKeywordAccounts.content.length == 0) {
        if (response.data.data.equalKeywordAccount == null) {
          // 존재하지 않는 아이디 (즉 일치하는 계정 없음)
          if (searchCode != '') setWhichPopup('noCode');
        } else {
          if (
            response.data.data.equalKeywordAccount.friendshipRelation == 'me'
          ) {
            // 나
            setFriendData([]);
            setWhichPopup('Me');
          } else if (
            response.data.data.equalKeywordAccount.friendshipRelation == 'true'
          ) {
            // 친구
            setFriendData([
              {
                accountId: response.data.data.equalKeywordAccount.accountId,
                nickname: response.data.data.equalKeywordAccount.nickname,
                friendshipId:
                  response.data.data.equalKeywordAccount.friendshipId,
                status: response.data.data.equalKeywordAccount.status,
                profileImageUrl:
                  response.data.data.equalKeywordAccount.profileImageUrl,
              },
            ]);
          } else if (
            response.data.data.equalKeywordAccount.friendshipRelation ==
            'waiting'
          ) {
            // 친구 요청 함
            setFriendData([
              {
                accountId: response.data.data.equalKeywordAccount.accountId,
                nickname: response.data.data.equalKeywordAccount.nickname,
                friendshipId: -2,
                status: '',
                profileImageUrl:
                  response.data.data.equalKeywordAccount.profileImageUrl,
              },
            ]);
          } else if (
            response.data.data.equalKeywordAccount.friendshipRelation ==
            'request'
          ) {
            // 친구 요청 받음
            setFriendData([
              {
                accountId: response.data.data.equalKeywordAccount.accountId,
                nickname: response.data.data.equalKeywordAccount.nickname,
                friendshipId: -3,
                status: '',
                profileImageUrl:
                  response.data.data.equalKeywordAccount.profileImageUrl,
              },
            ]);
          } else {
            // 모르는 사람
            setFriendData([
              {
                accountId: response.data.data.equalKeywordAccount.accountId,
                nickname: response.data.data.equalKeywordAccount.nickname,
                friendshipId: -1,
                status: '',
                profileImageUrl:
                  response.data.data.equalKeywordAccount.profileImageUrl,
              },
            ]);
          }
        }
      } else {
        if (
          response.data.data.equalKeywordAccount != null &&
          response.data.data.equalKeywordAccount.friendshipRelation != 'me'
        ) {
          // 맨앞에 추가
          if (
            response.data.data.equalKeywordAccount.friendshipRelation == 'true'
          ) {
            setFriendData(
              [
                {
                  accountId: response.data.data.equalKeywordAccount.accountId,
                  nickname: response.data.data.equalKeywordAccount.nickname,
                  friendshipId:
                    response.data.data.equalKeywordAccount.friendshipId,
                  status: response.data.data.equalKeywordAccount.status,
                  profileImageUrl:
                    response.data.data.equalKeywordAccount.profileImageUrl,
                },
              ].concat(response.data.data.containKeywordAccounts.content),
            );
          } else if (
            response.data.data.equalKeywordAccount.friendshipRelation ==
            'request'
          ) {
            setFriendData(
              [
                {
                  accountId: response.data.data.equalKeywordAccount.accountId,
                  nickname: response.data.data.equalKeywordAccount.nickname,
                  friendshipId: -3,
                  status: response.data.data.equalKeywordAccount.status,
                  profileImageUrl:
                    response.data.data.equalKeywordAccount.profileImageUrl,
                },
              ].concat(response.data.data.containKeywordAccounts.content),
            );
          } else if (
            response.data.data.equalKeywordAccount.friendshipRelation ==
            'waiting'
          ) {
            setFriendData(
              [
                {
                  accountId: response.data.data.equalKeywordAccount.accountId,
                  nickname: response.data.data.equalKeywordAccount.nickname,
                  friendshipId: -2,
                  status: response.data.data.equalKeywordAccount.status,
                  profileImageUrl:
                    response.data.data.equalKeywordAccount.profileImageUrl,
                },
              ].concat(response.data.data.containKeywordAccounts.content),
            );
          } else {
            setFriendData(
              [
                {
                  accountId: response.data.data.equalKeywordAccount.accountId,
                  nickname: response.data.data.equalKeywordAccount.nickname,
                  friendshipId: -1,
                  status: response.data.data.equalKeywordAccount.status,
                  profileImageUrl:
                    response.data.data.equalKeywordAccount.profileImageUrl,
                },
              ].concat(response.data.data.containKeywordAccounts.content),
            );
          }
        } else {
          // 그냥 넣기
          setFriendData(response.data.data.containKeywordAccounts.content);
        }
        setCursorId(
          response.data.data.containKeywordAccounts.content[
            response.data.data.containKeywordAccounts.content.length - 1
          ].friendshipId,
        );
      }
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      if (errorResponse?.data.statusCode == 2030) {
        // popup: 존재하지 않는 코드예요.
        setWhichPopup('noCode');
      }
    }
  };
  const askFriend = _.throttle(
    async (accountId: number, name: string, profileImageUrl: string) => {
      try {
        const response = await axios.post(
          `${Config.API_URL}/friendships/request`,
          {
            accountTargetId: accountId,
            message: '',
          },
        );
        // console.log(response.data)
        // popup: 이도님께 친구 요청을 보냈어요!
        setWhichPopup('send');
        setPopupName(name);
        getFriendProfile();
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse.data);
        // if (errorResponse?.data.statusCode == 1000) {
        //   // if (await refreshOrNot()) setReset(!reset);
        // }
        // if (errorResponse?.data.statusCode == 3010) {
        //   setWhichPopup('requested');
        //   setOtherUser({accountId:-1, nickname:'', isFriend:0});
        //   setMessage('');
        // }
      }
    },
    throttleTime,
  );

  const getData = async () => {
    if (!isLast) {
      setLoading(true);
      try {
        const response = await axios.get(
          `${Config.API_URL}/accounts/search?keyword=${searchCode}?cursorId=${cursorId}`,
        );
        setIsLast(response.data.data.containKeywordAccounts.last);
        setFriendData(
          friendData.concat(response.data.data.containKeywordAccounts.content),
        );
        if (response.data.data.containKeywordAccounts.content.length != 0) {
          setCursorId(
            response.data.data.containKeywordAccounts.content[
              response.data.data.containKeywordAccounts.content.length - 1
            ].friendshipId,
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
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
    setReset(!reset);
    setSearchCode('');
  };

  const deleteFriends = async () => {
    try {
      console.log(deleteFriend);
      const response = await axios.delete(
        `${Config.API_URL}/friendships/${deleteFriend}`,
      );
      // console.log(response.data)
      // popup: 이도님께 친구 요청을 보냈어요!
      setWhichPopup('deleted');
      // setPopupName(name);
      setDeleteFriend(-1);
      setReset(!reset);
      console.log(response.data);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };
  const statusSize = 38;

  return (
    <Pressable style={styles.entire} onPress={Keyboard.dismiss}>
      <FlatList
        data={[
          {
            accountId: 0,
            nickname: myName,
            friendshipId: 0,
            status: myStatus,
            profileImageUrl: myProfileImg,
          },
        ].concat(friendData)}
        style={styles.friendList}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View style={{}}>
            <View style={styles.searchView}>
              <TextInput
                placeholder={placeholder}
                style={styles.codeSearch}
                onFocus={() => setPlaceholder('')}
                onBlur={() => setPlaceholder('아이디로 친구 찾기')}
                onChangeText={(text: string) => {
                  setSearchCode(text);
                }}
                blurOnSubmit={true}
                maxLength={12}
                value={searchCode}
                onSubmitEditing={getFriendProfile}
                placeholderTextColor={'#888888'}
              />
              {(!placeholder || searchCode) && (
                <Pressable
                  onPress={() => {
                    setSearchCode('');
                    setReset(!reset);
                  }}
                  style={styles.clearBtn}>
                  <SvgXml width={20} height={20} xml={svgXml.icon.textInputX} />
                </Pressable>
              )}
            </View>
            <View style={styles.myCodeView}>
              <Pressable
                style={styles.myCodeBtn}
                onPress={() => Clipboard.setString(myCode)}>
                <Text style={styles.myCodeTxt}>내 아이디: {myCode}</Text>
                <SvgXml
                  width="15"
                  height="15"
                  xml={svgXml.icon.copyIcon}
                  style={styles.copyIcon}
                />
              </Pressable>
            </View>
          </View>
        }
        keyExtractor={(item, index) => index}
        // numColumns={2}
        renderItem={({item}: friendListItemProps) => {
          if (item.friendshipId == 0)
            // eslint-disable-next-line curly
            return (
              <Pressable
                style={[
                  styles.friendView,
                  {width: Dimensions.get('window').width - 32},
                ]}
                onPress={() => {
                  navigation.navigate('MyProfile');
                  // console.log(myStatus)
                }}>
                <Pressable style={styles.friendProfileImg}>
                  {item.profileImageUrl == null ? (
                    <SvgXml width={32} height={32} xml={svgXml.profile.null} />
                  ) : (
                    <Image
                      source={{uri: item.profileImageUrl}}
                      style={{width: 32, height: 32, borderRadius: 16}}
                    />
                  )}
                </Pressable>
                <View style={styles.friendmiddle}>
                  <Text style={styles.friendName}>{item.nickname}</Text>
                </View>
                <View style={styles.friendProfileStatus}>
                  <StatucIcon time="1시간" status={item.status.toLowerCase()} />
                </View>
              </Pressable>
            );
          if (item.friendshipId == -1) {
            return (
              <Pressable
                style={[
                  styles.friendView,
                  {width: Dimensions.get('window').width - 32},
                ]}
                onPress={() => {
                  setShowWhoseModal(item.accountId);
                }}>
                <Pressable style={styles.friendProfileImg}>
                  {item.profileImageUrl == null ? (
                    <SvgXml width={32} height={32} xml={svgXml.profile.null} />
                  ) : (
                    <Image
                      source={{uri: item.profileImageUrl}}
                      style={{width: 32, height: 32, borderRadius: 16}}
                    />
                  )}
                </Pressable>
                <View style={styles.friendmiddle}>
                  <Text style={styles.friendName}>{item.nickname}</Text>
                </View>
                <Pressable
                  style={styles.nonFriendProfileStatus}
                  onPress={() => {
                    askFriend(
                      item.accountId,
                      item.nickname,
                      item.profileImageUrl,
                    );
                  }}>
                  <SvgXml width={24} height={24} xml={svgXml.icon.addfriend} />
                </Pressable>
              </Pressable>
            );
          }
          if (item.friendshipId == -2)
            // eslint-disable-next-line curly
            return (
              <Pressable
                style={[
                  styles.friendView,
                  {width: Dimensions.get('window').width - 32},
                ]}
                onPress={() => {
                  setShowWhoseModal(item.accountId);
                }}>
                <Pressable style={styles.friendProfileImg}>
                  {item.profileImageUrl == null ? (
                    <SvgXml width={32} height={32} xml={svgXml.profile.null} />
                  ) : (
                    <Image
                      source={{uri: item.profileImageUrl}}
                      style={{width: 32, height: 32, borderRadius: 16}}
                    />
                  )}
                </Pressable>
                <View style={styles.friendmiddle}>
                  <Text style={styles.friendName}>{item.nickname}</Text>
                </View>
                <Pressable style={styles.waitingFriendProfileStatus}>
                  <SvgXml width={24} height={24} xml={svgXml.icon.sendfriend} />
                </Pressable>
              </Pressable>
            );
          if (item.friendshipId == -3)
            return (
              <Pressable
                style={[
                  styles.friendView,
                  {width: Dimensions.get('window').width - 32},
                ]}
                onPress={() => {
                  setShowWhoseModal(item.accountId);
                }}>
                <Pressable style={styles.friendProfileImg}>
                  {item.profileImageUrl == null ? (
                    <SvgXml width={32} height={32} xml={svgXml.profile.null} />
                  ) : (
                    <Image
                      source={{uri: item.profileImageUrl}}
                      style={{width: 32, height: 32, borderRadius: 16}}
                    />
                  )}
                </Pressable>
                <View style={styles.friendmiddle}>
                  <Text style={styles.friendName}>{item.nickname}</Text>
                </View>
                <Pressable style={styles.requestFriendProfileStatus}>
                  <SvgXml
                    width={24}
                    height={24}
                    xml={svgXml.icon.requestfriend}
                  />
                </Pressable>
              </Pressable>
            );
          return (
            <Pressable
              style={[
                styles.friendView,
                {width: Dimensions.get('window').width - 32},
              ]}
              onPress={() => {
                setShowWhoseModal(item.accountId);
              }}>
              <View style={styles.friendProfileImg}>
                {item.profileImageUrl == null ? (
                  <SvgXml width={32} height={32} xml={svgXml.profile.null} />
                ) : (
                  <ImageModal
                    swipeToDismiss={true}
                    // resizeMode="contain"
                    resizeMode="cover"
                    modalImageResizeMode="contain"
                    imageBackgroundColor="transparent"
                    overlayBackgroundColor="rgba(32, 32, 32, 0.9)"
                    style={{width: 32, height: 32, borderRadius: 16}}
                    source={{
                      uri: item.profileImageUrl,
                    }}
                  />
                  //   <Image
                  //   style={{width: 32, height: 32, borderRadius: 16}}
                  //   source={{
                  //     uri: item.profileImageUrl,
                  //   }}
                  // />
                )}
              </View>
              <View style={styles.friendmiddle}>
                <Text style={styles.friendName}>{item.nickname}</Text>
              </View>
              <View style={styles.friendProfileStatus}>
                <StatucIcon time="1시간" status={item.status.toLowerCase()} />
              </View>
              {/* <Pressable style={styles.deleteBtn}>
                <Text style={styles.deleteBtnTxt}>삭제</Text>
              </Pressable> */}
            </Pressable>
          );
        }}
      />
      <FriendProfileModal
        showWhoseModal={showWhoseModal}
        setShowWhoseModal={setShowWhoseModal}
      />

      {/* <Modal
        onBackButtonPress={() =>
          setOtherUser({accountId: -1, nickname: '', isFriend: 0})
        }
        isVisible={!!otherUser.nickname}
        avoidKeyboard={true}
        backdropColor="#222222"
        backdropOpacity={0.5}
        onModalShow={() => {
          inp.current?.blur();
          inp.current?.focus();
        }}>
        {otherUser.isFriend == 2 && (
          <Pressable
            style={styles.modalBGView}
            onPress={() => {
              Keyboard.dismiss();
              setOtherUser({accountId: -1, nickname: '', isFriend: 0});
            }}>
            <Pressable
              onPress={e => e.stopPropagation()}
              style={styles.modalView}>
              <View>
                <Text style={styles.searchViewName}>{otherUser.nickname}</Text>
                <Text style={styles.searchViewExplain}>
                  친구가 나를 알아볼 수 있도록 인사를 건네주세요!
                </Text>
                <TextInput
                  ref={inp}
                  style={styles.commentInput}
                  value={message}
                  placeholder="우리 친구해요!"
                  placeholderTextColor={'#848484'}
                  onChangeText={(text: string) => setMessage(text)}
                />
              </View>
              <View style={styles.btnView}>
                <Pressable
                  style={styles.searchViewCloseBtn}
                  onPress={() =>
                    setOtherUser({accountId: -1, nickname: '', isFriend: 0})
                  }>
                  <Text style={styles.searchViewCloseTxt}>닫기</Text>
                </Pressable>
                <Pressable
                  style={styles.searchViewAskFriendBtn}
                  onPress={() => {
                    askFriend();
                  }}>
                  <Text style={styles.searchViewAskFriendTxt}>
                    친구 요청 보내기
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        )}
        {otherUser.isFriend == 1 && (
          <Pressable
            style={styles.modalBGView}
            onPress={() => {
              Keyboard.dismiss();
              setOtherUser({accountId: -1, nickname: '', isFriend: 0});
            }}>
            <Pressable
              onPress={e => e.stopPropagation()}
              style={styles.modalView}>
              <View>
                <Text style={styles.searchViewName}>{otherUser.nickname}</Text>
                <Text style={styles.searchViewExplain}>
                  이미 나와 친구 사이네요!
                </Text>
              </View>
              <View style={styles.btnViewFriend}>
                <Pressable
                  style={styles.searchViewCloseBtnFriend}
                  onPress={() =>
                    setOtherUser({accountId: -1, nickname: '', isFriend: 0})
                  }>
                  <Text style={styles.searchViewAskFriendTxt}>닫기</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        )}
      </Modal> */}
      {whichPopup === 'noCode' && (
        <ToastScreen
          height={21}
          marginBottom={48}
          onClose={() => setWhichPopup('')}
          message="존재하지 않는 아이디예요."
        />
      )}
      {whichPopup === 'send' && (
        <ToastScreen
          height={21}
          marginBottom={48}
          onClose={() => {
            setWhichPopup('');
            setPopupName('');
          }}
          message={`${popupName}님에게 친구 요청을 보냈어요!`}
        />
      )}
      {whichPopup === 'Me' && (
        <ToastScreen
          height={21}
          marginBottom={48}
          onClose={() => setWhichPopup('')}
          message="나는 나의 영원한 친구입니다!"
        />
      )}
      {whichPopup === 'requested' && (
        <ToastScreen
          height={21}
          marginBottom={48}
          onClose={() => setWhichPopup('')}
          message="이미 친구 요청을 보냈어요!"
        />
      )}
      {whichPopup === 'deleted' && (
        <ToastScreen
          height={21}
          marginBottom={48}
          onClose={() => setWhichPopup('')}
          message="친구를 삭제했어요."
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#202020',
  },
  nonempty: {
    flex: 4,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  empty: {
    flex: 3,
  },
  searchView: {
    width: '100%',
    flexDirection: 'row',
  },
  clearBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  codeSearch: {
    fontSize: 15,
    fontWeight: '400',
    color: '#F0F0F0',
    backgroundColor: '#333333',
    borderRadius: 10,
    width: '100%',
    height: 40,
    paddingLeft: 10,
    marginBottom: 17,
  },
  myCodeView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  myCodeTxt: {
    color: '#848484',
    fontSize: 13,
    fontWeight: '500',
  },
  myCodeBtn: {
    flexDirection: 'row',
  },
  copyIcon: {
    marginLeft: 4,
    height: 14,
    top: 1,
  },
  friendList: {
    flex: 1,
    width: '100%',
    // backgroundColor: 'blue',
  },
  friendView: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#333333',
    borderRadius: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  friendProfileImg: {
    marginVertical: 7,
  },
  friendmiddle: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 8,
  },
  friendProfileStatus: {
    marginVertical: 7,
  },
  nonFriendProfileStatus: {
    marginVertical: 7,
    backgroundColor: '#A55FFF',
    width: 40,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitingFriendProfileStatus: {
    marginVertical: 7,
    backgroundColor: '#888888',
    width: 40,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestFriendProfileStatus: {
    marginVertical: 7,
    backgroundColor: '#A55FFF',
    width: 40,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendName: {
    color: '#F0F0F0',
    fontWeight: '600',
    fontSize: 15,
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
  commentInput: {
    backgroundColor: '#F7F7F7',
    height: 56,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: '#222222',
    fontSize: 15,
    fontWeight: '400',
  },
  searchViewName: {
    color: '#222222',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 30,
  },
  searchViewExplain: {
    color: '#848484',
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 12,
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
    marginTop: 16,
  },
  btnViewFriend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  searchViewCloseBtn: {
    borderWidth: 1,
    borderColor: '#FFB443',
    borderRadius: 10,
    flex: 92,
    marginRight: 10,
    height: 44,
    justifyContent: 'center',
  },
  searchViewCloseTxt: {
    color: '#FFB443',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  searchViewAskFriendBtn: {
    backgroundColor: '#FFB443',
    borderWidth: 1,
    borderColor: '#FFB443',
    borderRadius: 10,
    flex: 169,
    height: 44,
    justifyContent: 'center',
  },
  searchViewAskFriendTxt: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  searchViewCloseBtnFriend: {
    backgroundColor: '#FFB443',
    borderWidth: 1,
    borderColor: '#FFB443',
    borderRadius: 10,
    height: 44,
    // flex:1,
    width: 120,
    justifyContent: 'center',
  },
});
