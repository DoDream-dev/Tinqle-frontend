import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { RefreshControl, Keyboard, View, Text, StyleSheet, Pressable, Modal as M, TextInput, FlatList } from 'react-native';
import { RootStackParamList } from '../../AppInner';
import Feed from '../components/Feed';
import axios, { AxiosError } from 'axios';
// @ts-ignore
import { Shadow } from 'react-native-shadow-2';
import { useFocusEffect } from '@react-navigation/native';
import Content from '../components/Content';
import Feather from 'react-native-vector-icons/Feather';
import Config from 'react-native-config';
import Modal from 'react-native-modal'
import { svgXml } from '../../assets/image/svgXml';
import { SvgXml } from 'react-native-svg'
import { throttleTime, throttleTimeEmoticon } from '../hooks/Throttle';
import _ from 'lodash';
import { useAppDispatch } from '../store';
import userSlice from '../slices/user';

type FeedDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'FeedDetail'>;
type itemProps = {
  item:{
    commentId:number;
    content:string;
    childCount:number;
    accountId:number;
    friendNickname:string;
    status:string;
    isAuthor:boolean,
    createAt:string;
    childCommentCardList: [
      {
        parentId:number;
        commentId:number;
        content:string;
        accountId:number;
        friendNickname:string;
        status:string;
        isAuthor:boolean;
        createAt:string;
      }
    ]
  }
};

export default function FeedDetail({navigation, route}:FeedDetailScreenProps) {
  const dispach = useAppDispatch();

  const [refresh, setRefresh] = useState(false);
  const [feedData, setFeedData] = useState({
    accountId: -1,
    feedId : -1,
    status : "",
    friendNickname: "",
    content : "",
    feedImageUrls : [null],
    commentCount : 0,
    emoticons : {
      heartEmoticonCount: 0,
      isCheckedHeartEmoticon: false,
      smileEmoticonCount: 0,
      isCheckedSmileEmoticon: false,
      sadEmoticonCount: 0,
      isCheckedSadEmoticon: false,
      surpriseEmoticonCount: 0,
      isCheckedSurpriseEmoticon: false,
    },
    isAuthor : false,
    createdAt : ""
  });
  const [cmtData, setCmtData] = useState([]);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [EmoticonList, setEmoticonList] = useState({
    heartEmoticonNicknameList:['-'],
    smileEmoticonNicknameList:[''],
    sadEmoticonNicknameList:[''],
    surpriseEmoticonNicknameList:[''],
  });
  const [KBsize, setKBsize] = useState(0);
  const [cmtContent, setCmtContent] = useState('');
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState('댓글을 적어주세요');
  const [cursorId, setCursorId] = useState(0);

  useFocusEffect(
    useCallback(()=>{
      const getFeed = async () => {
        try {
          const response = await axios.get(`${Config.API_URL}/feeds/${route.params.feedId}`,);
          setFeedData(response.data.data);
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>).response;
          console.log(errorResponse.data);
          if (errorResponse?.data.statusCode == 4030 || errorResponse?.data.statusCode == 4010) {
            console.log('삭제된 글');
            dispach(
              userSlice.actions.setDeleted({
                deleted:true,
              }),
            );
            navigation.navigate('FeedList')
          }
          if (errorResponse?.data.status == 500) {
            dispach(
              userSlice.actions.setToken({
                accessToken:'',
              }),
            );
          }
        }
      }
      const getCmt = async () => {
        try {
          const response = await axios.get(`${Config.API_URL}/feeds/${route.params.feedId}/comments`,);
          setCmtData(response.data.data.content);
          if (response.data.data.content.length == 0) {setCursorId(0);}
          else {
            setCursorId(response.data.data.content[response.data.data.content.length-1].commentId)
          }
          setIsLast(response.data.data.last);
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>).response;
          console.log(errorResponse.data);
          if (errorResponse?.data.status == 500) {
            dispach(
              userSlice.actions.setToken({
                accessToken:'',
              }),
            );
          }
        }
      }
      getFeed();
      getCmt();
    },[refresh])
  );
  useFocusEffect(
    useCallback(()=>{
      const reloadStatus = () => {
        navigation.setOptions({headerRight:()=>(
          <View style={{flexDirection:'row'}}>
            {feedData.isAuthor && <Pressable onPress={()=>setDeleteModal(true)}>
              <SvgXml width={24} height={24} xml={svgXml.icon.menu}/>
            </Pressable>}
          </View>
        )});
      }
      if (feedData.isAuthor) reloadStatus();
    },[refresh, feedData.isAuthor]));

  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(()=>{
    const handleKeyboardDismiss = () => {
      setWriteChildCmt(-1);
    }
    const KeyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardDismiss);
    if (feedData.isAuthor) {
      navigation.setOptions({headerRight:()=>(
        <Pressable onPress={()=>(setDeleteModal(true))}>
          <Feather name="more-vertical" size={24} color={'#848484'} />
        </Pressable>
      )});
    }
    return () => {
      KeyboardDidHideListener.remove();
    }
  },[]);
  
  const deleteFeed = _.throttle(async () => {
    try {
      if (feedData.feedImageUrls[0] != null) {
        const response = await axios.delete(`${Config.API_URL}/images/feed?fileUrls=${feedData.feedImageUrls[0]}`,);
        console.log('img del:',response.data.data)
      }
      const response = await axios.delete(`${Config.API_URL}/feeds/${feedData.feedId}`, {});
      console.log(response.data.data);
      if (response.data.data.isDeleted) {navigation.goBack();}
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      if (errorResponse?.data.statusCode == 4030 || errorResponse?.data.statusCode == 4010) {
        console.log('already deleted');
        navigation.goBack();
      }
      if (errorResponse?.data.status == 500) {
        dispach(
          userSlice.actions.setToken({
            accessToken:'',
          }),
        );
      }
      console.log(errorResponse.data);
    }
  }, throttleTime);

  const pressEmoticon = _.debounce(async (feedId:number, emoticon:string) => {
    try {
      const response = await axios.put(`${Config.API_URL}/emoticons/feeds/${feedId}`, {emoticonType:emoticon},);
      // console.log(response.data.data);
      setRefresh(!refresh);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
      if (errorResponse?.data.statusCode == 4030 || errorResponse?.data.statusCode == 4010) {
        console.log('삭제된 글');
        dispach(
          userSlice.actions.setDeleted({
            deleted:true,
          }),
        );
        navigation.navigate('FeedList')
      }
      if (errorResponse?.data.status == 500) {
        dispach(
          userSlice.actions.setToken({
            accessToken:'',
          }),
        );
      }
    }
  }, throttleTimeEmoticon);

  const whoReact = _.throttle(async (feedId:number) => {
    try {
      const response = await axios.get(`${Config.API_URL}/emoticons/feeds/${feedId}`,);
      // console.log(response.data.data);
      setEmoticonList(response.data.data);
      setShowBottomSheet(true);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
      if (errorResponse?.data.statusCode == 4030 || errorResponse?.data.statusCode == 4010) {
        console.log('삭제된 글');
        dispach(
          userSlice.actions.setDeleted({
            deleted:true,
          }),
        );
        navigation.navigate('FeedList')
      }
      if (errorResponse?.data.status == 500) {
        dispach(
          userSlice.actions.setToken({
            accessToken:'',
          }),
        );
      }
    }
  }, throttleTime);

  const sendNewCmt = _.throttle(async () => {
    try {
      const response = await axios.post(`${Config.API_URL}/feeds/${feedData.feedId}/comments/parent`, {content:cmtContent});
      // console.log(response.data.data);
      setCmtContent('');
      setRefresh(!refresh);
      setIsLast(false);
      // console.log(throttleTime)
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
      if (errorResponse?.data.statusCode == 4030 || errorResponse?.data.statusCode == 4010) {
        console.log('삭제된 글');
        dispach(
          userSlice.actions.setDeleted({
            deleted:true,
          }),
        );
        navigation.navigate('FeedList')
      }
      if (errorResponse?.data.status == 500) {
        dispach(
          userSlice.actions.setToken({
            accessToken:'',
          }),
        );
      }
    }
  }, throttleTime);

  const sendNewChildCmt = _.throttle(async () => {
    try {
      const response = await axios.post(`${Config.API_URL}/feeds/${feedData.feedId}/comments/${writeChildCmt}/children`, {content:cmtContent});
      // console.log(response.data.data);
      setCmtContent('');
      setRefresh(!refresh);
      setIsLast(false);
      setWriteChildCmt(-1);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
      if (errorResponse?.data.statusCode == 4030 || errorResponse?.data.statusCode == 4010) {
        console.log('삭제된 글');
        dispach(
          userSlice.actions.setDeleted({
            deleted:true,
          }),
        );
        navigation.navigate('FeedList')
      }
      if (errorResponse?.data.status == 500) {
        dispach(
          userSlice.actions.setToken({
            accessToken:'',
          }),
        );
      }
    }
  }, throttleTime);;

  const getData = async () => {
    setLoading(true);
    if (!isLast) {
      try {
        const response = await axios.get(`${Config.API_URL}/feeds/${route.params.feedId}/comments?cursorId=${cursorId}`,);
        setIsLast(response.data.data.last);
        setCmtData(cmtData.concat(response.data.data.content));
        if (response.data.data.content.length == 0) {setCursorId(0)}
        else {
          setCursorId(response.data.data.content[response.data.data.content.length-1].commentId)
        }
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse.data);
        if (errorResponse?.data.statusCode == 4030 || errorResponse?.data.statusCode == 4010) {
          console.log('삭제된 글');
          dispach(
            userSlice.actions.setDeleted({
              deleted:true,
            }),
          );
          navigation.navigate('FeedList')
        }
        if (errorResponse?.data.status == 500) {
          dispach(
            userSlice.actions.setToken({
              accessToken:'',
            }),
          );
        }
      }
    }
    setLoading(false);
  };

  const onEndReached = () => {
    if (!loading) {getData();}
  };

  const [refreshing, setRefreshing] = useState(false);
    
  const onRefresh = async () => {
    setRefreshing(true);
    // await RefreshDataFetch();
    setRefresh(!refresh)
    setRefreshing(false);
  }

  
  const inputRef = useRef();
  const [writeChildCmt, setWriteChildCmt] = useState(-1);
  useEffect(()=>{
    if (writeChildCmt != -1) {
      setPlaceholder('대댓글을 적어주세요');
      inputRef.current.focus();
    }
    else {
      setPlaceholder('댓글을 적어주세요')
    }
  }, [writeChildCmt])


  return (
    <View style={styles.entire}>
      <View style={styles.commentView}>
        <FlatList
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          data={cmtData}
          style={styles.cmtList}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          ListHeaderComponent={
            <View>
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
              <View style={styles.commentHeader}>
                <SvgXml width={16} height={14} xml={svgXml.icon.commentIcon} />
                <Text style={styles.commentHeaderTxt}>댓글 {feedData.commentCount}개</Text>
              </View>
            </View>
          }
          renderItem={({item}:itemProps) => {
            const childData = item.childCommentCardList
            return (
              <Pressable style={writeChildCmt == item.commentId 
              ? {borderBottomWidth:1,borderColor:'#ECECEC',backgroundColor:'#FFB4431A'} 
              : {borderBottomWidth:1,borderColor:'#ECECEC'}}>
                <Content 
                  nickname={item.friendNickname}
                  status={item.status}
                  content={item.content}
                  createdAt={item.createAt}
                  accountId={item.accountId}
                  mine={item.isAuthor}
                  imageURL={[null]}
                  detail={true}
                  cmt={true}
                  child={setWriteChildCmt}
                  cmtId={item.commentId}
                />
                {item.childCount != 0 
                && <View style={{backgroundColor:'white'}}>
                  <FlatList 
                    data={childData}
                    // style={{borderTopWidth:1, borderTopColor:'#ECECEC',}}
                    renderItem={({item}) => {
                      return (
                        <View style={styles.childCmt}>
                          <Content 
                            nickname={item.friendNickname}
                            status={item.status}
                            content={item.content}
                            createdAt={item.createAt}
                            accountId={item.accountId}
                            mine={item.isAuthor}
                            imageURL={[null]}
                            detail={true}
                            cmt={false}
                            child={setWriteChildCmt}
                            cmtId={item.commentId}
                          />
                        </View>
                      );
                    }}
                  />
                </View>}
              </Pressable>
            );
          }}
        />
      </View>
      <View style={{height:Math.min(80, Math.max(45, KBsize))}}></View>
      <View style={styles.newCmtView}>
        <TextInput 
          placeholder={placeholder}
          placeholderTextColor={'#848484'}
          style={[styles.newCmtTxtInput, {height:Math.min(80, Math.max(35, KBsize))}]}
          onBlur={()=>setWriteChildCmt(-1)}
          onChangeText={(text:string)=>{setCmtContent(text)}}
          blurOnSubmit={false}
          maxLength={200}
          value={cmtContent}
          onSubmitEditing={()=>sendNewCmt()}
          multiline={true}
          autoCapitalize='none'
          autoComplete='off'
          autoCorrect={false}
          onContentSizeChange={(e) => {setKBsize(e.nativeEvent.contentSize.height);}}
          ref={inputRef}
          // numberOfLines={4}
        />
        <Pressable style={cmtContent.trim() == '' ? styles.sendNewCmt : styles.sendNewCmtActivated} disabled={cmtContent.trim() == ''} onPress={writeChildCmt == -1 ? sendNewCmt : sendNewChildCmt}>
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
              <SvgXml width={22} height={22} xml={svgXml.emoticon.heart} />
              <Text style={styles.emoticonTxt}>{EmoticonList.heartEmoticonNicknameList.join(' ') == '' ? '-' : EmoticonList.heartEmoticonNicknameList.join(', ').replace(/ /g, '\u00A0')}</Text>
            </View>
            <View style={styles.whoReacted}>
              <SvgXml width={22} height={22} xml={svgXml.emoticon.smile} />
              <Text style={styles.emoticonTxt}>{EmoticonList.smileEmoticonNicknameList.join(' ') == '' ? '-' : EmoticonList.smileEmoticonNicknameList.join(', ').replace(/ /g, '\u00A0')}</Text>
            </View>
            <View style={styles.whoReacted}>
              <SvgXml width={22} height={22} xml={svgXml.emoticon.sad} />
              <Text style={styles.emoticonTxt}>{EmoticonList.sadEmoticonNicknameList.join(' ') == '' ? '-' : EmoticonList.sadEmoticonNicknameList.join(', ').replace(/ /g, '\u00A0')}</Text>
            </View>
            <View style={styles.whoReacted}>
              <SvgXml width={22} height={22} xml={svgXml.emoticon.surprise} />
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
    flex:1,    
    // borderTopColor: '#ECECEC',
    // borderTopWidth: 1,
  },
  commentHeader:{
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 36,
    borderColor: '#ECECEC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingLeft: 15
  },
  commentHeaderTxt:{
    marginLeft: 3,
    color: '#848484',
    fontSize: 12,
    fontWeight: '500',
  },
  cmtList:{
    // borderBottomWidth:1,
    // borderBottomColor:'#ECECEC',
  },
  childCmt:{
    borderTopWidth:1,
    borderTopColor:'#ECECEC',
    paddingLeft:40
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