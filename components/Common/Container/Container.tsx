import React, { ReactElement, ReactNode, useState, useContext } from 'react';
import { StatusBar, StyleProp, SafeAreaView, KeyboardAvoidingView, ViewStyle, Platform, View } from 'react-native';
import { HeaderBackButton, Header, HeaderTitle } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import defaultStyle from './style';
import { ThemeContext } from '@xcoolsports/constants/theme';
import CustomErrorBoundary from '@xcoolsports/components/Common/Pages/CustomErrorBoundary';
import { selectSkin } from '@xcoolsports/data';
interface ContainerProps {
    children: ReactElement | ReactNode;
    style?: StyleProp<ViewStyle>;
    fullscreen?: boolean;
    header?: {
        title: string;
        style: StyleProp<ViewStyle>;
        hidden?: boolean;
        headerTitle?: {
            showTitle: boolean;
            headerTitleComponent?: ReactElement | ReactNode;
        };
        headerLeft?: {
            onPress: () => void;
            headerLeftComponent?: ReactElement | ReactNode;
        };
        headerRight?: {
            headerRightComponent?: ReactElement | ReactNode;
        };
        extendedHeader?: {
            avoidHeader?: boolean;
            extendedHeaderComponent?: ReactElement | ReactNode;
        }
        onGoBack?: () => void;
    };
}

const Container = ({children, style, fullscreen, header}: ContainerProps) => {
    const [headerHeight, setHeaderHeight] = useState(91);
    const insets = useSafeAreaInsets();
    const theme = useContext(ThemeContext);
    const skin = useSelector(selectSkin);

    return <>
        <StatusBar barStyle={skin === 'dark' ? 'light-content' : 'dark-content'} hidden={fullscreen} animated/>
        {header && !header.hidden && !fullscreen &&
        <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
            <Header
                title={header.title} headerTitleAlign='center'
                headerLeft={header.headerLeft ? (props) => {
                    if (header.headerLeft?.headerLeftComponent) return header.headerLeft.headerLeftComponent;
                    return <HeaderBackButton {...props} labelVisible={false} tintColor={theme.text_color} {...header.headerLeft}/>
                } : undefined}
                headerTitle={header.headerTitle ? (props) => {
                    if (header.headerTitle?.headerTitleComponent) return header.headerTitle.headerTitleComponent;
                    if (header.headerTitle?.showTitle) return <HeaderTitle {...props} style={{color: theme.text_color, textAlign: 'center'}}/>
                } : undefined}
                headerRight={header.headerRight ? (props) => {
                    if (header.headerRight?.headerRightComponent) return header.headerRight.headerRightComponent;
                } : undefined}
                
                headerStyle={[defaultStyle.header, {backgroundColor: theme.fill_base}, header.style]}
                headerLeftContainerStyle={header.headerLeft ? {flex: 1, marginHorizontal: 0} : {display: 'none'}}
                headerTitleContainerStyle={header.headerTitle ? {flex: 6, marginHorizontal: 0, maxWidth: '100%'} : {display: 'none'}} // todo: margin和maxWidth需要观察会不会盖住后退按钮
                headerRightContainerStyle={header.headerRight ? {flex: 1, marginHorizontal: 0} : {display: 'none'}}
                headerShadowVisible={!header.extendedHeader}
            />
        </View>}
        <CustomErrorBoundary>
            <KeyboardAvoidingView
                style={[defaultStyle.container, {backgroundColor: theme.fill_base}]}
                behavior={Platform.OS === 'ios' ? "padding" : undefined} enabled={Platform.OS === 'ios'}
                // keyboardVerticalOffset={headerHeight}
            >   
                <SafeAreaView
                    style={[defaultStyle.container, {backgroundColor: theme.fill_base}, fullscreen && {backgroundColor: theme.black_icon}, style]}
                >
                    {children}
                </SafeAreaView>
            </KeyboardAvoidingView>
        </CustomErrorBoundary>
        {header?.extendedHeader && 
            <View
                style={[
                    defaultStyle.extendedHeaderContainer,
                    {backgroundColor: theme.fill_base, shadowColor: theme.fill_mask},
                    header?.extendedHeader.avoidHeader ?
                        {top: headerHeight} :
                        {top: insets.top},
                ]}
                pointerEvents="box-none"
            >
                {/* <View style={{height: headerHeight, width: '100%', borderWidth: 1, borderColor: 'red'}} pointerEvents="none" /> */}
                {header.extendedHeader.extendedHeaderComponent}
            </View>}
    </>
}

export default Container;