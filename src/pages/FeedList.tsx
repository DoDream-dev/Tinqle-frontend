import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  TextInput,
  Dimensions,
  RefreshControl,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {RootStackParamList} from '../../AppInner';
import Feed from '../components/Feed';
import Config from 'react-native-config';
import axios, {AxiosError} from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import ImagePicker, {openPicker} from 'react-native-image-crop-picker';
import {useFocusEffect} from '@react-navigation/native';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/image/svgXml';
import {throttleTime, throttleTimeEmoticon} from '../hooks/Throttle';
import _ from 'lodash';
import {RootState, useAppDispatch} from '../store';
import {useSelector} from 'react-redux';
import ToastScreen from '../components/ToastScreen';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage/lib/typescript/EncryptedStorage';

type FeedListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'FeedList'
>;
type itemProps = {
  item: {
    feedId: number;
    accountId: number;
    status: string;
    friendNickname: string;
    content: string;
    feedImageUrls: string[];
    commentCount: number;
    emoticons: {
      smileEmoticonCount: number;
      sadEmoticonCount: number;
      heartEmoticonCount: number;
      surpriseEmoticonCount: number;
      isCheckedSmileEmoticon: boolean;
      isCheckedSadEmoticon: boolean;
      isCheckedHeartEmoticon: boolean;
      isCheckedSurpriseEmoticon: boolean;
    };
    isAuthor: boolean;
    createdAt: string;
    profileImageUrl: string | null;
  };
};
export default function FeedList({navigation, route}: FeedListScreenProps) {
  const dispatch = useAppDispatch();
  const deleted = useSelector((state: RootState) => !!state.user.deleted);
  const setDeleted = () => {
    dispatch(
      userSlice.actions.setDeleted({
        deleted: false,
      }),
    );
  };
  const [feedData, setFeedData] = useState([]);
  const [isLast, setIsLast] = useState(false);
  const [cursorId, setCursorId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState('지금 기분이 어때요?');
  const [feedContent, setFeedContent] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [KBsize, setKBsize] = useState(0);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [EmoticonList, setEmoticonList] = useState({
    heartEmoticonNicknameList: ['-'],
    smileEmoticonNicknameList: [''],
    sadEmoticonNicknameList: [''],
    surpriseEmoticonNicknameList: [''],
  });
  const [uploadImage, setUploadImage] = useState<FormData>();
  const [imgData, setImgData] = useState({
    uri: '',
    type: '',
  });
  const [selectImg, setSelectImg] = useState(false);
  const windowWidth = Dimensions.get('screen').width;
  const windowHeight = Dimensions.get('screen').height;
  const [refreshcontrol, setrefreshcontrol] = useState(false);
  const [status, setStatus] = useState('');
  const noti = useSelector((state: RootState) => !!state.user.notis);
  // console.log(noti)
  const [newNotis, setNewNotis] = useState(false);
  // console.log(newNotis)
  const [showWhoseModal, setShowWhoseModal] = useState(0);

  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
  //     const keyboardHeight = event.endCoordinates.height;
  //     // const newY = textinpY - keyboardHeight;
  //     console.log(keyboardHeight)
  //     // scroll(keyboardHeight);
  //     // setTextinY(newY);
  //     setTextinY(keyboardHeight);
  //   });

  //   const KeyboardDidHideListener = Keyboard.addListener('keyboardDidHide', (event) => {
  //     setTextinY(0);
  //   });
  //   return () => {
  //     keyboardDidShowListener.remove();
  //     KeyboardDidHideListener.remove();
  //   };
  // }, [textinpY]);

  useFocusEffect(
    useCallback(() => {
      const reloadStatus = () => {
        navigation.setOptions({
          headerRight: () => (
            <View style={{flexDirection: 'row'}}>
              <Pressable onPress={() => navigation.navigate('Notis')}>
                {!(noti || newNotis) && (
                  <SvgXml width={24} height={24} xml={svgXml.icon.noti} />
                )}
                {(noti || newNotis) && (
                  <SvgXml width={24} height={24} xml={svgXml.icon.notiYes} />
                )}
              </Pressable>
              {/* <Pressable style={{marginRight:3}} onPress={()=>navigation.navigate('MyProfile')}>
            {status == 'smile' && <SvgXml width={24} height={24} xml={svgXml.status.smile}/>}
            {status == 'happy' && <SvgXml width={24} height={24} xml={svgXml.status.happy}/>}
            {status == 'sad' && <SvgXml width={24} height={24} xml={svgXml.status.sad}/>}
            {status == 'mad' && <SvgXml width={24} height={24} xml={svgXml.status.mad}/>}
            {status == 'exhausted' && <SvgXml width={24} height={24} xml={svgXml.status.exhauseted}/>}
            {status == 'coffee' && <SvgXml width={24} height={24} xml={svgXml.status.coffee}/>}
            {status == 'meal' && <SvgXml width={24} height={24} xml={svgXml.status.meal}/>}
            {status == 'alcohol' && <SvgXml width={24} height={24} xml={svgXml.status.alcohol}/>}
            {status == 'chicken' && <SvgXml width={24} height={24} xml={svgXml.status.chicken}/>}
            {status == 'sleep' && <SvgXml width={24} height={24} xml={svgXml.status.sleep}/>}
            {status == 'work' && <SvgXml width={24} height={24} xml={svgXml.status.work}/>}
            {status == 'study' && <SvgXml width={24} height={24} xml={svgXml.status.study}/>}
            {status == 'movie' && <SvgXml width={24} height={24} xml={svgXml.status.movie}/>}
            {status == 'move' && <SvgXml width={24} height={24} xml={svgXml.status.move}/>}
            {status == 'dance' && <SvgXml width={24} height={24} xml={svgXml.status.dance}/>}
            {status == 'read' && <SvgXml width={24} height={24} xml={svgXml.status.read}/>}
            {status == 'walk' && <SvgXml width={24} height={24} xml={svgXml.status.walk}/>}
            {status == 'travel' && <SvgXml width={24} height={24} xml={svgXml.status.travel}/>}
            </Pressable> */}
            </View>
          ),
        });
      };
      reloadStatus();
    }, [refresh, status, noti, newNotis]),
  );

  useFocusEffect(
    useCallback(() => {
      const getFeed = async () => {
        try {
          const response = await axios.get(`${Config.API_URL}/feeds`);
          // console.log(response.data.data)
          if (response.data.data.content.length == 0) setFeedData([]);
          else {
            setIsLast(response.data.data.last);
            setFeedData(response.data.data.content);
            // console.log(response.data.data.content)
            if (response.data.data.content.length != 0) {
              setCursorId(
                response.data.data.content[
                  response.data.data.content.length - 1
                ].feedId,
              );
            }
          }
          const res2 = await axios.get(`${Config.API_URL}/accounts/me`);
          setStatus(res2.data.data.status.toLowerCase());
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>)
            .response;
          console.log(errorResponse?.data.status);
          if (errorResponse?.data.status == 500) {
            dispatch(
              userSlice.actions.setToken({
                accessToken: '',
              }),
            );
          }
        }
      };
      getFeed();
      // console.log(feedData)
    }, [refresh, showWhoseModal]),
  );

  useFocusEffect(
    useCallback(() => {
      const getNewNotis = async () => {
        try {
          const response = await axios.get(
            `${Config.API_URL}/notifications/count`,
          );
          // console.log(response.data.data)
          if (response.data.data.count != 0) {
            setNewNotis(true);
          } else {
            setNewNotis(false);
          }
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>)
            .response;
          console.log(errorResponse?.data);
        }
      };
      getNewNotis();
    }, [refresh, newNotis, noti]),
  );

  const getData = async () => {
    if (!isLast) {
      setLoading(true);
      try {
        // console.log(cursorId)
        const response = await axios.get(
          `${Config.API_URL}/feeds?cursorId=${cursorId}`,
        );
        // console.log(response.data.data)
        setIsLast(response.data.data.last);
        setFeedData(feedData.concat(response.data.data.content));
        if (response.data.data.content.length != 0) {
          setCursorId(
            response.data.data.content[response.data.data.content.length - 1]
              .feedId,
          );
        }
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse.data);
      }
    }
    setLoading(false);
  };
  const onEndReached = () => {
    if (!loading) {
      getData();
    }
  };

  const sendNewFeed = _.throttle(async () => {
    try {
      if (selectImg) {
        const response = await axios.post(
          `${Config.API_URL}/images/single`,
          uploadImage,
          {
            headers: {'Content-Type': 'multipart/form-data'},
            transformRequest: (data, headers) => {
              return data;
            },
          },
        );
        // console.log(response.data.data.files[0].fileUrl);
        const response2 = await axios.post(`${Config.API_URL}/feeds`, {
          content: feedContent,
          feedImageUrl: [response.data.data.files[0].fileUrl],
        });
        // console.log(response2.data.data);
        setFeedContent('');
        setSelectImg(false);
        setImgData({uri: '', type: ''});
        setUploadImage(undefined);
        setRefresh(!refresh);
      } else {
        const response = await axios.post(`${Config.API_URL}/feeds`, {
          content: feedContent,
          feedImageUrl: [],
        });
        // console.log(response.data.data);
        setFeedContent('');
        setSelectImg(false);
        setImgData({uri: '', type: ''});
        setUploadImage(undefined);
        setRefresh(!refresh);
      }
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  }, throttleTime);

  const pressEmoticon = async (feedId: number, emoticon: string) => {
    try {
      const response = await axios.put(
        `${Config.API_URL}/emoticons/feeds/${feedId}`,
        {emoticonType: emoticon},
      );
      // console.log(response.data.data);
      setRefresh(!refresh);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
      if (
        errorResponse?.data.statusCode == 4030 ||
        errorResponse?.data.statusCode == 4010
      ) {
        console.log('삭제된 글');
        dispatch(
          userSlice.actions.setDeleted({
            deleted: true,
          }),
        );
        setRefresh(!refresh);
      }
    }
  };

  const whoReact = _.throttle(async (feedId: number) => {
    try {
      const response = await axios.get(
        `${Config.API_URL}/emoticons/feeds/${feedId}`,
      );
      // console.log(response.data.data);
      setEmoticonList(response.data.data);
      setShowBottomSheet(true);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
      if (
        errorResponse?.data.statusCode == 4030 ||
        errorResponse?.data.statusCode == 4010
      ) {
        console.log('삭제된 글');
        dispatch(
          userSlice.actions.setDeleted({
            deleted: true,
          }),
        );
        setRefresh(!refresh);
      }
    }
  }, throttleTime);

  const flatRef = useRef();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
    // setRefresh(!refresh)
    // startRefresh()
    setRefresh(!refresh);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[{flex: 1, backgroundColor: '#202020'}]}
        behavior="padding"
        keyboardVerticalOffset={105}>
        <View
          style={{flex: 1, alignItems: 'center', backgroundColor: '#202020'}}>
          <View style={[styles.entire]}>
            {/* <Pressable
          onPress={async () => {
            console.log('pressed!');

            //알림확인
            // const response = await axios.post(
            //   `${Config.API_URL}/test/push/self`,
            //   {},
            // );
            // console.log(response.status);
          }}
          style={{
            height: 100,
            width: 500,
            backgroundColor: 'blue',
          }}
        /> */}
            <FlatList
              data={feedData}
              style={[styles.feedList]}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.4}
              ListHeaderComponent={
                <View>
                  <Text style={styles.noFeedTxt}>
                    지금 떠오르는 생각을 적어보세요!
                  </Text>
                </View>
              }
              ListHeaderComponentStyle={
                feedData.length === 0
                  ? [styles.noFeedView, {height: windowHeight - 200}]
                  : {height: 0, width: 0}
              }
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              // onStartReached={()=>{
              //   if (first) scroll(feedData.length - 1)
              //   else {
              //     onEndReached();
              //   }
              // }}
              // onStartReachedThreshold={0.4}
              keyboardShouldPersistTaps={'always'}
              inverted={true}
              ref={flatRef}
              ListFooterComponent={<View style={{height: 10}}></View>}
              // getItemLayout={(data, index) => ({
              //   length:100,
              //   offset:20000*index,
              //   index,
              // })}
              // onLayout={()=>scrollToEnd()}
              renderItem={({item}: itemProps) => {
                return (
                  <Pressable
                    style={styles.feed}
                    onPress={() =>
                      navigation.navigate('FeedDetail', {feedId: item.feedId})
                    }>
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
                      profileImg={item.profileImageUrl}
                      showWhoseModal={showWhoseModal}
                      setShowWhoseModal={setShowWhoseModal}
                    />
                  </Pressable>
                );
              }}
            />
          </View>
          <View style={[styles.newFeedAll, {width: windowWidth}]}>
            {selectImg && (
              <View style={[styles.newFeedImgView, {width: windowWidth}]}>
                <Pressable
                  onPress={() => {
                    setSelectImg(false);
                    setImgData({uri: '', type: ''});
                    setUploadImage(undefined);
                  }}>
                  <Image
                    source={{uri: imgData.uri}}
                    style={styles.newFeedImg}
                  />
                  <SvgXml
                    width={18}
                    height={18}
                    xml={svgXml.icon.imageX}
                    style={styles.xBtn}
                  />
                </Pressable>
              </View>
            )}
            <View style={styles.newFeedView}>
              <Pressable
                style={styles.addPhoto}
                onPress={() =>
                  ImagePicker.openPicker({
                    multiple: false,
                    mediaType: 'photo',
                    // cropping:true,
                  }).then(image => {
                    // console.log(image)
                    let name = image.path.split('/');
                    const imageFormData = new FormData();
                    let file = {
                      uri: image.path,
                      type: image.mime,
                      name: name[name.length - 1],
                    };
                    imageFormData.append('file', file);
                    // console.log(file)
                    setImgData({
                      uri: image.path,
                      type: image.mime,
                    });
                    setSelectImg(true);
                    imageFormData.append('type', 'feed');
                    setUploadImage(imageFormData);
                  })
                }>
                <SvgXml width={24} height={24} xml={svgXml.icon.addphoto} />
              </Pressable>
              <TextInput
                placeholder={placeholder}
                placeholderTextColor={'#848484'}
                style={[
                  styles.newFeedTxtInput,
                  {height: Math.min(80, Math.max(35, KBsize))},
                ]}
                onFocus={() => setPlaceholder('')}
                onBlur={() => setPlaceholder('지금 기분이 어때요?')}
                onChangeText={(text: string) => {
                  setFeedContent(text);
                }}
                blurOnSubmit={false}
                maxLength={500}
                value={feedContent}
                onSubmitEditing={sendNewFeed}
                multiline={true}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                onContentSizeChange={e => {
                  setKBsize(e.nativeEvent.contentSize.height);
                }}
              />
              <Pressable
                style={
                  feedContent.trim() == '' && !selectImg
                    ? styles.sendNewFeed
                    : styles.sendNewFeedActivated
                }
                disabled={feedContent.trim() == '' && !selectImg}
                onPress={sendNewFeed}>
                <Feather name="check" size={24} style={{color: 'white'}} />
              </Pressable>
            </View>
          </View>
          <Modal
            isVisible={showBottomSheet}
            onBackButtonPress={() => setShowBottomSheet(false)}
            backdropColor="#222222"
            backdropOpacity={0.5}
            onSwipeComplete={() => setShowBottomSheet(false)}
            swipeDirection={'down'}
            style={{justifyContent: 'flex-end', margin: 0}}>
            <Pressable
              style={styles.modalBGView}
              onPress={() => setShowBottomSheet(false)}>
              <Pressable
                style={styles.modalView}
                onPress={e => e.stopPropagation()}>
                <View style={styles.whoReacted}>
                  <SvgXml width={22} height={22} xml={svgXml.emoticon.heart} />
                  <Text style={styles.emoticonTxt}>
                    {EmoticonList.heartEmoticonNicknameList.join(' ') == ''
                      ? '-'
                      : EmoticonList.heartEmoticonNicknameList
                          .join(', ')
                          .replace(/ /g, '\u00A0')}
                  </Text>
                </View>
                <View style={styles.whoReacted}>
                  <SvgXml width={22} height={22} xml={svgXml.emoticon.smile} />
                  <Text style={styles.emoticonTxt}>
                    {EmoticonList.smileEmoticonNicknameList.join(' ') == ''
                      ? '-'
                      : EmoticonList.smileEmoticonNicknameList
                          .join(', ')
                          .replace(/ /g, '\u00A0')}
                  </Text>
                </View>
                <View style={styles.whoReacted}>
                  <SvgXml width={22} height={22} xml={svgXml.emoticon.sad} />
                  <Text style={styles.emoticonTxt}>
                    {EmoticonList.sadEmoticonNicknameList.join(' ') == ''
                      ? '-'
                      : EmoticonList.sadEmoticonNicknameList
                          .join(', ')
                          .replace(/ /g, '\u00A0')}
                  </Text>
                </View>
                <View style={styles.whoReacted}>
                  <SvgXml
                    width={22}
                    height={22}
                    xml={svgXml.emoticon.surprise}
                  />
                  <Text style={styles.emoticonTxt}>
                    {EmoticonList.surpriseEmoticonNicknameList.join(' ') == ''
                      ? '-'
                      : EmoticonList.surpriseEmoticonNicknameList
                          .join(', ')
                          .replace(/ /g, '\u00A0')}
                  </Text>
                </View>
              </Pressable>
            </Pressable>
          </Modal>
          {deleted && (
            <ToastScreen
              height={21}
              marginBottom={48}
              onClose={() => setDeleted()}
              message="삭제된 글이에요."
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  entire: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    // paddingTop:10,
    // paddingBottom:10,
    marginBottom: 48,
    flex: 1,
    backgroundColor: '#202020',
  },
  noFeedTxt: {
    color: '#848484',
    fontSize: 12,
    fontWeight: '500',
  },
  noFeedView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom:48,
  },
  feedList: {
    width: '100%',
    flex: 1,
  },
  feed: {
    width: '100%',
    marginBottom: 11,
    borderRadius: 10,
    backgroundColor: '#333333',
  },
  newFeedAll: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  newFeedImgView: {
    paddingVertical: 12,
    backgroundColor: 'rgba(34, 34, 34, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newFeedImg: {
    width: 76,
    height: 76,
  },
  xBtn: {
    position: 'absolute',
    right: -8,
    top: -8,
  },
  newFeedView: {
    flexDirection: 'row',
    backgroundColor: '#333333',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  addPhoto: {
    marginLeft: 12,
    marginRight: 8,
  },
  newFeedTxtInput: {
    color: '#222222',
    fontSize: 15,
    fontWeight: '400',
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginVertical: 6,
    marginRight: 4,
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 10,
    // maxHeight:'4vh'
  },
  sendNewFeed: {
    backgroundColor: '#B7B7B7',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: '100%',
  },
  sendNewFeedActivated: {
    backgroundColor: '#A55FFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: '100%',
  },
  modalBGView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    // elevation: 10,
  },
  whoReacted: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  emoticonTxtView: {
    flexShrink: 1,
  },
  emoticonTxt: {
    color: '#222222',
    fontWeight: '400',
    fontSize: 15,
    paddingLeft: 8,
    flex: 1,
  },
});
