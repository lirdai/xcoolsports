import React, { useContext } from 'react';
import { View, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'

import PopUpModal from '@xcoolsports/components/utils/PopUpModal';
import styles from '@xcoolsports/components/Auth/style';
import { selectCurrentUser, api } from '@xcoolsports/data';
import {ThemeContext} from '@xcoolsports/constants/theme';

const DeleteUser = ({ navigation, deleteUserModal, setDeleteUserModal }) => {
    const { t, i18n } = useTranslation();
    const currentUser = useSelector(selectCurrentUser);
    const [deleteUser] = api.endpoints.deleteUser.useMutation();
    const theme = useContext(ThemeContext);

    const handleQuitDeleteUser = () => {
        navigation.navigate(`${t('主页')}`);
        setDeleteUserModal(false);
    };

    const handleDeleteUser = async () => {
        if (!currentUser.is_verified) {
            const response = await deleteUser();
            if (response.data) navigation.navigate(`${t('主页')}`);
            return;
        }

        navigation.navigate(`${t('输入手机号')}`, { verificationType: "DEACTIVATE" });
        setDeleteUserModal(false);
    };

    return (
        <PopUpModal
            title={t("注销账号")}
            onClose={() => setDeleteUserModal(false)}
            visible={deleteUserModal}
        >
            <View style={styles.modalContainer}>
                <Text style={[styles.modalTitle, {color: theme.text_color}]}>注销前请认真阅读以下提醒:</Text>
                <Text style={[styles.modalSmallTitle, {color: theme.text_color}]}>
                    为防止误操作，请再次确认是否注销账号并确认注销后的影响。
                    在此善意提醒，注销账号为不可回复的操作，建议在最终确定注销前自行备份本账号相关的所有信息。
                    并请再次确认与账号相关的所有服务均已进行妥善处理。
                    注销账号后将无法再使用本账号或找回本账号浏览、关注、添加、绑定的任何内容或信息（即使你实用相同的手机号码再次注册并使用顽酷)。
                </Text>
                <View style={styles.modalContent}>
                    <Pressable hitSlop={10} style={styles.modalButton} onPress={handleQuitDeleteUser}> 
                        <Text style={[styles.modalText, {color: theme.text_color}]}>{t("取消")}</Text> 
                    </Pressable>

                    <Pressable
                        hitSlop={10}
                        style={styles.modalButton}
                        onPress={handleDeleteUser}
                        onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                    >
                        <Text style={[styles.modalText, {color: theme.text_color}]}>{t("确定")}</Text> 
                    </Pressable>
                </View>
            </View>
        </PopUpModal>
    );
};

export default DeleteUser;