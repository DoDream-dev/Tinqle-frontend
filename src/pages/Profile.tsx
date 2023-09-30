import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Keyboard, Image } from 'react-native';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from'react-native-modal';
import ToastScreen from '../components/ToastScreen';
import { RootStackParamList } from '../../AppInner';
import { useAppDispatch } from '../store';
import { RootState } from '../store/reducer';
import { useSelector } from 'react-redux';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import { useFocusEffect } from '@react-navigation/native';

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function Profile({navigation, route}:ProfileScreenProps) {
  const whose = route.params.whose;
  const acId = route.params.accountId;
  // const accountId = route.params.accountId;
  // const dispatch = useAppDispatch();
  const token = useSelector((state:RootState) => state.user.accessToken);
  // const refName = useRef();
  // const [changeName, setChangeName] = useState(false);
  // const [changeStatus, setChangeStatus] = useState(false);
  // const [writeNote, setWriteNote] = useState(false);
  // const [nameIN, setNameIN] = useState('');
  // const [note, setNote] = useState('');
  // const [popup, setPopup] = useState(false);
  // const [status, setStatus] = useState('');
  // const [name, setName] = useState('');
  // const [my, setMy] = useState(route.params.mine);

  const [whoseProfile, setWhoseProfile] = useState(route.params.whose);
  const [alreadyRequestFriend, setAlreadyRequestFriend] = useState(-1);
  const [accountId, setAcoountId] = useState(route.params.accountId);
  // const [alreadyRequestFriend, setAlreadyRequestFriend] = useState(props.alreadyRequestedFriend);

  // modal or not
  const [chageName, setChangeName] = useState(false);
  const [changeStatus, setChangeStatus] = useState(false);
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
  useEffect(() => {
    if (whoseProfile == 0) {
      const getMyProfile = async () => {
        try {
          const response = await axios.get(`${Config.API_URL}/accounts/me`, {headers:{Authorization:`Bearer ${token}`}});
          console.log(response.data)
          setName(response.data.data.nickname);
          setChangeNameVal(response.data.data.nickname);
          setStatus(response.data.data.status.toLowerCase());
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>).response;
          console.log(errorResponse.data);
        }
      };
      getMyProfile();
    }
    else {
      navigation.setOptions({headerRight:()=>(<View></View>)});
      const getProfile = async () => {
        try {
          const response = await axios.get(`${Config.API_URL}/accounts/${accountId}/profile`, {headers:{Authorization:`Bearer ${token}`}});
          // console.log(1)
          console.log(response.data)
          setName(response.data.data.nickname);
          setChangeNameVal(response.data.data.nickname);
          setStatus(response.data.data.status.toLowerCase());
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>).response;
          console.log(errorResponse.data);
        }
      };
      
      getProfile();
    }
  }, [name, status, whoseProfile]);

  useFocusEffect(
    useCallback(()=>{
      setWhoseProfile(whose);
      setAcoountId(acId);
    },[whose, acId, status])
  );

  const postStatus = async (stat:string) => {
    if (stat == status) {return;}
    else {
      try {
        const response = await axios.put(`${Config.API_URL}/accounts/me/status/${stat.toUpperCase()}`, {}, {headers:{Authorization: `Bearer ${token}`}});
        setStatus(response.data.status);
        console.log(response.data)
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse);
      }
    }
  };

  const rename = async (text:string, accountId:number|undefined) => {
    if (text === name) return;
    if (whoseProfile == 0) {
      try {
        const response = await axios.put(`${Config.API_URL}/accounts/me/nickname/${text}`, {nickname:text}, {headers:{Authorization: `Bearer ${token}`}});
        setName(response.data.data.nickname);
        setChangeNameVal(response.data.data.nickname);
        setChangeName(false);
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse.data);
      }
    }
    else {
      try {
        const response = await axios.post(`${Config.API_URL}/friends/nickname/change`, {
          friendAccountId:accountId,
          nickname: text,
        }, {headers:{Authorization: `Bearer ${token}`}});
        setName(response.data.data.friendNickname);
        setChangeNameVal(response.data.data.friendNickname);
        setChangeName(false);
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse.data);
      }
    }
  };

  const sendNote = async () => {
    try {
      // const response = await axios
      console.log('send Note');
      setWriteNote(false);
      setPopup(true);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
    setwriteNoteVal('');
  };

  const askFriend = async () => {
    try {
      const response = await axios.post(`${Config.API_URL}/friendships/request`, {
        accountTargetId:accountId, message:askFriendMsgVal
      },
      {
        headers:{Authorization: `Bearer ${token}`},
      });
      console.log(response.data)
      // popup: 이도님께 친구 요청을 보냈어요!
      setPopup(true);
      setAskFriendMsg(false);
      setAskFriendMsgVal('');
      setAlreadyRequestFriend(1);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  return (
    // <View style={styles.entire}>
    //   <View style={styles.profileView}>
    //     <View style={styles.status}>
    //       <Pressable style={styles.statusBtn} onPress={()=>setChangeStatus(true)} disabled={!my}>
    //         {status == 'smile' && <Image style={{height:90, width:90}} source={require('../../assets/image/status01smile.png')} />}
    //         {status == 'happy' && <Image style={{height:90, width:90}} source={require('../../assets/image/status02happy.png')} />}
    //         {status == 'sad' && <Image style={{height:90, width:90}} source={require('../../assets/image/status03sad.png')} />}
    //         {status == 'mad' && <Image style={{height:90, width:90}} source={require('../../assets/image/status04mad.png')} />}
    //         {status == 'exhausted' && <Image style={{height:90, width:90}} source={require('../../assets/image/status05exhausted.png')} />}
    //         {status == 'coffee' && <Image style={{height:90, width:90}} source={require('../../assets/image/status06coffee.png')} />}
    //         {status == 'meal' && <Image style={{height:90, width:90}} source={require('../../assets/image/status07meal.png')} />}
    //         {status == 'alcohol' && <Image style={{height:90, width:90}} source={require('../../assets/image/status08alcohol.png')} />}
    //         {status == 'chicken' && <Image style={{height:90, width:90}} source={require('../../assets/image/status09chicken.png')} />}
    //         {status == 'sleep' && <Image style={{height:90, width:90}} source={require('../../assets/image/status10sleep.png')} />}
    //         {status == 'work' && <Image style={{height:90, width:90}} source={require('../../assets/image/status11work.png')} />}
    //         {status == 'study' && <Image style={{height:90, width:90}} source={require('../../assets/image/status12study.png')} />}
    //         {status == 'movie' && <Image style={{height:90, width:90}} source={require('../../assets/image/status13movie.png')} />}
    //         {status == 'move' && <Image style={{height:90, width:90}} source={require('../../assets/image/status14move.png')} />}
    //         {status == 'dance' && <Image style={{height:90, width:90}} source={require('../../assets/image/status15dance.png')} />}
    //         {status == 'read' && <Image style={{height:90, width:90}} source={require('../../assets/image/status16read.png')} />}
    //         {status == 'walk' && <Image style={{height:90, width:90}} source={require('../../assets/image/status17walk.png')} />}
    //         {status == 'travel' && <Image style={{height:90, width:90}} source={require('../../assets/image/status18travel.png')} />}
    //       </Pressable>
    //       <View style={styles.nameView}>
    //         <Text style={styles.nameTxt}>{name}</Text>
    //         <Pressable style={styles.changeNameBtn} onPress={()=>{setChangeName(true);}}>
    //           <MaterialCommunity name='pencil-outline' size={14} color={'#848484'} />
    //         </Pressable>
    //       </View>
    //     </View>
    //     <View style={styles.btnView}>
    //       {my && <Pressable style={styles.manageFriendBtn} onPress={()=>navigation.navigate('MyFriendList')}>
    //         <Text style={styles.manageFriendBtnTxt}>친구 관리</Text>
    //       </Pressable>}
    //       {my ? <Pressable style={styles.noteBoxBtn} onPress={()=>navigation.navigate('NoteBox')}>
    //         <Text style={styles.noteBoxBtnTxt}>익명 쪽지함</Text>
    //       </Pressable>
    //       : <Pressable style={styles.sendNoteBtn} onPress={()=>setWriteNote(true)}>
    //         <Text style={styles.noteBoxBtnTxt}>익명 쪽지 보내기</Text>  
    //       </Pressable>}
    //     </View>
    //   </View>
    //   <Modal isVisible={changeName} avoidKeyboard={true} backdropColor='#222222' backdropOpacity={0.5}>
    //     <Pressable style={styles.modalBGView} onPress={()=>Keyboard.dismiss()}>
    //       <View style={styles.modalView}>
    //         {my && <Text style={styles.modalTitleTxt}>내 이름 바꾸기</Text>}
    //         {!my && <Text style={styles.modalTitleTxt}>친구 이름 바꾸기</Text>}
    //         <View style={styles.namechange}>
    //           <TextInput 
    //             style={styles.nameChangeTxtInput}
    //             onChangeText={(text:string)=>{setNameIN(text)}}
    //             blurOnSubmit={true}
    //             maxLength={20}
    //             value={nameIN}
    //             autoFocus={true}
    //             onSubmitEditing={()=>{
    //               if (my) {rename(nameIN, undefined);}
    //               else {rename(nameIN, accountId);}
    //             }}
    //           />
    //         </View>
    //         <View style={styles.modalBtnView}>
    //           <Pressable style={styles.manageFriendBtn} onPress={()=>{setChangeName(false); setNameIN(name);}}>
    //             <Text style={styles.manageFriendBtnTxt}>취소</Text>
    //           </Pressable>
    //           <Pressable style={styles.noteBoxBtn} onPress={()=>{
    //             if (my) {rename(nameIN, undefined);}
    //             else {rename(nameIN, accountId);}
    //           }}>
    //             <Text style={styles.noteBoxBtnTxt}>완료</Text>
    //           </Pressable>
    //         </View>
    //       </View>
    //     </Pressable>
    //   </Modal>
    //   <Modal isVisible={changeStatus} avoidKeyboard={true} backdropColor='#222222' backdropOpacity={0.5}>
    //     <Pressable style={styles.modalBGView} onPress={()=>setChangeStatus(false)}>
    //       <View style={styles.modalView2}>
    //         <Pressable onPress={()=>{setStatus('smile'); setChangeStatus(false); postStatus('smile');}} style={status == 'smile' ? styles.statusSelected : styles.statusSelect}>
    //           <Image style={styles.statusImg} source={require('../../assets/image/status01smile.png')}/>
    //         </Pressable>
    //         <Pressable onPress={()=>{setStatus('happy'); setChangeStatus(false);}} style={status == 'happy' ? styles.statusSelected : styles.statusSelect}>
    //           <Image style={styles.statusImg} source={require('../../assets/image/status02happy.png')}/>
    //         </Pressable>
    //         <Pressable onPress={()=>{setStatus('sad'); setChangeStatus(false);}} style={status == 'sad' ? styles.statusSelected : styles.statusSelect}>
    //           <Image style={styles.statusImg} source={require('../../assets/image/status03sad.png')}/>
    //         </Pressable>
    //         <Pressable onPress={()=>{setStatus('mad'); setChangeStatus(false);}} style={status == 'mad' ? styles.statusSelected : styles.statusSelect}>
    //           <Image style={styles.statusImg} source={require('../../assets/image/status04mad.png')}/>
    //         </Pressable>
    //         <Pressable onPress={()=>{setStatus('exhausted'); setChangeStatus(false);}} style={status == 'exhausted' ? styles.statusSelected : styles.statusSelect}>
    //           <Image style={styles.statusImg} source={require('../../assets/image/status05exhausted.png')}/>
    //         </Pressable>
    //         <Pressable onPress={()=>{setStatus('coffee'); setChangeStatus(false);}} style={status == 'coffee' ? styles.statusSelected : styles.statusSelect}>
    //           <Image style={styles.statusImg} source={require('../../assets/image/status06coffee.png')}/>
    //         </Pressable>
    //         <Pressable onPress={()=>{setStatus('meal'); setChangeStatus(false);}} style={status == 'meal' ? styles.statusSelected : styles.statusSelect}>
    //           <Image style={styles.statusImg} source={require('../../assets/image/status07meal.png')}/>
    //         </Pressable>
    //         <Pressable onPress={()=>{setStatus('alcohol'); setChangeStatus(false);}} style={status == 'alcohol' ? styles.statusSelected : styles.statusSelect}>
    //           <Image style={styles.statusImg} source={require('../../assets/image/status08alcohol.png')}/>
    //         </Pressable>
    //         <Pressable onPress={()=>{setStatus('chicken'); setChangeStatus(false);}} style={status == 'chicken' ? styles.statusSelected : styles.statusSelect}>
    //           <Image style={styles.statusImg} source={require('../../assets/image/status09chicken.png')}/>
    //         </Pressable>
    //         <Pressable onPress={()=>{setStatus('sleep'); setChangeStatus(false);}} style={status == 'sleep' ? styles.statusSelected : styles.statusSelect}>
    //           <Image style={styles.statusImg} source={require('../../assets/image/status10sleep.png')}/>
    //         </Pressable>
    //         <Pressable onPress={()=>{setStatus('work'); setChangeStatus(false);}} style={status == 'work' ? styles.statusSelected : styles.statusSelect}>
    //           <Image style={styles.statusImg} source={require('../../assets/image/status11work.png')}/>
    //         </Pressable>
    //         <Pressable onPress={()=>{setStatus('study'); setChangeStatus(false);}} style={status == 'study' ? styles.statusSelected : styles.statusSelect}>
    //           <Image style={styles.statusImg} source={require('../../assets/image/status12study.png')}/>
    //         </Pressable>
    //         <Pressable onPress={()=>{setStatus('movie'); setChangeStatus(false);}} style={status == 'movie' ? styles.statusSelected : styles.statusSelect}>
    //           <Image style={styles.statusImg} source={require('../../assets/image/status13movie.png')}/>
    //         </Pressable>
    //         <Pressable onPress={()=>{setStatus('move'); setChangeStatus(false);}} style={status == 'move' ? styles.statusSelected : styles.statusSelect}>
    //           <Image style={styles.statusImg} source={require('../../assets/image/status14move.png')}/>
    //         </Pressable>
    //         <Pressable onPress={()=>{setStatus('dance'); setChangeStatus(false);}} style={status == 'dance' ? styles.statusSelected : styles.statusSelect}>
    //           <Image style={styles.statusImg} source={require('../../assets/image/status15dance.png')}/>
    //         </Pressable>
    //         <Pressable onPress={()=>{setStatus('read'); setChangeStatus(false);}} style={status == 'read' ? styles.statusSelected : styles.statusSelect}>
    //           <Image style={styles.statusImg} source={require('../../assets/image/status16read.png')}/>
    //         </Pressable>
    //         <Pressable onPress={()=>{setStatus('walk'); setChangeStatus(false);}} style={status == 'walk' ? styles.statusSelected : styles.statusSelect}>
    //           <Image style={styles.statusImg} source={require('../../assets/image/status17walk.png')}/>
    //         </Pressable>
    //         <Pressable onPress={()=>{setStatus('travel'); setChangeStatus(false);}} style={status == 'travel' ? styles.statusSelected : styles.statusSelect}>
    //           <Image style={styles.statusImg} source={require('../../assets/image/status18travel.png')}/>
    //         </Pressable>
    //       </View>
    //     </Pressable>
    //   </Modal>
    //   <Modal isVisible={writeNote} avoidKeyboard={true} backdropColor='#222222' backdropOpacity={0.5}>
    //     <Pressable style={styles.modalBGView} onPress={()=>Keyboard.dismiss()}>
    //       <View style={styles.modalView}>
    //         <Text style={styles.modalTitleTxt}>익명 쪽지 보내기</Text>
    //         <View style={styles.namechange}>
    //           <TextInput 
    //             style={styles.noteTxtInput}
    //             onChangeText={(text:string)=>{setNote(text)}}
    //             blurOnSubmit={true}
    //             maxLength={100}
    //             value={note}
    //             autoFocus={true}
    //             onSubmitEditing={()=>{
    //               Keyboard.dismiss();
    //             }}
    //           />
    //         </View>
    //         <View style={styles.modalBtnView}>
    //           <Pressable style={styles.manageFriendBtn} onPress={()=>{setWriteNote(false);}}>
    //             <Text style={styles.manageFriendBtnTxt}>취소</Text>
    //           </Pressable>
    //           <Pressable style={styles.noteBoxBtn} onPress={()=>{sendNote()}}>
    //             <Text style={styles.noteBoxBtnTxt}>완료</Text>
    //           </Pressable>
    //         </View>
    //       </View>
    //     </Pressable>
    //   </Modal>
    //   {popup && <ToastScreen
    //     height={21}
    //     marginBottom={48}
    //     onClose={()=>setPopup(false)}
    //     message={name + " 님께 쪽지를 전해드렸어요!"}
    //   />}
    // </View>
    <View style={styles.entire}>
      <View style={styles.profileView}>
        <View style={styles.statusView}>
          <Pressable style={styles.statusBtn} disabled={whoseProfile != 0} onPress={()=>setChangeStatus(true)}>
            {status == 'smile' && <Image style={{height:90, width:90}} source={require('../../assets/image/status01smile.png')} />}
            {status == 'happy' && <Image style={{height:90, width:90}} source={require('../../assets/image/status02happy.png')} />}
            {status == 'sad' && <Image style={{height:90, width:90}} source={require('../../assets/image/status03sad.png')} />}
            {status == 'mad' && <Image style={{height:90, width:90}} source={require('../../assets/image/status04mad.png')} />}
            {status == 'exhausted' && <Image style={{height:90, width:90}} source={require('../../assets/image/status05exhausted.png')} />}
            {status == 'coffee' && <Image style={{height:90, width:90}} source={require('../../assets/image/status06coffee.png')} />}
            {status == 'meal' && <Image style={{height:90, width:90}} source={require('../../assets/image/status07meal.png')} />}
            {status == 'alcohol' && <Image style={{height:90, width:90}} source={require('../../assets/image/status08alcohol.png')} />}
            {status == 'chicken' && <Image style={{height:90, width:90}} source={require('../../assets/image/status09chicken.png')} />}
            {status == 'sleep' && <Image style={{height:90, width:90}} source={require('../../assets/image/status10sleep.png')} />}
            {status == 'work' && <Image style={{height:90, width:90}} source={require('../../assets/image/status11work.png')} />}
            {status == 'study' && <Image style={{height:90, width:90}} source={require('../../assets/image/status12study.png')} />}
            {status == 'movie' && <Image style={{height:90, width:90}} source={require('../../assets/image/status13movie.png')} />}
            {status == 'move' && <Image style={{height:90, width:90}} source={require('../../assets/image/status14move.png')} />}
            {status == 'dance' && <Image style={{height:90, width:90}} source={require('../../assets/image/status15dance.png')} />}
            {status == 'read' && <Image style={{height:90, width:90}} source={require('../../assets/image/status16read.png')} />}
            {status == 'walk' && <Image style={{height:90, width:90}} source={require('../../assets/image/status17walk.png')} />}
            {status == 'travel' && <Image style={{height:90, width:90}} source={require('../../assets/image/status18travel.png')} />}
          </Pressable>
        </View>
        <View style={styles.nameView}>
          <Text style={whoseProfile !=2 ? styles.nameTxt : styles.nameTxtWithoutPencil}>{name}</Text>
          {whoseProfile != 2 &&<Pressable style={styles.changeNameBtn} onPress={()=>setChangeName(true)}>
            <MaterialCommunity name='pencil-outline' size={14} color={'#848484'} />
          </Pressable>}
        </View>
        {whoseProfile == 0 && <View style={styles.btnView}>
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
          <Pressable style={styles.btnYellow} onPress={askFriend}>
            <Text style={styles.btnYellowTxt}>친구 요청하기</Text>
          </Pressable>}
          <View style={{flex:0.4}}></View>
        </View>}
      </View>
      {/* modal for changin status */}
      <Modal isVisible={changeStatus} backdropColor='#222222' backdropOpacity={0.5}>
        <Pressable style={styles.modalBGView} onPress={()=>Keyboard.dismiss()}>
          <View style={styles.modalView2}>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('smile');}} style={status == 'smile' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status01smile.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('happy');}} style={status == 'happy' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status02happy.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('sad');}} style={status == 'sad' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status03sad.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('mad');}} style={status == 'mad' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status04mad.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('exhausted');}} style={status == 'exhausted' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status05exhausted.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('coffee');}} style={status == 'coffee' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status06coffee.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('meal');}} style={status == 'meal' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status07meal.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('alcohol');}} style={status == 'alcohol' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status08alcohol.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('chicken');}} style={status == 'chicken' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status09chicken.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('sleep');}} style={status == 'sleep' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status10sleep.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('work');}} style={status == 'work' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status11work.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('study');}} style={status == 'study' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status12study.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('movie');}} style={status == 'movie' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status13movie.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('move');}} style={status == 'move' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status14move.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('dance');}} style={status == 'dance' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status15dance.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('read');}} style={status == 'read' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status16read.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('walk');}} style={status == 'walk' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status17walk.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setChangeStatus(false); postStatus('travel');}} style={status == 'travel' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status18travel.png')}/>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
      {/* modal for changing name */}
      <Modal isVisible={chageName} avoidKeyboard={true} backdropColor='#222222' backdropOpacity={0.5}>
        <Pressable style={styles.modalBGView} onPress={()=>Keyboard.dismiss()}>
          <View style={styles.modalView}>
            {whoseProfile == 0 && <Text style={styles.modalTitleTxt}>내 이름 바꾸기</Text>}
            {whoseProfile == 1 && <Text style={styles.modalTitleTxt}>친구 이름 바꾸기</Text>}
            <View style={styles.changeView}>
              <TextInput 
                style={styles.nameChangeTxtInput}
                onChangeText={(text:string)=>{setChangeNameVal(text)}}
                blurOnSubmit={true}
                maxLength={20}
                value={chageNameVal}
                autoFocus={true}
                onSubmitEditing={()=>{
                  if (whoseProfile == 0) {rename(chageNameVal, undefined);}
                  else {rename(chageNameVal, accountId);}
                }}
              />
            </View>
            <View style={styles.modalBtnView}>
              <Pressable style={styles.btnWhite} onPress={()=>{setChangeName(false); setChangeNameVal(name);}}>
                <Text style={styles.btnWhiteTxt}>취소</Text>
              </Pressable>
              <Pressable style={styles.btnYellow} onPress={()=>{
                if (whoseProfile == 0) {rename(chageNameVal, undefined);}
                else {rename(chageNameVal, accountId);}
              }}>
                <Text style={styles.btnYellowTxt}>완료</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
      {/* modal for sending msg */}
      <Modal isVisible={whoseProfile == 1 ? writeNote : askFriendMsg} avoidKeyboard={true} backdropColor='#222222' backdropOpacity={0.5}>
        <Pressable style={styles.modalBGView} onPress={()=>Keyboard.dismiss()}>
          <View style={styles.modalView}>
            {whoseProfile == 1 && <Text style={styles.modalTitleTxt}>익명 쪽지 보내기</Text>}
            {whoseProfile == 2 && <Text style={styles.modalTitleTxt}>{name}</Text>}
            {whoseProfile == 2 && <Text style={styles.modalContentTxt}>친구가 나를 알아볼 수 있도록 인사를 건네주세요!</Text>}
            <View style={styles.changeView}>
              <TextInput 
                style={whoseProfile == 1 ? styles.noteTxtInput : styles.askFriendMsgInput}
                onChangeText={(text:string)=>{
                  if (whoseProfile == 1) setwriteNoteVal(text);
                  else setAskFriendMsgVal(text);
                }}
                blurOnSubmit={true}
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
              {whoseProfile == 1 && <Pressable style={styles.btnYellow} onPress={sendNote}>
                <Text style={styles.btnYellowTxt}>완료</Text>
              </Pressable>}
              {whoseProfile == 2 && <Pressable style={styles.btnYellowBig} onPress={askFriend}>
                <Text style={styles.btnYellowTxt}>친구요청 보내기</Text>
              </Pressable>}
            </View>
          </View>
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
      />}
    </View>
  );
}

// const styles = StyleSheet.create({
//   entire: {
//     flex: 1,
//     alignItems: 'center',
//     paddingTop: 10,
//     paddingHorizontal: 16,
//   },
//   profileView:{
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     width: '100%',
//   },
//   status:{
//     paddingTop: 40,
//     paddingBottom: 16,
//     alignItems:'center'
//   },
//   statusBtn:{
//     justifyContent: 'center',
//     alignItems:'center',
//     backgroundColor:'#F7F7F7',
//     width: 120,
//     height: 120,
//     borderRadius: 30,
//     marginBottom: 12,
//   },
//   nameView:{
//     flexDirection: 'row',
//     justifyContent:'center',
//     alignItems:'baseline',
//   },
//   nameTxt:{
//     color:'#222222',
//     fontWeight: '600',
//     fontSize:22,
//     marginRight:2,
//     marginLeft:16
//   },
//   changeNameBtn:{},
//   btnView:{
//     flexDirection: 'row',
//     justifyContent: 'center',
//     paddingHorizontal: 48,
//     paddingBottom:40,
//   },
//   manageFriendBtn:{
//     flex:1,
//     justifyContent: 'center',
//     alignItems:'center',
//     height: 44,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#FFB443',
//     backgroundColor: '#FFFFFF',
//     marginRight: 4,
//   },
//   manageFriendBtnTxt:{
//     color:'#FFB443',
//     fontSize:15,
//     fontWeight:'600'
//   },
//   noteBoxBtn:{
//     flex:1,
//     justifyContent: 'center',
//     alignItems:'center',
//     height: 44,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#FFB443',
//     backgroundColor: '#FFB443',
//     marginLeft: 4,
//   },
//   sendNoteBtn:{
//     // flex:1,
//     justifyContent:'center',
//     alignItems:'center',
//     height: 44,
//     width: 120,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#FFB443',
//     backgroundColor: '#FFB443',
//     marginLeft: 4,
//   },
//   noteBoxBtnTxt:{
//     color:'#FFFFFF',
//     fontSize:15,
//     fontWeight:'600'
//   },
//   modalBGView:{
//     width:"100%", 
//     alignItems:'center',
//     paddingHorizontal:36,
//   },
//   modalView:{
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems:'center',
//     paddingTop: 30,
//     paddingHorizontal: 16,
//     paddingBottom: 24,
//     // width:'100%'
//   },
//   modalView2:{
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     width:303,
//     height: 580,
//     marginHorizontal: 36,
//     justifyContent: 'space-between',
//     alignItems:'center',
//     padding: 20,
//     flexWrap:'wrap',
//     flexDirection:'row'
//   },
//   statusImg:{
//     height:60,
//     width:60,
//   },
//   modalTitleTxt:{
//     color:'#222222',
//     fontSize:15,
//     fontWeight:'600',
//     marginBottom:20
//   },
//   namechange:{
//     width:'100%',
//     flexDirection:'row',
//     // backgroundColor:'yellow',
//   },
//   nameChangeTxtInput:{
//     width:'100%',
//     fontSize:15,
//     fontWeight:'400',
//     color:'#222222',
//     borderRadius: 5,
//     backgroundColor:'#F7F7F7',
//     height:40,
//     paddingHorizontal:10,
//     marginBottom:20
//   },
//   noteTxtInput:{
//     width:'100%',
//     fontSize:15,
//     fontWeight:'400',
//     color:'#222222',
//     borderRadius: 5,
//     backgroundColor:'#F7F7F7',
//     height:120,
//     paddingHorizontal:10,
//     marginBottom:20,
//     textAlignVertical:'top'
//   },
//   modalBtnView:{
//     flexDirection:'row',
//     width:'100%',
//     // backgroundColor:'pink'
//   },
//   statusSelect:{
//     borderRadius: 30,
//     width:80,
//     height:80,
//     backgroundColor:'#F7F7F7',
//     marginBottom: 12,
//     justifyContent:'center',
//     alignItems:'center',
//   },
//   statusSelected:{
//     borderRadius: 30,
//     width:80,
//     height:80,
//     backgroundColor:'#8222DD',
//     marginBottom: 12,
//     justifyContent:'center',
//     alignItems:'center',
//   },
// });

const styles = StyleSheet.create({
  entire:{
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  profileView:{
    width: '100%',
    backgroundColor:'#FFFFFF',
    paddingVertical:40,
    alignItems:'center'
  },
  statusView:{
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center'
  },
  statusBtn:{
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#F7F7F7',
    width: '100%',
    borderRadius: 30,
  },
  nameView:{
    flexDirection: 'row',
    paddingTop:12,
    paddingBottom:16,
    justifyContent:'center',
    alignItems:'center'
  },
  nameTxt:{
    color:'#222222',
    fontWeight: '600',
    fontSize:22,
    marginRight:2,
    marginLeft:16
  },
  nameTxtWithoutPencil:{
    color:'#222222',
    fontWeight: '600',
    fontSize:22,
    marginRight:2,
  },
  changeNameBtn:{},
  btnView:{
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 44,
  },
  btnWhite:{
    height: 44,
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFB443',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
  },
  btnYellow:{
    height: 44,
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFB443',
    backgroundColor: '#FFB443',
    marginHorizontal: 4,
  },
  btnYellowBig:{
    height: 44,
    flex:1.8,
    justifyContent: 'center',
    alignItems:'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFB443',
    backgroundColor: '#FFB443',
    marginHorizontal: 4,
  },
  btnWhiteTxt:{
    color:'#FFB443',
    fontSize:15,
    fontWeight:'600'
  },
  btnYellowTxt:{
    color:'#FFFFFF',
    fontSize:15,
    fontWeight:'600'
  },
  modalBGView:{
    width:"100%", 
    alignItems:'center',
    paddingHorizontal:36,
  },
  modalView:{
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems:'center',
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  modalView2:{
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width:303,
    height: 580,
    marginHorizontal: 36,
    justifyContent: 'space-between',
    alignItems:'center',
    padding: 20,
    flexWrap:'wrap',
    flexDirection:'row'
  },
  statusSelect:{
    borderRadius: 30,
    width:80,
    height:80,
    backgroundColor:'#F7F7F7',
    marginBottom: 12,
    justifyContent:'center',
    alignItems:'center',
  },
  statusSelected:{
    borderRadius: 30,
    width:80,
    height:80,
    backgroundColor:'#8222DD',
    marginBottom: 12,
    justifyContent:'center',
    alignItems:'center',
  },
  statusImg:{
    height:60,
    width:60,
  },
  modalTitleTxt:{
    color:'#222222',
    fontSize:15,
    fontWeight:'600',
    marginBottom:10
  },
  modalContentTxt:{
    color: '#848484',
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    // marginBottom: 12
  },
  changeView:{
    width:'100%',
    flexDirection:'row',
  },
  modalBtnView:{
    flexDirection:'row',
    width:'100%',
  },
  nameChangeTxtInput:{
    width:'100%',
    fontSize:15,
    fontWeight:'400',
    color:'#222222',
    borderRadius: 5,
    backgroundColor:'#F7F7F7',
    height:40,
    paddingHorizontal:10,
    marginBottom:20,
    marginTop:10,
  },
  noteTxtInput:{
    width:'100%',
    fontSize:15,
    fontWeight:'400',
    color:'#222222',
    borderRadius: 5,
    backgroundColor:'#F7F7F7',
    height:120,
    marginTop:10,
    paddingHorizontal:10,
    marginBottom:20,
    textAlignVertical:'top'
  },
  askFriendMsgInput:{
    width:'100%',
    fontSize:15,
    fontWeight:'400',
    color:'#222222',
    borderRadius: 5,
    backgroundColor:'#F7F7F7',
    height:56,
    paddingHorizontal:10,
    marginTop:10,
    marginBottom:20,
    textAlignVertical:'top'
  },

});