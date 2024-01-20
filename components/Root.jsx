import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { useNetInfo } from "@react-native-community/netinfo";
import * as Sentry from '@sentry/react-native';
import AppConfig from "@/configs/xcoolsports.config.json";
import { useTranslation } from 'react-i18next';
import { getLocales } from 'expo-localization';

import api from '@xcoolsports/data/api';
import {
  selectCurrentUser, sessionActions, toastActions, toastTypes,
  userActions, configActions,
} from '@xcoolsports/data';

// Authentication System
import Login from '@xcoolsports/components/Auth/Login';
import Register from '@xcoolsports/components/Auth/Register';
import Phone from '@xcoolsports/components/Auth/Phone';
import Veritification from '@xcoolsports/components/Auth/Veritification';
import ResetPassword from '@xcoolsports/components/Auth/ResetPassword';
import DeleteUser from '@xcoolsports/components/Auth/DeleteUser';
import UserTerms from '@xcoolsports/components/Common/Texts/UserTerms';
import PrivacyTerms from '@xcoolsports/components/Common/Texts/PrivacyTerms';
import User from '@xcoolsports/components/User';
import Follower from '@xcoolsports/components/Follower';
import Following from '@xcoolsports/components/Following';
import CertifyUser from '@xcoolsports/components/Auth/CertifyUser';
import UserProfile from '@xcoolsports/components/Auth/UserProfile';
import Setting from '@xcoolsports/components/Auth/Setting';
import Helper from '@xcoolsports/components/Common/Texts/Helper';

// Notification System
import Toast from '@xcoolsports/components/Toast';
import Annoucements from '@xcoolsports/components/Annoucements';
import Interactions from '@xcoolsports/components/Interactions';
import Messages from '@xcoolsports/components/Messages';
import Tickets from '@xcoolsports/components/Admin/Tickets';
import TicketDetail from '@xcoolsports/components/Admin/TicketDetail';
import Blacklist from '@xcoolsports/components/LoginUserTabs/Profile/Drawer/Blacklist';

// Post System
import Topic from '@xcoolsports/components/Topic';
import TopicEdit from '@xcoolsports/components/TopicEdit';
import Search from '@xcoolsports/components/Search';
import TimeSelection from '@xcoolsports/components/TimeSelection';
import Geolocation from '@xcoolsports/components/App/Geolocation';
import LoginUserTabs from '@xcoolsports/components/LoginUserTabs';

// Order System
import Order from '@xcoolsports/components/Order';
import MyOrder from '@xcoolsports/components/LoginUserTabs/Profile/Drawer/Order';
import MyBusiness from '@xcoolsports/components/LoginUserTabs/Profile/Drawer/Business';
import Scanner from '@xcoolsports/components/Scanner';
import EventOverview from '@xcoolsports/components/EventOverview';

// Friend System
import Card from '@xcoolsports/components/Card';
import CardEdit from '@xcoolsports/components/CardEdit';
import MateMatch from '@xcoolsports/components/MateMatch';
import MateSearhCriteria from '@xcoolsports/components/MateSearhCriteria';
import Adventure from '@xcoolsports/components/Adventure';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

const Root = () => {
  const { t, i18n } = useTranslation();
  const init = useRef(false);
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  const Stack = createNativeStackNavigator();
  const currentUser = useSelector(selectCurrentUser);
  const deviceLanguage = getLocales()[0].languageCode;

  api.endpoints.checkinSession.useQuery({}, { skip: !netInfo.isConnected || currentUser.loading_state !== 'waitCheckin' });
  api.endpoints.getConfigs.useQuery({}, { skip: !netInfo.isConnected });

  const changeLanguageHandler = (newValue) => {
    i18n.changeLanguage(newValue);
    dispatch(configActions.changeLanguage(newValue));
  }

  useEffect(() => {
    dispatch(sessionActions.loadSession()); // load token
    dispatch(userActions.loadUsers()); // load user
    dispatch(configActions.loadAdventure()); // load configs

    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1500);
  }, []);

  useEffect(() => {
    if (!netInfo.isConnected) {
      dispatch(toastActions.showToast({ type: toastTypes.ERROR, text: '无法连接网络' }));
    } else {
      dispatch(toastActions.removeToastByText('无法连接网络'));
    }
  }, [netInfo.isConnected]);

  useEffect(() => {
    if (currentUser.eula_privacy_read && !init.current) {
      Sentry.init({
        dsn: 'https://bb32e3eeeed34daab29e84409709ec5c@o4504323311730688.ingest.sentry.io/4504323373137920',
        enabled: AppConfig.env === 'prd',
        environment: AppConfig.env,
      });
      init.current = true;
    }
  }, [currentUser.eula_privacy_read]);

  useEffect(() => {
    if (deviceLanguage === 'zh') changeLanguageHandler('zh_CN');
    else if (deviceLanguage === 'en') changeLanguageHandler('en');
    else changeLanguageHandler('en');
  }, [deviceLanguage]);

  return (
    <NavigationContainer linking={{
      prefixes: ['https://xcoolsports.com/app/', 'https://www.xcoolsports.com/app/', 'xcoolsports://'],
      config: {
        screens: {
          活动: 'home/',
          看日记: 'event/:topicId/:eventId',
          看用户: 'user/:usernameURL',
        },
      }
    }}>
      <View style={[styles.container]}>
        {currentUser.loading_state !== 'uninitialized' && <Stack.Navigator initialRouteName={`${t('顽酷')}`}>
          <Stack.Screen
            name={`${t('顽酷')}`}
            component={LoginUserTabs}
            options={{ headerShown: false }}
          />

          {/* Authentication Systems */}
          <Stack.Screen
            name={`${t('看用户')}`}
            component={User}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('关注')}`}
            component={Following}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('粉丝')}`}
            component={Follower}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('登录')}`}
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('注册')}`}
            component={Register}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('注销账号')}`}
            component={DeleteUser}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('输入手机号')}`}
            component={Phone}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('验证手机号')}`}
            component={Veritification}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('重设密码')}`}
            component={ResetPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('官方认证')}`}
            component={CertifyUser}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('编辑资料')}`}
            component={UserProfile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('黑名单')}`}
            component={Blacklist}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('个人设置')}`}
            component={Setting}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('用户协议')}`}
            component={UserTerms}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('隐私政策')}`}
            component={PrivacyTerms}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('常见问题')}`}
            component={Helper}
            options={{ headerShown: false }}
          />

          {/* Notification Systems */}
          <Stack.Screen
            name={`${t('公告')}`}
            component={Annoucements}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('互动')}`}
            component={Interactions}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('私信')}`}
            component={Messages}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('管理')}`}
            component={Tickets}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('看管理')}`}
            component={TicketDetail}
            options={{ headerShown: false }}
          />

          {/* Post Systems */}
          <Stack.Screen
            name={`${t('看日记')}`}
            component={Topic}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('写日记')}`}
            component={TopicEdit}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('搜索')}`}
            component={Search}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('选择活动时间')}`}
            component={TimeSelection}
            options={{ headerShown: false }}
          />

          {/* Order Systems */}
          <Stack.Screen
            name={`${t('生成订单')}`}
            component={Order}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('我的订单')}`}
            component={MyOrder}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('我的生意')}`}
            component={MyBusiness}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('二维码扫码')}`}
            component={Scanner}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('活动概览')}`}
            component={EventOverview}
            options={{ headerShown: false }}
          />

          {/* Friend Systems */}
          <Stack.Screen
            name={`${t('自定义卡片')}`}
            component={Card}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('自制卡片')}`}
            component={CardEdit}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('条件设置')}`}
            component={MateSearhCriteria}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('匹配伙伴')}`}
            component={MateMatch}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={`${t('游戏界面')}`}
            component={Adventure}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>}

        <Geolocation />
        <Toast />
      </View>
    </NavigationContainer>
  );
};

export default Root;
