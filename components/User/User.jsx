import React, { useState, useRef, useEffect, useContext } from 'react';
import { Text, Pressable, Dimensions, Modal, View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { AntDesign } from '@expo/vector-icons'; 
import * as Haptics from 'expo-haptics';
import { useScrollToTop } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'

import ScrollSelector from '@xcoolsports/components/utils/ScrollSelector';
import SlideUpModal from '@xcoolsports/components/utils/SlideUpModal';
import UserMenu from '@xcoolsports/components/User/UserMenu';
import urlConstants from '@xcoolsports/constants/urls';
import { ThemeContext } from '@xcoolsports/constants/theme';
import Image from '@xcoolsports/components/utils/Image';
import UserIcons from '@xcoolsports/components/User/UserIcons';
import UserBio from '@xcoolsports/components/User/UserBio';
import UserBar from '@xcoolsports/components/User/UserBar';
import UserFollow from '@xcoolsports/components/User/UserFollow';
import Container from '@xcoolsports/components/Common/Container';
import styles from '@xcoolsports/components/User/style';
import Loading from '@xcoolsports/components/Common/Pages/Loading';
import End from '@xcoolsports/components/Common/Pages/End';
import Empty from '@xcoolsports/components/Common/Pages/Empty';
import RenderError from '@xcoolsports/components/Common/Pages/RenderError';
import { api, selectUserByUsername, selectManyTopicsById, selectCurrentUser } from '@xcoolsports/data';

const getScreenSize = (windowWidth) => {
	if (windowWidth < 639) {
		return {
			'background': styles.backgroundSmall,
			'avatar': styles.avatarSmall,
		}
	}

	if (windowWidth < 767) {
		return {
			'background': styles.backgroundMedium,
			'avatar': styles.avatarMedium,
		}
	}

	return {
		'background': styles.backgroundLarge,
		'avatar': styles.avatarLarge,
	}
};

const User = ({ route, navigation }) => {
	const { t, i18n } = useTranslation();
	const { usernameURL, me } = route.params;
	const page = useRef(1);
    const hasNext = useRef(true);
	const ref = useRef(null);
	const theme = useContext(ThemeContext);
    useScrollToTop(ref);

	const { error, isLoading, isError } = api.endpoints.getUserProfile.useQuery({ username: usernameURL }, { skip: usernameURL === undefined });
	const [getAllPostsByUser, resultByUser] = api.endpoints.getAllPostsByUser.useLazyQuery();
    const [getAllPostsByLikes, resultByLikes] = api.endpoints.getAllPostsByLikes.useLazyQuery();
    const [getAllPostsBySaves, resultBySaves] = api.endpoints.getAllPostsBySaves.useLazyQuery();

	const query = {
		me: ({ username, page }) => getAllPostsByUser({ username, page, postPublic: 'True' }),
		private: ({ username, page }) => getAllPostsByUser({ username, page, postPublic: 'False' }),
		likes: getAllPostsByLikes,
		saves: getAllPostsBySaves,
	}

	const result = {
		me: resultByUser,
		private: resultByUser,
		likes: resultByLikes,
		saves: resultBySaves,
	}

	const [avatar, setAvatar] = useState({});
	const [openAvatarModal, setOpenAvatarModal] = useState(false);
	const [openSetttingModal, setOpenSettingModal] = useState(false);
	const [topicIds, setTopicIds] = useState([]);
	const [tabRoute, setTabRoute] = useState('me');

	const topics = useSelector((state) => selectManyTopicsById(state, topicIds));
	const selectedUser = useSelector((state) => selectUserByUsername(state, usernameURL));
	const currentUser = useSelector(selectCurrentUser);

	const fetchData = async () => {
        const response = await query[tabRoute]({ username: selectedUser.username, page: 1 });
		const topics = response?.data?.topics || [];
        setTopicIds(topics.map((r) => r.id));
        page.current = 1;
        hasNext.current = response?.data?.hasNext;
    };

    const fetchNextPage = async () => {
        if (hasNext.current && selectedUser?.username) {
            const response = await query[tabRoute]({ username: selectedUser.username, page: page.current + 1 });
			const topics = response?.data?.topics || [];
            setTopicIds((prev) => prev.concat(topics.map((r) => r.id)));
            page.current ++;
            hasNext.current = response?.data?.hasNext;
        }
    };

    useEffect(() => { 
        if (selectedUser?.username) fetchData(); // todo: 这里tabRoute是closure
    }, [selectedUser?.username, tabRoute]);

	const windowWidth = Dimensions.get("window");
	const windowSize = getScreenSize(windowWidth);
	const isEmpty = !result[tabRoute].isLoading && topics?.length === 0;

	return (
		<Container
			header={{
				hidden: !isError,
				headerLeft: (isLoading || isError) && {onPress: navigation.goBack},
			}}
		>
			<Loading isLoading={isLoading} />
			<RenderError isError={!isLoading && isError} error={error} />
			{(!isLoading && !isError && selectedUser && topics) &&
				<FlatList
					showsVerticalScrollIndicator={false}
					ref={ref}
					decelerationRate={'fast'}
					onEndReached={fetchNextPage}
					onEndReachedThreshold={0.5}
					ListHeaderComponent={
						<View>
							{/* Background */}
							{selectedUser.background_image
								?
								<Image
									containerStyle={windowSize.background} 
									isSelectedUploading={false}
									editMode={false}
									showloading
									source={{ uri: `${urlConstants.images}/${selectedUser.background_image}` }}
									resizeMode="cover"
								/>
								:
								<View
									style={[{
										...windowSize.background,
										backgroundColor: theme.fill_placeholder,
										justifyContent: 'center', alignItems: 'center',
									}]}
								>
									<Text style={[{ color: theme.text_color, fontWeight: 'bold' }]}>{t('背景照片可以让个人主页更漂亮哦')}</Text>
								</View>
							}
							<UserIcons selectedUser={selectedUser} navigation={navigation} setOpenSettingModal={setOpenSettingModal} />
							<UserBar selectedUser={selectedUser} navigation={navigation}>
								{/* Avatar */}
								<View style={[windowSize.avatar, {borderColor: theme.fill_base}]}>
									<Pressable onPress={() => { setAvatar(selectedUser.avatar); setOpenAvatarModal(true); }}>
										<Image
											isSelectedUploading={false}
											editMode={false}
											showloading={false}
											source={selectedUser.avatar ? { uri: `${urlConstants.images}/${selectedUser.avatar}` } : require('@xcoolsports/static/avatar.jpg')}
											resizeMode="cover"
										/>
									</Pressable>
								</View>
							</UserBar>
							<UserBio selectedUser={selectedUser} />
							<UserFollow selectedUser={selectedUser} navigation={navigation} />
							{selectedUser.username && currentUser.username && selectedUser.username === currentUser.username && 
							<ScrollSelector
								items={[
									{key: 'me', value: `${t('公开')}`, onSelect: () => {setTabRoute('me')}},
									{key: 'private', value: `${t('私密')}`, onSelect: () => {setTabRoute('private')}},
									{key: 'likes', value: `${t('喜欢')}`, onSelect: () => {setTabRoute('likes')}},
									{key: 'saves', value: `${t('收藏')}`, onSelect: () => {setTabRoute('saves')}},
								]}
								selected={tabRoute}
							/>}
						</View>
					}
					data={topics}
					keyExtractor={item => item.id}
					numColumns={3}
					renderItem={post => {
						return (
							<Pressable
								style={({ pressed }) => [styles.imageContainer, pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}
								hitSlop={10}
								key={post.item.id}
								onPress={() => navigation.push(`${t('看日记')}`, { topicId: post.item.id, eventId: post.item.event_id })}
								onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
								android_ripple={{ color: '', borderless: false, radius: 5, foreground: true }}
							>
								{post.item.multimedia[0].mediaType === 'videos'
									?
									<View tyle={{ position: 'relative' }}>
										<View style={[styles.videoIcon, {backgroundColor: theme.fill_base}]}>
											<AntDesign name="play" size={20} color={theme.secondary_variant} />
										</View>

										<Image 
											containerStyle={styles.image}
											isSelectedUploading={false}
											editMode={false}
											showloading
											source={{ uri: `${urlConstants.videos}/${post.item.multimedia[0].url}/snapshot.jpg` }}
											resizeMode="cover"
										/>
									</View> 
									: 
									<Image 
										containerStyle={styles.image}
										isSelectedUploading={false}
										editMode={false}
										showloading
										source={{ uri: `${urlConstants.images}/${post.item.multimedia[0].url}` }}
										resizeMode="cover"
									/>
								}
							</Pressable>
						) 
					}}
					ListFooterComponent={result[tabRoute].isFetching 
						? <Loading isLoading={result[tabRoute].isFetching} style={{ justifyContent: 'flex-start' }} /> 
						: (isEmpty ? <Empty isEmpty={isEmpty} style={{ justifyContent: 'flex-start' }} />  : <End />)}
				/>
			}

			<Modal
				presentationStyle='fullScreen'
				visible={openAvatarModal}
				onRequestClose={() => setOpenAvatarModal(false)}
			>
				<Pressable onPress={() => setOpenAvatarModal(false)} style={{ backgroundColor: theme.fill_placeholder, flex: 1 }}>
					<Image
						resizeMode="contain"
						isSelectedUploading={false}
						editMode={false}
						showloading
						showActivity
						source={avatar ? { uri: `${urlConstants.images}/${avatar}` } : require('@xcoolsports/static/avatar.jpg')}
					/>
				</Pressable>
			</Modal>

			<SlideUpModal
				onClose={() => setOpenSettingModal(false)}
				visible={openSetttingModal}
			>
				<UserMenu navigation={navigation} selectedUser={selectedUser} onClose={() => setOpenSettingModal(false)} />
			</SlideUpModal>
		</Container>
	)
};

export default User;
