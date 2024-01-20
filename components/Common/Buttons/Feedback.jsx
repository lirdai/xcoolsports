import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Dimensions, TextInput } from 'react-native';
import * as Device from 'expo-device';
import { useTranslation } from 'react-i18next'

import SlideUpModal from '@xcoolsports/components/utils/SlideUpModal';
import { api } from '@xcoolsports/data';
import styles from '@xcoolsports/components/Common/Buttons/style';
import theme, {ThemeContext} from '@xcoolsports/constants/theme';

const Feedback = ({ openFeedback, setOpenFeedback }) => {
    const { t, i18n } = useTranslation();
    const isMounted = useRef(true);
    const theme = useContext(ThemeContext);
    
    const [createTicket] = api.endpoints.createTicket.useMutation();
    const [content, setContent] = useState('');

    const handleFeedback = async () => {
        const newTopic = {
            title: '',
            content,
            related_data: {
                device: {
                    brand: Device.brand, 
                    designName: Device.designName, 
                    deviceYearClass: Device.deviceYearClass, 
                    manufacturer: Device.manufacturer, 
                    modelId: Device.modelId, 
                    modelName: Device.modelName, 
                    osName: Device.osName, 
                    osVersion: Device.osVersion, 
                    osBuildId: Device.osBuildId, 
                    platformApiLevel: Device.platformApiLevel, 
                    totalMemory: Device.totalMemory,
                    windowWidth: Dimensions.get("window").width,
                    windowHeight: Dimensions.get("window").height,
                }
            },
            ticket_type: 'FEEDBK',
        };

        const response = await createTicket(newTopic);
        if (response.data && isMounted.current) {
            setContent('');
            setOpenFeedback(false);
        }
    };

    useEffect(() => () => { isMounted.current = false; }, []);

    return (
        <SlideUpModal
            title={t("意见反馈")}
            onClose={() => setOpenFeedback(false)}
            visible={openFeedback}
            onOk={handleFeedback}
            okTitle={t("提交")}
            disableOk={content === ''}
        >
            <View style={styles.modalContainer}>
                <TextInput
                    placeholder={t("请输入内容")}
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
    );
};

export default Feedback;
