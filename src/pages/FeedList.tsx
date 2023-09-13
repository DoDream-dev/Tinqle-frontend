import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { RootStackParamList } from '../../AppInner';
import Feed from '../components/Feed';

type FeedListScreenProps = NativeStackScreenProps<RootStackParamList, 'FeedList'>;

export default function FeedList({navigation}:FeedListScreenProps) {
  const mine = true;
  const emotionData = {
      heart:['가', '나'],
      smile:[],
      sad:['다'],
      surprise:['가', '다', '라'],
  }
  const move = useCallback(()=>{navigation.navigate('FeedDetail', {mine: mine, emotionData:emotionData})}, [navigation]);
  return (
    <View style={styles.entire}>
      <Pressable>
        <Text>FeedList</Text>
      </Pressable>
      <Pressable onPress={move}>
        <Feed
          mine={mine}
          detail={false}
          heartEmoticonNicknameList={emotionData.heart}
          smileEmoticonNicknameList={emotionData.smile}
          sadEmoticonNicknameList={emotionData.sad}
          surpriseEmoticonNicknameList={emotionData.surprise}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    alignItems: 'center'
  },
});