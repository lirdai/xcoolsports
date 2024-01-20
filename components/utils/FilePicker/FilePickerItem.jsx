import React, {useContext} from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';

import ImageHolder from '../Image';
import VideoPlayer from '../Video';
import theme, {ThemeContext} from '../../../constants/theme';

const styles = StyleSheet.create({
    image: {
        aspectRatio: 1,
        padding: 1,
        width: '33%',
    },
    album: {
        padding: 5,
        width: '50%',
    },
    albumTitle: {},
    albumMeta: {},
    topRightButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 25,
        height: 25,
        borderWidth: 2,
        borderRadius: 99,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topRightButtonChecked: {
        borderColor: theme.brand_primary, 
        backgroundColor: theme.brand_primary
    },
    topRightButtonText: {
        fontSize: theme.font_size_base,
    },
});

export const RenderItem = ({selectIndex, uri, mediaType, duration, onPress}) => {
    const theme = useContext(ThemeContext);
    const itemDisplay = () => {
        if (mediaType === 'images') {
            return <ImageHolder
                    source={{ uri: uri }}
                    showloading
                    // styles={{fillObject: {backgroundColor: theme.fill_placeholder}}}
                />
        } else if (mediaType === 'videos') {
            const minutes = Math.floor(duration / 60);
            const seconds = `0${Math.ceil(duration % 60)}`.slice(-2);
            return <VideoPlayer
                    source={{ uri: uri }}
                    displayMode={'Tiny'}
                    meta={{ duration: `${minutes}:${seconds}` }}
                    // styles={{fillObject: {backgroundColor: theme.fill_placeholder}}}
                />
        } else {
            return <Text>坏掉了</Text>
        }
    }
    return <Pressable style={styles.image} onPress={onPress}>
        {itemDisplay()}
        <Pressable
            style={selectIndex !== undefined 
                ? [styles.topRightButton, {borderColor: theme.fill_disabled}, styles.topRightButtonChecked] 
                : [styles.topRightButton, {borderColor: theme.fill_disabled}]}
            onPress={onPress}
            hitSlop={10}
        >
            {selectIndex !== undefined && <Text style={[styles.topRightButtonText, {color: theme.fill_placeholder}]}>{selectIndex + 1}</Text>}
        </Pressable>
    </Pressable>
}

export const RenderAlbum = React.memo(({item, onPress}) => {
    const theme = useContext(ThemeContext);
    const albumItem = (album) => {
        if (album?.cover?.mediaType === 'images') {
            return <ImageHolder 
                    source={{ uri: album?.cover?.uri }}
                    showloading
                />
        } else if (album?.cover?.mediaType === 'videos') {
            return <VideoPlayer
                    source={{ uri: album?.cover?.uri }}
                    displayMode={'Tiny'}
                />
        } else {
            return <Text>坏掉了</Text>
        }
    }
    return <Pressable style={[styles.album]} onPress={onPress}>
        <View style={{aspectRatio: 1}}>
            {albumItem(item)}
        </View>
        <Text style={[styles.albumTitle, {color: theme.secondary_color}]}>{item.title}</Text>
        <Text style={[styles.albumMeta, {color: theme.secondary_variant}]}>{item.totalCount}</Text>
    </Pressable>
})