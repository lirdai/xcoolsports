import React, { useEffect, useState, useRef, useContext } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

import theme, { ThemeContext } from '@xcoolsports/constants/theme';
import SlideUpModal from '@xcoolsports/components/utils/SlideUpModal';
import styles from '@xcoolsports/components/Common/Buttons/style';
import { api } from '@xcoolsports/data';

const DeleteCard = ({ card, onClose }) => {
    const { t, i18n } = useTranslation();
    const isMounted = useRef(true);
    const theme = useContext(ThemeContext);

    const [deleteCard] = api.endpoints.deleteCard.useMutation();

    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleDeleteMessage = async () => {
        deleteCard({ id: card.id });
        setOpenDeleteModal(false);
        onClose();
    };

    useEffect(() => () => { isMounted.current = false; }, []);

    return (
        <View style={styles.container}>
            <Pressable 
                hitSlop={10} 
                onPress={() => setOpenDeleteModal(true)}
                style={{ height: 40, width: '100%', backgroundColor: theme.fill_placeholder, justifyContent: 'center', alignItems: 'center', borderRadius: theme.radius_lg, marginVertical: theme.v_spacing_xs }}
            >
                <Text style={[styles.text, { color: theme.text_color }]}>{t('删除')}</Text>
            </Pressable>

            <SlideUpModal
                title={t('删除')}
                onClose={() => setOpenDeleteModal(false)}
                visible={openDeleteModal}
            >
                <View style={styles.modalContainer}>
                    <Text style={[styles.modalTitle, { color: theme.text_color }]}> {t('删除')}? </Text>

                    <View style={styles.modalContent}>
                        <Pressable hitSlop={10} style={styles.modalButton} onPress={() => setOpenDeleteModal(false)}>
                            <Text style={[styles.modalText, { color: theme.text_color }]}>{t('取消')}</Text>
                        </Pressable>

                        <Pressable hitSlop={10} style={styles.modalButton} onPress={handleDeleteMessage} onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                            <Text style={[styles.modalText, { color: theme.text_color }]}>{t('确定')}</Text>
                        </Pressable>
                    </View>
                </View>
            </SlideUpModal>
        </View>
    );
};

export default DeleteCard;
