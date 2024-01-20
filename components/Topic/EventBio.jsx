import React, { useContext } from 'react';
import { View, StyleSheet,Text, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { Rating } from 'react-native-ratings';
import { Divider } from 'react-native-paper';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { useTranslation } from 'react-i18next';

import { selectUserByUsername, selectLocation } from '@xcoolsports/data';
import Image from '@xcoolsports/components/utils/Image';
import urlConstants from '@xcoolsports/constants/urls';
import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import distanceCalculation from '@xcoolsports/utils/distanceCalculation';

const styles = StyleSheet.create({
    container: {
        padding: theme.v_spacing_lg
    },
    coordinate: {
        fontSize: theme.font_size_base,
        paddingLeft: theme.v_spacing_xs,
        fontWeight: 'bold',
    },
    address: {
        fontSize: theme.font_size_base,
        paddingBottom: theme.v_spacing_lg
    },
});
  
const EventBio = ({ event, navigation }) => {
    const { t, i18n } = useTranslation();
    const topicAuthor = useSelector((state) => selectUserByUsername(state, event?.planner?.username));
    const location = useSelector(selectLocation);
    const theme = useContext(ThemeContext);

    return (
        <View style={styles.container}>
            <Divider />

            <Text style={{ color: theme.text_color, fontSize: 18, fontWeight: 'bold', width: '70%', paddingVertical: theme.v_spacing_xl }}>{t('体验地址')}</Text>

            {location.user_current_coordinate && 
                <View style={{ flexDirection: 'row', paddingBottom: theme.v_spacing_lg }}>
                    <MaterialCommunityIcons name="map-marker-distance" size={16} color={theme.secondary_color} />
                    <Text style={[{color: theme.text_color}, styles.coordinate]}>{t('距离你')} {distanceCalculation(event.coordinate.split(",")[1], event.coordinate.split(",")[0], location.user_current_coordinate.latitude, location.user_current_coordinate.longitude)} km</Text>
                </View>
            }

            <View style={{ flexDirection: 'row', paddingBottom: theme.v_spacing_lg }}>
                <Entypo name="location-pin" size={16} color={theme.secondary_color} />
                <Text style={[{color: theme.text_color}, styles.address]}>{event.address}</Text>
            </View>

            <Divider />

            <Pressable 
                hitSlop={5}
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.v_spacing_xl }}
                onPress={() => { 
                event?.planner?.username
                    ? navigation.push(`${t('看用户')}`, { usernameURL: event?.planner?.username })
                    : null
                }} 
            >
                <Text style={{ color: theme.text_color, fontSize: 18, fontWeight: 'bold', width: '70%' }}>{t('认识您的达人')} { event?.planner?.nickname || `${t('用户不存在')}` }</Text>
                <Image 
                    containerStyle={{ height: 35, width: 35, borderRadius: 100 }}
                    isSelectedUploading={false}
                    editMode={false}
                    showloading={false}
                    source={event?.planner?.avatar ? { uri :`${urlConstants.images}/${event.planner.avatar}` } : require('@xcoolsports/static/avatar.jpg')}
                    resizeMode="cover"
                /> 
            </Pressable>

            <View style={{ paddingBottom: theme.v_spacing_lg }}>
                {topicAuthor?.is_certification_verified && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {topicAuthor.user_type === 'PERSON' && <FontAwesome name="check-circle" color={theme.brand_important} size={theme.icon_size_xxs} />}
                        {topicAuthor.user_type === 'ORG' && <FontAwesome name="check-circle" color={theme.brand_primary} size={theme.icon_size_xxs} />}
                        <Text style={{color: theme.text_color}}> { topicAuthor.certification } </Text>
                    </View>
                )} 
            </View>

            {event?.rating && 
                <Rating
                    ratingCount={Math.floor(event.rating)}
                    startingValue={5}
                    imageSize={10}
                    readonly
                    style={{ alignItems: 'flex-start', paddingBottom: theme.v_spacing_lg }}
                />
            }
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingBottom: theme.v_spacing_lg }}>
                {topicAuthor?.certification_data?.documents.map((document) => 
                    <View key={document} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome name="check-circle" color={theme.brand_success} size={theme.icon_size_xxs} />
                        <Text style={{color: theme.text_color}}> {document} </Text>
                    </View>
                )}
            </View>

            {!topicAuthor || topicAuthor.bio === '' && <Text style={{ color: theme.text_color, paddingBottom: theme.v_spacing_lg }}>{t('这个人很懒，什么都没有留下')}</Text>}
            {topicAuthor && topicAuthor.bio !== '' && <Text style={{ color: theme.text_color, paddingBottom: theme.v_spacing_lg }}>{ topicAuthor.bio }</Text>}

            <Divider />
      </View>
    );
};

export default EventBio;
