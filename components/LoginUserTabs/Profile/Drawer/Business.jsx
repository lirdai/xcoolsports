import React, { useState, useContext } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import Container from '@xcoolsports/components/Common/Container';
import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import Loading from '@xcoolsports/components/Common/Pages/Loading';
import getDateFormat from '@xcoolsports/utils/getDateFormat';
import iso8601 from '@xcoolsports/utils/ios8601';
import getTimeFormat from '@xcoolsports/utils/getTimeFormat';
import ScrollSelector from '@xcoolsports/components/utils/ScrollSelector';
import CountdownTimer from '@xcoolsports/utils/CountdownTimer';
import Image from '@xcoolsports/components/utils/Image';
import urlConstants from '@xcoolsports/constants/urls';
import { api } from '@xcoolsports/data';
import SecondaryContainedButton from '@xcoolsports/components/utils/Buttons/SecondaryContainedButton';
import InfiniteList from '@xcoolsports/components/utils/InfiniteList';

const styles = StyleSheet.create({
    shadow: {
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 20,
        height: 20,
        borderRadius: 100,
    },
    nickname: {
        width: 150,
        fontSize: theme.font_size_caption_sm,
        marginHorizontal: theme.h_spacing_md,
    },
});

const OrderCard = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const theme = useContext(ThemeContext);

    return (
        <View style={{ flex: 1 }}>
            <InfiniteList
                useQuery={api.endpoints.getMyBusinessList.useQuery}
                sortComparer={(a, b) => a.id > b.id ? -1 : 1}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                    if (!item) return <Loading isLoading={!item} />
                    
                    if (item.start && item.end)
                    return (
                        <Pressable 
                            style={({ pressed }) => [
                                styles.shadow,
                                { backgroundColor: theme.fill_base, shadowColor: theme.secondary_color, borderWidth: 1, borderColor: theme.fill_disabled, borderRadius: 10, height: 300, justifyContent: 'space-between', padding: theme.v_spacing_lg, margin: theme.v_spacing_lg },
                                pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}
                            ]}
                            onPress={() => navigation.navigate(`${t('生成订单')}`,  { eventId: item.event_plan_id, orderId: item.id, start: new Date(item.start).toUTCString(), end: new Date(item.end).toUTCString(), party: item.party })}
                        >
                            <Pressable
                                hitSlop={5}
                                onPress={() => {
                                    item?.user?.username
                                        ? navigation.push(`${t('看用户')}`, { usernameURL: item.user.username })
                                        : null
                                }}
                                style={styles.title}
                            >
                                <Image
                                    containerStyle={styles.avatar}
                                    isSelectedUploading={false}
                                    editMode={false}
                                    showloading={false}
                                    source={item.event_planner?.avatar ? { uri: `${urlConstants.images}/${item.event_planner.avatar}` } : require('@xcoolsports/static/avatar.jpg')}
                                    resizeMode="cover"
                                />

                                <Text style={[styles.nickname, {color: theme.text_color}]} numberOfLines={2}>{item.user?.nickname || `${t('用户不存在')}`}</Text>
                            </Pressable>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text numberOfLines={2} style={{ color: theme.text_color, fontSize: theme.font_size_heading, fontWeight: 'bold', width: '80%' }}>{item.event_name}</Text>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: theme.font_size_icontext, color: theme.text_color }}>{item.party} {t('人')}</Text>
                                </View>
                            </View>
                            <Text style={{ color: theme.secondary_variant }}>{t('订单号')}: {item.id}</Text>
                            <Text style={{color: theme.text_color}}>{getDateFormat(new Date(item.start))} {getTimeFormat(new Date(item.start))} - {getDateFormat(new Date(item.end))} {getTimeFormat(new Date(item.end))} </Text>

                            <CountdownTimer eventDate={new Date(item.start)} orderStatus={item.status} />

                            <View style={{ flexDirection: 'row', width: '100%', height: 35, justifyContent: 'space-between', alignItems: 'center' }}>
                                {item.price_type === 'PERSONHOUR' && <Text style={{ fontSize: theme.icon_size_md, fontWeight: 'bold', color: theme.text_color }}>$ {item.price * iso8601(item.duration) * item.party}</Text>}
                                {item.price_type === 'HOUR' && <Text style={{ fontSize: theme.icon_size_md, fontWeight: 'bold', color: theme.text_color }}>$ {item.price * iso8601(item.duration)}</Text>}
                                {item.price_type === 'PERSON' && <Text style={{ fontSize: theme.icon_size_md, fontWeight: 'bold', color: theme.text_color }}>$ {item.price * item.party}</Text>}
                                {item.price_type === 'TOTAL' && <Text style={{ fontSize: theme.icon_size_md, fontWeight: 'bold', color: theme.text_color }}>$ {item.price}</Text>}

                                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: theme.secondary_color, padding: theme.v_spacing_sm, borderRadius: 6 }}>
                                    <Text style={{ color: theme.text_color, fontWeight: 'bold', fontSize: 16 }}>{t(item.status)}</Text>
                                </View>
                            </View>
                        </Pressable>
                    );
                }}
            />
        </View>
    );
};

const EventCard = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const theme = useContext(ThemeContext);

    return (
        <View style={{ flex: 1 }}>
            <InfiniteList
                useQuery={api.endpoints.getMyEventList.useQuery}
                sortComparer={(a, b) => a.id > b.id ? -1 : 1}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                    if (!item) return <Loading isLoading={!item} />
                    
                    return (
                        <Pressable 
                            style={({ pressed }) => [
                                styles.shadow,
                                { backgroundColor: theme.fill_base, shadowColor: theme.secondary_color, borderWidth: 1, borderColor: theme.fill_disabled, borderRadius: 10, height: 250, justifyContent: 'space-between', padding: theme.v_spacing_lg, margin: theme.v_spacing_lg },
                                pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}
                            ]}
                            onPress={() => navigation.navigate(`${t('活动概览')}`, { event_plan_id: item.event_plan_id, event_id: item.id })}
                        >
                            <Text numberOfLines={2} style={{ color: theme.text_color, fontSize: theme.font_size_heading, fontWeight: 'bold' }}>{item.event_name}</Text>
                            <Text style={{color: theme.text_color}}>{getDateFormat(new Date(item.start))} {getTimeFormat(new Date(item.start))} - {getDateFormat(new Date(item.end))} {getTimeFormat(new Date(item.end))}</Text>                                    
                            <Text style={{color: theme.text_color}}>{t('已有')} {item.num_guests} {t('人报名, 最多可再加入')} {item.max_guests} {t('人')}</Text>

                            <SecondaryContainedButton
                                buttonFreeStyle={{height: 50, marginVertical: theme.v_spacing_lg}} 
                                textFreeStyle={{fontSize: theme.font_size_caption}}
                                onPress={() => navigation.navigate(`${t('二维码扫码')}`, { eventId: item.id })}
                                buttonText={'签到'} 
                            />
                        </Pressable>
                    );
                }}
            />
        </View>
    );
};

// 已过期 + 用户取消的收不到
const Business = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const [tabRoute, setTabRoute] = useState("orders");

    return (
        <Container 
            header={{ 
                title: `${t('我的生意')}`, 
                headerTitle: { showTitle: true }, 
                headerLeft: { onPress: navigation.goBack },
                headerRight: {},
            }}
        >
            <ScrollSelector
                items={[
                    {key: 'orders', value: `${t('订单')}`, onSelect: () => {setTabRoute('orders')}},
                    {key: 'events', value: `${t('活动')}`, onSelect: () => {setTabRoute('events')}},
                ]}
                selected={tabRoute}
            />
            {tabRoute === "orders" && <OrderCard navigation={navigation} />}
            {tabRoute === "events" && <EventCard navigation={navigation} />}
        </Container>
    );
};

export default Business;