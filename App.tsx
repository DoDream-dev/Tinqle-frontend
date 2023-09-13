import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppInner from './AppInner';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppInner />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

{/* <Drawer.Screen 
  name={`Home`} 
  children={
    ({navigation})=>
      <Home name={name} setName={setName} navigation={navigation}/>}/> */}