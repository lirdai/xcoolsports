import React, { useState, useEffect, useContext } from 'react';
import {
    ScrollView, View, Text, StyleSheet, Animated, Pressable, Dimensions, Modal,
} from 'react-native';
import { AntDesign, Ionicons, Entypo } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Chip } from 'react-native-paper';

import theme, { ThemeContext } from '@xcoolsports/constants/theme';
import Container from '@xcoolsports/components/Common/Container';
import CountdownTimer from '@xcoolsports/utils/CountdownTimer';
import Image from '@xcoolsports/components/utils/Image';
import SecondaryOutlinedButton from '@xcoolsports/components/utils/Buttons/SecondaryOutlinedButton';
import SecondaryContainedButton from '@xcoolsports/components/utils/Buttons/SecondaryContainedButton';
import urlConstants from '@xcoolsports/constants/urls';
import { api, selectAdventure, selectCurrentUser, configActions, selectLocation } from '@xcoolsports/data';
import distanceCalculation from '@xcoolsports/utils/distanceCalculation';

const styles = StyleSheet.create({
    container: {
        margin: theme.v_spacing_2xl,
    },
    shadow: {
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        elevation: 10,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 100,
    },
    heart: {
        position: 'absolute',
        bottom: 5,
        right: 20,
    },
    modalContainer: {
        marginVertical: theme.v_spacing_lg,
    },
});

const HeartbeatAnimation = () => {
    const { t, i18n } = useTranslation();
    const [scaleValue] = useState(new Animated.Value(1));
    const theme = useContext(ThemeContext);
    const adventure = useSelector(selectAdventure);
    const currentUser = useSelector(selectCurrentUser);
    const location = useSelector(selectLocation);
    const mates = adventure.author.filter((user) => user.username !== currentUser.username) || [];

    const [openCardModal, setOpenCardModal] = useState(false);

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(scaleValue, {
                    toValue: 0.6,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();

        return () => {
            animation.stop();
        };
    }, [scaleValue]);

    const heartStyle = {
        transform: [{ scale: scaleValue }],
    };

    return (
        <View>
            <Pressable
                style={{ width: 100, justifyContent: 'center', alignItems: 'center' }}
                onPress={() => setOpenCardModal(true)}
            >
                <Image
                    containerStyle={[styles.shadow, styles.avatar]}
                    isSelectedUploading={false}
                    editMode={false}
                    showloading={false}
                    source={mates[0].avatar ? { uri: `${urlConstants.images}/${mates[0].avatar}` } : require('@xcoolsports/static/avatar.jpg')}
                    resizeMode="cover"
                />

                <Animated.View style={[styles.heart, heartStyle]}>
                    <AntDesign name="heart" size={theme.icon_size_xxs} color={theme.brand_error} />
                </Animated.View>
            </Pressable>

            <Modal
                presentationStyle='fullScreen'
                visible={openCardModal}
                onRequestClose={() => setOpenCardModal(false)}
            >
                <Pressable
                    onPress={() => setOpenCardModal(false)}
                    style={{ backgroundColor: theme.black_icon, flex: 1, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Image
                        containerStyle={[{ height: Dimensions.get('window').height * 0.9, width: Dimensions.get('window').width* 0.95 }]}
                        isSelectedUploading={false}
                        editMode={false}
                        showloading
                        source={mates[0].avatar ? { uri: `${urlConstants.images}/${mates[0].avatar}` } : require('@xcoolsports/static/avatar.jpg')}
                        resizeMode="cover"
                    />

                    <View style={{ position: 'absolute', bottom: '10%', left: "10%", right: '10%', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: theme.radius_lg, padding: theme.v_spacing_xs }}>
                        {mates[0].nickname && <Text style={{ color: theme.text_color, marginVertical: theme.v_spacing_xs }}>{mates[0].nickname}</Text>}

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: theme.v_spacing_xs, }}>
                            {mates[0].gender === '女' && <Text style={{ color: theme.text_color }}>{mates[0].gender === "女" && <Ionicons name="female" size={20} color={theme.brand_error} />}</Text>}
                            {mates[0].gender === '男' && <Text style={{ color: theme.text_color }}>{mates[0].gender === "男" && <Ionicons name="male" size={20} color={theme.brand_primary} />}</Text>}
                            {mates[0].horoscope !== 0 && <Text style={{ color: theme.text_color, marginHorizontal: theme.v_spacing_xs }}>{mates[0].horoscope}</Text>}
                            {mates[0].birthday !== 0 && <Text style={{ color: theme.text_color, marginHorizontal: theme.v_spacing_xs }}>{mates[0].birthday}</Text>}
                        </View>

                        {mates[0].bio && <Text style={{ color: theme.text_color, marginVertical: theme.v_spacing_xs }}>{mates[0].bio}</Text>}

                        {(mates[0].coordinate && location.user_current_coordinate) &&
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: theme.v_spacing_xs }}>
                                <Entypo name="location-pin" size={20} color={theme.secondary_color} />
                                <Text style={{ color: theme.text_color, fontWeight: 'bold', marginHorizontal: theme.v_spacing_xs }}>{t('距离你')} {distanceCalculation(mates[0].coordinate.split(",")[1], mates[0].coordinate.split(",")[0], location.user_current_coordinate.latitude, location.user_current_coordinate.longitude)} km</Text>
                            </View>
                        }

                        {mates[0].tags !== 0 &&
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                                {mates[0].tags.map((tag) =>
                                    <Chip
                                        key={tag}
                                        mode="outlined"
                                        style={{ fontSize: theme.font_size_base, backgroundColor: theme.fill_base, margin: theme.v_spacing_xs, borderColor: theme.fill_base }}
                                        textStyle={{ color: theme.secondary_variant }}
                                    >{tag}</Chip>
                                )}
                            </View>
                        }
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const MateMatch = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const currentUtcTime = new Date();
    const currentUtcTimestamp = currentUtcTime.getTime() - currentUtcTime.getTimezoneOffset() * 60000;
    const futureTime = new Date(currentUtcTimestamp + 60 * 0.5 * 60 * 1000);
    const theme = useContext(ThemeContext);
    const adventure = useSelector(selectAdventure);
    const currentUser = useSelector(selectCurrentUser);

    const [updateAdventureStatus] = api.endpoints.updateAdventureStatus.useMutation();
    const [quitAdventureStatus] = api.endpoints.quitAdventureStatus.useMutation();

    return (
        <Container
            header={{
                title: `${t('匹配伙伴')}`,
                headerTitle: { showTitle: true },
            }}
        >
            <ScrollView style={styles.container}>
                <Text style={{ fontWeight: 'bold', fontSize: theme.font_size_heading, color: theme.text_color }}>{t('匹配到')}</Text>

                {/* Avatar */}
                <View style={{
                    marginVertical: theme.v_spacing_xl,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                }}>
                    <HeartbeatAnimation />
                </View>

                {/* Rule */}
                <View style={[styles.shadow,
                { borderRadius: theme.radius_lg, marginVertical: theme.v_spacing_xl, padding: theme.h_spacing_lg },
                { shadowColor: theme.secondary_color, backgroundColor: theme.fill_base }]}
                >
                    <Text style={{ color: theme.text_color, alignSelf: 'center', fontWeight: 'bold', fontSize: theme.font_size_caption, marginVertical: theme.v_spacing_sm }}>{t('游戏规则介绍')}</Text>
                    <Text style={{ color: theme.text_color }}>
                        {t('在推荐匹配后, 每个人有三十分钟考虑时间。三十分钟后, 如果有任意一人没有回应或者直接拒绝, 则算作匹配失败。我们将给每个人进行下一次的匹配。如果所有人全部接受, 则算作匹配成功。系统自动互关彼此好友，可以一起开启城市冒险计划')}...
                    </Text>
                </View>

                {/* Countdown TImer */}
                <View style={{ marginTop: theme.v_spacing_xl }}>
                    <CountdownTimer eventDate={futureTime} orderStatus={'已确认'} eventTitle={'剩余可确定时间, 超出时间将取消'} />
                </View>

                {/* Button */}
                <View style={{ marginVertical: theme.v_spacing_2xl, height: 100, justifyContent: 'space-between' }}>
                    <SecondaryOutlinedButton
                        buttonFreeStyle={{ height: 50, marginVertical: theme.v_spacing_lg }}
                        textFreeStyle={{ fontSize: theme.font_size_caption }}
                        onPress={() => {
                            quitAdventureStatus({ adventure_id: adventure.id, body: { status: '已取消' } });
                            dispatch(configActions.updateAdventure(undefined));
                        }}
                        buttonText={t('残忍拒绝')}
                    />

                    <SecondaryContainedButton
                        buttonFreeStyle={{ height: 50 }}
                        textFreeStyle={{ fontSize: theme.font_size_caption }}
                        onPress={() => {
                            updateAdventureStatus({ match_id: adventure.author.find((user) => user.username === currentUser.username).adventure_match_id, body: { accepted: true } });
                        }}
                        buttonText={adventure.author.find((user) => user.username === currentUser.username).is_adventure_accepted ? t('等待对方接受') : t('开心接受')}
                    />
                </View>
            </ScrollView>
        </Container>
    );
};

export default MateMatch;