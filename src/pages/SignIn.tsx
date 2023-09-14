import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native';
import * as KakaoLogin from '@react-native-seoul/kakao-login'
import { useAppDispatch } from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import Config from 'react-native-config'
import axios, {AxiosError} from 'axios';
interface SignInProps {
  setState:React.Dispatch<React.SetStateAction<boolean>>;
}
export default function SignIn({setState}:SignInProps) {
  const [name, setName] = useState('');
  const dispatch = useAppDispatch();
  const LoginWithKaKao = async () => {
    const token = await KakaoLogin.login();
    const profile = await KakaoLogin.getProfile();
    setName(profile.nickname);
    try {
      const response = await axios.post(`${Config.API_URL}/auth/login`, {
        oauthAccessToken: token.accessToken,
        authorizationCode: "",
        socialType: "KAKAO",
        fcmToken:"",
      });
      // 성공한 경우 LOGIN call
      Login(response.data.refreshToken, response.data.accessToken);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.error(errorResponse?.data.statusCode);
      if (errorResponse?.data.statusCode == 1030) {Signup(errorResponse?.data.data.signToken);}
    }
  };

  const Signup = async (signToken:string) => {
    try {
      const response = await axios.post(`${Config.API_URL}/auth/signup`, {
        signToken: signToken,
        usePolicy: true,
        agePolicy: true,
        personalPolicy: true,
        marketPolicy: true,
        fcmToken: '',
      });
      console.log(response.data.accessToken);
      console.log(response.data.refreshToken);
      // LOGIN call
      Login(response.data.refreshToken, response.data.accessToken);

    } catch(error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      if (errorResponse?.data.statusCode == 1090) {return Alert.alert('알림', 'try again');}
      else if (errorResponse?.data.statusCode == 1100) {console.log('이미 가입된 계정')}
    }
  };
  const Login = async (refreshToken:string, accessToken:string) => {
    try {
      await EncryptedStorage.setItem('refreshToken', refreshToken,);
      dispatch(
        userSlice.actions.setUser({
          name: name,
          accessToken: accessToken,
        })
      );
    } catch (error) {}
  };

  return (
    <View style={styles.entire}>
      <View style={styles.logoView}>
        <Text style={styles.logoTxt}>내 친구는 지금 뭐할까?</Text>
        <Text style={styles.logoTxtMain}>tinqle</Text>
      </View>
      <View style={styles.loginView}>
        <Pressable style={styles.loginBtnGoogle} onPress={() => setState(true)}>
          <Image style={styles.logoGoogle} source={require('../../assets/image/LogoGoogle.png')}/>
          <Text style={styles.loginBtnTxtGoogle}>Google로 계속하기</Text>
        </Pressable>
        <Pressable style={styles.loginBtnKakao} onPress={LoginWithKaKao}>
          <Image style={styles.logoKakao} source={require('../../assets/image/LogoKakao.png')}/>
          <Text style={styles.loginBtnTxtKakao}>카카오로 계속하기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  logoView:{
    flex:5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoTxt:{
    color: '#000000',
    fontWeight: '500',
    fontSize: 15
  },
  logoTxtMain:{
    color: '#FFB443',
    fontSize: 70,
    fontWeight: 'bold'
  },
  loginView:{
    flex:1,
    width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  loginBtnGoogle:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    width: '80%',
    borderRadius: 5,
    elevation: 4,
  },
  loginBtnKakao:{
    flex:1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE500',
    width: '80%',
    borderRadius: 5,
    elevation: 4,

  },
  loginBtnTxtGoogle:{
    color: '#757575',
    fontWeight: '500',
    fontSize: 15,

  },
  loginBtnTxtKakao:{
    color: '#181600',
    fontWeight: '500',
    fontSize: 15,
  },
  logoGoogle:{
    marginRight: 4,
  },
  logoKakao:{
    marginRight: 2,
    marginBottom: 1
  },
});