import { StyleSheet } from 'react-native';
import theme from '@xcoolsports/constants/theme';

export default StyleSheet.create({
    container: { flex: 1 },
    containerFullscreen: {},
    header: {
        elevation: 4,
        shadowOpacity: 0.85,
        shadowRadius: 0,
        shadowOffset: {
          width: 0,
          height: StyleSheet.hairlineWidth,
        },
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    extendedHeaderContainer: {
        position: 'absolute', 
        width: '100%',
        elevation: 4,
        shadowOpacity: 0.85,
        shadowRadius: 0,
        shadowOffset: {
            width: 0,
            height: StyleSheet.hairlineWidth,
        },
    },
});