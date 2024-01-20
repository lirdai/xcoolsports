import { StyleSheet, Dimensions } from 'react-native';
import theme from '@xcoolsports/constants/theme';

export default StyleSheet.create({
    scrollContainer: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlayScrollContainer: {
      height: '100%',
      position: 'absolute',
    },
    tapHandler: {
      flexDirection: 'row',
    },
    itemContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeItem: {
      borderBottomWidth: 2,
    },
    activeText: {
      fontWeight: '900',
    },
});