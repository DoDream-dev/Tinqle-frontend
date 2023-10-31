import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { svgXml } from '../../assets/image/svgXml';
import { SvgXml } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppInner';
export default function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const hide = () => {console.log('moveee')};
  useEffect(()=>{
    setTimeout(() => {
      console.log('move')
      navigation.navigate('FeedList');
      navigation.pop()
    }, 2000);
  },[]);
  return (
    <View style={styles.entire}>
      <SvgXml width={60} height={60} xml={svgXml.icon.splash} />
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor:'red'
  },
});