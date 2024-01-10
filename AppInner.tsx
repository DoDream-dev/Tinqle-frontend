import React, {useEffect, useState} from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import SignIn from './src/pages/SignIn';
import {useAppDispatch} from './src/store';
import {RootState} from './src/store/reducer';
import {useSelector} from 'react-redux';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import userSlice from './src/slices/user';
import SplashScreen from 'react-native-splash-screen';
import useAxiosInterceptor from './src/hooks/useAxiosInterceptor';
import {Safe} from './src/components/Safe';
import EnlargeImage from './src/pages/EnlargeImage';
import TabNavigation from './src/navigations/TabNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const SignInScreen = () => {
  return (
    <Safe color="white">
      <SignIn />
    </Safe>
  );
};

type EnlargeImageProps = NativeStackScreenProps<
  RootStackParamList,
  'EnlargeImage'
>;

const EnlargeImageScreen = ({navigation, route}: EnlargeImageProps) => {
  return (
    <Safe color="#F7F7F7">
      <EnlargeImage navigation={navigation} route={route} />
    </Safe>
  );
};

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
  TabNavigation: undefined;
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

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

  useEffect(() => {
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   Alert.alert('alarm', JSON.stringify(remoteMessage));
    //   console.log('new messag arrived:', remoteMessage)
    //   dispatch(
    //     userSlice.actions.setNotis({
    //       notis:true,
    //     }),
    //   );
    // });
    // messaging().onNotificationOpenedApp(remoteMessage => {
    //   console.log('Noti caused app to open from gb state: ', remoteMessage.notification,);
    // // });
    // return unsubscribe;
  }, []);

  return isLoggedIn ? (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{height: '100%'}}>
        <Stack.Navigator>
          <Stack.Screen
            name="TabNavigation"
            component={TabNavigation}
            options={() => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="EnlargeImage"
            component={EnlargeImageScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={() => ({
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
}
