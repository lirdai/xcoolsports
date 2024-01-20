import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Divider } from 'react-native-paper';

import HeaderSettings from '@xcoolsports/components/Topic/HeaderSettings';
import EventBio from '@xcoolsports/components/Topic/EventBio';
import Media from '@xcoolsports/components/Topic/Media';
import Content from '@xcoolsports/components/Topic/Content';
import Comment from '@xcoolsports/components/Topic/Comment';
import EventHeaderTitle from '@xcoolsports/components/Topic/EventHeaderTitle';
import TopicHeaderTitle from '@xcoolsports/components/Topic/TopicHeaderTitle';

import Footer from '@xcoolsports/components/Topic/Footer';
import Container from '@xcoolsports/components/Common/Container';
import End from '@xcoolsports/components/Common/Pages/End';
import Loading from '@xcoolsports/components/Common/Pages/Loading';
import Empty from '@xcoolsports/components/Common/Pages/Empty';
import CustomErrorBoundary from '@xcoolsports/components/Common/Pages/CustomErrorBoundary';
import RenderError from '@xcoolsports/components/Common/Pages/RenderError';
import { api, selectTopicById, selectCommentsById, selectEventById } from '@xcoolsports/data';
import theme, {ThemeContext} from '@xcoolsports/constants/theme';

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Topic = ({ route, navigation }) => {
  const { topicId, eventId, commentId } = route.params;
  const isTopicSelected = !Number.isNaN(Number(topicId));
  const isEventSelected = !Number.isNaN(Number(eventId));
  const isCommentSelected = !Number.isNaN(Number(commentId));
  const isMounted = useRef(true);
  const flatListRef = useRef();
  const theme = useContext(ThemeContext);

  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [isFocused, setIsFocused] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [commentHighlights, setCommentHighlights] = useState([]);

  const event = useSelector((state) => selectEventById(state, eventId));
  const topic = useSelector((state) => selectTopicById(state, topicId));
  const comments = useSelector((state) => selectCommentsById(state, topicId, commentHighlights));

  const { isLoading: postIsLoading, error: postError, isError: postIsError } = api.endpoints.getTopic.useQuery({ id: topicId }, { skip: !isTopicSelected || isEventSelected });
  const { isLoading: eventIsLoading, error: eventError, isError: eventIsError } = api.endpoints.getEvent.useQuery({ id: eventId }, { skip: !isTopicSelected || !isEventSelected });
  const { data: commentsData, isFetching: commentsIsFetching, isError: commentsIsError } = api.endpoints.getManyComments.useQuery({ page, topicID: topicId }, { skip: !hasNext || !isTopicSelected });
  const { data: commentHighlightsData, isFetching: commentHighlightsIsFetching } = api.endpoints.getTopic.useQuery({ id: commentId }, { skip: !isTopicSelected || !isCommentSelected });

  const isLoading = isEventSelected ? eventIsLoading : postIsLoading;
  const isError = isEventSelected ? eventIsError : postIsError;
  const error = isEventSelected ? eventError : postError;

  const updateCommenHighlights = (newComments) => {
    if (!isMounted.current) return;

    setCommentHighlights(newComments.map((c) => c.id));
    setTimeout(() => {
      setCommentHighlights([]);
    }, 15000);
  };

  useEffect(() => {
    if (commentHighlightsData && !commentHighlightsIsFetching) updateCommenHighlights(commentHighlightsData.topics);
  }, [commentHighlightsData, commentHighlightsIsFetching]);

  const fetchCommentsByNextPage = () => {
    if (!commentsIsFetching && !commentsIsError) setPage((prev) => prev + 1);
  }

  useEffect(() => {
    if (commentsData && !commentsIsFetching) setHasNext(commentsData.hasNext);
  }, [commentsData?.hasNext, commentsIsFetching]);

  // Screen Setting
  useEffect(() => {
    if (fullscreen) {
      flatListRef.current?.scrollToOffset({ animated: false, offset: 0 })
      setScrollEnabled(false);
    } else {
      setScrollEnabled(true);
    }
  }, [fullscreen]);

  //如果topic 和 edit是同一个component，就不会有这么多逼事了
  useFocusEffect(useCallback(() => {
    setIsFocused(true);

    return () => setIsFocused(false);
  }, []));

  useEffect(() => () => { isMounted.current = false; }, []);

  if (!isFocused) return null;

  return (
    <Container
      fullscreen={fullscreen}
      header={{
        title: '看日记',
        headerLeft: { onPress: navigation.goBack },
        headerTitle: {
          headerTitleComponent: isEventSelected ? <EventHeaderTitle navigation={navigation} event={event} /> : <TopicHeaderTitle navigation={navigation} topic={topic} />
        },
        headerRight: {
          headerRightComponent: !isEventSelected && <HeaderSettings navigation={navigation} topic={topic} />
        },
      }}
    >
      <Loading isLoading={isLoading} />
      <RenderError isError={!isLoading && isError} error={error} />
      <Empty isEmpty={!isLoading && !isError && !topic} />
      {(!isLoading && !isError && topic) &&
        <CustomErrorBoundary>
          <View style={styles.container}>
            <FlatList
              showsVerticalScrollIndicator={false}
              ref={flatListRef}
              scrollEnabled={scrollEnabled}
              onEndReached={fetchCommentsByNextPage}
              onEndReachedThreshold={0.5}
              ListHeaderComponent={
                <View>
                  <Media topic={topic} onFullscreen={setFullscreen} />
                  <Content topic={topic} />
                  {isEventSelected && <EventBio event={event} navigation={navigation} />}
                </View>
              }
              data={comments.filter((c) => c.parent?.id === topic.id)}
              keyExtractor={item => item.id}
              renderItem={comment =>
                <View key={comment.item.id}>
                  <Comment
                    commentHighlights={commentHighlights}
                    navigation={navigation}
                    comment={comment.item}
                    isParentComment
                  />
                  <Divider horizontalInset style={{ paddingHorizontal: theme.v_spacing_lg }} />
                </View>
              }
              ListFooterComponent={commentsIsFetching ? <Loading isLoading={commentsIsFetching} style={{ justifyContent: 'flex-start' }} /> : <End />}
            />

            {!fullscreen && <Footer topic={topic} navigation={navigation} />}
          </View>
        </CustomErrorBoundary>
      }
    </Container>
  )
};

export default Topic;