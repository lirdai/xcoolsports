import React, { useRef, useState, useEffect } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    imageSmall: {
        width: "100%",
        height: 250,
    },
    imageMedium: {
        width: "100%",
        height: 350,
    },
    imageLarge: {
        width: "100%",
        height: 450,
    },
});

const getScreenSize = (windowWidth) => {
    if (windowWidth < 639) {
        return {
            'image': styles.imageSmall,
        }
    }

    if (windowWidth < 767) {
        return {
            'image': styles.imageMedium,
        }
    }

    return {
        'image': styles.imageLarge,
    }
};

const FlipCard = ({ cardIsFlipped, startFlipMotion, notFlippedSide, flippedSide }) => {
    const windowWidth = Dimensions.get("window").width;
    const windowSize = getScreenSize(windowWidth);

    const [isFlipped, setIsFlipped] = useState(cardIsFlipped);
    const flipAnim = useRef(new Animated.Value(0)).current;

    const flipA = Animated.timing(flipAnim, {
        toValue: 0.5,
        duration: 500,
        useNativeDriver: true,
    });

    const flipB = Animated.timing(flipAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
    });

    const startFlip = () => {
        flipA.start(() => {
            setIsFlipped(true);
            startFlipMotion();
            flipB.start();
        });
    };

    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['0deg', '180deg', '360deg'],
    });

    const frontStyle = {
        transform: [{ rotateY: backInterpolate }],
    };

    useEffect(() => {
        if (!isFlipped) startFlip();
    }, []);

    return (
        <Animated.View style={[windowSize.image, frontStyle, { backfaceVisibility: 'hidden' }]}>
            {isFlipped
                ? notFlippedSide
                : flippedSide
            }
        </Animated.View>
    );
};

export default FlipCard;