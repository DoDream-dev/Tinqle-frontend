import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import axios, {AxiosError} from 'axios';

export default function NoteBox() {

  const token = useSelector((state:RootState) => state.user.accessToken);
  const [empty, setEmpty] = useState(true);
  const [loading, setLoading] = useState(false);
  // useEffect(()=>{
  //   const getNoteContent = async () => {
  //     try {
  //       const response = await axios.~~
  //       setEmpty()
  //     } catch(error) {
  //       const errorResponse = (error as AxiosError<{message: string}>).response;
  //       console.log(errorResponse.data);
  //     }
  //   };
  //   getNoteContent();
  // },[]);
  const noteData = [{content:"안뇽 내가 누구게"}, {content:"오늘 같이 밥먹어서 즐거웠엉"}];
  const getData = async () => {
    // if (!isLast) {
    //   setLoading(true);
    //   try {
    //     const response = await axios.get(`${Config.API_URL}/friendships/manage`, {headers:{Authorization:`Bearer ${token}`}});
    //     setIsLast(response.data.data.last);
    //     setFriendData(friendData.concat(response.data.data.content));
    //     setLoading(false);
    //   } catch (error) {
    //     const errorResponse = (error as AxiosError<{message: string}>).response;
    //     console.log(errorResponse.data);
    //   }
    // }
  };
  const onEndReached = () => {
    if (!loading) {getData();}
  };
  return (
      <View style={styles.entire}>
        {empty && <View style={styles.emptyView}>
          <Text style={styles.emptyViewTxt}>익명 쪽지함이 비어있어요.</Text>
        </View>}
        {empty && <View style={styles.empty}></View>}
        {!empty && <FlatList 
          data={noteData}
          style={styles.messageView}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          renderItem={({item}) => {
            return (
              <Pressable style={styles.eachmessageView}>
                <Text style={styles.eachmessageTxt}>{item.content}</Text>
              </Pressable>
            );
          }}
        />}
      </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 16,
    // width:'100%',
    // backgroundColor:'pink'
  },
  emptyView:{
    flex:3,
    justifyContent:'flex-end',
    alignItems:'center'
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
    flex:1,
    width:'100%'
  },
  eachmessageView:{
    borderRadius:10,
    backgroundColor:'#FFFFFF',
    padding:10,
    marginBottom:10,
    // width:'100%',
  },
  eachmessageTxt:{
    color:'#222222', 
    fontSize:15,
    fontWeight:'400'
  },
});