import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, StyleSheet, Text, Pressable, FlatList, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';
import { FontAwesome, AntDesign } from '@expo/vector-icons'; 
import { useTranslation } from 'react-i18next';

import Loading from '@xcoolsports/components/Common/Pages/Loading';
import End from '@xcoolsports/components/Common/Pages/End';
import Empty from '@xcoolsports/components/Common/Pages/Empty';
import urlConstants from '@xcoolsports/constants/urls';
import Image from '@xcoolsports/components/utils/Image';
import Like from '@xcoolsports/components/Common/Buttons/Like';
import Header from '@xcoolsports/components/Search/Header';
import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import Container from '@xcoolsports/components/Common/Container';
import ScrollSelector from '@xcoolsports/components/utils/ScrollSelector';
import RenderError from '@xcoolsports/components/Common/Pages/RenderError';
import { 
    api, selectManyTopicsById, selectManyUsersByUsername, 
    selectCurrentUser, toastActions, toastTypes 
} from '@xcoolsports/data';

const styles = StyleSheet.create({
    button: { 
        width: 50, 
        alignItems: 'center' 
    },
    box: {
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: theme.h_spacing_xl,
        borderBottomWidth: 1,
        width: "100%", 
        height: 100,
    },
    title: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: "center", 
        position: 'relative',
    },
    titleText: {
        flex: 1, 
        flexDirection: 'column', 
        paddingLeft: theme.h_spacing_sm,
    },
    avatarUser: {
        height: 50,
        width: 50,
        borderRadius: 100,
    },
    avatarCheck: {
        position: 'absolute', 
        bottom: 0, 
        left: 30,
    },
    follow: {
        height: 30,
        borderWidth: 1,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.h_spacing_md,
    },
    videoIcon: {
        position: 'absolute', 
        justifyContent: 'center', 
        alignItems: 'center', 
        right: 5, 
        top: 5, 
        zIndex: 20, 
        borderRadius: 100, 
    },
    imageSmall: {
        width: "100%", 
        height: 200,
    },
    imageMedium: {
        width: "100%", 
        height: 300,
    },
    imageLarge: {
        width: "100%", 
        height: 400,
    },
    card: {
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
        paddingBottom: 3,
        paddingHorizontal: theme.v_spacing_md,
    },
    cardTitle: {
        fontWeight: 'bold', 
        paddingVertical: theme.v_spacing_xs,
    },
    cardBody: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        paddingVertical: theme.v_spacing_xs,
    },
    cardAvatar: { 
        width: 16, 
        height: 16, 
        borderRadius: 100 
    },
    cardText: {
        fontSize: theme.font_size_icontext, 
        paddingLeft: theme.h_spacing_md, 
        paddingRight: theme.h_spacing_xl,
    },
    cardContent: {
        flexDirection: 'row', 
        alignItems: 'center', 
        flexShrink: 1,
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

const Search = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const page = useRef(1);
    const hasNext = useRef(true);
    const currentUser = useSelector(selectCurrentUser);
    const theme = useContext(ThemeContext);
    const dispatch = useDispatch();
    const windowWidth = Dimensions.get("window").width;
    const windowSize = getScreenSize(windowWidth);

    const [resultIds, setResultIds] = useState([]);
    const [keyword, setKeyword] = useState('');
	const [tabRoute, setTabRoute] = useState('users');

    const [getManySearches, resultIsData] = api.endpoints.getManySearches.useLazyQuery();
    const [updateFollow] = api.endpoints.updateFollow.useMutation();

    const handleFollow = async (person) => {
        const newFollow = { 
            followee: person.username, 
            i_follow: 1 - person.i_follow,
        };
      
        await updateFollow(newFollow);
    };

    const query = {
		users: getManySearches,
		topics: getManySearches,
	}

	const result = {
		users: resultIsData,
		topics: resultIsData,
	}

    const results = {
        'users': useSelector((state) => selectManyUsersByUsername(state, resultIds)),
        'topics': useSelector((state) => selectManyTopicsById(state, resultIds)),
    };
    
	const fetchData = async () => {
        if (keyword === '') return;
        const response = await query[tabRoute]({ searchTab: tabRoute, keyword, page: 1 });

        if (tabRoute === 'users') {
            const data = response?.data?.users || [];
            setResultIds(data.map((r) => r.username));
        } else if (tabRoute === 'topics') {
            const data = response?.data?.topics || [];
            setResultIds(data.map((r) => r.id));
        }
        
        page.current = 1;
        hasNext.current = response?.data?.hasNext;
    };

    const fetchNextPage = async () => {
        if (hasNext.current) {
            const response = await query[tabRoute]({ searchTab: tabRoute, keyword, page: page.current + 1 });

            if (tabRoute === 'users') {
                const data = response?.data?.users || [];
                setResultIds((prev) => prev.concat(data.map((r) => r.username)));
            } else if (tabRoute === 'topics') {
                const data = response?.data?.topics || [];
                setResultIds((prev) => prev.concat(data.map((r) => r.id)));
            }

            page.current ++;
            hasNext.current = response?.data?.hasNext;
        }
    };

    useEffect(() => { 
        fetchData();
    }, [tabRoute]);

    const isEmpty = !result[tabRoute].isLoading && results[tabRoute].length === 0;

    return (
        <Container
            header={{
                title: `${t('搜索')}`,
                headerLeft: { onPress: navigation.goBack },
                headerTitle: {headerTitleComponent: <Header keyword={keyword} setKeyword={setKeyword} fetchData={fetchData} />},
                headerRight: {headerRightComponent:           
                    <Pressable hitSlop={10} style={styles.button} onPress={fetchData}>
                        <Text style={{ color: theme.text_color, fontSize: theme.font_size_caption_sm, fontWeight: 'bold' }}>{t('搜索')}</Text>
                    </Pressable>}
            }}
        >
            <ScrollSelector
                items={[
                    {key: 'users', value: `${t('用户')}`, onSelect: () => {setTabRoute('users')}},
                    {key: 'topics', value: `${t('帖子')}`, onSelect: () => {setTabRoute('topics')}},
                ]}
                selected={tabRoute}
            />
            <Loading isLoading={result[tabRoute].isLoading} />
            <RenderError isError={!result[tabRoute].isLoading && result[tabRoute].isError} error={result[tabRoute]?.error?.status} />
            <Empty isEmpty={isEmpty && !result[tabRoute].isError} />
            {(!result[tabRoute].isLoading && !result[tabRoute].isError && !isEmpty && results[tabRoute].length !== 0) &&
            <FlatList
                decelerationRate={'fast'}
                onEndReached={fetchNextPage}
                onEndReachedThreshold={0.5}
                data={results[tabRoute]}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                    if (tabRoute === 'users') {
                        return (
                            <Pressable
                                style={({ pressed }) => [styles.box, {borderBottomColor: theme.fill_placeholder}, pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}
                                onPress={() => {
                                    item?.username 
                                    ? navigation.push(`${t('看用户')}`, { usernameURL: item.username })
                                    : null
                                }}
                                onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                            >
                                <View style={styles.title}>
                                    <Image 
                                        containerStyle={styles.avatarUser} 
                                        isSelectedUploading={false}
                                        editMode={false}
                                        showloading={false}
                                        source={item.avatar ? { uri :`${urlConstants.images}/${item.avatar}` } : require('@xcoolsports/static/avatar.jpg')}
                                        resizeMode="cover"
                                    />

                                    {item.is_certification_verified && 
                                    <FontAwesome style={styles.avatarCheck} name="check-circle" color={theme.brand_important} size={theme.icon_size_xxs} />}        

                                    <View style={styles.titleText}>
                                        <Text style={{color: theme.text_color}} numberOfLines={1}> {item.nickname} </Text>
                                        <Text style={{color: theme.text_color}} numberOfLines={1}> {t('粉丝数')}: {item.num_followers} </Text>
                                        {item.is_certification_verified 
                                            ? <Text style={{color: theme.text_color}} numberOfLines={1}> {item.certification} </Text>
                                            : <Text style={{color: theme.text_color}} numberOfLines={1}> {t('顽酷号')}: {item.username} </Text>}
                                    </View>
                                </View>
        
                                {item.username && currentUser.username && item.username !== currentUser.username && 
                                <Pressable
                                    style={[styles.follow, {borderColor: theme.fill_disabled}]}
                                    onPress={() => {
                                        if (!currentUser.is_verified) {
                                            navigation.navigate(`${t("输入手机号")}`, { verificationType: "VERIFYPHONE" });
                                            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '记得要验证手机号哦:' }));
                                            return;
                                          } else if (currentUser.is_banned.users) {
                                            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '账号被封, 请耐心等待:' }));
                                            return;
                                          }
                        
                                          handleFollow(item);
                                          return;
                                    }}
                                    onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                                >
                                    { item.i_follow === 0 && item.follow_me === 0 && <Text style={{ fontSize: theme.font_size_caption_sm, color: theme.text_color }}>{t('关注TA')}</Text> }
                                    { item.i_follow === 0 && item.follow_me === 1 && <Text style={{ fontSize: theme.font_size_caption_sm, color: theme.text_color }}>{t('回关')}</Text> }
                                    { item.i_follow === 1 && item.follow_me === 0 && <Text style={{ fontSize: theme.font_size_caption_sm, color: theme.text_color }}>{t('已关注')}</Text> }
                                    { item.i_follow === 1 && item.follow_me === 1 && <Text style={{ fontSize: theme.font_size_caption_sm, color: theme.text_color }}>{t('互相关注')}</Text> }
                                </Pressable>}
                            </Pressable>
                        )
                    }

                    if (tabRoute === 'topics' && item.multimedia) {
                        return (
                            <View key={item.id} style={{ height: windowSize.image.height + 60, backgroundColor: theme.fill_placeholder }}>
                                {/* Display */}
                                {item.multimedia.length !== 0 && (
                                    <Pressable
                                        hitSlop={10}
                                        onPress={() => navigation.push(`${t('看日记')}`, { topicId: item.id, eventId: item.event_id })}
                                        style={({ pressed }) => pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}}
                                        onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
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
                                                    source={{ uri: `${urlConstants.videos}/${item.multimedia[0].url}/snapshot.jpg` }} 
                                                    resizeMode="cover"
                                                />
                                            </View>
                                            : <Image 
                                                containerStyle={windowSize.image}
                                                isSelectedUploading={false}
                                                editMode={false}
                                                showloading
                                                source={{ uri: `${urlConstants.images}/${item.multimedia[0].url}` }} 
                                                resizeMode="cover"
                                            />
                                        }
                                    </Pressable>
                                )}

                                {/* Title */}
                                <View style={[styles.card, {backgroundColor: theme.fill_base, shadowColor: theme.secondary_color}]}>
                                    <Text style={[styles.cardTitle, {color: theme.text_color}]} numberOfLines={1}>{ item.title }</Text>
                                    <View style={styles.cardBody}>
                                        <Pressable 
                                            hitSlop={10}
                                            style={styles.cardContent}
                                            onPress={() => {
                                                item?.author?.username
                                                ? navigation.push(`${t('看用户')}`, { usernameURL: item.author.username })
                                                : null
                                            }}
                                            onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                                        >
                                            <Image 
                                                containerStyle={styles.cardAvatar}
                                                isSelectedUploading={false}
                                                editMode={false}
                                                showloading={false}
                                                source={item?.author?.avatar ? { uri :`${urlConstants.images}/${item.author.avatar}` } : require('@xcoolsports/static/avatar.jpg')}
                                                resizeMode="cover" 
                                            />
                                            <Text style={[styles.cardText, {color: theme.text_color}]} numberOfLines={2}>{ item?.author?.nickname || `${t('用户不存在')}` }</Text>
                                        </Pressable>

                                        <Like topic={item} size={'small'} />
                                    </View>
                                </View>
                            </View>
                        )
                    }  
                }}
                ListFooterComponent={result[tabRoute].isFetching ? <Loading isLoading={result[tabRoute].isFetching} style={{ justifyContent: 'flex-start' }} /> : <End />}
			/>}
        </Container>
    )
};

export default Search;
