import React, { useState, useEffect, useContext } from 'react';
import { Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import theme, { ThemeContext } from '@xcoolsports/constants/theme';

const HeartbeatAnimation = ({ styles }) => {
    const [scaleValue] = useState(new Animated.Value(1));
    const theme = useContext(ThemeContext);

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(scaleValue, {
                    toValue: 0.6,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();

        return () => {
            animation.stop();
        };
    }, [scaleValue]);

    const heartStyle = {
        transform: [{ scale: scaleValue }],
    };

    return (
        <Animated.View style={[styles, heartStyle]}>
            <AntDesign name="heart" size={theme.icon_size_xxs} color={theme.brand_error} />
        </Animated.View>
    );
};

export default HeartbeatAnimation;