import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import theme from '@xcoolsports/constants/theme';
import BlockUser from '@xcoolsports/components/Common/Buttons/BlockUser';
import MessageUser from '@xcoolsports/components/Common/Buttons/MessageUser';
import ReportUser from '@xcoolsports/components/Common/Buttons/ReportUser';
import BanUser from '@xcoolsports/components/Common/Buttons/BanUser';
import { selectCurrentUser } from '@xcoolsports/data';

const styles = StyleSheet.create({
    container: {
        marginVertical: theme.v_spacing_xl,
    },
});

const UserMenu = ({ selectedUser, navigation, onClose }) => {
    const currentUser = useSelector(selectCurrentUser);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} vertical>
            <ReportUser username={selectedUser.username} navigation={navigation} onClose={onClose} />
            <BlockUser username={selectedUser.username} navigation={navigation} onClose={onClose} />
            <MessageUser username={selectedUser.username} navigation={navigation} onClose={onClose} />
            {(currentUser.is_staff && currentUser.is_logged_in && currentUser.is_verified && !currentUser.is_banned.users) && <BanUser username={selectedUser.username} onClose={onClose} />}
        </ScrollView>
    )
};

export default UserMenu;