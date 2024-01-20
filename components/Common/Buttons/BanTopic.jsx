import React, { useRef, useState, useEffect, useContext } from 'react';
import { Pressable, Text, View, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import SlideUpModal from '@xcoolsports/components/utils/SlideUpModal';
import styles from '@xcoolsports/components/Common/Buttons/style';
import { api } from '@xcoolsports/data';

const BanTopic = ({ id, onClose }) => {
    const { t, i18n } = useTranslation();
    const isMounted = useRef(true);
    const theme = useContext(ThemeContext);

    const [banTopic] = api.endpoints.banTopic.useMutation();

    const [openBan, setOpenBan] = useState(false);
    const [content, setContent] = useState('');

    const handleBanPost = async () => {
        const newObject = {
            unban: false,
            content,
            related_data: null,
        };

        const response = await banTopic({ topicID: id, body: newObject });
        
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
                <Text style={[{color: theme.text_color}, styles.text]}>{t('封禁帖子')}</Text>  
            </Pressable>

            <SlideUpModal
                title={t('封禁帖子')}
                onClose={() => setOpenBan(false)}
                visible={openBan}
                onOk={handleBanPost}
                okTitle={t("提交")}
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

export default BanTopic;
