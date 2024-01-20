import React, { useRef, useState, useEffect, useContext } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'

import regexChecker from '@xcoolsports/utils/regexChecker';
import PhoneNumber from '@xcoolsports/components/utils/PhoneNumber';
import templateConstants from '@xcoolsports/constants/templateConstants';
import { selectCurrentUser, api } from '@xcoolsports/data';
import styles from '@xcoolsports/components/Auth/style';
import Container from '@xcoolsports/components/Common/Container';
import {ThemeContext} from '@xcoolsports/constants/theme';
import SecondaryContainedButton from '@xcoolsports/components//utils/Buttons/SecondaryContainedButton';

const Phone = ({ route, navigation }) => {
    const { t, i18n } = useTranslation();
    const { verificationType } = route.params;
    const currentUser = useSelector(selectCurrentUser);
    const isMounted = useRef(true);
    const theme = useContext(ThemeContext);

    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [onChange, setOnChange] = useState({
        phone: true,
    });
    const [countryCode, setCountryCode] = useState({
        "short": "CA",
        "name": "加拿大",
        "en": "Canada",
        "tel": "1",
        "pinyin": "jnd",
    });

    const [updateUserProfile] = api.endpoints.updateUserProfile.useMutation();

    const handleNewPhone = async () => {
        setLoading(true);
        if (verificationType === "VERIFYPHONE") {
            const response = await updateUserProfile({ username: currentUser.username, body: { phone: countryCode.tel + phone } });
            if (response.data) {
                navigation.navigate(`${t('验证手机号')}`, { phone: countryCode.tel + phone, verificationType });
            }
        } else if (verificationType === 'RESET') {
            navigation.navigate(`${t('验证手机号')}`, { phone: countryCode.tel + phone, verificationType });
        } else if (verificationType === "DEACTIVATE") {
            navigation.navigate(`${t('验证手机号')}`, { phone: countryCode.tel + phone, verificationType });
        }

        if (isMounted.current) { 
            setPhone('') 
            setLoading(false);
        }
    };
  
    useEffect(() => () => { isMounted.current = false; }, []);
    const disabledCondition = phone === '' || !onChange.phone;

    return (
        <Container 
            header={{ 
                title: `${t('输入手机号')}`, 
                headerTitle: { showTitle: true }, 
                headerLeft: { onPress: navigation.goBack },
                headerRight: {},
            }}
        >
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} vertical>
                <View style={styles.innerContainer}>
                    <Text style={[styles.title, {color: theme.text_color}]}>{`${t('请输入要验证的手机号')}`}</Text>
                    <PhoneNumber
                        placeholder={`${t('请输入要验证的手机号')}`}
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
                        blurOnSubmit={false}
                        onSubmitEditing={({ nativeEvent: { text }}) => {
                            if (disabledCondition) {
                                setOnChange((prev) => ({
                                    ...prev,
                                    phone: regexChecker('phone', text)
                                }));
                                return;
                            } else {
                                handleNewPhone();
                            }
                        }}
                    />

                    <Text style={styles.error}>{!onChange.phone && t(templateConstants.auth_patterns_error['phone'])}</Text>
                    <Text style={{ fontSize: theme.font_size_icontext, color: theme.secondary_variant }}>{`${t('仅短信验证过的手机号可修改密码')}`}</Text>
                    
                    <SecondaryContainedButton 
                        buttonFreeStyle={styles.button} 
                        textFreeStyle={styles.buttonText}
                        onPress={handleNewPhone}
                        disabled={disabledCondition} 
                        buttonText={'下一步'} 
                        loading={loading}
                    />
                </View>
            </ScrollView>
        </Container>
    );
};

export default Phone;