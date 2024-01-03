/**
 * @format
 */

import {AppRegistry, Platform, Vibration, Linking} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import store from './src/store';
import userSlice from './src/slices/user';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
// import PushNotification, { Importance } from 'react-native-push-notification';

// PushNotification.configure({
//   onNotification: function (notification) {
//     console.log("NOTIFICATION:", notification);
//   },
//   onRegistrationError: function(err) {
//     console.error(err.message, err);
//   },

//   // popInitialNotification: true,
//   // requestPermissions: true,
// });

// PushNotification.createChannel({
//   channelId: 'dodream',
//   channelName: 'tincle',
// },
// (created) => console.log('createChannel returned', created))

// const handleFcmMessage = () => {
//   const unsubscribe = messaging().onMessage(async remoteMessage => {
//     console.log('new messag arrived')
//     dispatch(
//       userSlice.actions.setNotis({
//         notis:true,
//       }),
//     );
//   });
//   messaging().onNotificationOpenedApp(remoteMessage => {
//     console.log('Noti caused app to open from gb state: ', remoteMessage.notification,);
//   });
// }
// const requestUserPermissionForFCM = async () => {
//   const authStatus = await messaging().requestPermission();
//   const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     const fcmToken = await messaging().getToken();
//     setFcm(fcmToken);
//     handleFcmMessage();
//   } else {
//     console.log('fcm auth fail')
//   }
// }
// requestUserPermissionForFCM();

// const requestNotificationPermission = async () => {
//   //todo: ios
//   if (Platform.OS === 'android') {
//     const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
//     return result;
//   }
// };

messaging().setBackgroundMessageHandler(async remoteMessage => {
  onMessageReceived(remoteMessage);
});

const onMessageReceived = message => {
  console.log('[index.js] onMessageReceived: ', message);
  // if (Platform.OS === 'ios') {
  //   // const {link = null} = message?.data || {}; // <---- 1
  //   const pushDeepLink = message?.data?.link;
  //   //console.log('pushDeepLink : ', pushDeepLink);
  //   pushDeepLink && Linking.openURL(pushDeepLink);
  //   Vibration.vibrate([400]);
  // }
};

//원래 주석 아님
// const checkNotificationPermission = async () => {
//   const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
//   return result;
// };

// const requestPermission = async () => {
//   const checkPermission = await checkNotificationPermission();
//   if (checkPermission !== RESULTS.GRANTED) {
//     const request = await requestNotificationPermission();
//     if (request !== RESULTS.GRANTED) {
//       // permission not granted
//     }
//   }
// };
// requestPermission();

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message: ', remoteMessage)
//   store.dispatch(userSlice.actions.setNotis({notis:true,}));
// });

// messaging().onMessage(async remoteMessage => {
//   console.log('new messag arrived:', remoteMessage)
//   dispatch(
//     userSlice.actions.setNotis({
//       notis:true,
//     }),
//   );
// });
// messaging().onNotificationOpenedApp(remoteMessage => {
//   console.log('Noti caused app to open from gb state: ', remoteMessage.notification,);
// });

function headlessCheck({isHeadless}) {
  if (isHeadless) {
    return null;
  }
  return <App />;
}

// AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(appName, () => headlessCheck);
