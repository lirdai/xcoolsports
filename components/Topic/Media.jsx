import React from 'react';
import { View } from 'react-native';

import urlConstants from '@xcoolsports/constants/urls';
import VideoPlayer from '@xcoolsports/components/utils/Video';
import Gallery from '@xcoolsports/components/utils/Gallery';

const getMediaType = (multiMedia) => {
  if (multiMedia && multiMedia.length > 0) {
    return multiMedia[0].mediaType;
  }

  return '';
};

const Media = ({ topic, onFullscreen }) => {

  return (
    <View>
      {getMediaType(topic.multimedia) === 'videos' &&  
        <VideoPlayer
          displayMode='Big'
          isSelectedUploading={false}
          source={{ uri: `${urlConstants.videos}/${topic.multimedia[0].url}/index.m3u8` }}
          onFullscreen={onFullscreen}
        />     
      }

      {getMediaType(topic.multimedia) === 'images' &&  
        <Gallery 
          galleryState={Gallery.STATE.DISPLAY}
          galleryContent={topic.multimedia}
        />     
      }
    </View>
  )
};

export default Media;
