import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import Config from 'react-native-config';
import axios, { AxiosError } from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppInner';

type MyFriendListScreenProps = NativeStackScreenProps<RootStackParamList, 'MyFriendList'>;

export default function MyFriendList({navigation}:MyFriendListScreenProps) {
  const token = useSelector((state:RootState) => state.user.accessToken);
  const [noFriend, setNoFriend] = useState(true);
  const [isLast, setIsLast] = useState(false);
  const [friendData, setFriendData] = useState([{accountId:-1, friendshipId:-1, friendNickname:'',status:''}]);
  // useEffect(() => {
  //   const getFriendship = async () => {
  //     try {
  //       const response = await axios.get(`${Config.API_URL}/friendships/manage`, {headers:{Authorization:`Bearer ${token}`}})
  //       setIsLast(response.data.data.isLast);
  //       if (response.data.data.content.length() == 0 && response.data.data.last) setNoFriend(true);
  //       else {
  //         // setFriendData([...friendData, response.data.data.content]);
  //         setFriendData(friendData.concat(response.data.data.content));
  //       }
  //       console.log(response.data.data);
  //     } catch (error) {
  //       const errorResponse = (error as AxiosError<{message: string}>).response;
  //       console.log(errorResponse.data);
  //     }
  //   };
  //   getFriendship();
  // }, []);
  return (
    <View style={styles.entire}>
      {noFriend && <View style={styles.nofriendView}>
        <Text style={styles.nofriendTxt}>친구를 추가해 보세요!</Text>
        <Pressable style={styles.nofriendBtn} onPress={()=>navigation.navigate('SearchFriends')}>
          <Text style={styles.nofriendBtnTxt}>친구 추가하기</Text>
        </Pressable>  
      </View>}
      {noFriend && <View style={styles.empty}></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    alignItems: 'center',
  },
  nofriendView:{
    flex:3,
    justifyContent:'flex-end',
    alignItems:'center',
  },
  empty:{
    flex:4
  },
  nofriendTxt:{
    color:'#848484',
    fontSize:12,
    fontWeight:'500',
    textAlign:'center',
  },
  nofriendBtn:{
    width: 120,
    height: 44,
    justifyContent:'center',
    alignItems:'center', 
    backgroundColor: '#FFB443',
    borderRadius:10,
    marginTop:10,
  },
  nofriendBtnTxt:{
    color:'#FFFFFF',
    fontWeight:'600',
    fontSize:15,
  },
});