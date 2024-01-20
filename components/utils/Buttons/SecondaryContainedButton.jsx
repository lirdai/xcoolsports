import React, {useContext} from 'react';
import { Text, Pressable } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next'

import {ThemeContext} from '@xcoolsports/constants/theme';

const SecondaryContainedButton = ({buttonFreeStyle, textFreeStyle, disabled, onPress, buttonText, loading}) => {
    const theme = useContext(ThemeContext);
    const { t, i18n } = useTranslation();

    return (
        <Pressable 
            disabled={disabled}
            onPress={onPress} 
            style={({ pressed }) => [buttonFreeStyle, {
                borderRadius: 10, borderWidth: 3, justifyContent: 'center', alignItems: 'center',
                borderColor: disabled ? theme.secondary_variant : theme.secondary_color, 
                backgroundColor: disabled ? theme.secondary_variant : theme.secondary_color,
            }, pressed ? { backgroundColor: theme.secondary_variant, borderColor: theme.secondary_variant } : {}]}
        >
            {loading 
                ? <ActivityIndicator size="small" color={theme.secondary_contained_button_text_color} /> 
                : <Text style={[textFreeStyle, {color: theme.secondary_contained_button_text_color, fontWeight: 'bold'}]}>{t(buttonText)}</Text>
            }
        </Pressable>
    );
};

export default SecondaryContainedButton;