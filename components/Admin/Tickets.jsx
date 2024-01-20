import React, { useState, useEffect, useContext } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import _ from 'lodash';
import { useTranslation } from 'react-i18next'

import urlConstants from '@xcoolsports/constants/urls';
import {ThemeContext} from '@xcoolsports/constants/theme';
import Image from '@xcoolsports/components/utils/Image/index';
import Container from '@xcoolsports/components/Common/Container';
import styles from '@xcoolsports/components/LoginUserTabs/Notifications/style';
import Empty from '@xcoolsports/components/Common/Pages/Empty';
import End from '@xcoolsports/components/Common/Pages/End';
import Loading from '@xcoolsports/components/Common/Pages/Loading';
import RenderError from '@xcoolsports/components/Common/Pages/RenderError';
import { api } from '@xcoolsports/data';

const Tickets = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const theme = useContext(ThemeContext);

    const [tickets, setTickets] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);

    const { data, isLoading, isFetching, isError, error } = api.endpoints.getTicketList.useQuery({ page, parentID: null }, { skip: !hasNext });

    const fetchNextPage = () => {
        if (!isFetching && !isError && hasNext) setPage((prev) => prev + 1);
    }

    useEffect(() => {
        if (data && !isFetching) setHasNext(data.hasNext);
    }, [data?.hasNext, isFetching]);

    useEffect(() => {
        if (data?.topics) {
            setTickets((prev) => {
                const newTickets = prev.concat(data.topics);
                return _.uniqBy(newTickets, 'id');
            });
        }
    }, [data?.topics]);
    
    const isEmpty = !isLoading && tickets && tickets.length === 0;

    return (
        <Container 
            header={{ 
                title: `${t('管理')}`, 
                headerTitle: { showTitle: true }, 
                headerLeft: { onPress: navigation.goBack },
                headerRight: {},
            }}
        >
            <Loading isLoading={isLoading} />
            <RenderError isError={!isLoading && isError} error={error} />
            <Empty isEmpty={!isError && isEmpty} />
            {(!isLoading && !isError && !isEmpty && tickets) && 
                <FlatList 
                    style={{ width: '100%' }}
                    onEndReached={fetchNextPage}
                    onEndReachedThreshold={0.5}
                    data={tickets}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                        return (
                            <Pressable 
                                key={item.id} 
                                style={({ pressed }) => [styles.fixedBox, {borderBottomColor: theme.fill_disabled}, pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}
                                hitSlop={10} 
                                onPress={() => navigation.navigate(`${t('看管理')}`, { ticketID: item.id })}
                            >
                                <Pressable 
                                    hitSlop={10}
                                    onPress={() => {
                                        item?.author?.username 
                                            ? navigation.push(`${t('看用户')}`, { usernameURL: item.author.username })
                                            : null
                                    }}
                                >
                                    <Image 
                                        containerStyle={styles.smallAvatar}
                                        isSelectedUploading={false}
                                        editMode={false}
                                        showloading={false}
                                        source={item.author.avatar ? { uri :`${urlConstants.images}/${item.author.avatar}` } : require('@xcoolsports/static/avatar.jpg') }
                                        resizeMode="cover"
                                    />
                                </Pressable>

                                <View style={styles.title}>
                                    <Text style={{color: theme.text_color}} numberOfLines={1}>{ item.author.nickname }</Text>
                                    <Text style={{color: theme.text_color}} numberOfLines={3}> {item.content} </Text>
                                </View>
                            </Pressable>
                        )
                    }}
                    ListFooterComponent={isFetching ? <Loading isLoading={isFetching} style={{ justifyContent: 'flex-start' }} /> : <End />}
                />
            }           
        </Container>
    );
};

export default Tickets;
