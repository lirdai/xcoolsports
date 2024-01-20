import React from 'react';
import { Pressable, Text, View, NativeModules } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AntDesign } from '@expo/vector-icons'; 

import theme from '@xcoolsports/constants/theme';
import styles from '@xcoolsports/components/Common/Buttons/style';
import { toastActions, toastTypes, selectCurrentUser } from '@xcoolsports/data';
import templateConstants from '@xcoolsports/constants/templateConstants';

const { OauthModule } = NativeModules;

const ShareToWechatFriend = ({ navigation, event }) => {
    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();

    return (
        <Pressable 
            hitSlop={10}
            style={styles.container} 
            onPress={() => { 
                if (!currentUser.is_logged_in) { 
                    navigation.navigate("登录"); 
                    return; 
                } else if (!currentUser.is_verified) {
                    dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: "记得要验证手机号哦" }));
                    return;
                } else if (currentUser.is_banned.users) {
                    dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: "账号被封, 请耐心等待" }));
                    return;
                }
                // OauthModule.shareToFriend(event.title, templateConstants.subs.find((sub) => sub.url === event?.subcategory).title, `https://xcoolsports.com/app/event/${event.topic_id}/${event.id}`);
            }}
        >
            <View style={[styles.icon, { backgroundColor: theme.brand_success, borderColor: theme.brand_success }]}>
                <AntDesign name="wechat" size={theme.icon_size_md} color={theme.fill_base} />       
            </View>

            <Text style={styles.text}>微信好友</Text>
        </Pressable>
    )
};

export default ShareToWechatFriend;