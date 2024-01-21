/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  Pressable,
  View,
  Alert,
  StyleSheet,
  Text,
  Platform,
  Linking,
  PermissionsAndroid,
  AppState,
} from 'react-native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/image/svgXml';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import from url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap');
import {useFocusEffect} from '@react-navigation/native';
import FeedList from '../pages/FeedList';
import FeedDetail from '../pages/FeedDetail';
import Notis from '../pages/Notis';
import {checkNotifications} from 'react-native-permissions';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {useNavigation} from '@react-navigation/native';

export type FeedStackParamList = {
  FeedList: undefined;
  FeedDetail: undefined;
  Notis: undefined;
};

export type FeedStackNavigationProps =
  NativeStackNavigationProp<FeedStackParamList>;

const Stack = createNativeStackNavigator<FeedStackParamList>();

export default function FeedNavigation() {
  const appState = useRef(AppState.currentState);
  const navigation = useNavigation();

  const [isEnabled, setIsEnabled] = useState(true);
  const [backNoti, setBackNoti] = useState(true);

  const checkNotiPermission = async () => {
    const ret = await checkNotifications();
    console.log(ret);
    if (ret.status === 'granted') {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }

    try {
      const response = await axios.get(`${Config.API_URL}/accounts/me`);
      console.log('###', response.data.data);

      setBackNoti(response.data.data);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  const pushNotiChange = async () => {
    if (isEnabled) {
      Linking.openSettings();
    } else {
      if (Platform.OS === 'ios') {
        Linking.openSettings();
      } else {
        console.log('안드로이드');

        PermissionsAndroid.check('android.permission.POST_NOTIFICATIONS').then(
          async response => {
            // console.log('###', response);
            if (!response) {
              await PermissionsAndroid.request(
                'android.permission.POST_NOTIFICATIONS',
                {
                  title: '팅클 알림 설정',
                  message: '팅클에서 소식을 받으려면 알림을 허용해주세요.',
                  buttonNeutral: '다음에 설정',
                  buttonNegative: '취소',
                  buttonPositive: '확인',
                },
              ).then(response_2 => {
                console.log('###', response_2);
                if (response_2 === 'never_ask_again') {
                  // 다시 보지 않음 이면 설정으로 이동
                  Linking.openSettings();
                } else if (response_2 === 'granted') {
                  // 팝업에서 허용을 누르면
                  setIsEnabled(true);
                }
              });
            }
          },
        );
      }
    }
  };

  useEffect(() => {
    // Function to run when the component mounts
    const onMount = () => {
      console.log('Component mounted');
    };

    // Function to run when the app state changes
    const handleAppStateChange = nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App returned to the foreground on YourScreen');
        checkNotiPermission();
      }
      appState.current = nextAppState;
    };

    onMount();
    AppState.addEventListener('change', handleAppStateChange);
  }, []);

  useEffect(() => {
    checkNotiPermission();
  }, [isEnabled]);

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
            <Pressable
              onPress={() => {
                navigation.goBack();
                // setIsEnabled(!isEnabled);
              }}>
              <AntDesign name="arrowleft" size={24} color={'#848484'} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                pushNotiChange();
              }}
              style={[
                styles.toggleView,
                isEnabled
                  ? {backgroundColor: '#A55FFF'}
                  : {backgroundColor: '#B7B7B7'},
              ]}>
              {isEnabled ? (
                <>
                  <Text style={styles.toggleActiveTxt}>ON</Text>
                  <View style={styles.toggleActiveCircle}></View>
                </>
              ) : (
                <>
                  <View style={styles.toggleInactiveCircle}></View>
                  <Text style={styles.toggleInactiveTxt}>OFF</Text>
                </>
              )}
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

const styles = StyleSheet.create({
  toggleView: {
    width: 48,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 2,
    paddingVertical: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleActiveTxt: {
    color: '#FFFFFF',
    // backgroundColor: 'red',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
    marginRight: 4,
    top: Platform.OS === 'ios' ? 0 : -2,
  },
  toggleActiveCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  toggleInactiveTxt: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
    marginRight: 6,
    top: Platform.OS === 'ios' ? 0 : -2,
  },
  toggleInactiveCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    left: 3,
    backgroundColor: '#FFFFFF',
  },
});
