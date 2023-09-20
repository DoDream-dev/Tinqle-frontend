import axios, {AxiosError} from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, Keyboard, Modal, DevSettings } from 'react-native';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useAppDispatch } from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from "react-native-encrypted-storage";
import ToastScreen from '../components/ToastScreen';


export default function SearchFriends() {
  const dispatch = useAppDispatch();

  const [myCode, setMyCode] = useState('');
  const [placeholder, setPlaceholder] = useState('친구 코드 검색');
  const [searchCode, setSearchCode] = useState('');
  const [message, setMessage] = useState('');
  const [otherUser, setOtherUser] = useState({accountId:-1, nickname:'', isFriend:0})
  const [reset, setReset] = useState(false);
  const [whichPopup, setWhichPopup] = useState('');
  const token = useSelector((state:RootState) => state.user.accessToken);
  const refreshOrNot = async () => {
    try {
      const refreshToken = await EncryptedStorage.getItem('refreshToken');
      if (!refreshToken) {DevSettings.reload();}
      const response = await axios.post(`${Config.API_URL}/auth/reissue`, {refreshToken:refreshToken},);
      dispatch(
        userSlice.actions.setToken({
          accessToken: response.data.data.accessToken,
        }),
      );
      await EncryptedStorage.setItem('refreshToken', response.data.data.refreshToken,);
      console.log('Token 재발급');
      return true;
    } catch (error) {
      const douleErrorResponseStatusCode = (error as AxiosError<{message: string}>).response?.data.statusCode;
      if (douleErrorResponseStatusCode == 1070 || douleErrorResponseStatusCode == 1080 || douleErrorResponseStatusCode == 1060) {
        await EncryptedStorage.removeItem('refreshToken')
        DevSettings.reload();
        console.log('reload');
        return false;
      }
    }
  };

  useEffect(() => {
    const getMyCode = async () => {
      try {
        const response = await axios.get(`${Config.API_URL}/friendships`, {headers:{Authorization:`Bearer ${token}`}});
        setMyCode(response.data.data.code);
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        if (errorResponse?.data.statusCode == 1000) {
          // 로그인 접근 제한, accessToken 재발급
          if (await refreshOrNot()) setReset(!reset);
        }
      }
    };
    getMyCode();
  }, [dispatch, refreshOrNot, reset]);

  const getFriendProfile = async () => {
    try {
      const response = await axios.get(`${Config.API_URL}/accounts/search/code/${searchCode}`, {headers:{Authorization: `Bearer ${token}`}});
      let friendData;
      if (response.data.data.isFriend === null) {
        setWhichPopup('Me');
        setOtherUser({accountId:-1, nickname:'', isFriend:0})
      }
      else {
        if (response.data.data.isFriend) {friendData = 1;}
        else {friendData = 2;}
        // console.log(response.data)
        setOtherUser({accountId:response.data.data.accountId, nickname:response.data.data.nickname, isFriend:friendData});
        // console.log(otherUser)
      }

    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      if (errorResponse?.data.statusCode == 2030) {
        // popup: 존재하지 않는 코드예요.
        setWhichPopup('noCode');
      }
      else if (errorResponse?.data.statusCode == 1000) {
        console.log(1000)
        if (await refreshOrNot()) setReset(!reset);
      }
    }
  };
  const askFriend = async () => {
    try {
      const response = await axios.post(`${Config.API_URL}/friendships/request`, {headers:{Authorization: `Bearer ${token}`}, body:{
        accountTargetId:otherUser.accountId, message:message
      }},);
      console.log(response.data)
      // popup: 이도님께 친구 요청을 보냈어요!
      setWhichPopup('send');
      setOtherUser({accountId:-1, nickname:'', isFriend:0})
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
      if (errorResponse?.data.statusCode == 1000) {
        if (await refreshOrNot()) setReset(!reset);
      }
    }
  };
  return (
    <Pressable style={styles.entire} onPress={Keyboard.dismiss}>
      <View style={styles.searchView}>
        <TextInput 
          placeholder={placeholder} 
          style={styles.codeSearch} 
          onFocus={()=>setPlaceholder('')} 
          onBlur={()=>setPlaceholder('친구 코드 검색')}
          onChangeText={(text:string)=>{setSearchCode(text)}}
          blurOnSubmit={true}
          maxLength={6}
          value={searchCode}
          onSubmitEditing={getFriendProfile}
        />
        {(!placeholder || searchCode) && <Pressable onPress={() => setSearchCode('')} style={styles.clearBtn}>
          <Icon name="circle-xmark" size={20} color={'#848484'}/>
        </Pressable>}
      </View>
      <View style={styles.myCodeView}>
        <Pressable style={styles.myCodeBtn} onPress={()=>Clipboard.setString(myCode)}>
          <Text style={styles.myCodeTxt}>
            내 코드: {myCode}
          </Text>
          <Image style={styles.copyIcon} source={require('../../assets/image/copyIcon.png')}/>
        </Pressable>
      </View>
      {/* !!otherUser.nickname */}
      <Modal transparent={true} visible={!!otherUser.nickname} style={{flex: 1, paddingHorizontal: 36}}>
        {otherUser.isFriend == 2 && <Pressable style={styles.modalBGView} onPress={()=>Keyboard.dismiss()}>
          <View style={styles.modalView}>
            <View>
              <Text style={styles.searchViewName}>{otherUser.nickname}</Text>
              <Text style={styles.searchViewExplain}>친구가 나를 알아볼 수 있도록 인사를 건네주세요!</Text>
              <TextInput style={styles.commentInput} value={message} onChangeText={(text:string) => setMessage(text)}/>
            </View>
            <View style={styles.btnView}>
              <Pressable style={styles.searchViewCloseBtn} onPress={()=>setOtherUser({accountId:-1, nickname:'', isFriend:0})}>
                <Text style={styles.searchViewCloseTxt}>닫기</Text>
              </Pressable>
              <Pressable style={styles.searchViewAskFriendBtn} onPress={askFriend}>
                <Text style={styles.searchViewAskFriendTxt}>친구 요청 보내기</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>}
        {otherUser.isFriend == 1 && <Pressable style={styles.modalBGView} onPress={()=>Keyboard.dismiss()}>
          <View style={styles.modalViewFriend}>
            <View>
              <Text style={styles.searchViewName}>{otherUser.nickname}</Text>
              <Text style={styles.searchViewExplain}>이미 나와 친구 사이네요!</Text>
            </View>
            <View style={styles.btnViewFriend}>
              <Pressable style={styles.searchViewCloseBtnFriend} onPress={()=>setOtherUser({accountId:-1, nickname:'', isFriend:0})}>
                <Text style={styles.searchViewAskFriendTxt}>닫기</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>}
      </Modal>
      {whichPopup === 'noCode' && <ToastScreen
        height={21}
        marginBottom={48}
        onClose={()=>setWhichPopup('')}
        message="존재하지 않는 코드예요."
      />}
      {whichPopup === 'send' && <ToastScreen
        height = {21}
        marginBottom={48}
        onClose={()=>setWhichPopup('')}
        message={`${otherUser.nickname}님께 친구 요청을 보냈어요!`}
      />}
      {whichPopup === 'Me' && <ToastScreen 
        height={21}
        marginBottom={48}
        onClose={()=>setWhichPopup('')}
        message="나는 나의 영원한 친구입니다!"
      />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#F7F7F7'
  },
  searchView:{
    width: '100%',
    flexDirection: 'row',
  },
  clearBtn:{
    position: 'absolute',
    right: 10,
    top: 10
  },
  codeSearch:{
    fontSize: 15,
    fontWeight: '400',
    color: '#848484',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '100%',
    height: 40,
    paddingLeft: 10,
    marginBottom: 17,
  },
  myCodeView:{},
  myCodeTxt:{
    color: '#848484',
    fontSize: 11,
    fontWeight: '500'
  },
  myCodeBtn:{
    flexDirection: 'row',
  },
  copyIcon:{
    marginLeft: 4,
    height: 14
  },
  modalBGView:{
    width:"100%", 
    height:'100%', 
    backgroundColor: 'rgba(34, 34, 34, 0.31)'
  },
  modalView:{
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    height: 225,
    marginTop: 178,
    marginHorizontal: 36,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,

  },
  modalViewFriend:{
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    height: 161,
    marginTop: 178,
    marginHorizontal: 36,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  commentInput:{
    backgroundColor: '#F7F7F7',
    height: 56,
    borderRadius: 10
  },
  searchViewName:{
    color: '#222222',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 30,
  },
  searchViewExplain:{
    color: '#848484',
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 12
  },
  btnView:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12
  },
  btnViewFriend:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4
  },
  searchViewCloseBtn:{
    borderWidth: 1,
    borderColor: '#FFB443',
    borderRadius: 10,
    flex:92,
    marginRight: 10,
    height: 44,
    justifyContent: 'center'
  },
  searchViewCloseTxt:{
    color: '#FFB443',
    fontSize: 15,
    fontWeight:'600',
    textAlign: 'center'
  },
  searchViewAskFriendBtn:{
    backgroundColor: '#FFB443',
    borderWidth: 1,
    borderColor: '#FFB443',
    borderRadius: 10,
    flex: 169,
    height: 44,
    justifyContent: 'center'
  },
  searchViewAskFriendTxt:{
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight:'600',
    textAlign: 'center'
  },
  searchViewCloseBtnFriend:{
    backgroundColor: '#FFB443',
    borderWidth: 1,
    borderColor: '#FFB443',
    borderRadius: 10,
    height: 44,
    width:'40%',
    justifyContent: 'center'
  },
});