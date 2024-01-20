import React, { useState, useRef, useEffect, useContext } from 'react';
import { Pressable, View, Text, StyleSheet, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Like from '@xcoolsports/components/Common/Buttons/Like';
import Dislike from '@xcoolsports/components/Common/Buttons/Dislike';
import Save from '@xcoolsports/components/Common/Buttons/Save';
import urlConstants from '@xcoolsports/constants/urls';
import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import SlideUpModal from '@xcoolsports/components/utils/SlideUpModal/SlideUpModal';
import Image from '@xcoolsports/components/utils/Image';
import { selectCurrentUser, toastActions, toastTypes, api } from '@xcoolsports/data';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        paddingHorizontal: theme.h_spacing_md,
    },
    commentBar: {
        flex: 1,
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        borderBottomLeftRadius: 100,
        borderTopLeftRadius: 100,
    },
    placeholder: {
        flexGrow: 1,
        paddingHorizontal: 10,
    },
    modalContainer: {
        margin: theme.v_spacing_lg,
        marginTop: 0,
    },
    avatar: {
        height: 30, 
        width: 30, 
        borderRadius: 100,
    },
    buttonGroups: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-evenly',
        marginLeft: theme.h_spacing_lg,
    },
});

const Footer = ({ topic, navigation }) => {
    const { t, i18n } = useTranslation();
    const currentUser = useSelector(selectCurrentUser);
    const isMounted = useRef(true);
    const dispatch = useDispatch();
    const theme = useContext(ThemeContext);

    const [createComment] = api.endpoints.createTopic.useMutation();

    const [content, setContent] = useState('');
    const [openComment, setOpenComment] = useState(false);

    const openCommentModal = () => {
        if (!currentUser.is_logged_in) { 
            navigation.navigate(`${t('登录')}`); 
            return; 
        } else if (!currentUser.is_verified) {
            navigation.navigate(`${t("输入手机号")}`, { verificationType: "VERIFYPHONE" });
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '记得要验证手机号哦' }));
            return;
        } else if (currentUser.is_banned.users) {
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '账号被封, 请耐心等待' }));
            return;
        }

        setOpenComment(true);
        return;
    };

    const handleCommentSubmit = async () => {
        const newComment = {
          replyto: topic.id,
          parent: topic.id,
          content,
        };
    
        const response = await createComment(newComment);
        if (response.data && isMounted.current) {
            setContent('');
            setOpenComment(false);
        }
    };

    useEffect(() => () => { isMounted.current = false; }, []);

    return (
        <View style={[styles.container, {backgroundColor: theme.fill_base}]}>
            <Pressable hitSlop={10} style={[{backgroundColor: theme.fill_placeholder}, styles.commentBar]} onPress={openCommentModal}>
                <Image 
                    containerStyle={styles.avatar}
                    isSelectedUploading={false}
                    editMode={false}
                    showloading={false}
                    source={currentUser.avatar ? { uri :`${urlConstants.images}/${currentUser.avatar}` } : require('@xcoolsports/static/avatar.jpg') }
                    resizeMode="cover"
                />

                <Text style={[{color: theme.fill_mask}, styles.placeholder]}>{t('说点什么')}...</Text>
            </Pressable>

            <View style={styles.buttonGroups}>
                <Like style={{ flex: 1 }} topic={topic} navigation={navigation} />
                <Dislike style={{ flex: 1 }} topic={topic} navigation={navigation} />
                <Save style={{ flex: 1 }} topic={topic} navigation={navigation} />
            </View>

            <SlideUpModal
                title={`${t('发表评论')}`}
                onClose={() => setOpenComment(false)}
                visible={openComment}
                onOk={handleCommentSubmit}
                okTitle={`${t('确认发送')}`}
                disableOk={content === ''}
            >
                <View style={[styles.modalContainer]}>
                    <TextInput 
                        placeholder={`${t('说点什么')}...`}
                        placeholderTextColor={theme.secondary_variant}
                        multiline={true}
                        numberOfLines={10}
                        maxLength={200}
                        clear={true} 
                        style={{ 
                            marginBottom: theme.v_spacing_2xl, height: 200,
                            padding: theme.v_spacing_md,
                            color: theme.text_color,
                            textAlignVertical: 'top'
                        }}
                        value={content}
                        onChangeText={(text) => setContent(text)}
                    />
                </View>
            </SlideUpModal>
        </View>
    )
}

export default Footer;