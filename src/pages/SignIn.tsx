import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
interface SignInProps {
  setState:React.Dispatch<React.SetStateAction<boolean>>;
}
export default function SignIn({setState}:SignInProps) {
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
        <Pressable style={styles.loginBtnKakao}>
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
    marginVertical: 20,
  },
  loginBtnGoogle:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 7,
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