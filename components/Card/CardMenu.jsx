import React from 'react';
import { ScrollView } from 'react-native';

import DeleteCard from '@xcoolsports/components/Common/Buttons/DeleteCard';
import styles from '@xcoolsports/components/LoginUserTabs/Notifications/style';

const CardMenu = ({ card, onClose }) => {
    return (
        <ScrollView style={styles.notificationMenuContainer} showsVerticalScrollIndicator={false} vertical>
            <DeleteCard card={card} onClose={onClose} />
        </ScrollView>
    );
};

export default CardMenu;