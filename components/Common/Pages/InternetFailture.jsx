import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import { useTranslation } from 'react-i18next';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginVertical: theme.v_spacing_md,
    },
});

const InternetFailure = () => {
    const { t, i18n } = useTranslation();
    const theme = useContext(ThemeContext);

    return (
        <View style={styles.container}>
            <Feather name="wifi-off" size={60} color={theme.secondary_color} />            
            <Text style={[styles.text, {color: theme.fill_mask}]}>{t('网络连接不好, 请稍后再试')}</Text>
        </View>
    );
};

export default InternetFailure;