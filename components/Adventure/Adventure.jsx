import React, { useRef, useState, useEffect, useContext } from 'react';
import { Pressable, ScrollView, View, Text, StyleSheet, Dimensions, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';

import theme, { ThemeContext } from '@xcoolsports/constants/theme';
import Container from '@xcoolsports/components/Common/Container';
import CardImage from '@xcoolsports/components/utils/CardImage';
import Image from '@xcoolsports/components/utils/Image';
import PopUpModal from '@xcoolsports/components/utils/PopUpModal';
import { api, configActions, selectAdventure, selectCurrentUser } from '@xcoolsports/data';
import FlipCard from '@xcoolsports/components/utils/AnimationComponents/FlipCard';
import HeartFallenAnimation from '@xcoolsports/components/utils/AnimationComponents/HeartFallenAnimation';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: theme.v_spacing_lg,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 100,
    },
    shadow: {
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
        borderRadius: 10
    },
    imageSmall: {
        width: "100%",
        height: 250,
    },
    imageMedium: {
        width: "100%",
        height: 350,
    },
    imageLarge: {
        width: "100%",
        height: 450,
    },
    modalContainer: {
        margin: theme.v_spacing_lg,
    },
    modalTitle: {
        fontSize: theme.font_size_xl,
        paddingVertical: theme.v_spacing_sm,
    },
    modalSmallTitle: {
        fontSize: theme.font_size_heading,
        paddingVertical: theme.v_spacing_sm,
    },
    modalContent: {
        flexDirection: 'row',
        justifyContent: "flex-end",
        marginTop: theme.v_spacing_xl,
    },
    modalButton: {
        marginHorizontal: theme.h_spacing_xl
    },
    modalText: {
        fontSize: theme.font_size_heading
    },
});

const getScreenSize = (windowWidth) => {
    if (windowWidth < 639) {
        return {
            'image': styles.imageSmall,
        }
    }

    if (windowWidth < 767) {
        return {
            'image': styles.imageMedium,
        }
    }

    return {
        'image': styles.imageLarge,
    }
};

const Adventure = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const windowWidth = Dimensions.get("window").width;
    const windowSize = getScreenSize(windowWidth);
    const dispatch = useDispatch()
    const isMounted = useRef(true);
    const theme = useContext(ThemeContext);
    const adventure = useSelector(selectAdventure);
    const currentUser = useSelector(selectCurrentUser);
    const mates = adventure.author.filter((user) => user.username !== currentUser.username) || [];

    const [cardSelected, setCardSelected] = useState();
    const [imageModal, setImageModal] = useState(false);
    const [submitModal, setSubmitModal] = useState(false);
    const [heartFallenAnimation, setHeartFallenAnimation] = useState(false);
    const [quitModal, setQuitModal] = useState(false);

    const [quitAdventureStatus] = api.endpoints.quitAdventureStatus.useMutation();

    useEffect(() => {
        setImageModal(false);
        if (adventure.cards.filter((card) => card.is_completed).length === 10) {
            setSubmitModal(true);
            setHeartFallenAnimation(true);
        }
    }, [adventure.cards.filter((card) => card.is_completed).length]);

    useEffect(() => () => { isMounted.current = false; }, []);

    const title = adventure.cards.filter((card) => card.is_completed).length === 0
        ? `${t('冒险起来吧')}`
        : `${t('完成度')} ${adventure.cards.filter((card) => card.is_completed).length / adventure.cards.length * 100} ${'%'}`

    return (
        <Container
            header={{
                title,
                headerTitle: { showTitle: true },
                headerLeft: {
                    headerLeftComponent:
                        <Pressable
                            hitSlop={10}
                            style={{ width: 80, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
                            onPress={() => {
                                setQuitModal(true);
                            }}
                        >
                            <Text style={{ color: theme.text_color }}>{t('放弃')}</Text>
                        </Pressable>
                },
                headerRight: {
                    headerRightComponent:
                        <Pressable
                            hitSlop={10}
                            style={{ width: 80, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
                            onPress={() => navigation.navigate(`${t('私信')}`, { usernameURL: mates[0].username })}
                        >
                            <Text style={{ color: theme.text_color }}>{t('私信')}</Text>
                        </Pressable>
                },
            }}
        >
            <ScrollView style={styles.container}>
                {heartFallenAnimation && <HeartFallenAnimation />}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                    {adventure.cards.map((card) =>
                        <Pressable
                            key={card.id}
                            style={{ width: '45%', margin: '2%' }}
                            onPress={() => {
                                setImageModal(true);
                                setCardSelected(card);
                            }}
                        >
                            {card.is_flipped
                                ? <CardImage id={card.id} />
                                : <Image
                                    containerStyle={windowSize.image}
                                    isSelectedUploading={false}
                                    editMode={false}
                                    showloading
                                    source={require('@xcoolsports/static/question.png')}
                                    resizeMode="cover"
                                />
                            }
                        </Pressable>
                    )}
                </View>
            </ScrollView>

            <PopUpModal
                title={t("退出放弃")}
                onClose={() => setQuitModal(false)}
                visible={quitModal}
            >
                <View style={styles.modalContainer}>
                    <Text style={[styles.modalContent, { color: theme.text_color }]}>{t("确定退出放弃本次匹配么")}? </Text>
                    <View style={styles.modalContent}>
                        <Pressable hitSlop={10} style={styles.modalButton} onPress={() => setQuitModal(false)}>
                            <Text style={[styles.modalText, { color: theme.text_color }]}>{t("取消")}</Text>
                        </Pressable>

                        <Pressable
                            hitSlop={10}
                            style={styles.modalButton}
                            onPress={() => {
                                setQuitModal(false);
                                quitAdventureStatus({ adventure_id: adventure.id, body: { status: '已取消' } });
                                dispatch(configActions.updateAdventure(undefined));
                            }}
                        >
                            <Text style={[styles.modalText, { color: theme.text_color }]}>{t("确定")}</Text>
                        </Pressable>
                    </View>
                </View>
            </PopUpModal>

            <PopUpModal
                title={t("冒险通关啦")}
                onClose={() => setSubmitModal(false)}
                visible={submitModal}
            >
                <View style={styles.modalContainer}>
                    <Text style={[styles.modalContent, { color: theme.text_color }]}>{t("发一个帖子记录这次美好的体验吧")}</Text>
                    <View style={styles.modalContent}>
                        <Pressable hitSlop={10} style={styles.modalButton} onPress={() => {
                            quitAdventureStatus({ adventure_id: adventure.id, body: { status: '冒险结束' } });
                            dispatch(configActions.updateAdventure(undefined));
                            dispatch(configActions.deleteAdventure());
                            setSubmitModal(false);
                        }}>
                            <Text style={[styles.modalText, { color: theme.text_color }]}>{t("不必了")}</Text>
                        </Pressable>

                        <Pressable
                            hitSlop={10}
                            style={styles.modalButton}
                            onPress={() => {
                                quitAdventureStatus({ adventure_id: adventure.id, body: { status: '冒险结束' } });
                                dispatch(configActions.updateAdventure(undefined));
                                dispatch(configActions.deleteAdventure());
                                setSubmitModal(false);
                                navigation.navigate(`${t('写日记')}`);
                            }}
                        >
                            <Text style={[styles.modalText, { color: theme.text_color }]}>{t("好的")}</Text>
                        </Pressable>
                    </View>
                </View>
            </PopUpModal>

            <Modal
                presentationStyle='fullScreen'
                onRequestClose={() => setImageModal(false)}
                visible={imageModal}
            >
                <Pressable
                    onPress={() => setImageModal(false)}
                    style={{ backgroundColor: theme.black_icon, flex: 1, justifyContent: 'center', alignItems: 'center' }}
                >
                    <FlipCard
                        cardIsFlipped={cardSelected?.is_flipped}
                        notFlippedSide={<CardImage id={cardSelected?.id} />}
                        flippedSide={
                            <Image
                                containerStyle={windowSize.image}
                                isSelectedUploading={false}
                                editMode={false}
                                showloading
                                source={require('@xcoolsports/static/question.png')}
                                resizeMode="cover"
                            />
                        }
                        startFlipMotion={() => dispatch(configActions.updateCardFlipped({
                            ...cardSelected,
                            is_flipped: true,
                        }))}
                    />

                    <View style={{ position: 'absolute', bottom: '15%', left: "10%", right: '10%', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: theme.radius_lg, padding: theme.v_spacing_xs }}>
                        <Text style={{ color: theme.text_color }}>{cardSelected?.text}</Text>

                        {cardSelected?.is_completed
                            ?
                            <View style={{ alignItems: 'flex-end' }}>
                                <AntDesign name="checkcircle" size={20} color={theme.brand_success} />
                            </View>
                            :
                            <Pressable
                                hitSlop={50}
                                style={{ alignItems: 'flex-end' }}
                                onPress={() => dispatch(configActions.updateCardComepleted({
                                    ...cardSelected,
                                    is_completed: true,
                                }))}
                            >
                                <Text style={{ color: theme.brand_error }}>点击完成?</Text>
                            </Pressable>
                        }
                    </View>
                </Pressable>
            </Modal>
        </Container>
    );
};

export default Adventure;