import React from 'react';
import { View, Text, StyleSheet, Pressable, DevSettings } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducer';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from "react-native-encrypted-storage";

export default function Setting() {
  const token = useSelector((state:RootState) => state.user.accessToken);
  const LogOut = async () => {
    try {
        const response = await axios.post(`${Config.API_URL}/auth/logout`, {}, {
          headers:{Authorization: `Bearer ${token}`},
        });
        console.log(response.data);
      if (response.data.data.isLogout) {
        await EncryptedStorage.removeItem('refreshToken')
        DevSettings.reload();

      }
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data)
    }
  };
  return (
    <View style={styles.entire}>
      <Pressable style={styles.settingBtn} onPress={LogOut}>
        <Text style={styles.settingBtnTxt}>로그아웃</Text>
      </Pressable>
      <Pressable style={styles.settingBtn}>
        <Text style={styles.settingBtnTxt}>계정 삭제</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:'#FFFFFF',
  },
  settingBtn:{
    width:'100%',
    paddingHorizontal:20,
    paddingVertical:10,
  },
  settingBtnTxt:{
    color:'#222222',
    fontWeight:'600',
    fontSize:15
  },
});