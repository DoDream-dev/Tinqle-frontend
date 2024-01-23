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

export type NotificationProps = {
  title: string;
  message: string;
};

export default function App() {
  const navigation = useNavigation();
  const [isNotification, setIsNotification] = useState(false);
  const [notiData, setNotiData] = useState({});

  const noticeNavigation_inapp_and = (
    type: String,
    redirectTargetId: String,
  ) => {
    // console.log('type : ', type);
    // console.log('redirectTargetId : ', redirectTargetId);

    if (type.includes('FEED')) {
      navigation.navigate('FeedDetail', {feedId: redirectTargetId});
    } else if (type == 'APPROVE_FRIENDSHIP_REQUEST') {
      navigation.navigate('Notis');
    } else if (type == 'CREATE_FRIENDSHIP_REQUEST') {
      navigation.navigate('Notis');
    } else if (type == 'SEND_KNOCK') {
      navigation.navigate('Notis');
    } else if (type == 'REACT_EMOTICON_ON_COMMENT') {
      navigation.navigate('FeedDetail', {feedId: redirectTargetId});
    } else if (type == 'CREATE_KNOCK_FEED') {
      navigation.navigate('FeedDetail', {feedId: redirectTargetId});
    }
  };

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

    const noticeNavigation = () => {
      const type = notiData.type;
      const redirectTargetId = notiData.redirectTargetId;

      // console.log('type : ', type);
      // console.log('redirectTargetId : ', redirectTargetId);

      if (type.includes('FEED')) {
        navigation.navigate('FeedDetail', {feedId: redirectTargetId});
      } else if (type == 'APPROVE_FRIENDSHIP_REQUEST') {
        navigation.navigate('Notis');
      } else if (type == 'CREATE_FRIENDSHIP_REQUEST') {
        navigation.navigate('Notis');
      } else if (type == 'SEND_KNOCK') {
        navigation.navigate('Notis');
      } else if (type == 'REACT_EMOTICON_ON_COMMENT') {
        navigation.navigate('FeedDetail', {feedId: redirectTargetId});
      } else if (type == 'CREATE_KNOCK_FEED') {
        navigation.navigate('FeedDetail', {feedId: redirectTargetId});
      }
    };

    return isNotification ? (
      <Animated.View style={[styles.container, animatedStyle]}>
        <AnimatedButton
          style={styles.buttonArea}
          onPress={() => {
            noticeNavigation();
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

  const onNotification = (notify: any) => {
    console.log('[onNotification] notify 알림 왔을 때 :', notify);
    const options = {
      soundName: 'default',
      playSound: true,
    };

    if (Platform.OS === 'android' && notify !== undefined) {
      // console.log('1. [onNotification] notify.body :', notify);
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
      };
      setNotiData(data);
      setIsNotification(true);
    }
  };

  const onOpenNotification = (notify: any) => {
    //앱 켜진 상태에서 알림 받았을 때 하는 일
    console.log('앱 켜졌을 때 알림 도착:', notify);

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
      };
      setNotiData(data);

      PushNotification.localNotification({
        title: notify.title,
        message: notify.message,
      });

      PushNotification.configure({
        onNotification: function (notification) {
          // console.log('NOTIFICATION:', notification);

          if (notification.userInteraction) {
            // console.log('Notification was pressed!');
            noticeNavigation_inapp_and(
              notify.data.type,
              notify.data.redirectTargetId,
            );
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

  useEffect(() => {
    PushNotification.popInitialNotification(notification => {
      if (notification) {
        const {link = null} = notification?.data || {};
        link && Linking.openURL(link); // <---- 2
      }
    });
  }, []);

  return (
    <Provider store={store}>
      {Platform.OS === 'ios' ? (
        <>
          <NotificationComponent
            title={notiData.title}
            message={notiData.body}
          />
          <AppInner />
        </>
      ) : (
        <SafeAreaProvider>
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
});
