import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import FastImage from 'react-native-fast-image';
import Animated from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons'; 

import theme, {ThemeContext} from '../../../constants/theme';

const imageHolderStyles = StyleSheet.create({
    deleteIcon: { 
        position: 'absolute', 
        zIndex: 10, 
        top: 5, 
        right: 5,
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
});

// containerStyle && source are objects 触发 render
const ImageHolder = ({ 
    containerStyle, isSelectedUploading, progress, editMode, handleDeleteMedia, showloading, showActivity, hasBorder, resizeMode, source, styles,
}) => {
    const [loading, setLoading] = useState(showloading);
    const [error, setError] = useState(false);
    const theme = useContext(ThemeContext);

    const resizeModeStyle = {
        'cover': FastImage.resizeMode.cover,
        'contain': FastImage.resizeMode.contain,
    };

    const imageStyle = () => {
        if (showloading) {
            if (hasBorder) return { width: '100%', height: "100%", borderRadius: 10 };
            else return { width: '100%', height: "100%" };
        } else return { width: '100%', height: "100%", borderRadius: 100 };        
    };

    return (
        <View style={containerStyle}>
            {isSelectedUploading && 
                <View style={[imageHolderStyles.uploading, {backgroundColor: theme.fill_base}]}>
                    {showActivity && <ActivityIndicator color={theme.fill_base} size="small" />}
                    <Text style={{ color: theme.text_color }}> {`${progress}`} </Text>
                    <Text style={{ color: theme.text_color }}>%</Text>
                </View>
            }

            {editMode && <Pressable style={imageHolderStyles.deleteIcon} onPress={handleDeleteMedia}>
                <AntDesign name="closesquare" size={theme.icon_size_sm} color={theme.fill_mask} />
            </Pressable>}

            <FastImage 
                style={imageStyle()}
                resizeMode={resizeModeStyle[resizeMode] || FastImage.resizeMode.cover}
                source={source} 
                onLoadStart={() => setLoading(showloading)}
                onLoadEnd={() => setLoading(false)}
                onError={() => setError(true)}
            />

            <View style={[StyleSheet.absoluteFillObject, styles?.fillObject || {}, {justifyContent: "center", alignItems: 'center'} ]}>
                {(loading && !error) && <ActivityIndicator size="small" color={theme.secondary_variant} /> }
                {error && <AntDesign name="picture" color={theme.fill_mask} size={theme.icon_size_xl} /> }
            </View>
        </View>
    );
};

export default ImageHolder;
export const AnimatedImage = Animated.createAnimatedComponent(FastImage);