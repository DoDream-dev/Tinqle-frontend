// push.noti.js

import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LocalNotificationService {
  configure = (onOpenNotification: any) => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log(
          '[LocalNotificationService] onRegister : localtoken',
          token,
        );
      },

      onNotification: function (notification) {
        // 앱내 알림 시 오는 부분
        if (notification.userInteraction) {
          console.log('Notification was pressed!', notification);

          if (
            notification.data &&
            notification.data.redirectTargetId &&
            notification.data.type
          ) {
            AsyncStorage.setItem(
              'pushNoti_redirectTargetId',
              notification.data.redirectTargetId,
            );
            AsyncStorage.setItem('pushNot_type', notification.data.type);
            AsyncStorage.setItem(
              'pushNot_id',
              notification.data.notificationId,
            );
          }
        }

        console.log('[LocalNotificationService] onNotification ', notification);
        if (!notification?.data) {
          return;
        }
        notification.userInteraction = true;
        // console.log('TEST : ', notification);

        onOpenNotification(
          Platform.OS === 'ios' ? notification.data : notification,
        );

        // const {link = null} = notification?.data || {}; // <---- 1
        // link && Linking.openURL(link); // <---- 2

        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,

      // //추가
      // onNotification: notification => {
      //   const {link = null} = notification?.data || {}; // <---- 1
      //   link && Linking.openURL(link); // <---- 2

      //   notification.finish(PushNotificationIOS.FetchResult.NoData);
      // },
    });
  };

  unRegister = () => {
    PushNotification.unregister();
  };

  showNotification = (
    id: any,
    title: any,
    message: any,
    data = {},
    options = {},
  ) => {
    // console.log('TEST : ', id, title, message, data, options);

    PushNotification.localNotification({
      // Android only Properties
      ...this.buildAndroidNotification(id, title, message, data, options),

      // IOS and Android properties
      ...this.buildIOSNotification(id, title, message, data, options),

      // IOS and Android properties
      title: title || '',
      message: message || '',
      playSound: options.playSound || false,
      soundName: options.soundName || 'default',
      userInteraction: false,
    });
  };

  buildAndroidNotification = (
    id: any,
    title: any,
    message: any,
    data = {},
    options = {},
  ) => {
    // console.log('$$$TEST : ', id, title, message, data, options);
    return {
      channelId: 'fcm_fallback_notification_channel',
      id: id,
      authCancel: true,
      // largeIcon: 'ic_launcher',
      smallIcon: 'ic_launcher',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || 'high',
      // priority: 'high',
      importance: options.importance || 'high',
      data: data,
    };
  };

  buildIOSNotification = (
    id: any,
    title: any,
    message: any,
    data = {},
    options = {},
  ) => {
    return {
      alertAction: options.alertAction || 'view',
      category: options.category || '',
      userInfo: {
        id: id,
        item: data,
        // id: 1,
        // item: {
        //   title: 'test',
        //   message: 'test',
        // },
      },
    };
  };

  cancelAllLocalNotifications = () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };

  removeDeliveredNotificationByID = (notification: any) => {
    // console.log('[LocalNotificationService] removeDeliveredNotificationByID:',notification,);
    PushNotification.cancelLocalNotifications({id: `${notification.id}`});
  };
}

export const localNotificationService = new LocalNotificationService();
