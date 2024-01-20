import React, { useEffect, useRef } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { useSelector, useDispatch } from 'react-redux';

import { 
    api, toastActions, toastTypes, selectLocation, 
    locationActions, mapboxApi, selectCurrentUser 
} from '@xcoolsports/data';
// import * as Expolocation from 'expo-location';
// import { Platform } from 'react-native';
// import ForegroundService from '../../services/foregroundService';
// import BackgroundTimer from 'react-native-background-timer';
// import serviceConstants from '../../constants/serviceConstants';

const GeolocationComponent = () => {
    const dispatch = useDispatch();
    const location = useSelector(selectLocation); 
    const currentUser = useSelector(selectCurrentUser);

    const isMounted = useRef(true);
    const watchIDRef = useRef();

    const [getReverseGeocoding] = mapboxApi.endpoints.getReverseGeocoding.useLazyQuery();
    const [updateUserProfile] = api.endpoints.updateUserProfile.useMutation();

    const handleUserProfile = async () => {
        const newValue = {
            coordinate: 
                (location.user_current_coordinate.latitude && location.user_current_coordinate.longitude) 
                ? `${location.user_current_coordinate.longitude},${location.user_current_coordinate.latitude}` 
                : undefined,
        }

        await updateUserProfile({ username: currentUser.username, body: newValue });
    };

    useEffect(() => {
        if (location.is_gps_permission_granted === 'granted') {
            Geolocation.getCurrentPosition(
                (position) => {
                    dispatch(locationActions.updateCurrentCoordinate({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }));
                },
                (error) => {
                    console.error("error", error.code, error.message);
                },
                {
                    accuracy: {
                        android: 'high',
                        ios: 'bestForNavigation'
                    },
                    timeout: 30000,
                    distanceFilter: 1,
                    forceLocationManager: true
                }
            );
        }
        
        if (location.is_gps_permission_granted && location.is_gps_permission_granted !== 'granted') {
            dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '未获得位置权限，可能会导致部分功能无法正常使用' }))
        }
    }, [location.is_gps_permission_granted]);

    useEffect(() => {
        if (location.user_current_coordinate) {
            getReverseGeocoding({ 
                longitude: location.user_current_coordinate.longitude, 
                latitude: location.user_current_coordinate.latitude, 
            });
            if (currentUser.is_logged_in) handleUserProfile();
        }
    }, [location.user_current_coordinate]);

    useEffect(() => {
        if (watchIDRef.current !== undefined) {
            Geolocation.clearWatch(watchIDRef.current);
        }
    }, [location.is_gps_permission_granted]);

    useEffect(() => {
        return () => {
            isMounted.current = false; 
        }
    }, []);

    return null;
};

export default GeolocationComponent;

// const foregroundServiceRef = useRef(false);
// const shareDataIdRef = useRef();
// const dataToShareRef = useRef(dataToShare);
// dataToShareRef.current = dataToShare;

// const [updateShareDataWithTeam] = api.endpoints.updateShareDataWithTeam.useMutation();
// const isUsingGps = location.recording_state !== serviceConstants.RECORDING_STATES.READY || location.is_sharing;

// useEffect(() => {
//     if (watchIDRef.current !== undefined) {
//         Geolocation.clearWatch(watchIDRef.current);
//     }
//     if (location.is_gps_permission_granted === 'granted' && isUsingGps) {
//         watchIDRef.current = Geolocation.watchPosition(
//             (position) => {
//                 dispatch(trackRecordActions.updateCurrentCoordinates(position)); 
//                 dispatch(trackRecordActions.calculateTrackRecord(position));
//             },
//             (error) => {
//                 console.error("error", error.code, error.message);
//             },
//             {
//                 accuracy: {
//                     android: 'high',
//                     ios: 'bestForNavigation'
//                 },
//                 timeout: 30000,
//                 interval: 1000,
//                 distanceFilter: 1,
//                 forceLocationManager: true,
//             }
//         );

//         Expolocation.watchHeadingAsync(
//             (newLocation) => {
//               dispatch(trackRecordActions.updateHeading(newLocation.trueHeading));
//             }
//         );
//     }
// }, [location.is_gps_permission_granted, isUsingGps]);

// useEffect(() => {
//     if (!params.intervalShareDataWithTeam) return;
//     if (location.is_sharing && !shareDataIdRef.current) {
//         if (Platform.OS === 'ios') {
//             shareDataIdRef.current = setInterval(() => { 
//                 updateShareDataWithTeam(dataToShareRef.current);
//             }, params.intervalShareDataWithTeam);
//         } else {
//             shareDataIdRef.current = true;
//             BackgroundTimer.runBackgroundTimer(() => {
//                 updateShareDataWithTeam(dataToShareRef.current);
//             }, params.intervalShareDataWithTeam);
//         }
//     } else if (!location.is_sharing && shareDataIdRef.current) {
//         if (Platform.OS === 'ios') {
//             clearInterval(shareDataIdRef.current);
//         } else {
//             BackgroundTimer.stopBackgroundTimer();
//         }
//         shareDataIdRef.current = null;
//     }
//     return () => {
//         if (shareDataIdRef.current) {
//             if (Platform.OS === 'ios') {
//                 clearInterval(shareDataIdRef.current);
//             } else {
//                 BackgroundTimer.stopBackgroundTimer();
//             }
//             shareDataIdRef.current = null;
//         }
//     }
// }, [location.is_sharing, params.intervalShareDataWithTeam]);

// const startForegroundService = async () => {
//     if (foregroundServiceRef.current) return;
    
//     try {
//         const channelConfig = {
//             id: 'com.shundarongchuang.xcoolsports.foregroundservice',
//             name: '顽酷运动记录',
//             description: '实时更新顽酷运动记录的数据',
//             enableVibration: false
//         };

//         await ForegroundService.getInstance().createNotificationChannel(channelConfig);
//         const notificationConfig = {
//             channelId: 'com.shundarongchuang.xcoolsports.foregroundservice',
//             id: 69696969,
//             title: '顽酷',
//             text: '顽酷正在记录您的运动轨迹',
//             icon: 'ic_launcher_round',
//             // button: '没用的按钮',
//         };

//         await ForegroundService.getInstance().startService(notificationConfig);
//         await ForegroundService.getInstance().on('ForegroundServiceButtonPressed', () => {})
//         foregroundServiceRef.current = true;
//     } catch (e) {
//         console.error(e);
//     }
// };

// const closeForegroundService = async () => {
//     if (!foregroundServiceRef.current) return;

//     await ForegroundService.getInstance().stopService();
//     foregroundServiceRef.current = false;
// };

// useEffect(() => {
//     if (Platform.OS === 'android') {
//         if (isUsingGps) {
//             startForegroundService();
//         } else {
//             closeForegroundService();
//         }
//     }
// }, [location.recording_state, location.is_sharing]);

// useEffect(() => {
//     return () => {
//         if (watchIDRef.current !== undefined) {
//             Geolocation.clearWatch(watchIDRef.current);
//         }

//         if (Platform.OS === 'android') {
//             dispatch(trackRecordActions.updateRecordingState("ready"));
//             dispatch(trackRecordActions.clearCalculation());
//             dispatch(trackRecordActions.updateSharing(false));
//             closeForegroundService();
//         }
//     }
// }, []);