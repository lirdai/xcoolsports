import React, { useRef, useState, useEffect, useContext } from 'react';
import { ScrollView, Text, View, TextInput, Dimensions } from 'react-native';
import * as Device from 'expo-device';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'

import regexChecker from '@xcoolsports/utils/regexChecker';
import templateConstants from '@xcoolsports/constants/templateConstants';
import Container from '@xcoolsports/components/Common/Container';
import styles from '@xcoolsports/components/Auth/style';
import {ThemeContext} from '@xcoolsports/constants/theme';
import { api, selectCurrentUser } from '@xcoolsports/data';
import SecondaryContainedButton from '@xcoolsports/components//utils/Buttons/SecondaryContainedButton';

const Veritification = ({ route, navigation }) => {
  const { t, i18n } = useTranslation();
  const { phone, verificationType } = route.params;
  const currentUser = useSelector(selectCurrentUser);
  const isMounted = useRef(true);
  const theme = useContext(ThemeContext);
  const timeLimit = 60;

  const [code, setCode] = useState('');
  const [second, setSecond] = useState(0);
  const [secondID, setSecondID] = useState(null);
  const [onChange, setOnChange] = useState({
    code: true,
  });

  const [sendCodeBySMS] = api.endpoints.sendCodeBySMS.useMutation();
  const [login] = api.endpoints.login.useMutation();
  const [resetPasswordBySms] = api.endpoints.resetPasswordBySms.useMutation();
  const [verifyPhoneBySms] = api.endpoints.verifyPhoneBySms.useMutation();
  const [deleteUser] = api.endpoints.deleteUser.useMutation();

  const handleSendCode = async () => {
    let newObject;
    setSecond(timeLimit);

    setSecondID(setInterval(() => {
      if (isMounted.current) {
        setSecond((prevSecond) => prevSecond - 1);
      }
    }, 1000));

    if (verificationType === "DEACTIVATE") {
      newObject = { username: currentUser.username, phone, reason: verificationType };
    } else {
      newObject = { phone, reason: verificationType };
    }

    await sendCodeBySMS(newObject);
  };

  const related_data = {
    device: {
      brand: Device.brand, 
      designName: Device.designName, 
      deviceYearClass: Device.deviceYearClass, 
      manufacturer: Device.manufacturer, 
      modelId: Device.modelId, 
      modelName: Device.modelName, 
      osName: Device.osName, 
      osVersion: Device.osVersion, 
      osBuildId: Device.osBuildId, 
      platformApiLevel: Device.platformApiLevel, 
      totalMemory: Device.totalMemory,
      windowWidth: Dimensions.get("window").width,
      windowHeight: Dimensions.get("window").height,
    }
  };

  const handleVerification = async () => {
    let request = {
      phone,
      code: Number(code),
    };

    if (verificationType === 'LOGIN') {
      request = {
        related_data,
        ...request,
      };

      const reseponse = await login(request);
      if (reseponse.data) navigation.navigate(`${t('顽酷')}`);
    } else if (verificationType === 'RESET') {
      const response = await resetPasswordBySms(request);
      if (response.data) navigation.navigate(`${t('重设密码')}`, { token: response.data.sms_token });
    } else if (verificationType === 'VERIFYPHONE') {
      const response = await verifyPhoneBySms(request);
      if (response.data) navigation.goBack();
    } else if (verificationType === 'DEACTIVATE') {
      const newObject = {
        username: currentUser.username,
        code: Number(code),
        reason: "DEACTIVATE",
      };
    
      const response = await deleteUser(newObject);
      if (response.data) navigation.navigate(`${t('主页')}`);
    }
    
    if (isMounted.current) setCode("");
  };

  useEffect(() => {
    if (second === 0) {
      clearInterval(secondID);
      setSecondID(null);
    }
  }, [second]);

  useEffect(() => () => { isMounted.current = false }, []);
  const disabledCondition = code === '' || !onChange.code;
  const showText = () => {
    if (verificationType === 'LOGIN') return '登录';
    if (verificationType === 'RESET') return '重设密码';
    if (verificationType === 'VERIFYPHONE') return '验证手机号';
    else if (verificationType === 'DEACTIVATE') return '注销账号';
  };
  
  return (
    <Container 
      header={{ 
        title: `${t('验证手机号')}`, 
        headerTitle: { showTitle: true }, 
        headerLeft: { onPress: navigation.goBack },
        headerRight: {},
      }}
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} vertical>
        <View style={styles.innerContainer}>
          <Text style={[styles.title, {color: theme.text_color}]}>{`${t('请输入验证码')}`}</Text>
          <View style={[{...styles.inputContainerDefault, ...(onChange.code ? {} : styles.inputContainerError)}, {backgroundColor: theme.fill_placeholder}]}>
              <TextInput
                style={[styles.input, {color: theme.text_color}]}
                placeholder={`${t('请输入验证码')}`}
                onChangeText={(text) => {
                  setCode(text);
                  setOnChange((prev) => ({
                  ...prev,
                  code: regexChecker('code', text)
                  }));
                }}
                placeholderTextColor={theme.secondary_variant}
                value={code}
                keyboardType="numeric"
                autoCapitalize='none'
                autoCorrect={false}
                autoComplete='off'
                blurOnSubmit={false}
                onSubmitEditing={({ nativeEvent: { text }}) => {
                  if (disabledCondition) {
                    setOnChange((prev) => ({
                      ...prev,
                      code: regexChecker('code', text)
                    }));
                    return;
                  } else {
                    handleVerification();
                  }
                }}
              />

              <SecondaryContainedButton 
                buttonFreeStyle={styles.vertificationButton} 
                textFreeStyle={styles.vertificationText}
                onPress={handleSendCode}
                disabled={second !== 0} 
                buttonText={second === 0 ? `${t('获取验证码')}` : `${second}s ${t('获取验证码')}`} 
              />
          </View>
          <Text style={styles.error}>{!onChange.code && t(templateConstants.auth_patterns_error['code'])}</Text>

          <SecondaryContainedButton 
            buttonFreeStyle={styles.button} 
            textFreeStyle={styles.buttonText}
            onPress={handleVerification}
            disabled={disabledCondition} 
            buttonText={showText()} 
          />
        </View>
      </ScrollView>
    </Container>
  );
};

export default Veritification;
