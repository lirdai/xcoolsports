import React, { useEffect, useState, useRef, useContext } from 'react';
import { Pressable, Text, View, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons'; 
import { useTranslation } from 'react-i18next';

import {ThemeContext} from '@xcoolsports/constants/theme';
import Image from '@xcoolsports/components/utils/Image';
import NotificationMenu from '@xcoolsports/components/LoginUserTabs/Notifications/NotificationMenu';
import SlideUpModal from '@xcoolsports/components/utils/SlideUpModal';
import urlConstants from '@xcoolsports/constants/urls';
import Container from '@xcoolsports/components/Common/Container';
import styles from '@xcoolsports/components/LoginUserTabs/Notifications/style';
import { selectCurrentUser, selectDialogues, toastActions, toastTypes, selectLanguage } from '@xcoolsports/data';

const Notifications = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const isMounted = useRef(true);
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const language = useSelector(selectLanguage);
  const dialogues = useSelector(selectDialogues);
  const theme = useContext(ThemeContext);

  const [openSettingModal, setOpenSettingModal] = useState(false);
  const [usernameURL, setUsernameURL] = useState();

  const updateSettingModal = (value) => {
    if (!isMounted.current) return;
    setOpenSettingModal(value);
  };

  useEffect(() => {
    return () => { 
      isMounted.current = false;
    };
  }, []);

  return (
    <Container header={{ title: `${t('消息')}`, headerTitle: { showTitle: true }}}>
      <ScrollView>
        <Pressable
          style={({ pressed }) => [styles.box, {borderBottomColor: theme.fill_disabled}, pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}
          hitSlop={10}
          onPress={() => navigation.navigate(`${t('公告')}`)}
        >
          <View style={styles.iconAnnoucement}>
            <Ionicons name="notifications" size={theme.icon_size} color={theme.fill_base} />
          </View>

          <Text style={[styles.title, {color: theme.text_color}]}> {t('公告消息')} </Text>
          {(currentUser?.num_notifications && currentUser?.num_notifications?.num_annoucements !== 0) &&
            <View style={styles.iconNumber}>
              <Text style={[styles.number, {color: theme.fill_base}]}> {currentUser?.num_notifications?.num_annoucements <= 99 ? currentUser?.num_notifications?.num_annoucements : '99+'} </Text>
            </View>}
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.box, {borderBottomColor: theme.fill_disabled}, pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}
          hitSlop={10}
          onPress={() => { currentUser?.is_logged_in ? navigation.navigate(`${t('互动')}`) : navigation.navigate(`${t('登录')}`) }}
        >
          <View style={[{backgroundColor: theme.primary_variant}, styles.iconInteraction]}>
            <FontAwesome5 name="user-friends" size={theme.icon_size} color={theme.fill_base} />
          </View>

          <Text style={[styles.title, {color: theme.text_color}]}> {t('互动消息')} </Text>

          {(currentUser?.num_notifications && currentUser?.num_notifications?.num_interactions !== 0) &&
            <View style={styles.iconNumber}>
              <Text style={[styles.number, {color: theme.fill_base}]}> {currentUser?.num_notifications?.num_interactions <= 99 ? currentUser?.num_notifications?.num_interactions : '99+'} </Text>
            </View>}
        </Pressable>
        
        {(currentUser?.is_staff && currentUser?.is_logged_in && currentUser?.is_verified && !currentUser?.is_banned.users) &&
          <Pressable
            style={({ pressed }) => [styles.box, {borderBottomColor: theme.fill_disabled}, pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}
            hitSlop={10}
            onPress={() => navigation.navigate(`${t('管理')}`)}
          >
            <View style={styles.iconTicket}>
              <MaterialIcons name="verified-user" size={theme.icon_size} color={theme.fill_base} />
            </View>

            <Text style={[styles.title, {color: theme.text_color}]}> {t('管理消息')} </Text>
          </Pressable>
        }

        {dialogues.map(dialogue => {
          const messageNum = dialogue.unread;
          return (
            <Pressable 
              hitSlop={10}
              key={dialogue.last_seen + dialogue.text} 
              style={({ pressed }) => [styles.box, {borderBottomColor: theme.fill_disabled}, pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}
              onPress={() => {
                if (!currentUser?.is_logged_in) { 
                  navigation.navigate(`${t('登录')}`); 
                  return; 
                } else if (!currentUser?.is_verified) {
                  dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '记得要验证手机号哦' }));
                  return;
                } else if (currentUser?.is_banned.users) {
                  dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '账号被封, 请耐心等待' }));
                  return;
                }
                
                navigation.navigate(`${t('私信')}`, { usernameURL: dialogue.partner?.username });
                return;
              }}
              onLongPress={() => { 
                setUsernameURL(dialogue.partner?.username); 
                setOpenSettingModal(!openSettingModal); 
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); 
              }}
            >
              <Image 
                containerStyle={[styles.avatar, {backgroundColor: theme.fill_base}]}
                isSelectedUploading={false}
                editMode={false}
                showloading={false}
                source={dialogue.partner?.avatar ? { uri :`${urlConstants.images}/${dialogue.partner?.avatar}` } : require('@xcoolsports/static/avatar.jpg')}
                resizeMode="cover"
              />
 
              <View style={styles.title}>
                <Text style={[styles.nickname, {color: theme.text_color}]}>{dialogue.partner?.nickname}</Text>
                <Text style={[styles.text, {color: theme.text_color}]}>{dialogue.text}</Text>
                <Text style={[styles.date, {color: theme.text_color}]}>{ new Date(dialogue.last_seen).toLocaleString({language}) }</Text>
              </View>

              {(messageNum !== 0 && messageNum !== undefined) &&
                <View style={styles.iconNumber}>
                  <Text style={[styles.number, {color: theme.fill_base}]}> {messageNum <= 99 ? messageNum : '99+'} </Text>
                </View>}
            </Pressable>
          )
        })}

        <SlideUpModal
          onClose={() => setOpenSettingModal(false)}
          visible={openSettingModal}
        >
          <NotificationMenu usernameURL={usernameURL} updateSettingModal={updateSettingModal} onClose={() => setOpenSettingModal(false)} />
        </SlideUpModal>
      </ScrollView>
    </Container>
  )
};

export default Notifications;