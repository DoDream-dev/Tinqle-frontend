import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import AnimatedButton from './AnimatedButton';
import Modal from 'react-native-modal';
import {Safe, windowHeight, windowWidth} from './Safe';

type EnlargeImageModalProps = {
  imageUrl: string;
  showModal: boolean;
  onCloseModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EnlargeImageModal({
  imageUrl,
  showModal,
  onCloseModal,
}: EnlargeImageModalProps) {
  useFocusEffect(
    useCallback(() => {
      console.log('EnlargeImageModal focus', imageUrl);
    }, []),
  );

  return (
    <Modal
      // avoidKeyboard
      presentationStyle={'overFullScreen'}
      isVisible={showModal}
      backdropOpacity={0}
      backdropColor="white"
      style={styles.entire} // 이 부분이 추가되었습니다.
      animationIn="slideInUp" // 이 부분이 추가되었습니다.
      animationOut="slideOutDown" // 이 부분이 추가되었습니다.
    >
      {/* <View style={styles.entire}> */}
      <Safe color="pink">
        <AnimatedButton
          style={styles.closeBtn}
          onPress={() => {
            onCloseModal(false);
          }}>
          <Feather name="x" size={24} color={'#222222'} />
        </AnimatedButton>
        <View style={styles.empty}>
          <Text style={styles.emptyTxt}>{'route.params'}</Text>
        </View>
      </Safe>
      {/* </View> */}
    </Modal>
  );
}

const styles = StyleSheet.create({
  entire: {
    // flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
  },
  empty: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTxt: {
    color: '#888888',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  closeBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 8,
    zIndex: 1,
    padding: 8,
    // backgroundColor: 'red',
  },
});
