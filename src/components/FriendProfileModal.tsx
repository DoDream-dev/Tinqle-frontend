import React, { useState, useRef } from "react";
import { StyleSheet, Text, Pressable, View, Keyboard, TextInput, Dimensions } from "react-native";
import axios, { AxiosError } from 'axios';
import Modal from'react-native-modal';
import Config from 'react-native-config';
import Profile from "./Profile";
import _ from 'lodash';


import { throttleTime } from '../hooks/Throttle';

type ProfileProps = {
  showWhoseModal:number;
  setShowWhoseModal:React.Dispatch<React.SetStateAction<number>>;
}
export default function FriendProfileModal(props:ProfileProps){
  const showWhoseModal = props.showWhoseModal;
  const setShowWhoseModal = props.setShowWhoseModal;

  const [chageName, setChangeName] = useState(false);
  const [changeStatus, setChangeStatus] = useState(false);
  const [chageNameVal, setChangeNameVal] = useState('');
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const [profileImg, setProfileImg] = useState(null);

  const inp1 = useRef();


  const getProfile = async () => {
    try {
      const response = await axios.get(`${Config.API_URL}/accounts/${showWhoseModal}/profile`,);
      // console.log(response.data.data)
      setName(response.data.data.nickname);
      setChangeNameVal(response.data.data.nickname);
      setStatus(response.data.data.status.toLowerCase());
      setProfileImg(response.data.data.profileImageUrl);
      
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  const rename =  _.throttle(async (text:string, accountId:number) => {
    if (text === name) {
      setChangeName(false);
      setChangeNameVal(text);
      return;
    }
    try {
      const response = await axios.post(`${Config.API_URL}/friendships/nickname/change`, {
        friendAccountId:accountId,
        nickname: text,
      },);
      setName(response.data.data.friendNickname);
      setChangeNameVal(response.data.data.friendNickname);
      setChangeName(false);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  }, throttleTime);
  
  return (
  <Modal isVisible={showWhoseModal != 0 && showWhoseModal != undefined}
    onModalWillShow={getProfile}
    hasBackdrop={true}
    onBackdropPress={()=>setShowWhoseModal(0)}
    // coverScreen={false}
    onBackButtonPress={()=>setShowWhoseModal(0)}
    style={[styles.entire, {marginVertical:(Dimensions.get('screen').height - 400)/2}]}>
      {/* <Pressable style={styles.xBtn} onPress={()=>setShowWhoseModal(0)}>
        <Text style={styles.btnTxt}>x</Text>
      </Pressable> */}
      <View style={styles.profileView}>
        <Profile
          name={name}
          status={status}
          profileImg={profileImg}
          renameModal={setChangeName}
          restatusModal={setChangeStatus}
        />
      </View>
      <View style={styles.btnView}>
        <Pressable style={styles.btn}><Text style={styles.btnTxt}>지금 뭐해?</Text></Pressable>
        <View style={{width:8}}></View>
        <Pressable style={styles.btnGray}><Text style={styles.btnTxt}>친구 삭제하기</Text></Pressable>
      </View>
      <Modal isVisible={chageName} onBackButtonPress={()=>setChangeName(false)} avoidKeyboard={true} backdropColor='#222222' backdropOpacity={0.5}>
        <Pressable style={styles.modalBGView} onPress={()=>{setChangeName(false); Keyboard.dismiss();}}>
          <Pressable style={styles.modalView} onPress={(e)=>e.stopPropagation()}>
            <Text style={styles.modalTitleTxt}>친구 이름 바꾸기</Text>
            <View style={styles.changeView}>
              <TextInput 
                ref={inp1}
                style={styles.nameChangeTxtInput}
                onChangeText={(text:string)=>{setChangeNameVal(text)}}
                blurOnSubmit={true}
                maxLength={15}
                value={chageNameVal}
                autoFocus={true}
                onSubmitEditing={()=>{
                  rename(chageNameVal.trim(), showWhoseModal);
                }}
              />
            </View>
            <View style={styles.modalBtnView}>
              <Pressable style={styles.btnWhite} onPress={()=>{setChangeName(false); setChangeNameVal(name);}}>
                <Text style={styles.btnWhiteTxt}>취소</Text>
              </Pressable>
              <Pressable style={styles.btnYellow} disabled={chageNameVal.trim() == ''} onPress={()=>{
                if (chageNameVal != '') {
                  if (chageNameVal == name) {setChangeName(false);}
                  else {
                    rename(chageNameVal.trim(), showWhoseModal);
                  }
                }
              }}>
                <Text style={styles.btnYellowTxt}>완료</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Modal>
  );

}

const styles = StyleSheet.create({
  entire:{
    position:'relative',
    marginHorizontal: 36,
    backgroundColor:'#333333',
    justifyContent:'center',
    borderRadius:10,
  },
  profileView:{
    justifyContent:'center',
  },
  btnView:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal: 17,
    marginTop:16,
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
  modalBGView:{
    width:"100%", 
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    paddingHorizontal:36,
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
  btnWhite:{
    height: 44,
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A55FFF',
    backgroundColor: '#F0F0F0',
    marginHorizontal: 4,
  },
  btnYellow:{
    height: 44,
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A55FFF',
    backgroundColor: '#A55FFF',
    marginHorizontal: 4,
  },
  btnWhiteTxt:{
    color:'#A55FFF',
    fontSize:15,
    fontWeight:'600'
  },
  btnYellowTxt:{
    color:'#F0F0F0',
    fontSize:15,
    fontWeight:'600'
  },
})