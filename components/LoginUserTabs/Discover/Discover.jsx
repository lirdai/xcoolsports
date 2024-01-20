import React, { useRef, useState, useEffect, useContext } from 'react';
import { Pressable, View, Text, RefreshControl, StyleSheet, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { useScrollToTop } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { AntDesign } from '@expo/vector-icons'; 
import { MasonryFlashList } from "@shopify/flash-list";
import { useNetInfo } from "@react-native-community/netinfo";
import { useTranslation } from 'react-i18next';

import urlConstants from '@xcoolsports/constants/urls';
import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import Image from '@xcoolsports/components/utils/Image';
import Like from '@xcoolsports/components/Common/Buttons/Like';
import Container from '@xcoolsports/components/Common/Container';
import Empty from '@xcoolsports/components/Common/Pages/Empty';
import End from '@xcoolsports/components/Common/Pages/End';
import Loading from '@xcoolsports/components/Common/Pages/Loading';
import RenderError from '@xcoolsports/components/Common/Pages/RenderError';
import CustomErrorBoundary from '@xcoolsports/components/Common/Pages/CustomErrorBoundary';
import { api, selectTopicsByNew, selectCurrentUser } from '@xcoolsports/data';

const styles = StyleSheet.create({
    videoIcon: {
        position: 'absolute', 
        justifyContent: 'center', 
        alignItems: 'center', 
        right: 5, 
        top: 5, 
        zIndex: 20, 
        borderRadius: 100, 
    },
    avatarContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        flexShrink: 1,
    },
    avatar: {
        width: 16, 
        height: 16, 
        borderRadius: 100, 
    },
    nickname: {
        fontSize: theme.font_size_icontext, 
        paddingLeft: theme.h_spacing_md, 
        paddingRight: theme.h_spacing_xl,
    },
    shadow: {
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    },
    imageSmall: {
        width: "100%", 
        maxHeight: 250,
    },
    imageMedium: {
        width: "100%", 
        maxHeight: 350,
    },
    imageLarge: {
        width: "100%", 
        maxHeight: 450,
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

const Discover = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const windowWidth = Dimensions.get("window").width;
    const windowSize = getScreenSize(windowWidth);
    const ref = useRef(null);
    const netInfo = useNetInfo();
    const theme = useContext(ThemeContext);
    useScrollToTop(ref);

    const topics = useSelector(selectTopicsByNew);
    const currentUser = useSelector(selectCurrentUser);
    
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);

    const { data, isLoading, isFetching, error, isError, isUninitialized, refetch } = api.endpoints.getManyTopics
        .useQuery({ subcategory: "new", page }, { skip: !netInfo.isConnected || !hasNext });

    const fetchNextPage = () => {
        if (!isFetching && !isError && hasNext) {
            setPage((prev) => prev + 1);
        }
    }

    const handleRefresh = () => {
        if (!isFetching) {
            if (page !== 1) {
                setPage(1);
                setHasNext(true);
            } else if (!isUninitialized) {
                refetch();
            } 
        }
    }

    useEffect(() => {
        setPage(1);
        setHasNext(true);
        if (!isUninitialized) refetch();
    }, [currentUser.username]);

    useEffect(() => {
        if (data && !isFetching) setHasNext(data.hasNext);
    }, [data?.hasNext, isFetching]);

    const isEmpty = !isLoading && topics && topics.length === 0;

    return (
        <Container 
            header={{ 
                headerLeft: { headerLeftComponent: 
                    <Text style={{ color: theme.text_color, width: 120, fontSize: theme.font_size_xl, fontWeight: "bold", textAlign: 'center' }}>
                        {t('发现世界')}
                    </Text> 
                },
            }}
        >
            <Loading isLoading={isLoading} />
            <RenderError isError={!isLoading && isError} error={error} />
            <Empty isEmpty={isEmpty && !isError} />
            {(!isLoading && !isError && topics && !isEmpty) &&
                <CustomErrorBoundary>
                    <MasonryFlashList
                        showsVerticalScrollIndicator={false}
                        ref={ref}
                        estimatedItemSize={200}
                        refreshControl={
                            <RefreshControl
                                refreshing={isFetching && page === 1}
                                onRefresh={handleRefresh}
                            />
                        }
                        decelerationRate={'fast'}
                        onEndReached={fetchNextPage}
                        onEndReachedThreshold={0.5}
                        data={topics}
                        keyExtractor={item => item.id}
                        extraData={theme}
                        numColumns={2}
                        renderItem={({ item }) => {
                            return (
                                <View style={[{ width: "100%", padding: theme.v_spacing_sm }]}>
                                    <View style={[styles.shadow, {shadowColor: theme.secondary_color, backgroundColor: theme.fill_base, borderRadius: 10 }]}>
                                        <View style={[{ borderRadius: 10, overflow: 'hidden' }]}>
                                            {/* Display */}
                                            {item.multimedia && item.multimedia.length !== 0 && (
                                                <Pressable
                                                    style={({ pressed }) => [pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}
                                                    hitSlop={10}
                                                    onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                                                    onPress={() => navigation.push(`${t('看日记')}`, { topicId: item.id, eventId: item.event_id })}
                                                    android_ripple={{color: '', borderless: false, radius: 5, foreground: true}}
                                                >
                                                    {(item.multimedia[0].mediaType === 'videos')
                                                        ? <View style={{ position: 'relative' }}>
                                                            <View style={[styles.videoIcon, {backgroundColor: theme.fill_base}]}>
                                                                <AntDesign name="play" size={20} color={theme.secondary_variant} />
                                                            </View>

                                                            <Image 
                                                                containerStyle={windowSize.image}
                                                                isSelectedUploading={false}
                                                                editMode={false}
                                                                showloading
                                                                hasBorder
                                                                source={{ uri: `${urlConstants.videos}/${item.multimedia[0].url}/snapshot.jpg` }} 
                                                                resizeMode="cover"
                                                            />
                                                        </View>
                                                        : <Image 
                                                            containerStyle={windowSize.image}
                                                            isSelectedUploading={false}
                                                            editMode={false}
                                                            showloading
                                                            hasBorder
                                                            source={{ uri: `${urlConstants.images}/${item.multimedia[0].url}` }} 
                                                            resizeMode="cover"
                                                        />
                                                    }
                                                </Pressable>
                                            )}

                                            {/* Title */}
                                            <View style={[{ backgroundColor: theme.fill_base, padding: theme.v_spacing_sm }]}>
                                                <Text style={{ fontWeight: 'bold', paddingVertical: theme.v_spacing_xs, color: theme.text_color }}>{ item.title }</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.v_spacing_xs }}>
                                                    <Pressable 
                                                        hitSlop={15}
                                                        style={styles.avatarContainer}
                                                        onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                                                        onPress={() => {
                                                            item?.author?.username
                                                                ? navigation.push(`${t('看用户')}`, { usernameURL: item?.author?.username })
                                                                : null
                                                        }}
                                                    >
                                                        <Image 
                                                            containerStyle={styles.avatar}
                                                            isSelectedUploading={false}
                                                            editMode={false}
                                                            showloading={false}
                                                            source={item?.author?.avatar ? { uri :`${urlConstants.images}/${item?.author?.avatar}` } : require('@xcoolsports/static/avatar.jpg') }
                                                            resizeMode="cover" 
                                                        />
                                                        
                                                        <Text style={[styles.nickname, {color: theme.text_color}]}>{ item?.author?.nickname || `${t('用户不存在')}` }</Text>
                                                    </Pressable>

                                                    <Like topic={item} size={'small'} navigation={navigation} />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        }}
                        ListFooterComponent={isFetching ? <Loading isLoading={isFetching} style={{ justifyContent: 'flex-start' }} /> : <End />}
                    />
                </CustomErrorBoundary>
            }
        </Container>
    );
};

export default Discover;
