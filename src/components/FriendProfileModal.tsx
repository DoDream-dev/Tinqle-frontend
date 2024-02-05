/* eslint-disable react/self-closing-comp */
import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  View,
  Keyboard,
  TextInput,
  Dimensions,
  useWindowDimensions,
  Platform,
} from 'react-native';
import axios, {AxiosError} from 'axios';
import Modal from 'react-native-modal';
import Config from 'react-native-config';
import Profile from './Profile';
import _ from 'lodash';
import AnimatedButton from './AnimatedButton';
import {SvgXml} from 'react-native-svg';
import {svgXml} from '../../assets/image/svgXml';
import {throttleTime} from '../hooks/Throttle';
import ToastScreen from './ToastScreen';
import {AugmentedAIRuntime} from 'aws-sdk';

type ProfileProps = {
  showWhoseModal: number;
  setShowWhoseModal: React.Dispatch<React.SetStateAction<number>>;
};

export default function FriendProfileModal(props: ProfileProps) {
  const showWhoseModal = props.showWhoseModal;
  const setShowWhoseModal = props.setShowWhoseModal;

  const [chageName, setChangeName] = useState(false);
  const [chageNameVal, setChangeNameVal] = useState('');
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const [friendshipRelation, setFriendshipRelation] = useState('');
  const [friendshipId, setFriendshipId] = useState(-1);
  const [friendshipRequestId, setFriendshipRequestId] = useState(0);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [whichPopup, setWhichPopup] = useState('');
  const [deleteFriend, setDeleteFriend] = useState(false);
  const [blockFriend, setBlockFriend] = useState(false);
  const [settingModal, setSettingModal] = useState(false);

  const inp1 = useRef();

  useEffect(() => {
    setTimeout(() => {
      getProfile();
    }, 1000);
  }, [friendshipRelation, name]);

  const getProfile = async () => {
    try {
      const response = await axios.get(
        `${Config.API_URL}/accounts/${showWhoseModal}/profile`,
      );
      console.log(response.data.data);
      setName(response.data.data.nickname);
      setChangeNameVal(response.data.data.nickname);
      setStatus(response.data.data.status.toLowerCase());
      setProfileImg(response.data.data.profileImageUrl);
      setFriendshipRelation(response.data.data.friendshipRelation);
      setFriendshipId(response.data.data.friendshipId);
      setFriendshipRequestId(response.data.data.friendshipRequestId);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  const rename = _.throttle(async (text: string, accountId: number) => {
    if (text === name) {
      setChangeName(false);
      setChangeNameVal(text);
      return;
    }
    try {
      const response = await axios.post(
        `${Config.API_URL}/friendships/nickname/change`,
        {
          friendAccountId: accountId,
          nickname: text,
        },
      );
      setName(response.data.data.friendNickname);
      setChangeNameVal(response.data.data.friendNickname);
      setChangeName(false);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  }, throttleTime);

  const askFriend = useCallback(
    (accountId: number, name: string, profileImageUrl: string) => {
      const ask = _.throttle(async () => {
        try {
          const response = await axios.post(
            `${Config.API_URL}/friendships/request`,
            {
              accountTargetId: accountId,
              message: '',
            },
          );
          // console.log(response.data)
          // popup: 이도님께 친구 요청을 보냈어요!
          setWhichPopup('askFriend');
          setFriendshipRelation('waiiting');
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>)
            .response;
          console.log(errorResponse.data);
          // if (errorResponse?.data.statusCode == 1000) {
          //   // if (await refreshOrNot()) setReset(!reset);
          // }
          // if (errorResponse?.data.statusCode == 3010) {
          //   setWhichPopup('requested');
          //   setOtherUser({accountId:-1, nickname:'', isFriend:0});
          //   setMessage('');
          // }
        }
      }, throttleTime);
      ask();
    },
    [friendshipId],
  );

  const sendWhatAreYouDoing = useCallback(async () => {
    const ask = _.throttle(async () => {
      //code
      const response = await axios
        .post(`${Config.API_URL}/knocks/send`, {
          targetAccountId: showWhoseModal,
        })
        .then(res => {
          console.log('sendWhatAreYouDoing', res.data);

          setWhichPopup('whatAreYouDoing');
        });
    }, throttleTime);
    await ask();
  }, [showWhoseModal]);

  const approveFriendship = async (friendshipRequestId: number) => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/friendships/request/${friendshipRequestId}/approval`,
      );
      console.log(response.data);
      setWhichPopup('getFriend');
      setFriendshipRelation('true');
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  const lastFocus = () => {
    if (Platform.OS === 'android' && inp1.current) {
      const length = chageNameVal.length;
      inp1.current.setSelection(length, length);
    }
  };

  const deleteFriends = async () => {
    try {
      // console.log(friendshipId);
      const response = await axios.delete(
        `${Config.API_URL}/friendships/${friendshipId}`,
      );
      getProfile();
      setWhichPopup('deletedFriend');
      // setPopupName(name);
      setDeleteFriend(false);
      // setShowWhoseModal(0);
      setSettingModal(false);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  const blockFriends = async () => {
    try {
      // console.log(friendshipId);
      const response = await axios.post(
        `${Config.API_URL}/blocks/${showWhoseModal}`,
      );
      getProfile();
      setWhichPopup('blockFriend');

      setBlockFriend(false);
      // setShowWhoseModal(0);
      setSettingModal(false);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      console.log(errorResponse.data);
    }
  };

  return (
    <Modal
      isVisible={showWhoseModal != 0 && showWhoseModal != undefined}
      onModalWillShow={getProfile}
      hasBackdrop={true}
      onBackdropPress={() => setShowWhoseModal(0)}
      // coverScreen={false}
      onBackButtonPress={() => setShowWhoseModal(0)}
      onModalHide={() => {
        setWhichPopup('');
      }}>
      <View style={styles.entire}>
        {/* <Pressable style={styles.xBtn} onPress={()=>setShowWhoseModal(0)}>
        <Text style={styles.btnTxt}>x</Text>
      </Pressable> */}

        {friendshipRelation == 'true' ? (
          <AnimatedButton
            style={styles.settingButton}
            onPress={() => {
              // console.log('setting');
              setSettingModal(true);
            }}>
            <SvgXml
              fill={'#888888'}
              width={24}
              height={24}
              xml={svgXml.icon.settings}
            />
          </AnimatedButton>
        ) : null}

        <View style={styles.profileView}>
          <Profile
            name={name}
            status={status}
            profileImg={profileImg}
            setProfileImg={setProfileImg}
            renameModal={setChangeName}
            friendshipRelation={friendshipRelation}
          />
        </View>

        <View style={styles.btnView}>
          {/* 여기에 friendshipId 필요 */}
          {friendshipRelation == 'true' && (
            <>
              <Pressable
                style={styles.btn}
                onPress={async () => {
                  console.log('1:1 대화 기능 넣어야함');
                }}>
                <Text style={styles.btnTxt}>대화 하기</Text>
              </Pressable>

              <View style={{width: 8}}></View>

              <Pressable
                style={styles.btn}
                onPress={async () => await sendWhatAreYouDoing()}>
                <Text style={styles.btnTxt}>지금 뭐해?</Text>
              </Pressable>
            </>
          )}

          {friendshipRelation == 'false' && (
            <Pressable
              style={styles.btn}
              onPress={() => askFriend(showWhoseModal, name, profileImg)}>
              <Text style={styles.btnTxt}>친구 요청하기</Text>
            </Pressable>
          )}
          {friendshipRelation == 'waiting' && (
            <Pressable style={styles.btnGray}>
              <Text style={styles.btnTxt}>친구 요청됨</Text>
            </Pressable>
          )}
          {friendshipRelation == 'request' && (
            <Pressable
              style={styles.btn}
              onPress={() => approveFriendship(friendshipRequestId)}>
              <Text style={styles.btnTxt}>친구 요청 수락하기</Text>
            </Pressable>
          )}
        </View>

        <Modal
          isVisible={chageName}
          onBackButtonPress={() => setChangeName(false)}
          avoidKeyboard={true}
          backdropColor="#222222"
          backdropOpacity={0.5}
          onModalShow={() => {
            if (Platform.OS === 'android') {
              inp1.current.focus();
            }
          }}>
          <Pressable
            style={styles.modalBGView}
            onPress={() => {
              setChangeName(false);
              Keyboard.dismiss();
            }}>
            <Pressable
              style={styles.modalView}
              onPress={e => e.stopPropagation()}>
              <Text style={styles.modalTitleTxt}>친구 이름 바꾸기</Text>
              <View style={styles.changeView}>
                <TextInput
                  ref={inp1}
                  style={styles.nameChangeTxtInput}
                  onChangeText={(text: string) => {
                    setChangeNameVal(text);
                  }}
                  blurOnSubmit={true}
                  maxLength={15}
                  value={chageNameVal}
                  autoFocus={Platform.OS === 'ios' ? true : false}
                  onFocus={lastFocus}
                  onSubmitEditing={() => {
                    rename(chageNameVal.trim(), showWhoseModal);
                  }}
                />
              </View>
              <View style={styles.modalBtnView}>
                <Pressable
                  style={styles.btnGray}
                  onPress={() => {
                    setChangeName(false);
                    setChangeNameVal(name);
                  }}>
                  <Text style={styles.btnTxt}>취소</Text>
                </Pressable>
                <View style={{width: 8}}></View>
                <Pressable
                  style={styles.btn}
                  disabled={chageNameVal.trim() == ''}
                  onPress={() => {
                    if (chageNameVal != '') {
                      if (chageNameVal == name) {
                        setChangeName(false);
                      } else {
                        rename(chageNameVal.trim(), showWhoseModal);
                      }
                    }
                  }}>
                  <Text style={styles.btnTxt}>완료</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        <View
          style={{
            bottom: -(useWindowDimensions().height / 2 - 310 / 2),
            alignItems: 'center',
          }}>
          {whichPopup == 'whatAreYouDoing' && (
            <ToastScreen
              height={21}
              marginBottom={48}
              onClose={() => setWhichPopup('')}
              message={`${name}님에게 지금 뭐해?를 보냈어요.`}
            />
          )}
          {whichPopup == 'askFriend' && (
            <ToastScreen
              height={21}
              marginBottom={48}
              onClose={() => setWhichPopup('')}
              message={`${name}님에게 친구 요청을 보냈어요!`}
            />
          )}
          {whichPopup == 'getFriend' && (
            <ToastScreen
              height={21}
              marginBottom={48}
              onClose={() => setWhichPopup('')}
              message={`${name}님과 친구가 되었어요.`}
            />
          )}
          {whichPopup == 'blockFriend' && (
            <ToastScreen
              height={21}
              marginBottom={48}
              onClose={() => setWhichPopup('')}
              message={`${name}님을 차단했어요.`}
            />
          )}
        </View>

        <Modal
          isVisible={settingModal}
          onBackButtonPress={() => setSettingModal(false)}
          avoidKeyboard={true}
          onBackdropPress={() => setSettingModal(false)}
          backdropOpacity={0.3}>
          <View style={styles.settingModal}>
            <AnimatedButton
              style={styles.settingModalButton}
              onPress={() => {
                setDeleteFriend(true);
              }}>
              <Text style={styles.settingButtonText}>친구 삭제하기</Text>
            </AnimatedButton>
            <AnimatedButton
              style={styles.settingModalButton}
              onPress={() => {
                setBlockFriend(true);
              }}>
              <Text style={styles.settingButtonText}>친구 차단하기</Text>
            </AnimatedButton>

            {/* modal for delete */}
            <Modal
              isVisible={deleteFriend}
              backdropOpacity={0}
              hasBackdrop={true}
              onBackdropPress={() => setDeleteFriend(false)}
              onBackButtonPress={() => setDeleteFriend(false)}>
              {/* <View style={styles.modalBGView}>   */}
              <View style={styles.modalView}>
                <Text style={styles.modalTitleTxt}>친구를 삭제하시겠어요?</Text>
                <Text style={styles.modalContentTxt}>
                  {
                    '친구를 삭제하면 서로의 친구 관계가 끊겨요.\n친구를 삭제해도 상대방에게 알림은 가지 않아요.'
                  }
                </Text>
                <View style={styles.btnView}>
                  <Pressable
                    style={styles.btnGray}
                    onPress={() => {
                      setDeleteFriend(false);
                    }}>
                    <Text style={styles.btnTxt}>취소</Text>
                  </Pressable>
                  <View style={{width: 8}}></View>
                  <Pressable
                    style={styles.btn}
                    onPress={() => {
                      deleteFriends();
                    }}>
                    <Text style={styles.btnTxt}>네, 삭제할게요.</Text>
                  </Pressable>
                </View>
              </View>
              {/* </View> */}
            </Modal>

            {/* modal for block */}
            <Modal
              isVisible={blockFriend}
              backdropOpacity={0}
              hasBackdrop={true}
              onBackdropPress={() => setBlockFriend(false)}
              onBackButtonPress={() => setBlockFriend(false)}>
              {/* <View style={styles.modalBGView}>   */}
              <View style={styles.modalView}>
                <Text style={styles.modalTitleTxt}>친구를 차단하시겠어요?</Text>
                <Text style={styles.modalContentTxt}>
                  {
                    '친구를 차단하면 서로의 친구 관계가 끊기고, 상대방이 내게 친구 요청을 하더라도 알림이 오지 않아요. 내가 상대방에게 친구 요청을 보내면 차단이 해제돼요.'
                  }
                </Text>
                <View style={styles.btnView}>
                  <Pressable
                    style={styles.btnGray}
                    onPress={() => {
                      setBlockFriend(false);
                    }}>
                    <Text style={styles.btnTxt}>취소</Text>
                  </Pressable>
                  <View style={{width: 8}}></View>
                  <Pressable
                    style={styles.btn}
                    onPress={() => {
                      blockFriends();
                    }}>
                    <Text style={styles.btnTxt}>네, 차단할게요.</Text>
                  </Pressable>
                </View>
              </View>
              {/* </View> */}
            </Modal>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  entire: {
    position: 'relative',
    marginHorizontal: 36,
    backgroundColor: '#333333',
    paddingVertical: 40,
    justifyContent: 'center',
    borderRadius: 10,
  },
  profileView: {
    justifyContent: 'center',
    // backgroundColor: 'blue',
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
    marginTop: 16,
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 13,
    backgroundColor: '#A55FFF',
  },
  btnGray: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 13,
    backgroundColor: '#888888',
  },
  btnTxt: {
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '600',
  },
  modalBGView: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
  },
  modalView: {
    backgroundColor: '#333333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  modalTitleTxt: {
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  changeView: {
    width: '100%',
    flexDirection: 'row',
  },
  modalBtnView: {
    flexDirection: 'row',
    width: '100%',
  },
  nameChangeTxtInput: {
    width: '100%',
    fontSize: 15,
    fontWeight: '400',
    color: '#F0F0F0',
    borderRadius: 5,
    backgroundColor: '#202020',
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  modalContentTxt: {
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center',
  },
  settingButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    // backgroundColor: 'blue',
  },
  settingModal: {padding: 10, backgroundColor: '#333333', borderRadius: 10},
  settingModalButton: {padding: 10},
  settingButtonText: {color: '#F0F0F0', fontSize: 15},
});
