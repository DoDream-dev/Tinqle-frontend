/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import {useNavigation} from '@react-navigation/native';
import {svgXml} from '../../assets/image/svgXml';
import {SvgXml} from 'react-native-svg';
import FriendProfileModal from './FriendProfileModal';
import ImageModal from 'react-native-image-modal';
import ToastScreen from './ToastScreen';
import Modal from 'react-native-modal';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';

const windowWidth = Dimensions.get('screen').width;
type ContentProfileProps = {
  nickname: string;
  status: string;
  createdAt: string;
  accountId: number;
  mine: boolean;
  profileImg: string | null;
  showWhoseModal: number;
  setShowWhoseModal: React.Dispatch<React.SetStateAction<number>>;
  setWhichPopup: React.Dispatch<React.SetStateAction<string>>;
  feedId: number;
  deleteFeedId: number;
  setDeleteFeedId: React.Dispatch<React.SetStateAction<number>>;
};

export default function ContentProfile(props: ContentProfileProps) {
  const nickname = props.nickname;
  const status = props.status;
  const createdAt = props.createdAt;
  const accountId = props.accountId;
  const feedId = props.feedId;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const profileImg = props.profileImg;
  const showWhoseModal = props.showWhoseModal;
  const setShowWhoseModal = props.setShowWhoseModal;
  const [deleteFriend, setDeleteFriend] = useState(-1);
  const setWhichPopup = props.setWhichPopup;

  const deleteFriends = async () => {
    try {
      console.log(deleteFriend);
      const response = await axios.delete(
        `${Config.API_URL}/friendships/${deleteFriend}`,
      );
      // console.log(response.data)
      // popup: 이도님께 친구 요청을 보냈어요!
      setWhichPopup('deletedFriend');
      // setPopupName(name);
      setDeleteFriend(-1);
      // setReset(!reset);
      console.log(response.data);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  return (
    <View style={styles.profileSection}>
      <View style={{flexDirection:'row'}}>
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
          <View style={[styles.txtNickname, feedId == -1 && {maxWidth: 70}]}>
            <Pressable
              onPress={() => {
                if (props.mine) {
                  navigation.navigate('MyProfile');
                } else {
                  setShowWhoseModal(accountId);
                }
              }}>
              <Text style={styles.nickname}>{nickname}</Text>
            </Pressable>
            {feedId != -1 && <View>
              {status == 'smile'.toUpperCase() && (
              <SvgXml width={18} height={18} xml={svgXml.status.smile} />
              )}
              {status == 'happy'.toUpperCase() && (
                <SvgXml width={18} height={18} xml={svgXml.status.happy} />
              )}
              {status == 'sad'.toUpperCase() && (
                <SvgXml width={18} height={18} xml={svgXml.status.sad} />
              )}
              {status == 'mad'.toUpperCase() && (
                <SvgXml width={18} height={18} xml={svgXml.status.mad} />
              )}
              {status == 'exhausted'.toUpperCase() && (
                <SvgXml width={18} height={18} xml={svgXml.status.exhauseted} />
              )}
              {status == 'coffee'.toUpperCase() && (
                <SvgXml width={18} height={18} xml={svgXml.status.coffee} />
              )}
              {status == 'meal'.toUpperCase() && (
                <SvgXml width={18} height={18} xml={svgXml.status.meal} />
              )}
              {status == 'alcohol'.toUpperCase() && (
                <SvgXml width={18} height={18} xml={svgXml.status.alcohol} />
              )}
              {status == 'chicken'.toUpperCase() && (
                <SvgXml width={18} height={18} xml={svgXml.status.chicken} />
              )}
              {status == 'sleep'.toUpperCase() && (
                <SvgXml width={18} height={18} xml={svgXml.status.sleep} />
              )}
              {status == 'work'.toUpperCase() && (
                <SvgXml width={18} height={18} xml={svgXml.status.work} />
              )}
              {status == 'study'.toUpperCase() && (
                <SvgXml width={18} height={18} xml={svgXml.status.study} />
              )}
              {status == 'movie'.toUpperCase() && (
                <SvgXml width={18} height={18} xml={svgXml.status.movie} />
              )}
              {status == 'move'.toUpperCase() && (
                <SvgXml width={18} height={18} xml={svgXml.status.move} />
              )}
              {status == 'dance'.toUpperCase() && (
                <SvgXml width={18} height={18} xml={svgXml.status.dance} />
              )}
              {status == 'read'.toUpperCase() && (
                <SvgXml width={18} height={18} xml={svgXml.status.read} />
              )}
              {status == 'walk'.toUpperCase() && (
                <SvgXml width={18} height={18} xml={svgXml.status.walk} />
              )}
              {status == 'travel'.toUpperCase() && (
                <SvgXml width={18} height={18} xml={svgXml.status.travel} />
              )}
            </View>}
          </View>
          <Text style={styles.createdAt}>{createdAt}</Text>
        </View>
      </View>
      {feedId != -1 && props.mine && <Pressable
        onPress={()=>props.setDeleteFeedId(feedId)}
      >
        <SvgXml width={24} height={24} xml={svgXml.icon.menu} />
      </Pressable>}
      <FriendProfileModal
        showWhoseModal={showWhoseModal}
        setShowWhoseModal={setShowWhoseModal}
      />
      <Modal
        isVisible={deleteFriend != -1}
        // onModalWillShow={getProfile}
        hasBackdrop={true}
        onBackdropPress={() => setDeleteFriend(-1)}
        // coverScreen={false}
        onBackButtonPress={() => setDeleteFriend(-1)}
        // backdropColor='#222222' backdropOpacity={0.5}
        // style={[styles.entire, {marginVertical:(Dimensions.get('screen').height - 400)/2}]}
      >
        {/* <View style={styles.modalBGView}>   */}
        <View style={styles.modalView}>
          <Text style={styles.modalTitleTxt}>친구를 삭제하시겠어요?</Text>
          <Text style={styles.modalContentTxt}>
            상대방에게 알림이 가지 않으니 안심하세요.
          </Text>
          <View style={styles.btnView}>
            <Pressable
              style={styles.btnGray}
              onPress={() => {
                setDeleteFriend(-1);
              }}>
              <Text style={styles.btnTxt}>취소</Text>
            </Pressable>
            <View style={{width: 8}}></View>
            <Pressable
              style={styles.btn}
              onPress={() => {
                deleteFriends();
              }}>
              <Text style={styles.btnTxt}>네, 삭제할게요.</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    {/* <View style={{bottom:0, alignItems:'center', backgroundColor:'red', width:'100%', position:'absolute', height:100}}>
      {whichPopup === 'deleted' && (
        <ToastScreen
          height={21}
          marginBottom={48}
          onClose={() => setWhichPopup('')}
          message="친구를 삭제했어요."
        />
      )}
    </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  statusView: {
  },
  contentView: {
    // flex: 1,
    paddingLeft: 8,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
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
    marginTop: 0,
    fontWeight: '500',
    fontSize: 12,
    color: '#848484',
  },
  contentTxt: {
    fontWeight: '400',
    fontSize: 15,
    color: '#F0F0F0',
    // includeFontPadding:true
    // paddingBottom:5
  },
  modalView: {
    backgroundColor: '#333333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  modalTitleTxt: {
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalContentTxt: {
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 10,
    marginTop: 10,
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 13,
    backgroundColor: '#A55FFF',
  },
  btnGray: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 13,
    backgroundColor: '#888888',
  },
  btnTxt: {
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '600',
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
    marginTop: 16,
  },
});
