import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function Setting() {
  return (
    <View style={styles.entire}>
      <Pressable style={styles.settingBtn}>
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
    paddingTop:10,
    paddingHorizontal:20,
  },
  settingBtn:{
    width:'100%',
    marginBottom:20
  },
  settingBtnTxt:{
    color:'#222222',
    fontWeight:'600',
    fontSize:15
  },
});