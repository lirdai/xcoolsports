import React, { useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import urlConstants from '@xcoolsports/constants/urls';
import FilePicker from '@xcoolsports/components/utils/FilePicker';
import theme from '@xcoolsports/constants/theme';
import VideoPlayer from '@xcoolsports/components/utils/Video';
import Gallery from '@xcoolsports/components/utils/Gallery';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.v_spacing_lg,
  },
  error: {
    fontSize: theme.font_size_caption_sm,
    color: theme.brand_error,
    marginBottom: theme.v_spacing_xl,
  },
});

const getMediaType = (multiMedia) => {
  if (multiMedia && multiMedia.length > 0) {
    return multiMedia[0].mediaType;
  }

  return '';
};

const Media = ({ containerStyle, multiMedia, handleAddMedia, handleDeleteMedia }) => {
  const pickerRef = useRef();

  const openUploadModal = () => {
    if (pickerRef.current) {
      pickerRef.current.selectFiles();
    }
  };

  return (
    <View style={containerStyle || styles.container}>
      {getMediaType(multiMedia) === 'videos' && <VideoPlayer
          displayMode='Small'
          isSelectedUploading={false}
          handleDeleteMedia={() => handleDeleteMedia(multiMedia[0])} 
          source={{ uri: multiMedia[0]?.file?.uri ?
            multiMedia[0].file.uri :
            `${urlConstants.videos}/${multiMedia[0].url}/index.m3u8` }} 
        />
      }

      <ScrollView showsHorizontalScrollIndicator={true} horizontal>
        {getMediaType(multiMedia) !== 'videos' && <Gallery 
            galleryState={Gallery.STATE.EDIT}
            galleryContent={multiMedia}
            openUploadModal={openUploadModal}
            handleDeleteMedia={handleDeleteMedia}
          />
        }

        <FilePicker
          ref={pickerRef} 
          fileType={FilePicker.FILE_TYPES.MIXED}
          limit={9}
          onSelect={handleAddMedia}
          selectedFiles={multiMedia}
        />
      </ScrollView>
    </View>
  )
};

export default Media;
