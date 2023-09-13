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
}
export default function Emoticons(props:EmoticonsProps){
  const mine = props.mine;
  const emotionData = props.emotionData;
  return (
    <View style={styles.entire}>
      <Emoticon emotion="heart" mine={mine} count={emotionData.heart.count} pressed={emotionData.heart.pressed} />
      <Emoticon emotion="smile" mine={mine} count={emotionData.smile.count} pressed={emotionData.smile.pressed} />
      <Emoticon emotion="sad" mine={mine} count={emotionData.sad.count} pressed={emotionData.sad.pressed} />
      <Emoticon emotion="surprise" mine={mine} count={emotionData.surprise.count} pressed={emotionData.surprise.pressed} />
    </View>
  );

}

const styles = StyleSheet.create({
  entire:{
    flex:1,
    backgroundColor:'yellow'
  },
})