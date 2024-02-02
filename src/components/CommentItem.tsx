/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  useWindowDimensions,
  FlatList,
  NativeTouchEvent
} from 'react-native';
import {svgXml} from '../../assets/image/svgXml';
import {SvgXml} from 'react-native-svg';
import Modal from 'react-native-modal';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import ContentProfile from './ContentProfile';
import { GestureResponderEvent } from 'react-native';

const windowWidth = Dimensions.get('screen').width;
type childCommentItemProps = {
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
}
type CommentItemProps = {
  commentId: number;
  content: string;
  childCount: number;
  accountId: number;
  friendNickname: string;
  status: string;
  isAuthor: boolean;
  profileImageUrl: string | null;
  createdAt: string;
  childCommentCardList: childCommentItemProps[] | null;
  index: number;
  showWhoseModal: number;
  setShowWhoseModal: React.Dispatch<React.SetStateAction<number>>;
  setWhichPopup: React.Dispatch<React.SetStateAction<string>>;
  isReactEmoticon: boolean;
  emoticonCount: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  writeChildCmt: number;
  setWriteChildCmt: React.Dispatch<React.SetStateAction<number>>;
  cmtCount: number | undefined;
  showContextModal: number;
  setShowContextModal: React.Dispatch<React.SetStateAction<number>>;
};

export default function CommentItem(props: CommentItemProps) {
  const commentId = props.commentId;
  const content = props.content;
  const childCount = props.childCount;
  const accountId = props.accountId;
  const friendNickname = props.friendNickname;
  const status = props.status;
  const isAuthor = props.isAuthor;
  const profileImageUrl = props.profileImageUrl;
  const createdAt = props.createdAt;
  const index = props.index;
  const childData = props.childCommentCardList;
  const showWhoseModal = props.showWhoseModal;
  const setShowWhoseModal = props.setShowWhoseModal;
  const setWhichPopup = props.setWhichPopup;
  const setRefresh = props.setRefresh;
  const writeChildCmt = props.writeChildCmt;
  const setWriteChildCmt = props.setWriteChildCmt;
  const showContextModal = props.showContextModal;
  const setShowContextModal = props.setShowContextModal;
  // const [showContextModal, setShowContextModal] = useState(false);
  // const [location, setLocation] = useState([0, 0]);
  // const setTouchLocation = (e:GestureResponderEvent) => {
  //   const x = e.nativeEvent.locationX;
  //   const y = e.nativeEvent.locationY;
  //   // if (x != location[0] && y != location[1]) {
  //   //   setShowContextModal(false);
  //   // }
  //   setLocation([x, y]);
  //   console.log('x', e.nativeEvent.locationX);
  //   console.log('y', e.nativeEvent.locationY);
  // }

  const reactComment = async () => {
    try {
      const response = await axios.put(
        `${Config.API_URL}/emoticons/comments/${commentId}`,
      );
      console.log(response.data)
      setRefresh(true);
      setRefresh(false);

    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  }

  const deleteComment = async () => {
    try {
      const response = await axios.delete(
        `${Config.API_URL}/feeds/comments/${commentId}`
      );
      console.log(response.data);
      setRefresh(true);
      setRefresh(false);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  }

  return (
    <Pressable
      // onPress={setTouchLocation}
      style={[
        (writeChildCmt == index && childData != null)
          ? {
              backgroundColor: '#A55FFF33',
            }
          : {
            backgroundColor:'#333333'
          }, 
        index == 0 && {
          borderTopLeftRadius:10,
          borderTopRightRadius:10,
        },
        index == props.cmtCount - 1 && 
        {
          borderBottomLeftRadius:10,
          borderBottomRightRadius:10,
        },
      ]}
      >
      <View style={{flexDirection:'row', padding:12}}>
        <View style={styles.profileView}>
          <ContentProfile 
            nickname={friendNickname}
            status={status}
            createdAt={createdAt}
            accountId={accountId}
            mine={isAuthor}
            profileImg={profileImageUrl}
            showWhoseModal={showWhoseModal}
            setShowWhoseModal={setShowWhoseModal}
            setWhichPopup={setWhichPopup}
            feedId={-1}
          />
        </View>
        <View style={styles.contentView}>
          <Text style={styles.contentText}>{content}</Text>
          {childData != null && accountId != null && <Pressable onPress={()=>setWriteChildCmt(index)}>
            <SvgXml width={24} height={24} xml={svgXml.icon.newCommentIcon} />
          </Pressable>}
        </View>
        {accountId != null && <View style={styles.btnView}>
          <Pressable 
            style={[styles.reactToComment, props.isReactEmoticon ? {backgroundColor:'#A55FFF'} : {backgroundColor:'#202020'}]}
            onPress={()=>reactComment()}
          >
            <SvgXml width={20} height={20} xml={svgXml.emoticon.heart} />
            {isAuthor && <Text style={[styles.reactTxt, props.isReactEmoticon ? {color:'#F0F0F0'} : {color:'#848484',}]}>{props.emoticonCount}</Text>}
          </Pressable>
          {isAuthor && <Pressable style={{marginLeft:4}} onPress={()=>setShowContextModal(commentId)}>
            <SvgXml width={24} height={24} xml={svgXml.icon.menu} />
          </Pressable>}
        </View>}
      </View>
      {childCount != 0 && (
        <View>
          <FlatList
            data={childData}
            // style={{borderTopWidth:1, borderTopColor:'#ECECEC',}}
            renderItem={({item, index}) => {
              return (
                <View style={[styles.childCmt, index == childData.length - 1 && {
                  borderBottomLeftRadius:10,
                  borderBottomRightRadius:10,
                }]}>
                  <CommentItem 
                    commentId={item.commentId}
                    content={item.content}
                    childCount={0}
                    accountId={item.accountId}
                    friendNickname={item.friendNickname}
                    status={item.status}
                    isAuthor={item.isAuthor}
                    profileImageUrl={item.profileImageUrl}
                    createdAt={item.createdAt}
                    childCommentCardList={null}
                    index={index}
                    showWhoseModal={showWhoseModal}
                    setShowWhoseModal={setShowWhoseModal}
                    setWhichPopup={setWhichPopup}
                    isReactEmoticon={item.isReactEmoticon}
                    emoticonCount={item.emoticonCount}
                    setRefresh={setRefresh}
                    writeChildCmt={writeChildCmt}
                    setWriteChildCmt={setWriteChildCmt}
                    cmtCount={childData?.length}
                    showContextModal={showContextModal}
                    setShowContextModal={setShowContextModal}
                  />
                </View>
              );
            }}
          />
        </View>
      )}
      {/* <Modal 
        isVisible={showContextModal}
        // visible={showContextModal}
        // transparent={true}
        hasBackdrop={true}
        backdropOpacity={0}
        onBackdropPress={() => setShowContextModal(false)}
        coverScreen={true}
        onBackButtonPress={() => setShowContextModal(false)}
        // onModalHide={() => {
        //   setWhichPopup('');
        // }}
        // style={{width:800}}
        >
      </Modal> */}
      {showContextModal == commentId && <Pressable 
        style={{zIndex:1,flex:1, position:'absolute', right:25, top:20}}
        onPress={(e) => {e.stopPropagation(); deleteComment();}}
      >
        <View style={[styles.modalView]}><Text style={styles.modalText}>삭제하기</Text></View>
      </Pressable>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    alignItems:'flex-start',
    justifyContent:'flex-start',
    paddingLeft:10
  },
  contentText:{
    color:'#F0F0F0',
    fontSize:15,
    fontWeight:'400',
  },
  btnView: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  reactToComment:{
    borderRadius:20,
    padding: 4,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  reactTxt:{
    fontSize:12,
    fontWeight:'500',
    paddingLeft:2,
    paddingRight:1
  },
  profileView:{
    flexShrink:1,
  },
  childCmt: {
    paddingLeft: 40,
    backgroundColor:'#333333'
  },
  modalView:{
    backgroundColor:'#202020',
    paddingHorizontal:12,
    paddingVertical:9,
    borderRadius:5,
  },
  modalText:{
    color:'#F0F0F0',
    fontSize:15,
    fontWeight:'400'
  }
});
