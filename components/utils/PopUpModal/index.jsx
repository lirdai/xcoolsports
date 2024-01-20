import React, { useEffect, useRef, useContext } from 'react';
import { Text, View, Pressable, BackHandler } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { useTranslation } from 'react-i18next'

import styles from './style';
import HorizontalLine from '../HorizontalLine';
import {ThemeContext} from '@xcoolsports/constants/theme';

const PopUpModal = ({visible, onClose, onCancel, onOk, okTitle, disableOk, title, children}) => {
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

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onClose}
                dismissable
                contentContainerStyle={{ 
                    backgroundColor: theme.fill_base, 
                    marginHorizontal: theme.v_spacing_2xl, 
                    padding: theme.v_spacing_lg,
                }}            
                presentationStyle= 'fullScreen'
                transparent={true}
            >
                {title &&
                    <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
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
                                    <Text style={{color: theme.text_color}}>{title}</Text>
                                </View>

                                {onOk
                                    ? 
                                    <Pressable hitSlop={10} disabled={disableOk} style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }} onPress={onOk}>
                                        <Text style={disableOk ? { color: theme.fill_placeholder } : { color: theme.secondary_color }}>{okTitle}</Text>
                                    </Pressable> 
                                    : <View style={{ flex: 1 }} />
                                }
                            </View>
                            : <View>{title}</View>
                        }
                    </View>
                }

                <HorizontalLine/>
                
                <View style={styles.modalContentContainer}>
                    {children}
                </View>
            </Modal>
        </Portal>
    );
};

export default PopUpModal;