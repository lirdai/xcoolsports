import React, { useState, useRef, forwardRef, useImperativeHandle, useContext } from 'react';
import { StyleSheet, View, Text, Modal, Pressable, Platform, Dimensions } from 'react-native';
import { ThemeContext } from '../../../constants/theme';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'

import FilePickerModal from './FilePickerModal';
import ImageHolder from '../Image';
import urlConstants from '../../../constants/urls';
import { toastActions, toastTypes } from '@xcoolsports/data';

const imageTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/tiff', 'image/webp', 'image/gif'];
const videoTypes = ['video/mp4', "video/quicktime", 'video/mpeg', 'video/webm'];
const FILE_TYPES = FilePickerModal.FILE_TYPES;
  
const getPrefix = (fileType) => {
    if (videoTypes.includes(fileType)) {
        return 'videos';
    }

    if (imageTypes.includes(fileType)) {
        return 'images';
    }

    return 'invalid';
};

const getPostfix = (objectName) => {
    const postfixDot = objectName.lastIndexOf('.');
    return postfixDot === -1 ? '' : objectName.substr(postfixDot).toLowerCase();
};

const styles = StyleSheet.create({});

const FilePicker = forwardRef(({ 
    fileType, onSelect, fullScreen, selectedFiles=[], limit=[], fileUploader, onCancel,
}, ref ) => {
    const { t, i18n } = useTranslation();
    const filePickerRef = useRef();
    const dispatch = useDispatch();
    const theme = useContext(ThemeContext);

    const IMAGE_NUM_LIMIT = Math.min(limit, 9);
    const VIDEO_NUM_LIMIT = fileType !== FILE_TYPES.PHOTO ? 1 : 0;
    const IMAGE_SIZE_LIMIT = 52428800;
    const VIDEO_SIZE_LIMIT = 524288000;
    const VIDEO_DURATION_LIMIT = 180;
    const selectionLimit = IMAGE_NUM_LIMIT - selectedFiles.length;
    const allowedMediaType = fileType;

    const [openImageModal, setOpenImageModal] = useState(false);
    const [imageInfo, setImageInfo] = useState({});
    
    const validateSelectedFile = (newFiles) => {
        const allFiles = [...selectedFiles, ...newFiles];
        const numVideos = allFiles.filter((_file) => _file.mediaType === 'videos').length;
        const numImages = allFiles.filter((_file) => _file.mediaType === 'images').length;

        if (numVideos > 0 && numImages > 0) {
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: `${t('不能同时选择照片和视频')}` }));
            return false;
        }

        if (fileType === FILE_TYPES.MIXED) {
            if (numVideos > VIDEO_NUM_LIMIT || numImages > IMAGE_NUM_LIMIT) {
                dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: `${t('最多只能选择')}${IMAGE_NUM_LIMIT}${t('个图片或')}${VIDEO_NUM_LIMIT}${t('个视频')}` }));
                return false;
            }
        } else {
            if (numVideos > 0 || numImages > IMAGE_NUM_LIMIT) {
                dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: `${t('只能选择')}${IMAGE_NUM_LIMIT}${t('个图片')}` }));
                return false;
            }
        }

        for (const file of newFiles) {
            if (file.mediaType === 'videos') {
                if (file.file.fileSize > VIDEO_SIZE_LIMIT) {
                    dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: `${t('视频大小不能超过500MB')}` }));
                    return false;
                }
                if (file.file.duration > VIDEO_DURATION_LIMIT) {
                    dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: `${t('视频时长不能超过')}${VIDEO_DURATION_LIMIT/60}${t('分钟')}` }));
                    return false;
                }
            }
            if (file.mediaType === 'images' && file.file.fileSize > IMAGE_SIZE_LIMIT) {
                dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: `${t('照片大小不能超过50MB')}` }));
                return false;
            }
        }
        return true;
    }

    const selectFiles = () => {
        if (Platform.OS === 'ios') {
            FilePickerModal.launchFilePicker(
                allowedMediaType,
                selectionLimit,
                (response) => { 
                    if (!response.didCancel && response.assets) {
                        const newFiles = response.assets.map((_file) => ({
                            file: _file,
                            key: `${_file.fileName}-${Date.now()}`,
                            mediaType: getPrefix(_file.type),
                            postfix: getPostfix(_file.fileName),
                            uploaded: false,
                        }));

                        if (validateSelectedFile(newFiles)) {
                            if (fullScreen) {
                                setOpenImageModal(true);
                                setImageInfo(newFiles[0]);
                            }
                            onSelect(newFiles);
                        }
                    }
                });
        } else if (filePickerRef.current?.launchFilePicker) {
            filePickerRef.current.launchFilePicker(); // params in component below
        } else {
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: `${t('文件选择器出错啦')}` }));
        }
    };

    useImperativeHandle(ref, () => ({
        selectFiles
    }));

    return  (
        <>
            {Platform.OS === 'android' && <FilePickerModal
                ref={filePickerRef}
                mediaType={allowedMediaType}
                selectionLimit={selectionLimit}
                onResponse={(response) => { 
                    if (fullScreen) {
                        setOpenImageModal(true); 
                        setImageInfo(response[0]);
                    } 
                    onSelect(response);
                }}
                validator={validateSelectedFile}
            />}

            <Modal         
                presentationStyle='fullScreen'
                visible={openImageModal}
                onRequestClose={() => setOpenImageModal(false)}
            >               
                <Pressable 
                    onPress={()=> { onCancel(); setOpenImageModal(false); }} 
                    style={{ backgroundColor: theme.fill_placeholder, flex: 1 }}
                >
                    <ImageHolder 
                        resizeMode="contain"
                        containerStyle={{ height: Dimensions.get('window').height - 100 }}
                        isSelectedUploading={false}
                        editMode={false}
                        showloading
                        showActivity
                        source={{ uri: imageInfo?.file?.uri ? imageInfo?.file.uri : `${urlConstants.images}/${imageInfo.url}` }}
                    /> 
                    
                    <View style={{ width: "100%", height: 100, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Pressable onPress={() => { onCancel(); setOpenImageModal(false); }} style={{ marginHorizontal: 15 }}>
                            <Text style={{ color: theme.fill_base }}>{t('取消')}</Text>
                        </Pressable>

                        <Pressable hitSlop={20} onPress={() => { setOpenImageModal(false); fileUploader?.current?.startUpload(); }} style={{ marginHorizontal: 15 }}>
                            <Text style={{ color: theme.secondary_color }}>{t('确定')}</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
});

FilePicker.FILE_TYPES = FILE_TYPES;

export default FilePicker;
