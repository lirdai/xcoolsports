import { StyleSheet } from 'react-native'
import theme from '@xcoolsports/constants/theme';

export default StyleSheet.create({
    container: { 
        minHeight: '100%',
        paddingHorizontal: theme.h_spacing_lg,
        paddingTop: 50,
        alignItems: 'center',
    },
    innerContainer: {
        width: '100%', 
        maxWidth: 600,
    },
    loginType: {
        flexDirection: 'row', 
        alignItems: 'center',
        marginBottom: theme.v_spacing_xl,
    },
    title: {
        fontSize: theme.font_size_subhead,
        marginBottom: theme.v_spacing_sm,
    },
    inputContainerDefault: {
        flexDirection: 'row',
        borderRadius: theme.radius_md,
        height: theme.input_height,
        marginBottom: theme.v_spacing_sm,
    },
    inputContainerError: {
        flexDirection: 'row',
        borderRadius: theme.radius_md,
        borderWidth: theme.border_width_md,
        borderColor: theme.brand_error,
        height: theme.input_height,
        marginBottom: theme.v_spacing_sm,
    },
    input: {
        flexGrow: 1,
        flexShrink: 1,
        paddingHorizontal: theme.h_spacing_md,
    },
    eye: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '10%',
    },
    error: {
        fontSize: theme.font_size_caption_sm,
        color: theme.brand_error,
        marginBottom: theme.v_spacing_xl,
    },
    button: {
        height: 50, 
        marginVertical: theme.v_spacing_lg, 
    },
    buttonText: {
        fontSize: theme.font_size_heading,
    },
    bar: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: theme.v_spacing_lg,
    },
    link: {
        color: theme.brand_primary,
        fontSize: theme.font_size_icontext,
    },
    oauthContainer: {
        width: '100%', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: theme.v_spacing_2xl,
    },
    oauthLoginContainer: {
        width: "50%", 
        flexDirection: 'row', 
        justifyContent: 'space-evenly', 
        alignItems: 'center',
    },
    checkbox:{
        flexDirection: 'row',
        marginBottom: theme.v_spacing_sm,
        marginTop: theme.v_spacing_xl,
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    vertificationButton: {
        height: theme.input_height,
    },
    vertificationText: {
        fontSize: theme.font_size_caption_sm,
        marginHorizontal: theme.v_spacing_md,
    },
    modalContainer: {
        margin: theme.v_spacing_lg,
        marginTop: 0,
    },
    modalTitle: {
        fontSize: theme.font_size_xl, 
        paddingVertical: theme.v_spacing_sm,
    },
    modalSmallTitle: {
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
});