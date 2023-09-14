import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ContentFeedBottom from "./ContentFeedBottom";

type FeedProps = {
  mine:boolean;
  detail:boolean;
  commentCnt:number;
  heartEmoticonNicknameList:string[];
  smileEmoticonNicknameList:string[];
  sadEmoticonNicknameList:string[];
  surpriseEmoticonNicknameList:string[];
}
export default function Feed(props:FeedProps){
  const mine = props.mine;
  // const mine = false;
  const detail = props.detail;
  const commentCnt = props.commentCnt;
  const heartEmoticonNicknameList = props.heartEmoticonNicknameList;
  const smileEmoticonNicknameList = props.smileEmoticonNicknameList;
  const sadEmoticonNicknameList = props.sadEmoticonNicknameList;
  const surpriseEmoticonNicknameList = props.surpriseEmoticonNicknameList;

  return (
    <View style={styles.entrie}>
      <View style={{height: 200}}><Text>Content</Text></View>
      <ContentFeedBottom 
        mine={mine}
        detail={detail}
        commentCnt={commentCnt}
        heartEmoticonNicknameList={heartEmoticonNicknameList}
        smileEmoticonNicknameList={smileEmoticonNicknameList}
        sadEmoticonNicknameList={sadEmoticonNicknameList}
        surpriseEmoticonNicknameList={surpriseEmoticonNicknameList}
      />
    </View>
  );

}

const styles = StyleSheet.create({
  entrie:{
    paddingBottom: 10,
    width: '100%',
  },
})