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
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import FeedList from '../pages/FeedList';
import FeedDetail from '../pages/FeedDetail';
import Notis from '../pages/Notis';
import EnlargeImage from '../pages/EnlargeImage';

export type FeedStackParamList = {
  FeedList: undefined;
  FeedDetail: undefined;
  Notis: undefined;
  EnlargeImage: undefined;
};

export type FeedStackNavigationProps =
  NativeStackNavigationProp<FeedStackParamList>;

const Stack = createNativeStackNavigator<FeedStackParamList>();

export default function FeedNavigation({navigation, route}) {
  //
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'EnlargeImage') {
      //MyPage이외의 화면에 대해 tabBar none을 설정한다.
      navigation.setOptions({
        tabBarStyle: {
          display: 'none',
          height: 48,
          backgroundColor: '#202020',
          borderTopWidth: 0,
          elevation: 0,
        },
      });
    } else {
      navigation.setOptions({
        tabBarStyle: {
          display: undefined,
          height: 48,
          backgroundColor: '#202020',
          borderTopWidth: 0,
          elevation: 0,
        },
      });
    }
  }, [navigation, route]);

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
        })}
      />
      <Stack.Screen
        name="Notis"
        component={Notis}
        options={({navigation}) => ({
          title: '알림',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: '#222222',
            fontSize: 15,
            fontWeight: '600',
          },
          headerShadowVisible: true,
          headerLeft: () => (
            <Pressable onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={24} color={'#848484'} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="EnlargeImage"
        component={EnlargeImage}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
