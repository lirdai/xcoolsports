import React, { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import _ from 'lodash';
import { Rating } from 'react-native-ratings';
import { useSelector, useDispatch } from 'react-redux';
import * as Haptics from 'expo-haptics';
import { RadioButton } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { AntDesign, Entypo } from '@expo/vector-icons'; 
import { nanoid } from '@reduxjs/toolkit';
import { useStripe } from '@stripe/stripe-react-native';
import { useConfirmPayment } from '@stripe/stripe-react-native';
import { useTranslation } from 'react-i18next';

import Container from '@xcoolsports/components/Common/Container';
import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import Image from '@xcoolsports/components/utils/Image';
import PopUpModal from '@xcoolsports/components/utils/PopUpModal';
import AnimatedPlusMinusIcons from '@xcoolsports/components/utils/AnimationComponents/AnimatedPlusMinusIcons';
import urlConstants from '@xcoolsports/constants/urls';
import templateConstants from '@xcoolsports/constants/templateConstants';
import getDateFormat from '@xcoolsports/utils/getDateFormat';
import getTimeFormat from '@xcoolsports/utils/getTimeFormat';
import CustomErrorBoundary from '@xcoolsports/components/Common/Pages/CustomErrorBoundary';
import RenderError from '@xcoolsports/components/Common/Pages/RenderError';
import Loading from '@xcoolsports/components/Common/Pages/Loading';
import PrimaryOutlinedButton from '@xcoolsports/components/utils/Buttons/PrimaryOutlinedButton';
import PrimaryContainedButton from '@xcoolsports/components/utils/Buttons/PrimaryContainedButton';
import { 
    api, selectEventWithTopicById, selectCurrentUser, 
    toastActions, toastTypes, configActions, selectOrderHistory,
} from '@xcoolsports/data';

const styles = StyleSheet.create({
    modalContainer: {
        margin: theme.v_spacing_lg,
    },
});

const Order = ({ route, navigation }) => {
    const { t, i18n } = useTranslation();
    const { eventId, orderId, start, end, party } = route.params;
    const isEventSelected = eventId !== undefined && eventId !== null;
    const isOrderSelected = orderId !== undefined && orderId !== null;
    const isMounted = useRef(true);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const { confirmPayment } = useConfirmPayment();
    const theme = useContext(ThemeContext);

    // 算两个日期之间相差
    const startTime = new Date(start);
    const endTime = new Date(end);
    const duration = endTime.getTime() - startTime.getTime();
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

    // 求开始时间
    const start_hours = Number(startTime.getUTCHours());
    const start_minutes = Number(startTime.getUTCMinutes());

    const [people, setPeople] = useState(party || 1);
    const [evaluation, setEvaluation] = useState('');
    const [rating, setRating] = useState(3);
    const [order, setOrder] = useState();
    const [loading, setLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [openPeopleModal, setOpenPeopleModal] = useState(false);
    const [openPaymentModal, setOpenPaymentModal] = useState(false);

    const { isLoading, isError, error } = api.endpoints.getEvent.useQuery({ id: eventId }, { skip: !isEventSelected });
    const { data: orderData } = api.endpoints.getOrder.useQuery({ id: eventId, order_id: orderId }, { skip: !isOrderSelected });
    const [getOrder, result] = api.endpoints.getOrder.useLazyQuery();
    const [createOrder] = api.endpoints.createOrder.useMutation();
    const [payOrder] = api.endpoints.payOrder.useMutation();
    const [updateOrderStatusByPlanner] = api.endpoints.updateOrderStatusByPlanner.useMutation();
    const [updateOrderStatusByUser] = api.endpoints.updateOrderStatusByUser.useMutation();
    const [evaluateEvent] = api.endpoints.evaluateEvent.useMutation();

    const dispatch = useDispatch();
    const event = useSelector((state) => selectEventWithTopicById(state, eventId));
    const currentUser = useSelector(selectCurrentUser);
    const orderHistory = useSelector(selectOrderHistory);

    const processing_fee = {
        '': 0,
        "借记卡或信用卡": 0.04,
        '支付宝': 0.06,
    };

    const final_price = {
        'PERSONHOUR': Number(event?.deposit * (days * 24 + hours + minutes / 60) * people * (1 + processing_fee[selectedPayment])).toFixed(2),
        'HOUR': Number(event?.deposit * (days * 24 + hours + minutes / 60) * (1 + processing_fee[selectedPayment])).toFixed(2),
        'PERSON': Number(event?.deposit * people * (1 + processing_fee[selectedPayment])).toFixed(2),
        'TOTAL': Number(event?.deposit * (1 + processing_fee[selectedPayment])).toFixed(2),
    };

    const handlePayment = async () => {
        // 3分钟成功单不能连续下单
        if (orderHistory.find((order) => 
            order.event_name === event.title 
            && order.event_start === start 
            && order.event_end === end
            && order.party_size === people
            && order.status === '待处理'
            && Date.now() - order.order_time <= 180000
        ) !== undefined) {
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '不要连续下单, 点击太快啦, 休息一下' }));
            return;
        }

        let newOrder = {
            idempotency_key: nanoid(), 
            date: getDateFormat(new Date(start)),
            time_slot: start_hours + start_minutes / 60,
            duration: { days, hours: hours + minutes / 60 },
            party_size: people,
        };

        // 10分钟未支付单重新支付
        const oldOrder = orderHistory.find((order) => 
            order.event_name === event.title 
            && order.event_start === start 
            && order.event_end === end
            && order.party_size === people
            && order.status === '未支付'
            && Date.now() - order.order_time <= 600000
        )

        if (oldOrder) {
            newOrder.idempotency_key = oldOrder.idempotency_key;
        } else {
            dispatch(configActions.addOrderHisotry({
                idempotency_key: newOrder.idempotency_key,
                event_name: event.title,
                event_start: start,
                event_end: end,
                party_size: people,
                status: event.is_deposit_required ? '未支付' : "待处理",
                order_time: Date.now(),
            }));
        }

        setLoading(true);

        // 下单不交钱
        if (!event.is_deposit_required) {
            const response = await createOrder({ body: newOrder, id: eventId });
            if (response?.data?.id) getOrder({ id: eventId, order_id: response.data.id });
        } else {
        // 下单交钱
            const response = await createOrder({ body: newOrder, id: eventId });

            const newPayment = {
                idempotency_key: newOrder.idempotency_key,
                amount: final_price[event.price_type],
                payment_method: selectedPayment,
            }

            if (response?.data?.id) {
                const payOrderResponse = await payOrder({ body: newPayment, event_plan_id: eventId, order_id: response.data.id });

                if (selectedPayment === '支付宝') {
                    if (payOrderResponse?.data?.client_secret) {
                        const { error, paymentIntent } = await confirmPayment(payOrderResponse.data.client_secret, { 
                            paymentMethodType: 'Alipay', 
                        });
                        
                        if (error) {
                            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '交易失败' }));   
                        } else if (paymentIntent) {
                            dispatch(configActions.updateOrderHistory({
                                idempotency_key: newOrder.idempotency_key,
                                event_name: event.title,
                                event_start: start,
                                event_end: end,
                                party_size: people,
                                status: '待处理',
                                order_time: Date.now(),
                            }));
                            getOrder({ id: eventId, order_id: response.data.id });
                            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.SUCCESS, text: '交易成功' }));
                        }
                    }
                } 
                if (selectedPayment === '借记卡或信用卡'){
                    if (payOrderResponse?.data?.client_secret) {
                        const { error: error1 } = await initPaymentSheet({
                            merchantDisplayName: "Wanku App",
                            paymentIntentClientSecret: payOrderResponse.data.client_secret,
                        });
        
                        if (error1) {
                            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '交易失败' }));   
                        } else {
                            const { error: error2 } = await presentPaymentSheet();
        
                            if (error2) {                
                                dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '交易失败'}));
                            } else {
                                dispatch(configActions.updateOrderHistory({
                                    idempotency_key: newOrder.idempotency_key,
                                    event_name: event.title,
                                    event_start: start,
                                    event_end: end,
                                    party_size: people,
                                    status: '待处理',
                                    order_time: Date.now(),
                                }));
                                getOrder({ id: eventId, order_id: response.data.id });
                                dispatch(toastActions.showToastAutoRemove({ type: toastTypes.SUCCESS, text: '交易成功' }));
                            }
                        }
                    }
                }
            }
        }

        setLoading(false);
    };

    const handleOrderStatusByPlanner = async (status) => {
        const newAcceptance = { status };
        await updateOrderStatusByPlanner({ body: newAcceptance, id: eventId, order_id: orderId })
    };

    const handleOrderStatusByUser = async (status) => {
        const newAcceptance = { status };
        await updateOrderStatusByUser({ body: newAcceptance, id: eventId, order_id: orderId })
    };

    const handleEvaluateEvent = async () => {
        const newEvaluation = {
            content: evaluation,
            rating,
        };
      
        await evaluateEvent({ body: newEvaluation, id: eventId, order_id: orderId });
    };

    useEffect(() => {
        if (orderData) { 
            setOrder(orderData);
            setSelectedPayment(orderData.orders.payment_method);
        }
        if (result?.data) setOrder(result.data);
    }, [orderData, result?.data])

    useEffect(() => () => { isMounted.current = false; }, []);

    return (
        <Container 
            header={{
                title: `${t('订单')}`, 
                headerLeft: {onPress: navigation.goBack},
                headerTitle: {showTitle: true}, 
                headerRight: {},
            }}
        >
            <Loading isLoading={isLoading} />
            <RenderError isError={!isLoading && isError} error={error} />
            {(!isLoading && event) && 
                <CustomErrorBoundary>
                    <ScrollView 
                        showsVerticalScrollIndicator={false} 
                        bounces={false}
                        style={{ backgroundColor: theme.fill_placeholder }}
                    >
                        {/* Event Description */}
                        <View style={{ flexDirection: 'row', backgroundColor: theme.fill_base, marginBottom: theme.v_spacing_md, padding: theme.h_spacing_xl }}>
                            <Pressable 
                                hitSlop={15}
                                onPress={() => {
                                    event?.author
                                        ? navigation.navigate(`${t('看用户')}`, { usernameURL: event?.author })
                                        : null
                                }}
                                onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                            >
                                <Image 
                                    containerStyle={{ width: 100, height: 100 }} 
                                    isSelectedUploading={false}
                                    editMode={false}
                                    showloading={false}
                                    source={event?.planner?.avatar ? { uri :`${urlConstants.images}/${event?.planner?.avatar}` } : require('@xcoolsports/static/avatar.jpg') }
                                    resizeMode="cover" 
                                />
                            </Pressable>

                            <Pressable 
                                hitSlop={10}
                                style={{ flex: 1, justifyContent: 'space-around', paddingLeft: theme.h_spacing_lg }}
                                onPress={() => navigation.navigate(`${t('看日记')}`, { topicId: event.topic_id, eventId: event.id })}
                                onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                            >
                                {event?.tags?.map((tag) => <Text style={{color: theme.text_color}} key={tag}>{tag}</Text>)}
                                <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{event.title}</Text>
                                <Text style={{color: theme.text_color}}>{order?.orders?.rating ? (order?.orders?.rating).toFixed(2) : `${t('未评价')}`} / {event?.rating ? (event?.rating).toFixed(2) : `${t('未评价')}`}</Text>
                            </Pressable>
                        </View>

                        {/* Order */}
                        <View style={{ backgroundColor: theme.fill_base, marginBottom: theme.v_spacing_md, padding: theme.h_spacing_xl }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_xl, fontWeight: 'bold', marginVertical: theme.v_spacing_lg }}>{t('订单详情')}</Text>
                            
                            <View style={{ marginVertical: theme.v_spacing_lg }}>
                                <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{t('日期')}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{color: theme.text_color}}>{getDateFormat(new Date(start))} {getTimeFormat(new Date(start))}</Text>
                                    <Text style={{color: theme.text_color}}> - </Text>
                                    <Text style={{color: theme.text_color}}>{getDateFormat(new Date(end))} {getTimeFormat(new Date(end))}</Text>
                                </View>
                            </View>

                            <View style={{ marginVertical: theme.v_spacing_lg }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}> 
                                    <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{t('人数')}</Text>
                                    {(!order || (order && order.orders.status === '未支付' && currentUser.username === order.orders.user.username)) && 
                                        <Pressable onPress={() => setOpenPeopleModal(true)}>
                                            <Text style={{ textDecorationLine: 'underline', color: theme.text_color }}>{t('编辑')}</Text>
                                        </Pressable>
                                    }
                                </View>

                                <Text style={{color: theme.text_color}}>{people} {t('人')}</Text>
                            </View>

                            <View style={{ marginVertical: theme.v_spacing_lg }}>
                                <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{t('时长')}</Text>
                                <Text style={{color: theme.text_color}}>{days} {t('天')} {hours + minutes / 60} {t('时')}</Text>
                            </View>
                        </View>

                        {/* Payment Method */}
                        {event.is_deposit_required && 
                            <View style={{ backgroundColor: theme.fill_base, marginBottom: theme.v_spacing_md, padding: theme.h_spacing_xl }}>
                                <Text style={{ color: theme.text_color, fontSize: theme.font_size_xl, fontWeight: 'bold', marginVertical: theme.v_spacing_lg }}>{t('支付方式')}</Text>
                                
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {selectedPayment === '' && <Text style={{color: theme.text_color}}>{t('请选择支付方式')}</Text>}    
                                    
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        {selectedPayment === '借记卡或信用卡' && <Entypo name="credit-card" size={20} color={theme.secondary_color} />}
                                        {selectedPayment === '支付宝' && <AntDesign name="alipay-square" size={20} color={theme.secondary_color} />} 
                                        {selectedPayment !== '' && <Text style={{ marginHorizontal: theme.h_spacing_sm, color: theme.text_color }}>{t(selectedPayment)}</Text>} 
                                    </View>

                                    <Pressable onPress={() => setOpenPaymentModal(true)}>
                                        {(!order || (order && order.orders.status === '未支付' && currentUser.username === order.orders.user.username)) && 
                                            <Text style={{ textDecorationLine: 'underline', color: theme.text_color }}>{t('选择')}</Text>
                                        }
                                    </Pressable>
                                </View>
                            </View>
                        }

                        {/* Price */}
                        {event?.price_type && 
                            <View style={{ backgroundColor: theme.fill_base, marginBottom: theme.v_spacing_md, padding: theme.h_spacing_xl }}>
                                <Text style={{ fontSize: theme.font_size_xl, fontWeight: 'bold', marginVertical: theme.v_spacing_lg, color: theme.text_color }}>{t('价格详情')}</Text>
                                <Text style={{ marginVertical: theme.v_spacing_lg, color: theme.text_color }}>{event.currency === '加元' && '$'} {Number(event.price).toFixed(2)} ({t(templateConstants.prices.find((price) => price.url === event.price_type).title)}) X {days * 24 + hours + minutes / 60} {t('小时')} X {people} {t('人')}</Text>

                                <View style={{ flexDirection: 'row', justifyContent: "space-between", marginVertical: theme.v_spacing_sm }}>
                                    <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{t('总价')}</Text>
                                    {event.price_type === 'PERSONHOUR' && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{event.currency === '加元' && '$'} {Number(event.price * (days * 24 + hours + minutes / 60) * people).toFixed(2)}</Text>}
                                    {event.price_type === 'HOUR' && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{event.currency === '加元' && '$'} {Number(event.price * (days * 24 + hours + minutes / 60)).toFixed(2)}</Text>}
                                    {event.price_type === 'PERSON' && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{event.currency === '加元' && '$'} {Number(event.price * people).toFixed(2)}</Text>}
                                    {event.price_type === 'TOTAL' && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{event.currency === '加元' && '$'} {Number(event.price).toFixed(2)}</Text>}
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: "space-between", marginVertical: theme.v_spacing_sm }}>
                                    <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{t('定金')}</Text>
                                    {event.price_type === 'PERSONHOUR' && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{event.currency === '加元' && '$'} {Number(event.deposit * (days * 24 + hours + minutes / 60) * people).toFixed(2)}</Text>}
                                    {event.price_type === 'HOUR' && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{event.currency === '加元' && '$'} {Number(event.deposit * (days * 24 + hours + minutes / 60)).toFixed(2)}</Text>}
                                    {event.price_type === 'PERSON' && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{event.currency === '加元' && '$'} {Number(event.deposit * people).toFixed(2)}</Text>}
                                    {event.price_type === 'TOTAL' && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{event.currency === '加元' && '$'} {Number(event.deposit).toFixed(2)}</Text>}
                                </View>

                                {event.is_deposit_required && 
                                    <View style={{ flexDirection: 'row', justifyContent: "space-between", marginVertical: theme.v_spacing_sm }}>
                                        <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{t('手续费')}</Text>
                                        {event.price_type === 'PERSONHOUR' && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{event.currency === '加元' && '$'} {Number(event.deposit * (days * 24 + hours + minutes / 60) * people * processing_fee[selectedPayment]).toFixed(2)}</Text>}
                                        {event.price_type === 'HOUR' && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{event.currency === '加元' && '$'} {Number(event.deposit * (days * 24 + hours + minutes / 60) * processing_fee[selectedPayment]).toFixed(2)}</Text>}
                                        {event.price_type === 'PERSON' && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{event.currency === '加元' && '$'} {Number(event.deposit * people * processing_fee[selectedPayment]).toFixed(2)}</Text>}
                                        {event.price_type === 'TOTAL' && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{event.currency === '加元' && '$'} {Number(event.deposit * processing_fee[selectedPayment]).toFixed(2)}</Text>}
                                    </View>
                                }

                                {event.is_deposit_required &&
                                    <View style={{ flexDirection: 'row', justifyContent: "space-between", marginTop: theme.v_spacing_2xl, marginBottom: theme.v_spacing_sm }}>
                                        <Text style={{ fontWeight: 'bold', color: theme.text_color, fontSize: theme.font_size_caption }}>{t('现在付款')}</Text>
                                        {event.price_type === 'PERSONHOUR' && <Text style={{ fontWeight: 'bold', color: theme.text_color, fontSize: theme.font_size_caption }}>{event.currency === '加元' && '$'} {Number(event.deposit * (days * 24 + hours + minutes / 60) * people * (1 + processing_fee[selectedPayment])).toFixed(2)}</Text>}
                                        {event.price_type === 'HOUR' && <Text style={{ fontWeight: 'bold', color: theme.text_color, fontSize: theme.font_size_caption }}>{event.currency === '加元' && '$'} {Number(event.deposit * (days * 24 + hours + minutes / 60) * (1 + processing_fee[selectedPayment])).toFixed(2)}</Text>}
                                        {event.price_type === 'PERSON' && <Text style={{ fontWeight: 'bold', color: theme.text_color, fontSize: theme.font_size_caption }}>{event.currency === '加元' && '$'} {Number(event.deposit * people * (1 + processing_fee[selectedPayment])).toFixed(2)}</Text>}
                                        {event.price_type === 'TOTAL' && <Text style={{ fontWeight: 'bold', color: theme.text_color, fontSize: theme.font_size_caption }}>{event.currency === '加元' && '$'} {Number(event.deposit * (1 + processing_fee[selectedPayment])).toFixed(2)}</Text>}
                                    </View>
                                }

                                {!event.is_deposit_required &&
                                    <View style={{ flexDirection: 'row', justifyContent: "space-between", marginTop: theme.v_spacing_2xl, marginBottom: theme.v_spacing_sm }}>
                                        <Text style={{ fontWeight: 'bold', color: theme.text_color, fontSize: theme.font_size_caption }}>{t('线下支付')}</Text>
                                        {event.price_type === 'PERSONHOUR' && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{event.currency === '加元' && '$'} {Number(event.price * (days * 24 + hours + minutes / 60) * people).toFixed(2)}</Text>}
                                        {event.price_type === 'HOUR' && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{event.currency === '加元' && '$'} {Number(event.price * (days * 24 + hours + minutes / 60)).toFixed(2)}</Text>}
                                        {event.price_type === 'PERSON' && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{event.currency === '加元' && '$'} {Number(event.price * people).toFixed(2)}</Text>}
                                        {event.price_type === 'TOTAL' && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{event.currency === '加元' && '$'} {Number(event.price).toFixed(2)}</Text>}
                                    </View>
                                }

                                {!event.is_refundable && <Text style={{ fontSize: theme.font_size_caption_sm, color: theme.secondary_variant }}>{t('线上支付的金额不可退款')}</Text>}
                            </View>
                        }

                        {/* Policy */}
                        {(!order || (order && currentUser.username === order.orders.user.username)) &&
                            <View style={{ backgroundColor: theme.fill_base, marginBottom: theme.v_spacing_md, padding: theme.h_spacing_xl }}>
                                <Text style={{ fontSize: theme.font_size_xl, fontWeight: 'bold', marginVertical: theme.v_spacing_lg, color: theme.text_color }}>用户活动说明</Text>
                                <Text style={{ paddingBottom: 10, color: theme.text_color }}>
                                    顽酷支持安全, 积极, 健康的活动。在购买活动前, 请仔细阅读活动的所有信息, 谨慎购买。
                                    如果您未满18周岁, 请让法定监护人帮您购买活动产品, 并在活动期间让法定监护人全程监督，若您不具备前述与您行为相适应的民事行为能力，则您及您的监护人应依照法律规定承担相应法律责任。
                                    顽酷在此声明, 顽酷会尽可能的保障每一位用户的人身及财产安全, 但顽酷平台将不承担任何法律责任。
                                    活动规则, 如下:
                                </Text>   

                                <Text style={{ paddingVertical: 5, color: theme.text_color }}>
                                    1.为更好维护平台秩序，用户账号仅供初始注册人使用，任何用户不得将账号及密码转让、售卖、赠与、借用、租用、泄露给第三方或以其他方式许可第三方使用。
                                    如用户因违反本条约定或账号遭受攻击、诈骗等而遭受损失，用户应通过司法、行政等救济途径向侵权行为人追偿，平台在法律允许范围内可免于承担责任。
                                    如用户因违反本条约定给他人造成损失，用户应就全部损失与实际使用人承担连带责任，且平台有权追究用户违约责任，暂停或终止向您提供服务;
                                </Text>
                                <Text style={{ paddingVertical: 5, color: theme.text_color }}>2. 本平台提供的所有活动, 时间、价格、内容、地点等均由主办方自由设置, 与本平台无关;</Text>
                                <Text style={{ paddingVertical: 5, color: theme.text_color }}>3. 用户在选定产品并下单后，等待活动主办方【接受订单】;</Text>
                                <Text style={{ paddingVertical: 5, color: theme.text_color }}>4. 活动主办法接受订单后，订单会出现【联系对方】按钮，双方可以自由交流;</Text>
                                <Text style={{ paddingVertical: 5, color: theme.text_color }}>5. 活动被主办方接受以后，用户可以在活动开始前的任意时间【取消订单】;</Text>
                                <Text style={{ paddingVertical: 5, color: theme.text_color }}>6. 如果对订单有任何问题, 你可以将问题发送至(customerservice@xcoolsports.com), 我们将尽快审核所涉问题, 并在验证你的用户身份后尽快回复。</Text>
                            </View>
                        }

                        {/* QR Code */}          
                        {(order && (order.orders.status === '已确认' || order.orders.status === '已签到') && currentUser.username === order.orders.user.username) &&
                            <View style={{ backgroundColor: theme.fill_base, marginBottom: theme.v_spacing_md, padding: theme.h_spacing_xl, justifyContent: 'center', alignItems: 'center' }}>
                                <QRCode value={`${order.orders.user.username}:${orderId}:${order.orders.idempotency_key}`} size={200} />
                                <Text style={{ fontSize: theme.font_size_caption, marginVertical: theme.v_spacing_lg, fontWeight: 'bold', color: theme.text_color }}>E-TICKET NO. {orderId}</Text>
                            </View>
                        }

                        {/* Others */}
                        <View style={{ backgroundColor: theme.fill_base, padding: theme.h_spacing_xl }}>
                            {(!order || (order && order.orders.status === '未支付' && currentUser.username === order.orders.user.username)) &&
                                <PrimaryContainedButton 
                                    buttonFreeStyle={{height: 50, marginVertical: theme.v_spacing_lg }} 
                                    textFreeStyle={{fontSize: theme.font_size_caption}}
                                    buttonText={event.is_deposit_required ? `${'付款'} ${event.currency === '加元' && '$'} ${final_price[event.price_type]}` : `${'预订'}`} 
                                    onPress={handlePayment}      
                                    loading={loading} 
                                    disabled={event.is_deposit_required && selectedPayment === ''}
                                />
                            }
                            
                            {(order && order.orders.status === '待处理' && currentUser.username !== order.orders.user.username) && 
                                <>
                                    <PrimaryOutlinedButton 
                                        buttonFreeStyle={{height: 50, marginVertical: theme.v_spacing_lg}} 
                                        textFreeStyle={{fontSize: theme.font_size_caption}}
                                        buttonText={'拒绝订单'} 
                                        onPress={() => handleOrderStatusByPlanner("商家取消")} 
                                    />

                                    <PrimaryContainedButton 
                                        buttonFreeStyle={{height: 50}} 
                                        textFreeStyle={{fontSize: theme.font_size_caption}}
                                        buttonText={'接受订单'} 
                                        onPress={() => handleOrderStatusByPlanner("已确认")}  
                                    />
                                </>
                            }

                            {(order && order.orders.status === '已确认' && new Date().valueOf() < new Date(end).valueOf() && currentUser.username === order.orders.user.username) && 
                                <PrimaryOutlinedButton 
                                    buttonFreeStyle={{height: 50}} 
                                    textFreeStyle={{fontSize: theme.font_size_caption}}
                                    buttonText={'取消订单'} 
                                    onPress={() => handleOrderStatusByUser("已取消")} 
                                />
                            }     

                            {(order && order.orders.status === '已确认' && new Date().valueOf() < new Date(end).valueOf()) && 
                                <PrimaryContainedButton 
                                    buttonFreeStyle={{height: 50, marginVertical: theme.v_spacing_lg}} 
                                    textFreeStyle={{fontSize: theme.font_size_caption}}
                                    buttonText={'联系对方'} 
                                    onPress={() => {
                                        if (currentUser.username === order.orders.user.username) navigation.navigate(`${t('私信')}`, { usernameURL: order.orders.event_planner.username });
                                        else if (currentUser.username !== order.orders.user.username) navigation.navigate(`${t('私信')}`, { usernameURL: order.orders.user.username });
                                    }}    
                                />
                            }  

                            {(order && order.orders.status === '已签到' && new Date().valueOf() >= new Date(end).valueOf() && currentUser.username === order.orders.user.username && !order.orders.rating) && 
                                <View>
                                    <Text style={{ fontSize: theme.font_size_subhead, marginBottom: theme.v_spacing_lg, fontWeight: 'bold' }}>{t('请给本次活动做出评价')}</Text>
                                    <TextInput
                                        placeholder={`${t('请给本次活动做出评价')}`}
                                        placeholderTextColor={theme.secondary_variant}
                                        multiline={true}
                                        numberOfLines={10}
                                        maxLength={200}
                                        clear={true} 
                                        style={{ 
                                            height: 200, padding: theme.v_spacing_md,
                                            borderColor: theme.fill_disabled, borderWidth: 1,
                                            color: theme.text_color,
                                            textAlignVertical: 'top'
                                        }}
                                        value={evaluation}
                                        onChangeText={(text) => setEvaluation(text)}
                                    />

                                    <Rating
                                        ratingCount={5}
                                        showRating
                                        startingValue={rating}
                                        style={{ marginVertical: 30, alignItems: 'flex-start' }}
                                        imageSize={30}
                                        onFinishRating={(e) => setRating(e)}
                                    />

                                    <PrimaryContainedButton 
                                        buttonFreeStyle={{marginVertical: 30, height: 50}} 
                                        textFreeStyle={{fontSize: theme.font_size_caption}}
                                        buttonText={'评价本次活动'} 
                                        onPress={handleEvaluateEvent}      
                                    />
                                </View>
                            }
                        </View>
                    </ScrollView>
                </CustomErrorBoundary>
            }

            {/* People */}
            <PopUpModal
                title={t('选择人数')}
                onClose={() => setOpenPeopleModal(false)}
                visible={openPeopleModal}
                okTitle={t('清空')}
                onOk={() => setPeople(1)}
                disableOk={false}
            >
                <View style={[styles.modalContainer, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 20, color: theme.text_color }}>{t('人数')}</Text>

                    <View style={{ flexDirection: 'row' }}>
                        <AnimatedPlusMinusIcons 
                            containerStyle={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 100}}
                            onPress={() => setPeople((prev) => {
                                if (prev > 1) return prev - 1;
                                if (prev === 1) return 1;
                            })}
                            onPressInComponent={<AntDesign name="minuscircle" size={20} color={theme.secondary_color} />}
                        >
                            <AntDesign name="minuscircleo" size={25} color={theme.secondary_variant} />
                        </AnimatedPlusMinusIcons>

                        <View style={{ width: 80, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: theme.text_color }}> {people} </Text>
                        </View>

                        <AnimatedPlusMinusIcons
                            containerStyle={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 100}}
                            onPress={() => setPeople((prev) => {
                                if (prev < 20) return prev + 1;
                                if (prev === 20) return 20;
                            })}
                            onPressInComponent={<AntDesign name="pluscircle" size={20} color={theme.secondary_color} />}
                        >
                            <AntDesign name="pluscircleo" size={25} color={theme.secondary_variant} />
                        </AnimatedPlusMinusIcons>
                    </View>
                </View>
            </PopUpModal>

            {/* Payment Method */}
            <PopUpModal
                title={t('支付方式')}
                onClose={() => setOpenPaymentModal(false)}
                visible={openPaymentModal}
            >
                <View style={[styles.modalContainer]}>
                    <RadioButton.Group onValueChange={newValue => setSelectedPayment(newValue)} value={selectedPayment}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {event?.payment_methods?.map(sub => ({ label: sub, value: sub })).map(({label, value}) =>
                                <View key={label} style={[styles.radio]}>
                                    <RadioButton.Item 
                                        color={theme.text_color}
                                        labelStyle={{color: theme.text_color}}
                                        mode="android" 
                                        position="leading" 
                                        label={t(label)} 
                                        value={value}
                                    />
                                </View>
                            )}
                        </View>
                    </RadioButton.Group>
                </View>
            </PopUpModal>
        </Container>
    );
};

export default Order;