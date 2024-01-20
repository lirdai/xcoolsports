import React, { useState, useContext } from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';

const AnimatedButton = Animated.createAnimatedComponent(Pressable);

const AnimatedReactionIcons = ({children, onPressInComponent, onPress, containerStyle, hitSlop}) => {
    const [pressed, setPressed] = useState(false);
    const theme = useContext(ThemeContext);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{
                scale: pressed ? withSpring(0.6, {stiffness: 600}) : withSpring(1, {stiffness: 600}),
            }],
        };
    });

    return (
        <AnimatedButton
            hitSlop={hitSlop}
            onPress={onPress}
            style={[animatedStyle, containerStyle]}
            onPressIn={()=>{ setPressed(true) }}
            onPressOut={()=>{ setPressed(false) }}
        >
            {pressed ? onPressInComponent : children}
        </AnimatedButton>
    );
};

export default AnimatedReactionIcons;