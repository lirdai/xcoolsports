import React, { useState } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

const ShakeCard = ({ children, onLongPress }) => {
    const { t, i18n } = useTranslation();
    const [shakeAnimation] = useState(new Animated.Value(0));

    const handleShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, { toValue: 5, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: -5, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
        ]).start();
    };

    const animatedStyle = {
        transform: [{ translateX: shakeAnimation }],
    };

    return (
        <TouchableOpacity
            onPress={handleShake}
            onLongPress={onLongPress}
        >
            <Animated.View style={[animatedStyle]}>
                {children}
            </Animated.View>
        </TouchableOpacity>
    );
};

export default ShakeCard;