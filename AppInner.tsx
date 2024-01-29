/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import FeedList from './src/pages/FeedList';
import FeedDetail from './src/pages/FeedDetail';
import MyProfile from './src/pages/MyProfile';
// import MyFriendList from "./src/pages/MyFriendList";
import SearchFriends from './src/pages/SearchFriends';
import NoteBox from './src/pages/NoteBox';
// import Setting from "./src/pages/Setting";
import Notis from './src/pages/Notis';
import SignIn from './src/pages/SignIn';
import {useAppDispatch} from './src/store';
import {RootState} from './src/store/reducer';
import {useSelector} from 'react-redux';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import userSlice from './src/slices/user';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import SplashScreen from 'react-native-splash-screen';
import useAxiosInterceptor from './src/hooks/useAxiosInterceptor';
import {SvgXml} from 'react-native-svg';
import {svgXml} from './assets/image/svgXml';
import messaging from '@react-native-firebase/messaging';
import FeedNavigation from './src/navigations/FeedNavigation';
import NoteNavigation from './src/navigations/NoteNavigation';
import {Safe} from './src/components/Safe';

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
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const screenoptions = () => {
  return {
    tabBarStyle: {
      height: 48,
      backgroundColor: '#202020',
      borderTopWidth: 0,
      elevation: 0,
    },
    tabBarHideOnKeyboard: Platform.OS === 'ios' ? false : true,
    tabBarActiveTintColor: '#A55FFF',
    tabBarInactiveTintColor: '#F0F0F0',
    tabBarLabelStyle: {fontSize: 11, paddingBottom: 10},
    tabBarShadowVisible: false,
    tabBarShowLabel: false,
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

export default function AppInner() {
  useAxiosInterceptor();
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector(
    (state: RootState) => !!state.user.accessToken,
  );

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    const getRefreshTokenAgain = async () => {
      try {
        // await EncryptedStorage.removeItem('refreshToken')
        const token = await EncryptedStorage.getItem('refreshToken');
        if (!token) {
          console.log('no RefreshToken');
          return;
        }
        const response = await axios.post(`${Config.API_URL}/auth/reissue`, {
          refreshToken: token,
        });
        dispatch(
          userSlice.actions.setToken({
            accessToken: response.data.data.accessToken,
          }),
        );
        await EncryptedStorage.setItem(
          'refreshToken',
          response.data.data.refreshToken,
        );
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        if (errorResponse?.data.statusCode == 1070) {
          console.log('reLogin');
        }
        if (errorResponse?.data.status == 500) {
          dispatch(
            userSlice.actions.setToken({
              accessToken: '',
            }),
          );
        }
      }
    };
    getRefreshTokenAgain();
  }, [dispatch]);

  // useEffect(() => {
  //   // const unsubscribe = messaging().onMessage(async remoteMessage => {
  //   //   Alert.alert('alarm', JSON.stringify(remoteMessage));
  //   //   console.log('new messag arrived:', remoteMessage)
  //   //   dispatch(
  //   //     userSlice.actions.setNotis({
  //   //       notis:true,
  //   //     }),
  //   //   );
  //   // });
  //   // messaging().onNotificationOpenedApp(remoteMessage => {
  //   //   console.log('Noti caused app to open from gb state: ', remoteMessage.notification,);
  //   // // });
  //   // return unsubscribe;
  // }, []);

  return isLoggedIn ? (
    <Safe color="#202020">
      <Tab.Navigator
        initialRouteName="FeedNavigation"
        screenOptions={screenoptions}>
        <Tab.Screen
          name="FeedNavigation"
          component={FeedNavigation}
          options={{
            headerShown: false,
            tabBarLabel: 'Feed',
            tabBarIcon: (props: {
              focused: boolean;
              color: string;
              size: number;
            }) => (
              <SvgXml
                fill={props.focused ? '#A55FFF' : '#888888'}
                width={28}
                height={28}
                xml={svgXml.bottomTab.feed}
              />
            ),
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
            tabBarIcon: (props: {
              focused: boolean;
              color: string;
              size: number;
            }) => (
              <SvgXml
                fill={props.focused ? '#A55FFF' : '#888888'}
                width={28}
                height={28}
                xml={svgXml.bottomTab.friend}
              />
            ),
          }}
        />
        {/* <Tab.Screen
          name="NoteNavigation"
          component={NoteNavigation}
          options={{
            title: '1:1대화',
            headerShown: false,
            tabBarLabel: 'Note',
            // tabBarIcon:
          }}
        /> */}
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
            tabBarIcon: (props: {
              focused: boolean;
              color: string;
              size: number;
            }) => (
              <SvgXml
                fill={props.focused ? '#A55FFF' : '#888888'}
                width={28}
                height={28}
                xml={svgXml.bottomTab.profile}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </Safe>
  ) : (
    <Safe color="#202020">
      <Stack.Navigator>
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={() => ({
            headerShown: false,
          })}
        />
      </Stack.Navigator>
    </Safe>
  );
}
