import React, { useState, useContext } from 'react';
import { Pressable, ScrollView, View, Text, StyleSheet, TextInput } from 'react-native';
import { Chip } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Entypo } from '@expo/vector-icons'; 

import { ThemeContext } from '@xcoolsports/constants/theme';
import Container from '@xcoolsports/components/Common/Container';
import templateConstants from '@xcoolsports/constants/templateConstants';
import { 
    api, toastActions, toastTypes, selectCurrentUser, 
    selectSearchCriteria, selectTags, configActions,
} from '@xcoolsports/data';
import SecondaryContainedButton from '@xcoolsports/components/utils/Buttons/SecondaryContainedButton';

const styles = StyleSheet.create({});

const MateSearchCriteria = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const totalTags = useSelector(selectTags);
    const theme = useContext(ThemeContext);
    const search_criteria = useSelector(selectSearchCriteria);

    const [addHobby, setAddHobby] = useState('');

    const [updateSocialSetting] = api.endpoints.updateSocialSetting.useMutation();

    return (
        <Container 
            header={{ 
                title: `${t('条件设置')}`, 
                headerTitle: { showTitle: true }, 
                headerLeft: { onPress: navigation.goBack },
                headerRight: {
                    headerRightComponent: 
                    <Pressable hitSlop={10} 
                        style={{ width: 50, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
                        onPress={() => {
                            const body = {
                                can_match: true,
                                gender: search_criteria.gender,
                                min_age: 18,
                                max_age: search_criteria.age,
                                max_distance: search_criteria.distance,
                                horoscope: search_criteria.horoscope,
                                goal: search_criteria.goal,
                                tags: search_criteria.hobby,
                            }
    
                            updateSocialSetting({ body });
                            navigation.goBack();
                        }}
                    >                        
                        <Text style={{color: theme.secondary_variant}}>{t('完成')}</Text>
                    </Pressable>
                },
            }}
        >
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: theme.fill_base, margin: theme.v_spacing_2xl }}>
                <Pressable 
                    hitSlop={10} 
                    style={{ marginVertical: theme.v_spacing_lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} 
                    onPress={() => {
                        if (!currentUser.is_logged_in) { 
                            navigation.navigate(`${t('登录')}`); 
                            return; 
                        } else if (!currentUser.is_verified) {
                            navigation.navigate(`${t("输入手机号")}`, { verificationType: "VERIFYPHONE" });
                            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '记得要验证手机号哦' }));
                            return;
                        } else if (currentUser.is_banned.users) {
                            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '账号被封, 请耐心等待' }));
                            return;
                        }

                        navigation.navigate(`${t('编辑资料')}`);
                        return;
                    }}
                >
                    <Text style={{ color: theme.text_color, fontWeight: 'bold', marginVertical: theme.v_spacing_sm }}>{t('更新个人条件设置，让别人更好的找到你')}</Text>
                    <Entypo name="arrow-right" size={theme.icon_size_lg} color={theme.fill_mask} />
                </Pressable>

                <View style={{ marginVertical: theme.v_spacing_lg }}>
                    <Text style={{ color: theme.text_color, fontWeight: 'bold', marginVertical: theme.v_spacing_sm }}>{t('性别')}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                        {[{key: '小哥哥', value: "男"}, {key: '小姐姐', value: "女"}].map((g) => 
                            <Chip 
                                key={g.key} 
                                mode="outlined" 
                                closeIcon="close"
                                onPress={() => {
                                    if (search_criteria.gender !== g.value) dispatch(configActions.updateGenderSearchCriteria(g.value));
                                    else dispatch(configActions.updateGenderSearchCriteria(undefined));
                                }}
                                style={search_criteria.gender === g.value
                                    ? { fontSize: theme.font_size_base, backgroundColor: theme.primary_variant, margin: theme.v_spacing_xs } 
                                    : { fontSize: theme.font_size_base, backgroundColor: theme.fill_base, margin: theme.v_spacing_xs }}
                                textStyle={search_criteria.gender === g.value
                                    ? { color: theme.fill_base }
                                    : { color: theme.secondary_variant }}
                            >{t(g.key)}</Chip>
                        )}
                    </View>
                </View>

                <View style={{ marginVertical: theme.v_spacing_lg }}>
                    <View style={{ flexDirection: 'row', marginVertical: theme.v_spacing_sm }}>
                        <Text style={{ color: theme.text_color, fontWeight: 'bold', marginHorizontal: theme.v_spacing_lg }}>{t('距离')}</Text>
                        {!!search_criteria.distance && <Text style={{ color: theme.text_color, fontWeight: 'bold' }}>{0} - {search_criteria.distance}</Text>}
                    </View>

                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={0}
                        maximumValue={300}
                        maximumTrackTintColor={theme.fill_disabled}
                        minimumTrackTintColor={theme.secondary_color}
                        thumbTintColor={theme.white_icon}
                        value={Number(search_criteria.distance)}
                        onSlidingComplete={(e) => {
                            if (Number(e.toFixed(0)) === 0) {
                                dispatch(configActions.updateDistanceSearchCriteria(null));                     
                            } else {
                                dispatch(configActions.updateDistanceSearchCriteria(e.toFixed(0)));                     
                            }
                        }}
                    />
                </View>

                <View style={{ marginVertical: theme.v_spacing_lg }}>
                    <View style={{ flexDirection: 'row', marginVertical: theme.v_spacing_sm }}>
                        <Text style={{ color: theme.text_color, fontWeight: 'bold', marginHorizontal: theme.v_spacing_lg }}>{t('年龄')}</Text>
                        {search_criteria.age && <Text style={{ color: theme.text_color, fontWeight: 'bold' }}>{18} - {search_criteria.age}</Text>}
                    </View>

                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={18}
                        maximumValue={50}
                        maximumTrackTintColor={theme.fill_disabled}
                        minimumTrackTintColor={theme.secondary_color}
                        thumbTintColor={theme.white_icon}
                        value={Number(search_criteria.age)}
                        onSlidingComplete={(e) => {
                            if (Number(e.toFixed(0)) === 18) {
                                dispatch(configActions.updateAgeSearchCriteria(null));
                            } else {
                                dispatch(configActions.updateAgeSearchCriteria(e.toFixed(0)));
                            }
                        }}
                    />
                </View>

                <View style={{ marginVertical: theme.v_spacing_lg }}>
                    <Text style={{ color: theme.text_color, fontWeight: 'bold', marginVertical: theme.v_spacing_sm }}>{t('兴趣爱好')}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                        {totalTags.map((tag) => 
                            <Chip 
                                key={tag} 
                                mode="outlined" 
                                closeIcon="close"
                                onPress={() => {
                                    if (!search_criteria.hobby.includes(tag)) dispatch(configActions.addHobbySearchCriteria(tag));
                                    else dispatch(configActions.removeHobbySearchCriteria(tag));
                                }} 
                                style={search_criteria.hobby.includes(tag)
                                    ? { fontSize: theme.font_size_base, backgroundColor: theme.primary_variant, margin: theme.v_spacing_xs } 
                                    : { fontSize: theme.font_size_base, backgroundColor: theme.fill_base, margin: theme.v_spacing_xs }}
                                textStyle={search_criteria.hobby.includes(tag)
                                    ? { color: theme.fill_base }
                                    : { color: theme.secondary_variant }}
                            >{tag}</Chip>
                        )}
                    </View>

                    <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginVertical: theme.v_spacing_lg }}>
                        <TextInput
                            style={{ 
                                borderWidth: 1, flex: 1, borderRadius: 10, borderColor: theme.fill_disabled, 
                                padding: theme.v_spacing_sm, marginHorizontal: theme.h_spacing_sm,
                                height: 45, color: theme.text_color, 
                            }}
                            placeholder={t("更多爱好")}
                            placeholderTextColor={theme.secondary_variant}
                            value={addHobby}
                            onChangeText={(text) => {
                                setAddHobby(text);
                            }}
                            onSubmitEditing={({ nativeEvent: { text }}) => {
                                setAddHobby('');
                                dispatch(configActions.addTags(addHobby));
                            }}
                        />

                        <SecondaryContainedButton
                            buttonFreeStyle={{height: 45, width: 80}} 
                            textFreeStyle={{fontSize: theme.font_size_base}}
                            buttonText={'添加'} 
                            onPress={() => {
                                setAddHobby('');
                                dispatch(configActions.addTags(addHobby));
                            }}
                        />
                    </View> 
                </View>

                <View style={{ marginVertical: theme.v_spacing_lg }}>
                    <Text style={{ color: theme.text_color, fontWeight: 'bold', marginVertical: theme.v_spacing_sm }}>{t('星座')}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                        {templateConstants.signs.map((tag) => 
                            <Chip 
                                key={tag} 
                                mode="outlined" 
                                closeIcon="close"
                                onPress={() => {
                                    if (!search_criteria.horoscope.includes(tag)) dispatch(configActions.addHoroscopeSearchCriteria(tag));
                                    else dispatch(configActions.removeHoroscopeSearchCriteria(tag));
                                }} 
                                style={search_criteria.horoscope.includes(tag)
                                    ? { fontSize: theme.font_size_base, backgroundColor: theme.primary_variant, margin: theme.v_spacing_xs } 
                                    : { fontSize: theme.font_size_base, backgroundColor: theme.fill_base, margin: theme.v_spacing_xs }}
                                textStyle={search_criteria.horoscope.includes(tag)
                                    ? { color: theme.fill_base }
                                    : { color: theme.secondary_variant }}
                            >{t(tag)}</Chip>
                        )}
                    </View>
                </View>

                <View style={{ marginVertical: theme.v_spacing_lg }}>
                    <Text style={{ color: theme.text_color,  fontWeight: 'bold', marginVertical: theme.v_spacing_sm }}>{t('匹配目的')}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                        {templateConstants.goals.map((tag) => 
                            <Chip 
                                key={tag} 
                                mode="outlined" 
                                closeIcon="close"
                                onPress={() => {
                                    if (!search_criteria.goal.includes(tag)) dispatch(configActions.addGoalSearchCriteria(tag));
                                    else dispatch(configActions.removeGoalSearchCriteria(tag));
                                }} 
                                style={search_criteria.goal.includes(tag)
                                    ? { fontSize: theme.font_size_base, backgroundColor: theme.primary_variant, margin: theme.v_spacing_xs } 
                                    : { fontSize: theme.font_size_base, backgroundColor: theme.fill_base, margin: theme.v_spacing_xs }}
                                textStyle={search_criteria.goal.includes(tag)
                                    ? { color: theme.fill_base }
                                    : { color: theme.secondary_variant }}
                            >{t(tag)}</Chip>
                        )}
                    </View>
                </View>
            </ScrollView>
        </Container>
    );
};

export default MateSearchCriteria;