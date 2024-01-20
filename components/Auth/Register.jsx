import React, { useRef, useState, useEffect, useContext } from 'react';
import { Pressable, ScrollView, Text, View, TextInput, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import { Checkbox } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons'; 
import * as Device from 'expo-device';
import { useTranslation } from 'react-i18next'

import {ThemeContext} from '@xcoolsports/constants/theme';
import regexChecker from '@xcoolsports/utils/regexChecker';
import PhoneNumber from '@xcoolsports/components/utils/PhoneNumber';
import templateConstants from '@xcoolsports/constants/templateConstants';
import Container from '@xcoolsports/components/Common/Container';
import { sessionActions, toastActions, toastTypes, api } from '@xcoolsports/data';
import styles from '@xcoolsports/components/Auth/style';
import SecondaryContainedButton from '@xcoolsports/components//utils/Buttons/SecondaryContainedButton';

const options = {
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
    },
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
}
zxcvbnOptions.setOptions(options);

const Register = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const nicknameRef = useRef();
    const phoneRef = useRef();
    const passwordRef = useRef();
    const confirmationRef = useRef();
    const isMounted = useRef(true);
    const dispatch = useDispatch();
    const theme = useContext(ThemeContext);

    const [username, setUsername] = useState('');
    const [nickname, setNickname] = useState('');
    const [countryCode, setCountryCode] = useState({
        "short": "CA",
        "name": "加拿大",
        "en": "Canada",
        "tel": "1",
        "pinyin": "jnd",
    });
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [passwordShow, setPasswordShow] = useState(true);
    const [confirmationShow, setConfirmationShow] = useState(true);
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [onChange, setOnChange] = useState({
        username: true,
        nickname: true,
        phone: true,
        password: true,
        confirmation: true,
    });

    const newRegister = {
        related_data: {
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
        },
    };

    const [register] = api.endpoints.register.useMutation();

    const handleRegister = async () => {
        if (!accepted) {
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.WARNING, text: '请阅读并同意用户协议和隐私政策' }));
            return;
        }

        dispatch(sessionActions.readEulaPrivacy());
        setLoading(true);

        const request = {
            ...newRegister,
            username,
            nickname,
            phone: countryCode.tel + phone,
            password,
        }

        if (confirmation === password) {
            const response = await register(request);
            if (response.data && isMounted.current) {
                setUsername('');
                setNickname('');
                setPhone('');
                setPassword('');
                setConfirmation('');
                navigation.navigate(`${t('验证手机号')}`, { phone: countryCode.tel + phone, verificationType: 'VERIFYPHONE' });
            }
        } else {
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '两次密码不一致' }));
        }

        setLoading(false);
    }

    useEffect(() => () => { isMounted.current = false }, []);
    const disabledCondition = zxcvbn(password).score === 0 || username === '' || phone === '' || password === '' || confirmation === '' || !onChange.username || !onChange.phone || !onChange.password || !onChange.confirmation;
    const barText = {
        0: `${t('密码实在太弱了')}`,
        1: `${t('密码有点弱哦')}`,
        2: `${t('一般强度')}`,
        3: `${t('非常好')}`,
        4: `${t('密码很靠谱')}`,
    }

    const textColor = {
        0: "gray",
        1: "#851901",
        2: "#d6b304",
        3: "#1e96c9",
        4: "#03801e",
    }

    return (
        <Container 
            header={{
                title: `${t('注册')}`, 
                headerTitle: {showTitle: true}, 
                headerLeft: { onPress: navigation.goBack },
                headerRight: {},
            }}
        >
            <ScrollView contentContainerStyle={[styles.container]} showsVerticalScrollIndicator={false} vertical>
                <View style={styles.innerContainer}>
                    <Text style={[styles.title, {color: theme.text_color}]}>{`${t('顽酷账户')}`}</Text>
                    <View style={[{...styles.inputContainerDefault, ...(onChange.username ? {} : styles.inputContainerError)}, {backgroundColor: theme.fill_placeholder}]}>
                        <TextInput
                            style={[styles.input, {color: theme.text_color}]}
                            placeholder={`${t('顽酷账户')}`}
                            onChangeText={(text) => {
                                setUsername(text);
                                setOnChange((prev) => ({
                                    ...prev,
                                    username: regexChecker('username', text)
                                }));
                            }}
                            placeholderTextColor={theme.secondary_variant}
                            value={username}
                            keyboardType="email-address"
                            returnKeyLabel={`${t('下一项')}`}
                            returnKeyType='next'
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoComplete='off'
                            blurOnSubmit={false}
                            onSubmitEditing={({ nativeEvent: { text }}) => { 
                                setOnChange((prev) => ({
                                    ...prev,
                                    username: regexChecker('username', text)
                                }));
                                nicknameRef.current.focus(); 
                            }}
                        />
                    </View>
                    <Text style={styles.error}>{!onChange.username && t(templateConstants.auth_patterns_error['username'])}</Text>

                    <Text style={[styles.title, {color: theme.text_color}]}>{`${t('顽酷用户名')}`}</Text>
                    <View style={[{...styles.inputContainerDefault, ...(onChange.nickname ? {} : styles.inputContainerError)}, {backgroundColor: theme.fill_placeholder}]}>
                        <TextInput
                            ref={nicknameRef}
                            style={[styles.input, {color: theme.text_color}]}
                            placeholder={`${t('顽酷用户名')}`}
                            onChangeText={(text) => {
                                setNickname(text);
                                setOnChange((prev) => ({
                                    ...prev,
                                    nickname: regexChecker('nickname', text)
                                }));
                            }}
                            placeholderTextColor={theme.secondary_variant}
                            value={nickname}
                            keyboardType="email-address"
                            returnKeyLabel={`${t('下一项')}`}
                            returnKeyType='next'
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoComplete='off'
                            blurOnSubmit={false}
                            onSubmitEditing={({ nativeEvent: { text }}) => { 
                                setOnChange((prev) => ({
                                    ...prev,
                                    nickname: regexChecker('username', text)
                                }));
                                phoneRef.current.focus(); 
                            }}
                        />
                    </View>
                    <Text style={styles.error}>{!onChange.nickname && t(templateConstants.auth_patterns_error['nickname'])}</Text>

                    <Text style={[styles.title, {color: theme.text_color}]}>{`${t('注册手机号')}`}</Text>
                    <PhoneNumber
                        ref={phoneRef}
                        placeholder={`${t('注册手机号')}`}
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
                            passwordRef.current.focus(); 
                        }}
                    />
                    <Text style={styles.error}>{!onChange.phone && t(templateConstants.auth_patterns_error['phone'])}</Text>

                    <Text style={[styles.title, {color: theme.text_color}]}>{`${t('顽酷密码')}`}</Text>
                    <View style={[{...styles.inputContainerDefault, ...(onChange.password ? {} : styles.inputContainerError)}, {backgroundColor: theme.fill_placeholder}]}>
                        <TextInput
                            ref={passwordRef}
                            style={[styles.input, {color: theme.text_color}]}
                            placeholder={`${t('顽酷密码')}`}
                            onChangeText={(text) => {
                                setPassword(text);
                                setOnChange((prev) => ({
                                    ...prev,
                                    password: regexChecker('password', text)
                                }));
                            }}
                            placeholderTextColor={theme.secondary_variant}
                            value={password}
                            secureTextEntry={passwordShow}
                            textContentType='newPassword'
                            returnKeyLabel={`${t('下一项')}`}
                            returnKeyType='next'
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoComplete='off'
                            blurOnSubmit={false}
                            onSubmitEditing={({ nativeEvent: { text }}) => { 
                                setOnChange((prev) => ({
                                    ...prev,
                                    password: regexChecker('password', text)
                                }));
                                confirmationRef.current.focus(); 
                            }}
                        />

                        <Pressable hitSlop={20} style={styles.eye} onPress={() => setPasswordShow(!passwordShow)}>
                            {passwordShow 
                                ? <Entypo name="eye" size={20} color={theme.secondary_color} />
                                : <Entypo name="eye-with-line" size={20} color={theme.secondary_color} />
                            }
                        </Pressable>
                    </View>
                    {!onChange.password
                        ? <Text style={styles.error}>{t(templateConstants.auth_patterns_error['password'])}</Text>
                        : <Text style={{ fontSize: theme.font_size_caption_sm, marginBottom: theme.v_spacing_xl, color: textColor[zxcvbn(password).score] }}>{password.length === 0 ? '' : barText[zxcvbn(password).score]}</Text>
                    }

                    <Text style={[styles.title, {color: theme.text_color}]}>{`${t('确认密码')}`}</Text>
                    <View style={[{...styles.inputContainerDefault, ...(onChange.confirmation ? {} : styles.inputContainerError)}, {backgroundColor: theme.fill_placeholder}]}>
                        <TextInput
                            ref={confirmationRef}
                            style={[{color: theme.text_color}, styles.input]}
                            placeholder={`${t('确认密码')}`}
                            onChangeText={(text) => {
                                setConfirmation(text);
                                setOnChange((prev) => ({
                                    ...prev,
                                    confirmation: regexChecker('password', text)
                                }));
                            }}
                            placeholderTextColor={theme.secondary_variant}
                            value={confirmation}
                            secureTextEntry={confirmationShow}
                            textContentType='password'
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoComplete='off'
                            blurOnSubmit={false}
                            onSubmitEditing={({ nativeEvent: { text }}) => {
                                if (disabledCondition) {
                                    setOnChange((prev) => ({
                                        ...prev,
                                        confirmation: regexChecker('password', text)
                                    }));
                                    return;
                                } else {
                                    handleRegister();
                                }
                            }}
                        />

                        <Pressable hitSlop={20} style={styles.eye} onPress={() => setConfirmationShow(!confirmationShow)}>
                            {confirmationShow 
                                ? <Entypo name="eye" size={20} color={theme.secondary_color} />
                                : <Entypo name="eye-with-line" size={20} color={theme.secondary_color} />
                            }
                        </Pressable>
                    </View>
                    <Text style={styles.error}>{!onChange.confirmation && t(templateConstants.auth_patterns_error['password'])}</Text>

                    <View style={styles.checkbox}>
                        <Checkbox.Item
                            onPress={() => setAccepted(!accepted)}
                            mode="android"
                            position="leading"
                            status={accepted ? "checked" : "unchecked"}   
                            style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}                         
                            color={theme.secondary_color}
                        />

                        <Text style={{ fontSize: theme.font_size_icontext, color: theme.text_color }}>{`${t('我已阅读并接受')}`}</Text>
                        <Pressable hitSlop={10} onPress={() => navigation.navigate(`${t('用户协议')}`)}> 
                            <Text style={styles.link}>{`${t('《用户协议》')}`}</Text> 
                        </Pressable>
                        
                        <Text style={{ fontSize: theme.font_size_icontext, color: theme.text_color }}>{`${t('和')}`}</Text>

                        <Pressable hitSlop={10} onPress={() => navigation.navigate(`${t('隐私政策')}`)}> 
                            <Text style={styles.link}>{`${t('《隐私政策》')}`}</Text> 
                        </Pressable>
                    </View>

                    <SecondaryContainedButton 
                        buttonFreeStyle={styles.button} 
                        textFreeStyle={styles.buttonText}
                        onPress={handleRegister}
                        disabled={disabledCondition} 
                        buttonText={'下一步'} 
                        loading={loading}
                    />
                </View>
            </ScrollView>
        </Container>
    )
}

export default Register;
