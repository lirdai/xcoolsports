import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, Dimensions, Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { MaterialIcons } from '@expo/vector-icons'; 
import { ActivityIndicator } from 'react-native-paper';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import Container from '@xcoolsports/components/Common/Container';
import { api } from '@xcoolsports/data';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginVertical: theme.v_spacing_md,
    },
});

const Square = () => {
    const sideLength = Dimensions.get('window').width/2;
    const theme = useContext(ThemeContext);

    return (
        <View style={{ width: sideLength, height: sideLength, flexWrap: 'wrap' }}>
            <View style={{ width: sideLength/3, height: sideLength/3, borderLeftWidth: 2, borderTopWidth: 2, borderColor: theme.fill_disabled }} /> 
            <View style={{ width: sideLength/3, height: sideLength/3 }} />            
            <View style={{ width: sideLength/3, height: sideLength/3, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: theme.fill_disabled }} /> 
            <View style={{ width: sideLength/3, height: sideLength/3 }} /> 
            <View style={{ width: sideLength/3, height: sideLength/3 }} /> 
            <View style={{ width: sideLength/3, height: sideLength/3 }} /> 
            <View style={{ width: sideLength/3, height: sideLength/3, borderRightWidth: 2, borderTopWidth: 2, borderColor: theme.fill_disabled }} /> 
            <View style={{ width: sideLength/3, height: sideLength/3 }} /> 
            <View style={{ width: sideLength/3, height: sideLength/3, borderRightWidth: 2, borderBottomWidth: 2, borderColor: theme.fill_disabled }} /> 
        </View>
    );
};

const Scanner = ({ route, navigation }) => {
    const { t, i18n } = useTranslation();
    const { eventId } = route.params;
    const theme = useContext(ThemeContext);

    const [orderCheckIn] = api.endpoints.orderCheckIn.useMutation();

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    
    const handleBarCodeScanned = async ({ type, data }) => {
        const [username, orderId, checkinKey] = data.split(":");
        setScanned(true);
        const { data: checkInData, error } = await orderCheckIn({ body: { username, checkin_key: checkinKey }, id: eventId, order_id: orderId });
        if (error) {
            alert(`${t('二维码错误')}!`);
        } else {
            alert(`${checkInData.user?.nickname} ${t('已签到')}!`);
        }
    };

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        };
    
        getBarCodeScannerPermissions();
    }, []);

    return (
        <Container 
            header={{ 
                title: `${t('扫一扫')}`, 
                headerTitle: { showTitle: true }, 
                headerLeft: { onPress: navigation.goBack },
                headerRight: {},
            }}
        >
            {hasPermission === null && 
                <View style={[styles.container]}>
                    <ActivityIndicator size="small" color={theme.secondary_variant} />
                    <Text style={[styles.text, {color: theme.fill_mask}]}>{`${t('正在请求相机权限')}`}</Text>
                </View>
            }
            {hasPermission === false && 
                <View style={[styles.container]}>
                    <MaterialIcons name="dangerous" size={80} color={theme.secondary_color} />
                    <Text style={[styles.text, {color: theme.fill_mask}]}>{`${t('没有相机权限')}`}</Text>
                </View>
            }
            {hasPermission &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                    />
                    
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Square />
                    </View>

                    {scanned && 
                        <Pressable 
                            style={{ 
                                backgroundColor: theme.fill_base, 
                                borderRadius: theme.radius_sm,
                                width: Dimensions.get('window').width/2,
                                height: 50,
                                marginBottom: 50,
                                opacity: 0.8,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={() => setScanned(false)} 
                        >
                            <Text style={{ fontWeight: 'bold', color: theme.text_color }}>{`${t('点击重新扫码')}`}</Text>
                        </Pressable>
                    }
                </View> 
            }
        </Container>
    );
};

export default Scanner;