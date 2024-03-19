import React, {useEffect, useRef, useState} from 'react';
import {Pressable, View, Alert, Text, StyleSheet, AppState} from 'react-native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/image/svgXml';

import MsgList from '../pages/MsgList';
import MsgDetail from '../pages/MsgDetail';

export type NoteStackParamList = {
  MsgList: {roomId: number};
  MsgDetail: {roomId: number};
};

export type NoteStackNavigationProps =
  NativeStackNavigationProp<NoteStackParamList>;

const Stack = createNativeStackNavigator<NoteStackParamList>();

export default function NoteNavigation() {
  return (
    <Stack.Navigator initialRouteName="MsgList">
      <Stack.Screen
        name="MsgList"
        component={MsgList}
        options={({navigation}) => ({
          title: '대화',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: '#F0F0F0',
            fontSize: 15,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: '#202020',
          },
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name="MsgDetail"
        component={MsgDetail}
        options={({navigation}) => ({
          title: '김영서',
          headerTitleAlign: 'left',
          headerTitleStyle: {
            color: '#F0F0F0',
            fontSize: 15,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: '#202020',
          },
          headerShadowVisible: false,
        })}
      />
    </Stack.Navigator>
  );
}
