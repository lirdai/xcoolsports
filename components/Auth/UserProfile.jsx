import React, { useRef, useState, useEffect, useContext } from 'react';
import { TextInput, ScrollView, ImageBackground, Text, View, StyleSheet, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RadioButton, ActivityIndicator, Chip } from 'react-native-paper';
import { AntDesign, Ionicons } from '@expo/vector-icons'; 
import DatePicker from 'react-native-date-picker'
import { useTranslation } from 'react-i18next'

import FileUploader from '@xcoolsports/components/utils/FileUploader';
import FilePicker from '@xcoolsports/components/utils/FilePicker';
import getDateFormat from '@xcoolsports/utils/getDateFormat';
import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import urlConstants from '@xcoolsports/constants/urls';
import SlideUpModal from '@xcoolsports/components/utils/SlideUpModal';
import Container from '@xcoolsports/components/Common/Container';
import Image from '@xcoolsports/components/utils/Image';
import regexChecker from '@xcoolsports/utils/regexChecker';
import templateConstants from '@xcoolsports/constants/templateConstants';
import { 
    selectCurrentUser, toastActions, toastTypes, locationActions,
    api, mapboxApi, selectTags, configActions, selectLocation, selectSkin
} from '@xcoolsports/data';
import SecondaryContainedButton from '@xcoolsports/components/utils/Buttons/SecondaryContainedButton';

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
    },
    nonImageContainer: {
        marginTop: 80,
        marginHorizontal: theme.h_spacing_lg,
    },
    imageBackground: {
        width: '100%', 
        height: 120, 
        position: 'relative',
    },
    backgroundEdit: { 
        position: 'absolute', 
        right: 10, 
        bottom: 10, 
        width: 35, 
        height: 35, 
        borderRadius: 100, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploading: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',  
        width: '100%', 
        height: '100%', 
        position: 'absolute', 
        zIndex: 20, 
        opacity: 0.65
    },
    avatarContainer: {
        position: 'absolute', 
        top: 100, 
        left: 20,
        width: 75, 
        height: 75, 
        borderRadius: 100,
        borderWidth: 3,
    },
    avatar: {
        width: "100%", 
        height: "100%", 
        borderRadius: 100, 
        overflow: 'hidden', 
    },
    avatarEdit: { 
        position: 'absolute', 
        right: 0,
        bottom: 0, 
        width: 20, 
        height: 20, 
        borderRadius: 100, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        height: 50,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'space-between',
    },
    text: {
        flexDirection: "row", 
        justifyContent: 'flex-end', 
        flexShrink: 1, 
        marginLeft: theme.h_spacing_xl,
    },
    switch: {
        flexDirection: 'row', 
        alignItems: 'center',
    },
    inputContainerDefault: {
        flexDirection: 'row',
        borderRadius: theme.radius_md,
        height: theme.input_height,
    },
    inputContainerError: {
        borderWidth: theme.border_width_md,
        borderColor: theme.brand_error,
        marginBottom: theme.v_spacing_sm,
    },
    input: {
        flexGrow: 1,
        flexShrink: 1,
        paddingHorizontal: theme.h_spacing_md,
    },
    error: {
        fontSize: theme.font_size_caption_sm,
        color: theme.brand_error,
        marginBottom: theme.v_spacing_xl,
    },
    dateModalContent: {
        height: 200, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    modalContainer: { 
        margin: theme.h_spacing_lg,
        marginTop: 0,
    },
    radioGroup: {
        maxHeight: 300,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    radio: {
        alignItems: 'flex-start',
        justifyContent: "center",
        width: '50%',
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
    },
});

const UserProfile = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const isMounted = useRef(true);
    const uploaAvatardRef = useRef();
    const uploaBackgroundRef = useRef();
    const avatarFileUpLoader= useRef();
    const backgroundFileUploader = useRef();
    const theme = useContext(ThemeContext);

    const currentUser = useSelector(selectCurrentUser);
    const totalTags = useSelector(selectTags);
    const selectedLocation = useSelector(selectLocation); 
    const skin = useSelector(selectSkin);
    const dispatch = useDispatch();

    const [updateUserProfile] = api.endpoints.updateUserProfile.useMutation();
    const [getForwardGeocoding, result] = mapboxApi.endpoints.getForwardGeocoding.useLazyQuery();

    const [nickname, setNickname] = useState(currentUser.nickname);
    const [gender, setGender] = useState(currentUser.gender);
    const [longtitude, setLongtitude] = useState(currentUser?.coordinate?.split(',')[0] || undefined);
    const [latitude, setLatitude] = useState(currentUser?.coordinate?.split(',')[1] || undefined);
    const [location, setLocation] = useState(selectedLocation.user_current_location);
    const [addTag, setAddTag] = useState('');
    const [tags, setTags] = useState(currentUser.tags);
    const [horoscope, setHoroscope] = useState(currentUser.horoscope);
    const [goal, setGoal] = useState(currentUser.goal);
    const [birthday, setBirthday] = useState(currentUser.birthday !== '' ? getDateFormat(new Date(currentUser.birthday)) : getDateFormat(new Date()));
    const [bio, setBio] = useState(currentUser.bio);

    const [avatar, setAvatar] = useState({url: currentUser.avatar});
    const [newAvatar, setNewAvatar] = useState();
    const [background, setBackground] = useState({url: currentUser.background_image});
    const [newBackground, setNewBackground] = useState();

    const [openNicknameModal, setOpenNicknameModal] = useState(false);
    const [openGenderModal, setOpenGenderModal] = useState(false);
    const [openBirthdayModal, setOpenBirthdayModal] = useState(false);
    const [openLocationModal, setOpenLocationModal] = useState(false);
    const [openTagsModal, setOpenTagsModal] = useState(false);
    const [openHoroscopeModal, setOpenHoroscropeModal] = useState(false);
    const [openGoalModal, setOpenGoalModal] = useState(false);
    const [openBioModal, setOpenBioModal] = useState(false);

    const [loading, setLoading] = useState(false);
    const [onChange, setOnChange] = useState({
        nickname: true,
        location: true,
    });

    const handleSubmitUserProfile = async () => {
        if (avatar.uploaded === false || background.uploaded === false) {
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '图片正在上传，请稍后再试' }));
            return;
        }
        if (avatar.error || background.error) {
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '图片上传出错，请稍后再试' }));
            return;
        }
        
        setLoading(true);
        const newValue = {
            username: currentUser.username,
            nickname,
            gender, 
            birthday: birthday !== '' ? getDateFormat(new Date(birthday)) : getDateFormat(new Date()),
            bio,
            avatar: avatar.url,
            background_image: background.url,
            coordinate: (latitude && longtitude) ? `${longtitude},${latitude}` : undefined,
            tags,
            goal,
            horoscope,
        }

        const response = await updateUserProfile({ username: currentUser.username, body: newValue });
        if (response.data) {
            if (latitude && longtitude) dispatch(locationActions.updateCurrentCoordinate({ latitude, longitude: longtitude }));
            navigation.goBack();
        }

        setLoading(false);
    };

    const openUploadAvatarModal = () => {
        if (uploaAvatardRef.current) {
            uploaAvatardRef.current.selectFiles();
        }
    }   

    const openUploadBackgroundModal = () => {
        if (uploaBackgroundRef.current) {
            uploaBackgroundRef.current.selectFiles();
        }
    }

    const updateAvatar = (file) => {
        if (file.length > 0) setNewAvatar({ ...file[0], uploaded: false });
    };

    const updateBackground = (file) => {
        if (file.length > 0) setNewBackground({ ...file[0], uploaded: false });
    };

    const sourceAvatar = () => {
        if (newAvatar?.file?.uri) {
            return { uri : newAvatar?.file?.uri };
        }
        if (avatar.file?.uri) {
            return { uri : avatar.file.uri };
        }
        if (avatar.url) {
            return { uri : `${urlConstants.images}/${avatar.url}` };
        }
        return require('@xcoolsports/static/avatar.jpg');
    };

    const sourceBackground = () => {
        if (newBackground?.file?.uri) {
            return { uri : newBackground?.file?.uri };
        }
        if (background.file?.uri) {
            return { uri : background.file.uri };
        }
        if (background.url) {
            return { uri : `${urlConstants.images}/${background.url}` };
        }
        return;
    };

    useEffect(() => () => { isMounted.current = false; }, []);

    return <Container 
        header={{ 
            title: `${t('编辑资料')}`, 
            headerTitle: { showTitle: true }, 
            headerLeft: { onPress: navigation.goBack },
            headerRight: {},
        }}
    >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} vertical>
            <Pressable hitSlop={10} onPress={openUploadBackgroundModal}>
                {(newBackground?.file?.uri || background.file?.uri || background.url)
                    ?
                        <ImageBackground
                            source={sourceBackground()} 
                            resizeMode="cover"
                            style={styles.imageBackground} 
                        >
                            {background.progress && <View style={[styles.uploading, { backgroundColor: theme.fill_placeholder}]}>
                                <ActivityIndicator color={theme.text_color} size="small" />
                                <Text style={{color: theme.text_color}}> {background.progress} </Text>
                                <Text style={{color: theme.text_color}}> % </Text>
                            </View>}

                            <View style={[styles.backgroundEdit, {backgroundColor: theme.fill_mask}]}>
                                <AntDesign name="edit" size={theme.icon_size_sm} color={theme.fill_base} />
                            </View>
                        </ImageBackground>
                    :
                        <View
                            style={[{
                                ...styles.imageBackground,
                                backgroundColor: theme.fill_placeholder,
                                justifyContent: 'center', alignItems: 'center',
                            }]}
                        >
                            <Text style={[{ color: theme.text_color, fontWeight: 'bold' }]}>{t('背景照片可以让个人主页更漂亮哦')}</Text>
                        </View>
                }
            </Pressable> 

            <FilePicker 
                ref={uploaBackgroundRef} 
                fileType={FilePicker.FILE_TYPES.PHOTO}
                fullScreen
                limit={1}
                selectedFiles={[]}
                onSelect={updateBackground}
                fileUploader={backgroundFileUploader}
                onCancel={() => setNewBackground(undefined)}
            />
            <FileUploader
                ref={backgroundFileUploader}
                uploadQueue={newBackground?.uploaded === false && !newBackground?.error ? [newBackground] : []}
                onProgress={(file, progress) => {if (isMounted.current) setBackground({...file, progress})}}
                onDone={(file, url) => {if (isMounted.current) setBackground({...file, url, uploaded: true})}}
                onError={(file) => {if (isMounted.current) setBackground({...file, error: true})}}
                invisible
            /> 

            <Pressable hitSlop={10} onPress={openUploadAvatarModal} style={[styles.avatarContainer, {borderColor: theme.fill_base}]}>
                <Image 
                    containerStyle={[styles.avatar, {backgroundColor: theme.fill_base}]} 
                    isSelectedUploading={avatar.progress !== undefined}
                    progress={avatar.progress}
                    source={sourceAvatar()} 
                    resizeMode="cover"
                />

                <View style={[styles.avatarEdit, {backgroundColor: theme.fill_mask}]}>
                    <AntDesign name="edit" size={theme.icon_size_xxs} color={theme.fill_base} />
                </View> 
            </Pressable>

            <FilePicker
                ref={uploaAvatardRef} 
                fileType={FilePicker.FILE_TYPES.PHOTO}
                fullScreen
                limit={1}
                selectedFiles={[]}
                onSelect={updateAvatar}
                fileUploader={avatarFileUpLoader}
                onCancel={() => { setNewAvatar(undefined); }}
            />
            <FileUploader
                ref={avatarFileUpLoader}
                uploadQueue={newAvatar?.uploaded === false && !newAvatar?.error ? [newAvatar] : []}
                onProgress={(file, progress) => {if (isMounted.current) setAvatar({...file, progress})}}
                onDone={(file, url) => {if (isMounted.current) setAvatar({...file, url, uploaded: true})}}
                onError={(file) => {if (isMounted.current) setAvatar({...file, error: true})}}
                invisible
            />   

            <ScrollView style={styles.nonImageContainer} showsVerticalScrollIndicator={false} vertical>
                {/* Username */}
                <View style={[styles.row, {borderBottomColor: theme.fill_disabled}]}>
                    <Text style={{color: theme.text_color}}> {t('顽酷账户')} </Text>
                    <Text style={[styles.text, {color: theme.text_color}]} numberOfLines={1}> {currentUser.username} </Text>
                </View>
                
                {/* Nickname */}
                <Pressable hitSlop={10} onPress={() => setOpenNicknameModal(true)} style={[styles.row, {borderBottomColor: theme.fill_disabled}]}>
                    <Text style={{color: theme.text_color}}> {t('顽酷用户名')} </Text>
                    <View style={styles.text}>
                        <Text style={{color: theme.text_color}} numberOfLines={1}> {nickname}  </Text>
                        <AntDesign name="edit" size={theme.icon_size_xxs} color={theme.fill_mask} />
                    </View>
                </Pressable>

                {/* Gender */}
                <Pressable hitSlop={10} onPress={() => setOpenGenderModal(true)} style={[styles.row, {borderBottomColor: theme.fill_disabled}]}>
                    <Text style={{color: theme.text_color}}> {t('性别')} </Text>
                    <View style={styles.text}>
                        <Text style={{color: theme.text_color}} numberOfLines={1}> {t(gender)}  </Text>
                        <AntDesign name="edit" size={theme.icon_size_xxs} color={theme.fill_mask} />
                    </View>
                </Pressable>
                
                {/* Birthday */}
                <Pressable hitSlop={10} onPress={() => setOpenBirthdayModal(true)} style={[styles.row, {borderBottomColor: theme.fill_disabled}]}> 
                    <Text style={{color: theme.text_color}}> {t('生日')} </Text>
                    <View style={styles.text}>
                        <Text style={{color: theme.text_color}} numberOfLines={1}> { birthday !== '' ? getDateFormat(new Date(birthday)) : '' } </Text>
                        <AntDesign name="edit" size={theme.icon_size_xxs} color={theme.fill_mask} />
                    </View>
                </Pressable>

                {/* Distance */}
                <Pressable hitSlop={10} onPress={() => setOpenLocationModal(true)} style={[styles.row, {borderBottomColor: theme.fill_disabled}]}> 
                    <Text style={{color: theme.text_color}}> {t('地址')} </Text>
                    <View style={styles.text}>
                        <Text style={{color: theme.text_color}} numberOfLines={1}> {(longtitude && latitude) ? location : ''}  </Text>
                        <AntDesign name="edit" size={theme.icon_size_xxs} color={theme.fill_mask} />
                    </View>
                </Pressable>

                {/* Interest */}
                <Pressable hitSlop={10} onPress={() => setOpenTagsModal(true)} style={[styles.row, {borderBottomColor: theme.fill_disabled}]}> 
                    <Text style={{color: theme.text_color}}> {t('兴趣爱好')} </Text>
                    <View style={styles.text}>
                        <Text style={{color: theme.text_color}} numberOfLines={1}> {tags.join(", ")}  </Text>
                        <AntDesign name="edit" size={theme.icon_size_xxs} color={theme.fill_mask} />
                    </View>
                </Pressable>

                {/* Zodiac Sign */}
                <Pressable hitSlop={10} onPress={() => setOpenHoroscropeModal(true)} style={[styles.row, {borderBottomColor: theme.fill_disabled}]}> 
                    <Text style={{color: theme.text_color}}> {t('星座')} </Text>
                    <View style={styles.text}>
                        <Text style={{color: theme.text_color}} numberOfLines={1}> {t(horoscope)}  </Text>
                        <AntDesign name="edit" size={theme.icon_size_xxs} color={theme.fill_mask} />
                    </View>
                </Pressable>

                {/* Goal */}
                <Pressable hitSlop={10} onPress={() => setOpenGoalModal(true)} style={[styles.row, {borderBottomColor: theme.fill_disabled}]}> 
                    <Text style={{color: theme.text_color}}> {t('匹配目的')} </Text>
                    <View style={styles.text}>
                        <Text style={{color: theme.text_color}} numberOfLines={1}> {goal.map((g) => t(g)).join(', ')}  </Text>
                        <AntDesign name="edit" size={theme.icon_size_xxs} color={theme.fill_mask} />
                    </View>
                </Pressable>

                {/* Bio */}
                <Pressable hitSlop={10} onPress={() => setOpenBioModal(true)} style={[styles.row, {borderBottomColor: theme.fill_disabled}]}> 
                    <Text style={{color: theme.text_color}}> {t('个人简介')} </Text>
                    <View style={styles.text}>
                        <Text style={{color: theme.text_color}} numberOfLines={1}> {bio}  </Text>
                        <AntDesign name="edit" size={theme.icon_size_xxs} color={theme.fill_mask} />
                    </View>
                </Pressable>

                <SecondaryContainedButton 
                    buttonFreeStyle={{height: 50, marginVertical: theme.v_spacing_2xl }} 
                    textFreeStyle={{fontSize: theme.font_size_heading}}
                    loading={loading}
                    onPress={handleSubmitUserProfile}
                    disabled={nickname === '' || !onChange.nickname}
                    buttonText={t('修改完成')} 
                />
            </ScrollView>

            {/* Nickname */}
            <SlideUpModal
                title={`${t('顽酷用户名')}`}
                onClose={() => setOpenNicknameModal(false)}
                visible={openNicknameModal}
                onOk={() => setOpenNicknameModal(false)}
                okTitle={`${t('确定')}`}
                disableOk={false}
            >
                <View style={styles.modalContainer}>
                    <View style={{...styles.inputContainerDefault, ...(onChange.nickname ? {} : styles.inputContainerError)}}>
                        <TextInput
                            style={[styles.input, {color: theme.text_color}]}
                            placeholder={`${t('顽酷用户名')}`}
                            onChangeText={(text) => {
                                setNickname(text);
                                setOnChange((prev) => ({
                                    ...prev,
                                    nickname: regexChecker('nickname', text)
                                }));
                            }}
                            placeholderTextColor={theme.secondary_variant}
                            value={nickname}
                            blurOnSubmit={false}
                            onSubmitEditing={({ nativeEvent: { text }}) => { 
                                setOnChange((prev) => ({
                                    ...prev,
                                    nickname: regexChecker('nickname', text)
                                }));
                                setOpenNicknameModal(false);
                            }}
                        />
                    </View>
                    <Text style={styles.error}>{!onChange.nickname && t(templateConstants.auth_patterns_error['nickname'])}</Text>
                </View>
            </SlideUpModal>

            {/* Gender */}
            <SlideUpModal
                title={`${t('请选择性别')}`}
                onClose={() => setOpenGenderModal(false)}
                visible={openGenderModal}
            >
                <View style={styles.modalContainer}>
                    <RadioButton.Group onValueChange={newValue => setGender(newValue)} value={gender}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {[{label: '不展示', value: ''}, {label: '男', value: '男'}, {label: '女', value: '女'}, {label: '其他', value: '其他'}].map(sub => ({ label: sub.label, value: sub.value })).map(({label, value}) =>
                                <View key={label} style={[styles.radio]}>
                                    <RadioButton.Item 
                                        color={theme.text_color}
                                        labelStyle={{color: theme.text_color}}
                                        mode="android" 
                                        position="leading" 
                                        label={t(label)} 
                                        value={value}
                                    />
                                </View>
                            )}
                        </View>
                    </RadioButton.Group>
                </View>
            </SlideUpModal>

            {/* Birthday */}   
            <DatePicker
                theme={skin === 'dark' ? 'dark' : 'light'}
                textColor={theme.text_color}
                modal
                title={`${t('生日')}`}
                open={openBirthdayModal}
                date={new Date(birthday)}
                mode='date'
                onConfirm={(date) => {
                    // Adjust the date to UTC before setting
                    setOpenBirthdayModal(false);
                    setBirthday(new Date(date.getTime() - date.getTimezoneOffset() * 60000));
                }}
                onCancel={() => setOpenBirthdayModal(false)}
            />

            {/* Location */}
            <SlideUpModal
                title={`${t('地址')}`}
                onClose={() => setOpenLocationModal(false)}
                visible={openLocationModal}
                okTitle={t('搜索')}
                onOk={() => getForwardGeocoding({ location })}
                disableOk={location === ''}
            >
                <View style={[styles.modalContainer, { maxHeight: 300, marginVertical: 0 }]}>
                    <View style={[{...styles.inputContainerDefault, ...(onChange.location ? {} : styles.inputContainerError)}, {backgroundColor: theme.fill_placeholder}]}>
                        <TextInput
                            style={[styles.input, {color: theme.text_color}]}
                            placeholder={t('地址')}
                            onChangeText={(text) => {
                                setLocation(text);
                                setOnChange((prev) => ({
                                    ...prev,
                                    location: regexChecker('address', text)
                                }));
                            }}
                            placeholderTextColor={theme.secondary_variant}
                            value={location}
                            blurOnSubmit={false}
                            onSubmitEditing={({ nativeEvent: { text }}) => { 
                                setOnChange((prev) => ({
                                    ...prev,
                                    location: regexChecker('address', text)
                                }));
                                getForwardGeocoding({ location });
                            }}
                        />

                        {location !== '' && 
                            <Pressable 
                                hitSlop={10} 
                                onPress={() => {
                                    setLocation('');
                                    setOnChange((prev) => ({
                                        ...prev,
                                        location: regexChecker('address', '')
                                    }));
                                    setLongtitude();
                                    setLatitude();
                                }} 
                                style={styles.icon}
                            >
                                <Ionicons name="close-circle" size={theme.icon_size_xxs} color={theme.fill_mask} />
                            </Pressable>
                        }
                    </View>
                    <Text style={styles.error}>{!onChange.location && t(templateConstants.auth_patterns_error['address'])}</Text>

                    <ScrollView>
                        {result?.currentData?.features?.map((place) => 
                            <Pressable 
                                key={place.id}
                                onPress={() => {
                                    setLocation(place.place_name);
                                    setLongtitude(place?.geometry?.coordinates[0]);
                                    setLatitude(place?.geometry?.coordinates[1]);
                                    setOnChange((prev) => ({
                                        ...prev,
                                        location: regexChecker('address', place.place_name)
                                    }));
                                }}
                                style={({ pressed }) => [pressed ? { opacity: 0.85, backgroundColor: theme.fill_placeholder } : {}]}
                            >
                                <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color }}>{place.place_name}</Text>
                            </Pressable>
                        )}
                    </ScrollView>
                </View>
            </SlideUpModal>

            {/* Interests */}
            <SlideUpModal
                title={t("请选择兴趣爱好")}
                onClose={() => setOpenTagsModal(false)}
                visible={openTagsModal}
                onOk={() => setOpenTagsModal(false)}
                okTitle={t("确定")}
                disableOk={tags.length === 0}
            >
                <View style={styles.modalContainer}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                        {totalTags.map((tag) => 
                            <Chip 
                                key={tag} 
                                mode="outlined" 
                                closeIcon="close"
                                onPress={() => {
                                    if (!tags.includes(tag)) setTags((prev) => prev.concat(tag));
                                    else setTags((prev) => prev.filter((t) => t !== tag));
                                }}
                                style={tags.includes(tag)
                                    ? { fontSize: theme.font_size_base, backgroundColor: theme.primary_variant, margin: theme.v_spacing_xs } 
                                    : { fontSize: theme.font_size_base, backgroundColor: theme.fill_base, margin: theme.v_spacing_xs }}
                                textStyle={tags.includes(tag)
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
                            placeholderTextColor={theme.secondary_variant}
                            placeholder={t("你的爱好")}
                            value={addTag}
                            onChangeText={(text) => {
                                setAddTag(text);
                            }}
                            onSubmitEditing={({ nativeEvent: { text }}) => {
                                setAddTag('');
                                dispatch(configActions.addTags(addTag));
                            }}
                        />

                        <SecondaryContainedButton 
                            buttonFreeStyle={{width: 80,height: 45}} 
                            textFreeStyle={{fontSize: theme.font_size_base}}
                            onPress={() => {
                                setAddTag('');
                                dispatch(configActions.addTags(addTag));
                            }}
                            disabled={addTag === ''}
                            buttonText={t('添加')} 
                        />
                    </View> 
                </View> 
            </SlideUpModal>

            {/* Horoscope */}
            <SlideUpModal
                title={`${t('星座')}`}
                onClose={() => setOpenHoroscropeModal(false)}
                visible={openHoroscopeModal}
            >
                <View style={styles.modalContainer}>
                    <RadioButton.Group onValueChange={newValue => setHoroscope(newValue)} value={horoscope}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {templateConstants.signs.map(sub => ({ label: sub, value: sub })).map(({label, value}) =>
                                <View key={label} style={[styles.radio]}>
                                    <RadioButton.Item 
                                        color={theme.text_color}
                                        labelStyle={{color: theme.text_color}}
                                        mode="android" 
                                        position="leading" 
                                        label={t(label)} 
                                        value={value}
                                    />
                                </View>
                            )}
                        </View>
                    </RadioButton.Group>
                </View>
            </SlideUpModal>

            {/* Goal */}
            <SlideUpModal
                title={`${t('请选择匹配目的')}`}
                onClose={() => setOpenGoalModal(false)}
                visible={openGoalModal}
            >
                <View style={styles.modalContainer}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                        {templateConstants.goals.map((g) => 
                            <Chip 
                                key={g} 
                                mode="outlined" 
                                closeIcon="close"
                                onPress={() => {
                                    if (!goal.includes(g)) setGoal((prev) => prev.concat(g));
                                    else setGoal((prev) => prev.filter((t) => t !== g));
                                }} 
                                style={goal.includes(g)
                                    ? { fontSize: theme.font_size_base, backgroundColor: theme.primary_variant, margin: theme.v_spacing_xs } 
                                    : { fontSize: theme.font_size_base, backgroundColor: theme.fill_base, margin: theme.v_spacing_xs }}
                                textStyle={goal.includes(g)
                                    ? { color: theme.fill_base }
                                    : { color: theme.secondary_variant }}
                            >{t(g)}</Chip>
                        )}
                    </View>
                </View>
            </SlideUpModal>

            {/* Bio */}
            <SlideUpModal
                title={`${t('个人简介')}`}
                onClose={() => setOpenBioModal(false)}
                visible={openBioModal}
                onOk={() => setOpenBioModal(false)}
                okTitle={`${t('确定')}`}
                disableOk={false}
            >
                <View style={styles.modalContainer}>
                    <TextInput
                        placeholder={`${t('写下你的个性签名')}`}
                        multiline={true}
                        numberOfLines={10}
                        maxLength={200}
                        clear={true} 
                        style={{ 
                            marginBottom: theme.v_spacing_2xl, height: 200,
                            padding: theme.v_spacing_md, color: theme.text_color,
                            textAlignVertical: 'top'
                        }}
                        placeholderTextColor={theme.secondary_variant}
                        value={bio}
                        onChangeText={(text) => setBio(text)}
                    />
                </View>
            </SlideUpModal>
        </ScrollView>
    </Container>
}

export default UserProfile;
