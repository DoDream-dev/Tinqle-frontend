import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import MyProfile from '../pages/MyProfile';
// import MyFriendList from "./src/pages/MyFriendList";
import SearchFriends from '../pages/SearchFriends';
import FeedNavigation from '../navigations/FeedNavigation';
import NoteNavigation from '../navigations/NoteNavigation';
import {Safe} from '../components/Safe';

export type RootStackParamList = {
  FeedList: undefined;
  FeedDetail: {feedId: number};
  MyProfile: undefined;
  // MyFriendList: undefined;
  SearchFriends: undefined;
  NoteBox: undefined;
  // Setting: undefined;
  Notis: undefined;
  SignIn: undefined;
  EnlargeImage: {imageUrl: string};
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const screenoptions = () => {
  return {
    tabBarStyle: {
      height: 58,
      backgroundColor: '#202020',
      borderTopWidth: 0,
      elevation: 0,
    },
    tabBarHideOnKeyboard: true,
    tabBarActiveTintColor: '#A55FFF',
    tabBarInactiveTintColor: '#F0F0F0',
    tabBarLabelStyle: {fontSize: 11, paddingBottom: 10},
    tabBarShadowVisible: false,
  };
};

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="FeedNavigation"
      screenOptions={screenoptions}>
      <Tab.Screen
        name="FeedNavigation"
        component={FeedNavigation}
        options={{
          headerShown: false,
          tabBarLabel: 'Feed',
          // tabBarIcon:
        }}
      />
      <Tab.Screen
        name="SearchFriends"
        component={SearchFriends}
        options={{
          title: '친구',
          headerShown: true,
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
          tabBarLabel: 'Friend',
          // tabBarIcon:
        }}
      />
      <Tab.Screen
        name="NoteNavigation"
        component={NoteNavigation}
        options={{
          title: '1:1대화',
          headerShown: false,
          tabBarLabel: 'Note',
          // tabBarIcon:
        }}
      />
      <Tab.Screen
        name="MyProfile"
        component={MyProfile}
        options={{
          title: '프로필',
          headerShown: true,
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
          tabBarLabel: 'Profile',
          // tabBarIcon:
        }}
      />
    </Tab.Navigator>
  );
}
