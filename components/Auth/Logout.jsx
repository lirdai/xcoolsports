import React, { useContext } from 'react';
import { Pressable, View, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'

import PopUpModal from '@xcoolsports/components/utils/PopUpModal';
import styles from '@xcoolsports/components/Auth/style';
import { selectCurrentUser, api, selectPushNotificationToken } from '@xcoolsports/data';
import {ThemeContext} from '@xcoolsports/constants/theme';

const Logout = ({ logoutModal, setLogoutModal }) => {
    const { t, i18n } = useTranslation();
    const currentUser = useSelector(selectCurrentUser);
    const pushNotificationToken = useSelector(selectPushNotificationToken);
    const theme = useContext(ThemeContext);

    const [deletePushNotification] = api.endpoints.deletePushNotification.useMutation();
    const [logout] = api.endpoints.logout.useMutation();
    const handleLogout = async () => {
        await logout();
        await deletePushNotification({ token: pushNotificationToken });
    }

    return (
        <PopUpModal
            title={t("退出登录")}
            onClose={() => setLogoutModal(false)}
            visible={logoutModal}
        >
            <View style={styles.modalContainer}>
                <Text style={[styles.modalTitle, {color: theme.text_color}]}> {t("退出登录")}? </Text>
                <Text style={[styles.modalSmallTitle, {color: theme.text_color}]}> @ {currentUser.username} </Text>
                <View style={styles.modalContent}>
                    <Pressable hitSlop={10} style={styles.modalButton} onPress={() => setLogoutModal(false)}> 
                        <Text style={[styles.modalText, {color: theme.text_color}]}>{t("取消")}</Text> 
                    </Pressable>

                    <Pressable
                        hitSlop={10}
                        style={styles.modalButton}
                        onPress={handleLogout}
                        onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                    >
                        <Text style={[styles.modalText, {color: theme.text_color}]}>{t("确定")}</Text> 
                    </Pressable>
                </View>
            </View>
        </PopUpModal>
    );
};

export default Logout;