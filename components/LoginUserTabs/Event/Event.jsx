import React, { useRef, useState, useEffect, useContext } from 'react';
import { 
    Pressable, View, Text, FlatList, RefreshControl, 
    StyleSheet, Dimensions, PermissionsAndroid, Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useScrollToTop } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Feather, Entypo, AntDesign } from '@expo/vector-icons'; 
import { Chip } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import Animated, { FadeIn } from 'react-native-reanimated';
import Geolocation from 'react-native-geolocation-service';
import { useNetInfo } from "@react-native-community/netinfo";
import { useTranslation } from 'react-i18next';

import PopUpModal from '@xcoolsports/components/utils/PopUpModal';
import urlConstants from '@xcoolsports/constants/urls';
import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import Image from '@xcoolsports/components/utils/Image';
import Container from '@xcoolsports/components/Common/Container';
import getDateFormat from '@xcoolsports/utils/getDateFormat';
import Empty from '@xcoolsports/components/Common/Pages/Empty';
import End from '@xcoolsports/components/Common/Pages/End';
import Loading from '@xcoolsports/components/Common/Pages/Loading';
import CustomErrorBoundary from '@xcoolsports/components/Common/Pages/CustomErrorBoundary';
import RenderError from '@xcoolsports/components/Common/Pages/RenderError';
import templateConstants from '@xcoolsports/constants/templateConstants';
import iso8601 from '@xcoolsports/utils/ios8601';
import continuousMarkedDays from '@xcoolsports/utils/continuousMarkedDays';
import AnimatedPlusMinusIcons from '@xcoolsports/components/utils/AnimationComponents/AnimatedPlusMinusIcons';
import { 
    api, selectCurrentUser, toastActions, selectManyEventsWithTopicsById,
    toastTypes, locationActions, selectLocation, selectTags,
} from '@xcoolsports/data';
import PrimaryContainedButton from '@xcoolsports/components/utils/Buttons/PrimaryContainedButton';

const styles = StyleSheet.create({
    icon: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shadow: {
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    },
    modalContainer: {
        margin: theme.v_spacing_lg,
    },
    imageSmall: {
        width: "100%", 
        height: 300,
    },
    imageMedium: {
        width: "100%", 
        height: 400,
    },
    imageLarge: {
        width: "100%", 
        height: 500,
    },
});

const getScreenSize = (windowWidth) => {
    if (windowWidth < 639) {
        return {
            'image': styles.imageSmall,
        }
    }

    if (windowWidth < 767) {
        return {
            'image': styles.imageMedium,
        }
    }

    return {
        'image': styles.imageLarge,
    }
};

const Home = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const windowWidth = Dimensions.get("window").width;
    const windowSize = getScreenSize(windowWidth);
    const theme = useContext(ThemeContext);

    const ref = useRef(null);
    const netInfo = useNetInfo();
    useScrollToTop(ref);

    const [openCalendarModal, setOpenCalendarModal] = useState(false);
    const [openDistanceModal, setOpenDistanceModal] = useState(false);
    const [openCurrentLocationModal, setOpenCurrentLocationModal] = useState(false);
    const [openTypeModal, setOpenTypeModal] = useState(false);
    const [openPeopleModal, setOpenPeopleModal] = useState(false);
    const [openDurationModal, setOpenDurationModal] = useState(false);
    const [viewOffset, setViewOffset] = useState(0);

    const [eventIds, setEventIds] = useState([]);
    const [daysSelected, setDaysSelected] = useState({});
    const [distance, setDistance] = useState(0);
    const [typeSelected, setTypeSelected] = useState('');
    const [people, setPeople] = useState(0);
    const [duration, setDuration] = useState({ days: 0, hours: 0 });
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [searchState, setSearchState] = useState({});

    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const location = useSelector(selectLocation); 
    const totalTags = useSelector(selectTags);
    const events = useSelector((state) => selectManyEventsWithTopicsById(state, eventIds));
    const markedDates = continuousMarkedDays(daysSelected);
    
    const { data, isLoading, isFetching, error, isError, isUninitialized, refetch } = api.endpoints.getManyEvents
        .useQuery({ 
            page, 
            first_date: searchState.first_date, 
            last_date: searchState.last_date, 
            coordinate: location?.user_current_coordinate?.latitude ? `${location?.user_current_coordinate?.longitude},${location?.user_current_coordinate?.latitude}` : undefined,
            distance: searchState.distance,
            tags: searchState.tags,
            num_guests: searchState.people,
            duration: searchState.duration
        }, { skip: !netInfo.isConnected || !hasNext });
    
    const fetchNextPage = () => {
        if (!isFetching && !isError && hasNext) {
            setPage((prev) => prev + 1);
        }
    }

    const handleRefresh = () => {
        if (!isFetching) {
            if (page !== 1) {
                setPage(1);
                setHasNext(true);
            } else if (!isUninitialized) {
                refetch();
            }
        }
    }

    useEffect(() => {
        setPage(1);
        setHasNext(true);
        if (!isUninitialized) refetch();
    }, [currentUser.username]);

    useEffect(() => {
        if (data?.events) {
            if (page === 1) setEventIds(data.events.map((event) => event.id));
            else setEventIds((prev) => prev.concat(data.events.map((event) => event.id)));
        };
    }, [data?.events]);

    useEffect(() => {
        if (data && !isFetching) setHasNext(data.hasNext);
    }, [data?.hasNext, isFetching]);

    // request permission for Android and iOS
    const requestLocationPermission = async () => {
        try {
            if (Platform.OS === 'ios') {
                const granted = await Geolocation.requestAuthorization("always");
                dispatch(locationActions.grantGpsPermission(granted));
            } else {
                const granted = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]);
                dispatch(locationActions.grantGpsPermission(granted['android.permission.ACCESS_FINE_LOCATION']));
            }

            if (location.is_gps_permission_granted && location.is_gps_permission_granted !== 'granted') {
                dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '未获得位置权限，可能会导致部分功能无法正常使用' }))
            }
        } catch (error) {
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '获得位置权限出错，请重试' }));
        }
    };

    const showDiscount = (price, old_price) => {
        if (price === undefined || price === null) return null;
        if (old_price === undefined || old_price === null) return null;

        const discount = Number(price) / Number(old_price);
        if (discount >= 1) return null;
        const discountToChinese = (discount * 100).toFixed(0).split('').map((digit, i) => {
            if (i === 1 && digit === "0") return "";
            return templateConstants.discounts[digit];
        }).join("");

        return (
            <View style={{ borderWidth: 1, borderColor: theme.primary_variant, borderRadius: theme.radius_xs, alignItems:'center', marginLeft: theme.v_spacing_xs }}>
                <Text style={{ color: theme.primary_variant, fontSize: theme.font_size_icontext }}>{t(`${discountToChinese}折`)}</Text>
            </View>
        );
    };

    const isEmpty = !isLoading && events && events.length === 0;

    return (
        <Container 
            header={
                viewOffset >= 250 
                ? {
                    extendedHeader: {extendedHeaderComponent:   
                    <Animated.View 
                        entering={FadeIn.duration(200)}
                        style={[{ flex: 1, height: 50,  borderRadius: 10, margin: theme.v_spacing_md, paddingVertical: theme.v_spacing_lg, flexDirection: 'row', backgroundColor: theme.fill_placeholder }]}
                    >
                        <Pressable 
                            style={{ paddingHorizontal: theme.h_spacing_sm, width: '45%', alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: theme.fill_mask }} 
                            onPress={() => setOpenCalendarModal(true)}
                        >
                            {Object.keys(daysSelected).length === 0 && <Text numberOfLines={1} style={{ color: theme.fill_mask }}>{t('请选择活动时间')}</Text>}
                            {Object.keys(daysSelected).length === 1 && <Text numberOfLines={1} style={{ fontWeight: 'bold', color: theme.text_color }}>{Object.keys(daysSelected)[0]}</Text>}
                            {Object.keys(daysSelected).length === 2 && <Text numberOfLines={1} style={{ fontWeight: 'bold', color: theme.text_color  }}>{Object.keys(daysSelected)[0]} - {Object.keys(daysSelected)[1]}</Text>}
                        </Pressable>

                        <Pressable 
                            style={{ paddingHorizontal: theme.h_spacing_sm, width: '25%', alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: theme.fill_mask }}  
                            onPress={() => setOpenTypeModal(true)}
                        >
                            {(typeSelected === "") 
                                ? <Text style={{ color: theme.fill_mask }}>{t('活动种类')}</Text>
                                : <View style={{ flexDirection: 'row' }}>
                                    {(typeSelected !== "") && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{typeSelected}</Text>}
                                </View>
                            }
                        </Pressable>

                        <Pressable 
                            style={{ paddingHorizontal: theme.h_spacing_sm, width: '20%', justifyContent: 'center', alignItems: 'center' }} 
                            onPress={() => setOpenPeopleModal(true)}
                        >
                            {people === 0 && <Text numberOfLines={1} style={{ color: theme.fill_mask }}>{t('人数')}</Text>} 
                            {people !== 0 && <Text numberOfLines={1} style={{ fontWeight: 'bold', color: theme.text_color }}>{people} {t('人')}</Text>} 
                        </Pressable>

                        <Pressable 
                            style={{ width: '10%', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }} 
                            onPress={() => ref.current?.scrollToOffset({ offset: 0, animated: true })}
                        >
                            <Entypo name="arrow-up" size={18} color={theme.secondary_color} />
                        </Pressable>
                    </Animated.View>},
                } : { 
                    title: `${t('让生活更精彩')}`,
                    headerLeft: {headerLeftComponent:  
                        <Pressable 
                            hitSlop={10} 
                            style={styles.icon}
                            onPress={currentUser.is_logged_in 
                                ? () => navigation.navigate(`${t('写日记')}`) 
                                : () => navigation.navigate(`${t('登录')}`)
                            }
                        >
                            <Feather name="edit" size={theme.icon_size_sm} color={theme.secondary_variant} />
                        </Pressable>
                    },
                    headerTitle: {showTitle: true},
                    headerRight: {headerRightComponent:          
                        <Pressable 
                            hitSlop={10} 
                            style={styles.icon} 
                            onPress={currentUser.is_logged_in 
                                ? () => navigation.navigate(`${t('搜索')}`) 
                                : () => navigation.navigate(`${t('登录')}`)
                            }
                        >
                            <Feather name="search" size={theme.icon_size_sm} color={theme.secondary_variant} />
                        </Pressable>},
        }}>
            <Loading isLoading={isLoading} />
            <RenderError isError={!isLoading && isError} error={error} />
            {(!isLoading && !isError) && 
                <CustomErrorBoundary>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        ref={ref}
                        decelerationRate={'fast'}
                        onEndReached={fetchNextPage}
                        onEndReachedThreshold={0.5}
                        refreshControl={
                            <RefreshControl
                                refreshing={isFetching && page === 1}
                                onRefresh={handleRefresh}
                            />
                        }
                        ListHeaderComponent={
                            <View style={[{shadowColor: theme.secondary_color, backgroundColor: theme.fill_base, margin: theme.v_spacing_md, padding: theme.v_spacing_lg, borderRadius: 20 }, styles.shadow]}>
                                <Pressable 
                                    style={{ height: 50, width: '100%', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: theme.fill_disabled }} 
                                    onPress={() => setOpenCalendarModal(true)}
                                >
                                    {Object.keys(daysSelected).length === 0 && <Text style={{ color: theme.fill_mask }}>{t('请选择活动时间')}</Text>}
                                    {Object.keys(daysSelected).length === 1 && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{Object.keys(daysSelected)[0]}</Text>}
                                    {Object.keys(daysSelected).length === 2 && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{Object.keys(daysSelected)[0]} - {Object.keys(daysSelected)[1]}</Text>}
                                </Pressable>
                
                                <View style={{ height: 50, flexDirection: 'row', paddingVertical: theme.v_spacing_md, borderBottomWidth: 1, borderBottomColor: theme.fill_disabled }}>            
                                    <Pressable 
                                        style={{ flexDirection: 'row', width: '75%', alignItems: 'center', borderRightWidth: 1, borderRightColor: theme.fill_disabled }} 
                                        onPress={() => {
                                            requestLocationPermission();
                                            if (location.user_current_location) {
                                                setOpenCurrentLocationModal(true);
                                                return;
                                            }
                                        }}
                                    >
                                        {!location.user_current_location && <Text numberOfLines={1} style={{ color: theme.fill_mask }}>{t('搜索位置')}</Text>}
                                        {location.user_current_location && <Entypo name="location-pin" size={16} color={theme.secondary_color} />}
                                        {location.user_current_location && <Text numberOfLines={1} style={{ fontWeight: 'bold', width: '90%', color: theme.text_color }}>{location.user_current_location}</Text>}
                                    </Pressable>

                                    <Pressable 
                                        style={{ width: '25%', justifyContent: 'center', alignItems: 'center' }}  
                                        onPress={() => setOpenDistanceModal(true)}
                                    >
                                        {distance === 0 && <Text style={{ color: theme.fill_mask }}>{t('搜索范围')}</Text>} 
                                        {distance !== 0 && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{distance} km</Text>}
                                    </Pressable>
                                </View>
                
                                <View style={{ height: 50, flexDirection: 'row', paddingVertical: theme.v_spacing_md, borderBottomWidth: 1, borderBottomColor: theme.fill_disabled }}>
                                    <Pressable 
                                        style={{ width: '30%', justifyContent: 'center', borderRightWidth: 1, borderRightColor: theme.fill_disabled }} 
                                        onPress={() => setOpenTypeModal(true)}
                                    >
                                        {(typeSelected === "") 
                                            ? <Text style={{ color: theme.fill_mask }}>{t('活动种类')}</Text>
                                            : <View style={{ flexDirection: 'row' }}>
                                                {(typeSelected !== "") && <Text style={{ fontWeight: 'bold', color: theme.text_color }}> {typeSelected} </Text>}
                                            </View>
                                        }
                                    </Pressable>
                
                                    <Pressable 
                                        style={{ width: '35%', justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: theme.fill_disabled }} 
                                        onPress={() => setOpenPeopleModal(true)}
                                    >
                                        {people === 0 && <Text style={{ color: theme.fill_mask }}>{t('人数')}</Text>} 
                                        {people !== 0 && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{people} {t('人')}</Text>} 
                                    </Pressable>
                
                                    <Pressable 
                                        style={{ width: '35%', justifyContent: 'center', alignItems: 'center' }} 
                                        onPress={() => setOpenDurationModal(true)}
                                    >
                                        {(!duration['days'] && !duration['hours'])
                                            ? <Text style={{ color: theme.fill_mask }}>{t('活动时长')}</Text>
                                            : <View style={{ flexDirection: 'row' }}>
                                                {(duration['days'] !== 0) && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{duration['days']} {t('天')}</Text>}
                                                {(duration['hours'] !== 0) && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{duration["hours"]} {t('小时')}</Text>}
                                            </View>
                                        }
                                    </Pressable>
                                </View>
                
                                <PrimaryContainedButton 
                                    buttonFreeStyle={{marginTop: 15, height: 50}} 
                                    textFreeStyle={{fontSize: theme.font_size_caption, fontWeight: 'bold'}}
                                    buttonText={'搜索活动'} 
                                    onPress={() => { 
                                        setPage(1); 
                                        setHasNext(true); 
                                        setSearchState({
                                            page: 1,
                                            first_date: Object.keys(daysSelected)[0] || undefined, 
                                            last_date: Object.keys(daysSelected)[1] || undefined,
                                            distance: distance !== 0 ? distance : undefined,
                                            tags: typeSelected !== '' ? typeSelected : undefined,
                                            people: people !== 0 ? people : undefined,
                                            duration: (duration['days'] !== 0 || duration["hours"] !== 0) ? duration['days'] * 24 + duration["hours"] : undefined,
                                        });
                                    }}                              
                                />
                            </View>
                        }
                        onScroll={({ nativeEvent }) => setViewOffset(nativeEvent.contentOffset.y)}
                        data={events}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            return (
                                <Pressable 
                                    style={({ pressed }) => 
                                        [styles.shadow, { shadowColor: theme.secondary_color, backgroundColor: theme.fill_base }, 
                                        { 
                                            borderRadius: 10, backgroundColor: theme.fill_base, height: windowSize.image.height, 
                                            flexDirection: 'row', marginHorizontal: theme.h_spacing_lg, marginVertical: theme.h_spacing_md 
                                        }, pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}
                                    hitSlop={10}
                                    onPress={() => navigation.push(`${t('看日记')}`, { topicId: item.topic_id, eventId: item.id })}
                                    android_ripple={{color: '', borderless: false, radius: 5, foreground: true}}
                                    onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                                >
                                    {/* Display */}
                                    {item.multimedia && item.multimedia.length !== 0 && (
                                        <View style={{ width: "50%" }}>
                                            {(item.multimedia[0].mediaType === 'videos')
                                                ? <Image 
                                                    containerStyle={[windowSize.image]}
                                                    isSelectedUploading={false}
                                                    editMode={false}
                                                    showloading
                                                    hasBorder
                                                    source={{ uri: `${urlConstants.videos}/${item.multimedia[0].url}/snapshot.jpg` }} 
                                                    resizeMode="cover"
                                                />
                                                : <Image 
                                                    containerStyle={[windowSize.image]}
                                                    isSelectedUploading={false}
                                                    editMode={false}
                                                    showloading
                                                    hasBorder
                                                    source={{ uri: `${urlConstants.images}/${item.multimedia[0].url}` }} 
                                                    resizeMode="cover"
                                                />
                                            }
                                        </View>
                                    )}

                                    {/* Title */}
                                    <View style={{ width: "50%", justifyContent:'space-between', padding: theme.h_spacing_sm }}>
                                        <View style={{ height: windowSize.image.height - 80, justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                                {item.tags.map((tag) => 
                                                    <Text 
                                                        key={tag}
                                                        style={{ 
                                                            padding: theme.v_spacing_xs, 
                                                            margin: theme.v_spacing_xs, 
                                                            borderColor: theme.fill_mask, 
                                                            borderRadius: 6,
                                                            borderWidth: 1, 
                                                            fontSize: theme.font_size_caption_sm,
                                                            color: theme.text_color,
                                                        }}
                                                    >{tag}</Text>
                                                )}

                                                {!item.is_recurring && <Text style={{ color: theme.text_color, padding: theme.v_spacing_xs, margin: theme.v_spacing_xs, borderColor: theme.fill_mask, borderRadius: 6, borderWidth: 1, fontSize: theme.font_size_caption_sm }}>{t('一次')}</Text>}
                                                {item.is_recurring && <Text style={{ color: theme.text_color, padding: theme.v_spacing_xs, margin: theme.v_spacing_xs, borderColor: theme.fill_mask, borderRadius: 6, borderWidth: 1, fontSize: theme.font_size_caption_sm }}>{t('周期')}</Text>}
                                            </View>

                                            <Text numberOfLines={2} style={{ fontWeight: 'bold', color: theme.text_color }}>{item?.title}</Text>

                                            <View>
                                                <Text style={{ fontSize: theme.font_size_caption_sm, fontWeight: 'bold', color: theme.text_color }}>{t('开始时间')}</Text>
                                                <Text style={{ fontSize: theme.font_size_caption_sm, color: theme.fill_mask }}>{item?.first_date}</Text>
                                            </View>

                                            <View>
                                                <Text style={{ fontSize: theme.font_size_caption_sm, fontWeight: 'bold', color: theme.text_color }}>{t('活动地址')}</Text>
                                                <Text numberOfLines={2} style={{ fontSize: theme.font_size_caption_sm, color: theme.fill_mask }}>{item?.address}</Text>
                                            </View>
                                            
                                            <View>
                                                <Text style={{ color: theme.text_color, fontSize: theme.font_size_caption_sm, fontWeight: 'bold' }}>{item?.duration_type === 'FLEX' ? `${t('时长不固定')}` : `${t('固定时长')}`}</Text>
                                                {item?.duration_type === "FIXED" && <Text style={{ fontSize: theme.font_size_caption_sm, color: theme.fill_mask }}>{iso8601(item?.min_duration)} {t('小时')}</Text>}
                                                {item?.duration_type === "FLEX" && 
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ fontSize: theme.font_size_caption_sm, color: theme.fill_mask }}>{iso8601(item?.min_duration)}</Text>
                                                        <Text style={{ fontSize: theme.font_size_caption_sm, color: theme.fill_mask }}> - </Text>
                                                        <Text style={{ fontSize: theme.font_size_caption_sm, color: theme.fill_mask }}>{iso8601(item?.max_duration)} {t('小时')}</Text>
                                                    </View>
                                                }
                                            </View>

                                            <View>
                                                <Text style={{ color: theme.text_color, fontSize: theme.font_size_caption_sm, fontWeight: 'bold' }}>{item?.min_guests === item?.max_guests ? `${t('人数固定')}` : `${t('人数不固定')}`}</Text>
                                                {item?.min_guests === item?.max_guests && <Text style={{ fontSize: theme.font_size_caption_sm, color: theme.fill_mask }}>{item?.min_guests}</Text>}
                                                {item?.min_guests !== item?.max_guests &&
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ fontSize: theme.font_size_caption_sm, color: theme.fill_mask }}>{item?.min_guests}</Text>
                                                        <Text style={{ fontSize: theme.font_size_caption_sm, color: theme.fill_mask }}> - </Text>
                                                        <Text style={{ fontSize: theme.font_size_caption_sm, color: theme.fill_mask }}>{item?.max_guests} {t('人')}</Text>
                                                    </View>
                                                }
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                                            {item?.currency === '加元' && <Text style={{ fontWeight: 'bold', color: theme.primary_variant }}>$</Text>}
                                            {item?.price_type && <Text style={{ fontWeight: 'bold', color: theme.primary_variant }}>{item?.price}</Text>}
                                            {item?.price_type && <Text style={{ color: theme.secondary_variant, fontSize: theme.font_size_icontext, marginLeft: theme.v_spacing_xs }}>/{t(templateConstants.prices.find((price) => price.url === item?.price_type).title)}</Text>}
                                            {showDiscount(item.price, item.old_price)}
                                        </View>
                                    </View>
                                </Pressable>
                            )
                        }}
                        ListFooterComponent={isFetching ? <Loading isLoading={isFetching} style={{ justifyContent: 'flex-start' }} /> : (isEmpty ? <Empty isEmpty={isEmpty} style={{ justifyContent: 'flex-start' }} />  : <End />)}
                    />
                </CustomErrorBoundary>
            }
            
            {/* Calendar */}
            <PopUpModal
                title={`${t('选择日期')}`}
                onClose={() => setOpenCalendarModal(false)}
                visible={openCalendarModal}
                okTitle={`${t('清空')}`}
                onOk={() => setDaysSelected({})}
                disableOk={false}
            >
                <View style={[styles.modalContainer, { marginTop: 0 }]}>
                    <Calendar 
                        theme={{ textDisabledColor: theme.fill_mask, dayTextColor: theme.text_color, monthTextColor: theme.text_color, calendarBackground: theme.fill_base, arrowColor: theme.brand_primary }}
                        enableSwipeMonths
                        initialDate={getDateFormat(new Date())}
                        minDate={getDateFormat(new Date())}
                        markingType={"period"}
                        markedDates={Object.keys(daysSelected).length === 1 ? daysSelected : markedDates}
                        onDayPress={(e) => { 
                            if (Object.keys(daysSelected).length > 1) {
                                setDaysSelected({});
                            } else if (Object.keys(daysSelected)[0] && e.timestamp < daysSelected[Object.keys(daysSelected)[0]].timestamp) {
                                setDaysSelected({});
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

            {/* Current Location */}
            <PopUpModal
                title={`${t('当前地址')}`}
                onClose={() => setOpenCurrentLocationModal(false)}
                visible={openCurrentLocationModal}
                okTitle={`${t('更新')}`}
                onOk={() => {
                    if (location.is_gps_permission_granted === 'granted') {
                        Geolocation.getCurrentPosition(
                            (position) => {
                                dispatch(locationActions.updateCurrentCoordinate({
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                }));
                            },
                            (error) => {
                                console.error("error", error.code, error.message);
                            },
                            {
                                accuracy: {
                                    android: 'high',
                                    ios: 'bestForNavigation'
                                },
                                timeout: 30000,
                                distanceFilter: 1,
                                forceLocationManager: true
                            }
                        );
                    }
                    
                    if (location.is_gps_permission_granted && location.is_gps_permission_granted !== 'granted') {
                        dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '未获得位置权限，可能会导致部分功能无法正常使用' }))
                    }
                }}
                disableOk={false}
            >
                <View style={styles.modalContainer}>
                    <Text style={{color: theme.text_color}}>{location.user_current_location}</Text>
                </View>
            </PopUpModal>
            
            {/* Distance */}
            <PopUpModal
                title={`${t('活动搜索范围')}`}
                onClose={() => setOpenDistanceModal(false)}
                visible={openDistanceModal}
                okTitle={`${t('清空')}`}
                onOk={() => setDistance(0)}
                disableOk={false}
            >
                <View style={[styles.modalContainer, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 20, color: theme.text_color }}>{`${t('范围')}`}</Text>

                    <View style={{ flexDirection: 'row' }}>
                        <AnimatedPlusMinusIcons 
                            containerStyle={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 100 }}
                            onPress={() => setDistance((prev) => {
                                if (prev > 200) return prev - 25;
                                if (prev > 100) return prev - 10;
                                if (prev > 0) return prev - 5;
                                if (prev === 0) return 0;
                            })}
                            onPressInComponent={<AntDesign name="minuscircle" size={20} color={theme.secondary_color} />}
                        >
                            <AntDesign name="minuscircleo" size={25} color={theme.secondary_variant} />
                        </AnimatedPlusMinusIcons>

                        <View style={{ width: 80, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: theme.text_color }}> {distance} </Text>
                        </View>

                        <AnimatedPlusMinusIcons
                            containerStyle={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 100}}
                            onPress={() => setDistance((prev) => {
                                if (prev < 100) return prev + 5;
                                if (prev < 200) return prev + 10;
                                if (prev < 300) return prev + 25;
                                if (prev === 300) return 300;
                            })}
                            onPressInComponent={<AntDesign name="pluscircle" size={20} color={theme.secondary_color} />}
                        >
                            <AntDesign name="pluscircleo" size={25} color={theme.secondary_variant} />
                        </AnimatedPlusMinusIcons>
                    </View>
                </View>
            </PopUpModal>

            {/* Type */}
            <PopUpModal
                title={`${t('选择种类')}`}
                onClose={() => setOpenTypeModal(false)}
                visible={openTypeModal}
                okTitle={`${t('清空')}`}
                onOk={() => {
                    setTypeSelected('');
                    setOpenTypeModal(false);
                }}
                disableOk={typeSelected === ''}
            >
                <View style={styles.modalContainer}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                        {totalTags.map((tag) => 
                            <Chip 
                                key={tag} 
                                mode="outlined" 
                                onPress={() => setTypeSelected(tag)} 
                                style={tag === typeSelected
                                    ? { fontSize: theme.font_size_base, backgroundColor: theme.primary_variant, margin: theme.v_spacing_xs } 
                                    : { fontSize: theme.font_size_base, backgroundColor: theme.fill_base, margin: theme.v_spacing_xs }}
                                textStyle={tag === typeSelected
                                    ? { color: theme.fill_base }
                                    : { color: theme.secondary_variant }}
                            >{tag}</Chip>
                        )}
                    </View>
                </View>
            </PopUpModal>

            {/* People */}
            <PopUpModal
                title={`${t('选择人数')}`}
                onClose={() => setOpenPeopleModal(false)}
                visible={openPeopleModal}
                okTitle={`${t('清空')}`}
                onOk={() => setPeople(0)}
                disableOk={false}
            >
                <View style={[styles.modalContainer, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 20, color: theme.text_color }}>{`${t('人数')}`}</Text>

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
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: theme.text_color }}>{people}</Text>
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
            </PopUpModal>

            {/* Duration */}
            <PopUpModal
                title={`${t('选择时长')}`}
                onClose={() => setOpenDurationModal(false)}
                visible={openDurationModal}
                okTitle={`${t('清空')}`}
                onOk={() => setDuration({
                    days: 0,
                    hours: 0,
                })}
                disableOk={false}
            >
                <View style={[styles.modalContainer]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.v_spacing_lg }}>
                        <Text style={{ fontSize: 20, color: theme.text_color }}>{`${t('天数')}`}</Text>
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
                                <Text style={{ fontWeight: 'bold', fontSize: 20, color: theme.text_color }}>{duration["days"]}</Text>
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
                        <Text style={{ fontSize: 20, color: theme.text_color }}>{`${t('小时')}`}</Text>
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
                                <Text style={{ fontWeight: 'bold', fontSize: 20, color: theme.text_color }}>{duration["hours"]}</Text>
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
            </PopUpModal>
        </Container>
    );
};

export default Home;