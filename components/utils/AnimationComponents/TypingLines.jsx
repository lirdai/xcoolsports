import React, { useEffect, useContext, useState } from 'react';
import { View, Text } from 'react-native';

import theme, { ThemeContext } from '@xcoolsports/constants/theme';

const TypingLines = ({ lines, speed }) => {
    const theme = useContext(ThemeContext);
    const [displayedLines, setDisplayedLines] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentLine, setCurrentLine] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentIndex < lines.length) {
                const line = lines[currentIndex];
                if (currentLine.length < line.length) {
                    setCurrentLine(line.substring(0, currentLine.length + 1));
                } else {
                    setDisplayedLines([...displayedLines, currentLine]);
                    setCurrentIndex(currentIndex + 1);
                    setCurrentLine('');
                }
            } else {
                clearInterval(interval);
            }
        }, speed);

        return () => {
            clearInterval(interval);
        };
    }, [lines, speed, currentIndex, currentLine, displayedLines]);

    return (
        <View>
            {displayedLines.map((line, index) => (
                <Text key={index} style={{ color: theme.text_color, alignSelf: 'flex-start' }}>{line}</Text>
            ))}
            <Text style={{ color: theme.text_color, alignSelf: 'flex-start' }}>{currentLine}</Text>
        </View>
    );
};

export default TypingLines;