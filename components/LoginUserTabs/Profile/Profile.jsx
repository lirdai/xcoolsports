import React, { useState, useEffect, useRef, useCallback, useContext  } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'

import User from '@xcoolsports/components/User/User';
import Feedback from '@xcoolsports/components/Common/Buttons/Feedback';
import Logout from '@xcoolsports/components/Auth/Logout';
import DeleteUser from '@xcoolsports/components/Auth/DeleteUser';
import Loading from '@xcoolsports/components/Common/Pages/Loading';
import { selectCurrentUser } from '@xcoolsports/data';
import {ThemeContext} from '@xcoolsports/constants/theme';

const UserNavigation = ({ navigation }) => {
    const { t, i18n } = useTranslation();

    const Drawer = createDrawerNavigator();
    const isMounted = useRef(true);
    const currentUser = useSelector(selectCurrentUser);
    const theme = useContext(ThemeContext);

    const [logoutModal, setLogoutModal] = useState(false);
    const [openFeedback, setOpenFeedback] = useState(false);
    const [deleteUserModal, setDeleteUserModal] = useState(false);

    useFocusEffect(useCallback(() => {
        navigation.navigate(`${t("主页")}`);
    }, []));

    useEffect(() => () => { isMounted.current = false }, []);

    if (!currentUser) return <Loading isLoading={!currentUser} />

    return (
        <Drawer.Navigator   
            initialRouteName={t("主页")}
            screenOptions={{
                unmountOnBlur: true,
                drawerPosition: "right",
                drawerStyle: {backgroundColor: theme.fill_base},
            }} 
            drawerContent={props => {
            return (   
                <DrawerContentScrollView {...props}>
                    <DrawerItemList {...props} />
                    <DrawerItem label={t("验证手机号")} labelStyle={{color: theme.text_color}} onPress={() => navigation.navigate(`${t("输入手机号")}`, { verificationType: "VERIFYPHONE" })} />
                    <DrawerItem label={t("重设密码")} labelStyle={{color: theme.text_color}} onPress={() => navigation.navigate(`${t("输入手机号")}`, { verificationType: "RESET" })} />
                    <DrawerItem label={t("编辑资料")} labelStyle={{color: theme.text_color}} onPress={() => navigation.navigate(`${t("编辑资料")}`)} />
                    <DrawerItem label={t("个人设置")} labelStyle={{color: theme.text_color}} onPress={() => navigation.navigate(`${t("个人设置")}`)} />
                    {currentUser.is_phone_verified && !currentUser.is_banned.users && <DrawerItem label={t("官方认证")} labelStyle={{color: theme.text_color}} onPress={() => navigation.navigate(`${t("官方认证")}`)} />}
                    {currentUser.is_verified && !currentUser.is_banned.users && <DrawerItem label={t("我的订单")} labelStyle={{color: theme.text_color}} onPress={() => navigation.navigate(`${t("我的订单")}`)} />}
                    {currentUser.is_certification_verified && currentUser.is_phone_verified && !currentUser.is_banned.users && <DrawerItem label={t("我的生意")} labelStyle={{color: theme.text_color}} onPress={() => navigation.navigate(`${t("我的生意")}`)} />}
                    <DrawerItem label={t("黑名单")} labelStyle={{color: theme.text_color}} onPress={() => navigation.navigate(`${t("黑名单")}`)} />
                    {currentUser.is_verified && !currentUser.is_banned.users && <DrawerItem label={t("意见反馈")} labelStyle={{color: theme.text_color}} onPress={() => setOpenFeedback(true)} />}
                    {currentUser.is_verified && !currentUser.is_banned.users && <DrawerItem label={t("联系我们")} labelStyle={{color: theme.text_color}} onPress={() => navigation.navigate(`${t('私信')}`, { usernameURL: 'xcoolsports' })} />}
                    <DrawerItem label={t("注销账号")} labelStyle={{color: theme.text_color}} onPress={() => setDeleteUserModal(true)} />
                    <DrawerItem label={t("用户协议")} labelStyle={{color: theme.text_color}} onPress={() => navigation.navigate(`${t("用户协议")}`)} />
                    <DrawerItem label={t("隐私政策")} labelStyle={{color: theme.text_color}} onPress={() => navigation.navigate(`${t("隐私政策")}`)} />
                    <DrawerItem label={t("常见问题")} labelStyle={{color: theme.text_color}} onPress={() => navigation.navigate(`${t("常见问题")}`)} />
                    <DrawerItem label={t("退出登录")} labelStyle={{color: theme.text_color}} onPress={() => setLogoutModal(true)} />
                    <DeleteUser navigation={navigation} deleteUserModal={deleteUserModal} setDeleteUserModal={setDeleteUserModal} />
                    <Feedback openFeedback={openFeedback} setOpenFeedback={setOpenFeedback} />
                    <Logout logoutModal={logoutModal} setLogoutModal={setLogoutModal} />
                </DrawerContentScrollView>
            )
        }}>
            <Drawer.Screen name={t("主页")} initialParams={{ usernameURL: currentUser.username, me: true }} component={User} options={{ headerShown: false }} />
        </Drawer.Navigator>
    )
};

export default UserNavigation;
