import React from "react";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import Emoticons from "./Emoticons";
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
type ContentFeedBottomProps = {
  mine:boolean;
  detail:boolean;
  commentCnt:number;
  emoticons:EmoticonsProps;
  press:(feedId:number, emotion:string)=>Promise<void>;
  feedId:number;
  whoReact:(feedId:number)=>Promise<void>;
}
export default function ContentFeedBottom(props:ContentFeedBottomProps){
  const mine = props.mine;
  const detail = props.detail;
  const commentCnt = props.commentCnt;
  const emoticons = props.emoticons;
  
  const emotionData = {
    heart:{pressed:emoticons.isCheckedHeartEmoticon, count:emoticons.heartEmoticonCount},
    smile:{pressed:emoticons.isCheckedSmileEmoticon, count:emoticons.smileEmoticonCount},
    sad:{pressed:emoticons.isCheckedSadEmoticon, count:emoticons.sadEmoticonCount},
    surprise:{pressed:emoticons.isCheckedSurpriseEmoticon, count:emoticons.surpriseEmoticonCount}
  }
  return (
    <View style={detail ? styles.entireDetail : styles.entire}>
      {!detail && <View style={styles.feedListCommentView}>
        <Image source={require('../../assets/image/commentIcon.png')} />
        <Text style={styles.feedListCommentTxt}>{commentCnt}</Text>
      </View>}
      <View style={styles.emoticonView}>
        <Emoticons mine={mine} emotionData={emotionData} press={props.press} feedId={props.feedId}/>
        {mine && <Pressable style={styles.reactedPeopleBtn} onPress={()=>{props.whoReact(props.feedId)}}>
          <Image source={require('../../assets/image/reacted.png')} />
        </Pressable>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entire:{
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 44,
  },
  entireDetail:{
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: 32,
    marginRight: 10,
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