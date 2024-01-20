import React, { useContext } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'

import { selectCurrentUser } from '@xcoolsports/data';
import { ThemeContext } from '@xcoolsports/constants/theme';

const styles = StyleSheet.create({
    container: {
        paddingLeft: 120,
        flexDirection: 'row',
        width: "100%",
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: 50,
    },
    textCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

const UserBar = ({ navigation, selectedUser, children }) => {
    const { t, i18n } = useTranslation();
    const currentUser = useSelector(selectCurrentUser);
    const theme = useContext(ThemeContext);

    return (
        <View style={styles.container}>
            {children}

            <View style={styles.textCenter}>
                <Text style={{ color: theme.text_color }}>{t('获赞')}</Text>
                <Text style={{ color: theme.text_color }}>{Math.max(selectedUser.total_likes, 0)}</Text>
            </View>

            {selectedUser.username === currentUser.username
                ?
                <Pressable hitSlop={10} onPress={() => navigation.navigate(`${t('关注')}`)} style={styles.textCenter}>
                    <Text style={{ color: theme.text_color }}>{t('关注')}</Text>
                    <Text style={{ color: theme.text_color }}>{Math.max(currentUser.num_followees, 0)}</Text>
                </Pressable>
                :
                <View style={styles.textCenter}>
                    <Text style={{ color: theme.text_color }}>{t('关注')}</Text>
                    <Text style={{ color: theme.text_color }}>{Math.max(selectedUser.num_followees, 0)}</Text>
                </View>
            }

            {selectedUser.username === currentUser.username
                ?
                <Pressable hitSlop={10} onPress={() => navigation.navigate(`${t('粉丝')}`)} style={styles.textCenter}>
                    <Text style={{ color: theme.text_color }}>{t('粉丝')}</Text>
                    <Text style={{ color: theme.text_color }}>{Math.max(currentUser.num_followers, 0)}</Text>
                </Pressable>
                :
                <View style={styles.textCenter}>
                    <Text style={{ color: theme.text_color }}>{t('粉丝')}</Text>
                    <Text style={{ color: theme.text_color }}>{Math.max(selectedUser.num_followers, 0)}</Text>
                </View>
            }

            {selectedUser.username === currentUser.username
                ?
                <View style={styles.textCenter}>
                    <Text style={{ color: theme.text_color }}>{t('积分')}</Text>
                    <Text style={{ color: theme.text_color }}>{Math.max(currentUser.num_followers, 0)}</Text>
                </View>
                :
                <View style={styles.textCenter}>
                    <Text style={{ color: theme.text_color }}>{t('积分')}</Text>
                    <Text style={{ color: theme.text_color }}>{Math.max(selectedUser.num_followers, 0)}</Text>
                </View>
            }
        </View>
    )
}

export default UserBar;
