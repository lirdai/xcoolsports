import React, { useState, useEffect, useContext } from 'react';
import { Pressable, Dimensions, View, Text, StyleSheet, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

import urlConstants from '@xcoolsports/constants/urls';
import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import Image from '@xcoolsports/components/utils/Image';
import Container from '@xcoolsports/components/Common/Container';
import Empty from '@xcoolsports/components/Common/Pages/Empty';
import End from '@xcoolsports/components/Common/Pages/End';
import Loading from '@xcoolsports/components/Common/Pages/Loading';
import RenderError from '@xcoolsports/components/Common/Pages/RenderError';
import { selectCurrentUser, selectManyUsersByUsername, api, toastActions, toastTypes } from '@xcoolsports/data';

const styles = StyleSheet.create({
  followContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row', 
    paddingHorizontal: theme.h_spacing_xl,
    height: Dimensions.get("window").height/15,
    width: Dimensions.get("window").width,
  },
  title: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: "center",
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 100,
  },
  text: {
    flex: 1,
    marginLeft: theme.h_spacing_sm,
  },
  follow: {
    height: 30,
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.h_spacing_md,
  },
});

const Follower = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [followerIds, setFollowerIds] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const theme = useContext(ThemeContext);

  const currentUser = useSelector(selectCurrentUser);
  const followers = useSelector((state) => selectManyUsersByUsername(state, followerIds));
  const { data, isLoading, isFetching, isError, error } = api.endpoints.getFollower.useQuery({ username: currentUser.username, page }, { skip: !hasNext });
  const [updateFollow] = api.endpoints.updateFollow.useMutation();

  const handleFollow = async (person) => {
    const newFollow = { 
      followee: person.username, 
      i_follow: 1 - person.i_follow,
    };

    await updateFollow(newFollow);
  };

  const fetchNextPage = () => {
    if (!isFetching && !isError && hasNext) setPage((prev) => prev + 1);
  }

  useEffect(() => {
    if (data && !isFetching) setHasNext(data.hasNext);
  }, [data?.hasNext, isFetching]);

  useEffect(() => {
    if (data?.users) setFollowerIds((prev) => prev.concat(data.users.map((r) => r.username)))
  }, [data?.users]);

  const isEmpty = !isLoading && followers && followers.length === 0;

  return (
    <Container 
      header={{ 
        title: `${t('粉丝')}`, 
        headerTitle: { showTitle: true }, 
        headerLeft: { onPress: navigation.goBack },
        headerRight: {},
      }}
    >
      <Loading isLoading={isLoading} />
      <RenderError isError={!isLoading && isError} error={error} />
      <Empty isEmpty={isEmpty && !isError} />
      {(!isLoading && !isError && !isEmpty && followers) &&
        <FlatList 
          showsVerticalScrollIndicator={false}
          windowSize={7}
          style={{ width: '100%' }}
          decelerationRate={'fast'}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={0.5}
          data={followers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            return (
              <View style={styles.followContainer}>
                <Pressable 
                  hitSlop={10} 
                  style={styles.title} 
                  onPress={() => {
                    item?.username 
                      ? navigation.push(`${t('看用户')}`, { usernameURL: item.username })
                      : null
                  }}
                >
                  <Image 
                    containerStyle={styles.avatar} 
                    isSelectedUploading={false}
                    editMode={false}
                    showloading={false}
                    source={item.avatar ? { uri :`${urlConstants.images}/${item.avatar}` } : require('@xcoolsports/static/avatar.jpg')}
                    resizeMode="cover"
                  />

                  <Text numberOfLines={1} style={[styles.text, {color: theme.text_color}]}> {item.nickname} </Text>
                </Pressable>

                <Pressable
                  style={[styles.follow, {borderColor: theme.fill_disabled}]}
                  onPress={() => {
                    if (!currentUser.is_verified) {
                      navigation.navigate(`${t("输入手机号")}`, { verificationType: "VERIFYPHONE" });
                      dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '记得要验证手机号哦' }));
                      return;
                    } else if (currentUser.is_banned.users) {
                      dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '账号被封, 请耐心等待' }));
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
                </Pressable>
              </View>
            )
          }}
          ListFooterComponent={isFetching ? <Loading isLoading={isFetching} style={{ justifyContent: 'flex-start' }} /> : <End />}
        />
      }
    </Container>
  );
};

export default Follower;