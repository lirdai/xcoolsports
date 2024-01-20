import React, { useRef, useCallback, useContext } from 'react';
import { View, Animated, Easing } from 'react-native';
import { useTranslation } from 'react-i18next'
import { useFocusEffect } from '@react-navigation/native';

import theme, { ThemeContext } from '@xcoolsports/constants/theme';

const BouncingText = ({ texts }) => {
    const { t, i18n } = useTranslation();
    const bounceAnims = useRef(texts.map((text) => text.id).map(() => new Animated.Value(0))).current;
    const theme = useContext(ThemeContext);

    const startBounce = () => {
        Animated.sequence(
            bounceAnims.map((anim, index) =>
                Animated.sequence([
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 150,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 150,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                ])
            )
        ).start();
    };

    useFocusEffect(useCallback(() => {
        startBounce();
        return () => {
            bounceAnims.forEach(anim => anim.stopAnimation()); // 在组件卸载时停止动画
        };
    }, []));

    const textStyle = index => ({
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: theme.text_color,
        transform: [
            {
                translateY: bounceAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 10],
                }),
            },
        ],
    });

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            {texts.map((text) => <Animated.Text key={text.id} style={textStyle(text.id - 1)}>{t(text.word)}</Animated.Text>)}
        </View>
    );
};

export default BouncingText;