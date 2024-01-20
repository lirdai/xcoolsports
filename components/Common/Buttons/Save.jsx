import React, { useContext } from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AntDesign } from '@expo/vector-icons'; 
import { useTranslation } from 'react-i18next';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import { api, toastActions, toastTypes, selectCurrentUser } from '@xcoolsports/data';
import AnimatedReactionIcons from '@xcoolsports/components/utils/AnimationComponents/AnimatedReactionIcons';

const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row', 
        alignItems: 'center'
    },
    textCenter: {
        textAlign: 'center',
        fontSize: theme.font_size_base,
    },
})

const Save = ({ style, topic, navigation }) => {
    const { t, i18n } = useTranslation();
    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const theme = useContext(ThemeContext);

    const [updateTopicSave] = api.endpoints.updateTopicSave.useMutation();

    const handleSaveSubmit = async () => {
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

        const newSave = {
            topicID: topic.id,
            save: topic.i_save === 0,
        };

        await updateTopicSave(newSave);
    };

    return (
        <View style={[styles.container, style]}>
            {topic?.i_save === 1
                ? 
                <Pressable 
                    hitSlop={{top:10, bottom:10, right:10, left: 10}}
                    onPress={handleSaveSubmit}
                >
                    <AntDesign name="star" size={theme.icon_size} color={theme.brand_wait} />
                </Pressable>
                : 
                <AnimatedReactionIcons 
                    containerStyle={styles.container}
                    hitSlop={{top:10, bottom:10, right:30}}
                    onPress={handleSaveSubmit}
                    onPressInComponent={<AntDesign name="staro" size={theme.icon_size} color={theme.secondary_variant} />}
                >
                    <AntDesign name="staro" size={theme.icon_size} color={theme.secondary_variant} />
                </AnimatedReactionIcons>
            }

            <View pointerEvents='none'>
                <Text style={[{color: theme.secondary_variant}, styles.textCenter]}> {topic?.num_saves} </Text>
            </View>
        </View>
    )
}

export default Save;