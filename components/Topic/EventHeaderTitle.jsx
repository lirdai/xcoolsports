import React, { useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import templateConstants from '@xcoolsports/constants/templateConstants';
import { selectCurrentUser, toastActions, toastTypes } from '@xcoolsports/data';
import PrimaryContainedButton from '@xcoolsports/components/utils/Buttons/PrimaryContainedButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeSelection: {
    height: 30,
    paddingHorizontal: theme.h_spacing_md,
  },
});

const EventHeaderTitle = ({ navigation, event }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const theme = useContext(ThemeContext);

    if (!event) return null;

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', width: 150 }}>
                {event.currency === '加元' && <Text style={{ fontWeight: 'bold', color: theme.text_color }}>$</Text>}
                <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{event.price} {templateConstants.prices.find((price) => price.url === event.price_type).title}</Text>
            </View>

            <PrimaryContainedButton 
                buttonFreeStyle={styles.timeSelection} 
                textFreeStyle={{fontWeight: 'bold', fontSize: theme.font_size_base}}
                buttonText={'显示时间'} 
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

                    navigation.navigate(`${t('选择活动时间')}`, { eventId: event.id, start: event.first_date, end: event.last_date })
                    return;
                }}
            />
        </View>
    );
};

export default EventHeaderTitle;
