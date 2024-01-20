import React, { useState, useRef, useEffect, useContext } from 'react';
import { ScrollView, Pressable, TextInput, Text, View, Dimensions, Platform, NativeModules } from 'react-native';
import { useDispatch } from 'react-redux';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons'; 
import { useTranslation } from 'react-i18next'

import * as Device from 'expo-device';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Linking from 'expo-linking';
import { Checkbox } from 'react-native-paper';

import {ThemeContext} from '@xcoolsports/constants/theme';
import regexChecker from '@xcoolsports/utils/regexChecker';
import templateConstants from '@xcoolsports/constants/templateConstants';
import PhoneNumber from '@xcoolsports/components/utils/PhoneNumber';
import Container from '@xcoolsports/components/Common/Container';
import styles from '@xcoolsports/components/Auth/style';
import ScrollSelector from '@xcoolsports/components/utils/ScrollSelector';
import { sessionActions, toastActions, toastTypes, api } from '@xcoolsports/data';
import SecondaryContainedButton from '@xcoolsports/components//utils/Buttons/SecondaryContainedButton';

const { OauthModule } = NativeModules;

const Login = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const passwordRef = useRef();
    const isMounted = useRef(true);
    const dispatch = useDispatch();
    const theme = useContext(ThemeContext);

    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordShow, setPasswordShow] = useState(true);
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [oauthLoginLoading, setOauthLoginLoading] = useState(false);
    const [tabRoute, setTabRoute] = useState('username');
    const [onChange, setOnChange] = useState({
        username: true,
        password: true,
        phone: true,
    });
    const [countryCode, setCountryCode] = useState({
        "short": "CA",
        "name": "加拿大",
        "en": "Canada",
        "tel": "1",
        "pinyin": "jnd",
    });
    const [loginApp, setLoginApp] = useState({
        '微信': false,
        '苹果': Platform.OS === 'ios',
    });

    const [login] = api.endpoints.login.useMutation();
    const [oauthAppleLogin] = api.endpoints.oauthAppleLogin.useMutation();
    const [oauthWechatLogin] = api.endpoints.oauthWechatLogin.useMutation();

    const newLogin = {
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

    const handleLogin = async () => {
        if (!accepted) {
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.WARNING, text: '请阅读并同意用户协议和隐私政策' }));
            return;
        }
        dispatch(sessionActions.readEulaPrivacy());
        setLoading(true);

        let request = {};

        if (tabRoute === 'password') {
            request = {
                ...newLogin,
                phone: countryCode.tel + phone,
                password,
            }
        }

        if (tabRoute === 'username') {
            request = {
                ...newLogin,
                username,
                password,
            }
        }

        const response = await login(request);

        if (response.data && isMounted.current) {
            setUsername('');
            setPhone('');
            setPassword('');
            navigation.navigate(`${t("顽酷")}`);
        }

        setLoading(false);
    }

    const handleNext = async () => {
        if (!accepted) {
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.WARNING, text: "请阅读并同意用户协议和隐私政策" }));
            return;
        }
        dispatch(sessionActions.readEulaPrivacy());
        navigation.navigate(`${t("验证手机号")}`, { phone: countryCode.tel + phone, verificationType: 'LOGIN' });
    };

    const handleAppleLogin = () => {
        if (!accepted) {
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.WARNING, text: "请阅读并同意用户协议和隐私政策" }));
            return;
        }
        dispatch(sessionActions.readEulaPrivacy());

        AppleAuthentication.signInAsync({
            requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            ],
        }).then((credential) => {
            setOauthLoginLoading(true);
            oauthAppleLogin({
                ...newLogin,
                authorization_code: credential.authorizationCode,
                identity_token: credential.identityToken,
                user: credential.user,
                nickname: credential.fullName?.nickname,
            })
            navigation.navigate(`${t("顽酷")}`);
        }).catch(e => {
            if (e.code === 'ERR_CANCELED') {
                // handle that the user canceled the sign-in flow
                dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: "苹果登录取消" }));
            } else {
                console.error(e);
                // handle other errors
                // dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: "苹果登录出错" }));
            }
        }) 
    };

    const handleWechatLogin = () => {
        if (!accepted) {
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.WARNING, text: "请阅读并同意用户协议和隐私政策" }));
            return;
        }
        dispatch(sessionActions.readEulaPrivacy());

        const stateToken = Math.random().toString();
        OauthModule.requestWXAuth(stateToken, (errorCode, respStateToken, oauthCode) => {
            if (respStateToken !== stateToken) {
                dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: "微信登录出错, 不可以重复登录" }));
                return;
            }
            switch(Number(errorCode)) {
                case 0: 
                    setOauthLoginLoading(true);
                    oauthWechatLogin({
                        ...newLogin,
                        code: oauthCode,
                    })
                    navigation.navigate(`${t("顽酷")}`);
                    break;
                case -1:
                    dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: "微信登录出错" }));
                    break;
                case -2:
                    // dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: "微信登录取消" }));
                    break;
                case -3:
                    // dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: "获取二维码失败" }));
                    break;
                case -4:
                    // dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: "用户取消授权" }));
                    break;
                case -5:
                    dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: "微信登录超时" }));
                    break;
                case -10:
                    // dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: "找不到微信APP" }));
                    break;
                default:
                    dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: "未知错误" }));
            }
        });
    }

    useEffect(() => {
        Linking.canOpenURL("weixin://")
            .then(can => {
                setLoginApp(prev => ({
                    ...prev,
                    '微信': can,
                }))
            });
        return () => { 
            isMounted.current = false; 
        }
    }, []);

    const disabledCondition = () => {
        if (tabRoute === 'password') {
            return phone === '' || password === '' || !onChange.phone || !onChange.password;
        }

        if (tabRoute === 'verification') {
            return phone === '' || !onChange.phone;
        }

        return username === '' || password === '' || !onChange.username || !onChange.password;
    };

    return <Container 
        header={{ 
            title: `${t("登录")}`,
            headerTitle: { showTitle: true }, 
            headerLeft: { onPress: navigation.goBack },
            headerRight: {},
        }}
    >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} vertical>
            <View style={styles.innerContainer}>
                <View style={styles.loginType}>
                    <ScrollSelector
                        selected={tabRoute}
                        items={[
                            {key: 'username', value: `${t("账户登录")}`, onSelect: () => {setTabRoute('username')}},
                            {key: 'verification', value: `${t("验证码登录")}`, onSelect: () => {setTabRoute('verification')}},
                            {key: 'password', value: `${t("密码登录")}`, onSelect: () => {setTabRoute('password')}},
                        ]}
                    />
                </View>

                {tabRoute === 'password' && 
                    <View>
                        <Text style={[styles.title, {color: theme.text_color}]}>{t('注册手机号')}</Text>
                        <PhoneNumber
                            ref={passwordRef}
                            placeholder={`${t("注册手机号")}`}
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
                            returnKeyLabel={`${t("下一项")}`}
                            returnKeyType='next'
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoComplete='off'
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

                        <Text style={[styles.title, {color: theme.text_color}]}>{`${t("顽酷密码")}`}</Text>
                        <View style={[{...styles.inputContainerDefault, ...(onChange.password ? {} : styles.inputContainerError)}, {backgroundColor: theme.fill_placeholder}]}>
                            <TextInput
                                ref={passwordRef}
                                placeholderTextColor={theme.secondary_variant}
                                secureTextEntry={passwordShow}
                                style={[styles.input, {color: theme.text_color}]}
                                placeholder={`${t("顽酷密码")}`}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setOnChange((prev) => ({
                                        ...prev,
                                        password: regexChecker('password', text)
                                    }));
                                }}
                                value={password}
                                textContentType='password'
                                autoCapitalize='none'
                                autoCorrect={false}
                                autoComplete='off'
                                blurOnSubmit={false}
                                onSubmitEditing={({ nativeEvent: { text }}) => {
                                    if (disabledCondition()) {
                                        setOnChange((prev) => ({
                                            ...prev,
                                            password: regexChecker('password', text)
                                        }));
                                        return;
                                    } else {
                                        handleLogin();
                                    }
                                }}
                            />

                            <Pressable hitSlop={20} style={styles.eye} onPress={() => setPasswordShow(!passwordShow)}>
                                {passwordShow 
                                    ? <Entypo name="eye" size={20} color={theme.secondary_color} />
                                    : <Entypo name="eye-with-line" size={20} color={theme.secondary_color} />
                                }
                            </Pressable>
                        </View>
                        <Text style={styles.error}>{!onChange.password && t(templateConstants.auth_patterns_error['password'])}</Text>

                        <SecondaryContainedButton 
                            buttonFreeStyle={styles.button} 
                            textFreeStyle={styles.buttonText}
                            onPress={handleLogin}
                            disabled={disabledCondition()} 
                            buttonText={'登录'} 
                            loading={loading || oauthLoginLoading}
                        />
                    </View>
                }

                {tabRoute === 'verification' && 
                    <View>
                        <Text style={[styles.title, {color: theme.text_color}]}>{`${t("注册手机号")}`}</Text>
                        <PhoneNumber
                            placeholder={`${t("注册手机号")}`}
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
                            autoCapitalize='none'
                            autoCorrect={false}
                            autoComplete='off'
                            blurOnSubmit={false}
                            onSubmitEditing={({ nativeEvent: { text }}) => {
                                if (disabledCondition()) {
                                    setOnChange((prev) => ({
                                        ...prev,
                                        phone: regexChecker('phone', text)
                                    }));
                                    return;
                                } else {
                                    handleNext();
                                }
                            }}
                        />
                        <Text style={styles.error}>{!onChange.phone && t(templateConstants.auth_patterns_error['phone'])}</Text>

                        <SecondaryContainedButton 
                            buttonFreeStyle={styles.button} 
                            textFreeStyle={styles.buttonText}
                            onPress={handleNext}
                            disabled={disabledCondition()} 
                            buttonText={'下一步'} 
                            loading={loading || oauthLoginLoading}
                        />
                    </View>
                }

                {tabRoute === 'username' && 
                    <View>
                        <Text style={[styles.title, {color: theme.text_color}]}>{`${t("顽酷账户")}`}</Text>
                        <View style={[{...styles.inputContainerDefault, ...(onChange.username ? {} : styles.inputContainerError)}, {backgroundColor: theme.fill_placeholder}]}>
                            <TextInput
                                style={[styles.input, {color: theme.text_color}]}
                                placeholder={`${t("顽酷账户")}`}
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
                                returnKeyLabel={`${t("下一项")}`}
                                returnKeyType='next'
                                textContentType='username'
                                autoCapitalize='none'
                                autoCorrect={false}
                                autoComplete='off'
                                blurOnSubmit={false}
                                onSubmitEditing={({ nativeEvent: { text }}) => { 
                                    setOnChange((prev) => ({
                                        ...prev,
                                        username: regexChecker('username', text)
                                    }));
                                    passwordRef.current.focus(); 
                                }}
                            />
                        </View>
                        <Text style={styles.error}>{!onChange.username && t(templateConstants.auth_patterns_error['username'])}</Text>

                        <Text style={[styles.title, {color: theme.text_color}]}>{`${t("顽酷密码")}`}</Text>
                        <View style={[{...styles.inputContainerDefault, ...(onChange.password ? {} : styles.inputContainerError)}, {backgroundColor: theme.fill_placeholder}]}>
                            <TextInput
                                ref={passwordRef}
                                secureTextEntry={passwordShow}
                                style={[styles.input, {color: theme.text_color}]}
                                placeholder={`${t("顽酷密码")}`}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setOnChange((prev) => ({
                                        ...prev,
                                        password: regexChecker('password', text)
                                    }));
                                }}
                                placeholderTextColor={theme.secondary_variant}
                                value={password}
                                textContentType='password'
                                autoCapitalize='none'
                                autoCorrect={false}
                                autoComplete='off'
                                blurOnSubmit={false}
                                onSubmitEditing={({ nativeEvent: { text }}) => {
                                    if (disabledCondition()) {
                                        setOnChange((prev) => ({
                                            ...prev,
                                            password: regexChecker('password', text)
                                        }));
                                        return;
                                    } else {
                                        handleLogin();
                                    }
                                }}
                            />

                            <Pressable hitSlop={20} style={styles.eye} onPress={() => setPasswordShow(!passwordShow)}>
                                {passwordShow 
                                    ? <Entypo name="eye" size={20} color={theme.secondary_color} />
                                    : <Entypo name="eye-with-line" size={20} color={theme.secondary_color} />
                                }
                            </Pressable>
                        </View>
                        <Text style={styles.error}>{!onChange.password && t(templateConstants.auth_patterns_error['password'])}</Text>

                        <SecondaryContainedButton 
                            buttonFreeStyle={styles.button} 
                            textFreeStyle={styles.buttonText}
                            onPress={handleLogin}
                            disabled={disabledCondition()} 
                            buttonText={'登录'} 
                            loading={loading || oauthLoginLoading}
                        />
                    </View>
                }
    
                <View style={styles.bar}>
                    <Text style={{ fontSize: theme.font_size_icontext, color: theme.secondary_variant }}>{`${t("仅短信验证过的手机号可用来登录")}`}</Text>
                </View>

                <View style={styles.bar}>
                    <Pressable hitSlop={10} onPress={() => navigation.navigate(`${t("输入手机号")}`, { verificationType: "RESET" })}> 
                        <Text style={styles.link}> {`${t("忘记密码")}`} </Text> 
                    </Pressable>

                    <Pressable hitSlop={10} onPress={() => navigation.navigate(`${t("注册")}`)}> 
                        <Text style={styles.link}> {`${t("现在注册")}`} </Text> 
                    </Pressable>
                </View>

                <View style={styles.oauthContainer}>
                    {Object.values(loginApp).some(v=>v) &&
                        <View style={styles.oauthLoginContainer}>
                            {(loginApp["微信"]) && 
                                <Pressable 
                                    hitSlop={10} 
                                    onPress={handleWechatLogin} 
                                    style={({ pressed }) => [{ borderRadius: 100, width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }, pressed ? { backgroundColor: theme.secondary_color } : { backgroundColor: theme.secondary_variant }]}
                                >
                                    <MaterialCommunityIcons name="wechat" size={16} color={theme.fill_base} />
                                </Pressable>}

                            {(loginApp["苹果"]) && 
                                <Pressable 
                                    hitSlop={10} 
                                    onPress={handleAppleLogin} 
                                    style={({ pressed }) => [{ borderRadius: 100, width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }, pressed ? { backgroundColor: theme.secondary_color } : { backgroundColor: theme.secondary_variant }]}
                                >
                                    <MaterialCommunityIcons name="apple" size={16} color={theme.fill_base} />
                                </Pressable>}
                        </View>
                    }

                    <View style={styles.checkbox}>
                        <Checkbox.Item
                            onPress={() => setAccepted(!accepted)}
                            mode="android"
                            position="leading"
                            status={accepted ? "checked" : "unchecked"}   
                            style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}                         
                            color={theme.secondary_color}
                        />

                        <Text style={{ fontSize: theme.font_size_icontext, color: theme.text_color }}>{`${t("我已阅读并接受")}`}</Text>
                        <Pressable hitSlop={10} onPress={() => navigation.navigate(`${t("用户协议")}`)}> 
                            <Text style={[styles.link]}>{`${t("《用户协议》")}`}</Text> 
                        </Pressable>
                        
                        <Text style={{ fontSize: theme.font_size_icontext, color: theme.text_color }}>{`${t("和")}`}</Text>

                        <Pressable hitSlop={10} onPress={() => navigation.navigate(`${t("隐私政策")}`)}> 
                            <Text style={[styles.link]}>{`${t("《隐私政策》")}`}</Text> 
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScrollView>
    </Container>
}

export default Login;
