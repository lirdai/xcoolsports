import React, {useContext} from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'

import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import { api, selectCurrentUser, toastActions, toastTypes } from '@xcoolsports/data';

const styles = StyleSheet.create({
    follow : {
      flexBasis: 50,
      marginVertical: theme.v_spacing_md,
      marginHorizontal: theme.h_spacing_xl,
      backgroundColor: theme.brand_error,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    followText: {
      fontSize: theme.font_size_heading, 
    },
});

const UserFollow = ({ selectedUser }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const theme = useContext(ThemeContext);

  const [updateFollow] = api.endpoints.updateFollow.useMutation();

  const handleFollow = async () => {
    const newFollow = { 
      followee: selectedUser.username, 
      i_follow: 1 - selectedUser.i_follow,
    };

    await updateFollow(newFollow);
  };

  return selectedUser.username && currentUser.username && selectedUser.username !== currentUser.username && (
    <Pressable
      hitSlop={10}
      onPress={() => {
        if (!currentUser.is_verified) {
          navigation.navigate(`${t("输入手机号")}`, { verificationType: "VERIFYPHONE" });
          dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '记得要验证手机号哦' }));
          return;
        } else if (currentUser.is_banned.users) {
          dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '账号被封, 请耐心等待' }));
          return;
        }

        handleFollow();
        return;
      }} style={styles.follow}
      onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    >
      { selectedUser.i_follow === 0 && selectedUser.follow_me === 0 && <Text style={[styles.followText, {color: theme.text_color}]}> {t('关注TA')} </Text> }
      { selectedUser.i_follow === 0 && selectedUser.follow_me === 1 && <Text style={[styles.followText, {color: theme.text_color}]}> {t('回关')} </Text> }
      { selectedUser.i_follow === 1 && selectedUser.follow_me === 0 && <Text style={[styles.followText, {color: theme.text_color}]}> {t('已关注')} </Text> }
      { selectedUser.i_follow === 1 && selectedUser.follow_me === 1 && <Text style={[styles.followText, {color: theme.text_color}]}> {t('互相关注')} </Text> }
    </Pressable>
  );
};

export default UserFollow;