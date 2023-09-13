import React, { useEffect, useState } from "react";
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
type emotionDataType = {
  heart: string[],
  smile: string[],
  sad: string[],
  surprise: string[],
}
export type RootStackParamList = {
  FeedList: undefined;
  FeedDetail: {mine:boolean, emotionData:emotionDataType};
  Profile: undefined;
  SearchFriends: undefined;
  Setting: undefined;
  Notis: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppInner() {
  const [isLoggedIn, setLoggedin] = useState(false); //로그인되었는지여부;
  // useEffect(() => {}, [isLoggedIn]);
  return isLoggedIn ? (
    <Stack.Navigator>
      <Stack.Screen
        name="FeedList"
        component={FeedList}
      />
      <Stack.Screen
        name="FeedDetail"
        component={FeedDetail}
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