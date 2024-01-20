import React, { useRef, useState, useEffect, useContext } from 'react';
import { Pressable, Text, View, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RadioButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import SlideUpModal from '@xcoolsports/components/utils/SlideUpModal/SlideUpModal';
import theme, { ThemeContext } from '@xcoolsports/constants/theme';
import styles from '@xcoolsports/components/Common/Buttons/style';
import { api, toastActions, toastTypes, selectCurrentUser, selectAnyById, selectLanguage } from '@xcoolsports/data';

const ReportTopic = ({ id, navigation, onClose }) => {
    const { t, i18n } = useTranslation();
    const currentUser = useSelector(selectCurrentUser);
    const language = useSelector(selectLanguage);
    const { topicId, eventId, commentId } = useSelector((state) => selectAnyById(state, id));
    const dispatch = useDispatch();
    const isMounted = useRef(true);
    const theme = useContext(ThemeContext);

    const [createTicket] = api.endpoints.createTicket.useMutation();

    const [openReport, setOpenReport] = useState(false);
    const [content, setContent] = useState('');
    const [selectedValue, setSelectedValue] = useState('');

    const handleReportSubmit = async () => {
        const newTopic = {
            title: selectedValue,
            content,
            related_data: { topicId, eventId, commentId },
            ticket_type: 'REPTPC',
        };

        const response = await createTicket(newTopic);
        if (response.data && isMounted.current) {
            setContent('');
            setOpenReport(false);
            onClose();
        }
    };

    useEffect(() => () => { isMounted.current = false; }, []);
    const reportItems = [`${t('违法违禁')}`, `${t('血腥暴力')}`, `${t('色情')}`, `${t('低俗')}`, `${t('赌博诈骗')}`, `${t('人身攻击')}`, `${t('谣言')}`, `${t('虚假不实信息')}`, `${t('侵权申诉')}`];

    return (
        <View style={styles.container}>
            <Pressable
                hitSlop={10}
                onPress={() => {
                    if (!currentUser.is_logged_in) {
                        navigation.navigate(`${t('登录')}`);
                        return;
                    } else if (!currentUser.is_verified) {
                        navigation.navigate(`${t("输入手机号")}`, { verificationType: "VERIFYPHONE" });
                        dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '记得要验证手机号哦' }));
                        return;
                    } else if (currentUser.is_banned.users) {
                        dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '账号被封, 请耐心等待' }));
                        return;
                    }

                    setOpenReport(true);
                    return;
                }}
                style={{ height: 40, width: '100%', backgroundColor: theme.fill_placeholder, justifyContent: 'center', alignItems: 'center', borderRadius: theme.radius_lg, marginVertical: theme.v_spacing_xs }}
            >
                <Text style={[styles.text, { color: theme.text_color }]}>{t('举报帖子')}</Text>
            </Pressable>


            <SlideUpModal
                title={t('举报帖子')}
                onClose={() => setOpenReport(false)}
                visible={openReport}
                onOk={handleReportSubmit}
                okTitle={t('提交')}
                disableOk={content === '' || selectedValue === ''}
            >
                <View style={styles.modalContainer}>
                    <RadioButton.Group onValueChange={newValue => setSelectedValue(newValue)} value={selectedValue}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {reportItems.map(sub => ({ label: sub, value: sub })).map(({ label, value }) =>
                                <View key={label} style={[language === 'en' ? styles.oneRadio : styles.twoRadios]}>
                                    <RadioButton.Item
                                        color={theme.text_color}
                                        labelStyle={{ color: theme.text_color }}
                                        mode="android"
                                        position="leading"
                                        label={label}
                                        value={value}
                                    />
                                </View>
                            )}
                        </View>
                    </RadioButton.Group>

                    <TextInput
                        placeholder={t('请输入内容')}
                        placeholderTextColor={theme.secondary_variant}
                        multiline={true}
                        numberOfLines={10}
                        maxLength={200}
                        clear={true}
                        style={{
                            marginVertical: theme.v_spacing_lg, height: 100,
                            borderColor: theme.fill_disabled, borderWidth: 1,
                            padding: theme.v_spacing_md,
                            color: theme.text_color,
                            textAlignVertical: 'top'
                        }}
                        value={content}
                        onChangeText={(text) => setContent(text)}
                    />
                </View>
            </SlideUpModal>
        </View>
    )
};

export default ReportTopic;
