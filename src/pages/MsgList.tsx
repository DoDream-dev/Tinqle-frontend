import React, { useCallback, useEffect, useState } from 'react';
import {View, Text, StyleSheet, FlatList, Pressable, Image} from 'react-native';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import userSlice from '../slices/user';
import {useAppDispatch} from '../store';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/image/svgXml';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import {useFocusEffect} from '@react-navigation/native';
import {NoteStackParamList} from '../navigations/NoteNavigation';
import FriendProfileModal from '../components/FriendProfileModal';

type itemProps = {
  item: {
    roomId: number;
    accountId: number;
    content: string;
    messageCreatedAt: string;
    nickname: string;
    profileImageUrl: string | null;
    status: string;
    unreadCount: number;
  };
};

type MsgListScreenProps = NativeStackScreenProps<RootStackParamList, 'MsgList'>;

export default function MsgList({navigation, route}: MsgListScreenProps) {
  const [empty, setEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [cursorId, setCursorId] = useState(0);
  const [msgData, setMsgData] = useState([]);
  const [showWhoseModal, setShowWhoseModal] = useState(0);

  const dispatch = useAppDispatch();

  const getNoteContent = async () => {
    try {
      const response = await axios.get(`${Config.API_URL}/rooms`);
      console.log(response.data.data);
      if (response.data.data.length == 0) {
        setEmpty(true);
      } else {
        // setIsLast(response.data.data.last);
        // setMsgData(response.data.data.content);
        setMsgData(response.data.data);
        setEmpty(false);
        // setCursorId(
        //   response.data.data.content[response.data.data.content.length - 1]
        //     .messageBoxId,
        // );
      }
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
      if (errorResponse?.data.status == 500) {
        dispatch(
          userSlice.actions.setToken({
            accessToken: '',
          }),
        );
      }
    }
  };

  useEffect(() => {
    const focus = navigation.addListener('focus', () => {
      getNoteContent();
      console.log('focused');
    });
  }, []);

  // const getData = async () => {
  //   if (!isLast) {
  //     setLoading(true);
  //     try {
  //       const response = await axios.get(
  //         `${Config.API_URL}/rooms?cursorId=${cursorId}`,
  //       );
  //       setIsLast(response.data.data.last);
  //       setMsgData(msgData.concat(response.data.data.content));
  //       if (response.data.data.content.length != 0) {
  //         setCursorId(
  //           response.data.data.content[response.data.data.content.length - 1]
  //             .messageBoxId,
  //         );
  //       }
  //     } catch (error) {
  //       const errorResponse = (error as AxiosError<{message: string}>).response;
  //       console.log(errorResponse.data);
  //     }
  //   }
  //   setLoading(false);
  // };
  // const onEndReached = () => {
  //   if (!loading) {
  //     getData();
  //   }
  // };

  return (
    <View style={styles.entire}>
      {empty && (
        <View style={styles.emptyView}>
          <Text style={styles.emptyViewTxt}>
            친구의 프로필에서 대화를 시작해 보세요!
          </Text>
        </View>
      )}
      {empty && <View style={styles.emptyViewDown}></View>}
      {!empty && (
        <FlatList
          data={msgData.filter(element => element !== undefined)}
          style={styles.messageView}
          // onEndReached={onEndReached}
          // onEndReachedThreshold={0.4}
          renderItem={({item}: itemProps) => {
            // console.log(item, index);
            console.log(msgData);
            // const newmsg = item.unreadCount != 0;
            // if (item != undefined)
            return (
              <Pressable
                style={[
                  styles.eachMsg,
                  item.unreadCount != 0 && {backgroundColor: '#A55FFF4D'},
                ]}
                onPress={() => {
                  navigation.navigate('MsgDetail', {roomId: item.roomId});
                }}>
                <Pressable style={styles.mainView}>
                  <Pressable
                    style={styles.profileView}
                    onPress={() => {
                      setShowWhoseModal(item.accountId);
                    }}>
                    {item.profileImageUrl == null ? (
                      <SvgXml
                        width={32}
                        height={32}
                        xml={svgXml.profile.null}
                      />
                    ) : (
                      <Image
                        source={{uri: item.profileImageUrl}}
                        style={{width: 32, height: 32, borderRadius: 16}}
                      />
                    )}
                    <Text
                      style={
                        item.unreadCount != 0
                          ? styles.profileTxtBold
                          : styles.profileTxt
                      }>
                      {item.nickname}
                    </Text>
                    <SvgXml
                      width={18}
                      height={18}
                      xml={svgXml.status[`${item.status}`.toLowerCase()]}
                    />
                  </Pressable>
                  <Text
                    numberOfLines={1}
                    style={
                      item.unreadCount != 0
                        ? styles.msgContentBold
                        : styles.msgContent
                    }>
                    {item.content}
                  </Text>
                  {item.unreadCount != 0 && (
                    <View style={styles.msgCnt}>
                      <Text style={styles.msgCntTxt}>{item.unreadCount}</Text>
                    </View>
                  )}
                </Pressable>
                <View style={styles.subView}>
                  <Text
                    style={
                      item.unreadCount != 0
                        ? styles.createdAtBold
                        : styles.createdAt
                    }>
                    {item.messageCreatedAt}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />
      )}
      <FriendProfileModal
        showWhoseModal={showWhoseModal}
        setShowWhoseModal={setShowWhoseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#202020',
    flex: 1,
  },
  emptyView: {
    flex: 3,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  emptyViewDown: {
    flex: 4,
  },
  emptyViewTxt: {
    fontWeight: '500',
    fontSize: 13,
    color: '#888888',
  },
  messageView: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  eachMsg: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',

    paddingVertical: 12,
  },
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 190,
  },
  profileView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  profileTxt: {
    marginLeft: 8,
    marginRight: 3,
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '500',
    maxWidth: 102,
  },
  profileTxtBold: {
    marginLeft: 8,
    marginRight: 3,
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '600',
    maxWidth: 102,
  },
  msgContent: {
    color: '#888888',
    fontSize: 15,
    fontWeight: '500',
  },
  msgContentBold: {
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '600',
  },
  subView: {
    flexDirection: 'row',
  },
  msgCnt: {
    borderRadius: 20,
    backgroundColor: '#A55FFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginHorizontal: 8,
  },
  msgCntTxt: {
    color: '#F0F0F0',
    fontSize: 13,
    fontWeight: '500',
  },
  createdAt: {
    color: '#888888',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 2,
  },
  createdAtBold: {
    color: '#F0F0F0',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 10,
  },
});