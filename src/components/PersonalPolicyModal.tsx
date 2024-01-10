import React from 'react';
import {StyleSheet, Text, ScrollView, View} from 'react-native';
import Modal from 'react-native-modal';
import {Safe} from './Safe';
import AnimatedButton from '../components/AnimatedButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type PolicyProps = {
  policy: string;
  setPolicy: React.Dispatch<React.SetStateAction<string>>;
};

export default function PersonalPolicyModal(props: PolicyProps) {
  const policy = props.policy;
  const setPolicy = props.setPolicy;

  return (
    <Modal
      isVisible={policy == 'personal'}
      hasBackdrop={false}
      onBackButtonPress={() => setPolicy('')}
      style={{margin: 0}}>
      <Safe color="white">
        <ScrollView style={styles.policyentire}>
          <Text style={styles.policyheader}>개인정보처리방침</Text>
          <Text style={styles.policyBody}>
            {`본 개인정보처리방침은 '팅클' 앱 서비스를 이용하는 사용자의 개인정보를 어떻게 수집, 사용, 공유, 보호하는지에 대한 정보를 포함하고 있습니다.`.replace(
              / /g,
              '\u00A0',
            )}
          </Text>
          <View style={styles.policyBox}>
            <Text style={styles.policyHead}>
              {`1. 개인정보 수집 목적`.replace(/ /g, '\u00A0')}
            </Text>
            <Text style={styles.policyBody}>
              {`수집된 개인정보는 다음의 목적으로만 사용됩니다.
∙ 회원 관리: 회원 가입 및 탈퇴 처리, 서비스 이용에 따른 사용자 식별, 서비스 제공
∙ 커뮤니케이션: 이메일을 통한 서비스 공지 및 소식 전달
서비스 개선 및 마케팅 활용: 사용자 경험 향상을 위한 정보 활용, 접속 빈도 파악 또는 사용자의 서비스 이용에 대한 통계`.replace(
                / /g,
                '\u00A0',
              )}
            </Text>
          </View>
          <View style={styles.policyBox}>
            <Text style={styles.policyHead}>
              {`2. 수집하는 개인정보`.replace(/ /g, '\u00A0')}
            </Text>
            <Text style={styles.policyBody}>
              {`팅클은 원활한 서비스 제공을 위해 회원가입 및 서비스 이용과정에서 아래와 같은 사용자의 개인정보를 수집합니다.
∙ 닉네임(이름), 사용자 UUID
∙ 푸시 알림 시 기기 식별을 위한 FCM 토큰
각 항목 또는 추가적으로 수집이 필요한 개인정보 및 개인정보를 포함한 자료를 이용자 응대 과정에서 서비스 내부 알림 수단 등을 통해 별도의 동의 절차를 거쳐 요청‧수집될 수 있습니다.

만 14세 미만 아동의 개인정보 처리: 팅클은 법정대리인의 동의가 필요한 만 14세 미만 아동에 대한 정보를 수집 및 이용하지 않습니다.`.replace(
                / /g,
                '\u00A0',
              )}
            </Text>
          </View>
          <View style={styles.policyBox}>
            <Text style={styles.policyHead}>
              {`3. 개인정보 수집 방법`.replace(/ /g, '\u00A0')}
            </Text>
            <Text style={styles.policyBody}>
              {`팅클에서 수집 및 이용하는 개인정보는 다음과 같은 방법으로 수집하고 있습니다.
∙ 회원가입 및 서비스 이용 과정에서 이용자가 개인정보 수집에 대해 동의하고 직접 정보를 입력하는 경우
∙ 서비스 이용과정에서 이용자로부터 수집하는 경우`.replace(/ /g, '\u00A0')}
            </Text>
          </View>
          <View style={styles.policyBox}>
            <Text style={styles.policyHead}>
              {`4. 개인정보 보관 기간 및 파기`.replace(/ /g, '\u00A0')}
            </Text>
            <Text style={styles.policyBody}>
              {`사용자의 개인정보는 수집 및 이용 목적이 달성되면(서비스 이용계약 종료, 철회 요청) 지체 없이 파기합니다. 다만, 팅클의 내부 방침 또는 관계 법령에서 정한 보관 기간이 있을 경우 일정 기간 동안 보관 후 파기됩니다.

장기 미이용 사용자에 대한 조치: 팅클은 팅클의 서비스를 1년간 이용하지 않은 사용자의 개인정보를 별도로 분리 보관 또는 삭제하고 있으며, 분리 보관된 개인정보는 최대 4년간 보관 후 지체 없이 파기합니다.`.replace(
                / /g,
                '\u00A0',
              )}
            </Text>
          </View>
          <View style={styles.policyBox}>
            <Text style={styles.policyHead}>
              {`5. 개인정보의 제3자 제공`.replace(/ /g, '\u00A0')}
            </Text>
            <Text style={styles.policyBody}>
              {`팅클은 사용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.
∙ 사용자가 사전에 동의한 경우
∙ 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
팅클은 사용자의 동의 없이 사용자의 정보를 외부 업체에 위탁하지 않습니다. 향후 그러한 필요가 생길 경우, 위탁 대상자와 위탁 업무 내용에 대해 사용자에게 통지하고 필요한 경우 사전 동의를 받겠습니다.`.replace(
                / /g,
                '\u00A0',
              )}
            </Text>
          </View>
          <View style={styles.policyBox}>
            <Text style={styles.policyHead}>
              {`6. 개인정보의 조회, 수정, 삭제`.replace(/ /g, '\u00A0')}
            </Text>
            <Text style={styles.policyBody}>
              {`사용자는 언제든지 아래의 경로를 통해 자신의 개인정보를 조회하거나 수정할 수 있고, 동의 철회(계정 삭제)를 요청할 수 있습니다.
∙ 개인정보 조회 및 변경: 내 프로필
∙ 동의 철회: 내 프로필 > 설정 > 계정 삭제
혹은 팅클에 문의하시면 지체 없이 조치해 드리도록 하겠습니다.`.replace(
                / /g,
                '\u00A0',
              )}
            </Text>
          </View>
          <View style={styles.policyBox}>
            <Text style={styles.policyHead}>
              {`7. 개인정보 침해 구제`.replace(/ /g, '\u00A0')}
            </Text>
            <Text style={styles.policyBody}>
              {`사용자가 서비스를 이용하면서 발생하는 모든 개인정보보호 관련 문의, 신고 및 기타 사항은 아래 연락처로 문의해 주시기 바랍니다. 팅클은 사용자의 목소리에 귀 기울이고 충분한 답변을 드릴 수 있도록 최선을 다하겠습니다.
∙ 이름: 장서연 (개인정보보호 책임자)
∙ 연락처: the.dodream.team@gmail.com
사용자는 개인정보 침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁 해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타 개인정보 침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.
1. 개인정보분쟁조정위원회 : (국번없이) 1833-6972 (www.kopico.go.kr)
2. 개인정보침해신고센터 : (국번없이) 118 (privacy.kisa.or.kr)
3. 대검찰청 : (국번없이) 1301 (www.spo.go.kr)
4. 경찰청 : (국번없이) 182 (ecrm.cyber.go.kr)
③ 「개인정보 보호법」 제35조(개인정보의 열람), 제36조(개인정보의 정정·삭제), 제37조(개인정보의 처리정지 등)의 규정에 의한 요구에 대하여 공공기관의 장이 행한 처분 또는 부작위로 인하여 권리 또는 이익의 침해를 받은 자는 행정심판법이 정하는 바에 따라 행정심판을 청구할 수 있습니다.
‣ 중앙행정심판위원회 : (국번없이) 110 (www.simpan.go.kr)`.replace(
                / /g,
                '\u00A0',
              )}
            </Text>
          </View>
          <View style={styles.policyBox}>
            <Text style={styles.policyHead}>
              {`8. 개인정보처리방침의 시행 및 변경`.replace(/ /g, '\u00A0')}
            </Text>
            <Text style={styles.policyBody}>
              {`이 개인정보처리방침은 2023년 11월 5일부터 시행됩니다. 이 방침은 법률이나 서비스 변경 사항을 반영하기 위한 목적 등으로 변경될 수 있습니다. 개인정보처리방침이 변경되는 경우 최소 7일 전부터 팅클 서비스 내 공지사항을 통해 고지해 드리도록 하겠습니다.`.replace(
                / /g,
                '\u00A0',
              )}
            </Text>
          </View>
          <View style={{height: 40}}></View>
        </ScrollView>
        {/* <AnimatedButton
          onPress={() => {
            setPolicy('');
          }}
          style={styles.closeButton}>
          <MaterialIcons name="close" size={40} color={'#848484'} />
        </AnimatedButton> */}
      </Safe>
    </Modal>
  );
}

const styles = StyleSheet.create({
  policyentire: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#202020',
  },
  policyheader: {
    color: '#F0F0F0',
    fontSize: 18,
    fontWeight: '600',
  },
  policyBox: {
    marginTop: 12,
    width: '100%',
  },
  policyHead: {
    color: '#F0F0F0',
    fontSize: 15,
    fontWeight: '500',
  },
  policyBody: {
    marginTop: 6,
    color: '#F0F0F0',
    fontSize: 13,
    fontWeight: '400',
  },
});
