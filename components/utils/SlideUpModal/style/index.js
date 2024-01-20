import { StyleSheet } from 'react-native'
import theme from '../../../../constants/theme';
import platform from './platform';

const styles = StyleSheet.create({
    title: {
        fontSize: theme.font_size_base,
        paddingTop: theme.v_spacing_sm,
        paddingBottom: theme.v_spacing_md,
        overflow: 'hidden',
    },
    modalContainer: { 
        borderRadius: theme.radius_md,
        paddingHorizontal: theme.h_spacing_lg,
        paddingTop: theme.v_spacing_lg,
        ...platform.modalContainer,
    },
    modalContainerFullScreen: {
        height: '100%',
    },
    modalContentContainer: {
        height: '100%',
    },
});

export default styles;