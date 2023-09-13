import React from "react";
import { StyleSheet, Text, View } from "react-native";
type EmoticonProps = {
  emotion:string;
  count:number;
  mine:boolean;
  pressed:boolean;
}
export default function Emoticon(props:EmoticonProps){
  const emotion = props.emotion;
  const count = props.count;
  const mine = props.mine;
  const pressed = props.pressed;

  return (
    <View style={styles.entire}>
      {emotion == 'heart' && <Text>heart, {count}</Text>}
      {emotion == 'smile' && <Text>smile, {count}</Text>}
      {emotion == 'sad' && <Text>sad, {count}</Text>}
      {emotion == 'surprise' && <Text>surprise, {count}</Text>}
    </View>
  );

}

const styles = StyleSheet.create({
  entire:{
    flex:1,
    backgroundColor: 'blue'
  },
})