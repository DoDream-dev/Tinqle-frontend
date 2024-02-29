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
import StatucIcon from './StatusIcon';
import _ from 'lodash';
import {throttleTime, throttleTimeEmoticon} from '../hooks/Throttle';

type ProfileProps = {
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  profileImg: string | null;
  setProfileImg: React.Dispatch<React.SetStateAction<string>>;
  renameModal: React.Dispatch<React.SetStateAction<boolean>>;
  friendshipRelation: string;
  myCode: string;
  setWhichPopup: React.Dispatch<React.SetStateAction<string>>;
};

export default function Profile(props: ProfileProps) {
  const status = props.status;
  const setStatus = props.setStatus;
  const profileImage = props.profileImg;
  const setProfileImg = props.setProfileImg;
  const name = props.name;
  const renameModal = props.renameModal;
  const friendshipRelation = props.friendshipRelation;
  const myCode = props.myCode;
  const setWhichPopup = props.setWhichPopup;
  // const imsi = true; // 상태변화없나?
  const statusSizeModal = 48;
  const [deleteProfileImg, setDeleteProfileImg] = useState(false);
  const [changeStatus, setChangeStatus] = useState(false);
  const [time, setTime] = useState('');
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

  const postStatus = _.throttle(async (stat: string) => {
    if (stat == status) {
      return;
    } else {
      try {
        const response = await axios.put(
          `${Config.API_URL}/accounts/me/status/${stat.toUpperCase()}`,
        );
        setStatus(response.data.status);
        setTime('방금');
        // setRefresh(!refresh);
        // console.log(response.data)
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.log(errorResponse);
      }
    }
  }, throttleTimeEmoticon);

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

        <Pressable onPress={() => setChangeStatus(true)}>
          <StatucIcon status={status} time={time} />
        </Pressable>
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

      <Modal
        isVisible={changeStatus}
        backdropColor="#101010"
        backdropOpacity={0.9}
        swipeDirection={['down', 'left', 'right', 'up']}
        onSwipeComplete={() => setChangeStatus(false)}
        onBackButtonPress={() => setChangeStatus(false)}>
        <Pressable
          style={styles.modalBGView2}
          onPress={() => {
            setChangeStatus(false);
          }}>
          <Pressable
            onPress={e => e.stopPropagation()}
            style={styles.modalView2}>
            <View style={styles.statusViewHeader}>
              <Text style={styles.statusViewHeaderTxt}>지금 나는...</Text>
              <Pressable
                onPress={() => setChangeStatus(false)}
                style={styles.statusViewHeaderXBtn}>
                <SvgXml width={26} height={26} xml={svgXml.icon.close} />
              </Pressable>
            </View>
            <View style={styles.statusView}>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('work');
                }}
                style={
                  status == 'work' ? styles.statusSelected : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.work}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('study');
                }}
                style={
                  status == 'study'
                    ? styles.statusSelected
                    : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.study}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('transport');
                }}
                style={
                  status == 'transport'
                    ? styles.statusSelected
                    : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.transport}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('eat');
                }}
                style={
                  status == 'eat' ? styles.statusSelected : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.eat}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('workout');
                }}
                style={
                  status == 'workout'
                    ? styles.statusSelected
                    : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.workout}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('walk');
                }}
                style={
                  status == 'walk' ? styles.statusSelected : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.walk}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('sleep');
                }}
                style={
                  status == 'sleep'
                    ? styles.statusSelected
                    : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.sleep}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('smile');
                }}
                style={
                  status == 'smile'
                    ? styles.statusSelected
                    : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.smile}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('happy');
                }}
                style={
                  status == 'happy'
                    ? styles.statusSelected
                    : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.happy}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('sad');
                }}
                style={
                  status == 'sad' ? styles.statusSelected : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.sad}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('mad');
                }}
                style={
                  status == 'mad' ? styles.statusSelected : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.mad}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('panic');
                }}
                style={
                  status == 'panic'
                    ? styles.statusSelected
                    : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.panic}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('exhausted');
                }}
                style={
                  status == 'exhausted'
                    ? styles.statusSelected
                    : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.exhausted}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('excited');
                }}
                style={
                  status == 'excited'
                    ? styles.statusSelected
                    : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.excited}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('sick');
                }}
                style={
                  status == 'sick' ? styles.statusSelected : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.sick}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('vacation');
                }}
                style={
                  status == 'vacation'
                    ? styles.statusSelected
                    : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.vacation}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('date');
                }}
                style={
                  status == 'date' ? styles.statusSelected : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.date}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('computer');
                }}
                style={
                  status == 'computer'
                    ? styles.statusSelected
                    : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.computer}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('cafe');
                }}
                style={
                  status == 'cafe' ? styles.statusSelected : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.cafe}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('movie');
                }}
                style={
                  status == 'movie'
                    ? styles.statusSelected
                    : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.movie}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('read');
                }}
                style={
                  status == 'read' ? styles.statusSelected : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.read}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('alcohol');
                }}
                style={
                  status == 'alcohol'
                    ? styles.statusSelected
                    : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.alcohol}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('music');
                }}
                style={
                  status == 'music'
                    ? styles.statusSelected
                    : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.music}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setChangeStatus(false);
                  postStatus('birthday');
                }}
                style={
                  status == 'birthday'
                    ? styles.statusSelected
                    : styles.statusSelect
                }>
                <SvgXml
                  width={statusSizeModal}
                  height={statusSizeModal}
                  xml={svgXml.status.birthday}
                />
              </Pressable>
            </View>
          </Pressable>
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
  modalBGView2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView2: {
    backgroundColor: '#333333',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A45FFF',
    width: 327,
    // width: '100%',
    // height: 580,
    // marginHorizontal: 24,
    alignItems: 'center',
    padding: 16,
    paddingBottom: 28,
    position: 'relative',
  },
  statusView: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    // paddingHorizontal:10,
    justifyContent: 'center',
  },
  statusViewHeader: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusViewHeaderTxt: {
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '600',
    marginVertical: 16,
  },
  statusViewHeaderXBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  statusSelect: {
    borderRadius: 10,
    width: 60,
    height: 54,
    backgroundColor: '#202020',
    marginBottom: 4,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusSelected: {
    borderRadius: 10,
    width: 60,
    height: 54,
    backgroundColor: '#A55FFF',
    marginHorizontal: 4,
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
