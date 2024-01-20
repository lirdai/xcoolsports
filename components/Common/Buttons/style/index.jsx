import { StyleSheet } from 'react-native'
import theme from '@xcoolsports/constants/theme';

export default StyleSheet.create({
    container: {
        width: '100%',       
        justifyContent: 'center',
        alignItems: 'center', 
    },
    icon: {
        width: 50,
        height: 50,
        borderRadius: 100,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        paddingVertical: theme.v_spacing_md,
        fontSize: theme.font_size_caption_sm,
        fontWeight: 'bold',
    },
    modalContainer: {
        margin: theme.v_spacing_lg,
        marginTop: 0,
    },
    modalTitle: {
        fontSize: theme.font_size_heading, 
        paddingVertical: theme.v_spacing_sm,
    },
    modalContent: { 
        flexDirection: 'row',
        justifyContent: "flex-end",
        marginTop: theme.v_spacing_xl,
    },
    modalButton: {
        marginHorizontal: theme.h_spacing_xl
    },
    modalText: {
        fontSize: theme.font_size_heading
    },
    radioGroup: {
        maxHeight: 300,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    twoRadios: {
        alignItems: 'flex-start',
        justifyContent: "center",
        width: '50%',
    },
    oneRadio: {
        alignItems: 'flex-start',
        justifyContent: "center",
        width: '100%',
    },
});