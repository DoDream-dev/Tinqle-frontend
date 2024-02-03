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
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import {useNavigation} from '@react-navigation/native';
import {svgXml} from '../../assets/image/svgXml';
import {SvgXml} from 'react-native-svg';
import FriendProfileModal from './FriendProfileModal';
import ImageModal from 'react-native-image-modal';
import ToastScreen from './ToastScreen';
import Modal from 'react-native-modal';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import ContentProfile from './ContentProfile';

const windowWidth = Dimensions.get('screen').width;
type ContentProps = {
  nickname: string;
  status: string;
  content: string;
  createdAt: string;
  accountId: number;
  mine: boolean;
  imageURL: string[] | null[];
  profileImg: string | null;
  showWhoseModal: number;
  setShowWhoseModal: React.Dispatch<React.SetStateAction<number>>;
  // index: number;
  setWhichPopup: React.Dispatch<React.SetStateAction<string>>;
  feedId: number;
  deleteFeedId: number;
  setDeleteFeedId: React.Dispatch<React.SetStateAction<number>>;
};

export default function Content(props: ContentProps) {
  const nickname = props.nickname;
  const status = props.status;
  const content = props.content;
  const createdAt = props.createdAt;
  const accountId = props.accountId;
  const imageURL = props.imageURL;
  // const index = props.index;
  const profileImg = props.profileImg;
  const showWhoseModal = props.showWhoseModal;
  const setShowWhoseModal = props.setShowWhoseModal;
  const setWhichPopup = props.setWhichPopup;

  return (
    <View style={styles.entire}>
      <ContentProfile 
        nickname={nickname}
        status={status}
        createdAt={createdAt}
        accountId={accountId}
        mine={props.mine}
        profileImg={profileImg}
        showWhoseModal={showWhoseModal}
        setShowWhoseModal={setShowWhoseModal}
        setWhichPopup={setWhichPopup}
        feedId={props.feedId}
        deleteFeedId={props.deleteFeedId}
        setDeleteFeedId={props.setDeleteFeedId}
      />

      {content != '' && (
        <View style={styles.content}>
          <Text style={styles.contentTxt}>{content}</Text>
        </View>
      )}

      {/* {imageURL.flatMap(f => !!f ? [f] : []).length != 0 && <SliderBox 
            images={imageURL}
            sliderBoxHeight={283}
            parentWidth={283}
          />} */}

      {imageURL.flatMap(f => (!!f ? [f] : [])).length != 0 && (
        <View style={styles.imageContent}>
          <ImageModal
            swipeToDismiss={true}
            modalImageResizeMode="contain"
            // resizeMode="contain"
            resizeMode="cover"
            imageBackgroundColor="transparent"
            overlayBackgroundColor="rgba(32, 32, 32, 0.9)"
            style={{
              width: windowWidth - 56,
              height: windowWidth - 56,
            }}
            source={{
              uri: imageURL[0] ?? undefined,
            }}
          />
        </View>
      )}

      {/* {cmt && (
        <Pressable
          style={styles.recomment}
          onPress={() => {
            child(index);
          }}>
          <Text style={styles.recommentTxt}>대댓글 쓰기</Text>
        </Pressable>
      )} */}

      {/* <View style={{bottom:0, alignItems:'center', backgroundColor:'red', width:'100%', position:'absolute', height:100}}>
        {whichPopup === 'deleted' && (
          <ToastScreen
            height={21}
            marginBottom={48}
            onClose={() => setWhichPopup('')}
            message="친구를 삭제했어요."
          />
        )}
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    padding: 16,
  },
  profileSection: {
    flexDirection: 'row',
    // backgroundColor:'blue'
  },
  entireCmt: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    // backgroundColor:'pink'
  },
  statusView: {},
  contentView: {
    flex: 1,
    paddingLeft: 8,
    // backgroundColor:'red'
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  txtNickname: {
    // backgroundColor: 'blue',
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F0F0F0',
    marginRight: 3,
  },
  createdAt: {
    marginTop: 0,
    fontWeight: '500',
    fontSize: 12,
    color: '#848484',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignContent: 'center',
    marginTop: 10,
    // backgroundColor: 'blue',
  },
  imageContent: {
    marginTop: 10,
    flexDirection: 'row',
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flex: 1,
    height: windowWidth - 56,
  },
  contentTxt: {
    fontWeight: '400',
    fontSize: 15,
    color: '#F0F0F0',
    // includeFontPadding:true
    // paddingBottom:5
  },
  recomment: {
    marginTop: 8,
    // marginBottom:8
  },
  recommentTxt: {
    color: '#848484',
    fontSize: 12,
    fontWeight: '500',
  },
  modalView: {
    backgroundColor: '#333333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  modalTitleTxt: {
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalContentTxt: {
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 10,
    marginTop: 10,
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 13,
    backgroundColor: '#A55FFF',
  },
  btnGray: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 13,
    backgroundColor: '#888888',
  },
  btnTxt: {
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '600',
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
    marginTop: 16,
  },
});
