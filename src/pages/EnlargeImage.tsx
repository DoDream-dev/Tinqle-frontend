import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import Feather from 'react-native-vector-icons/Feather';
import AnimatedButton from '../components/AnimatedButton';

type EnlargeImageProps = NativeStackScreenProps<
  RootStackParamList,
  'EnlargeImage'
>;

export default function EnlargeImage({navigation, route}: EnlargeImageProps) {
  useFocusEffect(
    useCallback(() => {
      console.log('EnlargeImage focus', route.params);
    }, []),
  );

  return (
    <View style={styles.entire}>
      <AnimatedButton
        style={styles.closeBtn}
        onPress={() => {
          navigation.goBack();
        }}>
        <Feather name="x" size={24} color={'#222222'} />
      </AnimatedButton>
      <View style={styles.empty}>
        <Text style={styles.emptyTxt}>{'route.params'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
  },
  empty: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTxt: {
    color: '#888888',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  closeBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 8,
    zIndex: 1,
    padding: 8,
    // backgroundColor: 'red',
  },
});
