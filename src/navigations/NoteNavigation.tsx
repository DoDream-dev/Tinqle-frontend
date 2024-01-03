import React, { useEffect, useState } from "react";
import { Pressable, View, Alert } from 'react-native';
import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";
import { SvgXml } from 'react-native-svg';
import { svgXml } from "../../assets/image/svgXml";
import AntDesign from 'react-native-vector-icons/AntDesign';

import NoteBox from "../pages/NoteBox";

export type NoteStackParamList = {
  NoteBox: undefined;
};

export type NoteStackNavigationProps = NativeStackNavigationProp<NoteStackParamList>;

const Stack = createNativeStackNavigator<NoteStackParamList>();

export default function NoteNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="NoteBox"
        component={NoteBox}
        options={({navigation}) => ({
          title:'익명 쪽지함',
          headerTitleAlign:'center',
          headerTitleStyle:{
            color:'#222222',
            fontSize:15,
            fontWeight:'600'
          },
          // headerLeft: () => (
          //   <Pressable onPress={()=>(navigation.goBack())}>
          //     <AntDesign name="arrowleft" size={24} color={'#848484'} />
          //   </Pressable>
          // ),
        })}
      />
    </Stack.Navigator>
  );
};