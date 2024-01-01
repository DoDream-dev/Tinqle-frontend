import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppInner from './AppInner';
import {fcmService} from './src/push_fcm';
import {localNotificationService} from './src/push_noti';
import {Provider} from 'react-redux/es/exports';
import store from './src/store';
import {useEffect} from 'react';
import {Platform, Linking} from 'react-native';
import PushNotification from 'react-native-push-notification';

export default function App() {
  const requestUserPermission = async () => {
    fcmService.checkPermission(updateDeviceTokenData);

    // const authStatus = await messaging().requestPermission();
    // const enabled =
    //   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //   authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    // if (enabled) {
    //   return getDeviceToken();
    // }
  };

  const onNotification = (notify: any) => {
    console.log('[onNotification] notify 알림 왔을 때 :', notify);
    const options = {
      soundName: 'default',
      playSound: true,
    };

    if (Platform.OS === 'ios') {
      console.log('1. [onNotification] notify.body :', notify.body);
    }

    localNotificationService.showNotification(
      0,
      notify.title,
      notify.body,
      notify,
      options,
    );
  };

  const onOpenNotification = (notify: any) => {
    //앱 켜진 상태에서 알림 받았을 때 하는 일
    console.log('[App] onOpenNotification 앱 켜진 상태에서 : notify :', notify);
    // Alert.alert('Open Notification : notify.body :' + notify.body);
    if (Platform.OS === 'ios') {
      console.log('2. [onNotification] notify.body :', notify.body);
    } else {
      if (notify.message) {
        console.log('3. [onNotification] notify.body :', notify.body);
      }
    }
  };

  const updateDeviceTokenData = (token: string) => {
    console.log('[App] updateDeviceTokenData : token :', token);
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

    requestUserPermission();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppInner />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
