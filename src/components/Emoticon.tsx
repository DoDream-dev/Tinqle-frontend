import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, Pressable} from 'react-native';
import {svgXml} from '../../assets/image/svgXml';
import {SvgXml} from 'react-native-svg';
import AnimatedButton from './AnimatedButton';
type EmoticonProps = {
  emotion: string;
  count: number;
  mine: boolean;
  pressed: boolean;
  press: (feedId: number, emotion: string) => Promise<void>;
  feedId: number;
};
export default function Emoticon(props: EmoticonProps) {
  const [localPressed, setLocalPressed] = useState(false);
  const emotion = props.emotion;
  const count = props.count;
  const mine = props.mine;
  // const mine = false;
  const pressed = props.pressed;

  useEffect(() => {
    setLocalPressed(pressed);
  }, [pressed]);

  const btnPress = async () => {
    setLocalPressed(!localPressed);
    await props.press(props.feedId, emotion);
  };

  return (
    <AnimatedButton
      style={[
        styles.entire,
        mine
          ? {backgroundColor: '#333333'}
          : localPressed
          ? {backgroundColor: '#A55FFF'}
          : {backgroundColor: '#202020'},
        mine ? {paddingHorizontal: 4} : {paddingHorizontal: 4},
      ]}
      disabled={mine}
      onPress={() => {
        btnPress();
      }}>
      {emotion == 'heart' && (
        <SvgXml width={20} height={20} xml={svgXml.emoticon.heart} />
      )}
      {emotion == 'smile' && (
        <SvgXml width={20} height={20} xml={svgXml.emoticon.smile} />
      )}
      {emotion == 'sad' && (
        <SvgXml width={20} height={20} xml={svgXml.emoticon.sad} />
      )}
      {emotion == 'surprise' && (
        <SvgXml width={20} height={20} xml={svgXml.emoticon.surprise} />
      )}
      {mine && (
        <Text
          style={[
            styles.emoticonCnt,
            localPressed ? {color: '#F0F0F0'} : {color: '#848484'},
          ]}>
          {count}
        </Text>
      )}
    </AnimatedButton>
  );
}

const styles = StyleSheet.create({
  entire: {
    flexDirection: 'row',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 28,
    borderradius: 20,
    marginHorizontal: 3,
  },
  emoticonCnt: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
  },
});
