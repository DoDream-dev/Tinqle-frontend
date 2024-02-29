/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {StyleSheet, Text, Pressable, View, Image} from 'react-native';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {svgXml} from '../../assets/image/svgXml';
import {SvgXml} from 'react-native-svg';
import Modal from 'react-native-modal';
import ImageModal from 'react-native-image-modal';
import ImagePicker from 'react-native-image-crop-picker';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import AnimatedButton from '../components/AnimatedButton';
import Clipboard from '@react-native-clipboard/clipboard';

type ProfileProps = {
  status: string;
  name: string;
  profileImg: string | null;
  setProfileImg: React.Dispatch<React.SetStateAction<string | null>>;
  renameModal: React.Dispatch<React.SetStateAction<boolean>>;
  friendshipRelation: string;
  myCode: string;
  setWhichPopup: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function Profile(props: ProfileProps) {
  const status = props.status;
  const profileImage = props.profileImg;
  const setProfileImg = props.setProfileImg;
  const name = props.name;
  const renameModal = props.renameModal;
  const friendshipRelation = props.friendshipRelation;
  const myCode = props.myCode;
  const setWhichPopup = props.setWhichPopup;
  // const imsi = true; // 상태변화없나?

  const [deleteProfileImg, setDeleteProfileImg] = useState(false);
  // const [chageName, setChangeName] = useState(false);
  // const [changeStatus, setChangeStatus] = useState(false);

  const uploadProfileImage = async () => {
    ImagePicker.openPicker({
      cropperCircleOverlay: true,
      multiple: false,
      mediaType: 'photo',
      cropping: true,
      width: 1000, // Adjust this value
      height: 1000,
    })
      .then(image => {
        console.log('##', image);
        let name = image.path.split('/');
        const imageFormData = new FormData();
        let file = {
          uri: image.path,
          type: image.mime,
          name: name[name.length - 1],
        };
        imageFormData.append('file', file);
        imageFormData.append('type', 'account');

        return imageFormData;
      })
      .then(async imageFormData => {
        const response = await axios.post(
          `${Config.API_URL}/images/single`,
          imageFormData,
          {
            headers: {'Content-Type': 'multipart/form-data'},
            transformRequest: (data, headers) => {
              return data;
            },
          },
        );

        return response.data.data.files[0].fileUrl;
      })
      .then(async url => {
        const response = await axios.post(
          `${Config.API_URL}/accounts/me/image`,
          {
            profileImageUrl: url,
            headers: {'Content-Type': 'multipart/form-data'},
            transformRequest: (data, headers) => {
              return data;
            },
          },
        );

        // console.log(response.data.data.profileImageUrl);
        setProfileImg(response.data.data.profileImageUrl);
        setDeleteProfileImg(false);
      });
  };

  const deleteProfile = async () => {
    try {
      // setReset(!reset);
      const response2 = await axios.post(
        `${Config.API_URL}/accounts/me/image`,
        {
          profileImageUrl: null,
        },
      );
      const response = await axios.delete(
        `${Config.API_URL}/images/account?fileUrls=${profileImage}`,
      );
      console.log(response2.data);
      setProfileImg(response2.data.data.profileImageUrl);
      setDeleteProfileImg(false);

      // console.log('deleteimg')
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  return (
    <View style={styles.entire}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {/* image */}
        <View style={styles.statusView}>
          {profileImage == null ? (
            <SvgXml width={72} height={72} xml={svgXml.profile.null} />
          ) : (
            <View style={{width: 72, height: 72, borderRadius: 36}}>
              <ImageModal
                modalImageResizeMode="contain"
                swipeToDismiss={true}
                // resizeMode="contain"
                resizeMode="cover"
                imageBackgroundColor="transparent"
                overlayBackgroundColor="rgba(32, 32, 32, 0.9)"
                style={{width: 72, height: 72, borderRadius: 36}}
                source={{
                  uri: profileImage,
                }}
              />
            </View>
          )}
          <Pressable
            style={[styles.addProfileImgBtn, {backgroundColor: '#101010'}]}
            onPress={async () => {
              if (profileImage == null) await uploadProfileImage();
              else setDeleteProfileImg(true);
            }}>
            <SvgXml width={20} height={20} xml={svgXml.icon.photo} />
          </Pressable>
        </View>

        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingLeft: 20,
            flex: 1,
          }}>
          <View style={styles.nameView}>
            <Text style={styles.nameTxt} onPress={() => renameModal(true)}>
              {name}
            </Text>
            {(friendshipRelation == 'true' || friendshipRelation == 'me') && (
              <Pressable
                style={styles.changeNameBtn}
                onPress={() => renameModal(true)}>
                <MaterialCommunity
                  name="pencil-outline"
                  size={14}
                  color={'#888888'}
                />
              </Pressable>
            )}
          </View>

          <View style={styles.myCodeView}>
            <AnimatedButton
              style={styles.myCodeBtn}
              onPress={() => {
                Clipboard.setString(myCode);
                setWhichPopup('copyId');
              }}>
              <Text style={styles.myCodeTxt}>내 아이디: {myCode}</Text>
              <SvgXml
                width="15"
                height="15"
                xml={svgXml.icon.copyIcon}
                style={styles.copyIcon}
              />
            </AnimatedButton>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            height: 64,
          }}>
          <View
            style={{
              backgroundColor: '#202020',
              width: 54,
              height: 54,
              borderRadius: 27,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {status == 'work' && (
              <SvgXml width={36} height={36} xml={svgXml.status.work} />
            )}
            {status == 'study' && (
              <SvgXml width={36} height={36} xml={svgXml.status.study} />
            )}
            {status == 'transport' && (
              <SvgXml width={36} height={36} xml={svgXml.status.transport} />
            )}
            {status == 'eat' && (
              <SvgXml width={36} height={36} xml={svgXml.status.eat} />
            )}
            {status == 'workout' && (
              <SvgXml width={36} height={36} xml={svgXml.status.workout} />
            )}
            {status == 'walk' && (
              <SvgXml width={36} height={36} xml={svgXml.status.walk} />
            )}
            {status == 'sleep' && (
              <SvgXml width={36} height={36} xml={svgXml.status.sleep} />
            )}
            {status == 'smile' && (
              <SvgXml width={36} height={36} xml={svgXml.status.smile} />
            )}
            {status == 'happy' && (
              <SvgXml width={36} height={36} xml={svgXml.status.happy} />
            )}
            {status == 'sad' && (
              <SvgXml width={36} height={36} xml={svgXml.status.sad} />
            )}
            {status == 'mad' && (
              <SvgXml width={36} height={36} xml={svgXml.status.mad} />
            )}
            {status == 'panic' && (
              <SvgXml width={36} height={36} xml={svgXml.status.panic} />
            )}
            {status == 'exhausted' && (
              <SvgXml width={36} height={36} xml={svgXml.status.exhausted} />
            )}
            {status == 'excited' && (
              <SvgXml width={36} height={36} xml={svgXml.status.excited} />
            )}
            {status == 'sick' && (
              <SvgXml width={36} height={36} xml={svgXml.status.sick} />
            )}
            {status == 'vacation' && (
              <SvgXml width={36} height={36} xml={svgXml.status.vacation} />
            )}
            {status == 'date' && (
              <SvgXml width={36} height={36} xml={svgXml.status.date} />
            )}
            {status == 'computer' && (
              <SvgXml width={36} height={36} xml={svgXml.status.computer} />
            )}
            {status == 'cafe' && (
              <SvgXml width={36} height={36} xml={svgXml.status.cafe} />
            )}
            {status == 'movie' && (
              <SvgXml width={36} height={36} xml={svgXml.status.movie} />
            )}
            {status == 'read' && (
              <SvgXml width={36} height={36} xml={svgXml.status.read} />
            )}
            {status == 'alcohol' && (
              <SvgXml width={36} height={36} xml={svgXml.status.alcohol} />
            )}
            {status == 'music' && (
              <SvgXml width={36} height={36} xml={svgXml.status.music} />
            )}
            {status == 'birthday' && (
              <SvgXml width={36} height={36} xml={svgXml.status.birthday} />
            )}
          </View>
          <View
            style={{
              backgroundColor: '#101010',
              width: 42,
              height: 17,
              borderRadius: 10,
              position: 'absolute',
              top: 47,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#A55FFF', fontSize: 11, fontWeight: '500'}}>
              {'1시간'}
            </Text>
          </View>
        </View>
      </View>
      {/* modal for deleting profileimg */}
      <Modal
        isVisible={deleteProfileImg}
        onBackButtonPress={() => setDeleteProfileImg(false)}
        backdropColor="#101010"
        backdropOpacity={0.5}>
        <Pressable
          style={styles.modalBGView}
          onPress={() => {
            setDeleteProfileImg(false);
          }}>
          <View style={styles.modalView}>
            <Pressable
              style={styles.modalBtn}
              onPress={async () => await uploadProfileImage()}>
              <Text style={styles.modalTitleTxt}>갤러리에서 사진 선택하기</Text>
            </Pressable>
            <Pressable style={styles.modalBtn} onPress={() => deleteProfile()}>
              <Text style={styles.modalTitleTxt}>사진 삭제하기</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusView: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  statusBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    width: '100%',
    borderRadius: 30,
  },
  nameView: {
    flexDirection: 'row',
    // marginTop: 16,
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  nameTxt: {
    color: '#F0F0F0',
    fontWeight: '600',
    fontSize: 22,
    marginRight: 2,
    // marginLeft: 16,
  },
  addProfileImgBtn: {
    position: 'absolute',
    width: 28,
    height: 28,
    bottom: 0,
    right: -8,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBGView: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingBottom: 10,
  },
  modalView: {
    backgroundColor: '#333333',
    borderRadius: 10,
    width: '100%',
    padding: 10,
  },
  modalBtn: {
    margin: 10,
  },
  modalTitleTxt: {
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '600',
  },
  changeNameBtn: {},
  myCodeView: {},
  myCodeTxt: {
    color: '#848484',
    fontSize: 13,
    fontWeight: '500',
  },
  myCodeBtn: {
    flexDirection: 'row',
  },
  copyIcon: {
    marginLeft: 4,
    height: 14,
    top: 1,
  },
});
