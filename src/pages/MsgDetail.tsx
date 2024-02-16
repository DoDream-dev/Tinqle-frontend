import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Platform, Keyboard } from 'react-native';
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

type itemProps = {
  item:{
    isAuthor:boolean;
    content:string;
    createdAt:string;
  }
}

type MsgDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MsgDetail'
>;

export default function MsgDetail({navigation, route}:MsgDetailScreenProps) {
  const [placeholder, setPlaceholder] = useState('대화를 보내보세요.');
  const [msgContent, setMsgContent] = useState('');
  const [KBsize, setKBsize] = useState(0);
  const [onFocus, setOnFocus] = useState(false);
  const [uploadBtnLoading, setUploadBtnLoading] = useState(false);
  const inputRef = useRef();
  const flatListRef = useRef(null);

  useFocusEffect(
    useCallback(()=>{
      navigation.setOptions({
        header: props => (
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Pressable onPress={()=>navigation.goBack()}>
                <SvgXml width={24} height={24} xml={svgXml.icon.goBack} />
              </Pressable>
              <Pressable style={styles.headerProfileView}>
                <SvgXml width={32} height={32} xml={svgXml.profile.null} />
                <Text style={styles.headerProfileTxt}>김영서</Text>
                <SvgXml width={18} height={18} xml={svgXml.status.chicken} />
              </Pressable>
            </View>
            <Pressable><Text style={styles.headerRightTxt}>나가기</Text></Pressable>
          </View>
        ),
      });
    }, []),
  );

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

  const data=[
    {isAuthor:false, content:'넵', createdAt:'13:10'},
    {isAuthor:false, content:'아연님 디자인 좀 빨리 하시죠.', createdAt:'13:10'},
    {isAuthor:true, content:'제가 릴스를 보겠다는데 왜 방해합니까?', createdAt:'13:14'},
    {isAuthor:false, content:'제가 개발을 하겠다는데 왜 방해합니까? 승주님도 전력 질주중입니다', createdAt:'13:14'},
    {isAuthor:true, content:'미안합니다. 정신 차리겠습니다', createdAt:'13:15'},
    {isAuthor:false, content:'ㅋㅋㅋㅋㅋㅋㅋㅋㅋ알겠습니다', createdAt:'13:16'},

  ];
  return (
    <View style={styles.entire}>
      <FlatList 
        data={data}
        style={{width:'100%'}}
        ref={flatListRef}
        // onEndReached={}
        // onEndReachedThreshold={0.4}
        // refreshControl={}
        keyboardShouldPersistTaps={'always'}
        renderItem={({item}:itemProps) => {
          return (
            <View style={[styles.eachMsg, item.isAuthor ? {justifyContent:'flex-end'} : {justifyContent:'flex-start'}]}>
              {item.isAuthor && <Text style={styles.createdAt}>{item.createdAt}</Text>}
              <View style={item.isAuthor ? styles.msgMine : styles.msgNotMine}>
                <Text style={styles.msgTxt}>{item.content}</Text>
              </View>
              {!item.isAuthor && <Text style={styles.createdAt}>{item.createdAt}</Text>}
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