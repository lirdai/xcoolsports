import React from 'react';
import { Pressable, Text, View, NativeModules } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import theme from '@xcoolsports/constants/theme';
import styles from '@xcoolsports/components/Common/Buttons/style';
import { toastActions, toastTypes, selectCurrentUser } from '@xcoolsports/data';
import Image from '@xcoolsports/components/utils/Image';
import templateConstants from '@xcoolsports/constants/templateConstants';

const { OauthModule } = NativeModules;

const ShareToWechatCircle = ({ navigation, event }) => {
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
                // OauthModule.shareToTimeline(event.title, templateConstants.subs.find((sub) => sub.url === event?.subcategory).title, `https://xcoolsports.com/app/event/${event.topic_id}/${event.id}`);
            }}
        >
            <View style={[styles.icon, { backgroundColor: theme.brand_success, borderColor: theme.brand_success }]}>
                <Image 
                    containerStyle={{    
                        width: theme.icon_size_md,
                        height: theme.icon_size_md,
                        borderRadius: 100,
                        padding: 1,
                        backgroundColor: theme.fill_base,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} 
                    isSelectedUploading={false}
                    editMode={false}
                    showloading={false}
                    source={require('@xcoolsports/static/wechat.jpeg')}
                    resizeMode="cover"
                />
            </View>

            <Text style={styles.text}>朋友圈</Text>
        </Pressable>
    )
};

export default ShareToWechatCircle;