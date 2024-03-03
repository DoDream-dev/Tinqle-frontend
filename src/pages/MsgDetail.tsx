import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Platform, Keyboard, BackHandler, Image } from 'react-native';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import userSlice from '../slices/user';
import { useAppDispatch } from '../store';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppInner';
import { SvgXml } from 'react-native-svg';
import { svgXml } from '../../assets/image/svgXml';
import Feather from 'react-native-vector-icons/Feather';
import { NoteStackParamList } from '../navigations/NoteNavigation';
import SockJs from 'sockjs-client';
import * as StompJs from "@stomp/stompjs";
import TextEncodingPolyfill from 'text-encoding';

type itemProps = {
  item:{
    isAuthor:boolean;
    content:string;
    createdAt:string;
  }
}

type MsgDetailScreenProps = NativeStackScreenProps<
  NoteStackParamList,
  'MsgDetail'
>;

Object.assign('global', {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});

export default function MsgDetail({navigation, route}:MsgDetailScreenProps) {
  const dispatch = useAppDispatch();

  const [placeholder, setPlaceholder] = useState('대화를 보내보세요.');
  const [msgContent, setMsgContent] = useState('');
  const [KBsize, setKBsize] = useState(0);
  const [onFocus, setOnFocus] = useState(false);
  const [uploadBtnLoading, setUploadBtnLoading] = useState(false);

  const [yourName, setYourName] = useState('');
  const [yourStatus, setYourStatus] = useState('');
  const [yourAccountId, setYourAccountId] = useState(0);
  const [yourProfileImageUrl, setYourProfileImageUrl] = useState(null);

  const [isLast, setIsLast] = useState(false);
  const [cursorId, setCursorId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [msgData, setMsgData] = useState([]);

  const inputRef = useRef();
  const flatListRef = useRef(null);

  const sockJS = useRef();

  const statusSize = 18;
  const statusSizeTxt = 28;

  useFocusEffect(
    useCallback(()=>{
      const getOutRoom = async () => {
        try {
          const response = await axios.delete(`${Config.API_URL}/rooms/${route.params.roomId}`);
          console.log(response.data.data)
          navigation.goBack();
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>).response;
          console.log(errorResponse?.data);
          if (errorResponse?.data.status == 500) {
            dispatch(
              userSlice.actions.setToken({
                accessToken: '',
              }),
            );
          }
        }
      };

      getInfo();
      getMessage();

      navigation.setOptions({
        header: props => (
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Pressable onPress={()=>navigation.goBack()}>
                <SvgXml width={24} height={24} xml={svgXml.icon.goBack} />
              </Pressable>
              <Pressable style={styles.headerProfileView}>
                <Pressable style={styles.friendProfileImg}>
                  {yourProfileImageUrl == null ? (
                    <SvgXml width={32} height={32} xml={svgXml.profile.null} />
                  ) : (
                    <Image
                      source={{uri: yourProfileImageUrl}}
                      style={{width: 32, height: 32, borderRadius: 16}}
                    />
                  )}
                </Pressable>
                <Text style={styles.headerProfileTxt}>{yourName}</Text>
                {yourStatus == 'work'.toUpperCase() && (
                  <SvgXml width={statusSizeTxt} height={statusSize} xml={svgXml.status.workWide} />
                )}
                {yourStatus == 'study'.toUpperCase() && (
                  <SvgXml width={statusSizeTxt} height={statusSize} xml={svgXml.status.studyWide} />
                )}
                {yourStatus == 'transport'.toUpperCase() && (
                  <SvgXml width={statusSizeTxt} height={statusSize} xml={svgXml.status.transportWide} />
                )}
                {yourStatus == 'eat'.toUpperCase() && (
                  <SvgXml width={statusSizeTxt} height={statusSize} xml={svgXml.status.eatWide} />
                )}
                {yourStatus == 'workout'.toUpperCase() && (
                  <SvgXml
                    width={statusSizeTxt}
                    height={statusSize}
                    xml={svgXml.status.workoutWide}
                  />
                )}
                {yourStatus == 'walk'.toUpperCase() && (
                  <SvgXml width={statusSizeTxt} height={statusSize} xml={svgXml.status.walkWide} />
                )}
                {yourStatus == 'sleep'.toUpperCase() && (
                  <SvgXml width={statusSizeTxt} height={statusSize} xml={svgXml.status.sleepWide} />
                )}
                {yourStatus == 'smile'.toUpperCase() && (
                  <SvgXml width={statusSize} height={statusSize} xml={svgXml.status.smile} />
                )}
                {yourStatus == 'happy'.toUpperCase() && (
                  <SvgXml width={statusSize} height={statusSize} xml={svgXml.status.happy} />
                )}
                {yourStatus == 'sad'.toUpperCase() && (
                  <SvgXml width={statusSize} height={statusSize} xml={svgXml.status.sad} />
                )}
                {yourStatus == 'mad'.toUpperCase() && (
                  <SvgXml width={statusSize} height={statusSize} xml={svgXml.status.mad} />
                )}
                {yourStatus == 'panic'.toUpperCase() && (
                  <SvgXml width={statusSize} height={statusSize} xml={svgXml.status.panic} />
                )}
                {yourStatus == 'exhausted'.toUpperCase() && (
                  <SvgXml width={statusSize} height={statusSize} xml={svgXml.status.exhausted} />
                )}
                {yourStatus == 'excited'.toUpperCase() && (
                  <SvgXml width={statusSize} height={statusSize} xml={svgXml.status.excited} />
                )}
                {yourStatus == 'sick'.toUpperCase() && (
                  <SvgXml width={statusSize} height={statusSize} xml={svgXml.status.sick} />
                )}
                {yourStatus == 'vacation'.toUpperCase() && (
                  <SvgXml width={statusSize} height={statusSize} xml={svgXml.status.vacation} />
                )}
                {yourStatus == 'date'.toUpperCase() && (
                  <SvgXml width={statusSize} height={statusSize} xml={svgXml.status.date} />
                )}
                {yourStatus == 'computer'.toUpperCase() && (
                  <SvgXml width={statusSize} height={statusSize} xml={svgXml.status.computer} />
                )}
                {yourStatus == 'cafe'.toUpperCase() && (
                  <SvgXml width={statusSize} height={statusSize} xml={svgXml.status.cafe} />
                )}
                {yourStatus == 'movie'.toUpperCase() && (
                  <SvgXml width={statusSize} height={statusSize} xml={svgXml.status.movie} />
                )}
                {yourStatus == 'read'.toUpperCase() && (
                  <SvgXml width={statusSize} height={statusSize} xml={svgXml.status.read} />
                )}
                {yourStatus == 'alcohol'.toUpperCase() && (
                  <SvgXml width={statusSize} height={statusSize} xml={svgXml.status.alcohol} />
                )}
                {yourStatus == 'music'.toUpperCase() && (
                  <SvgXml width={statusSize} height={statusSize} xml={svgXml.status.music} />
                )}
                {yourStatus == 'birthday'.toUpperCase() && (
                  <SvgXml width={statusSize} height={statusSize} xml={svgXml.status.birthday} />
                )}
              </Pressable>
            </View>
            <Pressable onPress={()=>getOutRoom}><Text style={styles.headerRightTxt}>나가기</Text></Pressable>
          </View>
        ),
      });
    }, [yourName, yourAccountId, yourProfileImageUrl, yourStatus]),
  );
  
  const getInfo = async () => {
    try {
      const response = await axios.get(`${Config.API_URL}/rooms/${route.params.roomId}/info`);
      setYourName(response.data.data.nickname);
      setYourStatus(response.data.data.status);
      setYourProfileImageUrl(response.data.data.profileImageUrl);
      setYourAccountId(response.data.data.accountId);
      console.log(response.data.data)
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse?.data);
      if (errorResponse?.data.status == 500) {
        dispatch(
          userSlice.actions.setToken({
            accessToken: '',
          }),
        );
      }
    }
  };

  const getMessage = async () => {
    try {
      const response = await axios.get(`${Config.API_URL}/rooms/${route.params.roomId}`);
      setIsLast(response.data.data.last);
      setMsgData(response.data.data.content);
      if (response.data.data.content.length != 0) {
        setCursorId(
          response.data.data.content[response.data.data.content.length - 1].messageId
        );
      }
      console.log(response.data.data)
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse?.data);
      if (errorResponse?.data.status == 500) {
        dispatch(
          userSlice.actions.setToken({
            accessToken: '',
          }),
        );
      }
    }
  };

  const getData = async () => {
    if (!isLast) {
      setLoading(true);
      try {
        const response = await axios.get(
          `${Config.API_URL}/rooms/${route.params.roomId}?cursorId=${cursorId}`,
        );
        setIsLast(response.data.data.last);
        setMsgData(
          msgData.concat(response.data.data.content),
        );
        if (response.data.data.content.length != 0) {
          setCursorId(
            response.data.data.content[
              response.data.data.content.length - 1
            ].messageId,
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
  // const [refreshing, setRefreshing] = React.useState(false);

  // const onRefresh = () => {
  //   setRefreshing(true);
  //   setTimeout(() => {
  //     setRefreshing(false);
  //   }, 1000);
  //   setReset(!reset);
  //   setSearchCode('');
  // };


  // useFocusEffect(
  //   useCallback(() => {
  //     const unsubscribeBLUR = navigation.addListener('blur', () => {
  //       console.log('unfocused')
  //       clientData.deactivate();
  //     });

  //     const unsubscribeBACKPREESS = BackHandler.addEventListener('hardwareBackPress', () => {
  //       console.log('unfocused')
  //       navigation.goBack();
  //       clientData.reconnectDelay = 0;
  //       clientData.deactivate();
  //       return true;
  //     });

  //     console.log('roomDetail', route.params.roomId);
  //     // sockJS.current = new SockJs('wss://tincle.store/connection');
  //     let clientData = new StompJs.Client({
  //       brokerURL: 'wss://tincle.store/connection',
  //       connectHeaders: {},
  //       debug: function (str:string) {
  //         console.log(str);
  //       },
  //       reconnectDelay: 5000,
  //       heartbeatIncoming: 0,
  //       heartbeatOutgoing: 0,
  //     });

  //     clientData.onConnect = function () {
  //       clientData.subscribe(`ws/rooms/${route.params.roomId}/message`, onMessage);
  //     };

  //     clientData.activate();

  //     const onMessage = function (message: { body: string; }) {
  //       if (message.body) {
  //         let msg = JSON.parse(message.body);
  //         console.log(msg);
  //       }
  //     };
  //   }, [navigation]),
  // );


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

  const handleKeyboardHide = () => {
    inputRef.current.blur();
  };

  // const data=[
  //   {isAuthor:false, content:'넵', createdAt:'2024-02-27T13:10:00.065Z'},
  //   {isAuthor:false, content:'아연님 디자인 좀 빨리 하시죠.', createdAt:'2024-02-28T13:10:30.065Z'},
  //   {isAuthor:true, content:'제가 릴스를 보겠다는데 왜 방해합니까?', createdAt:'2024-02-28T13:14:30.065Z'},
  //   {isAuthor:false, content:'제가 개발을 하겠다는데 왜 방해합니까? 승주님도 전력 질주중입니다', createdAt:'2024-02-28T13:14:30.065Z'},
  //   {isAuthor:true, content:'미안합니다. 정신 차리겠습니다', createdAt:'2024-02-28T13:15:30.065Z'},
  //   {isAuthor:false, content:'ㅋㅋㅋㅋㅋㅋㅋㅋㅋ알겠습니다', createdAt:'2024-02-28T13:16:30.065Z'},
  // ];
  return (
    <View style={styles.entire}>
      <FlatList 
        data={msgData}
        style={{width:'100%'}}
        ref={flatListRef}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        // refreshControl={}
        keyboardShouldPersistTaps={'always'}
        renderItem={({item, index}:itemProps) => {
          function formatDateWithDay(inputDate:string) {
            const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
            const date = new Date(inputDate);
            // const year = date.getFullYear();
            const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1 해줌
            const day = date.getDate();
            // const hours = date.getHours();
            // const minutes = date.getMinutes();
            // const seconds = date.getSeconds();
            // const milliseconds = date.getMilliseconds();
            const dayOfWeek = daysOfWeek[date.getDay()]; // 요일을 가져옴
        
            return `${month}월 ${day}일 (${dayOfWeek})`;
        }
          return (
            <View>
              {index != 0 && msgData[index-1].createdAt.split('T')[0] != item.createdAt.split('T')[0] && <View style={styles.nextDayView}>
                <Text style={styles.nextDayTxt}>
                  {formatDateWithDay(item.createdAt)}
                </Text>
              </View>}
              {index == 0 && <View style={styles.nextDayView}>
                <Text style={styles.nextDayTxt}>
                  {formatDateWithDay(item.createdAt)}
                </Text>
              </View>}
              <View style={[styles.eachMsg, item.isAuthor ? {justifyContent:'flex-end'} : {justifyContent:'flex-start'}]}>
                {item.isAuthor && <Text style={styles.createdAt}>{item.createdAt.split('T')[1].split('.')[0].split(':')[0]+':'+item.createdAt.split('T')[1].split('.')[0].split(':')[1]}</Text>}
                <View style={item.isAuthor ? styles.msgMine : styles.msgNotMine}>
                  <Text style={styles.msgTxt}>{item.content}</Text>
                </View>
                {!item.isAuthor && <Text style={styles.createdAt}>{item.createdAt.split('T')[1].split('.')[0].split(':')[0]+':'+item.createdAt.split('T')[1].split('.')[0].split(':')[1]}</Text>}
              </View>
            </View>
          );
        }}
      />
      <View style={styles.newMsgView}>
        <View style={styles.newMsgInputContain}>
          <TextInput
            onFocus={() => {
              setOnFocus(true);

              const delayedScroll = () => {
                flatListRef.current.scrollToIndex({
                  index: data.length - 1,
                  animated: true,
                });
              };

              // Wait for 1 second (1000 milliseconds) and then execute the scroll
              const timeoutId = setTimeout(delayedScroll, 100);

              // Cleanup the timeout to avoid memory leaks
              return () => clearTimeout(timeoutId);
            }}
            placeholder={placeholder}
            placeholderTextColor={'#888888'}
            style={[
              styles.newMsgTxtInput,
              {
                height:
                  Platform.OS === 'android'
                    ? Math.min(80, Math.max(40, KBsize))
                    : undefined,
              },
            ]}
            onBlur={() => {
              setOnFocus(false);
            }}
            onChangeText={(text: string) => {
              setMsgContent(text);
            }}
            blurOnSubmit={false}
            maxLength={200}
            value={msgContent}
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
            msgContent.trim() == '' || uploadBtnLoading
              ? styles.sendNewMsg
              : styles.sendNewMsgActivated
          }
          disabled={uploadBtnLoading}
          onPress={async () => {
            if (msgContent.trim() != '') {
              setUploadBtnLoading(true);
            }
            Keyboard.dismiss();
          }}>
          {onFocus && msgContent.trim() == '' ? (
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
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    alignItems: 'center',
    paddingTop: 10,
    flex:1,
    backgroundColor:'#202020'
  },
  header:{
    backgroundColor:'#202020', 
    flexDirection:'row', 
    justifyContent:'space-between',
    alignItems:'center',
    paddingVertical:10,
    paddingHorizontal:16,
  },
  headerLeft:{
    flexDirection:'row',
    alignItems:'center'
  },
  headerRight:{},
  headerProfileView:{
    marginLeft:8,
    flexDirection:'row',
    alignItems:'center'
  },
  headerProfileTxt:{
    color:'#F0F0F0',
    fontWeight:'600',
    fontSize:15,
    marginLeft:8,
    marginRight:3
  },
  headerRightTxt:{
    color:'#888888',
    fontSize:13,
    fontWeight:'500',
  },
  eachMsg:{
    flexDirection:'row',
    alignItems:'center', 
    width:'100%',
    marginVertical:8,
    paddingHorizontal:16
  },
  msgMine:{
    backgroundColor:'#A55FFF',
    borderRadius:20,
    paddingVertical:10,
    paddingHorizontal:14,
    marginLeft:6,
    maxWidth:300,
  },
  msgNotMine:{
    backgroundColor:'#333333',
    borderRadius:20,
    paddingVertical:10,
    paddingHorizontal:14,
    marginRight:6,
    maxWidth:300,
  },
  msgTxt:{
    color:'#FFFFFF',
    fontSize:15,
    fontWeight:'400'
  },
  createdAt:{
    color:'#888888',
    fontSize:13,
    fontWeight:'500'
  },
  nextDayView:{
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
    marginVertical:12
  },
  nextDayTxt:{
    color:'#888888',
    fontSize:13,
    fontWeight:'500'
  },
  newMsgView: {
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
  newMsgInputContain: {
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
  newMsgTxtInput: {
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
  sendNewMsg: {
    backgroundColor: '#888888',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: '100%',
  },
  sendNewMsgActivated: {
    backgroundColor: '#A55FFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: '100%',
  },
});