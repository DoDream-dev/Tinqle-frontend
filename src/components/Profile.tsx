import React, { useState } from "react";
import { StyleSheet, Text, Pressable, View, Image } from "react-native";
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import { svgXml } from '../../assets/image/svgXml';
import { SvgXml } from 'react-native-svg'
type ProfileProps = {
  status:string;
  name:string;
  profileImg:string | null;
  restatusModal:React.Dispatch<React.SetStateAction<boolean>>;
  renameModal:React.Dispatch<React.SetStateAction<boolean>>;
}
export default function Profile(props:ProfileProps){
  const status = props.status;
  const profileImage = props.profileImg;
  const name = props.name;
  const restatusModal = props.restatusModal;
  const renameModal = props.renameModal;
  const imsi = true; // 상태변화없나?

  // const [chageName, setChangeName] = useState(false);
  // const [changeStatus, setChangeStatus] = useState(false);

  return (
    <View style={styles.entire}>
      <View style={styles.statusView}>
        {/* <Pressable style={styles.statusBtn} disabled={imsi} onPress={()=>restatusModal(true)}>
          {status == 'smile' && <SvgXml width={90} height={90} xml={svgXml.status.smile} />}
          {status == 'happy' && <SvgXml width={90} height={90} xml={svgXml.status.happy} />}
          {status == 'sad' && <SvgXml width={90} height={90} xml={svgXml.status.sad} />}
          {status == 'mad' && <SvgXml width={90} height={90} xml={svgXml.status.mad} />}
          {status == 'exhausted' && <SvgXml width={90} height={90} xml={svgXml.status.exhauseted} />}
          {status == 'coffee' && <SvgXml width={90} height={90} xml={svgXml.status.coffee} />}
          {status == 'meal' && <SvgXml width={90} height={90} xml={svgXml.status.meal} />}
          {status == 'alcohol' && <SvgXml width={90} height={90} xml={svgXml.status.alcohol} />}
          {status == 'chicken' && <SvgXml width={90} height={90} xml={svgXml.status.chicken} />}
          {status == 'sleep' && <SvgXml width={90} height={90} xml={svgXml.status.sleep} />}
          {status == 'work' && <SvgXml width={90} height={90} xml={svgXml.status.work} />}
          {status == 'study' && <SvgXml width={90} height={90} xml={svgXml.status.study} />}
          {status == 'movie' && <SvgXml width={90} height={90} xml={svgXml.status.movie} />}
          {status == 'move' && <SvgXml width={90} height={90} xml={svgXml.status.move} />}
          {status == 'dance' && <SvgXml width={90} height={90} xml={svgXml.status.dance} />}
          {status == 'read' && <SvgXml width={90} height={90} xml={svgXml.status.read} />}
          {status == 'walk' && <SvgXml width={90} height={90} xml={svgXml.status.walk} />}
          {status == 'travel' && <SvgXml width={90} height={90} xml={svgXml.status.travel} />}
        </Pressable> */}
        {profileImage == null 
        ? <SvgXml width={90} height={90} xml={svgXml.profile.null} />
        : <Image
          source={{uri:profileImage}} style={{width:90, height:90, borderRadius:45}}
        />}
      </View>
      <View style={styles.nameView}>
        <Text style={styles.nameTxt} onPress={()=>renameModal(true)}>{name}</Text>
        <Pressable style={styles.changeNameBtn} onPress={()=>renameModal(true)}>
          <MaterialCommunity name='pencil-outline' size={14} color={'#888888'} />
        </Pressable>
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  entire:{
    alignItems:'center'
  },
  statusView:{
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBtn:{
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#F7F7F7',
    width: '100%',
    borderRadius: 30,
  },
  nameView:{
    flexDirection: 'row',
    marginTop:16,
    marginBottom:8,
    justifyContent:'center',
    alignItems:'baseline',
  },
  nameTxt:{
    color:'#F0F0F0',
    fontWeight: '600',
    fontSize:22,
    marginRight:2,
    marginLeft:16
  },
  changeNameBtn:{
  },
})