import { launchImageLibrary } from 'react-native-image-picker';

const FILE_TYPES = {
    MIXED : 'mixed',
    PHOTO: 'photo',
};

export default {
    launchFilePicker: (mediaType, selectionLimit, onResponse) => {
        launchImageLibrary({
            mediaType,
            selectionLimit,
        }, onResponse);
    },
    FILE_TYPES,
};