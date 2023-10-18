// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// @ts-ignore
import { SliderBox } from 'react-native-image-slider-box'
import React from "react";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../AppInner";
import { useNavigation } from "@react-navigation/native";
type ContentProps = {
  nickname:string;
  status:string;
  content:string;
  createdAt:string;
  accountId:number;
  mine:boolean;
  imageURL:string[]|null[];
  detail:boolean;
  cmt:boolean;
  child:React.Dispatch<React.SetStateAction<number>>;
  cmtId:number;
  // navigation:NativeStackNavigationProp<RootStackParamList>
}
// type ContentScreenProps = NativeStackScreenProps<RootStackParamList, 'Content'>;
export default function Content( props:ContentProps){
  const nickname = props.nickname;
  const status = props.status;
  const content = props.content;
  const createdAt = props.createdAt;
  const accountId = props.accountId;
  const imageURL = props.imageURL;
  const cmt = props.cmt;
  const child = props.child;
  const cmtId = props.cmtId;
  let mine = 0;
  if (!props.mine) mine = 1;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.entire}>
      <View style={styles.statusView}>
        <Pressable onPress={()=>{console.log(1111); navigation.navigate('Profile', {whose:mine, accountId:accountId}); }}>
          {status == 'smile'.toUpperCase() && <Image style={{height:32, width:32}} source={require('../../assets/image/status01smile.png')}/>}
          {status == 'happy'.toUpperCase() && <Image style={{height:32, width:32}} source={require('../../assets/image/status02happy.png')}/>}
          {status == 'sad'.toUpperCase() && <Image style={{height:32, width:32}} source={require('../../assets/image/status03sad.png')}/>}
          {status == 'mad'.toUpperCase() && <Image style={{height:32, width:32}} source={require('../../assets/image/status04mad.png')}/>}
          {status == 'exhausted'.toUpperCase() && <Image style={{height:32, width:32}} source={require('../../assets/image/status05exhausted.png')}/>}
          {status == 'coffee'.toUpperCase() && <Image style={{height:32, width:32}} source={require('../../assets/image/status06coffee.png')}/>}
          {status == 'meal'.toUpperCase() && <Image style={{height:32, width:32}} source={require('../../assets/image/status07meal.png')}/>}
          {status == 'alcohol'.toUpperCase() && <Image style={{height:32, width:32}} source={require('../../assets/image/status08alcohol.png')}/>}
          {status == 'chicken'.toUpperCase() && <Image style={{height:32, width:32}} source={require('../../assets/image/status09chicken.png')}/>}
          {status == 'sleep'.toUpperCase() && <Image style={{height:32, width:32}} source={require('../../assets/image/status10sleep.png')}/>}
          {status == 'work'.toUpperCase() && <Image style={{height:32, width:32}} source={require('../../assets/image/status11work.png')}/>}
          {status == 'study'.toUpperCase() && <Image style={{height:32, width:32}} source={require('../../assets/image/status12study.png')}/>}
          {status == 'movie'.toUpperCase() && <Image style={{height:32, width:32}} source={require('../../assets/image/status13movie.png')}/>}
          {status == 'move'.toUpperCase() && <Image style={{height:32, width:32}} source={require('../../assets/image/status14move.png')}/>}
          {status == 'dance'.toUpperCase() && <Image style={{height:32, width:32}} source={require('../../assets/image/status15dance.png')}/>}
          {status == 'read'.toUpperCase() && <Image style={{height:32, width:32}} source={require('../../assets/image/status16read.png')}/>}
          {status == 'walk'.toUpperCase() && <Image style={{height:32, width:32}} source={require('../../assets/image/status17walk.png')}/>}
          {status == 'travel'.toUpperCase() && <Image style={{height:32, width:32}} source={require('../../assets/image/status18travel.png')}/>}
        </Pressable>
      </View>
      <View style={styles.contentView}>
        <View style={styles.txtView}>
          <Pressable onPress={()=>navigation.navigate('Profile', {whose:mine, accountId:accountId})}>
            <Text style={styles.nickname}>{nickname}</Text>
          </Pressable>
          <Text style={styles.createdAt}>{createdAt}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.contentTxt}>{content}</Text>
          {/* {imageURL.flatMap(f => !!f ? [f] : []).length != 0 && <SliderBox 
            images={imageURL}
            sliderBoxHeight={283}
            parentWidth={283}
          />} */}
          {imageURL.flatMap(f => !!f ? [f] : []).length != 0 && <Image
            source={{uri:imageURL[0]}}
          />}
        </View>
        {cmt && <Pressable style={styles.recomment} onPress={()=>child(cmtId)}>
          <Text style={styles.recommentTxt}>대댓글 쓰기</Text>
        </Pressable>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entire:{
    flexDirection:'row',
    padding:16,
  },
  entireCmt:{
    flexDirection:'row',
    padding:16,
    borderBottomWidth:1,
    borderBottomColor:'#ECECEC',
    // backgroundColor:'pink'
  },
  statusView:{
  },
  contentView:{
    flex:1,
    paddingLeft:8
  },
  txtView:{
    flexDirection:'row',
    justifyContent:'space-between'
  },
  nickname:{
    fontSize:15,
    fontWeight:'600',
    color:'#222222'
  },
  createdAt:{
    fontWeight:'500',
    fontSize:12,
    color:'#848484'
  },
  content:{
    justifyContent:'center',
    alignItems:'flex-start',
    marginTop:4
  },
  contentTxt:{
    fontWeight:'400',
    fontSize:15,
    color:'#222222',
    // includeFontPadding:true
    // paddingBottom:5

  },
  recomment:{
    marginTop:8,
    // marginBottom:8
  },
  recommentTxt:{
    color:'#848484',
    fontSize:12,
    fontWeight:'500'
  },
})