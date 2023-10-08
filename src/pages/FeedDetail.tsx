import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Modal as M, TextInput } from 'react-native';
import { RootStackParamList } from '../../AppInner';
import Feed from '../components/Feed';
import axios, { AxiosError } from 'axios';
// @ts-ignore
import { Shadow } from 'react-native-shadow-2';
import { useFocusEffect } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Config from 'react-native-config';
import Modal from 'react-native-modal'

type FeedDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'FeedDetail'>;

export default function FeedDetail({navigation, route}:FeedDetailScreenProps) {
  const [refresh, setRefresh] = useState(false);
  const [feedData, setFeedData] = useState({
    accountId: -1,
    feedId : -1,
    status : "",
    friendNickname: "",
    content : "",
    feedImageUrls : [null],
    commentCount : -1,
    emoticons : {
      heartEmoticonCount: -1,
      isCheckedHeartEmoticon: false,
      smileEmoticonCount: -1,
      isCheckedSmileEmoticon: false,
      sadEmoticonCount: -1,
      isCheckedSadEmoticon: false,
      surpriseEmoticonCount: -1,
      isCheckedSurpriseEmoticon: false,
    },
    isAuthor : false,
    createdAt : ""
  });
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [EmoticonList, setEmoticonList] = useState({
    heartEmoticonNicknameList:['-'],
    smileEmoticonNicknameList:[''],
    sadEmoticonNicknameList:[''],
    surpriseEmoticonNicknameList:[''],
  });
  const [KBsize, setKBsize] = useState(0);
  const [cmtContent, setCmtContent] = useState('');
  const [placeholder, setPlaceholder] = useState('댓글을 적어주세요');

  useFocusEffect(
    useCallback(()=>{
      const getFeed = async () => {
        try {
          const response = await axios.get(`${Config.API_URL}/feeds/${route.params.feedId}`,);
          console.log(response.data.data);
          setFeedData(response.data.data);
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>).response;
          console.log(errorResponse.data);
        }
      }
      getFeed();
    },[refresh])
  );

  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(()=>{
    if (feedData.isAuthor) {
      navigation.setOptions({headerRight:()=>(
        <Pressable onPress={()=>(setDeleteModal(true))}>
          <Feather name="more-vertical" size={24} color={'#848484'} />
        </Pressable>
      )});
    }
  },[]);
  
  const deleteFeed = async () => {
    try {
      console.log(feedData.feedId)
      const response = await axios.delete(`${Config.API_URL}/feeds/${feedData.feedId}`, {});
      console.log(response.data.data);
      if (response.data.data.isDeleted) {navigation.goBack();}
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      if (errorResponse?.data.statusCode == 4030) {
        console.log('already deleted');
        navigation.goBack();
      }
      console.log(errorResponse.data);
    }
  };

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

  const sendNewCmt = async () => {};
  
  return (
    <View style={styles.entire}>
      <View style={styles.feedView}>
        <Feed
          mine={feedData.isAuthor}
          detail={true}
          commentCnt={feedData.commentCount}
          createdAt={feedData.createdAt}
          content={feedData.content}
          emoticons={feedData.emoticons}
          nickname={feedData.friendNickname}
          status={feedData.status}
          accountId={feedData.accountId}
          imageURL={feedData.feedImageUrls}
          press={pressEmoticon}
          feedId={feedData.feedId}
          whoReact={whoReact}
        />
      </View>
      <View style={styles.commentView}>
        <View style={styles.commentHeader}>
          <Image source={require('../../assets/image/commentIcon.png')} />
          <Text style={styles.commentHeaderTxt}>댓글 {feedData.commentCount}개</Text>
        </View>
      </View>
      <View style={styles.newCmtView}>
        <TextInput 
          placeholder={placeholder}
          placeholderTextColor={'#848484'}
          style={[styles.newCmtTxtInput, {height:Math.min(80, Math.max(35, KBsize))}]}
          onFocus={()=>setPlaceholder('')}
          onBlur={()=>setPlaceholder('댓글을 적어주세요')}
          onChangeText={(text:string)=>{setCmtContent(text)}}
          blurOnSubmit={false}
          maxLength={500}
          value={cmtContent}
          onSubmitEditing={sendNewCmt}
          multiline={true}
          autoCapitalize='none'
          autoComplete='off'
          autoCorrect={false}
          onContentSizeChange={(e) => {setKBsize(e.nativeEvent.contentSize.height);}}
          // numberOfLines={4}
        />
        <Pressable style={cmtContent == '' ? styles.sendNewCmt : styles.sendNewCmtActivated} disabled={cmtContent == ''} onPress={sendNewCmt}>
          <Feather name="check" size={24} style={{color:'white'}}/>
        </Pressable>
      </View>
      <M visible={deleteModal} transparent={true}>
        <Pressable onPress={()=>setDeleteModal(false)} style={{flex:1}}>
          <View style={styles.popup}>
            <Shadow distance={10} startColor='#00000008'>
              <Pressable onPress={deleteFeed} style={styles.deleteFeed}>
                <Text style={styles.deleteFeedTxt}>삭제하기</Text>
              </Pressable>
            </Shadow>
          </View>
        </Pressable>
      </M>
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
    backgroundColor:'#FFFFFF'
  },
  feedView:{
    paddingHorizontal:6,
    width:'100%',
    paddingTop:6,
  },
  commentView:{
    width: '100%',
  },
  commentHeader:{
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 36,
    borderBottomColor: '#ECECEC',
    borderBottomWidth: 1,
    borderTopColor: '#ECECEC',
    borderTopWidth: 1,
    paddingLeft: 15
  },
  commentHeaderTxt:{
    marginLeft: 3,
    color: '#848484',
    fontSize: 12,
    fontWeight: '500',
  },
  popup:{
    position:'absolute',
    right:35,
    top:34,
  },
  deleteFeed:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#FFFFFF',
    paddingHorizontal:18,
    paddingVertical:13,
    borderRadius:5,
  },
  deleteFeedTxt:{
    color:'#222222',
    fontWeight:'400',
    fontSize:15
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
  newCmtView:{
    flexDirection:'row',
    backgroundColor:'#F7F7F7',
    width:'100%',
    position:'absolute',
    bottom:0,
    justifyContent:'space-between',
    alignItems:'center',
    paddingLeft:16,
  },
  newCmtTxtInput:{
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
  sendNewCmt:{
    backgroundColor:'#B7B7B7',
    justifyContent:'center',
    alignItems:'center',
    width:48,
    height:'100%'
  },
  sendNewCmtActivated:{
    backgroundColor:'#FFB443',
    justifyContent:'center',
    alignItems:'center',
    width:48,
    height:'100%'
  },
});