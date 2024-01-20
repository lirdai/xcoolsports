import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
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

const DataNotFound = () => {
    const { t, i18n } = useTranslation();
    const theme = useContext(ThemeContext);

    return (
        <View style={styles.container}>
            <MaterialIcons name="dangerous" size={80} color={theme.secondary_color} />
            <Text style={[styles.text, {color: theme.fill_mask}]}>{t('数据不存在')}</Text>
        </View>
    );
};

export default DataNotFound;