import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { useTranslation } from 'react-i18next';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 36,
        minHeight: 128,
    },
    text: {
        paddingVertical: theme.v_spacing_md,
    },
});

const Empty = ({ isEmpty, style }) => {
    const { t, i18n } = useTranslation();
    const theme = useContext(ThemeContext);

    if (isEmpty) {
        return (
            <View style={[styles.container, style]}> 
                <AntDesign name="infocirlce" size={40} color={theme.fill_mask} />    
                <Text style={[styles.text, {color: theme.fill_mask}]}>{t('暂时没有内容')}</Text>
            </View>
        );
    }

    return null;
};

export default Empty;