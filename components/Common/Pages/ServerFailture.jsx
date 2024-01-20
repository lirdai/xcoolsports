import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
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

const ServerFailure = () => {
    const { t, i18n } = useTranslation();
    const theme = useContext(ThemeContext);

    return (
        <View style={styles.container}>
            <MaterialCommunityIcons name="server-network-off" size={60} color={theme.secondary_color} />            
            <Text style={[styles.text, {color: theme.fill_mask}]}>{t('服务器挂了, 我们正在积极努力的进行维修')}</Text>
        </View>
    );
};

export default ServerFailure;