import React from 'react';
import {StyleSheet, Text, Pressable} from 'react-native';
import {svgXml} from '../../assets/image/svgXml';
import {SvgXml} from 'react-native-svg';
type EmoticonProps = {
  emotion: string;
  count: number;
  mine: boolean;
  pressed: boolean;
  press: (feedId: number, emotion: string) => Promise<void>;
  feedId: number;
};
export default function Emoticon(props: EmoticonProps) {
  const emotion = props.emotion;
  const count = props.count;
  const mine = props.mine;
  // const mine = false;
  const pressed = props.pressed;

  return (
    <Pressable
      style={[
        styles.entire,
        pressed ? {backgroundColor: '#A55FFF'} : {backgroundColor: '#202020'},
        mine ? {paddingHorizontal: 5} : {paddingHorizontal: 4},
      ]}
      onPress={() => {
        props.press(props.feedId, emotion);
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
            pressed ? {color: '#F0F0F0'} : {color: '#848484'},
          ]}>
          {count}
        </Text>
      )}
    </Pressable>
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
