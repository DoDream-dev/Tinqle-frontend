import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
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
  // const mine = false;
  const pressed = props.pressed;

  return (
    <View style={pressed ? styles.pressed : styles.entire}>
      {emotion == 'heart' && <Image style={styles.emoticon} source={require('../../assets/image/heartEmoticon.png')}/>}
      {emotion == 'smile' && <Image style={styles.emoticon} source={require('../../assets/image/smileEmoticon.png')}/>}
      {emotion == 'sad' && <Image style={styles.emoticon} source={require('../../assets/image/sadEmoticon.png')}/>}
      {emotion == 'surprise' && <Image style={styles.emoticon} source={require('../../assets/image/surpriseEmoticon.png')}/>}
      {mine && <Text style={styles.emoticonCnt}>{count}</Text>}
    </View>
  );

}

const styles = StyleSheet.create({
  entire:{
    flexDirection: 'row',
    backgroundColor: '#F7F7F7',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    height: 28,
    borderradius:20,
    marginHorizontal: 3
  },
  pressed:{
    flexDirection: 'row',
    backgroundColor: '#FFB443',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    height: 28,
    borderradius:20,
    marginHorizontal: 3
  },
  emoticon:{
    width: 20,
    height: 20,
  },
  emoticonCnt:{
    color: '#848484',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2
  }
})