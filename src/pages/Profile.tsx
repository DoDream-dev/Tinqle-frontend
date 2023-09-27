import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TextInput, Keyboard, Image } from 'react-native';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import { RootStackParamList } from '../../AppInner';
import { useAppDispatch } from '../store';
import { RootState } from '../store/reducer';
import { useSelector } from 'react-redux';
import userSlice from '../slices/user';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function Profile({navigation, route}:ProfileScreenProps) {
  const mine = route.params.mine;
  const accountId = route.params.accountId;
  const dispatch = useAppDispatch();
  const token = useSelector((state:RootState) => state.user.accessToken);
  const refName = useRef();
  const [changeName, setChangeName] = useState(false);
  const [changeStatus, setChangeStatus] = useState(false);
  const [nameIN, setNameIN] = useState('');

  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  useEffect(() => {
    if (mine) {
      const getMyProfile = async () => {
        try {
          const response = await axios.get(`${Config.API_URL}/accounts/me`, {headers:{Authorization:`Bearer ${token}`}});
          console.log(response.data)
          setName(response.data.data.nickname);
          setNameIN(name);
          setStatus(response.data.data.status.toLowerCase());
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>).response;
          console.log(errorResponse.data);
        }
      };
      getMyProfile();
    }
    else {
      const getProfile = async () => {
        try {
          const response = await axios.get(`${Config.API_URL}/accounts/${accountId}/profile`, {headers:{Authorization:`Bearer ${token}`}});
          console.log(response.data)
          setName(response.data.data.nickname);
          setStatus(response.data.data.status.toLowerCase());
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>).response;
          console.log(errorResponse);
        }
      };
      getProfile();
    }
  }, [name]);

  const postStatus = async (stat:string) => {
    if (stat == status) {return;}
    else {
      try {
        const response = await axios.put(`${Config.API_URL}/accounts/me/status/${stat}`, {headers:{Authorization: `Bearer ${token}`}});
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse);
      }
    }
  };

  const rename = async (text:string, accountId:number|undefined) => {
    if (text === name) return;
    if (mine) {
      try {
        const response = await axios.put(`${Config.API_URL}/accounts/me/nickname/${text}`, {nickname:text}, {headers:{Authorization: `Bearer ${token}`}});
        setName(response.data.data.nickname);
        setNameIN(response.data.data.nickname);
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
        setNameIN(response.data.data.friendNickname);
        setChangeName(false);
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse.data);
      }
    }
  };
  return (
    <View style={styles.entire}>
      <View style={styles.profileView}>
        <View style={styles.status}>
          <Pressable style={styles.statusBtn} onPress={()=>setChangeStatus(true)} disabled={!mine}>
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
            {status == 'workout' && <Image style={{height:90, width:90}} source={require('../../assets/image/status17workout.png')} />}
            {status == 'travel' && <Image style={{height:90, width:90}} source={require('../../assets/image/status18travel.png')} />}
          </Pressable>
          <View style={styles.nameView}>
            <Text style={styles.nameTxt}>{name}</Text>
            {mine && <Pressable style={styles.changeNameBtn} onPress={()=>{setChangeName(true);}}>
              <MaterialCommunity name='pencil-outline' size={14} color={'#848484'} />
            </Pressable>}
            {!mine && <Pressable style={styles.changeNameBtn} onPress={()=>setChangeName(true)}>
              <MaterialCommunity name='pencil-outline' size={14} color={'#848484'} />
            </Pressable>}
          </View>
        </View>
        <View style={styles.btnView}>
          {mine && <Pressable style={styles.manageFriendBtn} onPress={()=>navigation.navigate('MyFriendList')}>
            <Text style={styles.manageFriendBtnTxt}>친구 관리</Text>
          </Pressable>}
          {mine ? <Pressable style={styles.noteBoxBtn} onPress={()=>navigation.navigate('NoteBox')}>
            <Text style={styles.noteBoxBtnTxt}>익명 쪽지함</Text>
          </Pressable>
          : <Pressable style={styles.sendNoteBtn}>
            <Text style={styles.noteBoxBtnTxt}>익명 쪽지 보내기</Text>  
          </Pressable>}
        </View>
      </View>
      <Modal transparent={true} visible={changeName} style={{}}>
        <Pressable style={styles.modalBG} onPress={()=>Keyboard.dismiss()}>
          <View style={styles.modalView}>
            {mine && <Text style={styles.modalTitleTxt}>내 이름 바꾸기</Text>}
            {!mine && <Text style={styles.modalTitleTxt}>친구 이름 바꾸기</Text>}
            <TextInput 
              style={styles.nameChangeTxtInput}
              onChangeText={(text:string)=>{setNameIN(text)}}
              blurOnSubmit={true}
              maxLength={20}
              value={nameIN}
              autoFocus={true}
              // onSubmitEditing={}
            />
            <View style={styles.modalBtnView}>
              <Pressable style={styles.manageFriendBtn} onPress={()=>setChangeName(false)}>
                <Text style={styles.manageFriendBtnTxt}>취소</Text>
              </Pressable>
              <Pressable style={styles.noteBoxBtn} onPress={()=>{
                if (mine) {rename(nameIN, undefined);}
                else {rename(nameIN, accountId);}
              }}>
                <Text style={styles.noteBoxBtnTxt}>완료</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
      <Modal transparent={true} visible={changeStatus} style={{}}>
        <Pressable style={styles.modalBG} onPress={()=>setChangeStatus(false)}>
          <View style={styles.modalView2}>
            <Pressable onPress={()=>{setStatus('smile'); setChangeStatus(false); postStatus('smile');}} style={status == 'smile' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status01smile.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setStatus('happy'); setChangeStatus(false);}} style={status == 'happy' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status02happy.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setStatus('sad'); setChangeStatus(false);}} style={status == 'sad' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status03sad.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setStatus('mad'); setChangeStatus(false);}} style={status == 'mad' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status04mad.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setStatus('exhausted'); setChangeStatus(false);}} style={status == 'exhausted' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status05exhausted.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setStatus('coffee'); setChangeStatus(false);}} style={status == 'coffee' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status06coffee.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setStatus('meal'); setChangeStatus(false);}} style={status == 'meal' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status07meal.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setStatus('alcohol'); setChangeStatus(false);}} style={status == 'alcohol' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status08alcohol.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setStatus('chicken'); setChangeStatus(false);}} style={status == 'chicken' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status09chicken.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setStatus('sleep'); setChangeStatus(false);}} style={status == 'sleep' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status10sleep.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setStatus('work'); setChangeStatus(false);}} style={status == 'work' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status11work.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setStatus('study'); setChangeStatus(false);}} style={status == 'study' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status12study.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setStatus('movie'); setChangeStatus(false);}} style={status == 'movie' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status13movie.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setStatus('move'); setChangeStatus(false);}} style={status == 'move' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status14move.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setStatus('dance'); setChangeStatus(false);}} style={status == 'dance' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status15dance.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setStatus('read'); setChangeStatus(false);}} style={status == 'read' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status16read.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setStatus('workout'); setChangeStatus(false);}} style={status == 'workout' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status17workout.png')}/>
            </Pressable>
            <Pressable onPress={()=>{setStatus('travel'); setChangeStatus(false);}} style={status == 'travel' ? styles.statusSelected : styles.statusSelect}>
              <Image style={styles.statusImg} source={require('../../assets/image/status18travel.png')}/>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  profileView:{
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '100%',
    height: 300
  },
  status:{
    paddingTop: 40,
    paddingBottom: 16,
  },
  statusBtn:{
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#F7F7F7',
    width: 120,
    height: 120,
    borderRadius: 30,
    marginBottom: 12,
  },
  nameView:{
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'baseline',
  },
  nameTxt:{
    color:'#222222',
    fontWeight: '600',
    fontSize:22,
    marginRight:2,
  },
  changeNameBtn:{},
  btnView:{
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 48,
  },
  manageFriendBtn:{
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFB443',
    backgroundColor: '#FFFFFF',
    marginRight: 4,
  },
  manageFriendBtnTxt:{
    color:'#FFB443',
    fontSize:15,
    fontWeight:'600'
  },
  noteBoxBtn:{
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFB443',
    backgroundColor: '#FFB443',
    marginLeft: 4,
  },
  sendNoteBtn:{
    // flex:1,
    justifyContent:'center',
    alignItems:'center',
    height: 44,
    width: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFB443',
    backgroundColor: '#FFB443',
    marginLeft: 4,
  },
  noteBoxBtnTxt:{
    color:'#FFFFFF',
    fontSize:15,
    fontWeight:'600'
  },
  modalBG:{
    width:"100%", 
    height:'100%', 
    backgroundColor: 'rgba(34, 34, 34, 0.31)',
    alignItems: 'center'
  },
  modalView:{
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    // height: 225,
    marginTop: 209,
    marginHorizontal: 36,
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
    marginTop: 116,
    marginHorizontal: 36,
    justifyContent: 'space-between',
    alignItems:'center',
    padding: 20,
    flexWrap:'wrap',
    flexDirection:'row'
  },
  statusImg:{
    height:60,
    width:60,
  },
  modalTitleTxt:{
    color:'#222222',
    fontSize:15,
    fontWeight:'600',
    marginBottom:20
  },
  nameChangeTxtInput:{
    fontSize:15,
    fontWeight:'400',
    color:'#222222',
    borderRadius: 5,
    backgroundColor:'#F7F7F7',
    width:'100%',
    height:40,
    paddingLeft:10,
    marginBottom:20
  },
  modalBtnView:{
    flexDirection:'row',
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
});