// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// @ts-ignore
import { SliderBox } from 'react-native-image-slider-box'
import React from "react";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../AppInner";
import { useNavigation } from "@react-navigation/native";
import { svgXml } from '../../assets/image/svgXml';
import { SvgXml } from 'react-native-svg';
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
          {status == 'smile'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.smile} />}
          {status == 'happy'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.happy} />}
          {status == 'sad'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.sad} />}
          {status == 'mad'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.mad} />}
          {status == 'exhausted'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.exhauseted} />}
          {status == 'coffee'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.coffee} />}
          {status == 'meal'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.meal} />}
          {status == 'alcohol'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.alcohol} />}
          {status == 'chicken'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.chicken} />}
          {status == 'sleep'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.sleep} />}
          {status == 'work'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.work} />}
          {status == 'study'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.study} />}
          {status == 'movie'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.movie} />}
          {status == 'move'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.move} />}
          {status == 'dance'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.dance} />}
          {status == 'read'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.read} />}
          {status == 'walk'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.walk} />}
          {status == 'travel'.toUpperCase() && <SvgXml width={32} height={32} xml={svgXml.status.travel} />}
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