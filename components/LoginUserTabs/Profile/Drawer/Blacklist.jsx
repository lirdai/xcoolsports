import React, { useRef, useState, useEffect, useContext } from 'react';
import { Pressable, Dimensions, View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next'

import urlConstants from '@xcoolsports/constants/urls';
import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import Image from '@xcoolsports/components/utils/Image';
import Container from '@xcoolsports/components/Common/Container';
import Empty from '@xcoolsports/components/Common/Pages/Empty';
import End from '@xcoolsports/components/Common/Pages/End';
import Loading from '@xcoolsports/components/Common/Pages/Loading';
import RenderError from '@xcoolsports/components/Common/Pages/RenderError';
import { api } from '@xcoolsports/data';

const styles = StyleSheet.create({
  blockContainer: {
    flexDirection: 'row', 
    paddingHorizontal: theme.h_spacing_xl,
    height: Dimensions.get("window").height/15,
    width: Dimensions.get("window").width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: "center" 
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
  block: {
    height: 30,
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.h_spacing_md,
  },
});

const Blacklist = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const isMounted = useRef(true);
  const theme = useContext(ThemeContext);

  const [blacklist, setBlacklist] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);

  const [blockUser] = api.endpoints.blockUser.useMutation();
  const { data, isLoading, isFetching, isError, error, isUninitialized, refetch } = api.endpoints.getBlackList.useQuery({ page }, { skip: !hasNext });

  const handleBlacklist = async (person) => {
    const newBlacklist = {
      username: person.username,
    };

    if (person.i_block === 1) { 
      newBlacklist.unblock = true; 
    };

    const response = await blockUser(newBlacklist);

    if (response.data) {
      if (isMounted.current) {
        setBlacklist(() => {
          const newBlacklist = blacklist.map((black) => (black.username === person.username ? { ...person, i_block: 1 - person.i_block } : black));
          return newBlacklist;
        });
      }
    }
  };

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

  const fetchNextPage = () => {
    if (!isFetching && !isError && hasNext) setPage((prev) => prev + 1);
  }

  useEffect(() => {
    if (data && !isFetching) setHasNext(data.hasNext);
  }, [data?.hasNext, isFetching]);

  useEffect(() => {
    if (data?.users) setBlacklist((prev) => prev.concat(data.users));
  }, [data?.users]);

  useEffect(() => () => { isMounted.current = false; }, []);

  const isEmpty = !isLoading && blacklist && blacklist.length === 0;

  return (
    <Container 
      header={{ 
        title: `${t('黑名单')}`, 
        headerTitle: { showTitle: true }, 
        headerLeft: { onPress: navigation.goBack },
        headerRight: {},
      }}
    >
      <Loading isLoading={isLoading} />
      <RenderError isError={!isLoading && isError} error={error} />
      <Empty isEmpty={isEmpty && !isError} />
      {(!isLoading && !isError && blacklist && !isEmpty) &&
        <FlatList 
          style={{ width: '100%' }}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={0.5}
          data={blacklist}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && page === 1}
              onRefresh={handleRefresh}
            />
          }
          renderItem={({ item }) => {
            return (
              <View style={styles.blockContainer}>
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

                <Pressable style={[styles.block, {borderColor: theme.fill_disabled}]} onPress={() => handleBlacklist(item)}>
                  { item.i_block === 1 && <Text style={{ fontSize: theme.font_size_caption_sm, color: theme.text_color }}>{`${t('取消拉黑')}`}</Text> }
                  { item.i_block === 0 && <Text style={{ fontSize: theme.font_size_caption_sm, color: theme.text_color }}>{`${t('拉黑')}`}</Text> }
                </Pressable>
              </View>
            )
          }}
          ListFooterComponent={isFetching ? <Loading isLoading={isFetching} style={{ justifyContent: 'flex-start' }} /> : <End />}
        />
      }
    </Container>
  )
};

export default Blacklist;
