import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 36,
        minHeight: 128,
    },
    text: { 
        paddingVertical: theme.v_spacing_md,
    }
});

const End = ({style}) => {
    const { t, i18n } = useTranslation();
    const theme = useContext(ThemeContext);

    return (
        <View style={[styles.container, style]}> 
            <Text style={[styles.text, {color: theme.fill_mask}]}>{t('暂时没有更多了')}</Text>
        </View>
    );
};

export default End;