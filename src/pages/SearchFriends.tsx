import axios, {AxiosError} from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, Keyboard, Modal } from 'react-native';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/FontAwesome6';

export default function SearchFriends() {
  const [myCode, setMyCode] = useState('');
  const [placeholder, setPlaceholder] = useState('아이디 검색');
  const [searchCode, setSearchCode] = useState('');
  const [message, setMessage] = useState('');
  const [otherUser, setOtherUser] = useState({accountId:-1, nickname:'', isFriend:false})
  const token = useSelector((state:RootState) => state.user.accessToken);
  useEffect(()=>{
    const getMyCode = async () => {
      try {
        const response = await axios.get(`${Config.API_URL}/friendships`, {headers:{Authorization:`Bearer ${token}`}});
        setMyCode(response.data.data.code);
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse.data);
      }
    };
    getMyCode();
  }, []);
  const getFriendProfile = async () => {
    try {
      const response = await axios.get(`${Config.API_URL}/accounts/search/code/${searchCode}`, {headers:{Authorization: `Bearer ${token}`}});
      console.log(response.data.data.nickname)
      setOtherUser({accountId:response.data.data.accountId, nickname:response.data.data.nickname, isFriend:response.data.data.isFriend});
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };
  const askFriend = async () => {
    try {
      const response = await axios.post(`${Config.API_URL}/friendships/request`, {headers:{Authorization: `Bearer ${token}`}, body:{
        accountTagId:otherUser.accountId, message:message
      }},);
      console.log(response.data)
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };
  return (
    <Pressable style={styles.entire} onPress={Keyboard.dismiss}>
      <View style={styles.searchView}>
        <TextInput 
          placeholder={placeholder} 
          style={styles.codeSearch} 
          onFocus={()=>setPlaceholder('')} 
          onBlur={()=>setPlaceholder('아이디 검색')}
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
        <Pressable style={styles.modalBGView} onPress={()=>Keyboard.dismiss()}>
          <View style={styles.modalView}>
            <View>
              <Text style={styles.searchViewName}>{otherUser.nickname}</Text>
              <Text style={styles.searchViewExplain}>친구가 나를 알아볼 수 있도록 인사를 건네주세요!</Text>
              <TextInput style={styles.commentInput} value={message} onChangeText={(text:string) => setMessage(text)}/>
            </View>
            <View style={styles.btnView}>
              <Pressable style={styles.searchViewCloseBtn} onPress={()=>setOtherUser({accountId:-1, nickname:'', isFriend:false})}>
                <Text style={styles.searchViewCloseTxt}>닫기</Text>
              </Pressable>
              <Pressable style={styles.searchViewAskFriendBtn} onPress={askFriend}>
                <Text style={styles.searchViewAskFriendTxt}>친구 요청 보내기</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
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
    height: 221,
    marginTop: 178,
    marginHorizontal: 36,
    justifyContent: 'center',
    paddingHorizontal: 16

  },
  commentInput:{
    backgroundColor: '#F7F7F7',
    height: 56
  },
  searchViewName:{
    color: '#222222',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10
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
  }
});