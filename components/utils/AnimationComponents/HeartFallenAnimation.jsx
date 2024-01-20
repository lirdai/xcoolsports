import React, { useState, useEffect } from 'react';
import { View, Animated, Easing } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AntDesign } from '@expo/vector-icons';

import theme from '@xcoolsports/constants/theme';

const HeartFallenAnimation = () => {
    const { t, i18n } = useTranslation();
    const [animatedValues, setAnimatedValues] = useState([]);

    useEffect(() => {
        const createSnowflake = (index) => {
            const initialDirection = Math.random() < 0.5 ? -1 : 1; // 随机决定初始方向左或右
            const animatedValueY = new Animated.Value(-10);
            const animatedValueX = new Animated.Value(
                initialDirection * (Math.random() * 300), // 初始值在 -100 到 100 之间
            );
            const duration = 3000 + Math.random() * 2000;

            const animation = Animated.loop(
                Animated.timing(animatedValueY, {
                    toValue: 1000,
                    duration,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            );

            animation.start();

            return { animatedValueY, animatedValueX };
        };

        const hearts = Array.from({ length: 50 }, (_, index) =>
            createSnowflake(index),
        );

        setAnimatedValues(hearts);

        return () => {
            hearts.forEach(({ animatedValueY }) => animatedValueY.stopAnimation());
        };
    }, []);

    return (
        <View style={{ position: 'absolute', zIndex: 100, justifyContent: 'center', alignItems: 'center' }}>
            {animatedValues.map(({ animatedValueY, animatedValueX }, index) => (
                <Animated.View
                    key={index}
                    style={[
                        {
                            transform:
                                [
                                    { translateY: animatedValueY },
                                    { translateX: animatedValueX }
                                ],
                            opacity: animatedValueY.interpolate({
                                inputRange: [-10, 1000],
                                outputRange: [1, 0], // 根据 Y 值变化来设置透明度
                            }),
                        },
                    ]}
                >
                    <AntDesign name="heart" size={theme.icon_size_xl} color={theme.primary_color} />
                </Animated.View>
            ))}
        </View>
    );
};

export default HeartFallenAnimation;