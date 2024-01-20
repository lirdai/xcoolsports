import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import DeleteTopic from "@xcoolsports/components/Common/Buttons/DeleteTopic";
import ReportTopic from "@xcoolsports/components/Common/Buttons/ReportTopic";
import BanTopic from "@xcoolsports/components/Common/Buttons/BanTopic";
import theme from '@xcoolsports/constants/theme';
import { selectCurrentUser } from '@xcoolsports/data';

const styles = StyleSheet.create({
    container: {
        marginVertical: theme.v_spacing_xl
    },
});

const CommentMenu = ({ comment, navigation, onClose }) => {
    const currentUser = useSelector(selectCurrentUser);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} verical>
            {currentUser.username === comment?.author?.username && <DeleteTopic commentDelete id={comment.id} navigation={navigation} onClose={onClose} />}
            <ReportTopic id={comment.id} navigation={navigation} onClose={onClose} />
            {(currentUser.is_staff && currentUser.is_logged_in && currentUser.is_verified && !currentUser.is_banned.users) && 
                <BanTopic id={comment.id} navigation={navigation} onClose={onClose} />
            }
        </ScrollView>
    );
};

export default CommentMenu;