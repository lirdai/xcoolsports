import React, { useRef, useEffect, useContext } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons'; 
import { useTranslation } from 'react-i18next'

import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import { selectCurrentUser } from '@xcoolsports/data';

const styles = StyleSheet.create({
    container: {
        position: 'absolute', 
        top: 15, 
        width: '100%', 
        flexDirection: 'row', 
        justifyContent: 'space-between',
    },
    icon: {      
        width: 30, 
        height: 30, 
        borderRadius: 100, 
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: theme.h_spacing_sm,
    },
});

const UserIcons = ({ navigation, selectedUser, setOpenSettingModal }) => {
    const { t, i18n } = useTranslation();
    const isMounted = useRef(true);
    const currentUser = useSelector(selectCurrentUser);
    const theme = useContext(ThemeContext);

    useEffect(() => () => { isMounted.current = false; }, []);

    return (
        <View style={styles.container}>
            <Pressable hitSlop={10} onPress={() => navigation.goBack()} style={[styles.icon, {backgroundColor: theme.fill_mask}]}>
                <Feather name="arrow-left" size={theme.icon_size_xxs} color={theme.white_icon} />
            </Pressable>
                
            <View style={{ flexDirection: 'row' }}>
                <Pressable hitSlop={10} 
                    style={[styles.icon, {backgroundColor: theme.fill_mask}]} 
                    onPress={() => {
                        if (!currentUser.is_logged_in) { 
                            navigation.navigate(`${t('登录')}`); 
                            return; 
                        }

                        navigation.navigate(`${t('搜索')}`);
                        return;
                    }}
                >
                    <Feather name="search" size={theme.icon_size_xxs} color={theme.white_icon} />
                </Pressable>

                {(selectedUser.username === currentUser.username && navigation.openDrawer) && 
                    <Pressable hitSlop={10} onPress={() => navigation.openDrawer()} style={[styles.icon, {backgroundColor: theme.fill_mask}]}>
                        <AntDesign name="bars" size={theme.icon_size_xxs} color={theme.white_icon} />
                    </Pressable>
                }

                {(selectedUser.username !== currentUser.username && !navigation.openDrawer) && 
                    <Pressable hitSlop={10} onPress={() => setOpenSettingModal(true)} style={[styles.icon, {backgroundColor: theme.fill_mask}]}>
                        <Ionicons name="ellipsis-horizontal" size={theme.icon_size_xxs} color={theme.white_icon} />
                    </Pressable>
                }
            </View>
        </View>
    )
};

export default UserIcons;