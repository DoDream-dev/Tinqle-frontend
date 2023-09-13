import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ContentFeedBotoom from "./ContentFeedBottom";

type FeedProps = {
    mine:boolean;
    detail:boolean;
    heartEmoticonNicknameList:string[];
    smileEmoticonNicknameList:string[];
    sadEmoticonNicknameList:string[];
    surpriseEmoticonNicknameList:string[];
}
export default function Feed(props:FeedProps){
    const mine = props.mine;
    const detail = props.detail;
    const heartEmoticonNicknameList = props.heartEmoticonNicknameList;
    const smileEmoticonNicknameList = props.smileEmoticonNicknameList;
    const sadEmoticonNicknameList = props.sadEmoticonNicknameList;
    const surpriseEmoticonNicknameList = props.surpriseEmoticonNicknameList;

    return (
        <View style={styles.entrie}>
            <View><Text>Content</Text></View>
            <ContentFeedBotoom 
                mine={mine}
                detail={detail}
                heartEmoticonNicknameList={heartEmoticonNicknameList}
                smileEmoticonNicknameList={smileEmoticonNicknameList}
                sadEmoticonNicknameList={sadEmoticonNicknameList}
                surpriseEmoticonNicknameList={surpriseEmoticonNicknameList}
            />
        </View>
    );

}

const styles = StyleSheet.create({
    entrie:{
        flex:1,
        backgroundColor:'pink'
    },
})