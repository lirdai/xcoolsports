import React, { useRef, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Pressable, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

import SlideUpModal from '@xcoolsports/components/utils/SlideUpModal/SlideUpModal';
import theme, { ThemeContext } from '@xcoolsports/constants/theme';
import styles from '@xcoolsports/components/Common/Buttons/style';
import { api, selectCurrentUser, toastActions, toastTypes } from '@xcoolsports/data';

const BlockUser = ({ username, navigation, onClose }) => {
    const { t, i18n } = useTranslation();
    const isMounted = useRef(true);
    const currentUser = useSelector(selectCurrentUser);
    const theme = useContext(ThemeContext);

    const dispatch = useDispatch();
    const [blockUser] = api.endpoints.blockUser.useMutation();

    const [openBlockModal, setOpenBlockModal] = useState(false);

    const handleBlackList = async () => {
        const newBlacklist = {
            username,
            unblock: false,
        };

        const response = await blockUser(newBlacklist);

        if (response.data && isMounted.current) {
            setOpenBlockModal(false);
            onClose();
        }
    };

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

                setOpenBlockModal(true);
                return;
            }}
                style={{ height: 40, width: '100%', backgroundColor: theme.fill_placeholder, justifyContent: 'center', alignItems: 'center', borderRadius: theme.radius_lg, marginVertical: theme.v_spacing_xs }}
            >
                <Text style={[styles.text, { color: theme.text_color }]}>{t('黑名单')}</Text>
            </Pressable>

            <SlideUpModal
                title={t('黑名单')}
                onClose={() => setOpenBlockModal(false)}
                visible={openBlockModal}
            >
                <View style={styles.modalContainer}>
                    <Text style={[styles.modalTitle, { color: theme.text_color }]}>
                        加入黑名单，你将不再收到对方的消息，并且你们互相看不到对方朋友圈的更新。
                    </Text>

                    <View style={styles.modalContent}>
                        <Pressable hitSlop={10} style={styles.modalButton} onPress={() => setOpenBlockModal(false)}>
                            <Text style={[styles.modalText, { color: theme.text_color }]}>{t('取消')}</Text>
                        </Pressable>

                        <Pressable
                            hitSlop={10}
                            style={styles.modalButton}
                            onPress={handleBlackList}
                            onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                        >
                            <Text style={[styles.modalText, { color: theme.text_color }]}>{t('确定')}</Text>
                        </Pressable>
                    </View>
                </View>
            </SlideUpModal>
        </View>
    )
};

export default BlockUser;
