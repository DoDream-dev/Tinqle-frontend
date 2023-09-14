import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { RootStackParamList } from '../../AppInner';
import Feed from '../components/Feed';

type FeedDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'FeedDetail'>;

export default function FeedDetail({navigation, route}:FeedDetailScreenProps) {
  const mine = route.params.mine;
  const emotionData = route.params.emotionData;
  const commentCnt = route.params.commentCnt;
  return (
    <View style={styles.entire}>
      <Feed
        mine={true}
        detail={true}
        commentCnt={commentCnt}
        heartEmoticonNicknameList={emotionData.heart}
        smileEmoticonNicknameList={emotionData.smile}
        sadEmoticonNicknameList={emotionData.sad}
        surpriseEmoticonNicknameList={emotionData.surprise}
        />
        <View style={styles.commentView}>
          <View style={styles.commentHeader}>
            <Image source={require('../../assets/image/commentIcon.png')} />
            <Text style={styles.commentHeaderTxt}>댓글 {commentCnt}개</Text>
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    alignItems: 'center',
  },
  commentView:{
    width: '100%',
  },
  commentHeader:{
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 36,
    borderBottomColor: '#ECECEC',
    borderBottomWidth: 1,
    borderTopColor: '#ECECEC',
    borderTopWidth: 1,
    marginLeft: 15
  },
  commentHeaderTxt:{
    marginLeft: 3,
    color: '#848484',
    fontSize: 12,
    fontWeight: '500',
  },
});