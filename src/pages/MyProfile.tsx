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
import Clipboard from '@react-native-clipboard/clipboard';
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

  // modal or not
  const [chageName, setChangeName] = useState(false);
  const [changeStatus, setChangeStatus] = useState(false);
  const [policy, setPolicy] = useState('');
  const [deleteAccount, setDeleteAccount] = useState(false);

  // const [checkNoteBox, setCheckNoteBox] = useState(false);
  const [writeNote, setWriteNote] = useState(false);
  const [askFriendMsg, setAskFriendMsg] = useState(false);
  const [popup, setPopup] = useState(false);

  // input value
  const [chageNameVal, setChangeNameVal] = useState('');
  const [writeNoteVal, setwriteNoteVal] = useState('');
  const [askFriendMsgVal, setAskFriendMsgVal] = useState('');

  // original value
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const [profileImg, setProfileImg] = useState(null);

  const inp1 = useRef();
  const inp2 = useRef();

  const dispatch = useAppDispatch();

  useEffect(() => {
    // if (whoseProfile == 0) {
    const getMyProfile = async () => {
      try {
        const response = await axios.get(`${Config.API_URL}/accounts/me`);
        setName(response.data.data.nickname);
        setChangeNameVal(response.data.data.nickname);
        setStatus(response.data.data.status.toLowerCase());
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
  }, [name, status]);

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

  return (
    <ScrollView style={styles.entire}>
      <View style={styles.profileView}>
        <Profile
          status={status}
          name={name}
          restatusModal={setChangeStatus}
          renameModal={setChangeName}
          profileImg={profileImg}
          friendshipRelation="me"
        />
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
        {/* {whoseProfile == 0 && <View style={styles.btnView}>
          <Pressable style={styles.btnWhite} onPress={()=>navigation.navigate('MyFriendList')}>
            <Text style={styles.btnWhiteTxt}>친구 관리</Text>
          </Pressable>
          <Pressable style={styles.btnYellow} onPress={()=>navigation.navigate('NoteBox')}>
            <Text style={styles.btnYellowTxt}>익명 쪽지함</Text>
          </Pressable>
        </View>}
        {whoseProfile == 1 && <View style={styles.btnView}>
          <View style={{flex:0.4}}></View>
          <Pressable style={styles.btnYellow} onPress={()=>setWriteNote(true)}>
            <Text style={styles.btnYellowTxt}>익명 쪽지 보내기</Text>
          </Pressable>
          <View style={{flex:0.4}}></View>
        </View>}
        {whoseProfile == 2 && <View style={styles.btnView}>
          <View style={{flex:0.4}}></View>
          {alreadyRequestFriend == 1 ? <Pressable style={styles.btnWhite} disabled={true}>
            <Text style={styles.btnWhiteTxt}>친구 수락 대기 중</Text>
          </Pressable> :
          <Pressable style={styles.btnYellow} onPress={()=>setAskFriendMsg(true)}>
            <Text style={styles.btnYellowTxt}>친구 요청하기</Text>
          </Pressable>}
          <View style={{flex:0.4}}></View>
        </View>} */}
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
        {/* <Pressable style={styles.settingBtn} onPress={()=>{console.log('change id')}}>
          <Text style={styles.settingBtnTxt}>내 아이디 변경하기</Text>
        </Pressable> */}
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
        backdropColor="#222222"
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
            <Text style={styles.modalTitleTxt}>내 이름 바꾸기</Text>
            <View style={styles.changeView}>
              <TextInput
                ref={inp1}
                style={styles.nameChangeTxtInput}
                onChangeText={(text: string) => {
                  setChangeNameVal(text);
                }}
                blurOnSubmit={true}
                maxLength={10}
                value={chageNameVal}
                autoFocus={Platform.OS === 'ios' ? true : false}
                onSubmitEditing={() => {
                  rename(chageNameVal.trim());
                }}
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
                disabled={chageNameVal.trim() == ''}
                onPress={() => {
                  if (chageNameVal != '') {
                    if (chageNameVal == name) {
                      setChangeName(false);
                    } else {
                      rename(chageNameVal.trim());
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
        backdropColor="#222222"
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

      {/* modal for changin status */}
      {/* <Modal isVisible={changeStatus} backdropColor='#222222' backdropOpacity={0.5} onBackButtonPress={()=>setChangeStatus(false)}>
        <Pressable style={styles.modalBGView} onPress={()=>{Keyboard.dismiss(); setChangeStatus(false);}}>
          <Pressable onPress={(e)=>e.stopPropagation()} style={styles.modalView2}>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('smile');}} style={status == 'smile' ? styles.statusSelected : styles.statusSelect}>
              <SvgXml width={60} height={60} xml={svgXml.status.smile} />
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('happy');}} style={status == 'happy' ? styles.statusSelected : styles.statusSelect}>
              <SvgXml width={60} height={60} xml={svgXml.status.happy} />
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('sad');}} style={status == 'sad' ? styles.statusSelected : styles.statusSelect}>
              <SvgXml width={60} height={60} xml={svgXml.status.sad} />
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('mad');}} style={status == 'mad' ? styles.statusSelected : styles.statusSelect}>
              <SvgXml width={60} height={60} xml={svgXml.status.mad} />
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('exhausted');}} style={status == 'exhausted' ? styles.statusSelected : styles.statusSelect}>
              <SvgXml width={60} height={60} xml={svgXml.status.exhauseted} />
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('coffee');}} style={status == 'coffee' ? styles.statusSelected : styles.statusSelect}>
              <SvgXml width={60} height={60} xml={svgXml.status.coffee} />
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('meal');}} style={status == 'meal' ? styles.statusSelected : styles.statusSelect}>
              <SvgXml width={60} height={60} xml={svgXml.status.meal} />
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('alcohol');}} style={status == 'alcohol' ? styles.statusSelected : styles.statusSelect}>
              <SvgXml width={60} height={60} xml={svgXml.status.alcohol} />
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('chicken');}} style={status == 'chicken' ? styles.statusSelected : styles.statusSelect}>
              <SvgXml width={60} height={60} xml={svgXml.status.chicken} />
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('sleep');}} style={status == 'sleep' ? styles.statusSelected : styles.statusSelect}>
              <SvgXml width={60} height={60} xml={svgXml.status.sleep} />
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('work');}} style={status == 'work' ? styles.statusSelected : styles.statusSelect}>
              <SvgXml width={60} height={60} xml={svgXml.status.work} />
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('study');}} style={status == 'study' ? styles.statusSelected : styles.statusSelect}>
              <SvgXml width={60} height={60} xml={svgXml.status.study} />
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('movie');}} style={status == 'movie' ? styles.statusSelected : styles.statusSelect}>
              <SvgXml width={60} height={60} xml={svgXml.status.movie} />
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('move');}} style={status == 'move' ? styles.statusSelected : styles.statusSelect}>
              <SvgXml width={60} height={60} xml={svgXml.status.move} />
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('dance');}} style={status == 'dance' ? styles.statusSelected : styles.statusSelect}>
              <SvgXml width={60} height={60} xml={svgXml.status.dance} />
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('read');}} style={status == 'read' ? styles.statusSelected : styles.statusSelect}>
              <SvgXml width={60} height={60} xml={svgXml.status.read} />
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('walk');}} style={status == 'walk' ? styles.statusSelected : styles.statusSelect}>
              <SvgXml width={60} height={60} xml={svgXml.status.walk} />
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('travel');}} style={status == 'travel' ? styles.statusSelected : styles.statusSelect}>
              <SvgXml width={60} height={60} xml={svgXml.status.travel} />
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal> */}
      {/* modal for sending msg */}
      {/* <Modal isVisible={whoseProfile == 1 ? writeNote : askFriendMsg} onBackButtonPress={()=>{if (whoseProfile == 1) setWriteNote(false); else setAskFriendMsg(false)}} avoidKeyboard={true} backdropColor='#222222' backdropOpacity={0.5} onModalShow={()=>{inp2?.current?.focus();}}>
        <Pressable style={styles.modalBGView} onPress={()=>{Keyboard.dismiss(); if(whoseProfile == 1) setWriteNote(false); else setAskFriendMsg(false);}}>
          <Pressable onPress={(e)=>e.stopPropagation()} style={styles.modalView}>
            {whoseProfile == 1 && <Text style={styles.modalTitleTxt}>익명 쪽지 보내기</Text>}
            {whoseProfile == 2 && <Text style={styles.modalTitleTxt}>{name}</Text>}
            {whoseProfile == 2 && <Text style={styles.modalContentTxt}>친구가 나를 알아볼 수 있도록 인사를 건네주세요!</Text>}
            <View style={styles.changeView}>
              <TextInput 
                ref={inp2}
                style={whoseProfile == 1 ? styles.noteTxtInput : styles.askFriendMsgInput}
                onChangeText={(text:string)=>{
                  if (whoseProfile == 1) setwriteNoteVal(text);
                  else setAskFriendMsgVal(text);
                }}
                blurOnSubmit={true}
                placeholder={whoseProfile == 2 ? '우리 친구해요!' : ''}
                placeholderTextColor={'#848484'}
                maxLength={whoseProfile == 1 ? 100 : 30}
                value={whoseProfile == 1 ? writeNoteVal : askFriendMsgVal}
                autoFocus={true}
                onSubmitEditing={()=>{
                  Keyboard.dismiss();
                }}
              />
            </View>
            <View style={styles.modalBtnView}>
              <Pressable style={styles.btnWhite} onPress={()=>{
                if (whoseProfile == 1) setWriteNote(false);
                else setAskFriendMsg(false);
              }}>
                {whoseProfile == 1 && <Text style={styles.btnWhiteTxt}>취소</Text>}
                {whoseProfile == 2 && <Text style={styles.btnWhiteTxt}>닫기</Text>}
              </Pressable>
              {whoseProfile == 1 && <Pressable style={styles.btnYellow} onPress={()=>{if (writeNoteVal != '') sendNote();}}>
                <Text style={styles.btnYellowTxt}>완료</Text>
              </Pressable>}
              {whoseProfile == 2 && <Pressable style={styles.btnYellowBig} onPress={()=>{if (askFriendMsgVal != '') askFriend();}}>
                <Text style={styles.btnYellowTxt}>친구요청 보내기</Text>
              </Pressable>}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      {whoseProfile == 1 && popup && <ToastScreen
        height = {21}
        marginBottom={48}
        onClose={()=>setPopup(false)}
        message={`${name}님께 쪽지를 전해드렸어요!`}
      />}
      {whoseProfile == 2 && popup && <ToastScreen
        height = {21}
        marginBottom={48}
        onClose={()=>setPopup(false)}
        message={`${name}님께 친구 요청을 보냈어요!`}
      />} */}
    </ScrollView>
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
    paddingVertical: 40,
    alignItems: 'center',
    borderRadius: 10,
    position: 'relative',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 303,
    height: 580,
    marginHorizontal: 36,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    flexWrap: 'wrap',
    flexDirection: 'row',
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
});
