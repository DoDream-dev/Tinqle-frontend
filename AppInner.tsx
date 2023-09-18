import React, { useEffect, useState } from "react";
import { Alert } from 'react-native'
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import FeedList from "./src/pages/FeedList";
import FeedDetail from "./src/pages/FeedDetail";
import Profile from "./src/pages/Profile";
import SearchFriends from "./src/pages/SearchFriends";
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

type emotionDataType = {
  heart: string[],
  smile: string[],
  sad: string[],
  surprise: string[],
}
export type RootStackParamList = {
  FeedList: undefined;
  FeedDetail: {mine:boolean, emotionData:emotionDataType, commentCnt:number};
  Profile: undefined;
  SearchFriends: undefined;
  Setting: undefined;
  Notis: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppInner() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector((state:RootState) => !!state.user.accessToken);
  useEffect(() => {
    const getRefreshTokenAgain = async () => {
      try {
        // await EncryptedStorage.removeItem('refreshToken')
        const token = await EncryptedStorage.getItem('refreshToken');
        console.log(token)
        if (!token) {
          console.log('no RefreshToken')
          return;
        }
        const response = await axios.post(`${Config.API_URL}/auth/reissue`, {refreshToken:token},);
        console.log(response.data)
        dispatch(
          userSlice.actions.setToken({
            accessToken: response.data.data.accessToken,
          }),
        );
        await EncryptedStorage.setItem('refreshToken', response.data.data.refreshToken,);
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse.data.statusCode);
        if (errorResponse?.data.statusCode == 1070) {return Alert.alert('알림', '재로그인 하십시오');}
      }
    };
    getRefreshTokenAgain();
  }, [dispatch]);
  return isLoggedIn ? (
    <Stack.Navigator>
      <Stack.Screen
        name="FeedList"
        component={FeedList}
      />
      <Stack.Screen
        name="FeedDetail"
        component={FeedDetail}
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
      />
      <Stack.Screen
        name="SearchFriends"
        component={SearchFriends}
        options={{
          title:'친구 추가하기',
        }}
      />
      <Stack.Screen
        name="Setting"
        component={Setting}
      />
      <Stack.Screen
        name="Notis"
        component={Notis}
      />
    </Stack.Navigator>
  ) : (
    <SignIn/>
  );
}