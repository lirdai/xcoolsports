import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 36,
        minHeight: 128,
    },
});

const Loading = ({ isLoading, style }) => {
    const theme = useContext(ThemeContext);

    if (isLoading) {
        return (
            <View style={[styles.container, style]}>
                <ActivityIndicator size="small" color={theme.secondary_variant} /> 
            </View>
        );
    }

    return null;
};

export default Loading;