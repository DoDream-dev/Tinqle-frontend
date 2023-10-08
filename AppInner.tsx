import React, { useEffect, useState } from "react";
import { Pressable, View } from 'react-native'
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import FeedList from "./src/pages/FeedList";
import FeedDetail from "./src/pages/FeedDetail";
import Profile from "./src/pages/Profile";
import MyFriendList from "./src/pages/MyFriendList";
import SearchFriends from "./src/pages/SearchFriends";
import NoteBox from "./src/pages/NoteBox";
import Setting from "./src/pages/Setting";
import Notis from "./src/pages/Notis";
import SignIn from "./src/pages/SignIn";
import { useAppDispatch } from "./src/store";
import { RootState } from "./src/store/reducer";
import { useSelector } from "react-redux";
import EncryptedStorage from "react-native-encrypted-storage";
import axios, {AxiosError} from "axios";
import Config from "react-native-config";
import userSlice from "./src/slices/user";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import SplashScreen from "react-native-splash-screen";
import useAxiosInterceptor from './src/hooks/useAxiosInterceptor'

type emotionDataType = {
  heart: string[],
  smile: string[],
  sad: string[],
  surprise: string[],
}

export type RootStackParamList = {
  FeedList: undefined;
  FeedDetail: {feedId:number};
  Profile: {whose:number, accountId:number};
  MyFriendList: undefined;
  SearchFriends: undefined;
  NoteBox: undefined;
  Setting: undefined;
  Notis: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppInner() {
  useAxiosInterceptor();
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector((state:RootState) => !!state.user.accessToken);
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  useEffect(() => {
    const getRefreshTokenAgain = async () => {
      try {
        // await EncryptedStorage.removeItem('refreshToken')
        const token = await EncryptedStorage.getItem('refreshToken');
        if (!token) {
          console.log('no RefreshToken')
          return;
        }
        const response = await axios.post(`${Config.API_URL}/auth/reissue`, {refreshToken:token},);
        dispatch(
          userSlice.actions.setToken({
            accessToken: response.data.data.accessToken,
          }),
        );
        await EncryptedStorage.setItem('refreshToken', response.data.data.refreshToken,);
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        if (errorResponse?.data.statusCode == 1070) {console.log('reLogin');;}
      }
    };
    getRefreshTokenAgain();
  }, [dispatch]);
  return isLoggedIn ? (
    <Stack.Navigator>
      <Stack.Screen
        name="FeedList"
        component={FeedList}
        options={({navigation}) => ({
          title:'tinqle',
          headerTitleAlign:'center',
          headerLeft: () => (
            <Pressable onPress={()=>navigation.navigate('SearchFriends')}>
              <MaterialIcons name="person-add-alt" size={24} color={'#848484'} />
            </Pressable>
          ),
          headerRight: () => (
            <View style={{flexDirection:'row'}}>
              <Pressable style={{marginRight:12}}>
                <Feather name="bell" size={24} color={'#848484'} />
              </Pressable>
              <Pressable style={{marginRight:3}} onPress={()=>navigation.navigate('Profile', {whose:0, accountId:-1})}>
              <Feather name="smile" size={24} color={'#848484'} />
              </Pressable>
            </View>
          ),
          headerStyle:{

          },
          headerTitleStyle:{
            color: '#FFB443',
            fontWeight: 'bold',
            fontSize:25
          },
        })}
      />
      <Stack.Screen
        name="FeedDetail"
        component={FeedDetail}
        options={{
          title: '',
          headerRight: () => (<View></View>),
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={({navigation}) => ({
          title:'프로필',
          headerTitleAlign:'center',
          headerTitleStyle:{
            color:'#222222',
            fontSize:15,
            fontWeight:'600'
          },
          headerRight: () => (
            <Pressable onPress={()=>(navigation.navigate('Setting'))}>
              <Feather name="settings" size={24} color={'#848484'} />
            </Pressable>
          ),
          headerLeft: () => (
            <Pressable onPress={()=>(navigation.goBack())}>
              <AntDesign name="arrowleft" size={24} color={'#848484'} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="SearchFriends"
        component={SearchFriends}
        options={({navigation}) => ({
          title:'친구 추가하기',
          headerTitleAlign:'center',
          headerTitleStyle:{
            color:'#222222',
            fontSize:15,
            fontWeight:'600'
          },
          headerLeft: () => (
            <Pressable onPress={()=>(navigation.goBack())}>
              <AntDesign name="arrowleft" size={24} color={'#848484'} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen 
        name="MyFriendList"
        component={MyFriendList}
        options={({navigation}) => ({
          title:'친구 관리',
          headerTitleAlign:'center',
          headerTitleStyle:{
            color:'#222222',
            fontSize:15,
            fontWeight:'600'
          },
          headerLeft: () => (
            <Pressable onPress={()=>(navigation.goBack())}>
              <AntDesign name="arrowleft" size={24} color={'#848484'} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen 
        name="NoteBox"
        component={NoteBox}
        options={({navigation}) => ({
          title:'익명 쪽지함',
          headerTitleAlign:'center',
          headerTitleStyle:{
            color:'#222222',
            fontSize:15,
            fontWeight:'600'
          },
          headerLeft: () => (
            <Pressable onPress={()=>(navigation.goBack())}>
              <AntDesign name="arrowleft" size={24} color={'#848484'} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={({navigation}) => ({
          title:'',
          headerTitleAlign:'center',
          headerTitleStyle:{
            color:'#222222',
            fontSize:15,
            fontWeight:'600'
          },
          headerShadowVisible:false,
          headerLeft: () => (
            <Pressable onPress={()=>(navigation.goBack())}>
              <AntDesign name="arrowleft" size={24} color={'#848484'} />
            </Pressable>
          ),
        })}
      />
      {/* <Stack.Screen
        name="Content"
        component={Content}
      /> */}
      <Stack.Screen
        name="Notis"
        component={Notis}
      />
    </Stack.Navigator>
  ) : (
    <SignIn/>
  );
}