import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ContentFeedBottom from "./ContentFeedBottom";
import Content from "./Content";

type EmoticonsProps = {
  smileEmoticonCount:number;
  sadEmoticonCount:number;
  heartEmoticonCount:number;
  surpriseEmoticonCount:number;
  isCheckedSmileEmoticon:boolean;
  isCheckedSadEmoticon:boolean;
  isCheckedHeartEmoticon:boolean;
  isCheckedSurpriseEmoticon:boolean;
}
type FeedProps = {
  mine:boolean;
  detail:boolean;
  commentCnt:number;
  createdAt:string;
  content:string;
  emoticons:EmoticonsProps;
  nickname:string;
  status:string;
  accountId:number;
  imageURL:string[]|null[];
  press:(feedId:number, emotion:string)=>Promise<void>;
  feedId:number;
  whoReact:(feedId:number)=>Promise<void>;
  // heartEmoticonNicknameList:string[];
  // smileEmoticonNicknameList:string[];
  // sadEmoticonNicknameList:string[];
  // surpriseEmoticonNicknameList:string[];
}
export default function Feed(props:FeedProps){
  const mine = props.mine;
  const content = props.content;
  const detail = props.detail;
  const commentCnt = props.commentCnt;
  const emoticons = props.emoticons;
  const createdAt = props.createdAt;
  const nickname = props.nickname;
  const status = props.status;
  const accountId = props.accountId;
  const imageURL = props.imageURL;
  const [a, setA] = useState(-1);

  return (
    <View style={styles.entire}>
      <Content 
        nickname={nickname}
        status={status}
        content={content}
        createdAt={createdAt}
        accountId={accountId}
        mine={mine}
        imageURL = {imageURL}
        detail={detail}
        cmt={false}
        child={setA}
        cmtId={-1}
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
    </View>
  );
}

const styles = StyleSheet.create({
  entire:{
    paddingBottom: 14,
    width: '100%',
  },
})