import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle, useContext } from 'react';
import { StyleSheet, Dimensions, Text, View, Pressable, FlatList } from 'react-native';
import { useDispatch } from 'react-redux';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useTranslation } from 'react-i18next'

import theme, {ThemeContext} from '../../../constants/theme';
import SlideUpModal from '../SlideUpModal';
import Announcement from '../../Toast';
import { RenderAlbum, RenderItem } from './FilePickerItem';
import { toastActions, toastTypes } from '@xcoolsports/data';

const FILE_TYPES = {
    MIXED: 'mixed',
    PHOTO: 'photo',
};
const IMAGE_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/tiff', 'image/webp', 'image/gif'];
const VIDEO_TYPES = ['video/mp4', "video/quicktime", 'video/mpeg', 'video/webm'];
const EXTENSION_TO_MIME_MAP = {
    "bmp" : "image/bmp", 
    "gif"  : "image/gif", 
    "cur"  : "image/ico", 
    "ico"  : "image/ico", 
    "ief"  : "image/ief", 
    "jpeg" : "image/jpeg", 
    "jpg"  : "image/jpeg", 
    "jpe"  : "image/jpeg", 
    "pcx"  : "image/pcx", 
    "png"  : "image/png", 
    "svg"  : "image/svg+xml", 
    "svgz" : "image/svg+xml", 
    "tiff" : "image/tiff", 
    "tif"  : "image/tiff", 
    "djvu" : "image/vnd.djvu", 
    "djv"  : "image/vnd.djvu", 
    "wbmp" : "image/vnd.wap.wbmp", 
    "ras"  : "image/x-cmu-raster", 
    "cdr"  : "image/x-coreldraw", 
    "pat"  : "image/x-coreldrawpattern", 
    "cdt"  : "image/x-coreldrawtemplate", 
    "cpt"  : "image/x-corelphotopaint", 
    "ico"  : "image/x-icon", 
    "art"  : "image/x-jg", 
    "jng"  : "image/x-jng", 
    "bmp"  : "image/x-ms-bmp", 
    "psd"  : "image/x-photoshop", 
    "pnm"  : "image/x-portable-anymap", 
    "pbm"  : "image/x-portable-bitmap", 
    "pgm"  : "image/x-portable-graymap", 
    "ppm"  : "image/x-portable-pixmap", 
    "rgb"  : "image/x-rgb", 
    "xbm"  : "image/x-xbitmap", 
    "xpm"  : "image/x-xpixmap", 
    "xwd"  : "image/x-xwindowdump", 
    "3gpp" : "video/3gpp", 
    "3gp"  : "video/3gpp", 
    "3g2"  : "video/3gpp", 
    "dl"   : "video/dl", 
    "dif"  : "video/dv", 
    "dv"   : "video/dv", 
    "fli"  : "video/fli", 
    "m4v"  : "video/m4v", 
    "mpeg" : "video/mpeg", 
    "mpg"  : "video/mpeg", 
    "mpe"  : "video/mpeg", 
    "mp4"  : "video/mp4", 
    "VOB"  : "video/mpeg", 
    "qt"   : "video/quicktime", 
    "mov"  : "video/quicktime", 
    "mxu"  : "video/vnd.mpegurl", 
    "lsf"  : "video/x-la-asf", 
    "lsx"  : "video/x-la-asf", 
    "mng"  : "video/x-mng", 
    "asf"  : "video/x-ms-asf", 
    "asx"  : "video/x-ms-asf", 
    "wm"   : "video/x-ms-wm", 
    "wmv"  : "video/x-ms-wmv", 
    "wmx"  : "video/x-ms-wmx", 
    "wvx"  : "video/x-ms-wvx", 
    "avi"  : "video/x-msvideo", 
    "movie": "video/x-sgi-movie", 
    "wrf"  : "video/x-webex", 
};

const getPostfix = (objectName) => {
    const postfixDot = objectName.lastIndexOf('.');
    return postfixDot === -1 ? '' : objectName.substr(postfixDot+1).toLowerCase();
}

const getMimeType = (fileName) => {
    return EXTENSION_TO_MIME_MAP[getPostfix(fileName)];    
}

const styles = StyleSheet.create({
    headline: { 
        flexDirection: "row", 
        alignItems: 'center',
        marginBottom: theme.v_spacing_lg,
    },
    error: {
        fontSize: theme.font_size_caption_sm,
        color: theme.brand_error,
        marginBottom: theme.v_spacing_xl,
    },
    secondaryButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    secondaryButtonText: {},
    primaryButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    primaryButtonDisabled: {},
    primaryButtonText: {
        color: theme.brand_primary,
    },
    primaryButtonTextDisabled: {},
});

const FILE_PICKER_MODE = {
    all: false, album: true
};

const FilePickerModal = forwardRef(({ 
    mediaType, selectionLimit, onResponse, validator,
}, ref ) => {
    const { t, i18n } = useTranslation();
    const isMounted = useRef(true);
    const dispatch = useDispatch();
    const theme = useContext(ThemeContext);

    const [openModal, setOpenModal] = useState(false);

    const [isAlbumMode, setIsAlbumMode] = useState(FILE_PICKER_MODE.all)
    
    const [albums, setAlbums] = useState([]);
    const [currentAlbum, setCurrentAlbum] = useState();
    const [files, setFiles] = useState([]);
    const [hasNext, setHasNext] = useState(false);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const hasError = selectedFiles.length === 0
        || selectedFiles.length > selectionLimit;
    const selectedLookUp = selectedFiles.reduce((a, v, i) => ({...a, [v.file.uri]: i}), {});

    const [permission, requestPermission] = MediaLibrary.usePermissions();

    useEffect(() => {
        if (permission && !permission.granted) {
            if (permission.canAskAgain) {
                requestPermission().then(res => {
                    if (!res?.granted) {
                        dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '未获得文件和媒体权限，可能会导致上传功能无法正常使用' }));
                    }
                });
            } else {
                dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '未获得文件和媒体权限，可能会导致上传功能无法正常使用' }));
            }
        }
    }, [permission?.granted])

    const getAllFiles = async (album, after) => {
        if (!permission?.granted) return;
        if (!after) setFiles([]);
        const {endCursor, hasNextPage, totalCount, assets} = await MediaLibrary.getAssetsAsync({
            mediaType: mediaType === FILE_TYPES.MIXED ? [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video] : [MediaLibrary.MediaType.photo],
            album,
            after, // after has different behavior on Android and iOS due to underlying API. iOS: file ID string <-> Android: offset number in String
            first: 300,
            sortBy: 'modificationTime',
        });
        if (!isMounted.current) return;
        const assetsTransformed = await Promise.all(assets.map(_asset => FileSystem.getInfoAsync(_asset.uri, {size: true})
            .then(({size}) => {
                let mediaType = 'unknown';
                if (_asset.mediaType === 'photo') {
                    mediaType = 'images';
                }
                else if (_asset.mediaType === 'video') {
                    mediaType = 'videos';
                }
                return {
                    _asset,
                    // Below is so it's the same as web file API
                    // reconsider if necessary
                    file: {
                        uri: _asset.uri,
                        fileName: _asset.filename,
                        duration: _asset.duration,
                        width: _asset.width,
                        height: _asset.height,
                        fileSize: size,
                        type: getMimeType(_asset.filename),
                    },
                    key: `${_asset.uri}-${Date.now()}`,
                    mediaType,
                };
            })
        ));
        if (!isMounted.current) return;
        if (after !== undefined) {
            setFiles(prev => [...prev, ...assetsTransformed]);
        } else {
            setFiles(assetsTransformed);
        }
        setHasNext(hasNextPage);
    }

    const getAllAlbums = async () => {
        if (!permission?.granted) return;
        const _albums = await MediaLibrary.getAlbumsAsync({includeSmartAlbums: true});
        const albumAssets = await Promise.all(_albums.map(_album => MediaLibrary.getAssetsAsync({
            mediaType: mediaType === FILE_TYPES.MIXED ? [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video] : [MediaLibrary.MediaType.photo],
            album: _album,
            first: 1,
            sortBy: 'modificationTime',
        }).then(({assets, totalCount}) => {            
            let mediaType = 'unknown';
            if (totalCount > 0) {
                if (assets[0].mediaType === 'photo') {
                    mediaType = 'images';
                }
                else if (assets[0].mediaType === 'video') {
                    mediaType = 'videos';
                }
            }
            return {
                ..._album,
                key: `${_album.id}-${Date.now()}`,
                cover: totalCount > 0 ? {...assets[0], mediaType} : undefined,
                totalCount,
            };
        })));
        if (isMounted.current) {
            setAlbums(albumAssets.filter(_album => _album.totalCount > 0));
        }
    }

    const launchFilePicker = async () => {
        // always when open file picker
        setFiles([]);
        setAlbums([]);
        
        if (isMounted.current) {
            setOpenModal(true);
            getAllFiles();
        }
    };

    const handleSelectFile = (file) => {
        const selectIndex = selectedLookUp[file.file.uri];
        if (selectIndex !== undefined) {
            setSelectedFiles(selectedFiles.filter(f => file.file.uri !== f.file.uri));
        } else {
            // validate file size info
            if (file.file?.type === undefined || file.file?.fileSize === undefined) {
                dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '文件格式不支持' }));
                return;
            }
            if (selectionLimit > 1) {
                const selectedFilesAfter = [...selectedFiles, file];
                if (validator(selectedFilesAfter)) {
                    // insert
                    setSelectedFiles(selectedFilesAfter);
                }
            } else {
                if (validator([file])) {
                    // set
                    setSelectedFiles([file]);
                }
            }
        }
    }

    const handleCloseModal = () => {
        setOpenModal(false);
        setFiles([]);
        setAlbums([]);
        setSelectedFiles([]);
        setCurrentAlbum(undefined);
        setIsAlbumMode(FILE_PICKER_MODE.all);
    }

    const handleReturnResponse = () => {
        onResponse(selectedFiles.map(f => ({...f, uploaded: false})));
        setSelectedFiles([]);
        handleCloseModal();
    }

    useEffect(() => () => { isMounted.current = false; }, []);

    const handleToggleMode = () => {
        if (!openModal) return;
        if (isAlbumMode) {
            // toggling to all files mode
            setCurrentAlbum(undefined);
            setAlbums([]);
            getAllFiles();
        } else {
            // toggling to album mode
            setCurrentAlbum(undefined);
            setFiles([]);
            getAllAlbums();
        }
        setIsAlbumMode(!isAlbumMode);
    }

    useImperativeHandle(ref, () => ({
        launchFilePicker
    }));

    const windowHeight = Dimensions.get('window').height;
    const modalHeight = windowHeight * 0.8;
    const keyExtractor = (item) => item.key;
    const renderListItem = ({item}) => <RenderItem
        // key={item.key}
        selectIndex={item.selectIndex}
        uri={item.file.uri}
        mediaType={item.mediaType}
        duration={item.file.duration}
        onPress={()=>handleSelectFile(item)}
        onSelect={()=>handleSelectFile(item)}
    />
    const renderAlbumItem = ({item}) => <RenderAlbum
        // key={item.key}
        item={item}
        onPress={()=>{setCurrentAlbum(item); getAllFiles(item);}}
    />

    return (
        <>
            <SlideUpModal
                onClose={handleCloseModal}
                visible={openModal}
                fullScreen
                title={
                    <View style={styles.headline}>
                        {currentAlbum ?
                            <Pressable style={[styles.secondaryButton, {color: theme.fill_mask}]} onPress={() => setCurrentAlbum(undefined)} > 
                            <Text style={[styles.secondaryButtonText, {color: theme.text_color}]}>{t("返回")}</Text>
                        </Pressable> :
                            <Pressable style={[styles.secondaryButton, {color: theme.fill_mask}]} onPress={handleCloseModal} > 
                            <Text style={[styles.secondaryButtonText, {color: theme.text_color}]}>{t("取消")}</Text>
                        </Pressable>}

                        <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'center' }}>
                            {currentAlbum 
                                ?
                                <Text style={[styles.secondaryButtonText, {color: theme.secondary_color}]}>{currentAlbum.title}</Text>
                                : 
                                <View style={{ width: 150, height: 25, flexDirection: 'row', borderRadius: 20, backgroundColor: theme.secondary_variant }}>
                                    <Pressable 
                                        onPress={handleToggleMode}
                                        style={[{ borderRadius: 20, width: "50%", justifyContent: 'center', alignItems: 'center' }, 
                                        isAlbumMode ? { backgroundColor: theme.secondary_color } : { backgroundColor: theme.secondary_variant }]}
                                    >
                                        <Text style={{ fontSize: 10, color: theme.fill_base }}>{t("选择相簿")}</Text>
                                    </Pressable>

                                    <Pressable 
                                        onPress={handleToggleMode}
                                        style={[{ borderRadius: 20, width: "50%", justifyContent: 'center', alignItems: 'center' }, 
                                        isAlbumMode ? { backgroundColor: theme.secondary_variant } : { backgroundColor: theme.secondary_color }]}
                                    > 
                                        <Text style={{ fontSize: 10, color: theme.fill_base }}>{t("全部相片")}</Text> 
                                    </Pressable>
                                </View>
                        }
                        </View>

                        <Pressable
                            style={hasError ? [styles.primaryButton, styles.primaryButtonDisabled] : styles.primaryButton}
                            disabled={hasError}
                            onPress={handleReturnResponse}
                        >
                            {selectionLimit > 1 ?
                                <Text style={hasError ? [styles.primaryButtonText, styles.primaryButtonTextDisabled, {color: theme.fill_mask}] : styles.primaryButtonText}>{`${selectedFiles.length}/${selectionLimit} ${t('选择')}`}</Text> :
                                <Text style={hasError ? [styles.primaryButtonText, styles.primaryButtonTextDisabled, {color: theme.fill_mask}] : styles.primaryButtonText}>{t("选择")}</Text>
                            }
                        </Pressable>
                    </View>
                }
            >
                {isAlbumMode && !currentAlbum ?
                    <FlatList
                        key='filepicker.album'
                        style={{height: modalHeight}}
                        persistentScrollbar
                        data={albums}
                        keyExtractor={keyExtractor}
                        renderItem={renderAlbumItem}
                        numColumns={2}
                    /> :
                    <FlatList
                        key='filepicker.select'
                        style={{height: modalHeight}}
                        persistentScrollbar
                        data={files.map(_f => ({..._f, selectIndex: selectedLookUp[_f.file.uri]}))}
                        onEndReached={hasNext ? () => getAllFiles(currentAlbum, String(files.length)) : undefined}
                        onEndReachedThreshold={0}
                        keyExtractor={keyExtractor}
                        renderItem={renderListItem}
                        numColumns={3}
                        // optimizations
                        initialNumToRender={3}
                        maxToRenderPerBatch={3}
                        windowSize={3}
                    />
                }
                
                <Announcement/>
            </SlideUpModal>
        </>
    );
});

FilePickerModal.FILE_TYPES = FILE_TYPES;
FilePickerModal.FILE_PICKER_MODE = FILE_PICKER_MODE;

FilePickerModal.defaultProps = {
    validator: () => true,
};

export default FilePickerModal;
