import React, { forwardRef, useState, useContext } from 'react';
import { Pressable, ScrollView, Text, View, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import countryCodes from "./countrycode";
import SlideUpModal from '../SlideUpModal';
import theme, {ThemeContext} from '@xcoolsports/constants/theme';

const styles = StyleSheet.create({
    inputContainerDefault: {
        flexDirection: 'row',
        borderRadius: theme.radius_md,
        height: theme.input_height,
        marginBottom: theme.v_spacing_sm,
    },
    inputContainerError: {
        flexDirection: 'row',
        borderRadius: theme.radius_md,
        borderWidth: theme.border_width_md,
        borderColor: theme.brand_error,
        height: theme.input_height,
        marginBottom: theme.v_spacing_sm,
    },
    input: {
        flexGrow: 1,
        flexShrink: 1,
        paddingHorizontal: theme.h_spacing_md,
    },
})

const PhoneNumber = forwardRef(({ regex, countryCode, setCountryCode, placeholder, onChangeText, value, onSubmitEditing, returnKeyLabel, returnKeyType }, ref) => {
    const [openCountryCodeModal, setOpenCountryCodeModal] = useState(false);
    const theme = useContext(ThemeContext);

    const handleConfirm = (code) => {
        setCountryCode(code);
        setOpenCountryCodeModal(false);
    };

    const insets = useSafeAreaInsets();

    return (
        <View style={[{...styles.inputContainerDefault, ...(regex ? {} : styles.inputContainerError)}, {backgroundColor: theme.fill_placeholder}]}>
            <Pressable onPress={() => setOpenCountryCodeModal(true)} style={{ width: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.fill_base }}>
                <Text numberOfLines={1} style={{ color: theme.text_color, color: theme.text_color, fontSize: theme.font_size_base }}> + {countryCode.tel} </Text>
                <Text numberOfLines={1} style={{ color: theme.text_color, fontSize: theme.font_size_icontext }}> {countryCode.name} </Text>
            </Pressable>

            <TextInput
                ref={ref}
                style={[styles.input, {color: theme.text_color}]}
                placeholder={placeholder}
                onChangeText={onChangeText}
                placeholderTextColor={theme.secondary_variant}
                value={value}
                keyboardType="numeric"
                returnKeyLabel={returnKeyLabel}
                returnKeyType={returnKeyType}
                autoCapitalize='none'
                autoCorrect={false}
                autoComplete='off'
                blurOnSubmit={false}
                onSubmitEditing={onSubmitEditing}
            />  

            <SlideUpModal
                title="选择国家或地区"
                onClose={() => setOpenCountryCodeModal(false)}
                visible={openCountryCodeModal}
                onOk={() => setOpenCountryCodeModal(false)}
                okTitle="确认"
                disableOk={countryCode === ''}
                fullScreen
                style={[{ height: '100%', paddingTop: insets.top }]}
            >
                <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: theme.h_spacing_lg }}>                    
                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> A </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 'a').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> B </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 'b').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> C </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 'c').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> D </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 'd').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> E </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 'e').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> F </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 'f').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}  

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> G </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 'g').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}  

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> H </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 'h').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}  

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> J </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 'j').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}  

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> K </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 'k').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}  

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> L </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 'l').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}  

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> M </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 'm').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}  

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> N </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 'n').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}  

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> P </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 'p').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}  

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> R </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 'r').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}  

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> S </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 's').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}  

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> T </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 't').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}  

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> W </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 'w').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}  

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> X </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 'x').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}  

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> Y </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 'y').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}  

                    <Text style={{ marginVertical: theme.v_spacing_md, color: theme.text_color, fontSize: theme.font_size_base, fontWeight: 'bold' }}> Z </Text>
                    {countryCodes.filter((code) => code.pinyin[0] === 'z').map((code) => 
                        <Pressable onPress={() => handleConfirm(code)} key={code.name}  vertical style={{ marginVertical: theme.v_spacing_md, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}>{code.name}</Text>
                            <Text style={{ color: theme.text_color, fontSize: theme.font_size_base }}> + {code.tel}</Text>
                        </Pressable>
                    )}  
                </ScrollView>
            </SlideUpModal>
        </View>
    );
});

export default PhoneNumber;