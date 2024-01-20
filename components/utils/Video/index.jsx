import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, BackHandler } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Slider } from '@miblanchard/react-native-slider';
import { ActivityIndicator } from 'react-native-paper';

import { Video } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons'; 

import crypto from '@xcoolsports/utils/crypto';
import theme, {ThemeContext} from '../../../constants/theme';
import ImageHolder from '../Image';

const videoPlayerStyles = StyleSheet.create({
    videoContainerTiny: {
        width: '100%',
    },
    videoContainerSmall: {
        width: '100%',
        height: 200,
    },
    videoContainerBigSmallScreen: {
        width: '100%',
        height: 500,
    },
    videoContainerBigMediumScreen: {
        width: '100%',
        height: 650,
    },
    videoContainerBigLargeScreen: {
        width: '100%',
        height: 850,
    },
    videoTiny: {
        height: '100%',
        width: '100%',
    },
    videoSmall: {
        height: 200,
        width: '100%',
    },
    videoBigSmallScreen: {
        height: 500,
        width: '100%',
    },
    videoBigMediumScreen: {
        height: 650,
        width: '100%',
    },
    videoBigLargeScreen: {
        height: 850,
        width: '100%',
    },
    videoFullScreen: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteIcon: { 
        position: 'absolute', 
        zIndex: 10, 
        top: 5, 
        left: 5, 
    },
    videoBanner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        height: 24,
        left: 0,
        right: 0,
        paddingHorizontal: theme.h_spacing_sm,
    },
    uploading: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',  
        width: '100%', 
        height: '100%', 
        position: 'absolute', 
        zIndex: 20, 
        opacity: 0.65,
    },
});

const resizeMode = {
    'Tiny': 'cover'
}

const getScreenSize = (windowWidth) => {
    if (windowWidth < 639) {
        return {
            'videoContainerTiny': videoPlayerStyles.videoContainerTiny,
            'videoContainerSmall': videoPlayerStyles.videoContainerSmall,
            'videoContainerBig': videoPlayerStyles.videoContainerBigSmallScreen,
            'videoTiny': videoPlayerStyles.videoTiny,
            'videoSmall': videoPlayerStyles.videoSmall,
            'videoBig': videoPlayerStyles.videoBigSmallScreen,
        }
    }

    if (windowWidth < 767) {
        return {
            'videoContainerTiny': videoPlayerStyles.videoContainerTiny,
            'videoContainerSmall': videoPlayerStyles.videoContainerSmall,
            'videoContainerBig': videoPlayerStyles.videoContainerBigMediumScreen,
            'videoTiny': videoPlayerStyles.videoTiny,
            'videoSmall': videoPlayerStyles.videoSmall,
            'videoBig': videoPlayerStyles.videoBigMediumScreen,
        }
    }

    return {
        'videoContainerTiny': videoPlayerStyles.videoContainerTiny,
        'videoContainerSmall': videoPlayerStyles.videoContainerSmall,
        'videoContainerBig': videoPlayerStyles.videoContainerBigLargeScreen,
        'videoTiny': videoPlayerStyles.videoTiny,
        'videoSmall': videoPlayerStyles.videoSmall,
        'videoBig': videoPlayerStyles.videoBigLargeScreen,
    }
};

const VideoPlayer = ({
    displayMode, isSelectedUploading, process, handleDeleteMedia,
    source, shouldPlay, meta, onFullscreen = () => {}, styles
}) => {
    const videoRef = useRef(null);
    const slidingRef = useRef(false);
    const videoUiRef = useRef(null);
    const presentFullscreenPlayerRef = useRef(false);
    const videoDuration = useRef();
    const videoCurrent = useRef();
    const theme = useContext(ThemeContext);

    const [error, setError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(shouldPlay || false);
    const [isBuffering, setIsBuffering] = useState(true);
    const [isEnded, setIsEnded] = useState(false);
    const [presentFullscreenPlayer, setPresentFullscreenPlayer] = useState(false);
    const [videoPosition, setVideoPosition] = useState(0);
    const [sliderOpacity, setSliderOpacity] = useState(1);
    const [screenShot, setScreenShot] = useState(null);

    const insets = useSafeAreaInsets();
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height-insets.top-insets.bottom;
    const windowSize = getScreenSize(windowWidth);
    const containerStyle = windowSize[`videoContainer${displayMode}`];
    const videoStyle = windowSize[`video${displayMode}`];

    const handleVideoOnLoad = (e) => {
        videoDuration.current = e.durationMillis; 
        if (shouldPlay) { 
            videoRef.current?.playAsync(); 
        }
    };

    const handlePlaybackStatusUpdate = (playbackStatus) => {
        if (playbackStatus?.positionMillis !== undefined && playbackStatus?.durationMillis !== undefined) {
            setVideoPosition(playbackStatus.positionMillis / playbackStatus.durationMillis);
            videoCurrent.current = playbackStatus.positionMillis;
        }
        if (playbackStatus.isPlaying) {
            setIsPlaying(true);
            setIsEnded(false)
        } else {
            setIsPlaying(false);
        }
        if (playbackStatus.isBuffering) setIsBuffering(true); else setIsBuffering(false);
        if (playbackStatus.didJustFinish) setIsEnded(true);
    };

    const handleSlidingComplete = (slidePosition) => {
        if (videoDuration.current && slidingRef.current) {
            videoRef.current?.playFromPositionAsync(slidePosition * videoDuration.current);
            slidingRef.current = false;
            handleVideoUiTouched();
            setIsEnded(false)
        }
    };

    const showTwoNumber = (number) => {
        if (number) {
            const numberInt = Math.floor(number);
            if (numberInt < 10) {
                return `0${numberInt}`;
            } 
    
            return `${numberInt}`
        }

        return '00'
    };

    const generateThumbnail = async () => {
        try {
            const md5 = crypto.createHash('md5').update(source.uri).digest('hex');
            const cacheFile = `${FileSystem.cacheDirectory}/VideoThumbnails/${md5}`;
            const { exists } = await FileSystem.getInfoAsync(cacheFile);
            if (!exists) {
                const { uri } = await VideoThumbnails.getThumbnailAsync(source.uri);
                await FileSystem.moveAsync({from: uri, to: cacheFile});   
            }
            setScreenShot(cacheFile);
        } catch(error) {
            console.warn(error);
        }
    };

    const onGoBack = () => {
        if (presentFullscreenPlayerRef.current ) {
            onFullscreen(false);
            setPresentFullscreenPlayer(false);
            return true;
        } else {
            return false;
        }
    };

    const renderCenterButton = () => {
        if (isBuffering) return <ActivityIndicator size="small" color={theme.fill_base_4} />
        if (!isPlaying) {
            if (isEnded) return <MaterialIcons name="replay" size={60} color={theme.fill_base_4} />
            else return <MaterialIcons name="play-arrow" size={60} color={theme.fill_base_4} />
        }
        return null;
    }

    useEffect(() => {
        presentFullscreenPlayerRef.current = presentFullscreenPlayer;
    }, [presentFullscreenPlayer]);

    const handleVideoUiTouched = () => {
        if (videoUiRef.current !== null) {
            clearTimeout(videoUiRef.current);
        }
        setSliderOpacity(1)
        videoUiRef.current = setTimeout(() => setSliderOpacity(0), 3000);
    }

    useEffect(() => {
        if (displayMode === 'Tiny') {
            generateThumbnail();
        }

        const backLisener = BackHandler.addEventListener("hardwareBackPress", onGoBack);
        return () => { 
            onFullscreen(false);
            backLisener.remove();
            if (videoUiRef.current !== null) {
                clearTimeout(videoUiRef.current);
            }
        }
    }, []);

    const timeBar= (time) => {
        return `${showTwoNumber(time / (1000*60) % 60)}:${showTwoNumber((time / 1000) % 60)}`;
    };
    const timeBarShow = `${timeBar(videoCurrent.current)} / ${timeBar(videoDuration.current)}`;

    return (
        <View style={[containerStyle, presentFullscreenPlayer ? { height: windowHeight } : {}]}>
            {isSelectedUploading && 
                <View style={[videoPlayerStyles.uploading, {backgroundColor: theme.fill_base}]}>
                    <ActivityIndicator color={theme.fill_base} size="small" />
                    <Text style={{ color: theme.fill_base }}> {`${process} %`} </Text>
                </View>
            }

            {handleDeleteMedia && 
                <Pressable style={videoPlayerStyles.deleteIcon} onPress={handleDeleteMedia}>
                    <AntDesign name="closesquare" size={theme.icon_size_xs} color={theme.fill_base} />
                </Pressable>
            }

            {displayMode === 'Tiny' 
                ? 
                <ImageHolder 
                    style={[videoStyle, {backgroundColor: theme.fill_base}]}
                    isSelectedUploading={false}
                    editMode={false}
                    showloading
                    source={screenShot ? { uri: screenShot } : undefined}
                    resizeMode="cover"
                />       
                : 
                <Video 
                    ref={videoRef}
                    source={source}
                    rate={1.0}
                    volume={1.0}
                    resizeMode={resizeMode[displayMode] || 'contain'}
                    shouldPlay={false}
                    style={[videoStyle, presentFullscreenPlayer ? {height: windowHeight, backgroundColor: theme.black_icon} : {backgroundColor: theme.fill_base}]}
                    onLoad={handleVideoOnLoad}
                    onError={() => setError(true)}
                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                />
            }

            {error && <View style={[StyleSheet.absoluteFillObject, styles?.fillObject || {}, {justifyContent: "center", alignItems: 'center'} ]}>
                <FontAwesome name="video-camera" color={theme.fill_mask} size={theme.icon_size_xl}/>
            </View>}

            {displayMode === 'Tiny' && 
                <View style={[videoPlayerStyles.videoBanner, {backgroundColor: theme.black_icon}]}>
                    <AntDesign name="playcircleo" size={theme.icon_size_xs} color={theme.fill_base} />
                    {meta?.duration && <Text style={{ color: theme.fill_base }}>{meta.duration}</Text>}
                </View>
            }

            {(displayMode !== 'Tiny') && 
                <Pressable 
                    style={[StyleSheet.absoluteFillObject, { justifyContent: "center", alignItems: 'center' }]} 
                    onPress={() => {
                        if (isPlaying) {
                            videoRef.current?.pauseAsync();
                        } else {
                            if (isEnded) {
                                videoRef.current?.replayAsync();
                            } else {
                                videoRef.current?.playAsync();
                            }
                        }
                        handleVideoUiTouched();
                    }} 
                >
                    {renderCenterButton()}
                </Pressable>
            }

            {(displayMode !== 'Tiny') && 
                <View style={{ opacity: sliderOpacity, justifyContent: "center", alignItems: 'center', position: 'absolute', bottom: 10, width: '100%', }}>
                    <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', width: '100%', paddingHorizontal: theme.h_spacing_lg * 1.5 }}>
                        <Text style={{ color: theme.text_color }}>{timeBarShow}</Text>
                        
                        {presentFullscreenPlayer
                            ?
                            <Pressable hitSlop={20} onPress={() => { onFullscreen(false); setPresentFullscreenPlayer(false); handleVideoUiTouched(); }}>
                                <MaterialIcons name="fullscreen-exit" size={25} color={theme.text_color} />
                            </Pressable>
                            :                     
                            <Pressable hitSlop={20} onPress={() => { onFullscreen(true); setPresentFullscreenPlayer(true); handleVideoUiTouched(); }}>
                                <MaterialIcons name="fullscreen" size={25} color={theme.text_color} />
                            </Pressable>
                        } 
                    </View>

                     <Slider
                        containerStyle={{ width: "100%" }}
                        minimumValue={0}
                        maximumValue={1}
                        minimumTrackTintColor={theme.white_icon}
                        maximumTrackTintColor={theme.fill_base_4}
                        value={videoPosition}
                        onSlidingStart={()=> slidingRef.current = true}
                        onSlidingComplete={handleSlidingComplete}
                        thumbStyle={{ backgroundColor: theme.white_icon, height: 14, width: 14 }}
                    />
                </View>
            }
        </View>
    );
};

export default VideoPlayer;