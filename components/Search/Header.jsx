import React, { useContext } from 'react';
import { Pressable, StyleSheet, View, TextInput } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons'; 
import { useTranslation } from 'react-i18next';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';
 
const styles = StyleSheet.create({
    inputContainerDefault: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: theme.radius_md,
        height: theme.input_height,
        marginBottom: theme.v_spacing_sm,
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
    },
    input: {
        flexGrow: 1,
        flexShrink: 1,
        width: "30%",
    },
});

const Header = ({ keyword, setKeyword, fetchData }) => {
    const { t, i18n } = useTranslation();
    const theme = useContext(ThemeContext);

    return (
        <View style={[styles.inputContainerDefault, {backgroundColor: theme.fill_placeholder}]}>
            <View style={styles.icon}>
                <FontAwesome name="search" size={theme.icon_size_xxs} color={theme.secondary_variant} />
            </View>

            <TextInput
                style={[styles.input, {color: theme.text_color}]}
                placeholder={t('请输入关键字')}
                placeholderTextColor={theme.secondary_variant}
                returnKeyLabel={t('搜索')}
                returnKeyType='search'
                onChangeText={setKeyword}
                value={keyword}
                blurOnSubmit={false}
                onSubmitEditing={fetchData}
                maxLength={50}
            />

            {keyword !== '' && 
                <Pressable hitSlop={10} onPress={() => setKeyword('')} style={styles.icon}>
                    <Ionicons name="close-circle" size={theme.icon_size_xxs} color={theme.fill_mask} />
                </Pressable>
            }
        </View>
    );
};

export default Header;