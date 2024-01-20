import React, { useContext } from 'react';
import { Text, Pressable } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next'
import * as Haptics from 'expo-haptics';

import { ThemeContext } from '@xcoolsports/constants/theme';

const PrimaryContainedButton = ({ buttonFreeStyle, textFreeStyle, disabled, onPress, buttonText, loading }) => {
    const theme = useContext(ThemeContext);
    const { t, i18n } = useTranslation();

    return (
        <Pressable
            disabled={disabled}
            onPress={onPress}
            onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            style={({ pressed }) => [buttonFreeStyle, {
                    borderRadius: 10, borderWidth: 3, justifyContent: 'center', alignItems: 'center',
                    borderColor: disabled ? theme.primary_variant : theme.primary_color,
                    backgroundColor: disabled ? theme.primary_variant : theme.primary_color,
                }, pressed ? { backgroundColor: theme.primary_variant, borderColor: theme.primary_variant } : {}
            ]}
        >
            {loading
                ? <ActivityIndicator size="small" color={theme.primary_contained_button_text_color} />
                : <Text style={[textFreeStyle, { color: theme.primary_contained_button_text_color, fontWeight: 'bold' }]}>{t(buttonText)}</Text>
            }
        </Pressable>
    );
};

export default PrimaryContainedButton;