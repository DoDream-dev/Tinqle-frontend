import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Emoticons from "./Emoticons";

type ContentFeedBottomProps = {
    mine:boolean;
    detail:boolean;
    heartEmoticonNicknameList:string[];
    smileEmoticonNicknameList:string[];
    sadEmoticonNicknameList:string[];
    surpriseEmoticonNicknameList:string[];
}
export default function ContentFeedBottom(props:ContentFeedBottomProps){
    const mine = props.mine;
    const detail = props.detail;
    const heartEmoticonNicknameList = props.heartEmoticonNicknameList;
    const heartEmoticonCount = heartEmoticonNicknameList.length;
    const smileEmoticonNicknameList = props.smileEmoticonNicknameList;
    const smileEmoticonCount = smileEmoticonNicknameList.length;
    const sadEmoticonNicknameList = props.sadEmoticonNicknameList;
    const sadEmoticonCount = sadEmoticonNicknameList.length;
    const surpriseEmoticonNicknameList = props.surpriseEmoticonNicknameList;
    const surpriseEmoticonCount = surpriseEmoticonNicknameList.length;
    
    const emotionData = {
        heart:{pressed:false, count:heartEmoticonCount}, // pressed: NicknameList에 자기가 있는지 확인
        smile:{pressed:false, count:smileEmoticonCount},
        sad:{pressed:false, count:sadEmoticonCount},
        surprise:{pressed:false, count:surpriseEmoticonCount}
    }
    return (
        <View style={styles.entire}>
            {detail && <View></View>}
            <Emoticons mine={mine} emotionData={emotionData} />
            {mine && <View><Text>Mine</Text></View>}
        </View>
    );

}

const styles = StyleSheet.create({
    entire:{
        flex:1,
        backgroundColor:'skyblue'
    },
})