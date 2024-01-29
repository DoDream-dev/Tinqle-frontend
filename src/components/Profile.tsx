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

type ProfileProps = {
  status: string;
  name: string;
  profileImg: string | null;
  setProfileImg: React.Dispatch<React.SetStateAction<string | null>>;
  renameModal: React.Dispatch<React.SetStateAction<boolean>>;
  friendshipRelation: string;
};
export default function Profile(props: ProfileProps) {
  const status = props.status;
  const profileImage = props.profileImg;
  const setProfileImg = props.setProfileImg;
  const name = props.name;
  const renameModal = props.renameModal;
  const friendshipRelation = props.friendshipRelation;
  const imsi = true; // 상태변화없나?

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
      <View style={styles.statusView}>
        {/* <Pressable style={styles.statusBtn} disabled={imsi} onPress={()=>restatusModal(true)}>
          {status == 'smile' && <SvgXml width={90} height={90} xml={svgXml.status.smile} />}
          {status == 'happy' && <SvgXml width={90} height={90} xml={svgXml.status.happy} />}
          {status == 'sad' && <SvgXml width={90} height={90} xml={svgXml.status.sad} />}
          {status == 'mad' && <SvgXml width={90} height={90} xml={svgXml.status.mad} />}
          {status == 'exhausted' && <SvgXml width={90} height={90} xml={svgXml.status.exhauseted} />}
          {status == 'coffee' && <SvgXml width={90} height={90} xml={svgXml.status.coffee} />}
          {status == 'meal' && <SvgXml width={90} height={90} xml={svgXml.status.meal} />}
          {status == 'alcohol' && <SvgXml width={90} height={90} xml={svgXml.status.alcohol} />}
          {status == 'chicken' && <SvgXml width={90} height={90} xml={svgXml.status.chicken} />}
          {status == 'sleep' && <SvgXml width={90} height={90} xml={svgXml.status.sleep} />}
          {status == 'work' && <SvgXml width={90} height={90} xml={svgXml.status.work} />}
          {status == 'study' && <SvgXml width={90} height={90} xml={svgXml.status.study} />}
          {status == 'movie' && <SvgXml width={90} height={90} xml={svgXml.status.movie} />}
          {status == 'move' && <SvgXml width={90} height={90} xml={svgXml.status.move} />}
          {status == 'dance' && <SvgXml width={90} height={90} xml={svgXml.status.dance} />}
          {status == 'read' && <SvgXml width={90} height={90} xml={svgXml.status.read} />}
          {status == 'walk' && <SvgXml width={90} height={90} xml={svgXml.status.walk} />}
          {status == 'travel' && <SvgXml width={90} height={90} xml={svgXml.status.travel} />}
        </Pressable> */}
        {profileImage == null ? (
          <SvgXml width={120} height={120} xml={svgXml.profile.null} />
        ) : (
          <View style={{width: 120, height: 120, borderRadius: 60}}>
            <ImageModal
              modalImageResizeMode="contain"
              swipeToDismiss={true}
              // resizeMode="contain"
              resizeMode="cover"
              imageBackgroundColor="transparent"
              overlayBackgroundColor="rgba(32, 32, 32, 0.9)"
              style={{width: 120, height: 120, borderRadius: 60}}
              source={{
                uri: profileImage,
              }}
            />
          </View>
        )}
        {friendshipRelation == 'me' ? (
          <Pressable
            style={[styles.addProfileImgBtn, {backgroundColor:'#101010'}]}
            onPress={async () => {
              if (profileImage == null) await uploadProfileImage();
              else setDeleteProfileImg(true);
            }}>
            <SvgXml width={24} height={24} xml={svgXml.icon.photo} />
          </Pressable>
        ) : (
          <Pressable
            style={[styles.addProfileImgBtn, {backgroundColor:'#202020'}]}>
            {status == 'smile' && (
              <SvgXml width={23} height={23} xml={svgXml.status.smile} />
            )}
            {status == 'happy' && (
              <SvgXml width={23} height={23} xml={svgXml.status.happy} />
            )}
            {status == 'sad' && (
              <SvgXml width={23} height={23} xml={svgXml.status.sad} />
            )}
            {status == 'mad' && (
              <SvgXml width={23} height={23} xml={svgXml.status.mad} />
            )}
            {status == 'exhausted' && (
              <SvgXml
                width={23}
                height={23}
                xml={svgXml.status.exhauseted}
              />
            )}
            {status == 'coffee' && (
              <SvgXml width={23} height={23} xml={svgXml.status.coffee} />
            )}
            {status == 'meal' && (
              <SvgXml width={23} height={23} xml={svgXml.status.meal} />
            )}
            {status == 'alcohol' && (
              <SvgXml width={23} height={23} xml={svgXml.status.alcohol} />
            )}
            {status == 'chicken' && (
              <SvgXml width={23} height={23} xml={svgXml.status.chicken} />
            )}
            {status == 'sleep' && (
              <SvgXml width={23} height={23} xml={svgXml.status.sleep} />
            )}
            {status == 'work' && (
              <SvgXml width={23} height={23} xml={svgXml.status.work} />
            )}
            {status == 'study' && (
              <SvgXml width={23} height={23} xml={svgXml.status.study} />
            )}
            {status == 'movie' && (
              <SvgXml width={23} height={23} xml={svgXml.status.movie} />
            )}
            {status == 'move' && (
              <SvgXml width={23} height={23} xml={svgXml.status.move} />
            )}
            {status == 'dance' && (
              <SvgXml width={23} height={23} xml={svgXml.status.dance} />
            )}
            {status == 'read' && (
              <SvgXml width={23} height={23} xml={svgXml.status.read} />
            )}
            {status == 'walk' && (
              <SvgXml width={23} height={23} xml={svgXml.status.walk} />
            )}
            {status == 'travel' && (
              <SvgXml width={23} height={23} xml={svgXml.status.travel} />
            )}
          </Pressable>
        )}
      </View>
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
  },
  statusView: {
    width: 120,
    height: 120,
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
    marginTop: 16,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  nameTxt: {
    color: '#F0F0F0',
    fontWeight: '600',
    fontSize: 22,
    marginRight: 2,
    marginLeft: 16,
  },
  addProfileImgBtn: {
    position: 'absolute',
    width:30,
    height:30,
    bottom: 0,
    right: 0,
    borderRadius: 15,
    padding: 3,
    justifyContent:'center',
    alignItems:'center'
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
});
