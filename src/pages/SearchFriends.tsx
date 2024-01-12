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

type friendListItemProps = {
  item: {
    accountId: number;
    friendNickname: string;
    friendshipId: number;
    status: string;
    profileImageUrl: string;
  };
};

export default function SearchFriends() {
  const dispatch = useAppDispatch();

  const [myCode, setMyCode] = useState('');
  const [placeholder, setPlaceholder] = useState('이름, 아이디로 친구 찾기');
  const [searchCode, setSearchCode] = useState('');
  const [message, setMessage] = useState('');
  const [otherUser, setOtherUser] = useState({
    accountId: -1,
    nickname: '',
    isFriend: 0,
  });
  const [reset, setReset] = useState(false);
  // const [friendData, setFriendData] = useState([{accountId:-1, friendshipId:-1, friendNickname:'',status:''}]);
  const [friendData, setFriendData] = useState<any[]>([]);
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
    const getFriendship = async () => {
      try {
        const response = await axios.get(
          `${Config.API_URL}/friendships/manage`,
        );
        setIsLast(response.data.data.last);
        console.log(response.data.data)
        if (response.data.data.content.length == 0) setFriendData([]);
        else {
          setFriendData(response.data.data.content);
          // console.log(response.data.data.content)
          setCursorId(
            response.data.data.content[response.data.data.content.length - 1]
              .friendshipId,
          );
        }
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
    getFriendship();
  }, [isLast, reset]);

  const getFriendProfile = _.throttle(async () => {
    try {
      const response = await axios.get(
        `${Config.API_URL}/accounts/search/code/${searchCode}`,
      );
      // let friendData;
      if (response.data.data.friendshipRelation === 'me') {
        setWhichPopup('Me');
        setOtherUser({accountId: -1, nickname: '', isFriend: 0});
      }
      else {
        if (response.data.data.friendshipRelation == "true") {
          // setFriendData([])
        } else if (response.data.data.friendshipRelation == "waiting") {
          setFriendData([{
            accountId:response.data.data.accountId,
            friendNickname:response.data.data.nickname,
            friendshipId:-2,
            status:"",
            profileImageUrl:response.data.data.profileImageUrl
          }]);
        } else {
          setFriendData([{
            accountId:response.data.data.accountId,
            friendNickname:response.data.data.nickname,
            friendshipId:-1,
            status:"",
            profileImageUrl:response.data.data.profileImageUrl
          }]);
        }
        
        console.log(response.data.data);
      }
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      if (errorResponse?.data.statusCode == 2030) {
        // popup: 존재하지 않는 코드예요.
        setWhichPopup('noCode');
      }
    }
  }, throttleTime);
  const askFriend = _.throttle(async (accountId:number, name:string, profileImageUrl:string) => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/friendships/request`,
        {
          accountTargetId: accountId,
          message: "",
        },
      );
      // console.log(response.data)
      // popup: 이도님께 친구 요청을 보냈어요!
      setWhichPopup('send');
      setPopupName(name);
      setFriendData([{
        accountId:accountId,
        friendNickname:name,
        friendshipId:-2,
        status:"",
        profileImageUrl:profileImageUrl,
      }]);
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
  }, throttleTime);
  const getData = async () => {
    if (!isLast) {
      setLoading(true);
      try {
        const response = await axios.get(
          `${Config.API_URL}/friendships/manage?cursorId=${cursorId}`,
        );
        setIsLast(response.data.data.last);
        setFriendData(friendData.concat(response.data.data.content));
        if (response.data.data.content.length != 0) {
          setCursorId(
            response.data.data.content[response.data.data.content.length - 1]
              .friendshipId,
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
    setReset(!reset)
  };

  const deleteFriends = async () => {
    try {
      console.log(deleteFriend)
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
  }

  return (
    <Pressable style={styles.entire} onPress={Keyboard.dismiss}>
      <FlatList
        data={friendData}
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
                onBlur={() => setPlaceholder('이름, 아이디로 친구 찾기')}
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
                  onPress={() => setSearchCode('')}
                  style={styles.clearBtn}>
                  <SvgXml 
                    width={20}
                    height={20}
                    xml={svgXml.icon.textInputX}
                  />
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
        numColumns={2}
        renderItem={({item}: friendListItemProps) => {
          if (item.friendshipId == -1) return (
            <Pressable
              style={[
                styles.friendView,
                {width: (Dimensions.get('window').width - 40) / 2},
              ]}
              onPress={() => {
                setShowWhoseModal(item.accountId);
              }}>
              <Pressable
                style={styles.friendProfileImg}>
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
                <Text style={styles.friendName}>{item.friendNickname}</Text>
              </View>
              <Pressable style={styles.nonFriendProfileStatus} onPress={()=>{askFriend(item.accountId, item.friendNickname, item.profileImageUrl);}}>
                <SvgXml width={24} height={24} xml={svgXml.icon.addfriend} />
              </Pressable>
            </Pressable>
          );
          if (item.friendshipId == -2) return (
            <Pressable
              style={[
                styles.friendView,
                {width: (Dimensions.get('window').width - 40) / 2},
              ]}
              onPress={() => {
                setShowWhoseModal(item.accountId);
              }}>
              <Pressable
                style={styles.friendProfileImg}>
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
                <Text style={styles.friendName}>{item.friendNickname}</Text>
              </View>
              <Pressable style={styles.waitingFriendProfileStatus}>
                <SvgXml width={24} height={24} xml={svgXml.icon.sendfriend} />
              </Pressable>
            </Pressable>
          );
          return (
            <Pressable
              style={[
                styles.friendView,
                {width: (Dimensions.get('window').width - 40) / 2},
              ]}
              onPress={() => {
                setShowWhoseModal(item.accountId);
              }}>
              <Pressable
                style={styles.friendProfileImg}
                onPress={() => {
                  setShowWhoseModal(item.accountId);
                }}>
                {item.profileImageUrl == null ? (
                  <SvgXml width={32} height={32} xml={svgXml.profile.null} />
                ) : (
                  <ImageModal
                    swipeToDismiss={true}
                    resizeMode="contain"
                    // resizeMode="cover"
                    imageBackgroundColor="transparent"
                    overlayBackgroundColor="#202020"
                    style={{width: 32, height: 32, borderRadius: 16}}
                    source={{
                      uri: item.profileImageUrl,
                    }}
                  />
                )}
              </Pressable>
              <View style={styles.friendmiddle}>
                <Text style={styles.friendName}>{item.friendNickname}</Text>
              </View>
              <Pressable style={styles.friendProfileStatus}>
                {item.status == 'smile'.toUpperCase() && (
                  <SvgXml width={40} height={40} xml={svgXml.status.smile} />
                )}
                {item.status == 'happy'.toUpperCase() && (
                  <SvgXml width={40} height={40} xml={svgXml.status.happy} />
                )}
                {item.status == 'sad'.toUpperCase() && (
                  <SvgXml width={40} height={40} xml={svgXml.status.sad} />
                )}
                {item.status == 'mad'.toUpperCase() && (
                  <SvgXml width={40} height={40} xml={svgXml.status.mad} />
                )}
                {item.status == 'exhausted'.toUpperCase() && (
                  <SvgXml
                    width={40}
                    height={40}
                    xml={svgXml.status.exhauseted}
                  />
                )}
                {item.status == 'coffee'.toUpperCase() && (
                  <SvgXml width={40} height={40} xml={svgXml.status.coffee} />
                )}
                {item.status == 'meal'.toUpperCase() && (
                  <SvgXml width={40} height={40} xml={svgXml.status.meal} />
                )}
                {item.status == 'alcohol'.toUpperCase() && (
                  <SvgXml width={40} height={40} xml={svgXml.status.alcohol} />
                )}
                {item.status == 'chicken'.toUpperCase() && (
                  <SvgXml width={40} height={40} xml={svgXml.status.chicken} />
                )}
                {item.status == 'sleep'.toUpperCase() && (
                  <SvgXml width={40} height={40} xml={svgXml.status.sleep} />
                )}
                {item.status == 'work'.toUpperCase() && (
                  <SvgXml width={40} height={40} xml={svgXml.status.work} />
                )}
                {item.status == 'study'.toUpperCase() && (
                  <SvgXml width={40} height={40} xml={svgXml.status.study} />
                )}
                {item.status == 'movie'.toUpperCase() && (
                  <SvgXml width={40} height={40} xml={svgXml.status.movie} />
                )}
                {item.status == 'move'.toUpperCase() && (
                  <SvgXml width={40} height={40} xml={svgXml.status.move} />
                )}
                {item.status == 'dance'.toUpperCase() && (
                  <SvgXml width={40} height={40} xml={svgXml.status.dance} />
                )}
                {item.status == 'read'.toUpperCase() && (
                  <SvgXml width={40} height={40} xml={svgXml.status.read} />
                )}
                {item.status == 'walk'.toUpperCase() && (
                  <SvgXml width={40} height={40} xml={svgXml.status.walk} />
                )}
                {item.status == 'travel'.toUpperCase() && (
                  <SvgXml width={40} height={40} xml={svgXml.status.travel} />
                )}
              </Pressable>
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
        setDeleteFriend={setDeleteFriend}
      />
      <Modal isVisible={deleteFriend != -1}
        // onModalWillShow={getProfile}
        hasBackdrop={true}
        onBackdropPress={()=>setDeleteFriend(-1)}
        // coverScreen={false}
        onBackButtonPress={()=>setDeleteFriend(-1)}
        // backdropColor='#222222' backdropOpacity={0.5}
        // style={[styles.entire, {marginVertical:(Dimensions.get('screen').height - 400)/2}]}
        >
        {/* <View style={styles.modalBGView}>   */}
          <View style={styles.modalView}>
            <Text style={styles.modalTitleTxt}>친구를 삭제하시겠어요?</Text>
            <Text style={styles.modalContentTxt}>상대방에게 알림이 가지 않으니 안심하세요.</Text>
            <View style={styles.btnView}>
              <Pressable style={styles.btnGray} onPress={()=>{setDeleteFriend(-1);}}><Text style={styles.btnTxt}>취소</Text></Pressable>
              <View style={{width:8}}></View>
              <Pressable style={styles.btn} onPress={()=>{deleteFriends()}}><Text style={styles.btnTxt}>네, 삭제할게요.</Text></Pressable>
            </View>
          </View>
        {/* </View> */}
      </Modal>
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
  },
  friendView: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 7,
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
    backgroundColor:'#A55FFF',
    width:40,
    height:40,
    borderRadius:5,
    justifyContent:'center',
    alignItems:'center'
  },
  waitingFriendProfileStatus: {
    marginVertical: 7,
    backgroundColor:'#888888',
    width:40,
    height:40,
    borderRadius:5,
    justifyContent:'center',
    alignItems:'center'
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
  modalView:{
    backgroundColor: '#333333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems:'center',
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  modalTitleTxt:{
    color:'#F0F0F0',
    fontSize:15,
    fontWeight:'600',
    marginBottom:10
  },
  modalContentTxt:{
    color:'#F0F0F0',
    fontSize:15,
    fontWeight:'400',
    marginBottom:10,
    marginTop:10
  },
  btn:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:5,
    paddingVertical:13,
    backgroundColor:'#A55FFF',
  },
  btnGray:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:5,
    paddingVertical:13,
    backgroundColor:'#888888',
  },
  btnTxt:{
    color:'#F0F0F0',
    fontSize:15,
    fontWeight:'600'
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
  btnView:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal: 17,
    marginTop:16,
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
