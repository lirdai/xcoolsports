import React, { useState, useRef, useContext } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import _ from 'lodash';
import { ExpandableCalendar, TimelineList, CalendarProvider, CalendarUtils, Calendar } from 'react-native-calendars';
import { AnimatedFAB } from 'react-native-paper';
import { Button, Menu, Modal } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import getDateFormat from '@xcoolsports/utils/getDateFormat';
import timelist from '@xcoolsports/components/TopicEdit/timelist';
import recursionByDay from '@xcoolsports/utils/recursionByDay';
import recursionByWeek from '@xcoolsports/utils/recursionByWeek';
import recursionByMonth from '@xcoolsports/utils/recursionByMonth';

const tomorrowDate = (date) => {
    const today = new Date(date);                         
    const utcDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));                    
    utcDate.setUTCDate(utcDate.getUTCDate() + 1);                    
    const formattedDate = utcDate.toISOString().split('T')[0];
    return formattedDate;
};

const styles = StyleSheet.create({
    modalContainer: {
        paddingVertical: theme.v_spacing_xl,
    },
});

const TimeSetting = ({
    date, fromTime, endTime, markedDates, events, recursionNumber, recursionFrequency, recursionEndDate, recursionForAWeek, 
    setDate, setFromTime, setEndTime, setMarkedDates, setEvents, setRecursionNumber, setRecursionFrequency,
    setRecursionEndDate, setRecursionForAWeek, isRecursion, setIsRecursion,
}) => {
    const { t, i18n } = useTranslation();
    const isRecursionRef = useRef(null);
    const isEventLengthRef = useRef(null);
    const theme = useContext(ThemeContext);
    isRecursionRef.current = isRecursion;
    isEventLengthRef.current = events.length === 0;

    const [openScheduleModal, setOpenScheduleModal] = useState(false);
    const [openFromTimeModal, setOpenFromTimeModal] = useState(false);
    const [openEndTimeModal, setOpenEndTimeModal] = useState(false);
    const [openRecursionModal, setOpenRecursionModal] = useState(false);
    const [openRecursionFrequencyModal, setOpenRecursionFrequencyModal] = useState(false);
    const [openCalendarModal, setOpenCalendarModal] = useState(false);

    const markedEvents = _.groupBy(events, e => CalendarUtils.getCalendarDateString(e.start));
    const recursionArray = Object.entries(recursionForAWeek).filter(([key, value]) => value === true).map(([key]) => Number(key));

    return (
        <View style={{ flex: 1 }}>
            <CalendarProvider
                date={date}
                onDateChanged={(e) => { 
                    if (isEventLengthRef.current) {
                        setDate(e);
                        setRecursionEndDate(e);
                    }
                }}
            >
                <ExpandableCalendar
                    theme={{ 
                        textDisabledColor: theme.fill_mask, 
                        dayTextColor: theme.text_color, 
                        monthTextColor: theme.text_color, 
                        calendarBackground: theme.fill_base, 
                        arrowColor: theme.brand_primary 
                    }}
                    enableSwipeMonths
                    minDate={getDateFormat(new Date())}
                    markingType={'dot'}
                    markedDates={markedDates}
                />
                
                <TimelineList
                    theme={{}}
                    format24h={true}
                    events={markedEvents}
                    timelineProps={{
                        onEventPress: (e) => {
                            setOpenScheduleModal(true);
                            setDate(e.date);
                            setFromTime(e.fromTime);
                            setEndTime(e.endTime);
                        },
                        theme: {calendarBackground: theme.fill_base},
                    }}
                />
            </CalendarProvider>

            <AnimatedFAB
                style={[{ 
                    flex: 1, position: 'absolute', bottom: 16, right: 16, 
                    backgroundColor: theme.brand_primary,
                }]}
                color={theme.text_color}
                icon={'plus'}
                label={t('添加')}
                onPress={() =>  setOpenScheduleModal(true)}
                visible={true}
                extended={false}
                animateFrom='right'
            />

            {/* Schedule */}
            <Modal
                dismissable
                visible={openScheduleModal}
                onDismiss={() => {
                    if (!isRecursionRef.current) {
                        if (fromTime.code >= endTime.code) {
                            setMarkedDates(() => ({
                                [date]: {marked: true},
                                [`${tomorrowDate(date)}`]: {marked: true},
                            }));
                            setRecursionEndDate(date);
                        } else {
                            setMarkedDates(() => ({
                                [date]: {marked: true},
                            }));
                            setRecursionEndDate(date);
                        }
                    }

                    if (fromTime.code >= endTime.code) {
                        setEvents([{
                            start: `${date} ${fromTime.value}`,
                            end: `${date} 23:59:00`,
                            title: `${t('活动时间')}`,
                            date,
                            fromTime,
                            endTime,
                        }, {
                            start: `${tomorrowDate(date)} 01:00:00`,
                            end: `${tomorrowDate(date)} ${endTime.value}`,
                            title: `${t('活动时间')}`,
                            date,
                            fromTime,
                            endTime,
                        }]);
                    } else {
                        setEvents([{
                            start: `${date} ${fromTime.value}`,
                            end: `${date} ${endTime.value}`,
                            title: `${t('活动时间')}`,
                            date,
                            fromTime,
                            endTime,
                        }]);
                    }

                    setOpenScheduleModal(false)
                }}
                contentContainerStyle={{ 
                    backgroundColor: theme.fill_base, 
                    marginHorizontal: theme.v_spacing_2xl, 
                    padding: theme.v_spacing_lg,
                }}
            >
                <View style={[styles.modalContainer, { width: '100%' }]}>
                    <Text style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', color: theme.text_color }}>{t('请选择')} {date} {t('安排')}</Text>

                    <View style={{ width: "100%", flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: theme.v_spacing_xl, paddingHorizontal: theme.v_spacing_2xl * 2 }}>
                        <Button 
                            style={{ borderRadius: 0 }}
                            contentStyle={{ borderBottomColor: theme.brand_primary, borderBottomWidth: 2 }}
                            onPress={() => setOpenFromTimeModal(true)}
                        >
                            {fromTime.title}
                        </Button>

                        <View style={{ height: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{color: theme.text_color}}>—</Text>
                        </View>

                        <Button 
                            style={{ borderRadius: 0 }} 
                            contentStyle={{ borderBottomColor: theme.brand_primary, borderBottomWidth: 2 }}
                            onPress={() => setOpenEndTimeModal(true)}
                        >
                            {endTime.title}
                        </Button>
                    </View>

                    <Button 
                        style={{ borderRadius: 0, marginHorizontal: theme.v_spacing_2xl * 2 }}
                        onPress={() => setOpenRecursionModal(true)}
                    >
                        <Text style={{ width: '100%', color: theme.text_color }}>{t('时间重复设置')}</Text>
                    </Button>
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Button
                        style={{ backgroundColor: theme.secondary_color, width: '40%', borderRadius: 10 }} 
                        onPress={() => {
                            setOpenScheduleModal(false);
                            setIsRecursion(false);
                            setEvents([]);
                            setMarkedDates({});
                        }}
                    >
                        <Text style={{ color: theme.text_color, fontWeight: 'bold' }}>{t('清除')}</Text>
                    </Button>

                    <Button
                        style={{ backgroundColor: theme.secondary_color, width: '40%', borderRadius: 10 }} 
                        onPress={() => {
                            if (!isRecursionRef.current) {
                                if (fromTime.code >= endTime.code) {
                                    setMarkedDates(() => ({
                                        [date]: {marked: true},
                                        [`${tomorrowDate(date)}`]: {marked: true},
                                    }));
                                    setRecursionEndDate(date);
                                } else {
                                    setMarkedDates(() => ({
                                        [date]: {marked: true},
                                    }));
                                    setRecursionEndDate(date);
                                }
                            }

                            if (fromTime.code >= endTime.code) {
                                setEvents([{
                                    start: `${date} ${fromTime.value}`,
                                    end: `${date} 23:59:00`,
                                    title: `${t('活动时间')}`,
                                    date,
                                    fromTime,
                                    endTime,
                                }, {
                                    start: `${tomorrowDate(date)} 01:00:00`,
                                    end: `${tomorrowDate(date)} ${endTime.value}`,
                                    title: `${t('活动时间')}`,
                                    date,
                                    fromTime,
                                    endTime,
                                }]);
                            } else {
                                setEvents([{
                                    start: `${date} ${fromTime.value}`,
                                    end: `${date} ${endTime.value}`,
                                    title: `${t('活动时间')}`,
                                    date,
                                    fromTime,
                                    endTime,
                                }]);
                            }

                            setOpenScheduleModal(false);
                        }}
                    >
                        <Text style={{ color: theme.text_color, fontWeight: 'bold' }}>{t('确定')}</Text>
                    </Button>
                </View>
            </Modal>

            {/* Recursion */}
            <Modal
                dismissable
                visible={openRecursionModal}
                onDismiss={() => setOpenRecursionModal(false)}
                contentContainerStyle={{ 
                    backgroundColor: theme.fill_base, 
                    marginHorizontal: theme.v_spacing_2xl, 
                    padding: theme.v_spacing_lg,
                }}
            >
                <View style={styles.modalContainer}>
                    <Text style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', color: theme.text_color }}>{t('时间重复设置')}</Text>

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color }}>{t('重复周期')}</Text>
                    <View style={{ width: "100%", flexDirection: 'row', marginVertical: theme.v_spacing_md, alignItems: 'center', justifyContent: 'flex-start' }}>
                        {recursionFrequency === '日' && <TextInput 
                            style={{ color: theme.text_color, borderWidth: 1, borderColor: theme.secondary_color , height: 50, width: '20%', marginRight: theme.v_spacing_md, textAlign: 'center' }}
                            value={recursionNumber}
                            onChangeText={(text) => {
                                if (!/^[\d]{1,3}$/.test(text)) { setRecursionNumber(""); return; }
                                if (text === "0") { setRecursionNumber('1'); return; }
                                if (text === "0") { setRecursionNumber('10'); return; }
                                if (text.length <= 2) { setRecursionNumber(text); return; }
                            }}
                        />}

                        <Button 
                            style={{ borderRadius: 0 }} 
                            contentStyle={{ borderColor: theme.secondary_color, borderWidth: 1, height: 50, }}
                            onPress={() => setOpenRecursionFrequencyModal(true)}
                        >
                            {t(recursionFrequency)}
                        </Button>
                    </View>

                    {recursionFrequency === '周' &&  <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color }}>{t('在以下日期重复')}</Text>}
                    {recursionFrequency === '周' && 
                        <View style={{ flexDirection: 'row', marginVertical: theme.v_spacing_md, justifyContent: 'space-around' }}>
                            <Pressable 
                                style={recursionForAWeek[0]
                                    ? { borderRadius: 100, width: 35, height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.fill_mask } 
                                    : { borderColor: theme.text_color, borderWidth: 1, borderRadius: 100, width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => setRecursionForAWeek((prev) => ({
                                    ...prev,
                                    0: !recursionForAWeek[0],
                                }))}
                            >
                                <Text style={{color: theme.text_color}}>{t('Sun')}</Text>
                            </Pressable>

                            <Pressable 
                                style={recursionForAWeek[1]
                                    ? { borderRadius: 100, width: 35, height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.fill_mask } 
                                    : { borderColor: theme.text_color, borderWidth: 1, borderRadius: 100, width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => setRecursionForAWeek((prev) => ({
                                    ...prev,
                                    1: !recursionForAWeek[1],
                                }))}
                            >
                                <Text style={{color: theme.text_color}}>{t('Mon')}</Text>
                            </Pressable>

                            <Pressable 
                                style={recursionForAWeek[2]
                                    ? { borderRadius: 100, width: 35, height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.fill_mask } 
                                    : { borderColor: theme.text_color, borderWidth: 1, borderRadius: 100, width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => setRecursionForAWeek((prev) => ({
                                    ...prev,
                                    2: !recursionForAWeek[2],
                                }))}
                            >
                                <Text style={{color: theme.text_color}}>{t('Tue')}</Text>
                            </Pressable>

                            <Pressable 
                                style={recursionForAWeek[3]
                                    ? { borderRadius: 100, width: 35, height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.fill_mask } 
                                    : { borderColor: theme.text_color, borderWidth: 1, borderRadius: 100, width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => setRecursionForAWeek((prev) => ({
                                    ...prev,
                                    3: !recursionForAWeek[3],
                                }))}
                            >
                                <Text style={{color: theme.text_color}}>{t('Wed')}</Text>
                            </Pressable>

                            <Pressable 
                                style={recursionForAWeek[4]
                                    ? { borderRadius: 100, width: 35, height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.fill_mask } 
                                    : { borderColor: theme.text_color, borderWidth: 1, borderRadius: 100, width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => setRecursionForAWeek((prev) => ({
                                    ...prev,
                                    4: !recursionForAWeek[4],
                                }))}
                            >
                                <Text style={{color: theme.text_color}}>{t('Thu')}</Text>
                            </Pressable>

                            <Pressable 
                                style={recursionForAWeek[5]
                                    ? { borderRadius: 100, width: 35, height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.fill_mask } 
                                    : { borderColor: theme.text_color, borderWidth: 1, borderRadius: 100, width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => setRecursionForAWeek((prev) => ({
                                    ...prev,
                                    5: !recursionForAWeek[5],
                                }))}
                            >
                                <Text style={{color: theme.text_color}}>{t('Fri')}</Text>
                            </Pressable>

                            <Pressable 
                                style={recursionForAWeek[6]
                                    ? { borderRadius: 100, width: 35, height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.fill_mask } 
                                    : { borderColor: theme.text_color, borderWidth: 1, borderRadius: 100, width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => setRecursionForAWeek((prev) => ({
                                    ...prev,
                                    6: !recursionForAWeek[6],
                                }))}
                            >
                                <Text style={{color: theme.text_color}}>{t('Sat')}</Text>
                            </Pressable>
                        </View>
                    }

                    {recursionFrequency === '个月' &&  <Text style={{ marginVertical: theme.v_spacing_md, fontWeight: 'bold', color: theme.text_color }}>{t('每个月的')} {parseInt(date.split("-")[2])} {t('号')}</Text>}

                    <View style={{ flexDirection: 'row', height: 50, alignItems: 'center', marginVertical: theme.v_spacing_md }}>
                        <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{date}</Text>
                        <Text style={{color: theme.text_color}}> {t('到')} </Text>
                       
                        <Button 
                            contentStyle={{ borderBottomWidth: 2, borderBottomColor: theme.brand_primary, borderRadius: 0 }}
                            style={{ borderRadius: 0 }}
                            onPress={() => setOpenCalendarModal(true)}
                        >
                            <Text style={{ fontWeight: 'bold' }}>{recursionEndDate}</Text>
                        </Button>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: theme.v_spacing_md }}>
                        <Button
                            style={{ backgroundColor: theme.secondary_color, width: '40%', borderRadius: 10 }} 
                            onPress={() => {
                                setOpenRecursionModal(false);
                                setIsRecursion(false);
                            }}
                        >
                            <Text style={{ color: theme.text_color, fontWeight: 'bold' }}>{t('取消')}</Text>
                        </Button>

                        <Button
                            style={{ backgroundColor: theme.secondary_color, width: '40%', borderRadius: 10 }} 
                            onPress={() => {
                                var time1 = new Date(date).getTime();
                                var time2 = new Date(recursionEndDate).getTime();
                                var diff = Math.abs(time2 - time1);
                                var daysDiff = Math.floor(diff / (24 * 60 * 60 * 1000));

                                if (daysDiff < 1) return; 
                                if (recursionFrequency === '日' && !Number(recursionNumber)) return;
                                if (recursionFrequency === '周' && (!Number(recursionNumber) || recursionArray.length === 0)) return;
                                if (recursionFrequency === '个月' && !Number(recursionNumber)) return; 

                                setIsRecursion(true);
                                setOpenRecursionModal(false);

                                // 将日期转换为Date.UTC()所需的参数形式
                                var startDateString = date;
                                var endDateString = recursionEndDate;
                                var startDateObj = new Date(`${startDateString}T00:00:00.000Z`);
                                var endDateObj = new Date(`${endDateString}T00:00:00.000Z`);
                                
                                var startYear = startDateObj.getUTCFullYear();
                                var endYear = endDateObj.getUTCFullYear();
                                var startMonth = startDateObj.getUTCMonth();
                                var endMonth = endDateObj.getUTCMonth();
                                var startDay = startDateObj.getUTCDate();
                                var endDay = endDateObj.getUTCDate();
                                
                                var utcStartDate = Date.UTC(startYear, startMonth, startDay);
                                var utcEndDate = Date.UTC(endYear, endMonth, endDay);

                                if (recursionFrequency === '日') {
                                    recursionByDay(utcStartDate, utcEndDate, Number(recursionNumber), setMarkedDates);
                                    return;
                                } else if (recursionFrequency === '周') {
                                    recursionByWeek(utcStartDate, utcEndDate, recursionArray, setMarkedDates);
                                    return;
                                } else if (recursionFrequency === '个月') {
                                    recursionByMonth(utcStartDate, utcEndDate, parseInt(date.split("-")[2]), setMarkedDates);
                                    return;
                                }
                            }}
                        >
                            <Text style={{ color: theme.text_color, fontWeight: 'bold' }}>{t('确定')}</Text>
                        </Button>
                    </View>
                </View>
            </Modal>

            {/* From Time */}
            <Modal
                dismissable
                visible={openFromTimeModal}
                onDismiss={() => setOpenFromTimeModal(false)}
                contentContainerStyle={{ 
                    backgroundColor: theme.fill_base, 
                    marginHorizontal: theme.v_spacing_2xl, 
                    padding: theme.v_spacing_lg,
                }}
            >
                <ScrollView style={{ maxHeight: 200 }}>
                    {timelist.map((time) => 
                        <Menu.Item
                            titleStyle={{color: theme.text_color}} 
                            key={time.title} 
                            title={time.title}
                            onPress={() => { 
                                setOpenFromTimeModal(false); 
                                setFromTime(time); 
                            }} 
                        />
                    )}
                </ScrollView>
            </Modal>

            {/* End Time */}
            <Modal
                dismissable
                visible={openEndTimeModal}
                onDismiss={() => setOpenEndTimeModal(false)}
                contentContainerStyle={{ 
                    backgroundColor: theme.fill_base, 
                    marginHorizontal: theme.v_spacing_2xl, 
                    padding: theme.v_spacing_lg,
                }}
            >
                <ScrollView style={{ maxHeight: 200 }}>
                    {timelist.map((time) => 
                        <Menu.Item 
                            titleStyle={{color: theme.text_color}} 
                            key={time.title} 
                            title={time.title}
                            onPress={() => { 
                                setOpenEndTimeModal(false); 
                                setEndTime(time); 
                            }} 
                        />
                    )}
                </ScrollView>
            </Modal>

            {/* Recursion Frequency */}
            <Modal
                dismissable
                visible={openRecursionFrequencyModal}
                onDismiss={() => setOpenRecursionFrequencyModal(false)}
                contentContainerStyle={{ 
                    backgroundColor: theme.fill_base, 
                    marginHorizontal: theme.v_spacing_2xl, 
                    padding: theme.v_spacing_lg,
                }}
            >
                <ScrollView style={{ maxHeight: 200 }}>
                    {["日", "周", "个月"].map((frequency) => 
                        <Menu.Item 
                            titleStyle={{color: theme.text_color}} 
                            key={frequency} 
                            title={t(frequency)} 
                            onPress={() => { 
                                setOpenRecursionFrequencyModal(false); 
                                setRecursionFrequency(frequency); 
                            }} 
                        />
                    )}
                </ScrollView>
            </Modal>

            {/* Calendar */}
            <Modal
                dismissable
                visible={openCalendarModal}
                onDismiss={() => setOpenCalendarModal(false)}
                contentContainerStyle={{ 
                    backgroundColor: theme.fill_base, 
                    marginHorizontal: theme.v_spacing_2xl, 
                    padding: theme.v_spacing_lg,
                }}
            >
                <Calendar
                    theme={{ 
                        textDisabledColor: theme.fill_mask, 
                        dayTextColor: theme.text_color, 
                        monthTextColor: theme.text_color, 
                        calendarBackground: theme.fill_base, 
                        arrowColor: theme.brand_primary 
                    }}
                    enableSwipeMonths
                    minDate={tomorrowDate(date)}
                    onDayPress={day => {
                        setRecursionEndDate(day.dateString);
                        setOpenCalendarModal(false);
                    }}
                />
            </Modal>
        </View>
    );
};

export default TimeSetting;