import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Emoticon from "./Emoticon";

type EmotionDataType = {
  pressed:boolean;
  count:number;
}
type EmoticonsProps = {
  mine:boolean;
  emotionData:{
    heart:EmotionDataType;
    smile:EmotionDataType;
    sad:EmotionDataType;
    surprise:EmotionDataType;
  };
  press:(feedId:number, emotion:string)=>Promise<void>;
  feedId:number;
}
export default function Emoticons(props:EmoticonsProps){
  const mine = props.mine;
  const emotionData = props.emotionData;
  return (
    <View style={styles.entire}>
      <Emoticon emotion="heart" mine={mine} count={emotionData.heart.count} pressed={emotionData.heart.pressed} press={props.press} feedId={props.feedId}/>
      <Emoticon emotion="smile" mine={mine} count={emotionData.smile.count} pressed={emotionData.smile.pressed} press={props.press} feedId={props.feedId}/>
      <Emoticon emotion="sad" mine={mine} count={emotionData.sad.count} pressed={emotionData.sad.pressed} press={props.press} feedId={props.feedId}/>
      <Emoticon emotion="surprise" mine={mine} count={emotionData.surprise.count} pressed={emotionData.surprise.pressed} press={props.press} feedId={props.feedId}/>
    </View>
  );

}

const styles = StyleSheet.create({
  entire:{
    flexDirection: 'row',
    marginRight: 5,
  },
})