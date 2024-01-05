// push.fcm.js
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

class FCMService {
  register = (
    onRegister: any,
    onNotification: any,
    onOpenNotification: any,
  ) => {
    //this.checkPermission(onRegister); //권한 확인 해서 get token & onRegister 함수 실행
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  //남겨 두기
  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().setAutoInitEnabled(true);
    }
  };

  //권한 확인 하고 있으면 바로 gettoken, 없으면 권한 요청하고 get
  checkPermission = (onRegister: any) => {
    messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          this.getToken(onRegister);
        } else {
          this.requestPermission(onRegister);
        }
      })
      .catch(error => {
        console.log('[FCMService] Permission rejected ', error);
      });
  };

  //메세징 에서 토큰 가져옴 & onRegister 함수 실행
  getToken = (onRegister: any) => {
    messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          onRegister(fcmToken);
        } else {
          console.log('[FCMService] User does not have a device token');
        }
      })
      .catch(error => {
        console.log('[FCMService] getToken rejected', error);
      });
  };

  //권한 없는 경우 요청 & getToken 함수 실행
  requestPermission = (onRegister: any) => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch(error => {
        console.log('[FCMService] Request Permission rejected', error);
      });
  };

  deleteToken = () => {
    messaging()
      .deleteToken()
      .catch(error => {
        console.log('[FCMService] Delete token error', error);
      });
  };

  createNotificationListeners = (
    onRegister: any,
    onNotification: any,
    onOpenNotification: any,
  ) => {
    if (Platform.OS === 'android') {
      const channelId = 'fcm_fallback_notification_channel';
      //console.log('Channel ID: ', channelId);
      PushNotification.createChannel(
        {
          channelId: channelId, // (required)
          channelName: 'test channel', // (required)
          channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
          playSound: true, // (optional) default: true
          soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
          // importance: 'high', // (optional) default: Importance.HIGH. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
        },
        created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
      );
    }

    messaging().onNotificationOpenedApp(remoteMessage => {
      // console.log('%%%createNotificationListeners : ', remoteMessage);
      if (remoteMessage) {
        const notification = remoteMessage.notification;
        onOpenNotification(notification);
      }

      // Alert.alert(remoteMessage.body);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const notification = remoteMessage.notification;
          onOpenNotification(notification);
        }
      })
      .catch(error => {
        console.log('quit state notification error : ', error);
      });

    this.messageListener = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        let notification = null;
        if (Platform.OS === 'ios') {
          notification = remoteMessage.data.notification;
        } else {
          notification = remoteMessage.notification;
        }

        onNotification(notification);
      }
    });

    messaging().onTokenRefresh(fcmToken => {
      onRegister(fcmToken);
    });
  };

  unRegister = () => {
    this.messageListener();
  };
}

export const fcmService = new FCMService();
