import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import userSlice from '../slices/user';
import { useAppDispatch } from '../store';
import { SvgXml } from 'react-native-svg';
import { svgXml } from '../../assets/image/svgXml';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppInner';

type itemProps = {
  item:{
    messageBoxId:number;
    message:string;
    createdAt:string;
  }
}

type MsgListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MsgList'
>;

export default function MsgList({navigation, route}:MsgListScreenProps) {
  const [empty, setEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [cursorId, setCursorId] = useState(0);
  const [msgData, setMsgData] = useState([]);
  const dispatch = useAppDispatch();

  useEffect(()=>{
    const getNoteContent = async () => {
      try {
        const response = await axios.get(`${Config.API_URL}/accounts/me/message`);
        console.log(response.data.data);
        if (response.data.data.content.length == 0) {
          setEmpty(true)
        }
        else {
          setIsLast(response.data.data.last);
          setMsgData(response.data.data.content);
          setCursorId(response.data.data.content[response.data.data.content.length-1].messageBoxId);
        }
      } catch(error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse.data);
        if (errorResponse?.data.status == 500) {
          dispatch(
            userSlice.actions.setToken({
              accessToken:'',
            }),
          );
        }
      }
    };
    getNoteContent();
  },[]);
  const getData = async () => {
    if (!isLast) {
      setLoading(true);
      try {
        const response = await axios.get(`${Config.API_URL}/friendships/manage?cursorId=${cursorId}`,);
        setIsLast(response.data.data.last);
        setMsgData(msgData.concat(response.data.data.content));
        if (response.data.data.content.length != 0) {
          setCursorId(response.data.data.content[response.data.data.content.length-1].messageBoxId)
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
        {empty && <View style={styles.emptyView}>
          <Text style={styles.emptyViewTxt}>친구의 프로필에서 대화를 시작해 보세요!</Text>
        </View>}
        {empty && <View style={styles.emptyViewDown}></View>}
        {!empty && <FlatList 
          data={msgData}
          style={styles.messageView}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          renderItem={({item}:itemProps) => {
            const newmsg = false;
            return (
              <Pressable style={[styles.eachMsg, newmsg && {backgroundColor:'#A55FFF4D'}]} onPress={()=>navigation.navigate('MsgDetail')}>
                <Pressable style={styles.mainView}>
                  <Pressable style={styles.profileView}>
                    <SvgXml width={32} height={32} xml={svgXml.profile.null} />
                    <Text style={newmsg ? styles.profileTxtBold : styles.profileTxt}>김영서</Text>
                    <SvgXml width={18} height={18} xml={svgXml.status.work} />
                  </Pressable>
                  <Text style={newmsg ? styles.msgContentBold : styles.msgContent}>{item.message}</Text>
                </Pressable>
                <View style={styles.subView}>
                  {newmsg && <View style={styles.msgCnt}>
                    <Text style={styles.msgCntTxt}>12</Text>
                  </View>}
                  <Text style={newmsg ? styles.createdAtBold : styles.createdAt}>{item.createdAt}</Text>
                </View>
              </Pressable>
            );
          }}
        />}
      </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor:'#202020',
    flex:1,
  },
  emptyView:{
    flex:3,
    justifyContent:'flex-end',
    alignItems:'center',
  },
  emptyViewDown:{
    flex:4
  },
  emptyViewTxt:{
    fontWeight:'500',
    fontSize:13,
    color:'#888888',
  },
  messageView:{
    width:'100%',
    borderTopWidth:1,
    borderTopColor:'#333333',
  },
  eachMsg:{
    paddingHorizontal:16,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    borderBottomWidth:1,
    borderBottomColor:'#333333',

    paddingVertical:12,
  },
  mainView:{
    flexDirection:'row',
    alignItems:'center'
  },
  profileView:{
    flexDirection:'row',
    alignItems:'center',
    marginRight:10,
  },
  profileTxt:{
    marginLeft:8,
    marginRight:3,
    color:'#F0F0F0',
    fontSize:15,
    fontWeight:'500',
  },
  profileTxtBold:{
    marginLeft:8,
    marginRight:3,
    color:'#F0F0F0',
    fontSize:15,
    fontWeight:'600',
  },
  msgContent:{
    color:'#888888',
    fontSize:15,
    fontWeight:'500',
  },
  msgContentBold:{
    color:'#F0F0F0',
    fontSize:15,
    fontWeight:'600',
  },
  subView:{
    flexDirection:'row'

  },
  msgCnt:{
    borderRadius:20,
    backgroundColor:'#A55FFF',
    paddingHorizontal:6,
    paddingVertical:2
  },
  msgCntTxt:{
    color:'#F0F0F0',
    fontSize:13,
    fontWeight:'500',
  },
  createdAt:{
    color:'#888888',
    fontSize:13,
    fontWeight:'500',
    marginLeft:10,
  },
  createdAtBold:{
    color:'#F0F0F0',
    fontSize:13,
    fontWeight:'500',
    marginLeft:10,
  },
});