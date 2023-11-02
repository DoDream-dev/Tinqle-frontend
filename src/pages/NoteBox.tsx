import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import userSlice from '../slices/user';
import { useAppDispatch } from '../store';

type itemProps = {
  item:{
    messageBoxId:number;
    message:string;
    createdAt:string;
  }
}

export default function NoteBox() {
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
        // console.log(response.data.data);
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
      <View style={!empty ? styles.entire : styles.entire2}>
        {empty && <View style={styles.emptyView}>
          <Text style={styles.emptyViewTxt}>익명 쪽지함이 비어있어요.</Text>
        </View>}
        {!empty && <FlatList 
          data={msgData}
          style={styles.messageView}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          inverted={true}
          renderItem={({item}:itemProps) => {
            return (
              <Pressable style={[styles.eachmessageView,]}>
                <View style={styles.eachmessageHeader}>
                  <Text style={styles.eachmessageTxtHeader}>익명</Text>
                  <Text style={styles.eachmessageCreatedAt}>{item.createdAt}</Text>
                </View>
                <Text style={styles.eachmessageTxt}>{item.message}</Text>
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
    paddingTop: 10,
    paddingHorizontal: 16,
    width:'100%',
  },
  entire2:{
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  emptyView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  emptyViewTxt:{
    fontWeight:'500',
    fontSize:12,
    color:'#848484',
  },
  messageView:{
    width:'100%',
  },
  eachmessageView:{
    borderRadius:10,
    backgroundColor:'#FFFFFF',
    padding:16,
    marginBottom:10,
  },
  eachmessageHeader:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'flex-start',
  },
  eachmessageCreatedAt:{
    color:'#848484',
    fontSize:12,
    fontWeight:'500',
  },
  eachmessageTxtHeader:{
    color:'#222222',
    fontSize:15,
    fontWeight:'600',
    marginBottom:4
  },
  eachmessageTxt:{
    color:'#222222', 
    fontSize:15,
    fontWeight:'400'
  },
});