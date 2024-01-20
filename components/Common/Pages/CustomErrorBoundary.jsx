import React, { useContext } from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import ErrorBoundary from 'react-native-error-boundary'
import { Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        margin: theme.v_spacing_md,
        width: '80%',
    },
});

const FallbackComponent = () => {
    const { t, i18n } = useTranslation();
    const theme = useContext(ThemeContext);

    return (
        <View style={[styles.container, {backgroundColor: theme.fill_base}]}>
            <Text style={{ fontSize: 30, fontWeight: 'bold', color: theme.text_color }}>Oops, Sorry...</Text>
            <Text style={[styles.text, {color: theme.fill_mask}]}>
                {t('如遇顽酷App无法启动, 请前往App Store下载最新版。非常抱歉因技术故障影响您的使用体验!')}
            </Text>
            <Button mode="contained" onPress={() => Linking.openURL('https://apps.apple.com/app/id1636893623/')}>{t('立即下载')}</Button>
        </View>
    );
};

const CustomErrorBoundary = ({ children }) => {
    return (
        <ErrorBoundary 
            FallbackComponent={FallbackComponent}
        >{children}</ErrorBoundary>
    );
};

export default CustomErrorBoundary;