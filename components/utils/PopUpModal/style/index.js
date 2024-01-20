import { StyleSheet } from 'react-native'
import theme from '../../../../constants/theme';

const styles = StyleSheet.create({
    title: {
        color: theme.secondary_color,
        fontSize: theme.font_size_base,
        paddingTop: theme.v_spacing_sm,
        paddingBottom: theme.v_spacing_md,
        overflow: 'hidden',
    },
});

export default styles;