import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'

import Container from '@xcoolsports/components/Common/Container';
import { selectLanguage, configActions, selectSkin } from '@xcoolsports/data';
import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import SecondaryContainedButton from '@xcoolsports/components//utils/Buttons/SecondaryContainedButton';

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: theme.v_spacing_xl,
    },
    radio: {
        alignItems: 'flex-start',
        justifyContent: "center",
        width: '50%',
    },
    button: {
        height: 50, 
        marginVertical: theme.v_spacing_2xl, 
    },
    buttonText: {
        fontSize: theme.font_size_heading,
    },
});

const Setting = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const language = useSelector(selectLanguage);
    const skin = useSelector(selectSkin);
    const theme = useContext(ThemeContext);

    const [languageSetting, setLanguageSetting] = useState(language);
    const [skinSetting, setSkinSetting] = useState(skin);

    const handleSetting = () => {
        i18n.changeLanguage(languageSetting);
        dispatch(configActions.changeLanguage(languageSetting));
        dispatch(configActions.changeSkin(skinSetting));
        navigation.goBack();
    }

    return (
        <Container 
          header={{ 
            title: `${t("设置")}`, 
            headerTitle: { showTitle: true }, 
            headerLeft: { onPress: navigation.goBack },
            headerRight: {},
          }}
        >
            <View style={styles.container}>
                <Text style={{fontWeight: 'bold', color: theme.text_color, marginTop: theme.v_spacing_2xl}}>{t("语言设置")}</Text>
                <RadioButton.Group onValueChange={(newValue) => setLanguageSetting(newValue)} value={languageSetting}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {[{label: '英语', value: 'en'}, {label: '中文', value: 'zh_CN'}]
                            .map(sub => ({ label: sub.label, value: sub.value }))
                            .map(({label, value}) =>
                                <View key={label} style={[styles.radio]}>
                                    <RadioButton.Item 
                                        color={theme.text_color}
                                        labelStyle={{color: theme.text_color}}
                                        mode="android" 
                                        position="leading" 
                                        label={t(label)} 
                                        value={value}
                                    />
                                </View>
                        )}
                    </View>
                </RadioButton.Group>

                <Text style={{fontWeight: 'bold', color: theme.text_color, marginTop: theme.v_spacing_2xl}}>{t("主题设置")}</Text>
                <RadioButton.Group onValueChange={(newValue) => setSkinSetting(newValue)} value={skinSetting}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {[{label: '浪漫自由风', value: 'dark'}, {label: '原色纯白风', value: 'light'}]
                            .map(sub => ({ label: sub.label, value: sub.value }))
                            .map(({label, value}) =>
                                <View key={label} style={[styles.radio]}>
                                    <RadioButton.Item 
                                        color={theme.text_color}
                                        labelStyle={{color: theme.text_color}}
                                        mode="android" 
                                        position="leading" 
                                        label={t(label)} 
                                        value={value}
                                    />
                                </View>
                        )}
                    </View>
                </RadioButton.Group>

                <SecondaryContainedButton 
                    buttonFreeStyle={styles.button} 
                    textFreeStyle={styles.buttonText}
                    onPress={handleSetting}
                    buttonText={t('确定')} 
                />
            </View>   
        </Container>
    )
};

export default Setting;