import React, { useEffect, useRef, useState } from "react";
import { Pressable, View, Alert, Text, StyleSheet, AppState } from 'react-native';
import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";
import { SvgXml } from 'react-native-svg';
import { svgXml } from "../../assets/image/svgXml";

import MsgList from "../pages/MsgList";
import MsgDetail from "../pages/MsgDetail";

export type NoteStackParamList = {
  MsgList: undefined;
  MsgDetail: {roomId:number};
};

export type NoteStackNavigationProps = NativeStackNavigationProp<NoteStackParamList>;

const Stack = createNativeStackNavigator<NoteStackParamList>();

export default function NoteNavigation() {
  // const appState = useRef(AppState.currentState);

  // useEffect(() => {
  //   // Function to run when the component mounts
  //   const onMount = () => {
  //     console.log('Component mounted');
  //   };

  //   // Function to run when the app state changes
  //   const handleAppStateChange = async nextAppState => {
  //     if (
  //       appState.current.match(/inactive|background/) 
  //     ) {
  //       console.log('App lost');

        
  //     }
  //     appState.current = nextAppState;
  //   };

  //   onMount();
  //   AppState.addEventListener('change', handleAppStateChange);
  // }, []);
  return (
    <Stack.Navigator initialRouteName="MsgList">
      <Stack.Screen
        name="MsgList"
        component={MsgList}
        options={({navigation}) => ({
          title: '대화',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: '#F0F0F0',
            fontSize: 15,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: '#202020',
          },
          headerShadowVisible: false,
        })}
      />
      <Stack.Screen
        name="MsgDetail"
        component={MsgDetail}
        options={({navigation}) => ({
          title: '김영서',
          headerTitleAlign: 'left',
          headerTitleStyle: {
            color: '#F0F0F0',
            fontSize: 15,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: '#202020',
          },
          headerShadowVisible: false,
          // header: ()=>(
          //   <View style={styles.MsgDetailHeader}>
          //     <View style={styles.MsgDetailHeaderLeft}>
          //       <Pressable onPress={()=>navigation.goBack()}>
          //         <SvgXml width={24} height={24} xml={svgXml.icon.goBack} />
          //       </Pressable>
          //       <Pressable style={styles.MsgDetailHeaderProfileView}>
          //         <SvgXml width={32} height={32} xml={svgXml.profile.null} />
          //         <Text style={styles.MsgDetailHeaderProfileTxt}>김영서</Text>
          //         <SvgXml width={18} height={18} xml={svgXml.status.chicken} />
          //       </Pressable>
          //     </View>
          //     <Pressable><Text style={styles.MsgDetailHeaderRightTxt}>나가기</Text></Pressable>
          //   </View>
          // ),
        })}
      />
    </Stack.Navigator>
  );
};