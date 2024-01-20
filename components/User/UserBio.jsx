import React, {useContext} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { useTranslation } from 'react-i18next'

import theme, {ThemeContext} from '@xcoolsports/constants/theme';

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.h_spacing_xl,
        paddingVertical: theme.v_spacing_xl,
    },
    nickname: {
        marginTop: theme.v_spacing_md,
        fontSize: theme.font_size_xl,
        fontWeight: 'bold',
    },
    line: {
        marginTop: theme.v_spacing_md,
        flexDirection: 'row',
        alignItems: "center",
    },
    lineBioHeight: {
        marginTop: theme.v_spacing_md,
    }
});

const UserBio = ({ selectedUser }) => {
    const { t, i18n } = useTranslation();
    const theme = useContext(ThemeContext);

    return (      
        <View style={styles.container}>
            {selectedUser.nickname && <Text style={[styles.nickname, {color: theme.text_color}]}>{ selectedUser.nickname }</Text> }
            
            {selectedUser.is_certification_verified && (
                <View style={styles.line}>
                    {selectedUser.user_type === 'PERSON' && <FontAwesome name="check-circle" color={theme.brand_important} size={theme.icon_size_xxs} />}
                    {selectedUser.user_type === 'ORG' && <FontAwesome name="check-circle" color={theme.brand_primary} size={theme.icon_size_xxs} />}
                    <Text style={{color: theme.text_color}}> { selectedUser.certification } </Text>
                </View>
            )} 
        
            {selectedUser.bio === ''
                ? <Text style={[styles.lineBioHeight, {color: theme.text_color}]}>{t('这个人很懒，什么都没有留下')}</Text>
                : <Text style={[styles.lineBioHeight, {color: theme.text_color}]}>{ selectedUser.bio }</Text>
            }
        </View>
    )
}

export default UserBio;