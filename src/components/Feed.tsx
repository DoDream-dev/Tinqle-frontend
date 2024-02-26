/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import ContentFeedBottom from './ContentFeedBottom';
import Content from './Content';
import _ from 'lodash';
import Config from 'react-native-config';
import axios, {AxiosError} from 'axios';
import {throttleTime} from '../hooks/Throttle';
import userSlice from '../slices/user';
import {useNavigation} from '@react-navigation/native';
import {Shadow} from 'react-native-shadow-2';

type EmoticonsProps = {
  smileEmoticonCount: number;
  sadEmoticonCount: number;
  heartEmoticonCount: number;
  surpriseEmoticonCount: number;
  isCheckedSmileEmoticon: boolean;
  isCheckedSadEmoticon: boolean;
  isCheckedHeartEmoticon: boolean;
  isCheckedSurpriseEmoticon: boolean;
};
type FeedProps = {
  mine: boolean;
  detail: boolean;
  isKnock: boolean;
  commentCnt: number;
  createdAt: string;
  content: string;
  emoticons: EmoticonsProps;
  nickname: string;
  status: string;
  accountId: number;
  imageURL: string[] | null[];
  press: (feedId: number, emotion: string) => Promise<void>;
  feedId: number;
  whoReact: (feedId: number) => Promise<void>;
  profileImg: string | null;
  showWhoseModal: number;
  setShowWhoseModal: React.Dispatch<React.SetStateAction<number>>;
  setWhichPopup: React.Dispatch<React.SetStateAction<string>>;
  deleteFeedId: number;
  setDeleteFeedId: React.Dispatch<React.SetStateAction<number>>;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  // heartEmoticonNicknameList:string[];
  // smileEmoticonNicknameList:string[];
  // sadEmoticonNicknameList:string[];
  // surpriseEmoticonNicknameList:string[];
};
export default function Feed(props: FeedProps) {
  const mine = props.mine;
  const content = props.content;
  const detail = props.detail;
  const isKnock = props.isKnock;
  const commentCnt = props.commentCnt;
  const emoticons = props.emoticons;
  const createdAt = props.createdAt;
  const nickname = props.nickname;
  const status = props.status;
  const accountId = props.accountId;
  const imageURL = props.imageURL;
  const profileImg = props.profileImg;
  const showWhoseModal = props.showWhoseModal;
  const setShowWhoseModal = props.setShowWhoseModal;
  const setWhichPopup = props.setWhichPopup;

  const navigation = useNavigation();

  const deleteFeed = _.throttle(async () => {
    try {
      if (imageURL[0] != null) {
        const response = await axios.delete(
          `${Config.API_URL}/images/feed?fileUrls=${imageURL[0]}`,
        );
        console.log('img del:', response.data.data);
      }
      const response = await axios.delete(
        `${Config.API_URL}/feeds/${props.deleteFeedId}`,
        {},
      );
      // console.log(response.data.data);
      if (response.data.data.isDeleted) {
        if (detail) navigation.goBack();
        else {
          props.setRefresh(true);
          props.setRefresh(false);
        }
        // else rese
      }
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      if (
        errorResponse?.data.statusCode == 4030 ||
        errorResponse?.data.statusCode == 4010
      ) {
        console.log('already deleted');
        if (detail) navigation.goBack();
        else {
          props.setRefresh(true);
          props.setRefresh(false);
        }
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

  return (
    <View style={isKnock ? styles.entire_knock : styles.entire}>
      <Content
        nickname={nickname}
        status={status}
        content={content}
        createdAt={createdAt}
        accountId={accountId}
        mine={mine}
        imageURL={imageURL}
        profileImg={profileImg}
        showWhoseModal={showWhoseModal}
        setShowWhoseModal={setShowWhoseModal}
        setWhichPopup={setWhichPopup}
        feedId={props.feedId}
        deleteFeedId={props.deleteFeedId}
        setDeleteFeedId={props.setDeleteFeedId}
        isKnock={isKnock}
      />
      <ContentFeedBottom
        mine={mine}
        detail={detail}
        commentCnt={commentCnt}
        emoticons={emoticons}
        press={props.press}
        feedId={props.feedId}
        whoReact={props.whoReact}
      />
      {props.deleteFeedId === props.feedId ? (
        <Pressable
          style={{zIndex: 1, flex: 1, position: 'absolute', right: 25, top: 20}}
          onPress={e => {
            e.stopPropagation();
            deleteFeed();
          }}>
          <Shadow distance={2} startColor="rgba(0, 0, 0, 0.10)">
            <View style={[styles.modalView]}>
              <Text style={styles.modalText}>삭제하기</Text>
            </View>
          </Shadow>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    paddingBottom: 12,
    width: '100%',
    borderRadius: 10,
    // backgroundColor: '#202020',
  },
  entire_knock: {
    paddingBottom: 12,
    width: '100%',
    borderRadius: 10,
    // backgroundColor: '#202020',
    borderWidth: 1,
    borderColor: '#A55FFF',
  },
  modalView: {
    backgroundColor: '#202020',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 5,
    elevation: 1,
  },
  modalText: {
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '400',
  },
});

function dispatch(arg0: {payload: any; type: 'user/setToken'}) {
  throw new Error('Function not implemented.');
}
