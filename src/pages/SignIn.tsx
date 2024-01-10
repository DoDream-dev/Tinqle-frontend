import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Dimensions,
  ScrollView,
  Modal as M,
  TextInput,
  Linking,
  Platform,
} from 'react-native';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import Config from 'react-native-config';
import axios, {AxiosError} from 'axios';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';
import {Shadow} from 'react-native-shadow-2';
import messaging from '@react-native-firebase/messaging';
import {svgXml} from '../../assets/image/svgXml';
import {SvgXml} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import {Safe} from '../components/Safe';
import ServicePolicyModal from '../components/ServicePolicyModal';
import PersonalPolicyModal from '../components/PersonalPolicyModal';

export default function SignIn() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [id, setID] = useState('');
  const dispatch = useAppDispatch();
  const [signup, setSignUp] = useState('');
  const [settingID, setSettingID] = useState(false);
  const [duplicate, setDuplicate] = useState('YET'); // YET -> NO (4-12) -> CANNOT -> CAN
  const [allP, setAllP] = useState(false);
  const [serviceP, setServiceP] = useState(false);
  const [personalP, setPersonalP] = useState(false);
  const [ageP, setAgeP] = useState(false);
  const [adsP, setAdsP] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  const [fcm, setFcm] = useState('');
  const [policy, setPolicy] = useState('');

  const requestUserPermissionForFCM = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const fcmToken = await messaging().getToken();
      console.log('fcm auth success', fcmToken);
      setFcm(fcmToken);
      // handleFcmMessage();
    } else {
      console.log('fcm auth fail');
    }
  };
  requestUserPermissionForFCM();

  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh(token => {
      console.log('A new FCM token refreshed!', token);
    });

    return unsubscribe;
  }, []);

  const LoginWithGoogle = async () => {
    console.log('로그인 시도 중');
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // const response = await fetch('https://oauth2.googleapis.com/token', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     code: userInfo.serverAuthCode,
      //     client_id: Config.GOOGLE_CLIENT_ID,
      //     client_secret: Config.GOOGLE_CLIENT_SECRET,
      //     grant_type: 'authorization_code',
      //     redirect_uri: 'https://tinqle-8706b.firebaseapp.com/__/auth/handler'
      //   })
      // })
      // const data = await response.json();
      // setID(userInfo.user.id);

      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      );
      auth().signInWithCredential(googleCredential);

      console.log(userInfo.serverAuthCode);
      const res = await axios.post(`${Config.API_URL}/auth/login`, {
        oauthAccessToken: '',
        authorizationCode: userInfo.serverAuthCode,
        socialType: 'GOOGLE',
        fcmToken: fcm,
      });
      // console.log(res.data)
      Login(res.data.data.refreshToken, res.data.data.accessToken);
    } catch (error) {
      console.log(error);
      const errorResponse = (error as AxiosError<{message: string}>).response;
      if (errorResponse?.data.statusCode == 1030) {
        console.log('회원가입 진행');
        setSignUp(errorResponse?.data.data.signToken);
      }
    }
  };

  const LoginWithApple = async () => {
    console.log('Apple 로그인 시도 중 // 아직 미구현!');
    // return; //미작성 코드
    try {
      // const res = await axios.post(`${Config.API_URL}/auth/login`, {
      //   oauthAccessToken: '',
      //   authorizationCode: userInfo.serverAuthCode,
      //   socialType: 'GOOGLE',
      //   fcmToken: fcm,
      // });
      // console.log(res.data)
      // Login(res.data.data.refreshToken, res.data.data.accessToken);
    } catch (error) {
      // console.log(error);
      // const errorResponse = (error as AxiosError<{message: string}>).response;
      // if (errorResponse?.data.statusCode == 1030) {
      //   console.log('회원가입 진행');
      //   setSignUp(errorResponse?.data.data.signToken);
      // }
    }
  };

  const LoginWithKaKao = async () => {
    // const response = await axios.get(`${Config.API_URL}/hello`)
    // Alert.alert(response.data)
    // const token = await KakaoLogin.loginWithKakaoAccount();
    const token = await KakaoLogin.login();
    const profile = await KakaoLogin.getProfile();
    // setID(profile.id);
    // Alert.alert(profile.name)
    try {
      const response = await axios.post(`${Config.API_URL}/auth/login`, {
        oauthAccessToken: token.accessToken,
        authorizationCode: '',
        socialType: 'KAKAO',
        fcmToken: fcm,
      });
      // 성공한 경우 LOGIN call
      // Alert.alert('login started')
      Login(response.data.data.refreshToken, response.data.data.accessToken);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      if (errorResponse?.data.statusCode == 1030) {
        console.log('회원가입 진행');
        setSignUp(errorResponse?.data.data.signToken);
        // Signup();
      }
    }
  };

  const Signup = async (signToken: string) => {
    // console.log(serviceP, personalP, ageP, adsP, signToken, fcm);
    try {
      const response = await axios.post(`${Config.API_URL}/auth/signup`, {
        signToken: signToken,
        usePolicy: serviceP,
        agePolicy: ageP,
        personalPolicy: personalP,
        // marketPolicy: false,
        fcmToken: fcm,
        code: id,
      });
      // LOGIN call
      Login(response.data.data.refreshToken, response.data.data.accessToken);
      console.log('회원가입 완료');
    } catch (error) {
      console.log('error ', error);
      const errorResponse = (error as AxiosError<{message: string}>).response;
      if (errorResponse?.data.statusCode == 1090) {
        return Alert.alert('알림', 'try again');
      } else if (errorResponse?.data.statusCode == 1100) {
        console.log('이미 가입된 계정');
      }
    }
  };

  const Login = async (refreshToken: string, accessToken: string) => {
    // Alert.alert('login finished', accessToken)
    // try {
    dispatch(
      userSlice.actions.setToken({
        accessToken: accessToken,
      }),
    );
    await EncryptedStorage.setItem('refreshToken', refreshToken);
    // setID('');
    const token = await EncryptedStorage.getItem('refreshToken');
    console.log('로그인 완료');
    // console.log('token', token)

    // } catch (error) {
    //   const errorResponse = (error as AxiosError<{message: string}>).response;
    //   console.log(errorResponse);
    // }
  };

  useEffect(() => {
    // console.log('####', Config);
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  const checkDuplicate = async () => {
    const reg = new RegExp(`^[a-zA-Z0-9]{4,12}$`);
    if (!reg.test(id)) {
      setDuplicate('NO');
    } else {
      try {
        const response = await axios.get(
          `${Config.API_URL}/accounts/check/code/${id}`,
        );
        if (response.data.data.isDuplicated) {
          setDuplicate('CAN');
        } else {
          setDuplicate('CANNOT');
        }
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse);
        setDuplicate('CANNOT');
      }
    }
  };

  return (
    <View style={styles.entire}>
      <View style={styles.logoView}>
        <Text style={styles.logoTxt}>내 친구는 지금 뭐할까?</Text>
        <Text style={styles.logoTxtMain}>tincle</Text>
      </View>
      <View style={styles.loginView}>
        {Platform.OS == 'ios' ? (
          <Pressable style={styles.loginBtnApple} onPress={LoginWithApple}>
            <Shadow
              distance={5}
              startColor="#00000009"
              style={{flex: 1, alignSelf: 'stretch', borderRadius: 5}}
              stretch={true}
              containerStyle={{marginHorizontal: 0}}>
              <View style={[styles.forshadow, {width: windowWidth - 32}]}>
                <SvgXml
                  width={24}
                  height={24}
                  xml={svgXml.logo.apple}
                  style={styles.logoApple}
                />
                <Text style={styles.loginBtnTxtApple}>Apple로 계속하기</Text>
              </View>
            </Shadow>
          </Pressable>
        ) : null}
        <Pressable style={styles.loginBtnGoogle} onPress={LoginWithGoogle}>
          <Shadow
            distance={5}
            startColor="#00000009"
            style={{flex: 1, alignSelf: 'stretch', borderRadius: 5}}
            stretch={true}
            containerStyle={{marginHorizontal: 0}}>
            <View style={[styles.forshadow, {width: windowWidth - 32}]}>
              <SvgXml
                width={24}
                height={24}
                xml={svgXml.logo.google}
                style={styles.logoGoogle}
              />
              <Text style={styles.loginBtnTxtGoogle}>Google로 계속하기</Text>
            </View>
          </Shadow>
        </Pressable>
        <Pressable style={styles.loginBtnKakao} onPress={LoginWithKaKao}>
          <Shadow
            distance={5}
            startColor="#00000009"
            style={{flex: 1, alignSelf: 'stretch', borderRadius: 5}}
            stretch={true}
            containerStyle={{marginHorizontal: 0}}>
            <View style={[styles.forshadow, {width: windowWidth - 32}]}>
              <SvgXml
                width={24}
                height={24}
                xml={svgXml.logo.kakao}
                style={styles.logoKakao}
              />
              <Text style={styles.loginBtnTxtKakao}>카카오로 계속하기</Text>
            </View>
          </Shadow>
        </Pressable>
      </View>
      <M
        visible={settingID}
        // onBackButtonPress={()=>setSettingID(false)}
        // hasBackdrop={false}
        onRequestClose={()=>setSettingID(false)}
        style={{margin: 0}}>
        <Pressable
          onPress={() => setSettingID(false)}
          style={styles.modalBGView2}>
          <Pressable
            style={[styles.modalView2 /*{width:windowWidth}*/]}
            onPress={e => e.stopPropagation()}>
            <View style={styles.idModalHeader}>
              <Text style={styles.idModalHeaderTxt}>내 아이디 정하기</Text>
            </View>
            <View style={styles.idModalBody}>
              <TextInput
                // ref={inp1}
                onChangeText={(text: string) => {
                  setID(text);
                  setDuplicate('YET');
                }}
                // blurOnSubmit={true}
                maxLength={12}
                value={id}
                // autoFocus={true}
                // onSubmitEditing={()=>{
                //   if (whoseProfile == 0) {rename(chageNameVal.trim(), undefined);}
                //   else {rename(chageNameVal.trim(), accountId);}
                // }}
                style={styles.idModalBodyTxtInp}
              />
              <Pressable
                style={styles.idModalBodyBtn}
                onPress={() => {
                  checkDuplicate();
                }}>
                <Text style={styles.idModalBodyBtnTxt}>중복확인</Text>
              </Pressable>
            </View>
            {duplicate == 'YET' && <View style={{height: 12}}></View>}
            {duplicate == 'CANNOT' && (
              <Text style={styles.idModalBodyBtnTxt}>
                이미 존재하는 아이디예요.
              </Text>
            )}
            {duplicate == 'CAN' && (
              <Text style={styles.idModalBodyBtnTxt}>
                사용할 수 있는 아이디예요.
              </Text>
            )}
            {duplicate == 'NO' && (
              <Text style={styles.idModalBodyBtnTxt}>
                아이디는 4~12자, 영문이나 숫자로만 가능합니다.
              </Text>
            )}
            <Pressable
              style={
                duplicate == 'CAN'
                  ? styles.idModalFooterBtnActive
                  : styles.idModalFooterBtn
              }
              onPress={() => {
                Signup(signup);
                setSignUp('');
                setSettingID(false);
              }}
              disabled={duplicate != 'CAN'}>
              <Text style={styles.idModalFooterBtnTxt}>완료</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </M>
      <Modal
        isVisible={signup != ''}
        onSwipeComplete={() => setSignUp('')}
        swipeDirection={'down'}
        hasBackdrop={false}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <Safe>
          <Pressable onPress={() => setSignUp('')} style={styles.modalBGView}>
            <Shadow distance={6} startColor="#00000010">
              <Pressable
                style={[styles.modalView, {width: windowWidth}]}
                onPress={e => e.stopPropagation()}>
                <View style={styles.modalAllView}>
                  <Pressable
                    style={styles.policyBtn}
                    onPress={() => {
                      if (allP) {
                        setServiceP(false);
                        setPersonalP(false);
                        setAdsP(false);
                        setAgeP(false);
                        setAllP(false);
                      } else {
                        setServiceP(true);
                        setPersonalP(true);
                        setAdsP(true);
                        setAgeP(true);
                        setAllP(true);
                      }
                    }}>
                    {allP ? (
                      <View style={styles.checkBtnSelected}>
                        <Feather
                          name={'check'}
                          size={18}
                          style={{color: 'white'}}
                        />
                      </View>
                    ) : (
                      <View style={styles.checkBtn}></View>
                    )}
                    <Text style={styles.policyTxtBold}>전체 동의하기</Text>
                  </Pressable>
                </View>
                <View style={styles.modalItemView}>
                  <Pressable
                    style={styles.policyBtn}
                    onPress={() => {
                      if (serviceP) {
                        setAllP(false);
                      } else if (personalP && ageP /*&& adsP*/) {
                        setAllP(true);
                      }
                      setServiceP(!serviceP);
                    }}>
                    {!serviceP && <View style={styles.checkBtn}></View>}
                    {serviceP && (
                      <View style={styles.checkBtnSelected}>
                        <Feather
                          name={'check'}
                          size={18}
                          style={{color: 'white'}}
                        />
                      </View>
                    )}
                    <Text style={styles.policyTxt}>
                      [필수] 서비스 이용약관 동의
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.seePolicy}
                    onPress={() => {
                      setPolicy('service');
                    }}>
                    <Text style={styles.seePolicyTxt}>보기</Text>
                  </Pressable>
                </View>
                <View style={styles.modalItemView}>
                  <Pressable
                    style={styles.policyBtn}
                    onPress={() => {
                      if (personalP) {
                        setAllP(false);
                      } else if (serviceP && ageP /*&& adsP*/) {
                        setAllP(true);
                      }
                      setPersonalP(!personalP);
                    }}>
                    {!personalP && <View style={styles.checkBtn}></View>}
                    {personalP && (
                      <View style={styles.checkBtnSelected}>
                        <Feather
                          name={'check'}
                          size={18}
                          style={{color: 'white'}}
                        />
                      </View>
                    )}
                    <Text style={styles.policyTxt}>
                      [필수] 개인정보 수집 및 이용 동의
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.seePolicy}
                    onPress={() => {
                      setPolicy('personal');
                    }}>
                    <Text style={styles.seePolicyTxt}>보기</Text>
                  </Pressable>
                </View>
                <View style={styles.modalItemView}>
                  <Pressable
                    style={styles.policyBtn}
                    onPress={() => {
                      if (ageP) {
                        setAllP(false);
                      } else if (personalP && serviceP /* && adsP*/) {
                        setAllP(true);
                      }
                      setAgeP(!ageP);
                    }}>
                    {!ageP && <View style={styles.checkBtn}></View>}
                    {ageP && (
                      <View style={styles.checkBtnSelected}>
                        <Feather
                          name={'check'}
                          size={18}
                          style={{color: 'white'}}
                        />
                      </View>
                    )}
                    <Text style={styles.policyTxt}>
                      [필수] 만14세 이상입니다
                    </Text>
                  </Pressable>
                </View>
                {/* <View style={styles.modalItemView}>
                <Pressable style={styles.policyBtn} onPress={()=>{
                  if (adsP) {setAllP(false)}
                  else if (personalP && ageP && serviceP) {setAllP(true)}
                  setAdsP(!adsP);
                }}>
                  {!adsP && <View style={styles.checkBtn}></View>}
                  {adsP && <View style={styles.checkBtnSelected}>
                    <Feather name={'check'} size={20} style={{color:'white'}}/>
                  </View>}
                  <Text style={styles.policyTxt}>[선택] 마케팅 활용 및 광고성 정보 수신 동의</Text>
                </Pressable>
              </View> */}
                <Pressable
                  style={
                    !(serviceP && personalP && ageP)
                      ? styles.sendBtnUnActivated
                      : styles.sendBtn
                  }
                  disabled={!(serviceP && personalP && ageP)}
                  // onPress={()=>{Signup(signup); setSignUp('');}}
                  onPress={() => {
                    setSettingID(true);
                  }}>
                  <Text style={styles.sendTxt}>시작하기</Text>
                </Pressable>
              </Pressable>
            </Shadow>
          </Pressable>
        </Safe>
      </Modal>
      {/* modal for policy */}
      <ServicePolicyModal policy={policy} setPolicy={setPolicy} />
      <PersonalPolicyModal policy={policy} setPolicy={setPolicy} />
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logoView: {
    flex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTxt: {
    color: '#000000',
    fontWeight: '500',
    fontSize: 15,
  },
  logoTxtMain: {
    color: '#FFB443',
    fontSize: 70,
    fontWeight: 'bold',
  },
  loginView: {
    flex: Platform.OS === 'ios' ? 3 : 2,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    paddingHorizontal: 16,
  },
  forshadow: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  loginBtnGoogle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 5,
  },
  loginBtnApple: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#000000',
    width: '100%',
    borderRadius: 5,
  },
  loginBtnKakao: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE500',
    width: '100%',
    borderRadius: 5,
    // elevation: 2,
  },
  loginBtnTxtGoogle: {
    color: '#757575',
    fontWeight: '500',
    fontSize: 15,
  },
  loginBtnTxtApple: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 15,
  },
  loginBtnTxtKakao: {
    color: '#181600',
    fontWeight: '500',
    fontSize: 15,
  },
  logoGoogle: {
    marginRight: 4,
  },
  logoApple: {
    marginRight: 4,
  },
  logoKakao: {
    marginRight: 2,
    marginBottom: 1,
  },
  modalBGView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBGView2: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 36,
    backgroundColor: '#202020',
  },
  modalView: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 33,
    backgroundColor: 'white',
    // elevation: 10,
  },
  modalView2: {
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#333333',
    paddingTop: 30,
    paddingBottom: 24,
  },
  modalAllView: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomColor: '#D9D9D9',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  modalItemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  idModalHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  idModalHeaderTxt: {
    color: '#F0F0F0',
    fontWeight: '600',
    fontSize: 15,
  },
  idModalBody: {
    backgroundColor: '#202020',
    marginBottom: 4,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  idModalBodyTxtInp: {
    color: '#F0F0F0',
    fontWeight: '400',
    fontSize: 15,
    padding: 0,
    flex: 1,
  },
  idModalBodyBtn: {
    backgroundColor: '#A55FFF',
    padding: 5,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  idModalBodyBtnTxt: {
    color: '#F0F0F0',
    fontWeight: '500',
    fontSize: 13,
  },
  idModalFooterBtn: {
    marginTop: 8,
    backgroundColor: '#888888',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 13,
  },
  idModalFooterBtnActive: {
    marginTop: 8,
    backgroundColor: '#A55FFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 13,
  },
  idModalFooterBtnTxt: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F0F0F0',
  },
  policyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBtn: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#848484',
  },
  checkBtnSelected: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: '#FFB443',
    justifyContent: 'center',
    alignItems: 'center',
  },
  policyTxt: {
    paddingLeft: 8,
    color: '#222222',
    fontWeight: '400',
    fontSize: 15,
  },
  policyTxtBold: {
    paddingLeft: 8,
    color: '#222222',
    fontWeight: '500',
    fontSize: 15,
  },
  seePolicy: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  seePolicyTxt: {
    color: '#848484',
    fontWeight: '500',
    fontSize: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#848484',
  },
  sendBtn: {
    width: '100%',
    backgroundColor: '#FFB443',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 17,
    marginTop: 10,
  },
  sendBtnUnActivated: {
    width: '100%',
    backgroundColor: '#B7B7B7',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 17,
    marginTop: 10,
  },
  sendTxt: {
    color: '#222222',
    fontWeight: '500',
    fontSize: 15,
  },
  policyentire: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  policyheader: {
    color: '#222222',
    fontSize: 18,
    fontWeight: '600',
  },
  policyBox: {
    marginTop: 12,
    width: '100%',
  },
  policyHead: {
    color: '#222222',
    fontSize: 15,
    fontWeight: '500',
  },
  policyBody: {
    marginTop: 6,
    color: '#222222',
    fontSize: 13,
    fontWeight: '400',
  },
  policyBulleted: {
    color: '#222222',
    fontSize: 13,
    fontWeight: '400',
    paddingLeft: 6,
  },
});
