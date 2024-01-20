
import React, { useEffect, useContext, useState } from 'react';
import { Text } from 'react-native';

import theme, { ThemeContext } from '@xcoolsports/constants/theme';

const TypingText = ({ text, speed }) => {
    const theme = useContext(ThemeContext);
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText(text.substring(0, currentIndex + 1));
                setCurrentIndex(currentIndex + 1);
            } else {
                clearInterval(interval);
            }
        }, speed);

        return () => {
            clearInterval(interval);
        };
    }, [text, speed, currentIndex]);

    return (
        <Text style={{ color: theme.text_color, alignSelf: 'center' }}>{displayedText}</Text>
    );
};

export default TypingText;