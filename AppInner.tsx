import React, { useEffect, useState } from "react";
import { Pressable, View } from 'react-native'
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign' 
import Feather from 'react-native-vector-icons/Feather' 

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
              <Pressable style={{marginRight:3}}>
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
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
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
          headerRight: () => (
            <Pressable onPress={()=>(console.log('Press Setting'))}>
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