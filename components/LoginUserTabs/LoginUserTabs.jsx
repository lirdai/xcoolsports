import React, { useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useTranslation } from 'react-i18next';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import * as Device from 'expo-device';

import Event from '@xcoolsports/components/LoginUserTabs/Event';
import Login from '@xcoolsports/components/Auth/Login';
import Discover from '@xcoolsports/components/LoginUserTabs/Discover';
import Notifications from '@xcoolsports/components/LoginUserTabs/Notifications';
import Profile from '@xcoolsports/components/LoginUserTabs/Profile';
import Social from '@xcoolsports/components/LoginUserTabs/Social';
import MateMatch from '@xcoolsports/components/MateMatch';
import Adventure from '@xcoolsports/components/Adventure';
import stompClientFactory from '@xcoolsports/utils/stompClientFactory';

import {
    selectCurrentUser, messageActions, selectAdventure, userActions,
    selectUnreadMessagesNum, selectLatestMessage, api, configActions,
} from '@xcoolsports/data';
import { ThemeContext } from '@xcoolsports/constants/theme';

const TabNavigation = () => {
    const { t, i18n } = useTranslation();
    const Tab = createMaterialBottomTabNavigator();
    const theme = useContext(ThemeContext);

    const currentUser = useSelector(selectCurrentUser);
    const unreadMessages = useSelector(selectUnreadMessagesNum);
    const latestMessage = useSelector(selectLatestMessage);
    const adventure = useSelector(selectAdventure);
    const dispatch = useDispatch();
    const notificationBadge = (currentUser?.num_notifications?.num_annoucements + currentUser?.num_notifications?.num_interactions + unreadMessages) || null;
    const [pushNotificationRegisterDevice] = api.endpoints.pushNotificationRegisterDevice.useMutation();

    api.endpoints.getSocialSetting.useQuery(null, { skip: !currentUser.is_logged_in });
    api.endpoints.getAllMessagesUnread.useQuery({ gt: latestMessage?.id || 0 }, { skip: !currentUser.is_logged_in || currentUser.is_banned?.users || !currentUser.is_verified });

    const notificationNumberQuery = api.endpoints.getNotificationNumber.useQuery(null, {
        pollingInterval: 10 * 60 * 1000, refetchOnMountOrArgChange: false,
        skip: !currentUser.is_logged_in,
    });
    const adventureInfoQuery = api.endpoints.getCurrentAdventureInfo.useQuery(null, {
        pollingInterval: 30 * 1000, refetchOnMountOrArgChange: false,
        skip: !currentUser.is_logged_in || currentUser.is_banned?.users || !currentUser.is_verified,
    });

    const onRemoteNotification = (notification) => {
        const isClicked = notification.getData().userInteraction === 1;
        if (isClicked) console.log("isClicked");
        const result = PushNotificationIOS.FetchResult.NoData;
        notification.finish(result);
    };

    useEffect(() => {
        if (currentUser.is_logged_in) {
            PushNotificationIOS.addEventListener('register', (token) => {
                pushNotificationRegisterDevice({ token, brand: Device.brand });
                dispatch(configActions.updatePushNotificationToken(token));
            });
            stompClientFactory.getInstace().connect(
                'ws://10.0.0.25:8080/connect',
                currentUser.username, currentUser.token,
                (msg) => {
                    const body = JSON.parse(msg.body);
                    dispatch(messageActions.receiveUnreadOneMessage({
                        id: body.id,
                        partner: body.receiver === currentUser.username ? body.sender : body.receiver,
                        is_incoming: body.receiver === currentUser.username,
                        created_at: body.createdAt,
                        unread: Number(true),
                        text: body.text,
                    }));
                    dispatch(userActions.upsertUser({
                        username: body.sender,
                        nickname: body.nickname,
                        avatar: body.avatar,
                    }));
                }
            );
        }

        PushNotificationIOS.addEventListener('localNotification', onRemoteNotification);
        PushNotificationIOS.addEventListener('notification', onRemoteNotification);
        PushNotificationIOS.addEventListener('registrationError', (e) => console.log('registrationError', e));
        PushNotificationIOS.addNotificationRequest({ id: "my_unique_id", badge: 0 });
        PushNotificationIOS.requestPermissions();

        return () => {
            PushNotificationIOS.removeEventListener('register');
            PushNotificationIOS.removeEventListener('localNotification');
            PushNotificationIOS.removeEventListener('notification');
            PushNotificationIOS.removeEventListener('registrationError');
            stompClientFactory.getInstace().disconnect();;
        };
    }, [currentUser.is_logged_in]);

    useEffect(() => {
        dispatch(messageActions.loadMessages());
    }, []);

    const socialTabScreen = () => {
        if (adventure?.status === '正在匹配') return MateMatch;
        if (adventure?.status === '冒险中') return Adventure;
        return Social;
    };

    return (
        <Tab.Navigator
            initialRouteName={`${t("交友")}`}
            activeColor={theme.primary_color}
            inactiveColor={theme.secondary_variant}
            barStyle={{ color: theme.brand_error, backgroundColor: theme.fill_base }}
            safeAreaInsets={{ bottom: 0 }}
        >
            <Tab.Screen
                name={`${t("交友")}`}
                component={socialTabScreen()}
                options={{
                    tabBarLabel: `${t("交友")}`,
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="heart-pulse" color={color} size={theme.icon_size_lg} />
                    ),
                }}
            />

            <Tab.Screen
                name={`${t("活动")}`}
                component={Event}
                options={{
                    tabBarLabel: `${t("活动")}`,
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="gift" color={color} size={theme.icon_size_lg} />
                    ),
                }}
            />

            <Tab.Screen
                name={`${t("发现")}`}
                component={Discover}
                options={{
                    tabBarLabel: `${t("发现")}`,
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="compass-outline" color={color} size={theme.icon_size_lg} />
                    ),
                }}
            />

            <Tab.Screen
                name={`${t("消息")}`}
                component={Notifications}
                options={{
                    tabBarLabel: `${t("消息")}`,
                    tabBarBadge: notificationBadge,
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="message-processing-outline" color={color} size={theme.icon_size_lg} />
                    ),
                }}
            />

            <Tab.Screen
                name={`${t("我")}`}
                component={currentUser.is_logged_in ? Profile : Login}
                options={{
                    tabBarLabel: `${t("我")}`,
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="account" color={color} size={theme.icon_size_lg} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigation;