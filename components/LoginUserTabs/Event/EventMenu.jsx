import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import theme from '@xcoolsports/constants/theme';
import ShareToWechatFriend from '@xcoolsports/components/Common/Buttons/ShareToWechatFriend';
import ShareToWechatCircle from '@xcoolsports/components/Common/Buttons/ShareToWechatCircle';

const styles = StyleSheet.create({
    container: { 
        marginVertical: theme.v_spacing_xl
    }
})

const EventMenu = ({ event, navigation }) => {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} vertical>
            <ShareToWechatFriend navigation={navigation} event={event} />
            <ShareToWechatCircle navigation={navigation} event={event} />
        </ScrollView>
    )
};

export default EventMenu;