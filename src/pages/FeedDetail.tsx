import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RootStackParamList } from '../../AppInner';
import Feed from '../components/Feed';

type FeedDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'FeedDetail'>;

export default function FeedDetail({navigation, route}:FeedDetailScreenProps) {
  const mine = route.params.mine;
  const emotionData = route.params.emotionData;
  return (
    <View style={styles.entire}>
      <Feed
        mine={true}
        detail={true}
        heartEmoticonNicknameList={emotionData.heart}
        smileEmoticonNicknameList={emotionData.smile}
        sadEmoticonNicknameList={emotionData.sad}
        surpriseEmoticonNicknameList={emotionData.surprise}
        />
      <Text>댓글</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    alignItems: 'center'
  },
});