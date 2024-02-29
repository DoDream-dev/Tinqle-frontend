/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {StyleSheet, Text, Pressable, View, Image} from 'react-native';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {svgXml} from '../../assets/image/svgXml';
import {SvgXml} from 'react-native-svg';

type StatucIconProps = {
  time: String;
  status: String;
};

export default function StatucIcon(props: StatucIconProps) {
  const {time, status} = props;

  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        height: 64,
      }}>
      <View
        style={{
          backgroundColor: '#202020',
          width: 54,
          height: 54,
          borderRadius: 27,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {status == 'work' && (
          <SvgXml width={36} height={36} xml={svgXml.status.work} />
        )}
        {status == 'study' && (
          <SvgXml width={36} height={36} xml={svgXml.status.study} />
        )}
        {status == 'transport' && (
          <SvgXml width={36} height={36} xml={svgXml.status.transport} />
        )}
        {status == 'eat' && (
          <SvgXml width={36} height={36} xml={svgXml.status.eat} />
        )}
        {status == 'workout' && (
          <SvgXml width={36} height={36} xml={svgXml.status.workout} />
        )}
        {status == 'walk' && (
          <SvgXml width={36} height={36} xml={svgXml.status.walk} />
        )}
        {status == 'sleep' && (
          <SvgXml width={36} height={36} xml={svgXml.status.sleep} />
        )}
        {status == 'smile' && (
          <SvgXml width={36} height={36} xml={svgXml.status.smile} />
        )}
        {status == 'happy' && (
          <SvgXml width={36} height={36} xml={svgXml.status.happy} />
        )}
        {status == 'sad' && (
          <SvgXml width={36} height={36} xml={svgXml.status.sad} />
        )}
        {status == 'mad' && (
          <SvgXml width={36} height={36} xml={svgXml.status.mad} />
        )}
        {status == 'panic' && (
          <SvgXml width={36} height={36} xml={svgXml.status.panic} />
        )}
        {status == 'exhausted' && (
          <SvgXml width={36} height={36} xml={svgXml.status.exhausted} />
        )}
        {status == 'excited' && (
          <SvgXml width={36} height={36} xml={svgXml.status.excited} />
        )}
        {status == 'sick' && (
          <SvgXml width={36} height={36} xml={svgXml.status.sick} />
        )}
        {status == 'vacation' && (
          <SvgXml width={36} height={36} xml={svgXml.status.vacation} />
        )}
        {status == 'date' && (
          <SvgXml width={36} height={36} xml={svgXml.status.date} />
        )}
        {status == 'computer' && (
          <SvgXml width={36} height={36} xml={svgXml.status.computer} />
        )}
        {status == 'cafe' && (
          <SvgXml width={36} height={36} xml={svgXml.status.cafe} />
        )}
        {status == 'movie' && (
          <SvgXml width={36} height={36} xml={svgXml.status.movie} />
        )}
        {status == 'read' && (
          <SvgXml width={36} height={36} xml={svgXml.status.read} />
        )}
        {status == 'alcohol' && (
          <SvgXml width={36} height={36} xml={svgXml.status.alcohol} />
        )}
        {status == 'music' && (
          <SvgXml width={36} height={36} xml={svgXml.status.music} />
        )}
        {status == 'birthday' && (
          <SvgXml width={36} height={36} xml={svgXml.status.birthday} />
        )}
      </View>
      {/* <View
        style={{
          backgroundColor: '#101010',
          width: 42,
          height: 17,
          borderRadius: 10,
          position: 'absolute',
          top: 47,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: '#A55FFF', fontSize: 11, fontWeight: '500'}}>
          {time}
        </Text>
      </View> */}
    </View>
  );
}
