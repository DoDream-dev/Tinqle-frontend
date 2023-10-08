import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Image, TextInput, Dimensions } from 'react-native';
import { RootStackNavigationProp, RootStackParamList } from '../../AppInner';
import Feed from '../components/Feed';
import Config from 'react-native-config';
import axios, { AxiosError } from 'axios';
import Feather from 'react-native-vector-icons/Feather'
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import { useFocusEffect } from '@react-navigation/native';
type FeedListScreenProps = NativeStackScreenProps<RootStackParamList, 'FeedList'>;

export default function FeedList({navigation}:FeedListScreenProps) {
  const [feedData, setFeedData] = useState([
    {
      feedId:-1,
      accountId:-1,
      status:"HAPPY",
      friendNickname:"",
      content:"",
      feedImageUrls:[null],
      commentCount:-1,
      emoticons:{
        smileEmoticonCount:-1,
        sadEmoticonCount:-1,
        heartEmoticonCount:-1,
        surpriseEmoticonCount:-1,
        isCheckedSmileEmoticon:false,
        isCheckedSadEmoticon:false,
        isCheckedHeartEmoticon:false,
        isCheckedSurpriseEmoticon:false,
      },
      isAuthor:false,
      createdAt:''
    }
  ])
  const [noFeed, setNoFeed] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState('지금 기분이 어때요?');
  const [feedContent, setFeedContent] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [KBsize, setKBsize] = useState(0);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [EmoticonList, setEmoticonList] = useState({
    heartEmoticonNicknameList:['-'],
    smileEmoticonNicknameList:[''],
    sadEmoticonNicknameList:[''],
    surpriseEmoticonNicknameList:[''],
  });
  const windowHeight = Dimensions.get('screen').height;
  const windowWidth = Dimensions.get('screen').width;
  
  // useEffect(() => {
  //   const getFeed = async () => {
  //     console.log('getdata')
  //     try {
  //       const response = await axios.get(`${Config.API_URL}/feeds`,);
  //       if (response.data.data.content.length == 0) setNoFeed(true);
  //       else {
  //         if (refresh) setRefresh(false);
  //         setIsLast(response.data.data.last);
  //         setFeedData(response.data.data.content);
  //         console.log(response.data.data.content[0].feedImageUrls)
  //       }
  //     } catch (error) {
  //       const errorResponse = (error as AxiosError<{message: string}>).response;
  //       console.log(errorResponse.data);
  //     }
  //   }
  //   getFeed();
  // }, [isLast, refresh]);

  // useFocusEffect(
  //   useCallback(()=>{
  //     setRefresh(true);
  //     console.log('focus')
  //   },[refresh])
  // );

  useFocusEffect(
    useCallback(()=>{
      const getFeed = async () => {
        try {
          const response = await axios.get(`${Config.API_URL}/feeds`,);
          if (response.data.data.content.length == 0) setNoFeed(true);
          else {
            setIsLast(response.data.data.last);
            setFeedData(response.data.data.content);
            console.log(response.data.data.content[0].feedImageUrls)
          }
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>).response;
          console.log(errorResponse.data);
        }
      }
      getFeed();
    },[refresh])
  );

  const getData = async () => {
    if (!isLast) {
      setLoading(true);
      try {
        const response = await axios.get(`${Config.API_URL}/feeds`,);
        setIsLast(response.data.data.last);
        setFeedData(feedData.concat(response.data.data.content));
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

  const sendNewFeed = async () => {
    try {
      const response = await axios.post(`${Config.API_URL}/feeds`, {
        content:feedContent,
        feedImageUrl:[null],
        isReceivedEmoticon:true,
      });
      setFeedContent('');
      setRefresh(!refresh);
      
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  // const uploadImages = async (image) => {
  //   const image = {
  //     uri:'',
  //     name:'',
  //   }
  // };
  

  const pressEmoticon = async (feedId:number, emoticon:string) => {
    try {
      const response = await axios.put(`${Config.API_URL}/emoticons/feeds/${feedId}`, {emoticonType:emoticon},);
      console.log(response.data.data);
      setRefresh(!refresh);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  const whoReact = async (feedId:number) => {
    try {
      const response = await axios.get(`${Config.API_URL}/emoticons/feeds/${feedId}`,);
      console.log(response.data.data);
      setEmoticonList(response.data.data);
      setShowBottomSheet(true);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  }

  return (
    <View style={{flex:1}}>
      <View style={[styles.entire]}>
        {noFeed ? <View></View> : 
        <FlatList 
          data={feedData.slice().reverse()}
          style={styles.feedList}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          keyboardShouldPersistTaps={'always'}
          // inverted={true}
          renderItem={({item}) => {
            return (
              <Pressable style={styles.feed} onPress={()=>navigation.navigate('FeedDetail', {feedId:item.feedId})}>
                <Feed
                  mine={item.isAuthor}
                  detail={false}
                  commentCnt={item.commentCount}
                  createdAt={item.createdAt}
                  content={item.content}
                  emoticons={item.emoticons}
                  nickname={item.friendNickname}
                  status={item.status}
                  accountId={item.accountId}
                  imageURL={item.feedImageUrls}
                  press={pressEmoticon}
                  feedId={item.feedId}
                  whoReact={whoReact}
                />
              </Pressable>
            );
          }}
        />}
      </View>
      <View style={{height:Math.min(80, Math.max(35, KBsize))}}></View>
      <View style={styles.newFeedView}>
        <Pressable style={styles.addPhoto} onPress={()=>ImagePicker.openPicker({
          width: windowWidth,
          height:315,
          multiple:true,
          cropping:true,
        })
        .then(image => {
          // uploadImages(image)
        })}>
          <Image style={{height:24, width:24}} source={require('../../assets/image/addphoto.png')}/>
        </Pressable>
        <TextInput 
          placeholder={placeholder}
          placeholderTextColor={'#848484'}
          style={[styles.newFeedTxtInput, {height:Math.min(80, Math.max(35, KBsize))}]}
          onFocus={()=>setPlaceholder('')}
          onBlur={()=>setPlaceholder('지금 기분이 어때요?')}
          onChangeText={(text:string)=>{setFeedContent(text)}}
          blurOnSubmit={false}
          maxLength={500}
          value={feedContent}
          onSubmitEditing={sendNewFeed}
          multiline={true}
          autoCapitalize='none'
          autoComplete='off'
          autoCorrect={false}
          onContentSizeChange={(e) => {setKBsize(e.nativeEvent.contentSize.height);}}
          // numberOfLines={4}
        />
        <Pressable style={feedContent == '' ? styles.sendNewFeed : styles.sendNewFeedActivated} disabled={feedContent == ''} onPress={sendNewFeed}>
          <Feather name="check" size={24} style={{color:'white'}}/>
        </Pressable>
      </View>
      <Modal 
        isVisible={showBottomSheet}
        onBackButtonPress={()=>setShowBottomSheet(false)} 
        backdropColor='#222222' backdropOpacity={0.5}
        onSwipeComplete={()=>setShowBottomSheet(false)}
        swipeDirection={'down'}
        style={{justifyContent:'flex-end', margin:0}}>
        <Pressable style={styles.modalBGView} onPress={()=>setShowBottomSheet(false)}>
          <Pressable style={styles.modalView} onPress={(e)=>e.stopPropagation()}>
            <View style={styles.whoReacted}>
              <Image style={styles.emoticon} source={require('../../assets/image/heartEmoticon.png')} />
              <Text style={styles.emoticonTxt}>{EmoticonList.heartEmoticonNicknameList.join(' ') == '' ? '-' : EmoticonList.heartEmoticonNicknameList.join(', ').replace(/ /g, '\u00A0')}</Text>
            </View>
            <View style={styles.whoReacted}>
              <Image style={styles.emoticon} source={require('../../assets/image/smileEmoticon.png')} />
              <Text style={styles.emoticonTxt}>{EmoticonList.smileEmoticonNicknameList.join(' ') == '' ? '-' : EmoticonList.smileEmoticonNicknameList.join(', ').replace(/ /g, '\u00A0')}</Text>
            </View>
            <View style={styles.whoReacted}>
              <Image style={styles.emoticon} source={require('../../assets/image/sadEmoticon.png')} />
              <Text style={styles.emoticonTxt}>{EmoticonList.sadEmoticonNicknameList.join(' ') == '' ? '-' : EmoticonList.sadEmoticonNicknameList.join(', ').replace(/ /g, '\u00A0')}</Text>
            </View>
            <View style={styles.whoReacted}>
              <Image style={styles.emoticon} source={require('../../assets/image/surpriseEmoticon.png')} />
              <Text style={styles.emoticonTxt}>{EmoticonList.surpriseEmoticonNicknameList.join(' ') == '' ? '-' : EmoticonList.surpriseEmoticonNicknameList.join(', ').replace(/ /g, '\u00A0')}</Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal:16,
    paddingTop:10,
    paddingBottom:10,
  },
  feedList:{
    width:'100%',
  },
  feed:{
    width:'100%',
    marginBottom:11,
    borderRadius:10,
    backgroundColor:'#FFFFFF',
  },
  newFeedView:{
    flexDirection:'row',
    backgroundColor:'#F7F7F7',
    width:'100%',
    position:'absolute',
    bottom:0,
    justifyContent:'space-between',
    alignItems:'center',
    // borderRightColor:'pink',
  },
  addPhoto:{
    marginLeft:12,
    marginRight:8,
  },
  newFeedTxtInput:{
    color:'#222222',
    fontSize:15,
    fontWeight:'400',
    flex:1, 
    backgroundColor:'#FFFFFF',
    marginVertical:6,
    marginRight:4,
    borderRadius:10,
    paddingVertical:3,
    paddingHorizontal:10,
    // maxHeight:'4vh'
  },
  sendNewFeed:{
    backgroundColor:'#B7B7B7',
    justifyContent:'center',
    alignItems:'center',
    width:48,
    height:'100%'
  },
  sendNewFeedActivated:{
    backgroundColor:'#FFB443',
    justifyContent:'center',
    alignItems:'center',
    width:48,
    height:'100%'
  },
  modalBGView:{
    flex:1,
    justifyContent:'flex-end'
  },
  modalView:{
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    paddingHorizontal:16,
    paddingVertical:16,
    backgroundColor:'white',
    // elevation: 10,
  },
  whoReacted:{
    flexDirection:'row',
    marginVertical:4,
  },
  emoticon:{
    width:24,
    height:24
  },
  emoticonTxtView:{
    flexShrink:1
  },
  emoticonTxt:{
    color:'#222222',
    fontWeight:'400',
    fontSize:15,
    paddingLeft:8,
    flex:1
  },
});