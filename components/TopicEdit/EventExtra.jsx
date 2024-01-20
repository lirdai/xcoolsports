import React, { useState, useContext } from 'react';
import { Pressable, Text, View, StyleSheet, Switch, TextInput, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { AntDesign, Entypo } from '@expo/vector-icons'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RadioButton } from 'react-native-paper';
import { FontAwesome, Ionicons } from '@expo/vector-icons'; 
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import templateConstants from '@xcoolsports/constants/templateConstants';
import SlideUpModal from '@xcoolsports/components/utils/SlideUpModal';
import regexChecker from '@xcoolsports/utils/regexChecker';
import AnimatedPlusMinusIcons from '@xcoolsports/components/utils/AnimationComponents/AnimatedPlusMinusIcons';
import TimeSetting from './TimeSetting';
import { selectCurrentUser, mapboxApi, selectLanguage } from '@xcoolsports/data';

const styles = StyleSheet.create({
    container: {
        padding: theme.v_spacing_lg,
    },
    switch: {
        height: 50,
        flexDirection: 'row', 
        alignItems: 'center',
    },
    modalContainer: {
        margin: theme.h_spacing_lg,
    },
    inputContainerDefault: {
        flexDirection: 'row',
        borderRadius: theme.radius_md,
        height: theme.input_height,
    },
    inputContainerError: {
        borderWidth: theme.border_width_md,
        borderColor: theme.brand_error,
        marginBottom: theme.v_spacing_sm,
    },
    input: {
        flexGrow: 1,
        flexShrink: 1,
        paddingHorizontal: theme.h_spacing_md,
    },
    error: {
        fontSize: theme.font_size_caption_sm,
        color: theme.brand_error,
        marginBottom: theme.v_spacing_xl,
    },
    text: {
        flexDirection: "row", 
        justifyContent: 'flex-end', 
        flexShrink: 1, 
        marginLeft: theme.h_spacing_xl,
    },
    row: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'space-between',
    },
    radioGroup: {
        maxHeight: 300,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    twoRadios: {
        justifyContent: "center",
        alignItems: 'flex-start',
        width: '50%',
    },
    oneRadio: {
        justifyContent: "center",
        alignItems: 'flex-start',
        width: '100%',
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
    },
});     

const tomorrowDate = (date) => {
    const today = new Date(date);                         
    const utcDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));                    
    utcDate.setUTCDate(utcDate.getUTCDate() + 1);                    
    const formattedDate = utcDate.toISOString().split('T')[0];
    return formattedDate;
};

const EventExtra = ({
    isEvent, isEventDurationFlexible, isEventPeopleFlexible, setIsEvent, setIsEventDurationFlexible, setIsEventPeopleFlexible,
    duration, minDuration, maxDuration, setDuration, setMinDuration, setMaxDuration, price, setPrice, priceType, setPriceType, onChange, setOnChange,
    people, minPeople, maxPeople, setPeople, setMaxPeople, setMinPeople, location, setLocation, longtitude, latitude, setLongtitude, setLatitude,
    date, fromTime, endTime, markedDates, events, recursionNumber, recursionFrequency, recursionEndDate, recursionForAWeek, 
    setDate, setFromTime, setEndTime, setMarkedDates, setEvents, setRecursionNumber, setRecursionFrequency,
    setRecursionEndDate, setRecursionForAWeek, setIsRecursion, isRecursion, oldPrice, setOldPrice, setCurrency, setPaymentMethods,
    isOnelineDeposit, isRefundable, deposit, setIsOnelineDeposit, setIsRefundable, setDeposit, currency, paymentMethods,
}) => {
    const { t, i18n } = useTranslation();
    const currentUser = useSelector(selectCurrentUser);
    const language = useSelector(selectLanguage);
    const insets = useSafeAreaInsets();
    const theme = useContext(ThemeContext);

    const [getForwardGeocoding, result] = mapboxApi.endpoints.getForwardGeocoding.useLazyQuery();

    const [openDurationModal, setOpenDurationModal] = useState(false);
    const [openMinDurationModal, setOpenMinDurationModal] = useState(false);
    const [openMaxDurationModal, setOpenMaxDurationModal] = useState(false);
    const [openPriceTypeModal, setOpenPriceTypeModal] = useState(false);
    const [openOldPriceModal, setOpenOldPriceModal] = useState(false);
    const [openPriceModal, setOpenPriceModal] = useState(false);
    const [openDepositModal, setOpenDepositModal] = useState(false);
    const [openPeopleModal, setOpenPeopleModal] = useState(false);
    const [openMinPeopleModal, setOpenMinPeopleModal] = useState(false);
    const [openMaxPeopleModal, setOpenMaxPeopleModal] = useState(false);
    const [openLocationModal, setOpenLocationModal] = useState(false);
    const [openTimeSettingModal, setOpenTimeSettingModal] = useState(false);
    const [openPaymentMethodsModal, setopenPaymentMethodsModal] = useState(false);
    const [openCurrencyModal, setOpenCurrencyModal] = useState(false);

    return (
        <View style={styles.container}>
            {currentUser.is_certification_verified && 
                <View style={styles.switch}>
                    <Text style={{ marginRight: theme.h_spacing_md, color: theme.text_color }}>{t('发起活动')}</Text>
                    <Switch
                        trackColor={{ false: theme.fill_mask, true: theme.secondary_color }}
                        thumbColor={isEvent ? theme.fill_base : theme.fill_base}
                        ios_backgroundColor={theme.fill_mask}
                        onValueChange={(e) => setIsEvent(e)}
                        value={isEvent}
                    />
                </View>
            }

            {(isEvent) && 
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <View style={styles.switch}>
                            <Text style={{ marginRight: theme.h_spacing_md, color: theme.text_color }}>{t('活动时长灵活')}</Text>
                            <Switch
                                trackColor={{ false: theme.fill_mask, true: theme.secondary_color }}
                                thumbColor={isEventDurationFlexible ? theme.fill_base : theme.fill_base}
                                ios_backgroundColor={theme.fill_mask}
                                onValueChange={(e) => setIsEventDurationFlexible(e)}
                                value={isEventDurationFlexible}
                            />
                        </View>

                        <View style={styles.switch}>
                            <Text style={{ marginRight: theme.h_spacing_md, color: theme.text_color }}>{t('活动人数灵活')}</Text>
                            <Switch
                                trackColor={{ false: theme.fill_mask, true: theme.secondary_color }}
                                thumbColor={isEventPeopleFlexible ? theme.fill_base : theme.fill_base}
                                ios_backgroundColor={theme.fill_mask}
                                onValueChange={(e) => setIsEventPeopleFlexible(e)}
                                value={isEventPeopleFlexible}
                            />
                        </View>

                        <View style={styles.switch}>
                            <Text style={{ marginRight: theme.h_spacing_md, color: theme.text_color }}>{t('线上支付')}</Text>
                            <Switch
                                trackColor={{ false: theme.fill_mask, true: theme.secondary_color }}
                                thumbColor={isOnelineDeposit ? theme.fill_base : theme.fill_base}
                                ios_backgroundColor={theme.fill_mask}
                                onValueChange={(e) => setIsOnelineDeposit(e)}
                                value={isOnelineDeposit}
                            />
                        </View>

                        {isOnelineDeposit && <View style={styles.switch}>
                            <Text style={{ marginRight: theme.h_spacing_md, color: theme.text_color }}>{t('支持退款')}</Text>
                            <Switch
                                trackColor={{ false: theme.fill_mask, true: theme.secondary_color }}
                                thumbColor={isRefundable ? theme.fill_base : theme.fill_base}
                                ios_backgroundColor={theme.fill_mask}
                                onValueChange={(e) => setIsRefundable(e)}
                                value={isRefundable}
                            />
                        </View>}
                    </View>

                    {isEventDurationFlexible 
                        ? 
                        <View style={{ flexDirection: 'row', height: 50, borderBottomWidth: 1, borderBottomColor: theme.fill_disabled, paddingVertical: theme.v_spacing_md, }}>
                            <Pressable 
                                style={{ width: '50%', justifyContent: 'center', borderRightWidth: 1, borderRightColor: theme.fill_disabled }}                       
                                onPress={() => setOpenMinDurationModal(true)}
                            >
                                {minDuration === 0 && <Text numberOfLines={1} style={{ color: theme.fill_mask }}>{t('最小活动时长')}</Text>}
                                {minDuration !== 0 && <Text numberOfLines={1} style={{ fontWeight: 'bold', color: theme.text_color }}>{minDuration} {t('小时')}</Text>}
                            </Pressable>

                            <Pressable 
                                style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}                      
                                onPress={() => setOpenMaxDurationModal(true)}
                            >
                                {maxDuration === 0 && <Text numberOfLines={1} style={{ color: theme.fill_mask }}>{t('最大活动时长')}</Text>}
                                {maxDuration !== 0 && <Text numberOfLines={1} style={{ fontWeight: 'bold', color: theme.text_color }}>{maxDuration} {t('小时')}</Text>}
                            </Pressable>
                        </View>
                        : 
                        <Pressable 
                            style={{ height: 50, width: '100%', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: theme.fill_disabled }}                     
                            onPress={() => setOpenDurationModal(true)}
                        >
                            {(!duration['days'] && !duration['hours'])
                                ? <Text style={{ color: theme.fill_mask }}>{t('活动时长')}</Text>
                                : <View style={{ flexDirection: 'row' }}>
                                    {(duration['days'] !== 0) && <Text style={{ fontWeight: 'bold', color: theme.text_color }}> {duration['days']} {t('天')}</Text>}
                                    {(duration['hours'] !== 0) && <Text style={{ fontWeight: 'bold', color: theme.text_color }}> {duration["hours"]} {t('小时')}</Text>}
                                </View>
                            }
                        </Pressable>
                    }

                    {isEventPeopleFlexible 
                        ? 
                        <View style={{ flexDirection: 'row', height: 50, borderBottomWidth: 1, borderBottomColor: theme.fill_disabled, paddingVertical: theme.v_spacing_md, }}>
                            <Pressable 
                                style={{ width: '50%', justifyContent: 'center', borderRightWidth: 1, borderRightColor: theme.fill_disabled }}                       
                                onPress={() => setOpenMinPeopleModal(true)}
                            >
                                {minPeople === 0 && <Text numberOfLines={1} style={{ color: theme.fill_mask }}>{t('最少活动人数')}</Text>}
                                {minPeople !== 0 && <Text numberOfLines={1} style={{ fontWeight: 'bold', color: theme.text_color }}>{minPeople} {t('人')}</Text>}
                            </Pressable> 

                            <Pressable 
                                style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}                      
                                onPress={() => setOpenMaxPeopleModal(true)}
                            >
                                {maxPeople === 0 && <Text numberOfLines={1} style={{ color: theme.fill_mask }}>{t('最大活动人数')}</Text>}
                                {maxPeople !== 0 && <Text numberOfLines={1} style={{ fontWeight: 'bold', color: theme.text_color }}>{maxPeople} {t('人')}</Text>}
                            </Pressable>
                        </View> 
                        : 
                        <Pressable 
                            style={{ height: 50, width: '100%', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: theme.fill_disabled }}                     
                            onPress={() => setOpenPeopleModal(true)}
                        >
                            {people === 0 && <Text numberOfLines={1} style={{ color: theme.fill_mask }}>{t('活动人数')}</Text>}
                            {people !== 0 && <Text numberOfLines={1} style={{ fontWeight: 'bold', color: theme.text_color }}>{people} {t('人')}</Text>}
                        </Pressable>
                    }

                    <View style={{ flexDirection: 'row', height: 50, borderBottomWidth: 1, borderBottomColor: theme.fill_disabled, paddingVertical: theme.v_spacing_md, }}>
                        <Pressable 
                            style={{ width: '33.333333333%', justifyContent: 'center', borderRightWidth: 1, borderRightColor: theme.fill_disabled }}                       
                            onPress={() => setOpenPriceTypeModal(true)}
                        >
                            {priceType === "" && <Text numberOfLines={1} style={{ color: theme.fill_mask }}>{t('价格类型')}</Text>}
                            {priceType !== '' && <Text numberOfLines={1} style={{ fontWeight: 'bold', color: theme.text_color }}>{t(templateConstants.prices.find((price) => price.url === priceType).title)}</Text>}
                        </Pressable>

                        <Pressable 
                            style={{ width: '33.333333333%', justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: theme.fill_disabled }}                       
                            onPress={() => setOpenOldPriceModal(true)}
                        >
                            {oldPrice === "" && <Text numberOfLines={1} style={{ color: theme.fill_mask }}>{t('原价')}</Text>}
                            {oldPrice !== "" && <Text numberOfLines={1} style={{ fontWeight: 'bold', color: theme.text_color }}>{oldPrice}</Text>}
                        </Pressable>

                        <Pressable 
                            style={{ width: '33.333333333%', justifyContent: 'center', alignItems: 'center' }}                        
                            onPress={() => setOpenPriceModal(true)}
                        >
                            {price === "" && <Text numberOfLines={1} style={{ color: theme.fill_mask }}>{t('现价')}</Text>}
                            {price !== "" && <Text numberOfLines={1} style={{ fontWeight: 'bold', color: theme.text_color }}>{price}</Text>}
                        </Pressable>
                    </View>

                    {isOnelineDeposit && 
                        <View style={{ flexDirection: 'row', height: 50, borderBottomWidth: 1, borderBottomColor: theme.fill_disabled, paddingVertical: theme.v_spacing_md, }}>
                            <Pressable 
                                style={{ width: '33.333333333%', justifyContent: 'center', borderRightWidth: 1, borderRightColor: theme.fill_disabled }}                       
                                onPress={() => setOpenDepositModal(true)}
                            >
                                {deposit === "" && <Text numberOfLines={1} style={{ color: theme.fill_mask }}>{t('定金')}</Text>}
                                {deposit !== "" && <Text numberOfLines={1} style={{ fontWeight: 'bold', color: theme.text_color }}>{deposit}</Text>}
                            </Pressable>

                            <Pressable 
                                style={{ width: '33.333333333%', justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: theme.fill_disabled }}    
                                onPress={() => setOpenCurrencyModal(true)}                   
                            >
                                {currency === "" && <Text numberOfLines={1} style={{ color: theme.fill_mask }}>{t('货币')}</Text>}
                                {currency !== "" && <Text numberOfLines={1} style={{ fontWeight: 'bold', color: theme.text_color }}>{t(currency)}</Text>}
                            </Pressable>

                            <Pressable 
                                style={{ width: '33.333333333%', justifyContent: 'center', alignItems: 'center' }}                       
                                onPress={() => setopenPaymentMethodsModal(true)}
                            >
                                {paymentMethods.length === 0 && <Text numberOfLines={1} style={{ color: theme.fill_mask }}>{t('支付方式')}</Text>}
                                {paymentMethods.length !== 0 && <Text numberOfLines={1} style={{ fontWeight: 'bold', color: theme.text_color }}>{paymentMethods.map((pay) => t(pay)).join(", ")}</Text>}
                            </Pressable>
                        </View>
                    }

                    <Pressable 
                        style={{ height: 50, width: '100%', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: theme.fill_disabled }}                     
                        onPress={() => setOpenTimeSettingModal(true)}
                    > 
                        {events.length === 0 && <Text numberOfLines={1} style={{ color: theme.fill_mask }}>{t('设置活动时间')}</Text>}
                        {events.length !== 0 && 
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                {!isRecursion && fromTime.code >= endTime.code
                                    ? <Text numberOfLines={1} style={{ fontWeight: 'bold', color: theme.text_color }}>{date} - {tomorrowDate(date)}</Text>
                                    : <Text numberOfLines={1} style={{ fontWeight: 'bold', color: theme.text_color }}>{date} - {recursionEndDate}</Text>
                                }

                                <Text numberOfLines={1} style={{ fontWeight: 'bold', color: theme.text_color }}>{fromTime.title} - {endTime.title}</Text>

                                {isRecursion && <Text numberOfLines={1} style={{ fontWeight: 'bold', color: theme.text_color }}>{t(recursionFrequency)}</Text>}
                                {!isRecursion && <Text numberOfLines={1} style={{ fontWeight: 'bold', color: theme.text_color }}>{t('仅一次')}</Text>}
                            </View>
                        }
                    </Pressable>

                    <View style={{ flexDirection: 'row', height: 50, borderBottomWidth: 1, borderBottomColor: theme.fill_disabled, paddingVertical: theme.v_spacing_md }}>
                        <Pressable 
                            style={{ width: '70%', alignItems: 'center', flexDirection: 'row', borderRightWidth: 1, borderRightColor: theme.fill_disabled }}                                            
                            onPress={() => setOpenLocationModal(true)}
                        >   
                            {location === "" && <Text numberOfLines={1} style={{ color: theme.fill_mask }}>{t('活动地点')}</Text>}

                            {location !== '' && <Entypo name="location-pin" size={16} color={theme.secondary_color} />}
                            {location !== '' && <Text numberOfLines={1} style={{ fontWeight: 'bold', width: '90%', color: theme.text_color }}>{location}</Text>}
                        </Pressable>

                        <View 
                            style={{ width: '30%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}                                          
                        >   
                            {(!longtitude && !latitude) && <Text numberOfLines={1} style={{ color: theme.fill_mask }}>{t('验证地址')}</Text>}

                            {(longtitude && latitude) && <FontAwesome name="check-circle" color={theme.brand_success} size={theme.icon_size_xxs} />}
                            {(longtitude && latitude) && <Text numberOfLines={1} style={{ fontWeight: 'bold', color: theme.text_color }}>{t('验证成功')}</Text>}
                        </View>
                    </View>
                </View>
            }

            {/* Min Duration */}
            <SlideUpModal
                title={t('选择最小活动时长')}
                onClose={() => setOpenMinDurationModal(false)}
                visible={openMinDurationModal}
            >
                <View style={[styles.modalContainer, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.v_spacing_lg }]}>
                    <Text style={{ fontSize: 20, color: theme.text_color }}>{t('小时')}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <AnimatedPlusMinusIcons 
                            containerStyle={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 100}}
                            onPress={() => setMinDuration(minDuration > 0 ? minDuration - 0.5 : 0)}
                            onPressInComponent={<AntDesign name="minuscircle" size={20} color={theme.secondary_color} />}
                        >
                            <AntDesign name="minuscircleo" size={25} color={theme.secondary_variant} />
                        </AnimatedPlusMinusIcons>

                        <View style={{ width: 80, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: theme.text_color }}> {minDuration} </Text>
                        </View>

                        <AnimatedPlusMinusIcons
                            containerStyle={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 100}}
                            onPress={() => setMinDuration(minDuration < 10 ? minDuration + 0.5 : 10)}
                            onPressInComponent={<AntDesign name="pluscircle" size={20} color={theme.secondary_color} />}
                        >
                            <AntDesign name="pluscircleo" size={25} color={theme.secondary_variant} />
                        </AnimatedPlusMinusIcons>
                    </View>
                </View>
            </SlideUpModal>

            {/* Max Duration */}
            <SlideUpModal
                title={t('选择最大活动时长')}
                onClose={() => setOpenMaxDurationModal(false)}
                visible={openMaxDurationModal}
            >
                <View style={[styles.modalContainer, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.v_spacing_lg }]}>
                    <Text style={{ fontSize: 20, color: theme.text_color }}>{t('小时')}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <AnimatedPlusMinusIcons 
                            containerStyle={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 100}}
                            onPress={() => setMaxDuration(maxDuration > 0 ? maxDuration - 0.5 : 0)}
                            onPressInComponent={<AntDesign name="minuscircle" size={20} color={theme.secondary_color} />}
                        >
                            <AntDesign name="minuscircleo" size={25} color={theme.secondary_variant} />
                        </AnimatedPlusMinusIcons>

                        <View style={{ width: 80, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: theme.text_color }}> {maxDuration} </Text>
                        </View>

                        <AnimatedPlusMinusIcons
                            containerStyle={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 100}}
                            onPress={() => setMaxDuration(maxDuration < 10 ? maxDuration + 0.5 : 10)}
                            onPressInComponent={<AntDesign name="pluscircle" size={20} color={theme.secondary_color} />}
                        >
                            <AntDesign name="pluscircleo" size={25} color={theme.secondary_variant} />
                        </AnimatedPlusMinusIcons>
                    </View>
                </View>
            </SlideUpModal>

            {/* Fixed Duration */}
            <SlideUpModal
                title={t('选择活动时长')}
                onClose={() => setOpenDurationModal(false)}
                visible={openDurationModal}
            >
                <View style={[styles.modalContainer]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.v_spacing_lg }}>
                        <Text style={{ fontSize: 20, color: theme.text_color }}>{t('天数')}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <AnimatedPlusMinusIcons 
                                containerStyle={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 100}}
                                onPress={() => {
                                    setDuration((prev) => ({
                                        ...prev,
                                        days: prev["days"] > 0 ? prev["days"] - 1 : 0,
                                    }))
                                }}
                                onPressInComponent={<AntDesign name="minuscircle" size={20} color={theme.secondary_color} />}
                            >
                                <AntDesign name="minuscircleo" size={25} color={theme.secondary_variant} />
                            </AnimatedPlusMinusIcons>

                            <View style={{ width: 80, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20, color: theme.text_color }}> {duration["days"]} </Text>
                            </View>

                            <AnimatedPlusMinusIcons
                                containerStyle={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 100}}
                                onPress={() => setDuration((prev) => ({
                                    ...prev,
                                    days: prev['days'] < 20 ? prev["days"] + 1 : 20,
                                }))}
                                onPressInComponent={<AntDesign name="pluscircle" size={20} color={theme.secondary_color} />}
                            >
                                <AntDesign name="pluscircleo" size={25} color={theme.secondary_variant} />
                            </AnimatedPlusMinusIcons>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.v_spacing_lg }}>
                        <Text style={{ fontSize: 20, color: theme.text_color }}>{t('小时')}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <AnimatedPlusMinusIcons 
                                containerStyle={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 100}}
                                onPress={() => setDuration((prev) => ({
                                    ...prev,
                                    hours: prev["hours"] > 0 ? prev["hours"] - 0.5 : 0,
                                }))}
                                onPressInComponent={<AntDesign name="minuscircle" size={20} color={theme.secondary_color} />}
                            >
                                <AntDesign name="minuscircleo" size={25} color={theme.secondary_variant} />
                            </AnimatedPlusMinusIcons>

                            <View style={{ width: 80, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20, color: theme.text_color }}> {duration["hours"]} </Text>
                            </View>

                            <AnimatedPlusMinusIcons
                                containerStyle={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 100}}
                                onPress={() => setDuration((prev) => ({
                                    ...prev,
                                    hours:  prev['hours'] < 23.5 ? prev["hours"] + 0.5 : 23.5,
                                }))}
                                onPressInComponent={<AntDesign name="pluscircle" size={20} color={theme.secondary_color} />}
                            >
                                <AntDesign name="pluscircleo" size={25} color={theme.secondary_variant} />
                            </AnimatedPlusMinusIcons>
                        </View>
                    </View>
                </View>
            </SlideUpModal>

            {/* Min People */}
            <SlideUpModal
                title={t('选择最少活动人数')}
                onClose={() => setOpenMinPeopleModal(false)}
                visible={openMinPeopleModal}
            >
                <View style={[styles.modalContainer, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 20, color: theme.text_color }}>{t('人数')}</Text>

                    <View style={{ flexDirection: 'row' }}>
                        <AnimatedPlusMinusIcons 
                            containerStyle={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 100}}
                            onPress={() => setMinPeople((prev) => {
                                if (prev > 0) return prev - 1;
                                if (prev === 0) return 0;
                            })}
                            onPressInComponent={<AntDesign name="minuscircle" size={20} color={theme.secondary_color} />}
                        >
                            <AntDesign name="minuscircleo" size={25} color={theme.secondary_variant} />
                        </AnimatedPlusMinusIcons>

                        <View style={{ width: 80, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: theme.text_color }}> {minPeople} </Text>
                        </View>

                        <AnimatedPlusMinusIcons
                            containerStyle={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 100}}
                            onPress={() => setMinPeople((prev) => {
                                if (prev < 50) return prev + 1;
                                if (prev === 50) return 50;
                            })}
                            onPressInComponent={<AntDesign name="pluscircle" size={20} color={theme.secondary_color} />}
                        >
                            <AntDesign name="pluscircleo" size={25} color={theme.secondary_variant} />
                        </AnimatedPlusMinusIcons>
                    </View>
                </View>
            </SlideUpModal>

            {/* Max People */}
            <SlideUpModal
                title={t('选择最多活动人数')}
                onClose={() => setOpenMaxPeopleModal(false)}
                visible={openMaxPeopleModal}
            >
                <View style={[styles.modalContainer, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 20, color: theme.text_color }}>{t('人数')}</Text>

                    <View style={{ flexDirection: 'row' }}>
                        <AnimatedPlusMinusIcons 
                            containerStyle={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 100}}
                            onPress={() => setMaxPeople((prev) => {
                                if (prev > 0) return prev - 1;
                                if (prev === 0) return 0;
                            })}
                            onPressInComponent={<AntDesign name="minuscircle" size={20} color={theme.secondary_color} />}
                        >
                            <AntDesign name="minuscircleo" size={25} color={theme.secondary_variant} />
                        </AnimatedPlusMinusIcons>

                        <View style={{ width: 80, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: theme.text_color }}> {maxPeople} </Text>
                        </View>

                        <AnimatedPlusMinusIcons
                            containerStyle={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 100}}
                            onPress={() => setMaxPeople((prev) => {
                                if (prev < 50) return prev + 1;
                                if (prev === 50) return 50;
                            })}
                            onPressInComponent={<AntDesign name="pluscircle" size={20} color={theme.secondary_color} />}
                        >
                            <AntDesign name="pluscircleo" size={25} color={theme.secondary_variant} />
                        </AnimatedPlusMinusIcons>
                    </View>
                </View>
            </SlideUpModal>

             {/* Flxed People */}
            <SlideUpModal
                title={t('选择活动人数')}
                onClose={() => setOpenPeopleModal(false)}
                visible={openPeopleModal}
            >
                <View style={[styles.modalContainer, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 20, color: theme.text_color }}>{t('人数')}</Text>

                    <View style={{ flexDirection: 'row' }}>
                        <AnimatedPlusMinusIcons 
                            containerStyle={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 100}}
                            onPress={() => setPeople((prev) => {
                                if (prev > 0) return prev - 1;
                                if (prev === 0) return 0;
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
                                if (prev < 50) return prev + 1;
                                if (prev === 50) return 50;
                            })}
                            onPressInComponent={<AntDesign name="pluscircle" size={20} color={theme.secondary_color} />}
                        >
                            <AntDesign name="pluscircleo" size={25} color={theme.secondary_variant} />
                        </AnimatedPlusMinusIcons>
                    </View>
                </View>
            </SlideUpModal>

            {/* Price Type */}
            <SlideUpModal
                title={t('活动类型')}
                onClose={() => setOpenPriceTypeModal(false)}
                visible={openPriceTypeModal}
            >
                 <View style={[styles.modalContainer]}>
                    <RadioButton.Group onValueChange={newValue => setPriceType(newValue)} value={priceType}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {templateConstants.prices.map(sub => ({ label: sub.title, value: sub.url })).map(({label, value}) =>
                                <View key={label} style={language === 'en' ? styles.oneRadio : styles.twoRadios}>
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
            </SlideUpModal>

            {/* Old Price */}
            <SlideUpModal
                title={t('活动原价')}
                onClose={() => setOpenOldPriceModal(false)}
                visible={openOldPriceModal}
            >
                <View style={[styles.modalContainer, { marginVertical: 0 }]}>
                    <Text style={{ color: theme.text_color, fontSize: theme.font_size_icontext, fontWeight: 'bold', marginVertical: theme.v_spacing_md }}>
                        活动原价是指产品或服务在进行任何促销、折扣或特价优惠之前的标准价格或定价。这是产品或服务的正常价格，也称为基准价格，是客户在参与任何促销前所需支付的价格。
                    </Text>

                    <View style={[{...styles.inputContainerDefault, ...(onChange.oldPrice ? {} : styles.inputContainerError)}, {backgroundColor: theme.fill_placeholder}]}>
                        <TextInput
                            style={[styles.input, {color: theme.text_color}]}
                            placeholder={t('活动原价')}
                            onChangeText={(text) => {
                                setOldPrice(text);
                                setOnChange((prev) => ({
                                    ...prev,
                                    oldPrice: regexChecker('price', text)
                                }));
                            }}
                            placeholderTextColor={theme.secondary_variant}
                            value={oldPrice}
                            blurOnSubmit={false}
                            onSubmitEditing={({ nativeEvent: { text }}) => { 
                                setOnChange((prev) => ({
                                    ...prev,
                                    oldPrice: regexChecker('price', text)
                                }));
                                setOpenOldPriceModal(false);
                            }}
                        />
                    </View>

                    <Text style={styles.error}>{!onChange.oldPrice && t(templateConstants.auth_patterns_error['price'])}</Text>
                </View>
            </SlideUpModal>

            {/* Price */}
            <SlideUpModal
                title={t('活动现价')}
                onClose={() => setOpenPriceModal(false)}
                visible={openPriceModal}
            >
                <View style={[styles.modalContainer, { marginVertical: 0 }]}>
                    <Text style={{ color: theme.text_color, fontSize: theme.font_size_icontext, fontWeight: 'bold', marginVertical: theme.v_spacing_md }}>
                        活动现价是指在特定的促销活动期间或某一时间段内，产品或服务所售出的实际价格或促销价格。这是相对于活动原价（正常价格或定价）而言的特别优惠价格。
                    </Text>

                    <View style={[{...styles.inputContainerDefault, ...(onChange.price ? {} : styles.inputContainerError)}, {backgroundColor: theme.fill_placeholder}]}>
                        <TextInput
                            style={[styles.input, {color: theme.text_color}]}
                            placeholder={t('活动现价')}
                            onChangeText={(text) => {
                                setPrice(text);
                                setOnChange((prev) => ({
                                    ...prev,
                                    price: regexChecker('price', text)
                                }));
                            }}
                            placeholderTextColor={theme.secondary_variant}
                            value={price}
                            blurOnSubmit={false}
                            onSubmitEditing={({ nativeEvent: { text }}) => { 
                                setOnChange((prev) => ({
                                    ...prev,
                                    price: regexChecker('price', text)
                                }));
                                setOpenPriceModal(false);
                            }}
                        />
                    </View>
                    <Text style={styles.error}>{!onChange.price && t(templateConstants.auth_patterns_error['price'])}</Text>
                </View>
            </SlideUpModal>

            {/* Deposit */}
            <SlideUpModal
                title={t('活动定金')}
                onClose={() => setOpenDepositModal(false)}
                visible={openDepositModal}
            >
                <View style={[styles.modalContainer, { marginVertical: 0 }]}>
                    <Text style={{ color: theme.text_color, fontSize: theme.font_size_icontext, fontWeight: 'bold', marginVertical: theme.v_spacing_md }}>
                        活动定金是指在网上预订某项活动、服务或产品时，顾客需要支付的预付款项。这个预付款通常用于确认预订的有效性和确保客户的意向。活动定金在客户确认预订后，通常不可退还或只能部分退还，这是为了确保客户的诚意和保障商家的服务准备。
                    </Text>

                    <View style={[{...styles.inputContainerDefault, ...(onChange.deposit ? {} : styles.inputContainerError)}, {backgroundColor: theme.fill_placeholder}]}>
                        <TextInput
                            style={[styles.input, {color: theme.text_color}]}
                            placeholder={t('活动定金')}
                            onChangeText={(text) => {
                                setDeposit(text);
                                setOnChange((prev) => ({
                                    ...prev,
                                    deposit: regexChecker('price', text)
                                }));
                            }}
                            placeholderTextColor={theme.secondary_variant}
                            value={deposit}
                            blurOnSubmit={false}
                            onSubmitEditing={({ nativeEvent: { text }}) => { 
                                setOnChange((prev) => ({
                                    ...prev,
                                    deposit: regexChecker('price', text)
                                }));
                                setOpenDepositModal(false);
                            }}
                        />
                    </View>
                    <Text style={styles.error}>{!onChange.deposit && t(templateConstants.auth_patterns_error['price'])}</Text>
                </View>
            </SlideUpModal>

            {/* Currency */}
            <SlideUpModal
                title={t('选择货币')}
                onClose={() => setOpenCurrencyModal(false)}
                visible={openCurrencyModal}
            >
                <View style={{ margin: theme.v_spacing_lg }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'stretch' }}>
                        {["加元"].map((cur) => 
                            <Pressable
                                key={cur} 
                                onPress={() => {
                                    setCurrency(cur);
                                }}
                                style={cur === currency
                                    ? { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: theme.h_spacing_sm, margin: theme.h_spacing_sm, borderColor: theme.secondary_color, borderWidth: 1, borderRadius: 6 }
                                    : { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: theme.h_spacing_sm, margin: theme.h_spacing_sm, borderColor: theme.fill_disabled, borderWidth: 1, borderRadius: 6 }}
                            >
                                {cur === '加元' && <Text 
                                    style={cur === currency
                                        ? { fontSize: theme.font_size_icontext, color: theme.secondary_color } 
                                        : { fontSize: theme.font_size_icontext, color: theme.secondary_variant }}
                                >CAD</Text>}
                                <Text 
                                    style={cur === currency
                                        ? { fontSize: theme.font_size_base, color: theme.secondary_color, marginHorizontal: theme.h_spacing_sm } 
                                        : { fontSize: theme.font_size_base, color: theme.secondary_variant, marginHorizontal: theme.h_spacing_sm }}
                                >{t(cur)}</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </SlideUpModal>

            {/* Payment Methods */}
            <SlideUpModal
                title={t('支付方式')}
                onClose={() => setopenPaymentMethodsModal(false)}
                visible={openPaymentMethodsModal}
            >
                <View style={{ margin: theme.v_spacing_lg }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'stretch' }}>
                        {["借记卡或信用卡", "支付宝"].map((payment) => 
                            <Pressable
                                key={payment} 
                                onPress={() => {
                                    setPaymentMethods((prev) => {
                                        if (prev.includes(payment)) {
                                            const newPayment = prev.filter((p) => p !== payment);
                                            return _.uniq(newPayment);
                                        } else {
                                            const newPayment = prev.concat(payment);
                                            return _.uniq(newPayment);
                                        }
                                    });
                                }}
                                style={paymentMethods.includes(payment)
                                    ? { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: theme.h_spacing_sm, margin: theme.h_spacing_sm, borderColor: theme.secondary_color, borderWidth: 1, borderRadius: 6 }
                                    : { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: theme.h_spacing_sm, margin: theme.h_spacing_sm, borderColor: theme.fill_disabled, borderWidth: 1, borderRadius: 6 }}
                            >
                                {payment === '借记卡或信用卡' && <Entypo name="credit-card" size={16} color={paymentMethods.includes(payment) ? theme.secondary_color : theme.secondary_variant} />}
                                {payment === '支付宝' && <AntDesign name="alipay-square" size={16} color={paymentMethods.includes(payment) ? theme.secondary_color : theme.secondary_variant} />}
                                
                                <Text 
                                    style={paymentMethods.includes(payment)
                                        ? { fontSize: theme.font_size_base, color: theme.secondary_color, marginHorizontal: theme.h_spacing_sm } 
                                        : { fontSize: theme.font_size_base, color: theme.secondary_variant, marginHorizontal: theme.h_spacing_sm }}
                                >{t(payment)}</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </SlideUpModal>

            {/* Location */}
            <SlideUpModal
                title={t('活动地点')}
                onClose={() => setOpenLocationModal(false)}
                visible={openLocationModal}
                okTitle={t('搜索')}
                onOk={() => getForwardGeocoding({ location })}
                disableOk={location === ''}
            >
                <View style={[styles.modalContainer, { maxHeight: 300, marginVertical: 0 }]}>
                    <View style={[{...styles.inputContainerDefault, ...(onChange.location ? {} : styles.inputContainerError)}, {backgroundColor: theme.fill_placeholder}]}>
                        <TextInput
                            style={[styles.input, {color: theme.text_color}]}
                            placeholder={t('活动地点')}
                            onChangeText={(text) => {
                                setLocation(text);
                                setOnChange((prev) => ({
                                    ...prev,
                                    location: regexChecker('address', text)
                                }));
                            }}
                            placeholderTextColor={theme.secondary_variant}
                            value={location}
                            blurOnSubmit={false}
                            onSubmitEditing={({ nativeEvent: { text }}) => { 
                                setOnChange((prev) => ({
                                    ...prev,
                                    location: regexChecker('address', text)
                                }));
                                getForwardGeocoding({ location });
                            }}
                        />

                        {location !== '' && 
                            <Pressable 
                                hitSlop={10} 
                                onPress={() => {
                                    setLocation('');
                                    setOnChange((prev) => ({
                                        ...prev,
                                        location: regexChecker('address', '')
                                    }));
                                    setLongtitude();
                                    setLatitude();
                                }} 
                                style={styles.icon}
                            >
                                <Ionicons name="close-circle" size={theme.icon_size_xxs} color={theme.fill_mask} />
                            </Pressable>
                        }
                    </View>
                    <Text style={styles.error}>{!onChange.location && t(templateConstants.auth_patterns_error['address'])}</Text>

                    <ScrollView>
                        {result?.currentData?.features?.map((place) => 
                            <Pressable 
                                key={place.id}
                                onPress={() => {
                                    setLocation(place.place_name);
                                    setLongtitude(place?.geometry?.coordinates[0]);
                                    setLatitude(place?.geometry?.coordinates[1]);
                                    setOnChange((prev) => ({
                                        ...prev,
                                        location: regexChecker('address', place.place_name)
                                    }));
                                }}
                                style={({ pressed }) => [pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}
                            >
                                <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color }}>{place.place_name}</Text>
                            </Pressable>
                        )}
                    </ScrollView>
                </View>
            </SlideUpModal>

            {/* Time Setting */}
            <SlideUpModal
                style={{ height: '100%', paddingTop: insets.top, paddingHorizontal: 0 }}
                fullScreen
                title={t('设定时间段')}
                visible={openTimeSettingModal}
                okTitle={t('保存')}
                onOk={() => setOpenTimeSettingModal(false)}
                onClose={() => {
                    setIsRecursion(false);
                    setEvents([]);
                    setMarkedDates({});
                    setOpenTimeSettingModal(false)
                }}
            >
                <TimeSetting
                    date={date}
                    fromTime={fromTime}
                    endTime={endTime}
                    markedDates={markedDates}
                    events={events}
                    recursionNumber={recursionNumber}
                    recursionFrequency={recursionFrequency}
                    recursionEndDate={recursionEndDate}
                    recursionForAWeek={recursionForAWeek}
                    isRecursion={isRecursion}
                    setDate={setDate}
                    setFromTime={setFromTime}
                    setEndTime={setEndTime}
                    setMarkedDates={setMarkedDates}
                    setEvents={setEvents}
                    setRecursionNumber={setRecursionNumber}
                    setRecursionFrequency={setRecursionFrequency}
                    setRecursionEndDate={setRecursionEndDate}
                    setRecursionForAWeek={setRecursionForAWeek}
                    setIsRecursion={setIsRecursion}
                />
            </SlideUpModal>
        </View>
    );
};

export default EventExtra;