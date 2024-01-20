import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Pressable, Text } from 'react-native';
import { Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

import theme, { ThemeContext } from '@xcoolsports/constants/theme';
import Container from '@xcoolsports/components/Common/Container';
import CardImage from '@xcoolsports/components/utils/CardImage';
import SlideUpModal from '@xcoolsports/components/utils/SlideUpModal';
import SecondaryContainedButton from '@xcoolsports/components/utils/Buttons/SecondaryContainedButton';
import { api, selectTags, configActions, toastActions, toastTypes } from '@xcoolsports/data';

const styles = StyleSheet.create({
    container: {
        padding: theme.v_spacing_lg,
    },
    textInput: {
        height: 50,
        borderBottomWidth: 1,
    },
    textarea: {
        borderBottomWidth: 1,
    },
    row: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        flexDirection: "row",
        justifyContent: 'flex-end',
        flexShrink: 1,
        marginLeft: theme.h_spacing_xl,
    },
    modalContainer: {
        marginVertical: theme.v_spacing_lg,
    },
});

const CardEdit = ({ navigation }) => {
    const isMounted = useRef(true);
    const { t, i18n } = useTranslation();
    const scrollviewRef = useRef();
    const dispatch = useDispatch();
    const theme = useContext(ThemeContext);
    const totalTags = useSelector(selectTags);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [addTag, setAddTag] = useState('');
    const [tagsModal, setTagsModal] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [createCard] = api.endpoints.createCard.useMutation();

    const handleTextInputFocus = () => {
        if (scrollviewRef.current) {
            scrollviewRef.current.scrollTo({ y: 200, animated: true });
        }
    };

    const isDisabledSubmit = ({ title, content, tags }) => {
        const isTitleBad = (title === "") && '标题不能为空';
        const isContentBad = (content === '') && '正文不能为空';
        const isTagsBad = tags.length === 0 && '请选择标签';

        return isTitleBad || isContentBad || isTagsBad;
    };

    const handleCardSubmit = async () => {
        const disabledCondition = isDisabledSubmit({ title, content, tags });

        if (disabledCondition) {
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: disabledCondition }));
            return;
        }

        if (isMounted.current) setSubmitLoading(true);

        const newCard = {
            title: '卡片啦',
            content,
            tags,
        };

        const response = await createCard({ body: newCard });
        if (response.data) {
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.SUCCESS, text: '提交成功' }));
            navigation.goBack();
        }
        if (isMounted.current) setSubmitLoading(false);
    };

    useEffect(() => () => { isMounted.current = false; }, []);

    return (
        <Container
            header={{
                title: `${t('自制卡片')}`,
                headerTitle: { showTitle: true },
                headerLeft: { onPress: navigation.goBack },
                headerRight: {},
            }}
        >
            <ScrollView ref={scrollviewRef} style={styles.container}>
                <CardImage />

                <TextInput
                    placeholder={`${t('添加卡片内容')}`}
                    placeholderTextColor={theme.secondary_variant}
                    style={[styles.textarea, {
                        color: theme.text_color, borderColor: theme.fill_disabled,
                        textAlignVertical: 'top', paddingVertical: theme.v_spacing_lg,
                        marginVertical: theme.v_spacing_2xl,
                    }]}
                    multiline={true}
                    numberOfLines={12}
                    maxLength={200}
                    clear={true}
                    value={content}
                    onChangeText={(text) => setContent(text)}
                    onFocus={handleTextInputFocus}
                />

                <Pressable hitSlop={10} onPress={() => setTagsModal(true)} style={styles.row}>
                    <Text style={{ color: theme.text_color }}>{t("标签")}</Text>
                    <View style={styles.text}>
                        {tags.length !== 0 && <Text style={{ color: theme.text_color }} numberOfLines={1}> {tags[0]} </Text>}
                        <AntDesign name="edit" size={theme.icon_size_xxs} color={theme.fill_mask} />
                    </View>
                </Pressable>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginVertical: theme.v_spacing_lg }}>
                    <SecondaryContainedButton
                        buttonFreeStyle={{ height: 40, width: 80, marginHorizontal: theme.h_spacing_sm }}
                        onPress={handleCardSubmit}
                        textFreeStyle={{ fontSize: theme.font_size_caption }}
                        buttonText={t('提交')}
                        loading={submitLoading}
                    />
                </View>
            </ScrollView>

            <SlideUpModal
                title={t("请选择标签")}
                onClose={() => setTagsModal(false)}
                visible={tagsModal}
                onOk={() => setTagsModal(false)}
                okTitle={t("确定")}
                disableOk={tags.length === 0}
            >
                <View style={styles.modalContainer}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                        {totalTags.map((tag) =>
                            <Chip
                                key={tag}
                                mode="outlined"
                                closeIcon="close"
                                onPress={() => {
                                    if (tag !== tags[0]) setTags([tag]);
                                    else setTags((prev) => prev.filter((t) => t !== tag));
                                }}
                                style={tag === tags[0]
                                    ? { fontSize: theme.font_size_base, backgroundColor: theme.primary_variant, margin: theme.v_spacing_xs }
                                    : { fontSize: theme.font_size_base, backgroundColor: theme.fill_base, margin: theme.v_spacing_xs }}
                                textStyle={tag === tags[0]
                                    ? { color: theme.fill_base }
                                    : { color: theme.secondary_variant }}
                            >{tag}</Chip>
                        )}
                    </View>

                    <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginVertical: theme.v_spacing_lg, }}>
                        <TextInput
                            style={{
                                borderWidth: 1, flex: 1, borderRadius: 10, borderColor: theme.fill_disabled,
                                padding: theme.v_spacing_sm, marginHorizontal: theme.h_spacing_sm,
                                height: 45, color: theme.text_color,
                            }}
                            placeholder={t("你的标签")}
                            placeholderTextColor={theme.secondary_variant}
                            value={addTag}
                            onChangeText={(text) => {
                                setAddTag(text);
                            }}
                            onSubmitEditing={({ nativeEvent: { text } }) => {
                                setAddTag('');
                                dispatch(configActions.addTags(addTag));
                            }}
                        />

                        <SecondaryContainedButton
                            buttonFreeStyle={{ height: 45, width: 80 }}
                            onPress={() => {
                                setAddTag('');
                                dispatch(configActions.addTags(addTag));
                            }}
                            textFreeStyle={{ fontSize: theme.font_size_base }}
                            disabled={addTag === ''}
                            buttonText={t('添加')}
                        />
                    </View>
                </View>
            </SlideUpModal>
        </Container>
    );
};

export default CardEdit;