import React from 'react';
import { ScrollView } from 'react-native';

import DeleteMessage from '@xcoolsports/components/Common/Buttons/DeleteMessage';
import BlockUser from '@xcoolsports/components/Common/Buttons/BlockUser';
import styles from '@xcoolsports/components/LoginUserTabs/Notifications/style';

const NotificationMenu = ({ usernameURL, onClose }) => {
    return (
        <ScrollView style={styles.notificationMenuContainer} showsVerticalScrollIndicator={false} vertical>
            <DeleteMessage username={usernameURL} onClose={onClose} />
            <BlockUser username={usernameURL} onClose={onClose} />
        </ScrollView>
    );
};

export default NotificationMenu;