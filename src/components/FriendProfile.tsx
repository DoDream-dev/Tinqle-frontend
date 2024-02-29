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
export default function FriendProfile(props: ProfileProps) {
  const status = props.status;
  const profileImage = props.profileImg;
  const name = props.name;
  const renameModal = props.renameModal;
  const friendshipRelation = props.friendshipRelation;
  // const imsi = true; // 상태변화없나?

  return (
    <View style={styles.entire}>
      <View style={styles.statusView}>
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
        <Pressable
          style={[styles.addProfileImgBtn, {backgroundColor: '#202020'}]}>
          {status == 'work' && (
            <SvgXml width={23} height={23} xml={svgXml.status.work} />
          )}
          {status == 'study' && (
            <SvgXml width={23} height={23} xml={svgXml.status.study} />
          )}
          {status == 'transport' && (
            <SvgXml width={23} height={23} xml={svgXml.status.transport} />
          )}
          {status == 'eat' && (
            <SvgXml width={23} height={23} xml={svgXml.status.eat} />
          )}
          {status == 'workout' && (
            <SvgXml width={23} height={23} xml={svgXml.status.workout} />
          )}
          {status == 'walk' && (
            <SvgXml width={23} height={23} xml={svgXml.status.walk} />
          )}
          {status == 'sleep' && (
            <SvgXml width={23} height={23} xml={svgXml.status.sleep} />
          )}
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
          {status == 'panic' && (
            <SvgXml width={23} height={23} xml={svgXml.status.panic} />
          )}
          {status == 'exhausted' && (
            <SvgXml width={23} height={23} xml={svgXml.status.exhausted} />
          )}
          {status == 'excited' && (
            <SvgXml width={23} height={23} xml={svgXml.status.excited} />
          )}
          {status == 'sick' && (
            <SvgXml width={23} height={23} xml={svgXml.status.sick} />
          )}
          {status == 'vacation' && (
            <SvgXml width={23} height={23} xml={svgXml.status.vacation} />
          )}
          {status == 'date' && (
            <SvgXml width={23} height={23} xml={svgXml.status.date} />
          )}
          {status == 'computer' && (
            <SvgXml width={23} height={23} xml={svgXml.status.computer} />
          )}
          {status == 'cafe' && (
            <SvgXml width={23} height={23} xml={svgXml.status.cafe} />
          )}
          {status == 'movie' && (
            <SvgXml width={23} height={23} xml={svgXml.status.movie} />
          )}
          {status == 'read' && (
            <SvgXml width={23} height={23} xml={svgXml.status.read} />
          )}
          {status == 'alcohol' && (
            <SvgXml width={23} height={23} xml={svgXml.status.alcohol} />
          )}
          {status == 'music' && (
            <SvgXml width={23} height={23} xml={svgXml.status.music} />
          )}
          {status == 'birthday' && (
            <SvgXml width={23} height={23} xml={svgXml.status.birthday} />
          )}
        </Pressable>
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
    width: 30,
    height: 30,
    bottom: 0,
    right: 0,
    borderRadius: 15,
    padding: 3,
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
});
