import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { produce } from 'immer';

import Loading from '@xcoolsports/components/Common/Pages/Loading';
import Empty from '@xcoolsports/components/Common/Pages/Empty';
import End from '@xcoolsports/components/Common/Pages/End';
import RenderError from '@xcoolsports/components/Common/Pages/RenderError';

const InfiniteList = ({
    useQuery, renderItem,
    keyExtractor, sortComparer,
    ...props
}) => {
    const [queryParam, setQueryparam] = useState({
        page: 1,
        hasNext: true,
    });
    const [data, setData] = useState({ ids: [], entities: {} });
    const upsertData = (newEntities) => {
        if (!newEntities) return;
        setData(
            produce((draft) => {
                // split add and update
                const toAdd = [];
                const toUpdate = [];

                for (const entity of newEntities) {
                    const id = keyExtractor(entity);
                    if (id in draft.entities) {
                        toUpdate.push({ id, changes: entity });
                    } else {
                        toAdd.push(entity);
                    }
                }
                // update
                for (let update of toUpdate) {
                    const entity = draft.entities[update.id];
                    if (!entity) continue;
              
                    Object.assign(entity, update.changes);
                    const newId = keyExtractor(entity);
                    if (update.id !== newId) {
                      delete draft.entities[update.id];
                      draft.entities[newId] = entity;
                    }
                }
                // add
                const entities = toAdd.filter((entity) => !(keyExtractor(entity) in draft.entities));
                if (entities.length !== 0) {
                    entities.forEach((entity) => {
                        draft.entities[keyExtractor(entity)] = entity;
                    })
                }
                // re-sort
                const allEntities = Object.values(draft.entities);
                allEntities.sort(sortComparer);
                draft.ids = allEntities.map(keyExtractor);
            })
        );
    }

    const { data: response, isFetching, isLoading, isError, error, isUninitialized, refetch } = useQuery({ page: queryParam.page }, { skip: !queryParam.hasNext });
    const isEmpty = data.ids.length === 0;
    const newHasNext = response?.hasNext;
    const newData = response?.data;
    const [ isRefresh, setIsRefresh ] = useState(false);

    useEffect(() => {
        if (newHasNext === undefined) return;
        setQueryparam(
            produce((draft) => {
                draft.hasNext = newHasNext;
            })
        );
    }, [newHasNext, newHasNext !== queryParam.hasNext]);

    useEffect(() => {
        if (!!isRefresh && !isFetching) {
            refetch();
            setIsRefresh(false);
        }
    }, [!!isRefresh]);

    useEffect(() => {
        if (newData === undefined) return;
        upsertData(newData);
    }, [newData]);

    const handleFetchNextPage = () => {
        if (isFetching || isError) return;

        setQueryparam(
            produce((draft) => {
                if (draft.hasNext) {
                    draft.page += 1;
                }
            })
        );
    }
    
    const handleRefresh = () => {
        if (isFetching) return;
        setQueryparam(
            produce((draft) => {
                if (draft.page !== 1 || !draft.hasNext) {
                    draft.page = 1;
                    draft.hasNext = true;
                }
            })
        );
        setIsRefresh(true);
    }

    if (!useQuery || !renderItem || !keyExtractor) {
        return null;
    }
    if (isLoading) {
        return (<Loading isLoading={isLoading} />);
    }
    if (isError) {
        return (<RenderError isError={isError} error={error} />);
    }
    if (isEmpty) {
        return (<Empty isEmpty={isEmpty} />);
    }

    return (
        <FlatList 
            data={data.ids.map(id => data.entities[id])}
            keyExtractor={keyExtractor}
            refreshControl={
                <RefreshControl
                    refreshing={isFetching && queryParam.page === 1}
                    onRefresh={handleRefresh}
                />
            }
            onEndReached={handleFetchNextPage}
            onEndReachedThreshold={0.5}
            renderItem={renderItem}
            ListFooterComponent={isFetching ? <Loading isLoading={isFetching} style={{ justifyContent: 'flex-start' }} /> : isEmpty ? null : <End />}
            windowSize={7}
            decelerationRate={'fast'}
            {...props}
        />
    );
}

export default InfiniteList;