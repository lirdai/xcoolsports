import React, { useEffect, useRef, useContext } from 'react';
import { Platform, Text, View, BackHandler, Pressable, Modal, KeyboardAvoidingView } from 'react-native';
import { useTranslation } from 'react-i18next'

import HorizontalLine from '../HorizontalLine';
import styles from './style';
import {ThemeContext} from '@xcoolsports/constants/theme';

const SlideUpModal = ({visible, onClose, onCancel, onOk, okTitle, disableOk, title, style, fullScreen, children}) => {
    const { t, i18n } = useTranslation();
    const visibleRef = useRef(visible);
    visibleRef.current = visible;
    const theme = useContext(ThemeContext);

    const onGoBack = () => {
        if (visibleRef.current) {
            onClose();
            return true;
        } else {
            return false;
        }
    };

    useEffect(() => {
        const backLisener = BackHandler.addEventListener("hardwareBackPress", onGoBack);
        return () => backLisener.remove();
    }, []);

    let modalStyle;
    if (fullScreen) {
        modalStyle = [styles.modalContainer, {backgroundColor: theme.fill_base}, styles.modalContainerFullScreen, style];
    } else {
        modalStyle = [styles.modalContainer, {backgroundColor: theme.fill_base}, style];
    }

    return (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            animationType="fade"
            transparent
        >
            <KeyboardAvoidingView enabled={Platform.OS === 'ios'} behavior="padding" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Pressable style={{ width: '100%', flex: 1, backgroundColor: theme.fill_placeholder }} onPress={onClose}></Pressable>
                <View style={{ width: "100%" }}> 
                    <View style={[modalStyle]}>
                        {title &&
                            <View style={{ marginBottom: theme.v_spacing_md, paddingHorizontal: theme.h_spacing_lg }}>
                                {typeof title === 'string' 
                                    ?  
                                    <View style={{ flexDirection:'row', alignItems: 'center', paddingVertical: theme.v_spacing_xs }}>
                                        {onCancel
                                            ? <View>{onCancel}</View>
                                            :                         
                                            <Pressable hitSlop={10} style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', color: theme.fill_mask }} onPress={onClose}>
                                                <Text style={{color: theme.text_color}}>{t('取消')}</Text>
                                            </Pressable>
                                        }

                                        <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'center' }}>
                                            <Text style={[styles.title, {color: theme.text_color}]}>{title}</Text>
                                        </View>

                                        {onOk ? <Pressable hitSlop={10} disabled={disableOk} style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }} onPress={onOk}>
                                            <Text style={disableOk ? { color: theme.fill_placeholder } : { color: theme.secondary_color }}>{okTitle}</Text>
                                        </Pressable> : <View style={{ flex: 1 }} />}
                                    </View>
                                    : <View>{title}</View>
                                }
                                <HorizontalLine/>
                            </View>
                        }
                        {children}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default SlideUpModal;