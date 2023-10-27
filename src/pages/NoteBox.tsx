import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';

type itemProps = {
  item:{
    messageBoxId:number;
    message:string;
    createdAt:string;
  }
}

export default function NoteBox() {
  const height = Dimensions.get('window').height;
  const token = useSelector((state:RootState) => state.user.accessToken);
  const [empty, setEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [cursorId, setCursorId] = useState(0);
  const [msgData, setMsgData] = useState([]);
  const flatListRef = useRef<FlatList | null>(null);
  const [listHeight, setListHeight] = useState(0)
  // useEffect(() => {
  //   if (flatListRef.current && listHeight > 0) {
  //     flatListRef.current.scrollToOffset({ offset: listHeight });
  //   }
  // }, [listHeight]);
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
      }
    };
    getNoteContent();
  },[]);
  // const noteData = [{createdAt:"오늘",message:"안뇽 내가 누구게"}, {createdAt:"2023.9.15",message:"오늘 같이 밥먹어서 즐거웠엉"}, {createdAt:"2023.10.8", message:"너 너무 웃김"}];
  const noteData = [{createdAt:"오늘",message:"안뇽 내가 누구게"}, {createdAt:"2023.9.15",message:"오늘 같이 밥먹어서 즐거웠엉"}, {createdAt:"2023.10.8", message:"너 너무 웃김"}, {createdAt:"2023.10.8", message:"너 너무 웃김"}, {createdAt:"2023.10.8", message:"너 너무 웃김"}, {createdAt:"2023.10.8", message:"너 너무 웃김"}, {createdAt:"2023.10.8", message:"너 너무 웃김"}, {createdAt:"2023.10.8", message:"너 너무 웃김"}, {createdAt:"2023.10.8", message:"너 너무 웃김"}, {createdAt:"2023.10.8", message:"너 너무 웃김"}, {createdAt:"2023.10.8", message:"너 너무 웃김"}, {createdAt:"2023.10.8", message:"너 너무 웃김"}];
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
        {empty && <View style={styles.empty}></View>}
        {!empty && <FlatList 
          // data={msgData.slice().reverse()}
          data={msgData}
          style={styles.messageView}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          inverted={true}
          // ListHeaderComponent={<View style={{backgroundColor:'pink',height:height - noteData.length * 100}}></View>}
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
    flex:3,
    justifyContent:'flex-end',
    alignItems:'center',
  },
  emptyViewTxt:{
    fontWeight:'500',
    fontSize:12,
    color:'#848484',
  },
  empty:{
    flex:4
  },
  messageView:{
    // flex:1,
    width:'100%',
    // backgroundColor:'pink'
  },
  eachmessageView:{
    borderRadius:10,
    backgroundColor:'#FFFFFF',
    padding:16,
    marginBottom:10,
    // width:'100%',
  },
  eachmessageHeader:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'flex-start',
    // backgroundColor:'pink'
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