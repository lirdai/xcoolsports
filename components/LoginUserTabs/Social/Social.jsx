import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, Pressable, PermissionsAndroid, Platform } from 'react-native';
import { useTranslation } from 'react-i18next'
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import * as Haptics from 'expo-haptics';

import Container from '@xcoolsports/components/Common/Container';
import theme, { ThemeContext } from '@xcoolsports/constants/theme';
import {
    api, toastActions, toastTypes, locationActions, selectLocation,
    selectAdventureStatus, selectCurrentUser, selectSearchCriteria, selectTags,
} from '@xcoolsports/data';
import PrimaryContainedButton from '@xcoolsports/components/utils/Buttons/PrimaryContainedButton';
import PopUpModal from '@xcoolsports/components/utils/PopUpModal';
import RippleEffect from '@xcoolsports/components/utils/AnimationComponents/RippleEffect';
import TypingText from '@xcoolsports/components/utils/AnimationComponents/TypingText';

const styles = StyleSheet.create({
    modalContainer: {
        margin: theme.v_spacing_lg,
    },
    modalTitle: {
        fontSize: theme.font_size_xl,
        paddingVertical: theme.v_spacing_sm,
    },
    modalSmallTitle: {
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
        fontSize: theme.font_size_caption_sm
    },
});

const Social = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const location = useSelector(selectLocation);
    const currentUser = useSelector(selectCurrentUser);
    const theme = useContext(ThemeContext);
    const is_adventure_open = useSelector(selectAdventureStatus);
    const search_criteria = useSelector(selectSearchCriteria);
    const totalTags = useSelector(selectTags);

    const [updateSocialSetting] = api.endpoints.updateSocialSetting.useMutation();
    const [openCriteriaModal, setOpenCriteriaModal] = useState(false);

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

    useEffect(() => {
        requestLocationPermission();
    }, []);

    return (
        <Container
            header={{
                title: `${t('城市大冒险')}`,
                headerTitle: { showTitle: false },
                headerLeft: {
                    headerLeftComponent:
                        <Pressable hitSlop={10}
                            style={{ width: 120, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
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

                                navigation.navigate(`${t('自定义卡片')}`);
                                return;
                            }}>
                            <AntDesign name="tags" size={theme.icon_size_xxs} color={theme.secondary_variant} />
                            <Text style={{ marginHorizontal: theme.h_spacing_sm, color: theme.secondary_variant }}>{t('自定义卡片')}</Text>
                        </Pressable>
                },
                headerRight: {
                    headerRightComponent:
                        <Pressable hitSlop={10}
                            style={{ width: 100, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
                            onPress={() => {
                                requestLocationPermission();
                                if (!location.user_current_location) {
                                    dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '未获得位置权限，可能会导致部分功能无法正常使用' }));
                                    return;
                                } else if (!currentUser.is_logged_in) {
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

                                navigation.navigate(`${t('条件设置')}`);
                                return;
                            }}
                        >
                            <AntDesign name="setting" size={theme.icon_size_xxs} color={theme.secondary_variant} />
                            <Text style={{ marginHorizontal: theme.h_spacing_sm, color: theme.secondary_variant }}>{t('条件设置')}</Text>
                        </Pressable>
                },
            }}
        >
            <View style={{ flex: 1, margin: theme.h_spacing_lg }}>
                <Text style={{ color: theme.secondary_variant, alignSelf: 'center', fontSize: theme.font_size_xl }}>{t('恋爱雷达')}</Text>
                <View style={{ marginVertical: theme.v_spacing_xl, height: 120 }}>
                    <TypingText text={t('暧昧上头的那一刻，像极了爱情的开始。在一个普通的日子里，两个陌生人相遇了。他们的眼神交汇，仿佛彼此的心已经开始跳动。在接触中，每一个触碰、每一次对视都传达着无法言喻的情感。然后，他们坦诚了自己的感情，承认彼此已经深陷爱情之中。他们的爱情故事充满了浪漫和冒险，就像一场美丽的梦。这段故事是否将永恒继续，还是只是一时兴起的瞬间，让时间来书写吧。')} speed={200} />
                </View>

                <RippleEffect totalTags={totalTags} avatar={currentUser.avatar} />

                <View style={{ marginTop: theme.v_spacing_2xl }}>
                    <Text style={{ color: theme.text_color, fontSize: theme.font_size_caption, fontWeight: 'bold', alignSelf: 'center' }}>{is_adventure_open ? t('正在为你寻找符合条件的人') : t('快来加入吧')}</Text>
                </View>

                <PrimaryContainedButton
                    buttonFreeStyle={{ height: 50, marginVertical: theme.v_spacing_lg }}
                    textFreeStyle={{ fontSize: theme.font_size_caption }}
                    buttonText={is_adventure_open ? `${t('取消匹配')}` : `${t('开始匹配')}`}
                    onPress={() => {
                        requestLocationPermission();
                        if (!location.user_current_location) {
                            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '未获得位置权限，可能会导致部分功能无法正常使用' }));
                            return;
                        } else if (!currentUser.is_logged_in) {
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

                        const body = {
                            can_match: !is_adventure_open,
                            gender: search_criteria.gender,
                            min_age: 18,
                            max_age: search_criteria.age,
                            max_distance: search_criteria.distance,
                            horoscope: search_criteria.horoscope,
                            goal: search_criteria.goal,
                            tags: search_criteria.hobby,
                        }

                        if (!is_adventure_open) setOpenCriteriaModal(true);
                        else updateSocialSetting({ body });
                    }}
                />
            </View>

            <PopUpModal
                title={t("请更新条件设置")}
                onClose={() => setOpenCriteriaModal(false)}
                visible={openCriteriaModal}
            >
                <View style={styles.modalContainer}>
                    <Text style={[styles.modalContent, { color: theme.text_color }]}>{t("更新一下条件设置，我们可以找到更合适的匹配伙伴哦")} </Text>
                    <View style={styles.modalContent}>
                        <Pressable hitSlop={10} style={styles.modalButton} onPress={() => {
                            const body = {
                                can_match: !is_adventure_open,
                                gender: search_criteria.gender,
                                min_age: 18,
                                max_age: search_criteria.age,
                                max_distance: search_criteria.distance,
                                horoscope: search_criteria.horoscope,
                                goal: search_criteria.goal,
                                hobby: search_criteria.hobby,
                            }

                            updateSocialSetting({ body });
                            setOpenCriteriaModal(false)
                        }}>
                            <Text style={[styles.modalText, { color: theme.text_color }]}>{t("无所谓")}</Text>
                        </Pressable>

                        <Pressable
                            hitSlop={10}
                            style={styles.modalButton}
                            onPress={() => {
                                navigation.navigate(`${t("条件设置")}`);
                                setOpenCriteriaModal(false);
                            }}
                            onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                        >
                            <Text style={[styles.modalText, { color: theme.text_color }]}>{t("这就去更新下")}</Text>
                        </Pressable>
                    </View>
                </View>
            </PopUpModal>
        </Container>
    );
};

export default Social;