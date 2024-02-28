/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Text,
  Linking,
  StyleSheet,
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
import MsgList from './src/pages/MsgList';
import MsgDetail from './src/pages/MsgDetail';
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
import {Pressable} from 'react-native';
import Modal from 'react-native-modal';
import VersionCheck from 'react-native-version-check';
import {check} from 'react-native-permissions';

export type RootStackParamList = {
  FeedList: undefined;
  FeedDetail: {feedId: number};
  MyProfile: undefined;
  // MyFriendList: undefined;
  SearchFriends: undefined;
  MsgList: undefined;
  MsgDetail: undefined;
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
  const [updateModal, setUpdateModal] = useState(false);

  useEffect(() => {
    SplashScreen.hide();

    checkVersion();
  }, []);

  useEffect(() => {
    console.log('refreshToken use!!');
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
  }, [dispatch, isLoggedIn]);

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

  const checkVersion = async () => {
    const currentVersion = await VersionCheck.getCurrentVersion();
    const os = Platform.OS;

    try {
      console.log('currentVersion', currentVersion);
      console.log('os', os);

      // const response = await axios.post(`${Config.API_URL}/app/version`);
      // if (response.data.data === false) {
      //   setUpdateModal(true);
      // }
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  return (
    <>
      {isLoggedIn ? (
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
                    // fill={props.focused ? '#A55FFF' : '#888888'}
                    width={28}
                    height={28}
                    xml={
                      props.focused
                        ? svgXml.bottomTab.feedColor
                        : svgXml.bottomTab.feed
                    }
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
                    // fill={props.focused ? '#A55FFF' : '#888888'}
                    width={28}
                    height={28}
                    xml={
                      props.focused
                        ? svgXml.bottomTab.friendColor
                        : svgXml.bottomTab.friend
                    }
                  />
                ),
              }}
            />
            <Tab.Screen
              name="NoteNavigation"
              component={NoteNavigation}
              options={{
                headerShown: false,
                tabBarLabel: 'Profile',
                tabBarIcon: (props: {
                  focused: boolean;
                  color: string;
                  size: number;
                }) => (
                  <SvgXml
                    color={'#A55FFF'}
                    width={28}
                    height={28}
                    xml={
                      props.focused
                        ? svgXml.bottomTab.talkColor
                        : svgXml.bottomTab.talk
                    }
                  />
                ),
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
                tabBarIcon: (props: {
                  focused: boolean;
                  color: string;
                  size: number;
                }) => (
                  <SvgXml
                    // fill={props.focused ? '#A55FFF' : '#888888'}
                    width={28}
                    height={28}
                    xml={
                      props.focused
                        ? svgXml.bottomTab.profileColor
                        : svgXml.bottomTab.profile
                    }
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
      )}
      <Modal
        isVisible={updateModal}
        animationIn="fadeIn"
        animationInTiming={600}
        onDismiss={() => {}}
        style={{margin: 0}}>
        <View style={styles.modalBGView2}>
          <View style={styles.modalView2}>
            <View style={styles.idModalHeader}>
              <Text style={styles.idModalHeaderTxt}>
                {'최신 버전으로 업데이트가 필요해요.'}
              </Text>
            </View>
            <View style={styles.idModalHeader}>
              <Text style={styles.idModalContentTxt}>
                {'더 나아진 팅클을 경험해 보세요!'}
              </Text>
            </View>
            <Pressable
              style={styles.idModalFooterBtnActive}
              onPress={() => {
                console.log('링크');
                if (Platform.OS === 'ios') {
                  Linking.openURL(
                    'https://apps.apple.com/kr/app/%ED%8C%85%ED%81%B4-tincle/id6476099936',
                  );
                } else {
                  Linking.openURL(
                    'https://play.google.com/store/apps/details?id=com.tinqle&pcampaignid=web_share',
                  );
                }
              }}>
              <Text style={styles.idModalFooterBtnTxt}>{'업데이트하기'}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalBGView2: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 36,
    backgroundColor: '#202020',
  },
  modalView2: {
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#333333',
    paddingTop: 30,
    paddingBottom: 24,
  },
  idModalHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  idModalHeaderTxt: {
    color: '#F0F0F0',
    fontWeight: '600',
    fontSize: 15,
  },
  idModalContentTxt: {
    color: '#F0F0F0',
    fontWeight: '400',
    fontSize: 15,
  },
  idModalFooterBtnActive: {
    marginTop: 8,
    backgroundColor: '#A55FFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 13,
  },
  idModalFooterBtnTxt: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F0F0F0',
  },
});
