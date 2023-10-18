import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import Config from 'react-native-config';
import axios, { AxiosError } from 'axios';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppInner';
import { useNavigation } from '@react-navigation/native';

type MyFriendListScreenProps = NativeStackScreenProps<RootStackParamList, 'MyFriendList'>;

export default function MyFriendList({navigation}:MyFriendListScreenProps) {
  const token = useSelector((state:RootState) => state.user.accessToken);
  const [noFriend, setNoFriend] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [friendData, setFriendData] = useState([{accountId:-1, friendshipId:-1, friendNickname:'',status:''}]);
  const [loading, setLoading] = useState(false);
  const [cursorId, setCursorId]= useState(0);
  useEffect(() => {
    const getFriendship = async () => {
      try {
        const response = await axios.get(`${Config.API_URL}/friendships/manage?cursorId=${cursorId}`,);
        setIsLast(response.data.data.last);
        console.log(response.data.data)
        if (response.data.data.content.length == 0) setNoFriend(true);
        else {
          setFriendData(response.data.data.content);
          setCursorId(response.data.data.content[response.data.data.content.length-1].friendshipId)
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
        const response = await axios.get(`${Config.API_URL}/friendships/manage`,);
        setIsLast(response.data.data.last);
        setFriendData(friendData.concat(response.data.data.content));
        if (response.data.data.content.length != 0) {
          setCursorId(response.data.data.content[response.data.data.content.length-1].friendshipId);
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
            <Pressable style={styles.friendView} onPress={()=>navigation.navigate('Profile', {whose:1, accountId:item.accountId})}>
              {item.status.toLowerCase() == 'smile' && <Image style={{height:32, width:32}} source={require('../../assets/image/status01smile.png')}/>}
              {item.status.toLowerCase() == 'happy' && <Image style={{height:32, width:32}} source={require('../../assets/image/status02happy.png')}/>}
              {item.status.toLowerCase() == 'sad' && <Image style={{height:32, width:32}} source={require('../../assets/image/status03sad.png')}/>}
              {item.status.toLowerCase() == 'mad' && <Image style={{height:32, width:32}} source={require('../../assets/image/status04mad.png')}/>}
              {item.status.toLowerCase() == 'exhausted' && <Image style={{height:32, width:32}} source={require('../../assets/image/status05exhausted.png')}/>}
              {item.status.toLowerCase() == 'coffee' && <Image style={{height:32, width:32}} source={require('../../assets/image/status06coffee.png')}/>}
              {item.status.toLowerCase() == 'meal' && <Image style={{height:32, width:32}} source={require('../../assets/image/status07meal.png')}/>}
              {item.status.toLowerCase() == 'alcohol' && <Image style={{height:32, width:32}} source={require('../../assets/image/status08alcohol.png')}/>}
              {item.status.toLowerCase() == 'chicken' && <Image style={{height:32, width:32}} source={require('../../assets/image/status09chicken.png')}/>}
              {item.status.toLowerCase() == 'sleep' && <Image style={{height:32, width:32}} source={require('../../assets/image/status10sleep.png')}/>}
              {item.status.toLowerCase() == 'work' && <Image style={{height:32, width:32}} source={require('../../assets/image/status11work.png')}/>}
              {item.status.toLowerCase() == 'study' && <Image style={{height:32, width:32}} source={require('../../assets/image/status12study.png')}/>}
              {item.status.toLowerCase() == 'movie' && <Image style={{height:32, width:32}} source={require('../../assets/image/status13movie.png')}/>}
              {item.status.toLowerCase() == 'move' && <Image style={{height:32, width:32}} source={require('../../assets/image/status14move.png')}/>}
              {item.status.toLowerCase() == 'dance' && <Image style={{height:32, width:32}} source={require('../../assets/image/status15dance.png')}/>}
              {item.status.toLowerCase() == 'read' && <Image style={{height:32, width:32}} source={require('../../assets/image/status16read.png')}/>}
              {item.status.toLowerCase() == 'walk' && <Image style={{height:32, width:32}} source={require('../../assets/image/status17walk.png')}/>}
              {item.status.toLowerCase() == 'travel' && <Image style={{height:32, width:32}} source={require('../../assets/image/status18travel.png')}/>}
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