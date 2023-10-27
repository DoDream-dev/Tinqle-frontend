import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function Notis() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [allRead, setAllRead] = useState(true);
  return (
    <View style={styles.entire}>
      <View style={styles.notisHeader}>
        <Text style={styles.notisHeaderTxt}>알림</Text>
        <Pressable onPress={()=>setIsEnabled(!isEnabled)} style={[styles.toggleView, isEnabled?{backgroundColor:'#FFB443'}:{backgroundColor:'#B7B7B7'}]}>
          {isEnabled && <Text style={styles.toggleActiveTxt}>ON</Text>}
          {isEnabled && <View style={styles.toggleActiveCircle}></View>}
          {!isEnabled && <View style={styles.toggleInactiveCircle}></View>}
          {!isEnabled && <Text style={styles.toggleInactiveTxt}>OFF</Text>}
        </Pressable>
      </View>
      {allRead && <View style={styles.empty}>
        <View style={styles.emptyUp}></View>
        <View style={styles.emptyDown}>
          <Text style={styles.emptyTxt}>알림을 다 읽었어요</Text>
        </View>
      </View>}
      {!allRead && <View></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:'#F7F7F7'
  },
  notisHeader:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center',
    paddingRight:16,
    height:40,
    backgroundColor:'#FFFFFF'
  },
  notisHeaderTxt:{
    color:'#848484',
    fontWeight:'500',
    fontSize:12,
    marginRight:3
  },
  toggleView:{
    width:48,
    height:20,
    borderRadius:10,
    paddingHorizontal:2,
    paddingVertical:3,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  toggleActiveTxt:{
    color:'#FFFFFF',
    fontSize:12,
    fontWeight:'500',
    marginLeft:6,
    marginRight:4,
    top:-2
  },
  toggleActiveCircle:{
    width:16,
    height:16,
    borderRadius:8,
    backgroundColor:'#FFFFFF',
  },
  toggleInactiveTxt:{
    color:'#FFFFFF',
    fontSize:12,
    fontWeight:'500',
    marginLeft:6,
    marginRight:6,
    top:-2
  },
  toggleInactiveCircle:{
    width:14,
    height:16,
    borderRadius:8,
    backgroundColor:'transparent',
  },
  empty:{
    flex:1, 
    width:'100%'
  },
  emptyUp:{
    flex:3,
    width:'100%',
  },
  emptyDown:{
    flex:5,
    width:'100%',
    alignItems:'center'
  },
  emptyTxt:{
    color:'#848484',
    fontSize:12,
    fontWeight:'500',
    textAlign:'center'
  },
});