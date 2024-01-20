import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { FlatList, Pressable, Text, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'

import {ThemeContext} from '@xcoolsports/constants/theme';
import Container from '@xcoolsports/components/Common/Container';
import styles from '@xcoolsports/components/LoginUserTabs/Notifications/style';
import Empty from '@xcoolsports/components/Common/Pages/Empty';
import End from '@xcoolsports/components/Common/Pages/End';
import Loading from '@xcoolsports/components/Common/Pages/Loading';
import RenderError from '@xcoolsports/components/Common/Pages/RenderError';
import { selectCurrentUser, api } from '@xcoolsports/data';

const Annoucements = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [annoucements, setAnnoucements] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);

  const currentUser = useSelector(selectCurrentUser);
  const theme = useContext(ThemeContext);
  const { data, isLoading, isFetching, isError, error } = api.endpoints.getAnouncementList.useQuery({ page }, { skip: !hasNext });
  const [updateNotificationNumberAsRead] = api.endpoints.updateNotificationNumberAsRead.useMutation();

  const fetchNextPage = () => {
    if (!isFetching && !isError && hasNext) setPage((prev) => prev + 1);
  }

  useEffect(() => {
    if (data && !isFetching) setHasNext(data.hasNext);
  }, [data?.hasNext, isFetching]);

  useEffect(() => {
    if (data?.annoucements) setAnnoucements((prev) => prev.concat(data.annoucements))
  }, [data?.annoucements]);

  const handleMarkAsRead = async () => {
    if (currentUser?.num_notifications && currentUser?.num_notifications?.num_annoucements !== 0 && annoucements.length > 0) {
      await updateNotificationNumberAsRead({
        type: "annoucement",
        id: annoucements[0].id,
      });
    }
  };

  const onGoBack = () => {
    handleMarkAsRead();
    return false;
  };
    
  useFocusEffect(useCallback(() => {
    const backLisener = BackHandler.addEventListener("hardwareBackPress", onGoBack);
    return () => backLisener.remove()
  }, []));

  const isEmpty = !isLoading && annoucements && annoucements.length === 0;

  return (
    <Container 
      header={{ 
        title: `${t('公告')}`, 
        headerTitle: { showTitle: true }, 
        headerLeft: { 
          onPress: () => { handleMarkAsRead(); navigation.goBack(); },
        },
        headerRight: {},
      }}
    >
      <Loading isLoading={isLoading} />
      <RenderError isError={!isLoading && isError} error={error} />
      <Empty isEmpty={isEmpty && !isError} />
      {(!isLoading && !isError && !isEmpty && annoucements) &&
        <FlatList 
          windowSize={7}
          style={{ width: '100%' }}
          decelerationRate={'fast'}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={0.5}
          data={annoucements}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            return (
              <Pressable
                hitSlop={10}
                style={({ pressed }) => [styles.fixedBox, {borderBottomColor: theme.fill_disabled}, pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}
              >
                <Text style={[styles.title, {color: theme.text_color}]}>{item.text}</Text>
              </Pressable>
            )
          }}
          ListFooterComponent={isFetching ? <Loading isLoading={isFetching} style={{ justifyContent: 'flex-start' }} /> : <End />}
        />
      }
    </Container>      
  );
};

export default Annoucements;