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
  const isLogged = useSelector((state:RootState) => !!state.user.accessToken);
  const [isLoggedIn, setLoggedin] = useState(false); //로그인되었는지여부;
  console.log(isLoggedIn)
  useEffect(() => {
    const getRefreshTokenAgain = async () => {
      try {
        const token = await EncryptedStorage.getItem('refreshToken');
        if (!token) {
          return;
        }
        const response = await axios.post(`${Config.API_URL}/auth/reissue`, {refreshToken:token},);
        await EncryptedStorage.setItem('refreshToken', response.data.refreshToken,);
        dispatch(
          userSlice.actions.setUser({
            name: "가나다",
            accessToken: response.data.accessToken,
          }),
        );
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
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
    <SignIn setState={setLoggedin}/>
  );
}