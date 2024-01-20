import React, { useRef, useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import _ from 'lodash';
import { RadioButton, Checkbox } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons'; 
import { useTranslation } from 'react-i18next'

import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import SlideUpModal from '@xcoolsports/components/utils/SlideUpModal';
import regexChecker from '@xcoolsports/utils/regexChecker';
import templateConstants from '@xcoolsports/constants/templateConstants';
import PhoneNumber from '@xcoolsports/components/utils/PhoneNumber';
import Container from '@xcoolsports/components/Common/Container';
import { selectCurrentUser, api, toastActions, toastTypes } from '@xcoolsports/data';
import PopUpModal from '@xcoolsports/components/utils/PopUpModal';
import SecondaryContainedButton from '@xcoolsports/components/utils/Buttons/SecondaryContainedButton';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: theme.v_spacing_xl,
    paddingHorizontal: theme.h_spacing_lg,
  },
  inputContainerDefault: {
    flexDirection: 'row',
    borderRadius: theme.radius_md,
    height: theme.input_height,
  },
  inputContainerError: {
    borderWidth: theme.border_width_md,
    borderColor: theme.brand_error,
    marginBottom: theme.v_spacing_sm,
  },
  input: {
    flexGrow: 1,
    flexShrink: 1,
    paddingHorizontal: theme.h_spacing_md,
  },
  row: {
    height: 50,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between',
  },
  longParagraph: {
    flexDirection: "row", 
    justifyContent: 'flex-end', 
    flexShrink: 1, 
    marginLeft: theme.h_spacing_xl,
  },
  modalContainer: { 
    margin: theme.h_spacing_lg,
    marginTop: 0,
  },
  error: {
    fontSize: theme.font_size_caption_sm,
    color: theme.brand_error,
    marginBottom: theme.v_spacing_xl,
  },
  checkbox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.v_spacing_sm,
    marginTop: theme.v_spacing_2xl,
  },
  radioGroup: {
    maxHeight: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radio: {
    alignItems: 'flex-start',
    justifyContent: "center",
    width: '50%',
  },
});

const CertifyUser = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const dispatch =  useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const isMounted = useRef(true);
  const insets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);

  const [accepted, setAccepted] = useState(false);
  const [certification, setCertification] = useState('');
  const [content, setContent] = useState('');
  const [documents, setDocuments] = useState([]);
  const [certificationType, setCertificationType] = useState('PERSON');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState({
    "short": "CA",
    "name": "加拿大",
    "en": "Canada",
    "tel": "1",
    "pinyin": "jnd",
  });

  const [openTypeModal, setOpenTypeModal] = useState(false);
  const [openCertificationModal, setOpenCertificationModal] = useState(false);
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [openPhoneModal, setOpenPhoneModal] = useState(false);
  const [openContentModal, setOpenContentModal] = useState(false);
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const [openTermsModal, setOpenTermsModal] = useState(false);
  const [onChange, setOnChange] = useState({
    certification: true,
    phone: true,
  });

  const [createTicket] = api.endpoints.createTicket.useMutation();
  const [updateUserProfile] = api.endpoints.updateUserProfile.useMutation();

  const handleVerifySubmit = async () => {
    const disabledCondition = isDisabledSubmit({certificationType, certification, documents, accepted, address, phone});

    if (!accepted) {
      dispatch(toastActions.showToastAutoRemove({ type: toastTypes.WARNING, text: '请阅读并同意用户协议和隐私政策' }));
      return;
    }

    if (disabledCondition) {
      dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: disabledCondition }));
      return;
    }

    setLoading(true);

    const newTNTK = {
      title: '',
      content: JSON.stringify(documents),
      related_data: {
        selfID: currentUser.username,
      },
      ticket_type: 'CERTIF',
    };

    const newCertification = {
      certification, 
      user_type: certificationType, 
      certification_data: 
        certificationType === 'PERSON' 
          ? { documents }
          : { address, phone: countryCode.tel + phone, documents },
    };

    const response = await createTicket(newTNTK);
    if (response.data) {
      await updateUserProfile({ username: currentUser.username, body: newCertification });
      setOpenWarningModal(true);
    }

    setLoading(false);
  };

  useEffect(() => () => { isMounted.current = false; }, []);
  const userTypes = [{ label: `${t('个人认证')}`, value: "PERSON" }, { label: `${t('机构/企业认证')}`, value: "ORG" }];

  const isDisabledSubmit = ({ certificationType, certification, documents, accepted, address, phone }) => {
    const isPersonBad = (certificationType === 'PERSON' && (certification === '' || documents.length === 0 || !accepted)) && '请填写所有内容';
    const IsCompanyBad = (certificationType === 'ORG' && (certification === '' || address === '' || phone === '' || documents.length === 0 || !accepted)) && '请填写所有内容';

    return isPersonBad || IsCompanyBad;
  };

  return <Container 
    header={{ 
      title: `${t('官方认证')}`, 
      headerTitle: {showTitle: true}, 
      headerLeft: {onPress: navigation.goBack},
      headerRight: {headerRightComponent: 
        <Pressable 
          style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => setOpenWarningModal(true)}
        >
          <Text style={{ color: theme.brand_primary }}>{t('提示')}</Text>
        </Pressable>
      },
    }}
  >
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} vertical>
      {/* Current Identify */}
      <View style={[styles.row, {borderBottomColor: theme.fill_disabled}]}>
        <Text style={{color: theme.text_color}}> {t('目前官方认证名称')} </Text>
        {currentUser.is_certification_verified 
          ? <Text style={[styles.longParagraph, {color: theme.text_color}]} numberOfLines={1}> {currentUser.certification} </Text> 
          : <Text style={{color: theme.text_color}}> {t('暂无')} </Text>}
      </View>

      {/* Certification Type */}
      <Pressable hitSlop={10} onPress={() => setOpenTypeModal(true)} style={[styles.row, {borderBottomColor: theme.fill_disabled}]}>
        <Text style={{color: theme.text_color}}> {t('认证类型')} </Text>
        <View style={[styles.longParagraph, {color: theme.text_color}]}>
          <Text style={{color: theme.text_color}} numberOfLines={1}> {certificationType === 'PERSON' ? `${t('个人认证')}` : `${t('机构/企业认证')}` } </Text>
          <AntDesign name="edit" size={theme.icon_size_xxs} color={theme.fill_mask} />
        </View>
      </Pressable>

      {/* Certification */}
      <Pressable hitSlop={10} onPress={() => setOpenCertificationModal(true)} style={[styles.row, {borderBottomColor: theme.fill_disabled}]}>
        <Text style={{color: theme.text_color}}> {t('官方认证名称')} </Text>
        <View style={[styles.longParagraph, {color: theme.text_color}]}>
          <Text style={{color: theme.text_color}} numberOfLines={1}> {certification} </Text>
          <AntDesign name="edit" size={theme.icon_size_xxs} color={theme.fill_mask} />
        </View>
      </Pressable>

      {certificationType === 'ORG' && 
        <Pressable hitSlop={10} onPress={() => setOpenAddressModal(true)} style={[styles.row, {borderBottomColor: theme.fill_disabled}]}>
          <Text style={{color: theme.text_color}}> {t('官方认证地址')} </Text>
          <View style={[styles.longParagraph, {color: theme.text_color}]}>
            <Text style={{color: theme.text_color}} numberOfLines={1}> {address}  </Text>
            <AntDesign name="edit" size={theme.icon_size_xxs} color={theme.fill_mask} />
          </View>
        </Pressable>
      } 

      {certificationType === 'ORG' && 
        <Pressable hitSlop={10} onPress={() => setOpenPhoneModal(true)} style={[styles.row, {borderBottomColor: theme.fill_disabled}]}>
          <Text style={{color: theme.text_color}}> {t('官方认证电话')} </Text>
          <View style={[styles.longParagraph, {color: theme.text_color}]}>
            <Text style={{color: theme.text_color}} numberOfLines={1}> {phone}  </Text>
            <AntDesign name="edit" size={theme.icon_size_xxs} color={theme.fill_mask} />
          </View>
        </Pressable>
      }

      <Pressable hitSlop={10} onPress={() => setOpenContentModal(true)} style={[styles.row, {borderBottomColor: theme.fill_disabled}]}>
        <Text style={{color: theme.text_color}}> {t('材料申报')} </Text>
        <View style={[styles.longParagraph, {color: theme.text_color}]}>
          <Text style={{color: theme.text_color}} numberOfLines={1}> {documents[0]} </Text>
          <AntDesign name="edit" size={theme.icon_size_xxs} color={theme.fill_mask} />
        </View>
      </Pressable>

      <View style={styles.checkbox}>
        <Checkbox.Item
          onPress={() => setAccepted(!accepted)}
          mode="android"
          position="leading"
          status={accepted ? "checked" : "unchecked"}   
          style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}                         
          color={theme.secondary_color}
        />

        <Text style={{ fontSize: theme.font_size_icontext, color: theme.text_color }}>{t('我已阅读并接受')}</Text>
        <Pressable hitSlop={10} onPress={() => setOpenTermsModal(true)}> 
          <Text style={{ color: theme.brand_primary, fontSize: theme.font_size_icontext }}>{t('《顽酷活动主办方说明》')}</Text> 
        </Pressable>
      </View>

      <SecondaryContainedButton
        buttonFreeStyle={{height: 50, marginVertical: theme.v_spacing_lg}} 
        textFreeStyle={{fontSize: theme.font_size_heading}}
        loading={loading}
        onPress={handleVerifySubmit}
        buttonText={'认证身份'} 
      />

      <SlideUpModal
        title={`${t('请填写认证类型')}`}
        onClose={() => setOpenTypeModal(false)}
        visible={openTypeModal}
      >
        <View style={styles.modalContainer}>
          <RadioButton.Group onValueChange={newValue => setCertificationType(newValue)} value={certificationType}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {userTypes.map(sub => ({ label: sub.label, value: sub.value })).map(({label, value}) =>
                <View key={label} style={[styles.radio]}>
                  <RadioButton.Item 
                    color={theme.text_color}
                    labelStyle={{color: theme.text_color}}
                    mode="android" 
                    position="leading" 
                    label={t(label)} 
                    value={value}
                  />
                </View>
              )}
            </View>
          </RadioButton.Group>
        </View>
      </SlideUpModal>

      <PopUpModal
        title={`${t('提示')}`}
        onClose={() => setOpenWarningModal(false)}
        visible={openWarningModal}
      >
        <View style={styles.modalContainer}>
          <Text style={{color: theme.text_color}}>请在此填写您要申请的材料名称, 比如: 身份证(手持身份证上半身照)、教练证、保险、或者其他资质证明,</Text>
          <Text style={{color: theme.text_color}}>并将要验证的材料发送到wanku@xcoolsports.com, 邮件标题以: </Text>
          <Text style={{ fontWeight: 'bold', marginVertical: theme.v_spacing_sm, color: theme.text_color }}>顽酷用户名-注册手机号-官方认证类型-官方认证名称-提交材料名称</Text>
          <Text style={{color: theme.text_color}}>另附上材料照片, 我们会尽快完成审核</Text>

          <SecondaryContainedButton
            buttonFreeStyle={{height: 40, marginVertical: theme.v_spacing_lg}} 
            textFreeStyle={{fontSize: theme.font_size_heading}}
            onPress={() => setOpenWarningModal(false)}
            buttonText={'我知道了'} 
          />
        </View>
      </PopUpModal>

      <SlideUpModal
        title={`${t('请填写认证名称')}`}
        onClose={() => setOpenCertificationModal(false)}
        visible={openCertificationModal}
        onOk={() => setOpenCertificationModal(false)}
        okTitle={`${t('确定')}`}
        disableOk={false}
      >
        <View style={styles.modalContainer}>
          <View style={[{...styles.inputContainerDefault, ...(onChange.certification ? {} : styles.inputContainerError)}, {backgroundColor: theme.fill_placeholder}]}>
            <TextInput
              placeholderTextColor={theme.secondary_variant}
              style={[styles.input, {color: theme.text_color}]}
              placeholder={`${t('请填写认证名称')}`}
              onChangeText={(text) => {
                setCertification(text);
                setOnChange((prev) => ({
                  ...prev,
                  certification: regexChecker('certification', text)
                }));
              }}
              value={certification}
              blurOnSubmit={false}
              onSubmitEditing={({ nativeEvent: { text }}) => { 
                setOnChange((prev) => ({
                  ...prev,
                  certification: regexChecker('certification', text)
                }));
                setOpenCertificationModal(false);
              }}
            />
          </View>
          <Text style={styles.error}>{!onChange.certification && t(templateConstants.auth_patterns_error['certification'])}</Text>
        </View>
      </SlideUpModal>

      <SlideUpModal
        title={`${t('请填写认证地址')}`}
        onClose={() => setOpenAddressModal(false)}
        visible={openAddressModal}
        onOk={() => setOpenAddressModal(false)}
        okTitle={`${t('确定')}`}
        disableOk={false}
      >
        <View style={styles.modalContainer}>
          <TextInput
            placeholder={`${t('请填写认证地址')}`}
            placeholderTextColor={theme.secondary_variant}
            multiline={true}
            numberOfLines={10}
            maxLength={200}
            clear={true} 
            style={{ 
                marginBottom: theme.v_spacing_2xl, height: 200,
                padding: theme.v_spacing_md, color: theme.text_color,
                textAlignVertical: 'top'
            }}
            value={address}
            onChangeText={(text) => setAddress(text)}
          />
        </View>
      </SlideUpModal>

      <SlideUpModal
        title={`${t('请填写认证电话')}`}
        onClose={() => setOpenPhoneModal(false)}
        visible={openPhoneModal}
        onOk={() => setOpenPhoneModal(false)}
        okTitle={`${t('确定')}`}
        disableOk={false}
      >
        <PhoneNumber
          ref={null}
          placeholder={`${t('请填写认证电话')}`}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          regex={onChange.phone}
          onChangeText={(text) => {
            setPhone(text);
            setOnChange((prev) => ({
              ...prev,
              phone: regexChecker('phone', text)
            }));
          }}
          value={phone}
          keyboardType="numeric"
          returnKeyLabel={`${t('下一项')}`}
          returnKeyType='next'
          blurOnSubmit={false}
          onSubmitEditing={({ nativeEvent: { text }}) => { 
            setOnChange((prev) => ({
              ...prev,
              phone: regexChecker('phone', text)
            }));
          }}
        />
        <Text style={styles.error}>{!onChange.phone && t(templateConstants.auth_patterns_error['phone'])}</Text>
      </SlideUpModal>

      <SlideUpModal
        title={`${t('请填写要申报的材料名称')}`}
        onClose={() => setOpenContentModal(false)}
        visible={openContentModal}
        onOk={() => setOpenContentModal(false)}
        okTitle={`${t('确定')}`}
        disableOk={false}
      >
        <View style={{ marginHorizontal: theme.v_spacing_lg }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'stretch' }}>
            {documents.map((name) =>
              <Pressable key={name}         
                style={{ padding: 5, margin: 5, borderColor: theme.fill_disabled, borderWidth: 1, borderRadius: 6 }}
                onPress={() => {
                  setDocuments((prev) => prev.filter((document) => document !== name));
                }}
              >
                <Text
                  style={{ fontSize: theme.font_size_base, color: theme.text_color }}
                >{name}</Text>
              </Pressable>
            )}
          </View>

          <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginVertical: theme.v_spacing_lg, }}>
            <TextInput
              style={{ 
                borderWidth: 1, flex: 1, borderRadius: 10, borderColor: theme.fill_disabled, 
                padding: theme.v_spacing_sm, marginHorizontal: theme.h_spacing_sm,
                height: 45, color: theme.text_color
              }}
              placeholder={`${t('请填写要申报的材料名称')}`}
              placeholderTextColor={theme.secondary_variant}
              value={content}
              onChangeText={(text) => {
                setContent(text);
              }}
              onSubmitEditing={({ nativeEvent: { text }}) => {
                setContent('');
                setDocuments((prev) => {
                  const newDocuments = prev.concat(text);
                  return _.uniq(newDocuments);
                });
              }}
            />

            <Pressable 
              style={{ 
                backgroundColor: theme.secondary_color, borderRadius: 10, width: 80,
                height: 45, justifyContent: 'center', alignItems: 'center', 
              }}
              onPress={() => {
                setContent('');
                setDocuments((prev) => {
                  const newDocuments = prev.concat(content);
                  return _.uniq(newDocuments);
                });
              }}
              disabled={content === ''}
            > 
              <Text style={{ fontSize: 14, color: theme.fill_base }}>{t('添加')}</Text>
            </Pressable>
          </View> 
        </View>
      </SlideUpModal>

      <SlideUpModal
        fullScreen
        title={`${t('顽酷活动主办方服务说明')}`}
        onClose={() => setOpenTermsModal(false)}
        visible={openTermsModal}
        style={[{ height: '100%', paddingTop: insets.top }]}
      >
        <ScrollView style={styles.modalContainer} showsVerticalScrollIndicator={false}>
          <Text style={{ paddingVertical: theme.v_spacing_lg, color: theme.text_color }}>
            1. 官方认证要求:
            请提供尽可能多的材料进行资格认证, 比如: 身份证(手持身份证上半身照)、教练证、保险、或者其他资质证明, 我们会如实的向用户展示您提交的所有认证资质。提供的信息应真实、准确、完整，平台在任何时候都有权验证您所提供的信息。
            由于您提供虚假或不完整信息所导致的责任或损失，应由您独立承担。如发生违法行为或不符合相关条件的，平台有权注销其注册信息、停止主办方提供服务；给其他用户或者平台造成损失的，平台有权依法追究其法律责任。
            请将要验证的材料发送到wanku@xcoolsports.com, 邮件标题以: 顽酷用户名-注册手机号-官方认证类型-官方认证名称-提交材料名称。
            另附上材料照片, 我们会尽快完成审核。
          </Text>
        
          <Text style={{ paddingVertical: theme.v_spacing_lg, color: theme.text_color }}>
            2. 活动规则说明:
            1) 为更好维护平台秩序，用户账号仅供初始注册人使用，任何用户不得将账号及密码转让、售卖、赠与、借用、租用、泄露给第三方或以其他方式许可第三方使用;
              如用户因违反本条约定或账号遭受攻击、诈骗等而遭受损失，用户应通过司法、行政等救济途径向侵权行为人追偿，平台在法律允许范围内可免于承担责任;
              如用户因违反本条约定给他人造成损失，用户应就全部损失与实际使用人承担连带责任，且平台有权追究用户违约责任，暂停或终止向您提供服务;
            2) 本平台提供的所有活动, 时间、价格、内容、地点等均由主办方自由设置, 与本平台无关;
            3) 用户在选定产品并下单后，等待活动主办方【接受订单】;
            4) 活动主办法接受订单后，订单会出现【联系对方】按钮，双方可以自由交流;
            5) 活动被主办方接受以后，用户可以在活动开始前的任意时间【取消订单】;
          </Text>

          <Text style={{ paddingVertical: theme.v_spacing_lg, color: theme.text_color }}>
            3. 免责声明:
            顽酷在此声明, 在开展各种活动前，请各位活动策划者认真研读当地法律法规, 以及各种相关应急, 保护措施等。如果出现任何法律纠纷, 顽酷平台将会尽可能提供信息和帮助, 但顽酷平台将不承担任何法律责任。
          </Text>
        </ScrollView>
      </SlideUpModal>
    </ScrollView>
  </Container>
};

export default CertifyUser;
