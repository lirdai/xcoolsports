import { StyleSheet, Platform } from 'react-native';

import theme from '@xcoolsports/constants/theme';

export default StyleSheet.create({
    notificationMenuContainer: {
        marginVertical: theme.v_spacing_xl,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    box: {
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'center',
        borderBottomWidth: 1,
    }, 
    fixedBox: {
        flexDirection: 'row', 
        alignItems: 'center', 
        width: '100%',
        minHeight: 100,
        paddingHorizontal: theme.h_spacing_xl,
        borderBottomWidth: 1,
    },    
    number : {
        fontSize: theme.font_size_caption_sm,
        fontWeight: 'bold'
    },
    iconNumber: {
        height: 25,
        width: 25,
        margin: theme.h_spacing_lg,
        borderRadius: 100,
        backgroundColor: theme.brand_error,
        alignItems: 'center', 
        justifyContent: 'center',
    },
    iconAnnoucement: {
        height: 60,
        width: 60,
        margin: theme.h_spacing_lg,
        borderRadius: 100,
        backgroundColor: theme.brand_primary,
        alignItems: 'center', 
        justifyContent: 'center',
    },
    iconInteraction: {
        height: 60,
        width: 60,
        margin: theme.h_spacing_lg,
        borderRadius: 100,
        alignItems: 'center', 
        justifyContent: 'center',
    },
    iconTicket: {
        height: 60,
        width: 60,
        margin: theme.h_spacing_lg,
        borderRadius: 100,
        backgroundColor: theme.brand_wait,
        alignItems: 'center', 
        justifyContent: 'center',
    },
    avatar: {
        height: 60,
        width: 60,
        margin: theme.h_spacing_lg,
        borderRadius: 100,
        alignItems: 'center', 
        justifyContent: 'center',
    },
    smallAvatar: {
        width: 45, 
        height: 45, 
        borderRadius: 100,
    },
    systemIcon: {
        height: 45,
        width: 45,
        borderRadius: 100,
        backgroundColor: theme.brand_wait,
        alignItems: 'center', 
        justifyContent: 'center',
    },
    title: {
        flex: 1,
        fontSize: theme.font_size_caption,
        fontWeight: "bold",
        paddingHorizontal: theme.h_spacing_md,
    },
    horizontalTitle: {
        flex: 1,
        fontSize: theme.font_size_caption,
        fontWeight: "bold",
        paddingHorizontal: theme.h_spacing_md,
        flexDirection: 'row', 
        alignItems: 'center', 
    },
    nickname: { 
        fontWeight: 'bold',
    },
    text: { 
        fontSize: 10, 
        paddingVertical: 5 
    },
    date: { 
        fontSize: 10 
    },
    unread: {},
    read: {
        flex: 1, 
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    messageAvatar: {
        width: 30, 
        height: 30, 
        borderRadius: 100,
        marginHorizontal: theme.h_spacing_md,
    },
    chatContainer: {
        margin: 10,
    },
    chatSelfContainer:{
        alignItems: 'center', 
        justifyContent: 'flex-end', 
        flexDirection: 'row'
    },
    chatSelfText: {
        padding: 6, 
        maxWidth: '65%', 
        backgroundColor: theme.brand_primary, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: 10, 
        overflow: 'hidden',
    },
    chatUserContainer: {
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        flexDirection: 'row'
    },
    chatUserText: {
        padding: 6, 
        maxWidth: '65%', 
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: 10, 
        overflow: 'hidden',
    },
    inputContainerDefault: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: theme.radius_md,
        height: Platform.OS === 'ios' ? 64 : 54,
    },
    sendTextInput: {
        marginHorizontal: 10, 
        height: 35, 
        borderRadius: 8, 
        flexGrow: 1, 
        flexShrink: 1, 
        paddingHorizontal: theme.h_spacing_md,
    },
});