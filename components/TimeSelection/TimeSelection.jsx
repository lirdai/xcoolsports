import React, { useEffect, useMemo, useState, useContext } from 'react';
import { StyleSheet, View, Text, Pressable, SectionList } from 'react-native';
import _ from 'lodash';
import { Calendar } from 'react-native-calendars';
import { useDispatch, useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

import Container from '@xcoolsports/components/Common/Container';
import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import availableSlotsByDay from '@xcoolsports/utils/availableSlotsByDay';
import availableSlotsByWeek from '@xcoolsports/utils/availableSlotsByWeek';
import availableSlotsByMonth from '@xcoolsports/utils/availableSlotsByMonth';
import getDateFormat from '@xcoolsports/utils/getDateFormat';
import getTimeFormat from '@xcoolsports/utils/getTimeFormat';
import Loading from '@xcoolsports/components/Common/Pages/Loading';
import Empty from '../Common/Pages/Empty';
import iso8601 from '@xcoolsports/utils/ios8601';
import continuousMarkedDays from '@xcoolsports/utils/continuousMarkedDays';
import PopUpModal from '@xcoolsports/components/utils/PopUpModal';
import RenderError from '@xcoolsports/components/Common/Pages/RenderError';
import { api, selectEventById, toastActions, toastTypes, selectCurrentUser } from '@xcoolsports/data';
import templateConstants from '@xcoolsports/constants/templateConstants';

const isWithinSevenDays = (date1, date2) => {
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // 一天的毫秒数

    // 将日期字符串转换为 Date 对象
    const utcDate1 = new Date(date1);
    const utcDate2 = new Date(date2);

    // 将日期转换为 UTC 时间
    utcDate1.setUTCHours(0, 0, 0, 0);
    utcDate2.setUTCHours(0, 0, 0, 0);

    const timeDifference = utcDate2.getTime() - utcDate1.getTime();
    const differenceInDays = Math.floor(timeDifference / millisecondsPerDay);

    return differenceInDays < 7;
}

const beforeOrAfterDurationDate = (isFrom, date, duration) => {
    if (!date || !duration) return;

    var date = new Date(date);
    var maxDurationHours = duration + 24;
    var utcDate = new Date(date.toUTCString());

    var beforeDate = new Date(utcDate);
    beforeDate.setUTCHours(utcDate.getUTCHours() - maxDurationHours);

    var afterDate = new Date(utcDate);
    afterDate.setUTCHours(utcDate.getUTCHours() + maxDurationHours);

    var beforeResult = beforeDate.toISOString();
    var afterResult = afterDate.toISOString();

    return isFrom ? getDateFormat(new Date(beforeResult)) : getDateFormat(new Date(afterResult))
}

const styles = StyleSheet.create({
    modalContainer: {
        margin: theme.v_spacing_lg,
    },
    modalTitle: {
        fontSize: theme.font_size_heading, 
        paddingVertical: theme.v_spacing_sm,
    },
    modalContent: { 
        flexDirection: 'row',
        justifyContent: "flex-end",
        marginTop: theme.v_spacing_xl,
    },
    modalButton: {
        marginHorizontal: theme.h_spacing_xl
    },
    modalText: {
        fontSize: theme.font_size_heading
    },
});

const TimeSelection = ({ route, navigation }) => {
    const { t, i18n } = useTranslation();
    const { eventId, start, end } = route.params;
    const isEventSelected = !Number.isNaN(Number(eventId));
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const theme = useContext(ThemeContext);

    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset(); // 获取当前时区偏移，单位为分钟
    const localNow = new Date(now.getTime() - (timezoneOffset * 60000)); // 根据时区偏移调整时间

    const [openCalendarModal, setOpenCalendarModal] = useState(false);
    const [openCancelTimeModal, setOpenCancelTimeModal] = useState(false);
    const [extendedHeaderHeight, setExtendedHeaderHeight] = useState(0);
    const [startSelected, setStartSelected] = useState();
    const [endSelected, setEndSelected] = useState();
    const [getReadyToSearch, setGetReadyToSearch] = useState(false);
    const [timeTable, setTimeTable] = useState([]);
    const [daysSelected, setDaysSelected] = useState({
        [`${new Date().getTime() < new Date(start).getTime() ? getDateFormat(new Date(start)) : getDateFormat(new Date())}`]: {"color": theme.secondary_variant, "endingDay": true, "startingDay": true, "textColor": theme.fill_base, "timestamp": new Date().getTime() < new Date(start).getTime() ? new Date(start).getTime() : new Date().getTime()}, 
    });

    const event = useSelector((state) => selectEventById(state, eventId));
    const markedDates = continuousMarkedDays(daysSelected);

    const { data, isLoading, isError, error } = api.endpoints.getEvent.useQuery({ id: eventId }, { skip: !isEventSelected });
    const { data: timeTableList } = api.endpoints.getEventTimeTableList.useQuery({ 
        event_plan_id: eventId, 
        from: beforeOrAfterDurationDate(true, Object.keys(daysSelected)[0], iso8601(event?.max_duration)), 
        to: Object.keys(daysSelected)[1] ? beforeOrAfterDurationDate(false, Object.keys(daysSelected)[1], iso8601(event?.max_duration)) : beforeOrAfterDurationDate(false, Object.keys(daysSelected)[0], iso8601(event?.max_duration)),
    }, { skip: !isEventSelected || Object.keys(daysSelected).length === 0 });
    const [cancelTime] = api.endpoints.cancelTime.useMutation();

    const searchPossibleDays = () => {
        if (event.recur_type === "BYDAY") {
            const events = availableSlotsByDay(
                start, end,
                Object.keys(daysSelected)[0],
                Object.keys(daysSelected)[1] ? Object.keys(daysSelected)[1] : Object.keys(daysSelected)[0], 
                event.duration_type, 
                iso8601(event.min_duration), 
                iso8601(event.max_duration), 
                event.time_slots, 
                event.recur_amount,
                event.time_slots[event.time_slots.length - 1] + 0.5
            );
            setTimeTable(events);
        } else if (event.recur_type === "BYWEEK") {
            const events = availableSlotsByWeek(
                start, end,
                Object.keys(daysSelected)[0],
                Object.keys(daysSelected)[1] ? Object.keys(daysSelected)[1] : Object.keys(daysSelected)[0], 
                event.duration_type, 
                iso8601(event.min_duration), 
                iso8601(event.max_duration), 
                event.time_slots, 
                event.recur_days,
                event.time_slots[event.time_slots.length - 1] + 0.5
            );
            setTimeTable(events);
        } else if (event.recur_type === "BYMONTH") {
            const events = availableSlotsByMonth(
                start, end,
                Object.keys(daysSelected)[0],
                Object.keys(daysSelected)[1] ? Object.keys(daysSelected)[1] : Object.keys(daysSelected)[0], 
                event.duration_type, 
                iso8601(event.min_duration), 
                iso8601(event.max_duration), 
                event.time_slots, 
                parseInt(event.first_date.split("-")[2]),
                event.time_slots[event.time_slots.length - 1] + 0.5
            );
            setTimeTable(events);
        }
    };

    const handleCancelTime = async () => {
        const newCancel = { start: startSelected, end: endSelected };
        await cancelTime({ body: newCancel, event_plan_id: event.id });
        setOpenCancelTimeModal(false); 
    };
    
    useEffect(() => {
        if (data && event) searchPossibleDays();
    }, [event]);

    useEffect(() => {
        if (getReadyToSearch) {
            searchPossibleDays();
            setGetReadyToSearch(false);
        }
    }, [getReadyToSearch]);

    const occupancyList = timeTableList?.events.map((event) => ({
        start: new Date(event.start),
        end: new Date(event.end),
        cancelled: event.status === "CANCELLED",
    })) || [];

    const dataArray = useMemo(() => {
        return _(timeTable)
            .groupBy(item => item.start.toISOString().substring(0, 10))
            .map((data, key) => ({ 
                date: key, 
                data: data
                    .filter((slot) => {
                        const fullMatch = !!occupancyList.find((full) => {
                            return !full.cancelled && slot.start.valueOf() === full.start.valueOf() && slot.end.valueOf() === full.end.valueOf();
                        });
                        const overlap = !!occupancyList.find((full) => {
                            return slot.end > full.start && slot.start <= full.end;
                        });

                        return !overlap || fullMatch;
                    })
                })
            )
            .value();
    }, [occupancyList, timeTable]);

    return (
        <Container 
            header={{
                title: `${t('选择活动时间')}`, 
                headerLeft: {onPress: navigation.goBack},
                headerTitle: {showTitle: true}, 
                headerRight: {},
                extendedHeader: {
                    avoidHeader: true,
                    extendedHeaderComponent: 
                        <View onLayout={({ nativeEvent }) => setExtendedHeaderHeight(nativeEvent.layout.height)}>
                            <Pressable 
                                style={{ borderWidth: 1, borderColor: theme.secondary_variant, borderRadius: 10, height: 50, margin: theme.v_spacing_lg, justifyContent: 'center', alignItems: 'center' }} 
                                onPress={() => setOpenCalendarModal(true)}
                            >
                                {Object.keys(daysSelected).length === 0 && <Text style={{ color: theme.fill_mask }}>{t('请选择活动时间')}</Text>}
                                {Object.keys(daysSelected).length === 1 && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{Object.keys(daysSelected)[0]}</Text>}
                                {Object.keys(daysSelected).length === 2 && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{Object.keys(daysSelected)[0]} - {Object.keys(daysSelected)[1]}</Text>}
                            </Pressable>
                        </View>
                },
            }}
        >
            <View style={{ marginTop: extendedHeaderHeight }}>
                <Loading isLoading={isLoading} />
                <RenderError isError={!isLoading && isError} error={error} />
                <Empty isEmpty={!isLoading && !isError && dataArray?.length === 0} />
                {(!isLoading && !isError && dataArray?.length !== 0) &&
                    <SectionList 
                        initialNumToRender={10}
                        sections={dataArray||[]}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({ item }) => {
                            return (
                                <Pressable 
                                    style={({ pressed }) => [{ marginHorizontal: theme.v_spacing_lg, marginVertical: theme.v_spacing_sm, padding: theme.v_spacing_xl, borderRadius: 10, borderWidth: 1, borderColor: theme.fill_disabled }, pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}
                                    onPress={() => {
                                        if (timeTableList?.events.find((event) => `${new Date(event.start)}` === `${item.start}` && `${new Date(event.end)}` === `${item.end}`)?.space_left === 0) return;
                                        else if (event.planner.username === currentUser.username) { 
                                            setOpenCancelTimeModal(true); 
                                            setStartSelected(item.start);
                                            setEndSelected(item.end);
                                            return; 
                                        }
                                        else return navigation.navigate(`${t('生成订单')}`,  { eventId: event.id, start: new Date(item.start).toUTCString(), end: new Date(item.end).toUTCString() })
                                    }}
                                    android_ripple={{color: '', borderless: false, radius: 5, foreground: true}}
                                    onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                                >
                                    <Text numberOfLines={1} style={{ paddingBottom: theme.v_spacing_md, color: theme.text_color }}>{t('当天')} {getTimeFormat(new Date(item.start))} {t('到')} {getDateFormat(new Date(item.end))} {getTimeFormat(new Date(item.end))}</Text>
                                    {timeTableList?.events.find((event) => `${new Date(event.start)}` === `${item.start}` && `${new Date(event.end)}` === `${item.end}`)
                                        && <Text style={{ paddingBottom: theme.v_spacing_md, color: theme.text_color }}>{t('还剩')} {timeTableList?.events.find((event) => `${new Date(event.start)}` === `${item.start}` && `${new Date(event.end)}` === `${item.end}`)?.space_left} {t('个空位')}</Text>
                                    }
        
                                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {event.price_type && 
                                            <View style={{ flexDirection: 'row' }}>
                                                {event.currency === '加元' && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>$</Text>}
                                                <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{event.price} {t(templateConstants.prices.find((price) => price.url === event.price_type).title)}</Text>
                                            </View>
                                        }

                                        {timeTableList?.events.find((event) => `${new Date(event.start)}` === `${item.start}` && `${new Date(event.end)}` === `${item.end}`)?.space_left === 0
                                            ?
                                            <View style={{ height: 35, width: 80, borderRadius: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: theme.fill_placeholder }}>
                                                <Text style={{ color: theme.text_color, fontWeight: 'bold', fontSize: 16 }}>{t('已满')}</Text>
                                            </View>
                                            :
                                            <View style={{ height: 35, width: 80, borderRadius: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: theme.primary_color }}>
                                                {event.planner.username !== currentUser.username
                                                    ? <Text style={{ color: theme.white_icon, fontWeight: 'bold', fontSize: 16 }}>{t('选择')}</Text>
                                                    : <Text style={{ color: theme.white_icon, fontWeight: 'bold', fontSize: 16 }}>{t('取消')}</Text>
                                                }
                                            </View>
                                        }
                                    </View>
                                </Pressable>    
                            )                                   
                        }}
                        renderSectionHeader={({ section: { date } }) => ( 
                            <Text style={{ color: theme.text_color, fontWeight: 'bold', margin: theme.v_spacing_lg, fontSize: theme.font_size_caption }}>{date}</Text>
                        )}
                    />
                }
            </View>

            <PopUpModal
                title={`${t('选择日期')}`}
                onClose={() => setOpenCalendarModal(false)}
                visible={openCalendarModal}
                okTitle={`${t('搜索')}`}
                disableOk={false}
                onOk={() => {
                    setGetReadyToSearch(true);
                    setOpenCalendarModal(false);
                }}
            >
                <View style={[styles.modalContainer, { marginTop: 0 }]}>
                    <Calendar 
                        theme={{ textDisabledColor: theme.fill_mask, dayTextColor: theme.text_color, monthTextColor: theme.text_color, calendarBackground: theme.fill_base, arrowColor: theme.brand_primary }}
                        enableSwipeMonths
                        minDate={localNow.getTime() < new Date(start).getTime() ? getDateFormat(new Date(start)) : getDateFormat(localNow)}
                        maxDate={getDateFormat(new Date(end))}
                        markingType={"period"}
                        markedDates={Object.keys(daysSelected).length === 1 ? daysSelected : markedDates}
                        onDayPress={(e) => { 
                            if (Object.keys(daysSelected).length > 1) {
                                setDaysSelected({});
                            } else if (Object.keys(daysSelected)[0] && e.timestamp < daysSelected[Object.keys(daysSelected)[0]].timestamp) {
                                setDaysSelected({});
                            } else if (Object.keys(daysSelected)[0] && !isWithinSevenDays(Object.keys(daysSelected)[0], e.dateString)) {
                                setDaysSelected({});
                                dispatch(toastActions.showToastAutoRemove({ type: toastTypes.WARNING, text: '只能选择七天之内的日期' }));
                            } else {
                                setDaysSelected((prev) => ({
                                    ...prev,
                                    [e.dateString]: {startingDay: true, endingDay: true, color: theme.secondary_variant, textColor: theme.fill_base, timestamp: e.timestamp},
                                }));
                            }
                        }}
                    />
                </View>
            </PopUpModal>

            <PopUpModal
                title={`${t('取消时间段')}`}
                onClose={() => setOpenCancelTimeModal(false)}
                visible={openCancelTimeModal}
            >
                <View style={styles.modalContainer}>
                    <Text style={[{color: theme.text_color}, styles.modalTitle]}>{`${t('你确定要取消这个时间段么')}`}?</Text>

                    <View style={styles.modalContent}>
                        <Pressable hitSlop={10} style={styles.modalButton} onPress={() => setOpenCancelTimeModal(false)}> 
                            <Text style={[{color: theme.text_color}, styles.modalText]}>{`${t('取消')}`}</Text> 
                        </Pressable>
            
                        <Pressable hitSlop={10} style={styles.modalButton} onPress={handleCancelTime} onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}> 
                            <Text style={[{color: theme.text_color}, styles.modalText]}>{`${t('确定')}`}</Text> 
                        </Pressable>
                    </View>
                </View>
            </PopUpModal>
        </Container>
    );
};

export default TimeSelection;