import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions, Easing } from 'react-native';

import Image from '@xcoolsports/components/utils/Image';
import urlConstants from '@xcoolsports/constants/urls';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rippleContainer: {
        position: 'relative',
        width: 2 * (Dimensions.get('window').width / 12 + Dimensions.get('window').width / 6),
        height: 2 * (Dimensions.get('window').width / 12 + Dimensions.get('window').width / 6),
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const RippleEffect = ({ avatar }) => {
    const rippleAnim = useRef(new Animated.Value(0)).current;
    const spinValue = useRef(new Animated.Value(0)).current;

    const startRipple = () => {
        rippleAnim.setValue(0);
        Animated.timing(rippleAnim, {
            toValue: 1, // 控制波纹圈数
            duration: 1500, // 每个波纹持续时间
            useNativeDriver: false,
        }).start(() => startRipple());
    };

    useEffect(() => {
        startRipple();
    }, []);

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 5000, // 旋转一周的时间（毫秒）
                easing: Easing.linear,
                useNativeDriver: true, // 使用原生动画
            })
        ).start();
    }, []);

    const rippleColors = ['#FFC0CB', '#f7889b', '#ff5976', '#FF1493'];
    const coreRadius = Dimensions.get('window').width / 12; // 核心圆半径
    const maxRippleRadius = Dimensions.get('window').width / 8; // 最大波纹半径

    const rippleStyle = {
        width: maxRippleRadius * 2,
        height: maxRippleRadius * 2,
        borderRadius: maxRippleRadius,
        position: 'absolute',
        borderWidth: 2,
        borderColor: 'transparent',
    };

    const coreCircleStyle = {
        width: coreRadius * 2,
        height: coreRadius * 2,
        borderRadius: coreRadius,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', // 背景颜色设为白色
        elevation: 5, // 阴影效果
    };

    const ripples = rippleColors.map((color, index) => {
        const scale = rippleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, (maxRippleRadius * 2) / (coreRadius * 2) + index * 0.65],
        });

        const opacity = rippleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8 - index * 0.2, 0],
        });

        return (
            <Animated.View
                key={index}
                style={[
                    rippleStyle,
                    {
                        backgroundColor: color,
                        transform: [{ scale }],
                        opacity,
                    },
                ]}
            />
        );
    });

    return (
        <View style={styles.container}>
            <View style={styles.rippleContainer}>
                {ripples}
                <Animated.View style={coreCircleStyle}>
                    <Image
                        containerStyle={{ width: coreRadius * 2, height: coreRadius * 2, borderRadius: coreRadius }}
                        isSelectedUploading={false}
                        editMode={false}
                        showloading={false}
                        source={avatar ? { uri: `${urlConstants.images}/${avatar}` } : require('@xcoolsports/static/avatar.jpg')}
                        resizeMode="cover"
                    />
                </Animated.View>
            </View>
        </View>
    );
};

export default RippleEffect;