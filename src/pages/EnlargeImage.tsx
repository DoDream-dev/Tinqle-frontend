import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';

type EnlargeImageProps = NativeStackScreenProps<
  RootStackParamList,
  'EnlargeImage'
>;

export default function EnlargeImage({navigation, route}: EnlargeImageProps) {
  useFocusEffect(
    useCallback(() => {
      console.log('EnlargeImage focus');
    }, []),
  );

  return (
    <View style={styles.entire}>
      <View style={styles.empty}>
        <Text style={styles.emptyTxt}>알림을 다 읽었어요</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#202020',
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
});
