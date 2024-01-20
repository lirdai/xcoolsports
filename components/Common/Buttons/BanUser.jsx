import React, { useRef, useState, useEffect, useContext } from 'react';
import { Pressable, Text, View, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';

import SlideUpModal from '@xcoolsports/components/utils/SlideUpModal/SlideUpModal';
import theme, { ThemeContext } from '@xcoolsports/constants/theme';
import styles from '@xcoolsports/components/Common/Buttons/style';
import { api } from '@xcoolsports/data';

const BanUser = ({ username, onClose }) => {
    const { t, i18n } = useTranslation();
    const isMounted = useRef(true);
    const theme = useContext(ThemeContext);

    const [banUser] = api.endpoints.banUser.useMutation();

    const [openBan, setOpenBan] = useState(false);
    const [content, setContent] = useState('');

    const handleBanUser = async () => {
        const newObject = {
            ban_days: 7,
            unban: false,
            content,
        };

        const response = await banUser({ username, body: newObject });

        if (response.data && isMounted.current) {
            setContent('');
            setOpenBan(false);
            onClose();
        }
    };

    useEffect(() => () => { isMounted.current = false; }, []);

    return (
        <View style={styles.container}>
            <Pressable 
                hitSlop={10} 
                onPress={() => setOpenBan(true)}
                style={{ height: 40, width: '100%', backgroundColor: theme.fill_placeholder, justifyContent: 'center', alignItems: 'center', borderRadius: theme.radius_lg, marginVertical: theme.v_spacing_xs }}
            >
                <Text style={[styles.text, { color: theme.text_color }]}>{t('封禁用户')}</Text>
            </Pressable>

            <SlideUpModal
                title={t('封禁用户')}
                onClose={() => setOpenBan(false)}
                visible={openBan}
                onOk={handleBanUser}
                okTitle="提交"
                disableOk={content === ''}
            >
                <View style={styles.modalContainer}>
                    <TextInput
                        placeholder={t('请输入内容')}
                        placeholderTextColor={theme.secondary_variant}
                        multiline={true}
                        numberOfLines={10}
                        maxLength={200}
                        clear={true}
                        style={{
                            marginBottom: theme.v_spacing_2xl, height: 200,
                            padding: theme.v_spacing_md,
                            color: theme.text_color,
                            textAlignVertical: 'top'
                        }}
                        value={content}
                        onChangeText={(text) => setContent(text)}
                    />
                </View>
            </SlideUpModal>
        </View>
    )
};

export default BanUser;
