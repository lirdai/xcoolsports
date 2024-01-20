import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import Edit from "@xcoolsports/components/Common/Buttons/Edit";
import DeleteTopic from "@xcoolsports/components/Common/Buttons/DeleteTopic";
import ReportTopic from "@xcoolsports/components/Common/Buttons/ReportTopic";
import BanTopic from "@xcoolsports/components/Common/Buttons/BanTopic";
import theme from '@xcoolsports/constants/theme';
import { selectCurrentUser } from '@xcoolsports/data';

const styles = StyleSheet.create({
    container: { 
        marginVertical: theme.v_spacing_xl
    }
})

const TopicMenu = ({ topic, navigation, onClose }) => {
    const currentUser = useSelector(selectCurrentUser);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} vertical>
            {currentUser?.username === topic?.author?.username && <Edit id={topic.id} navigation={navigation} onClose={onClose} />}
            {currentUser?.username === topic?.author?.username && <DeleteTopic id={topic.id} navigation={navigation} onClose={onClose} />}
            {<ReportTopic id={topic.id} navigation={navigation} onClose={onClose} />}
            {(currentUser.is_staff && currentUser.is_logged_in && currentUser.is_verified && !currentUser.is_banned.users) && 
                <BanTopic id={topic.id} onClose={onClose} />
            }
        </ScrollView>
    )
};

export default TopicMenu;