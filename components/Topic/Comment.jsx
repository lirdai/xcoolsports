import React, { useRef, useState, useEffect, useContext } from 'react';
import { Pressable, View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as Haptics from 'expo-haptics';
import { Rating } from 'react-native-ratings';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import urlConstants from '@xcoolsports/constants/urls';
import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import SlideUpModal from '@xcoolsports/components/utils/SlideUpModal';
import Like from  "@xcoolsports/components/Common/Buttons/Like";
import Image from '@xcoolsports/components/utils/Image';
import CommentMenu from '@xcoolsports/components/Topic/CommentMenu';
import { selectCurrentUser, selectCommentsById, api, toastActions, toastTypes, selectLanguage } from '@xcoolsports/data';

const styles = StyleSheet.create({
    commentContainer: {},
    parentComment: {
        paddingHorizontal: theme.h_spacing_lg,
        paddingVertical: theme.v_spacing_sm,
    },
    childrenComment: {
        paddingLeft: theme.h_spacing_xl, 
        paddingVertical: theme.v_spacing_sm,
        paddingRight: theme.h_spacing_lg,
    },
    hightlight: {
        paddingHorizontal: theme.h_spacing_lg,
        paddingVertical: theme.v_spacing_sm,
    },
    titleContainer: { 
        flexDirection: 'row', 
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    title: {
        flexDirection: 'row', 
        alignItems: 'center',
    },
    avatar: {
        width: 20, 
        height: 20, 
        borderRadius: 100,
    },
    nickname: {
        fontSize: theme.font_size_caption_sm, 
        paddingHorizontal: theme.h_spacing_md,
    },
    nicknameEllipse: {
        fontSize: theme.font_size_caption_sm, 
        paddingHorizontal: theme.h_spacing_md,
        maxWidth: Dimensions.get("window").width * 0.36,
    },
    content: {
        paddingVertical: theme.v_spacing_md,
    },
    replyContainer: {
        flexDirection: 'row', 
        alignItems: "center",
        justifyContent: 'space-between'
    },
    reply: {
        flexDirection: 'row', 
        alignItems: "center",
    },
    date: {
        fontSize: theme.font_size_caption_sm, 
        paddingRight: theme.h_spacing_md,
    },
    fontSizeSM: { 
        fontSize: theme.font_size_caption_sm 
    },
    modalContainer: {
        margin: theme.v_spacing_lg,
        marginTop: 0,
    },
    commensNumber: {
        paddingLeft: theme.h_spacing_xl, 
        paddingVertical: theme.v_spacing_md,
        justifyContent: 'center', 
        alignItems: 'flex-start',
    },
    commensNumberText: {
        fontSize: theme.font_size_caption_sm, 
        fontWeight: 'bold',
    },
});

const Comment = ({
    navigation, comment, commentHighlights, isParentComment,
}) => {
    const { t, i18n } = useTranslation();
    const isMounted = useRef(true);
    const currentUser = useSelector(selectCurrentUser);
    const language = useSelector(selectLanguage);
    const dispatch = useDispatch();
    const theme = useContext(ThemeContext); 

    const [content, setContent] = useState('');
    const [openCommentMenu, setOpenCommentMenu] = useState(false);
    const [showReplyCommentModal, setShowReplyCommentModal] = useState(false);
    const [showChildren, setShowChildren] = useState(!isParentComment);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);

    const [getManyComments, result] = api.endpoints.getManyComments.useLazyQuery();    
    const [createComment] = api.endpoints.createTopic.useMutation();
    const comments = useSelector((state) => selectCommentsById(state, comment.id));

    const handleCommentSubmit = async () => {
        const newComment = {
          replyto: comment.id,
          parent: isParentComment ? comment.id : comment.parent.id,
          content,
        };

        const response = await createComment(newComment);
        if (response.data && isMounted.current) {
            setContent('');
            setShowReplyCommentModal(false);
        }
    };

    const fetchChildrenComments = async () => {
        if (hasNext) {
            const response = await getManyComments({ page, topicID: comment.id });
            if (response.data && isMounted.current) {
                setPage(page + 1);
                setHasNext(response.data.hasNext);
                setShowChildren(true);
            }
        } else {
            setPage(1);
        }
    };

    useEffect(() => () => { isMounted.current = false; }, []);

    return (
        <View>
            <View style={styles.commentContainer}>
                <Pressable 
                    hitSlop={10}
                    style={({ pressed }) => [(commentHighlights.includes(comment.id) 
                        ? [styles.hightlight, {backgroundColor: theme.fill_placeholder}, (isParentComment ? styles.parentComment : styles.childrenComment)] 
                        : (isParentComment ? styles.parentComment : styles.childrenComment)), 
                        pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}
                    onLongPress={() =>  { setOpenCommentMenu(!openCommentMenu); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                >
                  {/* Comment 第一行: Image, Name */}
                    <View style={[styles.titleContainer]}>
                        <Pressable hitSlop={10} style={styles.title} onPress={() => { 
                            comment?.author?.username 
                                ? navigation.push(`${t('看用户')}`, { usernameURL: comment.author?.username })
                                : null
                            }}>
                                <Image 
                                    containerStyle={styles.avatar}
                                    isSelectedUploading={false}
                                    editMode={false}
                                    showloading={false}
                                    source={comment.author?.avatar ? { uri :`${urlConstants.images}/${comment.author?.avatar}` } : require('@xcoolsports/static/avatar.jpg')}
                                    resizeMode="cover"
                                />
                                <Text numberOfLines={1} style={[isParentComment ? styles.nickname : styles.nicknameEllipse, {color: theme.text_color}]}>{ comment.author?.nickname || `${t('用户不存在')}` }</Text>
                        </Pressable>

                        {!isParentComment && <FontAwesome5 name="caret-right" size={theme.icon_size_xxs} color={theme.secondary_variant} />}

                        {!isParentComment && 
                        <Pressable 
                            hitSlop={10} 
                            style={styles.title} 
                            onPress={() => {
                                comment?.reply_to?.author?.username
                                    ? navigation.push(`${t('看用户')}`, { usernameURL: comment?.reply_to?.author?.username })
                                    : null
                            }}
                        >
                            <Text numberOfLines={1} style={[{ color: theme.secondary_variant }, styles.nicknameEllipse]}>{ comment.reply_to?.author?.nickname || `${t('用户不存在')}` }</Text>
                        </Pressable>}
                    </View>

                    {/* Comment 第二行: Star, Content */}
                    {comment.rating && 
                        <Rating
                            ratingCount={Math.floor(comment.rating)}
                            startingValue={5}
                            imageSize={10}
                            readonly
                            style={{ alignItems: 'flex-start', paddingVertical: theme.v_spacing_sm }}
                        />}
                    <Text style={[styles.content, {color: theme.text_color}]}>{comment.content}</Text>

                    {/* Comment 第三行: Comment Reply */}
                    <View style={styles.replyContainer}> 
                        <View style={styles.reply}>
                            <Text style={[styles.date, {color: theme.secondary_variant}]}>{ new Date(comment.created_at).toLocaleString({language}) }</Text>
                            <Pressable 
                                hitSlop={10}
                                onPress={() => {
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

                                    setShowReplyCommentModal(!showReplyCommentModal);
                                    return;
                                }}
                            >
                                <Text style={[styles.fontSizeSM, {color: theme.text_color}]}> {t('回复')} </Text>
                            </Pressable>
                        </View>                         

                        <Like topic={comment} size={'small'} navigation={navigation} />
                    </View>
                </Pressable>
            </View>

            {(isParentComment && comment.num_comments !== 0 && !showChildren) && 
                <Pressable hitSlop={10} style={styles.commensNumber} onPress={fetchChildrenComments}>
                    {(page === 1 && hasNext && !result.isFetching) && <Text style={[styles.commensNumberText, {color: theme.secondary_variant}]}> {t('展开')} {comment.num_comments} {t('评论')} </Text>}
                    {(page !== 1 && hasNext && !result.isFetching) && <Text style={[styles.commensNumberText, {color: theme.secondary_variant}]}> {t('展开更多评论')} </Text>}
                    {(result.isFetching) && <ActivityIndicator size="small" color={theme.secondary_variant} />}
                </Pressable>}

            {comments.map((comment) => 
                showChildren && <Comment 
                    key={comment.id}
                    commentHighlights={commentHighlights}
                    navigation={navigation}
                    comment={comment}
                />
            )}
                   
            <SlideUpModal
                onClose={() => setOpenCommentMenu(false)}
                visible={openCommentMenu}
            >
                <CommentMenu
                    comment={comment} 
                    navigation={navigation} 
                    onClose={() => setOpenCommentMenu(false)}
                /> 
            </SlideUpModal>

            <SlideUpModal
                title={t('发表评论')}
                onClose={() => setShowReplyCommentModal(false)}
                visible={showReplyCommentModal}
                onOk={handleCommentSubmit}
                okTitle={t('确定')}
                disableOk={content === ''}
            >
                 <View style={[styles.modalContainer]}>
                    <TextInput
                        placeholder={`${t('回复')} @${comment?.author?.nickname}:`}  
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
    );
};

export default Comment;