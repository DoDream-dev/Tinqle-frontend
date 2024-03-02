import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Keyboard,
  Linking,
  Platform,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import ToastScreen from '../components/ToastScreen';
import {RootStackParamList} from '../../AppInner';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {useFocusEffect} from '@react-navigation/native';
import {svgXml} from '../../assets/image/svgXml';
import {SvgXml} from 'react-native-svg';
import _ from 'lodash';
import {throttleTime, throttleTimeEmoticon} from '../hooks/Throttle';
import userSlice from '../slices/user';
import {useAppDispatch} from '../store';
import {version} from '../../package.json';

import EncryptedStorage from 'react-native-encrypted-storage';
import Profile from '../components/Profile';
import ServicePolicyModal from '../components/ServicePolicyModal';
import PersonalPolicyModal from '../components/PersonalPolicyModal';

// type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function MyProfile() {
  // const whose = route.params.whose;
  // const acId = route.params.accountId;

  // const [whoseProfile, setWhoseProfile] = useState(route.params.whose);
  // const [alreadyRequestFriend, setAlreadyRequestFriend] = useState(-1);
  const [myCode, setMyCode] = useState('');
  // const [accountId, setAcoountId] = useState(route.params.accountId);
  const [reset, setReset] = useState(false);

  // modal or not
  const [chageName, setChangeName] = useState(false);
  // const [changeStatus, setChangeStatus] = useState(false);
  const [changeId, setChangeId] = useState(false);
  const [policy, setPolicy] = useState('');
  const [deleteAccount, setDeleteAccount] = useState(false);

  // const [checkNoteBox, setCheckNoteBox] = useState(false);
  // const [writeNote, setWriteNote] = useState(false);
  // const [askFriendMsg, setAskFriendMsg] = useState(false);
  // const [popup, setPopup] = useState(false);

  // input value
  const [changeNameVal, setChangeNameVal] = useState('');
  const [changeIdVal, setChangeIdVal] = useState('');
  // const [writeNoteVal, setwriteNoteVal] = useState('');
  // const [askFriendMsgVal, setAskFriendMsgVal] = useState('');

  // original value
  const [status, setStatus] = useState('');
  const [lastChangeStatusAt, setLastChangeStatusAt] = useState('');
  const [name, setName] = useState('');
  const [profileImg, setProfileImg] = useState(null);

  const [duplicate, setDuplicate] = useState('YET');

  const [whichPopup, setWhichPopup] = useState('');

  const inp1 = useRef();
  const inp2 = useRef();

  const dispatch = useAppDispatch();

  useEffect(() => {
    // if (whoseProfile == 0) {
    const getMyProfile = async () => {
      try {
        const response = await axios.get(`${Config.API_URL}/accounts/me`);
        // console.log('#### : ', response.data.data);
        setName(response.data.data.nickname);
        setChangeNameVal(response.data.data.nickname);
        setStatus(response.data.data.status.toLowerCase());
        setLastChangeStatusAt(response.data.data.lastChangeStatusAt);
        setProfileImg(response.data.data.profileImageUrl);
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
    const getMyCode = async () => {
      try {
        const response = await axios.get(`${Config.API_URL}/friendships`);
        setMyCode(response.data.data.code);
        setChangeIdVal(response.data.data.code);
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
    getMyProfile();
    // }
    // else {
    //   navigation.setOptions({headerRight:()=>(<View></View>)});
    //   const getProfile = async () => {
    //     try {
    //       const response = await axios.get(`${Config.API_URL}/accounts/${accountId}/profile`,);
    //       // console.log(response.data.data)
    //       setName(response.data.data.nickname);
    //       setChangeNameVal(response.data.data.nickname);
    //       setStatus(response.data.data.status.toLowerCase());
    //       switch (response.data.data.friendshipRelation) {
    //         case "true":
    //           setWhoseProfile(1);
    //           break;
    //         case "false":
    //           setWhoseProfile(2);
    //           setAlreadyRequestFriend(0);
    //           break;
    //         case "waiting":
    //           setWhoseProfile(2);
    //           setAlreadyRequestFriend(1);
    //           break;
    //       }
    //     } catch (error) {
    //       const errorResponse = (error as AxiosError<{message: string}>).response;
    //       console.log(errorResponse.data);
    //     }
    //   };
    //   getProfile();
    // }
  }, [name, status, profileImg, reset]);

  // useFocusEffect(
  //   useCallback(()=>{
  //     setWhoseProfile(whose);
  //     setAcoountId(acId);
  //   },[whose, acId, status])
  // );

  const postStatus = _.throttle(async (stat: string) => {
    if (stat == status) {
      return;
    } else {
      try {
        const response = await axios.put(
          `${Config.API_URL}/accounts/me/status/${stat.toUpperCase()}`,
        );
        setStatus(response.data.status);
        // console.log(response.data)
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse);
      }
    }
  }, throttleTimeEmoticon);

  const rename = _.throttle(async (text: string) => {
    if (text === name) {
      setChangeName(false);
      setChangeNameVal(text);
      return;
    }
    try {
      const response = await axios.put(
        `${Config.API_URL}/accounts/me/nickname`,
        {nickname: text},
      );
      setName(response.data.data.nickname);
      setChangeNameVal(response.data.data.nickname);
      setChangeName(false);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  }, throttleTime);

  // const sendNote =  _.throttle(async () => {
  //   try {
  //     const response = await axios.post(`${Config.API_URL}/accounts/${accountId}/message`, {
  //       message:writeNoteVal,
  //     },);
  //     setWriteNote(false);
  //     setPopup(true);
  //     // console.log(response.data.data)
  //   } catch (error) {
  //     const errorResponse = (error as AxiosError<{message: string}>).response;
  //     console.log(errorResponse.data);
  //   }
  //   setwriteNoteVal('');
  // }, throttleTime);

  // const askFriend =  _.throttle(async () => {
  //   try {
  //     const response = await axios.post(`${Config.API_URL}/friendships/request`, {
  //       accountTargetId:accountId, message:askFriendMsgVal
  //     },);
  //     // console.log(response.data)
  //     // popup: 이도님께 친구 요청을 보냈어요!
  //     setPopup(true);
  //     setAskFriendMsg(false);
  //     setAskFriendMsgVal('');
  //     setAlreadyRequestFriend(1);
  //   } catch (error) {
  //     const errorResponse = (error as AxiosError<{message: string}>).response;
  //     console.log(errorResponse.data);
  //   }
  // }, throttleTime);

  // useEffect(() => {
  //   if (chageName) {
  //     inp1.current.focus();
  //   }
  // }, [chageName]);

  const lastFocus = () => {
    if (Platform.OS === 'android' && inp1.current) {
      const length = changeNameVal.length;
      inp1.current.setSelection(length, length);
    }
  };

  const LogOut = async () => {
    try {
      const response = await axios.post(`${Config.API_URL}/auth/logout`);
      // console.log(response.data);
      if (response.data.data.isLogout) {
        await EncryptedStorage.removeItem('refreshToken');
        dispatch(
          userSlice.actions.setToken({
            accessToken: '',
          }),
        );
        // navigation.navigate('SignIn')
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

  const revoke = async () => {
    try {
      const response = await axios.post(`${Config.API_URL}/accounts/revoke`);
      console.log(response.data);
      await EncryptedStorage.removeItem('refreshToken');
      dispatch(
        userSlice.actions.setToken({
          accessToken: '',
        }),
      );
      setDeleteAccount(false);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  const idChange = async () => {
    try {
      const response = await axios.post(`${Config.API_URL}/accounts/me/code`, {
        code: changeIdVal,
      });
      console.log(response.data);
      setChangeId(false);
      setChangeIdVal(response.data.data.code);
      setReset(!reset);
      setDuplicate('YET');
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  const checkDuplicate = async () => {
    const reg = new RegExp(`^[a-z0-9]{4,12}$`);
    if (changeIdVal == myCode) {
      setDuplicate('SAME');
    } else {
      if (!reg.test(changeIdVal)) {
        setDuplicate('NO');
      } else {
        try {
          const response = await axios.get(
            `${Config.API_URL}/accounts/check/code/${changeIdVal}`,
          );
          if (response.data.data.isDuplicated) {
            setDuplicate('CAN');
          } else {
            setDuplicate('CANNOT');
          }
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>)
            .response;
          console.log(errorResponse);
          setDuplicate('CANNOT');
        }
      }
    }
  };

  return (
    <>
      <ScrollView style={styles.entire}>
        <View style={styles.profileView}>
          <Profile
            status={status}
            name={name}
            renameModal={setChangeName}
            profileImg={profileImg}
            setProfileImg={setProfileImg}
            friendshipRelation="me"
            myCode={myCode}
            setWhichPopup={setWhichPopup}
            setStatus={setStatus}
            lastChangeStatusAt={lastChangeStatusAt}
          />
        </View>

        <View style={styles.settingView}>
          <Pressable
            style={styles.settingBtn}
            onPress={() =>
              Linking.openURL(
                'https://understood-blender-196.notion.site/ef94bd7843e94cc0ab57521878b482e0?pvs=4',
              )
            }>
            <Text style={styles.settingBtnTxt}>공지사항</Text>
          </Pressable>
          <Pressable
            style={styles.settingBtn}
            onPress={() =>
              Linking.openURL(
                'https://docs.google.com/forms/d/e/1FAIpQLSeAsQ-hqAzVdrgmIS5re1MEP_yjxWwhXtg_RT9qKgW9HyBbZQ/viewform?usp=sf_link',
              )
            }>
            <Text style={styles.settingBtnTxt}>의견 남기기</Text>
          </Pressable>
          <Pressable
            style={styles.settingBtn}
            onPress={() => setChangeId(true)}>
            <Text style={styles.settingBtnTxt}>내 아이디 변경하기</Text>
          </Pressable>
          <Pressable
            style={styles.settingBtn}
            onPress={() =>
              Linking.openURL(
                'https://docs.google.com/forms/d/1qmmMGz6k5l4nVgTpvazSxXSV8XXoNH0X43ocvu45_6A/edit?usp=drivesdk',
              )
            }>
            <Text style={styles.settingBtnTxt}>신고하기</Text>
          </Pressable>
          <Pressable
            style={styles.settingBtn}
            onPress={() => {
              setPolicy('service');
            }}>
            <Text style={styles.settingBtnTxt}>서비스 이용약관</Text>
          </Pressable>
          <Pressable
            style={styles.settingBtn}
            onPress={() => {
              setPolicy('personal');
            }}>
            <Text style={styles.settingBtnTxt}>개인정보 처리방침</Text>
          </Pressable>
          <Pressable style={styles.settingBtn} onPress={LogOut}>
            <Text style={styles.settingBtnTxt}>로그아웃</Text>
          </Pressable>
          <Pressable
            style={styles.settingBtn}
            onPress={() => setDeleteAccount(true)}>
            <Text style={styles.settingBtnTxt}>계정 삭제</Text>
          </Pressable>
          <Pressable
            style={[
              styles.settingBtn,
              {flexDirection: 'row', justifyContent: 'space-between'},
            ]}>
            <Text style={styles.settingBtnTxt}>앱 버전</Text>
            <Text style={[styles.settingBtnTxt, {color: '#888888'}]}>
              {version}
            </Text>
          </Pressable>
        </View>

        {/* modal for policy */}
        <ServicePolicyModal policy={policy} setPolicy={setPolicy} />
        <PersonalPolicyModal policy={policy} setPolicy={setPolicy} />

        {/* modal for changing name */}
        <Modal
          isVisible={chageName}
          onBackButtonPress={() => setChangeName(false)}
          avoidKeyboard={true}
          backdropColor="#101010"
          backdropOpacity={0.5}
          onModalShow={() => {
            if (Platform.OS === 'android') {
              inp1.current.focus();
            }
          }}>
          <Pressable
            style={styles.modalBGView}
            onPress={() => {
              setChangeName(false);
              Keyboard.dismiss();
            }}>
            <Pressable
              style={styles.modalView}
              onPress={e => e.stopPropagation()}>
              <Text style={styles.modalTitleTxt}>내 이름 변경하기</Text>
              <View style={styles.changeView}>
                <TextInput
                  ref={inp1}
                  style={styles.nameChangeTxtInput}
                  onChangeText={(text: string) => {
                    setChangeNameVal(text);
                  }}
                  blurOnSubmit={true}
                  maxLength={10}
                  value={changeNameVal}
                  autoFocus={Platform.OS === 'ios' ? true : false}
                  onSubmitEditing={() => {
                    rename(changeNameVal.trim());
                  }}
                  onFocus={lastFocus}
                />
              </View>
              <View style={styles.modalBtnView}>
                <Pressable
                  style={styles.btnGray}
                  onPress={() => {
                    setChangeName(false);
                    setChangeNameVal(name);
                  }}>
                  <Text style={styles.btnTxt}>취소</Text>
                </Pressable>
                <View style={{width: 8}}></View>
                <Pressable
                  style={styles.btn}
                  disabled={changeNameVal.trim() == ''}
                  onPress={() => {
                    if (changeNameVal != '') {
                      if (changeNameVal == name) {
                        setChangeName(false);
                      } else {
                        rename(changeNameVal.trim());
                      }
                    }
                  }}>
                  <Text style={styles.btnTxt}>완료</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
        <Modal
          isVisible={deleteAccount}
          onBackButtonPress={() => setDeleteAccount(false)}
          avoidKeyboard={true}
          backdropColor="#101010"
          backdropOpacity={0.5}>
          <Pressable
            style={styles.modalBGView}
            onPress={() => {
              setDeleteAccount(false);
              Keyboard.dismiss();
            }}>
            <Pressable
              style={styles.modalView}
              onPress={e => e.stopPropagation()}>
              <Text style={styles.modalTitleTxt}>계정을 삭제하시겠어요?</Text>
              <Text style={styles.modalContentTxt}>떠나신다니 아쉬워요.</Text>
              <View style={styles.modalBtnView}>
                <Pressable
                  style={styles.btnGray}
                  onPress={() => {
                    setDeleteAccount(false);
                  }}>
                  <Text style={styles.btnTxt}>취소</Text>
                </Pressable>
                <View style={{width: 8}}></View>
                <Pressable
                  style={styles.btn}
                  onPress={() => {
                    revoke();
                  }}>
                  <Text style={styles.btnTxt}>네, 삭제할게요.</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
        <Modal
          isVisible={changeId}
          onBackButtonPress={() => {
            setChangeId(false);
            setChangeIdVal(myCode);
          }}
          // hasBackdrop={false}
          animationIn="fadeIn" // Set the animation type to fade-in
          animationInTiming={600}
          onDismiss={() => setChangeId(false)}
          style={{margin: 0}}>
          <Pressable
            onPress={() => setChangeId(false)}
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
                  autoCapitalize="none"
                  onChangeText={(text: string) => {
                    setChangeIdVal(text.toLowerCase());
                    if (duplicate != 'YET') setDuplicate('YET');
                  }}
                  // blurOnSubmit={true}
                  maxLength={12}
                  value={changeIdVal}
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
                  아이디는 4~12자, 영문 소문자나 숫자만 가능합니다.
                </Text>
              )}
              {duplicate == 'SAME' && (
                <Text style={styles.idModalBodyBtnTxt}>
                  사용할 수 있는 아이디예요.
                </Text>
              )}
              <Pressable
                style={
                  duplicate == 'CAN' || duplicate == 'SAME'
                    ? styles.idModalFooterBtnActive
                    : styles.idModalFooterBtn
                }
                onPress={() => {
                  if (duplicate == 'SAME') {
                    setChangeId(false);
                  } else {
                    idChange();
                  }
                }}
                disabled={duplicate != 'CAN' && duplicate != 'SAME'}>
                <Text style={styles.idModalFooterBtnTxt}>완료</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      </ScrollView>
      <View
        style={{
          alignItems: 'center',
        }}>
        {whichPopup == 'copyId' && (
          <ToastScreen
            height={21}
            marginBottom={48}
            onClose={() => setWhichPopup('')}
            message={`Id가 클립보드에 복사되었어요!`}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    // alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 16,
    backgroundColor: '#202020',
  },
  profileView: {
    width: '100%',
    backgroundColor: '#333333',
    // backgroundColor: 'red',
    alignItems: 'center',
    borderRadius: 10,
    position: 'relative',
    paddingHorizontal: 16,
    paddingVertical: 34,
  },
  myCodeView: {},
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
  modalBGView: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
  },
  modalBGView2: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 36,
    backgroundColor: '#202020',
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
  modalView2: {
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#333333',
    paddingTop: 30,
    paddingBottom: 24,
  },
  statusSelect: {
    borderRadius: 30,
    width: 80,
    height: 80,
    backgroundColor: '#F7F7F7',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusSelected: {
    borderRadius: 30,
    width: 80,
    height: 80,
    backgroundColor: '#FFB443',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentTxt: {
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 20,
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
    color: '#F0F0F0',
    borderRadius: 5,
    backgroundColor: '#202020',
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  noteTxtInput: {
    width: '100%',
    fontSize: 15,
    fontWeight: '400',
    color: '#222222',
    borderRadius: 5,
    backgroundColor: '#F7F7F7',
    height: 120,
    marginTop: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  askFriendMsgInput: {
    width: '100%',
    fontSize: 15,
    fontWeight: '400',
    color: '#222222',
    borderRadius: 5,
    backgroundColor: '#F7F7F7',
    height: 56,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  settingView: {
    paddingVertical: 20,
    width: '100%',
  },
  settingBtn: {
    width: '100%',
    paddingVertical: 10,
  },
  settingBtnTxt: {
    color: '#F0F0F0',
    fontWeight: '600',
    fontSize: 15,
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
});
