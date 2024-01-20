import React, { useRef, useState, useEffect, useContext } from 'react';
import { Pressable, Text, View, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import theme, { ThemeContext } from '@xcoolsports/constants/theme';
import SlideUpModal from '@xcoolsports/components/utils/SlideUpModal';
import styles from '@xcoolsports/components/Common/Buttons/style';
import { api, toastActions, toastTypes, selectCurrentUser } from '@xcoolsports/data';

const ReportUser = ({ username, navigation, onClose }) => {
    const { t, i18n } = useTranslation();
    const isMounted = useRef(true);
    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const theme = useContext(ThemeContext);

    const [openReport, setOpenReport] = useState(false);
    const [content, setContent] = useState('');

    const [createTicket] = api.endpoints.createTicket.useMutation();

    const handleReportSubmit = async () => {
        const newTopic = {
            title: '',
            content,
            related_data: { selfID: username },
            ticket_type: 'REPUSER',
        };

        const response = await createTicket(newTopic);

        if (response.data) {
            if (isMounted.current) {
                setContent('');
                setOpenReport(false);
                onClose();
            }
        }
    };

    useEffect(() => () => { isMounted.current = false; }, []);

    return (
        <View style={styles.container}>
            <Pressable hitSlop={10} onPress={() => {
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
                <Text style={[styles.text, { color: theme.text_color }]}>{t('八卦TA')}</Text>
            </Pressable>

            <SlideUpModal
                title={t('举报用户')}
                onClose={() => setOpenReport(false)}
                visible={openReport}
                onOk={handleReportSubmit}
                okTitle={t('提交')}
                disableOk={content === ''}
            >
                <View style={styles.modalContainer}>
                    <TextInput
                        placeholder={t('请输入内容')}
                        placeholderTextColor={theme.secondary_variant}
                        multiline={true}
                        numberOfLines={10}
                        maxLength={200}
                        clear={true}
                        style={{
                            marginBottom: theme.v_spacing_2xl, height: 200,
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

export default ReportUser;
