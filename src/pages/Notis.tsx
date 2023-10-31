import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { svgXml } from '../../assets/image/svgXml';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import Modal from 'react-native-modal';
import ToastScreen from '../components/ToastScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppInner';

type itemProps = {
  item:{
    notificcationId:number;
    notificationType:string;
    targetEntity:string;
    redirectTargetId:number;
    title:string;
    body:string;
    createdAt:string;
    isRead:boolean;
  }
}

type NotisScreenProps = NativeStackScreenProps<RootStackParamList, 'Notis'>;

export default function Notis({navigation}:NotisScreenProps) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [allRead, setAllRead] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [cursorId, setCursorId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [popup, setPopup] = useState(true);
  const [notisData, setNotisData] = useState([{
    notificcationId:6,
    notificationType:"CREATE_FEED_COMMENT",
    targetEntity:"FEED",
    redirectTargetId:106,
    title:"댓글 알림",
    body:"나의 피드에 누가 댓글을 달았습니다.",
    createdAt:"몇년몇월며칠",
    isRead:false
  },
  {
    notificcationId:7,
    notificationType:"CREATE_FEED_COMMENT",
    targetEntity:"FEED",
    redirectTargetId:1,
    title:"피드 알림",
    body:"나의 피드에 누가 대댓글을 달았습니다.나의 피드에 누가 대댓글을 달았습니다.나의 피드에 누가 대댓글을 달았습니다.나의 피드에 누가 대댓글을 달았습니다.",
    createdAt:"몇년몇월며칠",
    isRead:false
  }]);

  const getData = async () => {
    if (!isLast) {
      setLoading(true);
      try {
        console.log(cursorId)
        const response = await axios.get(`${Config.API_URL}/feeds?cursorId=${cursorId}`,);
        console.log(response.data.data)
        setIsLast(response.data.data.last);
        setNotisData(notisData.concat(response.data.data.content));
        if (response.data.data.content.length != 0) {
          setCursorId(response.data.data.content[response.data.data.content.length-1].notificcationId)
        }
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse.data);
      }
    }
    setLoading(false);
  };
  const onEndReached = () => {
    if (!loading) {getData();}
  };

  return (
    <View style={styles.entire}>
      {/* <View style={styles.notisHeader}>
        <Text style={styles.notisHeaderTxt}>알림</Text>
        <Pressable onPress={()=>setIsEnabled(!isEnabled)} style={[styles.toggleView, isEnabled?{backgroundColor:'#FFB443'}:{backgroundColor:'#B7B7B7'}]}>
          {isEnabled && <Text style={styles.toggleActiveTxt}>ON</Text>}
          {isEnabled && <View style={styles.toggleActiveCircle}></View>}
          {!isEnabled && <View style={styles.toggleInactiveCircle}></View>}
          {!isEnabled && <Text style={styles.toggleInactiveTxt}>OFF</Text>}
        </Pressable>
      </View> */}
      {allRead && <View style={styles.empty}>
        <Text style={styles.emptyTxt}>알림을 다 읽었어요</Text>
      </View>}
      {!allRead && <FlatList 
          data={notisData}
          style={styles.notisEntire}
          renderItem={({item}:itemProps) => {
            return (
              <Pressable style={styles.eachNotis} onPress={()=>navigation.navigate('FeedDetail', {feedId:item.notificcationId})}>
                <View style={styles.notisView}>
                  <Pressable style={styles.notisProfile}>
                    <SvgXml width={32} height={32} xml={svgXml.status.smile}/>
                  </Pressable>
                  <Text style={styles.notisText}>{item.body}</Text>
                </View>
                <Pressable style={styles.notisCheckBtn}>
                  <Text style={styles.notisCheckBtnTxt}>보기</Text>
                </Pressable>
                <Pressable style={styles.xBtn}>
                  <SvgXml width={16} height={16} xml={svgXml.icon.notisX}/>
                </Pressable>
              </Pressable>
            );
          }}
        />}
        <Modal isVisible={showModal} onBackButtonPress={()=>(setShowModal(false))} backdropColor='#222222' backdropOpacity={0.5}>
          <Pressable style={styles.modalBGView} onPress={()=>{setShowModal(false)}}>
            <Pressable style={styles.modalView} onPress={(e)=>e.stopPropagation()}>
              <Text style={styles.modalTitleTxt}>친구 요청 메시지</Text>
            <View style={styles.changeView}>
              <Text style={styles.nameChangeTxtInput}>지훈아 나 과동기~~지훈아 나 과동기~~지훈아 나 과동기~~지훈아 나 과동기~~지훈아 나 과동기~~지훈아 나 과동기~~</Text>
            </View>
            <View style={styles.modalBtnView}>
              <Pressable style={styles.btnWhite} onPress={()=>{setShowModal(false)}}>
                <Text style={styles.btnWhiteTxt}>닫기</Text>
              </Pressable>
              <Pressable style={styles.btnYellow} onPress={()=>{}}>
                <Text style={styles.btnYellowTxt}>수락하기</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      {popup && <ToastScreen
        height = {21}
        marginBottom={48}
        onClose={()=>setPopup(false)}
        message={`삭제된 글이에요.`}
      />}
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor:'#F7F7F7'
  },
  notisHeader:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center',
    paddingRight:16,
    height:40,
    backgroundColor:'#FFFFFF'
  },
  notisHeaderTxt:{
    color:'#848484',
    fontWeight:'500',
    fontSize:12,
    marginRight:3
  },
  toggleView:{
    width:48,
    height:20,
    borderRadius:10,
    paddingHorizontal:2,
    paddingVertical:3,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  toggleActiveTxt:{
    color:'#FFFFFF',
    fontSize:12,
    fontWeight:'500',
    marginLeft:6,
    marginRight:4,
    top:-2
  },
  toggleActiveCircle:{
    width:16,
    height:16,
    borderRadius:8,
    backgroundColor:'#FFFFFF',
  },
  toggleInactiveTxt:{
    color:'#FFFFFF',
    fontSize:12,
    fontWeight:'500',
    marginLeft:6,
    marginRight:6,
    top:-2
  },
  toggleInactiveCircle:{
    width:14,
    height:16,
    borderRadius:8,
    backgroundColor:'#FFFFFF',
  },
  empty:{
    flex:1, 
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
  },
  emptyTxt:{
    color:'#848484',
    fontSize:12,
    fontWeight:'500',
    textAlign:'center',
    justifyContent:'center',
    alignItems:'center'
  },
  notisEntire:{
    width:'100%',
  },
  eachNotis:{
    width:'100%',
    flexDirection:'row',
    flex:1,
    backgroundColor:'#FFFFFF',
    paddingHorizontal:16,
    alignItems:'center',
    justifyContent:'space-between',
    borderBottomWidth:1,
    borderBottomColor:'#F7F7F7'
  },
  notisView:{
    flexGrow:1,
    flexDirection:'row',
    alignItems:'center',
    flex:1
  },
  notisProfile:{
    marginVertical:12,
    marginRight:10,
  },
  notisText:{
    color:'#222222',
    fontWeight:'400',
    fontSize:14,
    flexShrink:1,
    marginVertical:11
  },
  notisCheckBtn:{
    width:84,
    height:32,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#FFB443',
    borderRadius:10,
    marginLeft:12,
    marginVertical:12
  },
  notisCheckBtnTxt:{
    fontSize:15,
    fontWeight:'600',
    color:'#FFFFFF'
  },
  xBtn:{
    marginLeft:10
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
    flex:1,
    justifyContent:'center',
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
    paddingVertical:10,
    paddingHorizontal:10,
    marginBottom:20,
    marginTop:10,
  },
});