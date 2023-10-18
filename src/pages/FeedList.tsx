import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Image, TextInput, Dimensions } from 'react-native';
import { RootStackParamList } from '../../AppInner';
import Feed from '../components/Feed';
import Config from 'react-native-config';
import axios, { AxiosError } from 'axios';
import Feather from 'react-native-vector-icons/Feather'
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import { useFocusEffect } from '@react-navigation/native';
type FeedListScreenProps = NativeStackScreenProps<RootStackParamList, 'FeedList'>;
type itemProps = {
  item:{
    feedId:number;
    accountId:number;
    status:string;
    friendNickname:string;
    content:string;
    feedImageUrls:string[],
    commentCount:number;
    emoticons:{
      smileEmoticonCount:number;
      sadEmoticonCount:number;
      heartEmoticonCount:number;
      surpriseEmoticonCount:number;
      isCheckedSmileEmoticon:boolean;
      isCheckedSadEmoticon:boolean;
      isCheckedHeartEmoticon:boolean;
      isCheckedSurpriseEmoticon:boolean;
    },
    isAuthor:boolean;
    createdAt:string;
  }
}
export default function FeedList({navigation}:FeedListScreenProps) {
  const [feedData, setFeedData] = useState([]);
  const [noFeed, setNoFeed] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [cursorId, setCursorId] = useState(0);
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
  const [uploadImage, setUploadImage] = useState(new FormData());
  const [imgData, setImgData] = useState({
    uri:'',
    type:'',
    // name:undefined,
  });
  const [image, setImage] = useState([]);
  const [selectImg, setSelectImg] = useState(false);
  const windowHeight = Dimensions.get('screen').height;
  const windowWidth = Dimensions.get('screen').width;
  const [status, setStatus] = useState('');

  
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
  // useEffect(()=>{
  //   console.log(feedData.length)
  //   flatRef.current.scrollToEnd({animated:true});
  // },[feedData]);

  useFocusEffect(
    useCallback(()=>{
      const reloadStatus = () => {
        navigation.setOptions({headerRight:()=>(
          <View style={{flexDirection:'row'}}>
            <Pressable style={{marginRight:12}}>
              <Feather name="bell" size={24} color={'#848484'} />
            </Pressable>
            <Pressable style={{marginRight:3}} onPress={()=>navigation.navigate('Profile', {whose:0, accountId:-1})}>
            {/* <Feather name="smile" size={24} color={'#848484'} /> */}
            {status == 'smile' && <Image source={require('../../assets/image/status01smile.png')} style={{width:24, height:24}}/>}
            {status == 'happy' && <Image style={{height:24, width:24}} source={require('../../assets/image/status02happy.png')} />}
            {status == 'sad' && <Image style={{height:24, width:24}} source={require('../../assets/image/status03sad.png')} />}
            {status == 'mad' && <Image style={{height:24, width:24}} source={require('../../assets/image/status04mad.png')} />}
            {status == 'exhausted' && <Image style={{height:24, width:24}} source={require('../../assets/image/status05exhausted.png')} />}
            {status == 'coffee' && <Image style={{height:24, width:24}} source={require('../../assets/image/status06coffee.png')} />}
            {status == 'meal' && <Image style={{height:24, width:24}} source={require('../../assets/image/status07meal.png')} />}
            {status == 'alcohol' && <Image style={{height:24, width:24}} source={require('../../assets/image/status08alcohol.png')} />}
            {status == 'chicken' && <Image style={{height:24, width:24}} source={require('../../assets/image/status09chicken.png')} />}
            {status == 'sleep' && <Image style={{height:24, width:24}} source={require('../../assets/image/status10sleep.png')} />}
            {status == 'work' && <Image style={{height:24, width:24}} source={require('../../assets/image/status11work.png')} />}
            {status == 'study' && <Image style={{height:24, width:24}} source={require('../../assets/image/status12study.png')} />}
            {status == 'movie' && <Image style={{height:24, width:24}} source={require('../../assets/image/status13movie.png')} />}
            {status == 'move' && <Image style={{height:24, width:24}} source={require('../../assets/image/status14move.png')} />}
            {status == 'dance' && <Image style={{height:24, width:24}} source={require('../../assets/image/status15dance.png')} />}
            {status == 'read' && <Image style={{height:24, width:24}} source={require('../../assets/image/status16read.png')} />}
            {status == 'walk' && <Image style={{height:24, width:24}} source={require('../../assets/image/status17walk.png')} />}
            {status == 'travel' && <Image style={{height:24, width:24}} source={require('../../assets/image/status18travel.png')} />}
            </Pressable>
          </View>
        )});
      }
      reloadStatus();
  },[refresh, status]));

  useFocusEffect(
    useCallback(()=>{
      const getFeed = async () => {
        try {
          const response = await axios.get(`${Config.API_URL}/feeds`,);
          if (response.data.data.content.length == 0) setNoFeed(true);
          else {
            setIsLast(response.data.data.last);
            setFeedData(response.data.data.content);
            if (response.data.data.content.length != 0) {
              setCursorId(response.data.data.content[response.data.data.content.length-1].feedId)
            }
          }
          const res2 = await axios.get(`${Config.API_URL}/accounts/me`);
          setStatus(res2.data.data.status.toLowerCase());
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
        const response = await axios.get(`${Config.API_URL}/feeds?cursorId=${cursorId}`,);
        console.log(response.data.data)
        setIsLast(response.data.data.last);
        setFeedData(response.data.data.content.concat(feedData));
        if (response.data.data.content.length != 0) {
          setCursorId(response.data.data.content[response.data.data.content.length-1].feedId)
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

  const sendNewFeed = async () => {
    try {
      let temp;
      if (selectImg) {
        // console.log(uploadImage.getParts().at(0))
        // const requestOptions = {
        //   method: 'POST',
        //   body: uploadImage,
        //   headers:{'Content-Type':'multipart/form-data'},
        // };
        const imageFormData = new FormData();
        let files = [];
        image.map(x => {
          const file = {
            uri: x?.path.includes(':')
              ? x?.path
              : 'file://' + x?.path,
            // type: x?.mime,
            type: 'multipart/form-data',
            name: 'image' + x?.mime.replace('image/', '.'),
          };
          files.push(file);
        });
        imageFormData.append('type', 'feed');
        imageFormData.append('files', files);
        console.log('files; ', files);
        setImgData({
          uri:image[0].path,
          type:image[0].mime,
        });
        setSelectImg(true);
        setUploadImage(imageFormData);
      
        // await fetch(`${Config.API_URL}/feeds`, requestOptions)
        const response = await axios.post(`${Config.API_URL}/images`, imageFormData, {
          headers:{'Content-Type':'multipart/form-data'},
          transformRequest: (data, headers) => {
            return data;
          },
        });
        console.log(response.data);
        // .then(response => {
          // console.log(response.json);
          // temp = response.json()
          // temp = response.data.data.files.fileUrl;
        // })
        // console.log(response.data.data);
        // temp = response.data.data.files.fileUrl;
      }
      else {temp=null;}
      const response = await axios.post(`${Config.API_URL}/feeds`, {
        content:feedContent,
        feedImageUrl:[null],
        isReceivedEmoticon:true,
      });
      console.log(response.data.data);
      setFeedContent('');
      setSelectImg(false);
      setImgData({uri:'',type:''});
      setUploadImage(new FormData());
      setRefresh(!refresh);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  // const uploadImages = async () => {
  //   try {
  //     const response = await axios.post(`${Config.API_URL}/images`, uploadImage, );
  //     console.log(response.data.data);
  //   } catch (error) {
  //     const errorResponse = (error as AxiosError<{message: string}>).response;
  //     console.log(errorResponse.data);
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

  const flatRef = useRef();

  return (
    <View style={{flex:1}}>
      <View style={[styles.entire]}>
        {noFeed ? <View style={styles.noFeedView}>
          <Text style={styles.noFeedTxt}>지금 떠오르는 생각을 적어보세요!</Text>
        </View> : 
        <FlatList 
          // initialScrollIndex={feedData.length == 0 ? 0 :feedData.length-1}
          data={feedData.slice().reverse()}
          style={styles.feedList}
          // onEndReached={onEndReached}
          // onEndReachedThreshold={0.4}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          keyboardShouldPersistTaps={'always'}
          // inverted={true}
          ref={flatRef}
          renderItem={({item}:itemProps) => {
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
      <View style={[styles.newFeedAll, {width:windowWidth}]}>
        {selectImg && <View style={[styles.newFeedImgView, {width:windowWidth}]}>
          <Pressable onPress={()=>{setSelectImg(false); setImgData({uri:'',type:''}); setUploadImage(new FormData());}}>
            <Image source={{uri:imgData.uri}} style={styles.newFeedImg} />
            <Image source={require('../../assets/image/x.svg')} style={styles.xBtn}/>
          </Pressable>
        </View>}
        <View style={styles.newFeedView}>
          <Pressable style={styles.addPhoto} onPress={()=>ImagePicker.openPicker({
            width: windowWidth,
            height:315,
            multiple:true,
            cropping:true,
          })
          .then(image => {
            // uploadImages(image)
            console.log(image)
            const imageFormData = new FormData();
            let files = [];
            image.map(x => {
              const file = {
                uri: x?.path.includes(':')
                  ? x?.path
                  : 'file://' + x?.path,
                // type: x?.mime,
                type: 'multipart/form-data',
                name: 'image' + x?.mime.replace('image/', '.'),
              };
              files.push(file);
            });
            imageFormData.append('files', files);
            console.log('files; ', files);
            setImgData({
              uri:image[0].path,
              type:image[0].mime,
            });
            setSelectImg(true);
            setImage(image);
            imageFormData.append('type', 'feed');
            setUploadImage(imageFormData);
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
          <Pressable style={feedContent == '' && !selectImg ? styles.sendNewFeed : styles.sendNewFeedActivated} disabled={feedContent == '' && !selectImg} onPress={sendNewFeed}>
            <Feather name="check" size={24} style={{color:'white'}}/>
          </Pressable>
        </View>
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
  noFeedTxt:{
    color:'#848484',
    fontSize:12,
    fontWeight:'500'
  },
  noFeedView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
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
  newFeedAll:{
    position:"absolute", 
    bottom:0,
    justifyContent:'flex-end', 
    alignItems:'center'
  },
  newFeedImgView:{
    paddingVertical:12, 
    backgroundColor:'rgba(34, 34, 34, 0.5)',
    justifyContent:'center', 
    alignItems:'center',
  },
  newFeedImg:{
    width:76,
    height:76,
  },
  xBtn:{
    position:'absolute',
    right:-8,
    top:-8,
    height:18,
    width:18,
  },
  newFeedView:{
    flexDirection:'row',
    backgroundColor:'#F7F7F7',
    width:'100%',
    justifyContent:'space-between',
    alignItems:'center',
    flex:1,
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
    height:'100%',
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