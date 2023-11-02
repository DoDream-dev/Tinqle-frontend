import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useAppDispatch } from '../store';
import userSlice from '../slices/user';
import axios, {AxiosError} from 'axios';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../AppInner";
import Config from 'react-native-config';
import EncryptedStorage from "react-native-encrypted-storage";
import { useNavigation } from "@react-navigation/native";

export default function Setting() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  const LogOut = async () => {
    try {
        const response = await axios.post(`${Config.API_URL}/auth/logout`,);
        // console.log(response.data);
      if (response.data.data.isLogout) {
        await EncryptedStorage.removeItem('refreshToken')
        dispatch(
          userSlice.actions.setToken({
            accessToken: '',
          }),
        );
        navigation.navigate('SignIn')
      }
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data)
      if (errorResponse?.data.status == 500) {
        dispatch(
          userSlice.actions.setToken({
            accessToken:'',
          }),
        );
      }
    }
  };

  const deleteImsi = async () => {
    try {
      const response = await axios.post(`${Config.API_URL}/test/account/`,);
      console.log(response.data);
      await EncryptedStorage.removeItem('refreshToken')
      dispatch(
        userSlice.actions.setToken({
          accessToken: '',
        }),
      );
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
      {/* <Pressable style={styles.settingBtn}>
        <Text style={styles.settingBtnTxt}>계정 삭제</Text>
      </Pressable> */}
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