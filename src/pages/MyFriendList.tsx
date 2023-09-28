import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import Config from 'react-native-config';
import axios, { AxiosError } from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppInner';

type MyFriendListScreenProps = NativeStackScreenProps<RootStackParamList, 'MyFriendList'>;

export default function MyFriendList({navigation}:MyFriendListScreenProps) {
  const token = useSelector((state:RootState) => state.user.accessToken);
  const [noFriend, setNoFriend] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [friendData, setFriendData] = useState([{accountId:-1, friendshipId:-1, friendNickname:'',status:''}]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getFriendship = async () => {
      try {
        const response = await axios.get(`${Config.API_URL}/friendships/manage`, {headers:{Authorization:`Bearer ${token}`}});
        setIsLast(response.data.data.last);
        console.log(response.data.data)
        if (response.data.data.content.length == 0) setNoFriend(true);
        else {
          setFriendData(response.data.data.content);
        }
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse.data);
      }
    };
    getFriendship();
  }, [isLast]);
  const getData = async () => {
    if (!isLast) {
      setLoading(true);
      try {
        const response = await axios.get(`${Config.API_URL}/friendships/manage`, {headers:{Authorization:`Bearer ${token}`}});
        setIsLast(response.data.data.last);
        setFriendData(friendData.concat(response.data.data.content));
        setLoading(false);
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse.data);
      }
    }
  };
  const onEndReached = () => {
    if (!loading) {getData();}
  };
  return (
    <View style={styles.entire}>
      {noFriend && <View style={styles.nofriendView}>
        <Text style={styles.nofriendTxt}>친구를 추가해 보세요!</Text>
        <Pressable style={styles.nofriendBtn} onPress={()=>{navigation.navigate('SearchFriends'); }}>
          <Text style={styles.nofriendBtnTxt}>친구 추가하기</Text>
        </Pressable>  
      </View>}
      {noFriend && <View style={styles.empty}></View>}
      {!noFriend && <FlatList 
        data={friendData}
        // keyExtractor={(_)=>_.accountId}
        style={styles.friendList}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        renderItem={({item}) => {
          return (
            <Pressable style={styles.friendView} onPress={()=>navigation.navigate('Profile', {mine:false, accountId:item.accountId})}>
              <Image style={{height:32, width:32}} source={require('../../assets/image/status01smile.png')}/>
              <View style={styles.friendmiddle}>
                <Text style={styles.friendName}>{item.friendNickname}</Text>
              </View>
              <Pressable style={styles.deleteBtn}>
                <Text style={styles.deleteBtnTxt}>삭제</Text>
              </Pressable>
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
  friendList:{
    flex:1,
    width:'100%',
    backgroundColor:'#FFFFFF'
  },
  friendView:{
    width:'100%',
    alignItems:'center',
    flexDirection:'row',
    paddingVertical:10,
    paddingHorizontal:16
  },
  friendmiddle:{
    flex:1,
    justifyContent:'center',
    marginLeft:8
  },
  friendName:{
    color:'#222222',
    fontWeight:'600',
    fontSize:15
  },
  deleteBtn:{
    borderWidth:1,
    borderColor:'#FFB443',
    borderRadius:10,
    paddingHorizontal:23,
    paddingVertical:7
  },
  deleteBtnTxt:{
    color:'#FFB443',
    fontWeight:'600',
    fontSize:15
  },
});