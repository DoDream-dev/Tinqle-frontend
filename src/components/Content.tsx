import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import {useNavigation} from '@react-navigation/native';
import {svgXml} from '../../assets/image/svgXml';
import {SvgXml} from 'react-native-svg';
import FriendProfileModal from './FriendProfileModal';
import ImageModal from 'react-native-image-modal';

type ContentProps = {
  nickname: string;
  status: string;
  content: string;
  createdAt: string;
  accountId: number;
  mine: boolean;
  imageURL: string[] | null[];
  detail: boolean;
  cmt: boolean;
  child: React.Dispatch<React.SetStateAction<number>>;
  cmtId: number;
  profileImg: string | null;
  showWhoseModal: number;
  setShowWhoseModal: React.Dispatch<React.SetStateAction<number>>;
  index: number;
};

export default function Content(props: ContentProps) {
  const nickname = props.nickname;
  const status = props.status;
  const content = props.content;
  const createdAt = props.createdAt;
  const accountId = props.accountId;
  const imageURL = props.imageURL;
  const cmt = props.cmt;
  const child = props.child;
  const cmtId = props.cmtId;
  const index = props.index;
  const windowWidth = Dimensions.get('screen').width;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const profileImg = props.profileImg;
  const showWhoseModal = props.showWhoseModal;
  const setShowWhoseModal = props.setShowWhoseModal;

  return (
    <View style={styles.entire}>
      <View style={styles.statusView}>
        <Pressable
          onPress={() => {
            if (props.mine) {
              navigation.navigate('MyProfile');
            } else {
              setShowWhoseModal(accountId);
            }
          }}>
          {profileImg == null ? (
            <SvgXml width={32} height={32} xml={svgXml.profile.null} />
          ) : (
            <Image
              source={{uri: profileImg}}
              style={{width: 32, height: 32, borderRadius: 16}}
            />
          )}
        </Pressable>
      </View>
      <View style={styles.contentView}>
        <View style={styles.txtView}>
          <Pressable
            style={styles.txtNickname}
            onPress={() => {
              if (props.mine) {
                navigation.navigate('MyProfile');
              } else {
                setShowWhoseModal(accountId);
              }
            }}>
            <Text style={styles.nickname}>{nickname}</Text>
            {status == 'smile'.toUpperCase() && (
              <SvgXml width={16} height={16} xml={svgXml.status.smile} />
            )}
            {status == 'happy'.toUpperCase() && (
              <SvgXml width={16} height={16} xml={svgXml.status.happy} />
            )}
            {status == 'sad'.toUpperCase() && (
              <SvgXml width={16} height={16} xml={svgXml.status.sad} />
            )}
            {status == 'mad'.toUpperCase() && (
              <SvgXml width={16} height={16} xml={svgXml.status.mad} />
            )}
            {status == 'exhausted'.toUpperCase() && (
              <SvgXml width={16} height={16} xml={svgXml.status.exhauseted} />
            )}
            {status == 'coffee'.toUpperCase() && (
              <SvgXml width={16} height={16} xml={svgXml.status.coffee} />
            )}
            {status == 'meal'.toUpperCase() && (
              <SvgXml width={16} height={16} xml={svgXml.status.meal} />
            )}
            {status == 'alcohol'.toUpperCase() && (
              <SvgXml width={16} height={16} xml={svgXml.status.alcohol} />
            )}
            {status == 'chicken'.toUpperCase() && (
              <SvgXml width={16} height={16} xml={svgXml.status.chicken} />
            )}
            {status == 'sleep'.toUpperCase() && (
              <SvgXml width={16} height={16} xml={svgXml.status.sleep} />
            )}
            {status == 'work'.toUpperCase() && (
              <SvgXml width={16} height={16} xml={svgXml.status.work} />
            )}
            {status == 'study'.toUpperCase() && (
              <SvgXml width={16} height={16} xml={svgXml.status.study} />
            )}
            {status == 'movie'.toUpperCase() && (
              <SvgXml width={16} height={16} xml={svgXml.status.movie} />
            )}
            {status == 'move'.toUpperCase() && (
              <SvgXml width={16} height={16} xml={svgXml.status.move} />
            )}
            {status == 'dance'.toUpperCase() && (
              <SvgXml width={16} height={16} xml={svgXml.status.dance} />
            )}
            {status == 'read'.toUpperCase() && (
              <SvgXml width={16} height={16} xml={svgXml.status.read} />
            )}
            {status == 'walk'.toUpperCase() && (
              <SvgXml width={16} height={16} xml={svgXml.status.walk} />
            )}
            {status == 'travel'.toUpperCase() && (
              <SvgXml width={16} height={16} xml={svgXml.status.travel} />
            )}
          </Pressable>
          <Text style={styles.createdAt}>{createdAt}</Text>
        </View>
        <View style={styles.content}>
          {content != '' && <Text style={styles.contentTxt}>{content}</Text>}
          {/* {imageURL.flatMap(f => !!f ? [f] : []).length != 0 && <SliderBox 
            images={imageURL}
            sliderBoxHeight={283}
            parentWidth={283}
          />} */}
          {imageURL.flatMap(f => (!!f ? [f] : [])).length != 0 && (
            <ImageModal
              swipeToDismiss={true}
              resizeMode="contain"
              // resizeMode="cover"
              imageBackgroundColor="transparent"
              overlayBackgroundColor="#202020"
              style={{
                width: windowWidth - 100,
                height: windowWidth - 100,
                marginTop: 8,
              }}
              source={{
                uri: imageURL[0] ?? undefined,
              }}
            />
          )}
        </View>
        {cmt && (
          <Pressable style={styles.recomment} onPress={() => child(index)}>
            <Text style={styles.recommentTxt}>대댓글 쓰기</Text>
          </Pressable>
        )}
      </View>
      <FriendProfileModal
        showWhoseModal={showWhoseModal}
        setShowWhoseModal={setShowWhoseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flexDirection: 'row',
    padding: 16,
    // backgroundColor: 'red',
  },
  entireCmt: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    // backgroundColor:'pink'
  },
  statusView: {},
  contentView: {
    flex: 1,
    paddingLeft: 8,
  },
  txtView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txtNickname: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F0F0F0',
    marginRight: 3,
  },
  createdAt: {
    fontWeight: '500',
    fontSize: 12,
    color: '#848484',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  contentTxt: {
    fontWeight: '400',
    fontSize: 15,
    color: '#F0F0F0',
    // includeFontPadding:true
    // paddingBottom:5
  },
  recomment: {
    marginTop: 8,
    // marginBottom:8
  },
  recommentTxt: {
    color: '#848484',
    fontSize: 12,
    fontWeight: '500',
  },
});
