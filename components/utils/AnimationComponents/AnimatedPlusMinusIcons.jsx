import React, { useState, useContext } from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';

const AnimatedButton = Animated.createAnimatedComponent(Pressable);

const AnimatedPlusMinusIcons = ({children, onPressInComponent, onPress, containerStyle}) => {
    const [pressed, setPressed] = useState(false);
    const theme = useContext(ThemeContext);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: pressed ? theme.fill_placeholder : withSpring(theme.fill_base),
            transform: [{
                scale: pressed ? withSpring(1.2, {stiffness: 400}) : withSpring(1),
            }],
        };
    });

    return (
        <AnimatedButton
            onPress={onPress}
            style={[animatedStyle, containerStyle]}
            onPressIn={()=>{ setPressed(true) }}
            onPressOut={()=>{ setPressed(false) }}
        >
            {pressed ? onPressInComponent : children}
        </AnimatedButton>
    );
};

export default AnimatedPlusMinusIcons;