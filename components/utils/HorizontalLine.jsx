import React, {useContext} from 'react';
import { View } from 'react-native';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';

const HorizontalLine = ({style}) => {
    const theme = useContext(ThemeContext);

    return (
        <View
            style={{
                borderBottomColor: theme.fill_disabled,
                borderBottomWidth: 1,
                ...style,
            }}
        />
    );
}

export default HorizontalLine;