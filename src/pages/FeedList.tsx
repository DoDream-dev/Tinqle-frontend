import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { RootStackParamList } from '../../AppInner';
import Feed from '../components/Feed';

type FeedListScreenProps = NativeStackScreenProps<RootStackParamList, 'FeedList'>;
interface ImsiProps {
  setState:React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FeedList({navigation}:FeedListScreenProps, {setState}:ImsiProps) {
  const mine = true;
  const emotionData = {
      heart:['가', '나'],
      smile:[],
      sad:['다'],
      surprise:['가', '다', '라'],
  }
  const commentCnt = 0;
  const move = useCallback(()=>{navigation.navigate('FeedDetail', {mine: mine, emotionData:emotionData, commentCnt:commentCnt})}, [navigation]);
  return (
    <View style={styles.entire}>
      <Pressable onPress={() => setState(false)}>
        <Text>FeedList</Text>
      </Pressable>
      <Pressable onPress={move} style={{width: '100%', flex:1}}>
        <Feed
          mine={mine}
          detail={false}
          commentCnt={commentCnt}
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
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'yellow'
  },
});