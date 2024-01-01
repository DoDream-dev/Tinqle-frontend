import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import Config from 'react-native-config';
import axios, { AxiosError } from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppInner';
import { svgXml } from '../../assets/image/svgXml';
import { SvgXml } from 'react-native-svg';
import userSlice from '../slices/user';
import { useAppDispatch } from '../store';

type MyFriendListScreenProps = NativeStackScreenProps<RootStackParamList, 'MyFriendList'>;

export default function MyFriendList({navigation}:MyFriendListScreenProps) {
  const token = useSelector((state:RootState) => state.user.accessToken);
  const [noFriend, setNoFriend] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [friendData, setFriendData] = useState([{accountId:-1, friendshipId:-1, friendNickname:'',status:''}]);
  const [loading, setLoading] = useState(false);
  const [cursorId, setCursorId]= useState(0);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getFriendship = async () => {
      try {
        const response = await axios.get(`${Config.API_URL}/friendships/manage`,);
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
        if (errorResponse?.data.status == 500) {
          dispatch(
            userSlice.actions.setToken({
              accessToken:'',
            }),
          );
        }
      }
    };
    getFriendship();
  }, [isLast]);
  const getData = async () => {
    if (!isLast) {
      setLoading(true);
      try {
        const response = await axios.get(`${Config.API_URL}/friendships/manage?cursorId=${cursorId}`,);
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
      {!noFriend && <FlatList 
        data={friendData}
        style={styles.friendList}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        renderItem={({item}) => {
          return (
            <Pressable style={styles.friendView} onPress={()=>navigation.navigate('Profile', {whose:1, accountId:item.accountId})}>
              {item.status == 'smile'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.smile} />}
              {item.status == 'happy'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.happy} />}
              {item.status == 'sad'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.sad} />}
              {item.status == 'mad'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.mad} />}
              {item.status == 'exhausted'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.exhauseted} />}
              {item.status == 'coffee'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.coffee} />}
              {item.status == 'meal'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.meal} />}
              {item.status == 'alcohol'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.alcohol} />}
              {item.status == 'chicken'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.chicken} />}
              {item.status == 'sleep'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.sleep} />}
              {item.status == 'work'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.work} />}
              {item.status == 'study'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.study} />}
              {item.status == 'movie'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.movie} />}
              {item.status == 'move'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.move} />}
              {item.status == 'dance'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.dance} />}
              {item.status == 'read'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.read} />}
              {item.status == 'walk'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.walk} />}
              {item.status == 'travel'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.travel} />}
              <View style={styles.friendmiddle}>
                <Text style={styles.friendName}>{item.friendNickname}</Text>
              </View>
              {/* <Pressable style={styles.deleteBtn}>
                <Text style={styles.deleteBtnTxt}>삭제</Text>
              </Pressable> */}
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
    flex:1,
    justifyContent:'center',
    alignItems:'center',
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