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

export default function ServicePolicyModal(props: PolicyProps) {
  const policy = props.policy;
  const setPolicy = props.setPolicy;

  return (
    <Modal
      isVisible={policy == 'service'}
      hasBackdrop={false}
      onBackButtonPress={() => setPolicy('')}
      style={{margin: 0}}>
      <Safe color="white">
        <ScrollView style={styles.policyentire}>
          <Text style={styles.policyheader}>서비스 이용약관</Text>
          <View style={styles.policyBox}>
            <Text style={styles.policyHead}>
              {`제1조. 목적`.replace(/ /g, '\u00A0')}
            </Text>
            <Text style={styles.policyBody}>
              {`이 약관은 팅클의 모든 서비스의 이용과 관련하여 팅클과 서비스 사용자(이하 “사용자")의 권리와 의무 등을 규정합니다. 사용자는 서비스를 이용함으로써 이 약관의 적용을 받는 것에 동의합니다.`.replace(
                / /g,
                '\u00A0',
              )}
            </Text>
          </View>
          <View style={styles.policyBox}>
            <Text style={styles.policyHead}>
              {`제2조. 용어의 정의`.replace(/ /g, '\u00A0')}
            </Text>
            <Text style={styles.policyBody}>
              {`이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
1. 사용자: 팅클 서비스를 이용하는 자
2. 게시물: 사용자가 서비스에 게시한 모든 글, 댓글, 쪽지, 사진 등
3. 관련법: 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 전기통신사업법, 개인정보보호법 등 관련 있는 국내 법령
제2조 및 이 약관에서 정의하지 않은 용어는 일반적인 이용 관행에 따릅니다.`.replace(
                / /g,
                '\u00A0',
              )}
            </Text>
          </View>
          <View style={styles.policyBox}>
            <Text style={styles.policyHead}>
              {`제3조. 약관의 게시와 수정`.replace(/ /g, '\u00A0')}
            </Text>
            <Text style={styles.policyBody}>
              {`팅클은 이 약관을 "서비스 이용약관" 메뉴에서 사용자에게 공지합니다. 팅클은 관련법을 준수하며, 이 약관을 변경할 수 있습니다. 변경된 약관은 "공지사항" 메뉴를 통해 공지합니다. 변경된 약관은 공지 후 7일이 지난 후부터 효력을 발휘합니다.

사용자는 이 약관의 일부만을 동의 또는 거부할 수 없으며, 변경된 약관에 동의하지 않으면 팅클 서비스 이용이 제한됩니다. 사용자가 변경된 약관에 이의를 제기하려면, 효력 발생일 이전에 팅클에 의견을 제출해야 합니다. 팅클에 의견이 접수되지 않으면 사용자가 변경된 약관에 동의한 것으로 간주됩니다. 사용자가 약관 변경 사실을 알지 못해 발생한 피해에 대해서는, 팅클은 고의 또는 중대한 과실이 없는 한 어떠한 책임도 지지 않습니다.`.replace(
                / /g,
                '\u00A0',
              )}
            </Text>
          </View>
          <View style={styles.policyBox}>
            <Text style={styles.policyHead}>
              {`제4조. 서비스 이용계약의 성립(회원가입)`.replace(
                / /g,
                '\u00A0',
              )}
            </Text>
            <Text style={styles.policyBody}>
              {`팅클과 사용자의 서비스 이용계약은 서비스에 계정을 생성함으로써 체결됩니다.
아래의 경우에 해당하면 팅클은 계정 생성을 승인하지 않거나, 계정이 생성된 이후에도 계정을 삭제 또는 중단할 수 있습니다.
∙ 가입 신청자가 만 14세 미만인 경우: 팅클은 만 14세 미만 사용자의 가입을 금지하고 있습니다. 가입 신청자는 서비스에 가입함으로써 본인이 만 14세 이상임을 진술하고 보증합니다.
∙ 과거에 운영원칙이나 법률 위반 등의 정당한 사유로 팅클이 계정을 삭제 또는 중단한 경우
∙ 팅클의 기술 및 설비 상 서비스를 제공할 수 없는 경우
∙ 기타 팅클이 합리적인 판단에 의하여 필요하다고 인정하는 경우`.replace(
                / /g,
                '\u00A0',
              )}
            </Text>
          </View>
          <View style={styles.policyBox}>
            <Text style={styles.policyHead}>
              {`제5조. 서비스 이용계약의 종료(회원탈퇴)`.replace(
                / /g,
                '\u00A0',
              )}
            </Text>
            <Text style={styles.policyBody}>
              {`  1. 사용자는 언제든지 앱 내의 “계정 삭제” 메뉴를 통해 이용계약의 해지를 요청할 수 있으며, 팅클은 요청을 지체 없이 처리합니다.
2. 이용계약이 해지되면 법령 및 개인정보처리방침에 따라 사용자 정보를 보유하는 경우를 제외하고는 사용자 정보가 삭제됩니다.
3. 계정 삭제로 인해 발생한 피해에 대해서는 팅클의 중대한 과실이 없는 한 팅클에서 책임지지 않습니다.`.replace(
                / /g,
                '\u00A0',
              )}
            </Text>
          </View>
          <View style={styles.policyBox}>
            <Text style={styles.policyHead}>
              {`제6조. 사용자의 의무`.replace(/ /g, '\u00A0')}
            </Text>
            <Text style={styles.policyBody}>
              {`사용자는 팅클의 서비스를 사용할 때 아래에 해당하는 행위를 하지 않아야 합니다.
∙ 회원가입 신청 또는 변경 시 허위 내용을 등록하는 행위
∙ 부정한 용도로 서비스를 사용하는 행위
∙ 법에 위반되거나 부정한 행위(명예훼손, 사칭, 해킹, 사생활 침해, 음란물 유포, 저작권 침해, 개인정보 유출, 성희롱, 위협 등)
∙ 관련 법령, 이 약관의 규정, 팅클의 공지사항 등 팅클이 통지하는 사항을 준수하지 않는 행위
∙ 팅클 서비스와 소프트웨어에 대한 동의 없는 복사, 수정, 배포, 판매, 양도, 대여, 담보 제공, 역설계, 소스 코드 추출 시도, 복제, 분해, 모방, 변형, 클라이언트 프로그램 변경, 서버 해킹, 정보 변경 행위를 포함한 팅클의 권한 없는 모든 행위
∙ 회사의 업무에 방해되는 행위 및 회사의 명예를 손상시키는 행위
사용자가 위에 명시한 행위 또는 이에 준하는 행위를 할 경우, 팅클은 서비스 보호를 위해 다음과 같은 조치를 최대 영구적으로 취할 수 있습니다.
∙ 사용자의 회원가입 거부 또는 이용계약의 해지
∙ 사용자의 서비스 이용 권한, 자격, 혜택 제한 및 회수
∙ 사용자의 게시물, 프로필, 이용 기록 등을 삭제, 중단, 수정, 변경
∙ 그 외 서비스의 정상적인 운영을 위해 팅클이 필요하다고 판단하는 조치`.replace(
                / /g,
                '\u00A0',
              )}
            </Text>
          </View>
          <View style={styles.policyBox}>
            <Text style={styles.policyHead}>
              {`제7조. 사용자 통지`.replace(/ /g, '\u00A0')}
            </Text>
            <Text style={styles.policyBody}>
              {`팅클은 사용자에게 통지할 사항이 있는 경우, 공지사항 메뉴에 게시합니다. 팅클은 사용자가 각 공지가 게시된 지 7일 이내에, 또는 각 공지별로 고지한 기간 내에 반대 의사를 표시하지 않을 경우 공지에 동의한 것으로 간주합니다. 사용자가 공지사항을 확인하지 않아 발생한 피해에 대해서는, 팅클은 고의 또는 중대한 과실이 없는 한 어떠한 책임도 지지 않습니다. 단, 사용자의 권리 및 의무에 중대한 영향을 미치는 사항에 대해서는 사용자의 개별 연락처나 내부 알림 수단을 통해 통지합니다.`.replace(
                / /g,
                '\u00A0',
              )}
            </Text>
          </View>
          <View style={styles.policyBox}>
            <Text style={styles.policyHead}>
              {`제8조. 책임 제한`.replace(/ /g, '\u00A0')}
            </Text>
            <Text style={styles.policyBody}>
              {`  ∙ 팅클 서비스는 있는 그대로 제공되며, 법령상 허용되는 한도 내에서 서비스와 관련하여 본 약관에 명시하지 않은 사항에 대한 약정이나 보증을 하지 않으며 이와 관련한 책임을 부인합니다.
∙ 팅클 서비스는 법령 내에서만 책임을 지며, 완전성, 정확성, 가용성, 안전성 등 어떠한 사항에 대한 책임을 부인합니다.
∙ 사용자가 본 서비스에 게시한 정보, 자료, 사실 등의 진실성, 정확성, 신뢰성은 회사가 보장하지 않습니다. 사용자가 게시한 자료와 그 활용으로 인해 야기되는 결과에 대해 팅클은 책임을 지지 않습니다.
∙ 팅클은 계정 삭제, 사용자의 기기 오류, 악성 프로그램, 사용자 간 분쟁, 또는 사용자의 귀책사유 등과 관련하여 발생한 손해, 서비스 변경 또는 중단에 대한 책임을 부인합니다.
∙ 팅클은 필요에 따라 서비스를 변경하거나 점검, 장애, 천재지변, 경영악화 등의 이유로 서비스 제공을 일시적으로 또는 영구적으로 중단할 수 있습니다.`.replace(
                / /g,
                '\u00A0',
              )}
            </Text>
          </View>
          <View style={styles.policyBox}>
            <Text style={styles.policyHead}>
              {`제9조. 저작권 및 라이선스`.replace(/ /g, '\u00A0')}
            </Text>
            <Text style={styles.policyBody}>
              {`사용자가 팅클 서비스 내에 게시한 게시물의 저작권은 해당 게시물의 저작자에게 귀속됩니다. 사용자가 서비스 내에 게시하는 게시물은 서비스 및 관련 프로모션, 광고 등에 노출될 수 있고, 필요한 범위 내에서 사용, 저장, 수정, 복제, 편집, 공중송신, 전시, 배포 등의 방식으로 해당 게시물을 이용할 수 있도록 허락하는 전 세계적인 라이선스를 팅클에게 제공하게 됩니다. 이 경우, 팅클은 저작권법 규정을 준수하며, 사용자는 언제든지 문의 창구를 통해 해당 게시물에 대해 삭제, 수정, 비공개 등의 조치를 요청할 수 있습니다.
팅클이 관련 법령에 따라 법률상 책임을 지는 경우를 제외하면, 사용자는 본 서비스의 이용과 사용자가 제공하는 콘텐츠(사용자의 콘텐츠가 관련 법률, 규정, 규칙을 준수하는지 포함)에 대하여 책임이 있습니다. 사용자는 본 서비스를 통해 게시되거나 사용자가 본 서비스를 통해 취득하는 모든 콘텐츠 또는 자료의 이용 또는 신뢰에 대한 위험을 스스로 부담합니다. 팅클은 본 서비스를 통해 게시되는 콘텐츠나 전달 사항의 완전성, 진실성, 정확성 또는 신뢰성을 지지, 지원, 대변 또는 보증하거나 본 서비스를 통해 표출된 어떠한 의견도 지지하지 않습니다. 모든 콘텐츠에 대한 책임은 해당 콘텐츠를 스스로 게시한 자가 전적으로 부담합니다. 팅클은 본 서비스를 통해 게시되는 콘텐츠를 감시하거나 통제하지 못할 수 있으며, 그러한 콘텐츠에 대해 팅클은 책임을 부담하지 않습니다.
팅클은 서비스의 일환으로 사용자에게 소프트웨어를 이용할 수 있는 비독점적인 라이선스를 부여합니다. 이 라이선스의 유일한 목적은 사용자가 이 약관에서 허용하는 방식에 따라 팅클 서비스를 향유할 수 있도록 하는 데 있습니다. 사용자가 게시한 콘텐츠를 제외하고 팅클 서비스에 대한 모든 권리, 소유권, 이익은 팅클의 독점적인 자산입니다. 사용자가 팅클 및 서비스에 대해 제공하는 의견과 제안은 팅클이 자유롭게 사용할 수 있으며 사용자에 대해 어떠한 의무도 부담하지 않습니다.`.replace(
                / /g,
                '\u00A0',
              )}
            </Text>
          </View>
          <View style={styles.policyBox}>
            <Text style={styles.policyHead}>
              {`제10조. 개인정보 보호`.replace(/ /g, '\u00A0')}
            </Text>
            <Text style={styles.policyBody}>
              {`팅클은 사용자로부터 최소한의 개인정보만 수집하며, 사용자의 개인정보를 보호하기 위해 최선을 다합니다. 팅클의 개인정보 보호와 관련한 자세한 사항은 개인정보처리방침을 참고하시길 바랍니다.`.replace(
                / /g,
                '\u00A0',
              )}
            </Text>
          </View>
          <View style={styles.policyBox}>
            <Text style={styles.policyHead}>
              {`제11조. 준거법 및 관할법원`.replace(/ /g, '\u00A0')}
            </Text>
            <Text style={styles.policyBody}>
              {`서비스 이용 및 이 약관과 관련한 분쟁 발생 시 대한민국 법을 적용하며, 분쟁에 대해 소송이 제기될 경우 관할법원은 민사소송법상의 관할법원으로 정합니다.`.replace(
                / /g,
                '\u00A0',
              )}
            </Text>
          </View>
          <View style={styles.policyBox}>
            <Text style={styles.policyHead}>
              {`제12조. 약관의 효력`.replace(/ /g, '\u00A0')}
            </Text>
            <Text style={styles.policyBody}>
              {`이 약관은 2023년 11월 5일부터 효력이 발생합니다.
이 약관에도 불구하고, 팅클과 사용자가 이 약관의 내용과 다르게 합의한 사항이 있는 경우에는 해당 내용을 우선으로 합니다.
사용자가 이 약관을 준수하지 않은 경우에, 팅클이 즉시 조치를 취하지 않더라도 팅클이 가진 권리를 포기하는 것이 아니며, 이 약관 중 일부 조항의 집행이 불가능하게 되더라도 다른 조항에는 영향을 미치지 않습니다.
이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관해서는 관련법 또는 관례에 따릅니다.`.replace(
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
