import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native'
import { Button } from 'react-native-paper';
import { AntDesign, Entypo, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useTranslation } from 'react-i18next';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import Container from '@xcoolsports/components/Common/Container';
import CustomErrorBoundary from '@xcoolsports/components/Common/Pages/CustomErrorBoundary';
import Loading from '@xcoolsports/components/Common/Pages/Loading';
import Empty from '@xcoolsports/components/Common/Pages/Empty';
import RenderError from '@xcoolsports/components/Common/Pages/RenderError';
import Image from '@xcoolsports/components/utils/Image';
import urlConstants from '@xcoolsports/constants/urls';
import getDateFormat from '@xcoolsports/utils/getDateFormat';
import getTimeFormat from '@xcoolsports/utils/getTimeFormat';
import CountdownTimer from '@xcoolsports/utils/CountdownTimer';
import { api } from '@xcoolsports/data';
import PrimaryContainedButton from '@xcoolsports/components/utils/Buttons/PrimaryContainedButton';
import PrimaryOutlinedButton from '@xcoolsports/components/utils/Buttons/PrimaryOutlinedButton';

const styles = StyleSheet.create({
    title: {
        marginVertical: theme.v_spacing_md,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 100,
    },
    nickname: {
        width: 150,
        fontSize: theme.font_size_caption_sm,
        marginHorizontal: theme.h_spacing_md,
    },
});

const EventOverview = ({ route, navigation }) => {
    const { t, i18n } = useTranslation();
    const { event_plan_id, event_id } = route.params;
    const theme = useContext(ThemeContext);

    const { data, isLoading, isError, error } = api.endpoints.getAllParticipantsForOneEventList.useQuery({ event_plan_id, event_id }, { skip: !event_plan_id || !event_id });
    const [updateEventStatusByPlannert] = api.endpoints.updateEventStatusByPlannert.useMutation();

    const handleEventStatusByPlanner = async (status) => {
        const newAcceptance = { status };
        await updateEventStatusByPlannert({ body: newAcceptance, event_id: event_id, id: event_plan_id })
    };

    const isEmpty = !isLoading && data && data?.orders?.length === 0;
    
    return (
        <Container 
            header={{ 
                title: `${t('活动概览')}`, 
                headerTitle: { showTitle: true }, 
                headerLeft: { onPress: navigation.goBack },
                headerRight: {},
            }}
        >
            <Loading isLoading={isLoading} />
            <RenderError isError={!isLoading && isError} error={error} />
            <Empty isEmpty={!isLoading && isEmpty} />
            {(!isLoading && !isEmpty && !isError) &&
                <CustomErrorBoundary>
                    <ScrollView 
                        showsVerticalScrollIndicator={false} 
                        bounces={false}
                        style={{ backgroundColor: theme.fill_placeholder }}
                    >   
                        {/* Event Description */}
                        <View style={{ backgroundColor: theme.fill_base, marginBottom: theme.v_spacing_md, padding: theme.h_spacing_xl }}>
                            <Text style={{ fontWeight: 'bold', marginVertical: theme.v_spacing_lg, color: theme.text_color }}>{data.event_name}</Text>
                            <Text style={{color: theme.text_color}}>{getDateFormat(new Date(data.start))} {getTimeFormat(new Date(data.start))} - {getDateFormat(new Date(data.end))} {getTimeFormat(new Date(data.end))} </Text>
                        </View>
                        
                        {/* CountdownTimer */}
                        <View style={{ backgroundColor: theme.fill_base, marginBottom: theme.v_spacing_md, padding: theme.h_spacing_xl }}>
                            <Text style={{ fontSize: theme.font_size_xl, fontWeight: 'bold', marginVertical: theme.v_spacing_lg, color: theme.text_color }}>{t('倒计时')}</Text>

                            <CountdownTimer eventDate={new Date(data.start)} orderStatus='已确认' />
                        </View>

                        {/* Participant List */}
                        <View style={{ backgroundColor: theme.fill_base, marginBottom: theme.v_spacing_md, padding: theme.h_spacing_xl }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_xl, fontWeight: 'bold', marginVertical: theme.v_spacing_lg }}>{t('报名名单')}</Text>
                            <Text style={{ color: theme.text_color, fontWeight: 'bold', marginBottom: theme.v_spacing_lg }}>{t('已有')} {data.num_guests} {t('人报名, 最多可再加入')} {data.max_guests} {t('人')}</Text>

                            {data?.orders.map((order) => 
                                <View key={order.id} style={{ marginVertical: theme.v_spacing_sm }}>
                                    <Pressable
                                        hitSlop={5}
                                        style={styles.title}
                                        onPress={() => navigation.navigate(`${t('生成订单')}`,  { eventId: data.event_plan_id, orderId: order.id, start: new Date(data.start).toUTCString(), end: new Date(data.end).toUTCString(), party: order.party })}
                                    >
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: theme.v_spacing_sm }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image
                                                    containerStyle={styles.avatar}
                                                    isSelectedUploading={false}
                                                    editMode={false}
                                                    showloading={false}
                                                    source={order.user?.avatar ? { uri: `${urlConstants.images}/${order.user.avatar}` } : require('@xcoolsports/static/avatar.jpg')}
                                                    resizeMode="cover"
                                                />

                                                <Text style={[{color: theme.text_color}, styles.nickname]} numberOfLines={2}>{order.user?.nickname || `${t('用户不存在')}`}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                {(order.status === '待处理') && <FontAwesome5 name="concierge-bell" size={theme.icon_size_xs} color={theme.brand_wait} />}
                                                {order.status === '已确认' && <AntDesign name="checkcircle" size={theme.icon_size_xs} color={theme.brand_success} />}
                                                {(order.status === '商家取消' || order.status === '已取消') && <Entypo name="circle-with-cross" size={theme.icon_size_xs} color={theme.brand_error} />}
                                                {(order.status === '已过期' || order.status === '未支付') && <MaterialCommunityIcons name="clock-remove" size={theme.icon_size_xs} color={theme.brand_error} />}
                                                <Text style={{ fontWeight: 'bold', marginHorizontal: theme.v_spacing_xs, color: theme.text_color }}>{t(order.status)}</Text>
                                            </View>
                                        </View>
                                        
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ color: theme.secondary_variant }}>{t('订单号')}: {order.id}</Text>
                                            <Text style={{color: theme.text_color}}>{order.party} {t('人')}</Text>
                                        </View>
                                    </Pressable>
                                </View>
                            )}
                        </View>
                    
                        {/* Others */}
                        <View style={{ backgroundColor: theme.fill_base, padding: theme.h_spacing_xl }}>
                            <PrimaryOutlinedButton 
                                buttonFreeStyle={{height: 50, marginVertical: theme.v_spacing_lg}} 
                                textFreeStyle={{fontSize: theme.font_size_caption}}
                                buttonText={'一键取消所有订单'} 
                                onPress={() => handleEventStatusByPlanner('商家取消')} 
                            />

                            <PrimaryContainedButton 
                                buttonFreeStyle={{height: 50}} 
                                textFreeStyle={{fontSize: theme.font_size_caption}}
                                buttonText={'一键确认所有订单'} 
                                onPress={() => handleEventStatusByPlanner('已确认')}
                            />
                        </View>
                    </ScrollView>
                </CustomErrorBoundary>
            }
        </Container>
    );
};

export default EventOverview;