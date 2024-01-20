import React, { useContext } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import theme, { ThemeContext } from '@xcoolsports/constants/theme';
import styles from '@xcoolsports/components/Common/Buttons/style';
import { toastActions, toastTypes, selectCurrentUser, selectAnyById } from '@xcoolsports/data';

const Edit = ({ id, navigation, onClose }) => {
    const { t, i18n } = useTranslation();
    const currentUser = useSelector(selectCurrentUser);
    const theme = useContext(ThemeContext);

    const { topicId, eventId, commentId } = useSelector((state) => selectAnyById(state, id));
    const dispatch = useDispatch();

    return (
        <View style={styles.container}>
            <Pressable
                hitSlop={10}
                onPress={() => {
                    if (!currentUser.is_verified) {
                        navigation.navigate(`${t("输入手机号")}`, { verificationType: "VERIFYPHONE" });
                        dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '记得要验证手机号哦' }));
                        return;
                    } else if (currentUser.is_banned.users) {
                        dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '账号被封, 请耐心等待' }));
                        return;
                    }

                    navigation.push(`${t('写日记')}`, { topicId, eventId, commentId });
                    onClose();
                    return;
                }}
                style={{ height: 40, width: '100%', backgroundColor: theme.fill_placeholder, justifyContent: 'center', alignItems: 'center', borderRadius: theme.radius_lg, marginVertical: theme.v_spacing_xs }}
            >
                <Text style={[styles.text, { color: theme.text_color }]}>{t('编辑')}</Text>
            </Pressable>
        </View>
    )
};

export default Edit;
