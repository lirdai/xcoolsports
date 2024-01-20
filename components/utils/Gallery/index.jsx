import React, { useState, useCallback, useContext } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, BackHandler, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import Carousel from '../Carousel';
import theme, {ThemeContext} from '../../../constants/theme';
import urlConstants from '../../../constants/urls';
import ImageHolder from '../Image';

const styles = StyleSheet.create({
    singleImageUpload: { 
        position: 'relative', 
        width: "100%", 
        height: 200,
    },
    imageUploadGallery: {
        flexDirection: "row", 
        flexWrap: "wrap",
        width: '100%',
    },
    imageUpload: {
        aspectRatio: 1,
        padding: 1,
        width: '33%',
    },
    imageEditGallery: {
        flexDirection: "row", 
        width: "100%",
    },
    imageEdit: {
        position: "relative", 
        width: Dimensions.get('window').width * 0.3333,
        aspectRatio: 1,
        margin: theme.v_spacing_xs,
    },
    uploadButton: {
        position: "relative", 
        width: Dimensions.get('window').width * 0.3333,
        aspectRatio: 1,
        margin: theme.v_spacing_xs,
        opacity: 0.65,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    album: {
        padding: 5,
        width: '50%',
    },
});

const STATE = {
    EDIT: 'EDIT',
    DISPLAY: 'DISPLAY',
    SELECT: 'SELECT',
    UPLOAD: 'UPLOAD',
    ALBUMS: 'ALBUMS',
    SINGLE_UPLOAD: 'SINGLE_UPLOAD',
    MULTIPLE_UPLOAD: 'MULTIPLE_UPLOAD',
};

const getScreenSize = (windowWidth) => {
    if (windowWidth < 639) {
        return {
            'image': {
                width:'100%', 
                height: 500,
            }
        }
    }

    if (windowWidth < 767) {
        return {
            'image': {
                width:'100%', 
                height: 650,
            }
        }
    }

    return {
        'image': {
            width:'100%', 
            height: 850,
        }
    }
};

const Gallery = ({ 
    galleryState, galleryContent,
    openUploadModal, handleDeleteMedia, isSelectedUploading, progress, currentUploadFile, source, // all should be part of renderOverlay
}) => {
    const [containerWidth, setContainerWidth] = useState(0);
    const [fullScreen, setFullScreen] = useState(false);
    const [imageInfo, setImageInfo] = useState({});
    const [openImageModal, setOpenImageModal] = useState(false);
    const windowWidth = Dimensions.get('window').width;
    const windowSize = getScreenSize(windowWidth);
    const theme = useContext(ThemeContext);

    const onGoBack = () => {
        // true is not going back, false is going back
        if (fullScreen) {
            setFullScreen(false);
            return true;
        } 

        return false;
    };
      
    useFocusEffect(useCallback(() => {
        const backLisener = BackHandler.addEventListener("hardwareBackPress", onGoBack);
        return () => backLisener.remove()
    }, [fullScreen]));

    switch (galleryState) {
        case STATE.SINGLE_UPLOAD:
            return <ImageHolder 
                containerStyle={styles.singleImageUpload}
                isSelectedUploading={isSelectedUploading}
                progress={progress}
                editMode={false}
                showloading
                showActivity
                source={source}
            />           
        case STATE.MULTIPLE_UPLOAD: 
            return <View style={styles.imageUploadGallery} onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
                    {galleryContent.map((file) =>
                        <ImageHolder 
                            key={file.key}
                            containerStyle={[styles.imageUpload, {width: containerWidth* 0.333}]}
                            isSelectedUploading={currentUploadFile === file.file.fileName}
                            progress={progress}
                            editMode={false}
                            showloading
                            showActivity
                            source={{ uri: file.file.uri }}
                        />    
                    )}
                </View>
        case STATE.EDIT:
            return (
                <View style={styles.imageEditGallery}>
                    {galleryContent.map((file) =>
                        <Pressable key={file.key ? file.key : file.url} onPress={() => { setImageInfo(file); setOpenImageModal(true); }}>
                            <ImageHolder 
                                key={file.key ? file.key : file.url}
                                containerStyle={styles.imageEdit}
                                isSelectedUploading={file.progress !== undefined}
                                progress={file.progress}
                                editMode
                                handleDeleteMedia={() => handleDeleteMedia(file)}
                                showloading
                                showActivity
                                source={{ uri: file.file?.uri ? file.file.uri : `${urlConstants.images}/${file.url}` }}
                            />  
                        </Pressable>
                    )}

                    <Pressable onPress={openUploadModal} style={[styles.uploadButton, {backgroundColor: theme.fill_placeholder}]}>
                        <Text style={{ fontSize: 45, color: theme.secondary_variant, opacity: 0.65 }}> + </Text>
                    </Pressable>

                    <Modal         
                        presentationStyle='fullScreen'
                        visible={openImageModal}
                        onRequestClose={() => setOpenImageModal(false)}
                    >               
                        <Pressable onPress={()=> setOpenImageModal(false)}  style={{ backgroundColor: theme.fill_placeholder, flex: 1 }}>
                            <ImageHolder 
                                resizeMode="contain"
                                isSelectedUploading={false}
                                editMode={false}
                                showloading
                                showActivity
                                source={{ uri: imageInfo?.file?.uri ? imageInfo?.file.uri : `${urlConstants.images}/${imageInfo.url}` }}
                            /> 
                        </Pressable>
                    </Modal>
                </View>
            );
        case STATE.DISPLAY:
            const dotsExist = galleryContent.length > 1;
            
            return (
                <Carousel
                    dots={dotsExist}
                    style={windowSize.image}
                    pageStyle={windowSize.image}
                    fullScreen={fullScreen}
                >
                    {galleryContent.map((img) =>
                        <Pressable key={img.url} onPress={()=> setFullScreen(!fullScreen)}>
                            <ImageHolder 
                                resizeMode="contain"
                                isSelectedUploading={false}
                                editMode={false}
                                showloading
                                showActivity
                                source={img.url ? { uri: `${urlConstants.images}/${img.url}`} : require('@xcoolsports/static/avatar.jpg')}
                            /> 
                        </Pressable>
                    )}
                </Carousel>
            );
        default:
            return <Text>出错了</Text>
    }
};

Gallery.STATE = STATE;
Gallery.defaultProps = {
    onPressItem: () => {},
};

export default Gallery;