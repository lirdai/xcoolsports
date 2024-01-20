import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Pressable, Text, View, BackHandler, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import urlConstants from '@xcoolsports/constants/urls';
import templateConstants from '@xcoolsports/constants/templateConstants';
import { ThemeContext } from '@xcoolsports/constants/theme';
import Image from '@xcoolsports/components/utils/Image';
import Container from '@xcoolsports/components/Common/Container';
import styles from '@xcoolsports/components/LoginUserTabs/Notifications/style';
import Empty from '@xcoolsports/components/Common/Pages/Empty';
import End from '@xcoolsports/components/Common/Pages/End';
import Loading from '@xcoolsports/components/Common/Pages/Loading';
import RenderError from '@xcoolsports/components/Common/Pages/RenderError';
import { selectCurrentUser, api, selectLanguage, selectAdventure } from '@xcoolsports/data';

const Interactions = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const [interactions, setInteractions] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);

    const currentUser = useSelector(selectCurrentUser);
    const language = useSelector(selectLanguage);
    const adventure = useSelector(selectAdventure);
    const theme = useContext(ThemeContext);
    const { data, isLoading, isFetching, isError, error } = api.endpoints.getInteractionList.useQuery({ page }, { skip: !hasNext });
    const [updateNotificationNumberAsRead] = api.endpoints.updateNotificationNumberAsRead.useMutation();
    const { data: latestId = { read_interaction: 0 } } = api.endpoints.getLastNotificationReadID.useQuery();

    const fetchNextPage = () => {
        if (!isFetching && !isError && hasNext) setPage((prev) => prev + 1);
    }

    useEffect(() => {
        if (data && !isFetching) setHasNext(data.hasNext);
    }, [data?.hasNext, isFetching]);

    useEffect(() => {
        if (data?.interactions) setInteractions((prev) => prev.concat(data.interactions))
    }, [data?.interactions]);

    const handleMarkAsRead = async () => {
        if (currentUser?.num_notifications && currentUser?.num_notifications?.num_interactions !== 0 && interactions.length > 0) {
            await updateNotificationNumberAsRead({
                type: "interaction",
                id: interactions[0].id,
            });
        }
    };

    const onGoBack = () => {
        handleMarkAsRead();
        return false;
    };

    useFocusEffect(useCallback(() => {
        const backLisener = BackHandler.addEventListener("hardwareBackPress", onGoBack);
        return () => backLisener.remove()
    }, []));

    const isEmpty = !isLoading && interactions && interactions.length === 0;

    return (
        <Container
            header={{
                title: `${t('互动')}`,
                headerTitle: { showTitle: true },
                headerLeft: { onPress: () => { handleMarkAsRead(); navigation.goBack(); } },
                headerRight: {},
            }}
        >
            <Loading isLoading={isLoading} />
            <RenderError isError={!isLoading && isError} error={error} />
            <Empty isEmpty={isEmpty && !isError} />
            {(!isLoading && !isError && !isEmpty && interactions) &&
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={{ width: '100%' }}
                    onEndReached={fetchNextPage}
                    onEndReachedThreshold={0.5}
                    data={interactions}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                        if (item?.related_data?.error) {
                            return (
                                <View style={[{ borderBottomColor: theme.fill_disabled }, ...styles.fixedBox, ...styles.center, ...(item.id <= latestId.read_interaction ? styles.read : { backgroundColor: theme.fill_placeholder })]}>
                                    <Text style={{ color: theme.text_color }}> {t('此条消息已被删除')} </Text>
                                </View>
                            )
                        }

                        return (
                            <View key={item.id} style={{ ...(item.id <= latestId.read_interaction ? styles.read : { backgroundColor: theme.fill_placeholder }) }}>
                                {item.notification_type === 'FOLLOW' && (
                                    <Pressable
                                        hitSlop={10}
                                        style={({ pressed }) => [styles.fixedBox, { borderBottomColor: theme.fill_disabled }, pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}
                                        onPress={() => {
                                            item?.sender?.username
                                                ? navigation.push(`${t('看用户')}`, { usernameURL: item?.sender?.username })
                                                : null
                                        }}
                                    >
                                        <Image
                                            containerStyle={styles.smallAvatar}
                                            isSelectedUploading={false}
                                            editMode={false}
                                            showloading={false}
                                            source={item?.sender?.avatar ? { uri: `${urlConstants.images}/${item?.sender?.avatar}` } : require('@xcoolsports/static/avatar.jpg')}
                                            resizeMode="cover"
                                        />

                                        <View style={styles.title}>
                                            <Text numberOfLines={1} style={{ color: theme.text_color }}>{item?.sender?.nickname || `${t('该用户不存在')}`}</Text>
                                            <Text style={{ color: theme.text_color }}>{t(templateConstants.notification_type[item.notification_type])}</Text>
                                        </View>
                                    </Pressable>
                                )}

                                {item.notification_type === 'REPLY' && (
                                    <Pressable
                                        hitSlop={10}
                                        style={({ pressed }) => [styles.fixedBox, { borderBottomColor: theme.fill_disabled }, pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}
                                        onPress={() => navigation.push(`${t('看日记')}`, { topicId: item.related_data.topic.id, eventId: item.related_data.event_plan_id, commentId: item.related_data.self.id })}
                                    >
                                        <Image
                                            containerStyle={styles.smallAvatar}
                                            isSelectedUploading={false}
                                            editMode={false}
                                            showloading={false}
                                            source={item?.sender?.avatar ? { uri: `${urlConstants.images}/${item?.sender?.avatar}` } : require('@xcoolsports/static/avatar.jpg')}
                                            resizeMode="cover"
                                        />

                                        <View style={styles.title}>
                                            <Text numberOfLines={1} style={{ color: theme.text_color }}>{item?.sender?.nickname || `${t('该用户不存在')}`}</Text>
                                            <Text style={{ color: theme.text_color }} numberOfLines={3}>{t('在')} {item.related_data.topic.title} {t('帖子中')} {t(templateConstants.notification_type[item.notification_type])}</Text>
                                        </View>
                                    </Pressable>
                                )}

                                {item.notification_type === 'BANTPC' && (
                                    <Pressable
                                        hitSlop={10}
                                        style={({ pressed }) => [styles.fixedBox, { borderBottomColor: theme.fill_disabled }, pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}
                                    >
                                        <View style={styles.systemIcon}>
                                            <MaterialIcons name="verified-user" size={theme.icon_size} color={theme.fill_base} />
                                        </View>

                                        <View style={styles.title}>
                                            <Text style={{ color: theme.text_color }} numberOfLines={3}>{t("你的账号因为")} {item.related_data.content} {t("原因被封禁，请重新发送符合要求的帖子或评论")}</Text>
                                        </View>
                                    </Pressable>
                                )}

                                {item.notification_type === 'BANUSR' && (
                                    <Pressable
                                        hitSlop={10}
                                        style={({ pressed }) => [styles.fixedBox, { borderBottomColor: theme.fill_disabled }, pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}
                                    >
                                        <View style={styles.systemIcon}>
                                            <MaterialIcons name="verified-user" size={theme.icon_size} color={theme.fill_base} />
                                        </View>

                                        <View style={styles.title}>
                                            <Text numberOfLines={3} style={{ color: theme.text_color }}>{t("你的账号因为")} {item.related_data.content} {t("原因被封禁")}</Text>
                                            <Text style={{ color: theme.text_color }}>{t("解封时间为")}: {new Date(item.related_data.ends_at).toLocaleString({ language })}</Text>
                                        </View>
                                    </Pressable>
                                )}

                                {item.notification_type === 'ADVNTR' && (
                                    <Pressable
                                        hitSlop={10}
                                        style={({ pressed }) => [styles.fixedBox, { borderBottomColor: theme.fill_disabled }, pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}
                                    >
                                        <View style={styles.systemIcon}>
                                            <MaterialIcons name="verified-user" size={theme.icon_size} color={theme.fill_base} />
                                        </View>

                                        <View style={styles.title}>
                                            <Text numberOfLines={3} style={{ color: theme.text_color }}>{t(templateConstants.notification_type[item.notification_type])}</Text>
                                            <Text style={{ color: theme.text_color }}>{new Date(item.created_at).toLocaleString({ language })}</Text>
                                        </View>
                                    </Pressable>
                                )}

                                {item.notification_type === 'TICKET' && (
                                    <Pressable
                                        hitSlop={10}
                                        style={({ pressed }) => [styles.fixedBox, { borderBottomColor: theme.fill_disabled }, pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}
                                    >
                                        <View style={styles.systemIcon}>
                                            <MaterialIcons name="verified-user" size={theme.icon_size} color={theme.fill_base} />
                                        </View>

                                        <View style={styles.title}>
                                            <Text style={{ color: theme.text_color }} numberOfLines={1}>{t("管理员")}</Text>
                                            {item.related_data.ticket.status === 'CANCELLED'
                                                ?
                                                <Text style={{ color: theme.text_color }}>
                                                    {t("拒绝了您的")}
                                                    {t(templateConstants.notification_type[item.notification_type][item.related_data.ticket.ticket_type])}
                                                </Text>
                                                :
                                                <Text style={{ color: theme.text_color }}>
                                                    {t("接受了您的")}
                                                    {t(templateConstants.notification_type[item.notification_type][item.related_data.ticket.ticket_type])}
                                                </Text>
                                            }
                                        </View>
                                    </Pressable>
                                )}
                            </View>
                        )
                    }}
                    ListFooterComponent={isFetching ? <Loading isLoading={isFetching} style={{ justifyContent: 'flex-start' }} /> : <End />}
                />
            }
        </Container>
    );
}

export default Interactions;
