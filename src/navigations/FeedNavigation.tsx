/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {Pressable, View, Alert} from 'react-native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/image/svgXml';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import from url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap');

import FeedList from '../pages/FeedList';
import FeedDetail from '../pages/FeedDetail';
import Notis from '../pages/Notis';

export type FeedStackParamList = {
  FeedList: undefined;
  FeedDetail: undefined;
  Notis: undefined;
};

export type FeedStackNavigationProps =
  NativeStackNavigationProp<FeedStackParamList>;

const Stack = createNativeStackNavigator<FeedStackParamList>();

export default function FeedNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FeedList"
        component={FeedList}
        options={({navigation}) => ({
          title: 'tincle',
          headerTitleAlign: 'center',
          // headerLeft: () => (
          //   <Pressable onPress={()=>navigation.navigate('SearchFriends')} style={{marginLeft:2}}>
          //     <SvgXml width={24} height={24} xml={svgXml.icon.addfriend}/>
          //   </Pressable>
          // ),
          headerStyle: {
            backgroundColor: '#202020',
          },
          headerTitleStyle: {
            color: '#A55FFF',
            fontWeight: 'bold',
            fontSize: 25,
          },
        })}
      />
      <Stack.Screen
        name="FeedDetail"
        component={FeedDetail}
        options={({navigation}) => ({
          title: '',
          headerRight: () => <View></View>,
          headerLeft: () => (
            <Pressable onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={24} color={'#848484'} />
            </Pressable>
          ),
          headerStyle: {
            backgroundColor: '#202020',
          },
        })}
      />
      <Stack.Screen
        name="Notis"
        component={Notis}
        options={({navigation}) => ({
          title: '알림',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: '#F0F0F0',
            fontSize: 15,
            fontWeight: '600',
          },
          headerShadowVisible: true,
          headerLeft: () => (
            <Pressable onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={24} color={'#848484'} />
            </Pressable>
          ),
          headerStyle: {
            backgroundColor: '#202020',
          },
        })}
      />
    </Stack.Navigator>
  );
}
