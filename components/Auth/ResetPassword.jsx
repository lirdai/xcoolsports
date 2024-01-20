import React, { useRef, useState, useEffect, useContext } from 'react';
import { Pressable, ScrollView, Text, View, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import { Entypo } from '@expo/vector-icons'; 
import { useTranslation } from 'react-i18next'

import {ThemeContext} from '@xcoolsports/constants/theme';
import regexChecker from '@xcoolsports/utils/regexChecker';
import templateConstants from '@xcoolsports/constants/templateConstants';
import Container from '@xcoolsports/components/Common/Container';
import { toastActions, toastTypes, api, selectCurrentUser } from '@xcoolsports/data';
import styles from '@xcoolsports/components/Auth/style';
import SecondaryContainedButton from '@xcoolsports/components//utils/Buttons/SecondaryContainedButton';

const options = {
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
    },
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
}
zxcvbnOptions.setOptions(options);

const ResetPassword = ({ route, navigation }) => {
    const { t, i18n } = useTranslation();
    const { token } = route.params;
    const isMounted = useRef(true);
    const confirmationRef = useRef();
    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const theme = useContext(ThemeContext);

    const [ password, setPassword ] = useState('');
    const [ confirmation, setConfirmation ] = useState('');
    const [ passwordShow, setPasswordShow ] = useState(true);
    const [ confirmationShow, setConfirmationShow ] = useState(true);
    const [ loading, setLoading ] = useState(false);
    const [ onChange, setOnChange ] = useState({
        password: true,
        confirmation: true,
    });
    
    const [resetPassword] = api.endpoints.resetPassword.useMutation();

    const handleResetPassword = async () => {
        setLoading(true);
        const newObject = {
            password,
            token,
        };

        if (confirmation === password) {
            const response = await resetPassword(newObject);
            if (response.data) {
                if (currentUser.is_logged_in) navigation.navigate(`${t('我')}`);
                if (!currentUser.is_logged_in) navigation.navigate(`${t('顽酷')}`);
                if (isMounted.current) {
                    setPassword("");
                    setConfirmation("");
                }
            }
        } else {
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '两次密码不一致' }));
        }

        setLoading(true);
    };
  
    useEffect(() => () => { isMounted.current = false }, []);
    const disabledCondition = zxcvbn(password).score === 0 || password === '' || confirmation === '' || !onChange.password || !onChange.confirmation;
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
                title: `${t('重设密码')}`, 
                headerTitle: {showTitle: true}, 
                headerLeft: { onPress: navigation.goBack },
                headerRight: {},
            }}
        >
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} vertical>
                <View style={styles.innerContainer}>
                    <Text style={[styles.title, {color: theme.text_color}]}>{`${t('顽酷新密码')}`}</Text>
                    <View style={[{...styles.inputContainerDefault, ...(onChange.password ? {} : styles.inputContainerError)}, {backgroundColor: theme.fill_placeholder}]}>
                        <TextInput
                            style={[styles.input, {color: theme.text_color}]}
                            placeholder={`${t('顽酷新密码')}`}
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

                    <Text style={[styles.title, {color: theme.text_color}]}>{`${t('确认新密码')}`}</Text>
                    <View style={[{...styles.inputContainerDefault, ...(onChange.confirmation ? {} : styles.inputContainerError)}, {backgroundColor: theme.fill_placeholder}]}>
                        <TextInput
                            ref={confirmationRef}
                            style={[styles.input, {color: theme.text_color}]}
                            placeholder={`${t('确认新密码')}`}
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
                                    handleResetPassword();
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
                    
                    <SecondaryContainedButton 
                        buttonFreeStyle={styles.button} 
                        textFreeStyle={styles.buttonText}
                        onPress={handleResetPassword}
                        disabled={disabledCondition} 
                        loading={loading}
                        buttonText={'修改密码'} 
                    />
                </View>
            </ScrollView>
        </Container>
    );
};

export default ResetPassword;
