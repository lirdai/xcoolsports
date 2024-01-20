import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle, useContext } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'

import theme, { ThemeContext } from '../../../constants/theme';
import FileUploadClient from '../../../services/FileUploadClient';
import urlConstants from '../../../constants/urls';
import ImageHolder from '../Image';
import { toastActions, toastTypes, api } from '@xcoolsports/data';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 40,
        right: 0,
        height: theme.button_height,
        borderTopLeftRadius: 99,
        borderBottomLeftRadius: 99,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: 50, 
        height: 50,
        borderRadius: 100,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.brand_primary,
        overflow: 'hidden',
    },
    text: {
        padding: theme.h_spacing_sm,
    },
})

const FileUploader = forwardRef(({uploadQueue, onProgress, onDone, onError, autoStart, invisible}, ref ) => {
    const { t, i18n } = useTranslation();
    const client = useRef(null);
    const theme = useContext(ThemeContext);

    const [requestAliUploadToken] = api.endpoints.requestAliUploadToken.useLazyQuery();
    const [getMediaFileUploadById] = api.endpoints.getMediaFileUploadById.useMutation();

    const dispatch = useDispatch();
    const isMounted = useRef(true);
    const [uploading, setUploading] = useState(false);
    const uploadQueueLength = uploadQueue.filter(_f => _f.uploaded === false && !_f.error).length;

    const createOssClient = async () => {
        try {
            client.current = new FileUploadClient({
                bucket: urlConstants.uploadBucket,
                endpoint: urlConstants.upload,
                getSTSToken: () => requestAliUploadToken(),
                refreshSTSTokenInterval: 30 * 60 * 1000,
            });
        } catch (e) {
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '无法链接到服务器' }));
        }
    };

    useEffect(() => {
        createOssClient();
        return () => { isMounted.current = false; }
    }, []);

    useEffect(() => {
        if (autoStart && !uploading && uploadQueueLength > 0) {
            startUpload();
        }
    }, [uploadQueueLength]);
  
    const startUpload = async () => {
        if (isMounted.current)
            setUploading(true);
        try {
            /* eslint-disable no-await-in-loop, no-restricted-syntax */
            for (const file of uploadQueue) {
                const newObject = {
                    filename: file.file.fileName,
                    filetype: file.mediaType,
                }

                const response = await getMediaFileUploadById(newObject);
                const fileId = response.data.id;

                if (!fileId) {
                    onError();
                    throw new Error();
                }

                await simpleUpload(file, fileId);
            }
            if (isMounted.current)
                setUploading(false);
            return true;
        } catch (e) {
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '上传时出现错误,请稍后重试' }));
            if (isMounted.current)
                setUploading(false);
            return false;
        }
    };

    const simpleUpload = async (file, fileId) => {
        try {
            const result = await client.current.upload(`${file.mediaType}/${fileId}`, file.file.uri, {
                    width: file.file.width,
                    height: file.file.height,
                    fileSize: file.file.fileSize,
                    type: file.file.type,
                    fileName: file.file.fileName,
                    duration: file.file.duration,
                },
                (data) => { 
                    if (isMounted.current) {
                        onProgress(file, (data.totalByteSent/data.totalBytesExpectedToSend*100).toFixed(0))
                    }},
            );
            onDone(file, fileId);
        } catch (e) {
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '上传失败' }));
            onError(file);
        }
    };

    useImperativeHandle(ref, () => ({
        startUpload,
    }));

    if (!invisible && uploadQueue.length > 0) {
        return <View style={[styles.container, {backgroundColor: theme.fill_base, shadowColor: theme.secondary_color}]}>
            {uploading ?
            <ImageHolder
                containerStyle={styles.button}
                source={{ uri: uploadQueue[0].file.uri }}
                isSelectedUploading={uploadQueue[0].progress !== undefined}
                progress={uploadQueue[0].progress}
            />
            :
            <Pressable style={styles.button} onPress={startUpload}>
                <Text style={[styles.buttonText, {color: theme.text_color}]}>{t('上传')}</Text>
            </Pressable>}
            <Text style={[styles.text, {color: theme.text_color}]}>{uploadQueue.length} {t('文件')}</Text>
        </View>
    }
    return null;
});

export default FileUploader;