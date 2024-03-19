/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppInner from './AppInner';
import {fcmService} from './src/push_fcm';
import {localNotificationService} from './src/push_noti';
import {Provider} from 'react-redux/es/exports';
import store from './src/store';
import {Platform, Linking, StyleSheet, Image, Text, View} from 'react-native';
import PushNotification from 'react-native-push-notification';
import icon from './icon.png';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import AnimatedButton from './src/components/AnimatedButton';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import {StatusBarHeight} from './src/components/Safe';

export type NotificationProps = {
  title: string;
  message: string;
};

export default function App() {
  const navigation = useNavigation();
  const netInfo = useNetInfo();

  const [isNotification, setIsNotification] = useState(false);
  const [notiData, setNotiData] = useState({});
  const [network, setNetwork] = useState(true);

  //notification
  const NotificationComponent: React.FC<NotificationProps> = ({
    title,
    message,
  }) => {
    const translateY = useSharedValue(-100);
    const opacity = useSharedValue(0);

    useEffect(() => {
      if (isNotification) {
        translateY.value = withSpring(0, {mass: 0.1});
        opacity.value = withTiming(1, {
          duration: 500,
          easing: Easing.out(Easing.exp),
        });

        const timeout = setTimeout(() => {
          translateY.value = withSpring(-50);
          opacity.value = withTiming(
            0,
            {duration: 100, easing: Easing.in(Easing.exp)},
            () => {
              runOnJS(setIsNotification)(false);
            },
          );
        }, 3000);

        return () => clearTimeout(timeout);
      }
    }, [isNotification]);

    const animatedStyle = useAnimatedStyle(() => {
      'worklet';
      return {
        transform: [{translateY: translateY.value}],
        opacity: opacity.value,
      };
    });

    const noticeNavigation = async () => {
      const type = notiData.type;
      const redirectTargetId = notiData.redirectTargetId;
      const notificationId = notiData.notificationId;

      // console.log('type : ', type);
      // console.log('redirectTargetId : ', redirectTargetId);

      if (type.includes('FEED')) {
        navigation.navigate('FeedDetail', {feedId: redirectTargetId});
      } else if (type == 'APPROVE_FRIENDSHIP_REQUEST') {
        navigation.navigate('Notis');
      } else if (type == 'CREATE_FRIENDSHIP_REQUEST') {
        navigation.navigate('Notis');
      } else if (type == 'SEND_KNOCK') {
        navigation.navigate('FeedList', {isKnock: true});
      } else if (type == 'REACT_EMOTICON_ON_COMMENT') {
        navigation.navigate('FeedDetail', {feedId: redirectTargetId});
      } else if (type == 'CREATE_KNOCK_FEED') {
        navigation.navigate('FeedDetail', {feedId: redirectTargetId});
      } else if (type == 'CREATE_MESSAGE') {
        navigation.navigate('NoteNavigation', {
          screen: 'MsgDetail',
          params: {roomId: redirectTargetId},
        });
      }

      try {
        await axios.put(
          `${Config.API_URL}/notifications/${notificationId}/click`,
        );
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse.data);
      }
    };

    return isNotification ? (
      <Animated.View style={[styles.container, animatedStyle]}>
        <AnimatedButton
          style={styles.buttonArea}
          onPress={() => {
            noticeNavigation();
            setIsNotification(false);
            // navigation.navigate('Notis');
          }}>
          <Image source={icon} style={styles.icon} />
          <View style={styles.textContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.now}>now</Text>
            </View>
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.message}>
              {message}
            </Text>
          </View>
        </AnimatedButton>
      </Animated.View>
    ) : null;
  };

  //notification
  const NetworkComponent = () => {
    const translateY = useSharedValue(-10);
    const opacity = useSharedValue(0);

    useEffect(() => {
      if (!network) {
        translateY.value = withSpring(0, {mass: 0.1});
        opacity.value = withTiming(1, {
          duration: 500,
          easing: Easing.out(Easing.exp),
        });
      }
    }, [network]);

    const animatedStyle = useAnimatedStyle(() => {
      'worklet';
      return {
        transform: [{translateY: translateY.value}],
        opacity: opacity.value,
      };
    });

    return !network ? (
      <Animated.View style={[styles.networkAlert, animatedStyle]}>
        <Text style={styles.networkText}>네트워크 연결이 불안정합니다.</Text>
      </Animated.View>
    ) : null;
  };

  const onNotification = (notify: any) => {
    console.log('[onNotification] notify 알림 왔을 때 :', notify);
    const options = {
      soundName: 'default',
      playSound: true,
    };

    if (Platform.OS === 'android' && notify) {
      console.log('1. [onNotification] notify.body :', notify);
      // console.log('1. [onNotification] notify.body :', notify.body);
      localNotificationService.showNotification(
        0,
        notify.title,
        notify.body,
        notify,
        options,
      );
    }
  };

  const showNotiInApp = async (notify: {
    body: String;
    message: String;
    title: String;
    link: String;
    type: String;
    redirectTargetId: String;
    notificationId: String;
  }) => {
    // console.log('notify : ', notify);
    const pushNot_type = await AsyncStorage.getItem('pushNot_type');
    // console.log('@@@@@@@@@ type : ', pushNot_type);
    if (pushNot_type) {
      setIsNotification(false);
      return;
    } else {
      const body = notify.body;
      const data = {
        body: body.trim(),
        title: notify.title,
        type: notify.type,
        redirectTargetId: notify.redirectTargetId,
        notificationId: notify.notificationId,
      };
      setNotiData(data);
      setIsNotification(true);
    }
  };

  const onOpenNotification = (notify: any) => {
    //앱 켜진 상태에서 알림 받았을 때 하는 일
    console.log('앱 켜졌을 때 알림 도착:', notify);

    // TODO: 리덕스 업데이트

    if (Platform.OS === 'ios') {
      // in app push in ios
      showNotiInApp(notify);
    } else if (Platform.OS === 'android') {
      //push in android

      const data = {
        body: notify.message,
        title: notify.title,
        type: notify.data.type,
        redirectTargetId: notify.data.redirectTargetId,
        notificationId: notify.data.notificationId,
      };
      setNotiData(data);

      // PushNotification.localNotification({
      //   title: notify.title,
      //   message: notify.message,
      // });

      PushNotification.configure({
        onNotification: function (notification) {
          if (notification.userInteraction) {
            if (notification.bigText.includes('님이 메세지를 보냈어요')) {
              navigation.navigate('NoteNavigation');
            } else {
              navigation.navigate('Notis');
            }
          }
        },
      });
    }

    // if (Platform.OS === 'ios') {
    //   //ios noti resive when app is open
    //   console.log('ios noti resive when app is open :', notify.body);
    // } else {
    //   // android noti resive when app is open
    //   if (notify.message) {
    //     console.log('android noti resive when app is open');
    //   }
    // }
  };

  const onRegister = (tk: string) => {
    //토큰 가져온걸로 뭐할지
    console.log('[App] onRegister : token :', tk);
    // const temp = tk.substring(0, 10);
    // setToken(temp);
    // console.log('[App] onRegister : token :', temp);
    //console.log('[App] onRegister : token :', tk);
  };

  useEffect(() => {
    // const {link = null} = notification?.data || {}; // <---- 1
    // PushNotification.popInitialNotification(notification => {
    //   if (notification) {
    //     const {link = null} = notification?.data || {};
    //     Linking.openURL(link); // <---- 2
    //   }
    // });

    fcmService.registerAppWithFCM(); //ios일때 자동으로 가져오도록 하는 코드
    //앱 켜졌을 때 작동부                 여기
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);
  }, []);
  // }, [onOpenNotification]);

  useEffect(() => {
    PushNotification.popInitialNotification(notification => {
      if (notification) {
        const {link = null} = notification?.data || {};
        link && Linking.openURL(link); // <---- 2
      }
    });
  }, []);

  // for network status

  useEffect(() => {
    const handleConnectivityChange = newState => {
      console.log('### : ', newState);
      if (!newState.isConnected || !newState.isInternetReachable) {
        setNetwork(false);
      } else {
        setNetwork(true);
      }
    };
    handleConnectivityChange(netInfo);
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    return () => {
      unsubscribe();
    };
  }, [netInfo]);

  return (
    <Provider store={store}>
      {Platform.OS === 'ios' ? (
        <>
          <NetworkComponent />
          <NotificationComponent
            title={notiData.title}
            message={notiData.body}
          />
          <AppInner />
        </>
      ) : (
        <SafeAreaProvider>
          <NetworkComponent />
          <AppInner />
        </SafeAreaProvider>
      )}
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 10,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    // elevation: 5,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    margin: 8,
  },
  buttonArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 9,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 16,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginRight: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222222',
  },
  message: {
    fontSize: 15,
    fontWeight: 'normal',
    color: '#222222',
  },
  now: {
    fontWeight: 'normal',
    color: '#3F3F3F',
  },
  networkAlert: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? StatusBarHeight + 44 : 44,
    left: 0,
    right: 0,
    zIndex: 100,
    justifyContent: 'center',
    width: '100%',
    height: 32,
    backgroundColor: '#B02121',
  },
  networkText: {
    color: '#F0F0F0',
    textAlign: 'center',
    fontFamily: 'Pretendard',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 16,
    // lineHeight: 'normal',
    letterSpacing: -0.26,
    textDecorationLine: 'underline',
  },
});
