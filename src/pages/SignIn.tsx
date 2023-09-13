import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function SignIn() {
    return (
        <View style={styles.entire}>
            <View style={styles.logoView}>
                <Text style={styles.logoTxt}>내 친구는 지금 뭐할까?</Text>
                <Text style={styles.logoTxtMain}>tinqle</Text>
            </View>
            <View style={styles.loginView}>
                <Pressable style={styles.loginBtnGoogle}>
                    <Text style={styles.loginBtnTxtGoogle}>Google로 계속하기</Text>
                </Pressable>
                <Pressable style={styles.loginBtnKakao}>
                    <Text style={styles.loginBtnTxtKakao}>카카오로 계속하기</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    entire: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    logoView:{
        flex:5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoTxt:{
        color: '#000000',
        fontWeight: '500',
        fontSize: 15
    },
    logoTxtMain:{
        color: '#FFB443'
    },
    loginView:{
        flex:1,
        width:'100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    loginBtnGoogle:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 7,
        backgroundColor: 'gray',
        width: '80%',
        borderRadius: 5,
    },
    loginBtnKakao:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FEE500',
        width: '80%',
        borderRadius: 5,

    },
    loginBtnTxtGoogle:{
        color: '#757575',
        fontWeight: '500',
        fontSize: 15,

    },
    loginBtnTxtKakao:{
        color: '#181600',
        fontWeight: '500',
        fontSize: 15,
    },
});