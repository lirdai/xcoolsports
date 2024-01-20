import React, { useEffect, useState } from 'react';
import { View, Animated } from 'react-native';
import { Chip } from 'react-native-paper';

const BlinkingSquares = ({ isFixedPosition, positions, randomNumber, totalTexts }) => {
    const [squares, setSquares] = useState([]);
    const randomColor = () => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.9)`;
    const randomBetween = (min, max) => `${Math.random() * (max - min) + min}%`;
    const generateRandomSquare = (text) => {
        const position = Math.random() > 0.5
            ? {
                left: randomBetween(10, 90),
                top: randomBetween(10, 90),
            }
            : {
                right: randomBetween(10, 90),
                bottom: randomBetween(10, 90),
            };

        const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.9)`;
        return { text, position, color };
    };

    useEffect(() => {
        let initialSquare;
        if (isFixedPosition) {
            initialSquare = totalTexts.slice(0, positions.length).map((text, i) => ({
                position: positions[i],
                text,
                color: randomColor(),
                opacityAnim: new Animated.Value(1),
            }));
        } else {
            initialSquare = totalTexts.slice(0, randomNumber).map((text, i) => ({
                ...generateRandomSquare(text),
                opacityAnim: new Animated.Value(1),
            }));
        }

        setSquares(initialSquare);
    }, [totalTexts]);

    const startBlinkingLoop = () => {
        const animationSequences = squares.map((square) =>
            Animated.sequence([
                Animated.timing(square.opacityAnim, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(square.opacityAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
            ])
        );

        Animated.stagger(1000, animationSequences).start(() => {
            startBlinkingLoop(); // 循环闪烁
        });
    };

    useEffect(() => {
        if (squares.length !== 0) startBlinkingLoop(); // 开始循环闪烁
        return () => {
            // 停止所有正在进行的动画
            squares.forEach((square) => {
                square.opacityAnim.stopAnimation();
            });
        };
    }, [squares]);

    return (
        <View style={{ position: 'absolute', height: '100%', width: '100%' }}>
            {squares.map((square, index) => (
                <Animated.View
                    key={index}
                    style={{
                        position: 'absolute',
                        flexShrink: 1,
                        opacity: square.opacityAnim,
                        ...square.position,
                    }}
                >
                    <Chip
                        key={square.text}
                        mode="outlined"
                        style={{ backgroundColor: square.color, borderColor: square.color }}
                    >{square.text}</Chip>
                </Animated.View>
            ))}
        </View>
    );
};

export default BlinkingSquares;