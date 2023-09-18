import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppInner from './AppInner';

import { Provider } from 'react-redux/es/exports';
import store from './src/store';

export default function App() {
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
