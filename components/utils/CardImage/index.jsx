import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';

import Image from '@xcoolsports/components/utils/Image';
import urlConstants from '@xcoolsports/constants/urls';

const styles = StyleSheet.create({
    imageSmall: {
        width: "100%", 
        height: 250,
    },
    imageMedium: {
        width: "100%", 
        height: 350,
    },
    imageLarge: {
        width: "100%", 
        height: 450,
    },
});

const getScreenSize = (windowWidth) => {
    if (windowWidth < 639) {
        return {
            'image': styles.imageSmall,
        }
    }

    if (windowWidth < 767) {
        return {
            'image': styles.imageMedium,
        }
    }

    return {
        'image': styles.imageLarge,
    }
};

const CardImage = ({ style, id }) => {
    const windowWidth = Dimensions.get("window").width;
    const windowSize = getScreenSize(windowWidth);

    if (id%10 === 1) {
        return <Image 
            containerStyle={style || windowSize.image}
            isSelectedUploading={false}
            editMode={false}
            showloading
            source={{ uri :`${urlConstants.images}/party` }}
            resizeMode="cover"
        />
    } if (id%10 === 2) {
        return <Image 
            containerStyle={style || windowSize.image}
            isSelectedUploading={false}
            editMode={false}
            showloading
            source={{ uri :`${urlConstants.images}/love` }}
            resizeMode="cover"
        />
    } if (id%10 === 3) {
        return <Image 
            containerStyle={style || windowSize.image}
            isSelectedUploading={false}
            editMode={false}
            showloading
            source={{ uri :`${urlConstants.images}/adventure` }}
            resizeMode="cover"
        />
    } if (id%10 === 4) {
        return <Image 
            containerStyle={style || windowSize.image}
            isSelectedUploading={false}
            editMode={false}
            showloading
            source={{ uri :`${urlConstants.images}/colorful` }}
            resizeMode="cover"
        />
    } if (id%10 === 5) {
        return <Image 
            containerStyle={style || windowSize.image}
            isSelectedUploading={false}
            editMode={false}
            showloading
            source={{ uri :`${urlConstants.images}/couple` }}
            resizeMode="cover"
        />
    } if (id%10 === 6) {
        return <Image 
            containerStyle={style || windowSize.image}
            isSelectedUploading={false}
            editMode={false}
            showloading
            source={{ uri :`${urlConstants.images}/firework` }}
            resizeMode="cover"
        />
    } if (id%10 === 7) {
        return <Image 
            containerStyle={style || windowSize.image}
            isSelectedUploading={false}
            editMode={false}
            showloading
            source={{ uri :`${urlConstants.images}/heart` }}
            resizeMode="cover"
        />
    } if (id%10 === 8) {
        return <Image 
            containerStyle={style || windowSize.image}
            isSelectedUploading={false}
            editMode={false}
            showloading
            source={{ uri :`${urlConstants.images}/light` }}
            resizeMode="cover"
        />
    } if (id%10 === 9) {
        return <Image 
            containerStyle={style || windowSize.image}
            isSelectedUploading={false}
            editMode={false}
            showloading
            source={{ uri :`${urlConstants.images}/romance` }}
            resizeMode="cover"
        />
    } if (id%10 === 0) {
        return <Image 
            containerStyle={style || windowSize.image}
            isSelectedUploading={false}
            editMode={false}
            showloading
            source={{ uri :`${urlConstants.images}/rose` }}
            resizeMode="cover"
        />
    } 

    return <Image 
        containerStyle={style || windowSize.image}
        isSelectedUploading={false}
        editMode={false}
        showloading
        source={require('@xcoolsports/static/question.png')} 
        resizeMode="cover"
    />
};

export default CardImage;