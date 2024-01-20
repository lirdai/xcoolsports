import React, { useContext } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import urlConstants from '@xcoolsports/constants/urls';
import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import Image from '@xcoolsports/components/utils/Image';
import { selectCurrentUser, api, selectUserByUsername, toastActions, toastTypes } from '@xcoolsports/data';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 100,
        marginHorizontal: theme.h_spacing_md,
    },
    nickname: {
        width: 150,
        fontSize: theme.font_size_caption_sm,
    },
    button: {
        height: 30,
        borderWidth: 1,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.h_spacing_md,
    },
    buttonText: {
        fontSize: theme.font_size_caption_sm,
    },
});

const TopicHeaderTitle = ({ navigation, topic }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const topicAuthor = useSelector((state) => selectUserByUsername(state, topic?.author?.username));
    const theme = useContext(ThemeContext);

    const [updateFollow] = api.endpoints.updateFollow.useMutation();
    const handleFollow = async () => {
        const newFollow = {
            followee: topicAuthor.username,
            i_follow: 1 - topicAuthor.i_follow,
        };

        await updateFollow(newFollow);
    };

    if (!topic) return null;

    return (
        <View style={styles.container}>
            <Pressable
                hitSlop={5}
                onPress={() => {
                    topic.author?.username
                        ? navigation.push(`${t('看用户')}`, { usernameURL: topic.author.username })
                        : null
                }}
                style={styles.title}
            >
                <Image
                    containerStyle={styles.avatar}
                    isSelectedUploading={false}
                    editMode={false}
                    showloading={false}
                    source={topic.author?.avatar ? { uri: `${urlConstants.images}/${topic.author.avatar}` } : require('@xcoolsports/static/avatar.jpg')}
                    resizeMode="cover"
                />

                <Text style={[{color: theme.text_color}, styles.nickname]}>{topic.author?.nickname || `${t('用户不存在')}`}</Text>
            </Pressable>

            {topicAuthor?.username && currentUser?.username && topic.author?.username !== currentUser?.username &&
                <Pressable style={[{borderColor: theme.fill_disabled}, styles.button]}
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

                        handleFollow();
                        return;
                    }}
                    onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                    {topicAuthor.i_follow === 0 && topicAuthor.follow_me === 0 && <Text style={[styles.buttonText, {color: theme.text_color}]}>{t('关注TA')}</Text>}
                    {topicAuthor.i_follow === 0 && topicAuthor.follow_me === 1 && <Text style={[styles.buttonText, {color: theme.text_color}]}>{t('回关')}</Text>}
                    {topicAuthor.i_follow === 1 && topicAuthor.follow_me === 0 && <Text style={[styles.buttonText, {color: theme.text_color}]}>{t('已关注')}</Text>}
                    {topicAuthor.i_follow === 1 && topicAuthor.follow_me === 1 && <Text style={[styles.buttonText, {color: theme.text_color}]}>{t('互相关注')}</Text>}
                </Pressable>
            }
        </View>
    );
};

export default TopicHeaderTitle;