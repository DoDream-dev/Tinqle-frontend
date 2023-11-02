/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging'
import store from './src/store';
import userSlice from './src/slices/user';
// import { useAppDispatch } from './src/store';
// import userSlice from './src/slices/user';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message: ', remoteMessage)
  // const dispatch = useAppDispatch();
  // dispatch(
  //   userSlice.actions.setNotis({
  //     notis:true,
  //   }),
  // );
  store.dispatch(userSlice.actions.setNotis({notis:true,}));
});

AppRegistry.registerComponent(appName, () => App);
