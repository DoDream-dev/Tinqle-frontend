/* eslint-disable react-native/no-inline-styles */
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  RefreshControl,
  Keyboard,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {RootStackParamList} from '../../AppInner';
import Feed from '../components/Feed';
import axios, {AxiosError} from 'axios';
// @ts-ignore
import {Shadow} from 'react-native-shadow-2';
import {useFocusEffect} from '@react-navigation/native';
import Content from '../components/Content';
import Feather from 'react-native-vector-icons/Feather';
import Config from 'react-native-config';
import Modal from 'react-native-modal';
import {svgXml} from '../../assets/image/svgXml';
import {SvgXml} from 'react-native-svg';
import {throttleTime, throttleTimeEmoticon} from '../hooks/Throttle';
import _ from 'lodash';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import {Safe, StatusBarHeight} from '../components/Safe';
import ToastScreen from '../components/ToastScreen';
import {useHeaderHeight} from '@react-navigation/elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import CommentItem from '../components/CommentItem';
import LinearGradient from 'react-native-linear-gradient';

type FeedDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'FeedDetail'
>;

type itemProps = {
  item: {
    commentId: number;
    content: string;
    childCount: number;
    accountId: number;
    friendNickname: string;
    status: string;
    isAuthor: boolean;
    profileImageUrl: string | null;
    createdAt: string;
    childCommentCardList: [
      {
        parentId: number;
        commentId: number;
        content: string;
        accountId: number;
        friendNickname: string;
        status: string;
        profileImageUrl: string | null;
        isAuthor: boolean;
        createdAt: string;
        isReactEmoticon: boolean;
        emoticonCount: number;
      },
    ];
    isReactEmoticon: boolean;
    emoticonCount: number;
  };
  index: number;
};

export default function FeedDetail({navigation, route}: FeedDetailScreenProps) {
  const dispatch = useAppDispatch();

  const [refresh, setRefresh] = useState(false);
  const [feedData, setFeedData] = useState({
    accountId: -1,
    feedId: -1,
    status: '',
    friendNickname: '',
    content: '',
    feedImageUrls: [null],
    commentCount: 0,
    emoticons: {
      heartEmoticonCount: 0,
      isCheckedHeartEmoticon: false,
      smileEmoticonCount: 0,
      isCheckedSmileEmoticon: false,
      sadEmoticonCount: 0,
      isCheckedSadEmoticon: false,
      surpriseEmoticonCount: 0,
      isCheckedSurpriseEmoticon: false,
    },
    isKnock: false,
    isAuthor: false,
    createdAt: '',
    profileImageUrl: null,
  });
  const [cmtData, setCmtData] = useState([]);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [EmoticonList, setEmoticonList] = useState({
    heartEmoticonNicknameList: ['-'],
    smileEmoticonNicknameList: [''],
    sadEmoticonNicknameList: [''],
    surpriseEmoticonNicknameList: [''],
  });
  const [KBsize, setKBsize] = useState(0);
  const [cmtContent, setCmtContent] = useState('');
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState('댓글을 적어주세요.');
  const [cursorId, setCursorId] = useState(0);
  const [showWhoseModal, setShowWhoseModal] = useState(0);
  const [whichPopup, setWhichPopup] = useState('');
  const [uploadBtnLoading, setUploadBtnLoading] = useState(false);

  const [onFocus, setOnFocus] = useState(false);
  const [deleteModal, setDeleteModal] = useState(-1);
  const [showContextModal, setShowContextModal] = useState(-1);

  useFocusEffect(
    useCallback(() => {
      const getFeed = async () => {
        try {
          const response = await axios.get(
            `${Config.API_URL}/feeds/${route.params.feedId}`,
          );
          setFeedData(response.data.data);
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>)
            .response;
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
            navigation.navigate('FeedList');
          }
          if (errorResponse?.data.status == 500) {
            dispatch(
              userSlice.actions.setToken({
                accessToken: '',
              }),
            );
          }
        }
      };
      const getCmt = async () => {
        try {
          const response = await axios.get(
            `${Config.API_URL}/feeds/${route.params.feedId}/comments`,
          );
          setCmtData(response.data.data.content);
          // console.log(response.data.data)
          if (response.data.data.content.length == 0) {
            setCursorId(0);
          } else {
            setCursorId(
              response.data.data.content[response.data.data.content.length - 1]
                .commentId,
            );
          }
          setIsLast(response.data.data.last);
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>)
            .response;
          console.log(errorResponse.data);
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
      getCmt();
    }, [refresh, showWhoseModal]),
  );

  // useFocusEffect(
  //   useCallback(() => {
  //     const reloadStatus = () => {
  //       navigation.setOptions({
  //         headerRight: () => (
  //           <View style={{flexDirection: 'row'}}>
  //             {feedData.isAuthor && (
  //               <Pressable onPress={() => setDeleteModal(true)}>
  //                 <SvgXml width={24} height={24} xml={svgXml.icon.menu} />
  //               </Pressable>
  //             )}
  //           </View>
  //         ),
  //       });
  //     };
  //     if (feedData.isAuthor) reloadStatus();
  //   }, [refresh, feedData.isAuthor]),
  // );

  // Effect for make new feed
  useEffect(() => {
    if (uploadBtnLoading) {
      if (writeChildCmt === -1) {
        sendNewCmt();
      } else {
        sendNewChildCmt();
      }
    }
  }, [uploadBtnLoading]);

  // Remove keyboard when click outside of keyboard
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        handleKeyboardHide();
      },
    );
    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const handleKeyboardDismiss = () => {
      setWriteChildCmt(-1);
    };
    const KeyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      handleKeyboardDismiss,
    );
    if (feedData.isAuthor) {
      navigation.setOptions({
        headerStyle: {backgroundColor: '#202020'},
        // headerRight: () => (
        //   <Pressable onPress={() => setDeleteModal(true)}>
        //     <Feather name="more-vertical" size={24} color={'#888888'} />
        //   </Pressable>
        // ),
      });
    }
    return () => {
      KeyboardDidHideListener.remove();
    };
  }, []);

  const deleteFeed = _.throttle(async () => {
    try {
      if (feedData.feedImageUrls[0] != null) {
        const response = await axios.delete(
          `${Config.API_URL}/images/feed?fileUrls=${feedData.feedImageUrls[0]}`,
        );
        console.log('img del:', response.data.data);
      }
      const response = await axios.delete(
        `${Config.API_URL}/feeds/${feedData.feedId}`,
        {},
      );
      console.log(response.data.data);
      if (response.data.data.isDeleted) {
        navigation.goBack();
      }
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      if (
        errorResponse?.data.statusCode == 4030 ||
        errorResponse?.data.statusCode == 4010
      ) {
        console.log('already deleted');
        navigation.goBack();
      }
      if (errorResponse?.data.status == 500) {
        dispatch(
          userSlice.actions.setToken({
            accessToken: '',
          }),
        );
      }
      console.log(errorResponse.data);
    }
  }, throttleTime);

  const pressEmoticon = _.debounce(async (feedId: number, emoticon: string) => {
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
        navigation.navigate('FeedList');
      }
      if (errorResponse?.data.status == 500) {
        dispatch(
          userSlice.actions.setToken({
            accessToken: '',
          }),
        );
      }
    }
  }, throttleTimeEmoticon);

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
        navigation.navigate('FeedList');
      }
      if (errorResponse?.data.status == 500) {
        dispatch(
          userSlice.actions.setToken({
            accessToken: '',
          }),
        );
      }
    }
  }, throttleTime);

  const sendNewCmt = _.throttle(async () => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/feeds/${feedData.feedId}/comments/parent`,
        {content: cmtContent},
      );
      // console.log(response.data.data);
      setCmtContent('');
      setRefresh(!refresh);
      setIsLast(false);
      setKBsize(0);
      setUploadBtnLoading(false);
      // console.log(throttleTime)
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
        navigation.navigate('FeedList');
      }
      if (errorResponse?.data.status == 500) {
        dispatch(
          userSlice.actions.setToken({
            accessToken: '',
          }),
        );
      }
      setUploadBtnLoading(false);
    }
  }, throttleTime);

  const sendNewChildCmt = _.throttle(async () => {
    const replyId = cmtData[writeChildCmt].commentId;

    try {
      const response = await axios.post(
        `${Config.API_URL}/feeds/${feedData.feedId}/comments/${replyId}/children`,
        {content: cmtContent},
      );
      // console.log(response.data.data);
      setCmtContent('');
      setKBsize(0);
      setRefresh(!refresh);
      setIsLast(false);
      setWriteChildCmt(-1);
      setUploadBtnLoading(false);
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
        navigation.navigate('FeedList');
      }
      if (errorResponse?.data.status == 500) {
        dispatch(
          userSlice.actions.setToken({
            accessToken: '',
          }),
        );
      }
      setUploadBtnLoading(false);
    }
  }, throttleTime);

  const getData = async () => {
    setLoading(true);
    if (!isLast) {
      try {
        const response = await axios.get(
          `${Config.API_URL}/feeds/${route.params.feedId}/comments?cursorId=${cursorId}`,
        );
        setIsLast(response.data.data.last);
        setCmtData(cmtData.concat(response.data.data.content));
        if (response.data.data.content.length == 0) {
          setCursorId(0);
        } else {
          setCursorId(
            response.data.data.content[response.data.data.content.length - 1]
              .commentId,
          );
        }
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
          navigation.navigate('FeedList');
        }
        if (errorResponse?.data.status == 500) {
          dispatch(
            userSlice.actions.setToken({
              accessToken: '',
            }),
          );
        }
      }
    }
    setLoading(false);
  };

  const onEndReached = () => {
    if (!loading) {
      getData();
    }
  };

  const handleKeyboardHide = () => {
    inputRef.current.blur();
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // await RefreshDataFetch();
    setRefresh(!refresh);
    setRefreshing(false);
  };

  const inputRef = useRef();
  const [writeChildCmt, setWriteChildCmt] = useState(-1);

  useEffect(() => {
    if (writeChildCmt != -1) {
      setPlaceholder('대댓글을 적어주세요.');
      inputRef.current.focus();
    } else {
      setPlaceholder('댓글을 적어주세요.');
    }
  }, [writeChildCmt]);

  const flatListRef = useRef(null);

  return (
    <Pressable
      style={{flex: 1}}
      onTouchStart={() => {
        if (showContextModal != -1) {
          setTimeout(() => {
            setShowContextModal(-1);
          }, 100);
        }
        if (deleteModal != -1) {
          setTimeout(() => {
            setDeleteModal(-1);
          }, 100);
        }
      }}>
      <KeyboardAvoidingView
        style={{flex: 1, backgroundColor: '#202020'}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={StatusBarHeight + 44}>
        <View style={styles.entire}>
          <LinearGradient
            colors={['#202020', '#20202000']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={{
              height: 16,
              width: '100%',
              // backgroundColor: 'red',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 100,
            }}
          />
          <View
            style={{
              paddingHorizontal: 16,
              flex: 1,
              flexDirection: 'row',
              alignItems: 'flex-start',
              // marginBottom: Math.min(80, Math.max(50, KBsize)) + 10,
              marginBottom: Math.min(80, Math.max(50, KBsize)),
            }}>
            <View style={styles.commentView}>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                ref={flatListRef}
                data={cmtData}
                style={[styles.cmtList, {}]}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.4}
                ListHeaderComponent={
                  //   <View style={{backgroundColor:'#202020'}}>
                  //     <View style={styles.commentHeader}>
                  //       <SvgXml
                  //         width={16}
                  //         height={14}
                  //         xml={svgXml.icon.commentIcon}
                  //       />
                  //       <Text style={styles.commentHeaderTxt}>
                  //         댓글 {feedData.commentCount}개
                  //       </Text>
                  //     </View>
                  //   </View>
                  <View style={styles.feedView}>
                    <Feed
                      mine={feedData.isAuthor}
                      detail={true}
                      isKnock={feedData.isKnock}
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
                      profileImg={feedData.profileImageUrl}
                      showWhoseModal={showWhoseModal}
                      setShowWhoseModal={setShowWhoseModal}
                      setWhichPopup={setWhichPopup}
                      deleteFeedId={deleteModal}
                      setDeleteFeedId={setDeleteModal}
                      setRefresh={setRefresh}
                    />
                  </View>
                }
                // stickyHeaderIndices={[0]}
                ListFooterComponent={<View style={{height: 22}} />}
                renderItem={({item, index}: itemProps) => {
                  return (
                    <CommentItem
                      commentId={item.commentId}
                      content={item.content}
                      childCount={item.childCount}
                      accountId={item.accountId}
                      friendNickname={item.friendNickname}
                      status={item.status}
                      isAuthor={item.isAuthor}
                      profileImageUrl={item.profileImageUrl}
                      createdAt={item.createdAt}
                      childCommentCardList={item.childCommentCardList}
                      index={index}
                      showWhoseModal={showWhoseModal}
                      setShowWhoseModal={setShowWhoseModal}
                      setWhichPopup={setWhichPopup}
                      isReactEmoticon={item.isReactEmoticon}
                      emoticonCount={item.emoticonCount}
                      setRefresh={setRefresh}
                      writeChildCmt={writeChildCmt}
                      setWriteChildCmt={setWriteChildCmt}
                      cmtCount={cmtData.length}
                      showContextModal={showContextModal}
                      setShowContextModal={setShowContextModal}
                    />
                  );
                }}
              />
            </View>
          </View>

          {/* <View style={{height: Math.max(60, KBsize + 10)}} /> */}
          <View style={styles.newCmtView}>
            <View style={styles.newFeedTxtInputContain}>
              <TextInput
                onFocus={() => {
                  setOnFocus(true);
                  if (writeChildCmt === -1) {
                    return;
                  }

                  const delayedScroll = () => {
                    flatListRef.current.scrollToIndex({
                      index: writeChildCmt,
                      animated: true,
                    });
                  };

                  // Wait for 1 second (1000 milliseconds) and then execute the scroll
                  const timeoutId = setTimeout(delayedScroll, 100);

                  // Cleanup the timeout to avoid memory leaks
                  return () => clearTimeout(timeoutId);
                }}
                placeholder={placeholder}
                placeholderTextColor={'#848484'}
                style={[
                  styles.newCmtTxtInput,
                  {
                    height:
                      Platform.OS === 'android'
                        ? Math.min(80, Math.max(40, KBsize))
                        : undefined,
                  },
                ]}
                onBlur={() => {
                  setOnFocus(false);
                  setWriteChildCmt(-1);
                }}
                onChangeText={(text: string) => {
                  setCmtContent(text);
                }}
                blurOnSubmit={false}
                maxLength={200}
                value={cmtContent}
                onSubmitEditing={async () => {
                  setUploadBtnLoading(true);
                  Keyboard.dismiss();
                }}
                multiline={true}
                textAlignVertical="center"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                onContentSizeChange={e => {
                  setKBsize(e.nativeEvent.contentSize.height);
                }}
                ref={inputRef}
                // numberOfLines={4}
              />
            </View>
            <Pressable
              style={
                cmtContent.trim() == '' || uploadBtnLoading
                  ? styles.sendNewCmt
                  : styles.sendNewCmtActivated
              }
              disabled={uploadBtnLoading}
              onPress={async () => {
                if (cmtContent.trim() != '') {
                  setUploadBtnLoading(true);
                }
                Keyboard.dismiss();
              }}>
              {onFocus && cmtContent.trim() == '' ? (
                <Feather
                  name="chevron-down"
                  size={24}
                  style={{color: 'white'}}
                />
              ) : (
                <Feather name="check" size={24} style={{color: 'white'}} />
              )}
            </Pressable>
          </View>
          {/* <M visible={deleteModal == feedData.feedId} transparent={true}>
              <Safe>
                <Pressable onPress={() => setDeleteModal(-1)} style={{flex: 1}}>
                  <View style={styles.popup}>
                    <Shadow distance={10} startColor="#00000008">
                      <Pressable onPress={deleteFeed} style={styles.deleteFeed}>
                        <Text style={styles.deleteFeedTxt}>삭제하기</Text>
                      </Pressable>
                    </Shadow>
                  </View>
                </Pressable>
              </Safe>
            </M> */}

          <Modal
            isVisible={showBottomSheet}
            onBackButtonPress={() => setShowBottomSheet(false)}
            backdropColor="#101010"
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
          {whichPopup === 'deletedFriend' && (
            <ToastScreen
              height={21}
              marginBottom={48}
              onClose={() => setWhichPopup('')}
              message="친구를 삭제했어요."
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#202020',
    // paddingHorizontal:16,
    // paddingTop: 10,
    flexDirection: 'row',
  },
  feedView: {
    // marginHorizontal:16,
    // marginTop:10,
    // paddingHorizontal: 12,
    // width: '100%',
    marginTop: 10,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#333333',
    marginBottom: 10,
  },
  commentView: {
    width: '100%',
    flex: 1,
    // paddingTop: 12,
    // paddingVertical: 12,
    borderRadius: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    backgroundColor: 'red',
    alignItems: 'center',
    width: '100%',
    height: 36,
    // borderColor: '#202020',
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    paddingLeft: 15,
  },
  commentHeaderTxt: {
    marginLeft: 3,
    color: '#848484',
    fontSize: 12,
    fontWeight: '500',
  },
  cmtList: {
    // borderBottomWidth:1,
    // borderBottomColor:'#ECECEC',
    // backgroundColor:'red',
    // padding:10
    // height:200
  },
  childCmt: {
    paddingLeft: 40,
    backgroundColor: '#333333',
  },
  popup: {
    position: 'absolute',
    right: 55,
    top: Platform.OS === 'ios' ? 1 : 100,
    // borderRadius: 10,
    // borderColor: 'red',
    // backgroundColor: 'white',
  },
  deleteFeed: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020',
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 5,
  },
  deleteFeedTxt: {
    color: '#F0F0F0',
    fontWeight: '400',
    fontSize: 15,
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
    backgroundColor: '#333333',
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
    color: '#F0F0F0',
    fontWeight: '400',
    fontSize: 15,
    paddingLeft: 8,
    flex: 1,
  },
  newCmtView: {
    flexDirection: 'row',
    backgroundColor: '#202020',
    width: '100%',
    // height: 50,
    minHeight: 50,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 8,
  },
  newFeedTxtInputContain: {
    color: '#888888',
    fontSize: 15,
    fontWeight: '400',
    flex: 1,
    backgroundColor: '#333333',
    // backgroundColor: 'red',
    marginVertical: 6,
    marginRight: 4,
    borderRadius: 10,
    paddingVertical: Platform.OS === 'ios' ? 3 : 0,
    // minHeight: 0,
  },
  newCmtTxtInput: {
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '400',
    flex: 1,
    // backgroundColor: '#333333',
    // marginVertical: 6,
    // marginRight: 4,
    // borderRadius: 10,
    // paddingVertical: 3,
    paddingHorizontal: 10,
    maxHeight: 80,
  },
  sendNewCmt: {
    backgroundColor: '#888888',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: '100%',
  },
  sendNewCmtActivated: {
    backgroundColor: '#A55FFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: '100%',
  },
});
