import React, { useState, useContext } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { MasonryFlashList } from "@shopify/flash-list";
import { useTranslation } from 'react-i18next';

import { ThemeContext } from '@xcoolsports/constants/theme';
import Container from '@xcoolsports/components/Common/Container';
import CustomErrorBoundary from '@xcoolsports/components/Common/Pages/CustomErrorBoundary';
import CardImage from '@xcoolsports/components/utils/CardImage';
import Empty from '@xcoolsports/components/Common/Pages/Empty';
import End from '@xcoolsports/components/Common/Pages/End';
import Loading from '@xcoolsports/components/Common/Pages/Loading';
import RenderError from '@xcoolsports/components/Common/Pages/RenderError';
import { api } from '@xcoolsports/data';
import CardMenu from '@xcoolsports/components/Card/CardMenu';
import SlideUpModal from '@xcoolsports/components/utils/SlideUpModal';
import ShakeCard from '@xcoolsports/components/utils/AnimationComponents/ShakeCard';

const styles = StyleSheet.create({
    shadow: {
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
        borderRadius: 10,
    },
});

const AdventureCard = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const theme = useContext(ThemeContext);

    const [cardSelected, setCardSelected] = useState();
    const [openSettingModal, setOpenSettingModal] = useState(false);

    const { data, isLoading, isFetching, isError, error } = api.endpoints.getMyCardList.useQuery();
    const isEmpty = !isLoading && data.cards && data.cards.length === 0;

    const handlShakeOnLongPress = (card) => {
        setCardSelected(card);
        setOpenSettingModal(true);
    };

    return (
        <Container
            header={{
                title: `${t('自定义卡片')}`,
                headerTitle: { showTitle: true },
                headerLeft: { onPress: navigation.goBack },
                headerRight: {
                    headerRightComponent:
                        <View style={{ width: 50, justifyContent: 'center', alignItems: 'center' }}>
                            <Pressable hitSlop={10} style={{ flexDirection: 'row' }} onPress={() => navigation.navigate(`${t('自制卡片')}`)}>
                                <AntDesign name="addfolder" size={theme.icon_size_sm} color={theme.secondary_variant} />
                            </Pressable>
                        </View>
                },
            }}
        >
            <CustomErrorBoundary>
                <Loading isLoading={isLoading} />
                <RenderError isError={!isLoading && isError} error={error} />
                <Empty isEmpty={isEmpty && !isError} />
                {(!isLoading && !isError && !isEmpty) &&
                    <MasonryFlashList
                        showsVerticalScrollIndicator={false}
                        estimatedItemSize={200}
                        decelerationRate={'fast'}
                        onEndReachedThreshold={0.5}
                        data={data.cards}
                        extraData={theme}
                        keyExtractor={item => item.id}
                        numColumns={2}
                        renderItem={({ item }) => {
                            return (
                                <ShakeCard onLongPress={() => handlShakeOnLongPress(item)}>
                                    <View style={[{ width: "100%", padding: theme.v_spacing_sm }]}>
                                        <View style={[styles.shadow, { shadowColor: theme.secondary_color, backgroundColor: theme.fill_base }]}>
                                            <View style={[{ borderRadius: 10, overflow: 'hidden' }]}>
                                                <View style={({ pressed }) => [pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}>
                                                    <CardImage id={item.id} />
                                                    <Text style={{ padding: theme.v_spacing_sm, color: theme.text_color }}>{item.content}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </ShakeCard>

                            )
                        }}
                        ListFooterComponent={isFetching ? <Loading isLoading={isFetching} style={{ justifyContent: 'flex-start' }} /> : <End />}
                    />
                }

                <SlideUpModal
                    onClose={() => setOpenSettingModal(false)}
                    visible={openSettingModal}
                >
                    <CardMenu card={cardSelected} onClose={() => setOpenSettingModal(false)} />
                </SlideUpModal>
            </CustomErrorBoundary>
        </Container>
    );
};

export default AdventureCard;