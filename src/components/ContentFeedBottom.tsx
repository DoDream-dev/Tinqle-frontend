import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import Emoticons from "./Emoticons";

type ContentFeedBottomProps = {
  mine:boolean;
  detail:boolean;
  commentCnt:number,
  heartEmoticonNicknameList:string[];
  smileEmoticonNicknameList:string[];
  sadEmoticonNicknameList:string[];
  surpriseEmoticonNicknameList:string[];
}
export default function ContentFeedBottom(props:ContentFeedBottomProps){
  const mine = props.mine;
  const detail = props.detail;
  const commentCnt = props.commentCnt;
  const heartEmoticonNicknameList = props.heartEmoticonNicknameList;
  const heartEmoticonCount = heartEmoticonNicknameList.length;
  const smileEmoticonNicknameList = props.smileEmoticonNicknameList;
  const smileEmoticonCount = smileEmoticonNicknameList.length;
  const sadEmoticonNicknameList = props.sadEmoticonNicknameList;
  const sadEmoticonCount = sadEmoticonNicknameList.length;
  const surpriseEmoticonNicknameList = props.surpriseEmoticonNicknameList;
  const surpriseEmoticonCount = surpriseEmoticonNicknameList.length;
  
  const emotionData = {
    heart:{pressed:true, count:heartEmoticonCount}, // pressed: NicknameList에 자기가 있는지 확인
    smile:{pressed:false, count:smileEmoticonCount},
    sad:{pressed:false, count:sadEmoticonCount},
    surprise:{pressed:false, count:surpriseEmoticonCount}
  }
  return (
    <View style={detail ? styles.entireDetail : styles.entire}>
      {!detail && <View style={styles.feedListCommentView}>
        <Image source={require('../../assets/image/commentIcon.png')} />
        <Text style={styles.feedListCommentTxt}>{commentCnt}</Text>
      </View>}
      <View style={styles.emoticonView}>
        <Emoticons mine={mine} emotionData={emotionData} />
        {mine && <View style={styles.reactedPeopleBtn}><Image source={require('../../assets/image/reacted.png')} /></View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entire:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 32
  },
  entireDetail:{
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: 32,
    marginRight: 10
  },
  feedListCommentView:{
    flexDirection: 'row',
    marginLeft: 5
  },
  feedListCommentTxt:{
    color: '#848484',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2
  },
  emoticonView:{
    flexDirection: 'row',
  },
  reactedPeopleBtn:{
    backgroundColor: '#F7F7F7',
    height: 28,
    borderRadius: 20,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  }
})