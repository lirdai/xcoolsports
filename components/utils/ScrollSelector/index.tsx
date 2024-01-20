import React, { useEffect, useRef, useContext } from 'react';
import { Text, Pressable, Dimensions, View, NativeTouchEvent, Platform } from 'react-native';
import Animated, {
	useSharedValue, useAnimatedStyle, useAnimatedRef, useDerivedValue, scrollTo, FadeIn, FadeOut, withSpring,
} from 'react-native-reanimated';
import _ from 'lodash';

import styles from './styles';
import * as Haptics from 'expo-haptics';
import {ThemeContext} from '@xcoolsports/constants/theme';

interface ScrollItem {
    key: string;
    value: string;
    onSelect: (param?: any) => any;
};

interface ScrollSelectorProps {
    items: ScrollItem[];
    selected: string;
    buttonWidth: number;
    height: number;
}

const ScrollSelector = ({items, selected, buttonWidth=96, height=40}: ScrollSelectorProps) => {
    const selectedRef = useRef(selected);
    const selectorWidth = Math.min(buttonWidth * items.length, Dimensions.get('window').width);
    const theme = useContext(ThemeContext);

    const aref = useAnimatedRef<Animated.ScrollView>()
    const bref = useAnimatedRef<Animated.ScrollView>()
    const totalWidth = buttonWidth * items.length;
    const handScrollableWidth = totalWidth - buttonWidth; // 手可以实际拉动的距离, 是屏幕宽度减去一开始那个按钮的宽度
    const parallaxScrollWidth = Math.max(totalWidth - selectorWidth, 0); // 上面字可以滚动的距离, 这是被下面黑条滚动所带动的(视差)
    const barScrollTotalWidth = selectorWidth - buttonWidth; // 下面黑条可以滚动的总距离, 就是全部Tab的总宽度减去一开始那个按钮的宽度

    const handScrollOffset = useSharedValue(0);
    const parallaxScrollOffset = useDerivedValue(() => {        
        return handScrollOffset.value * parallaxScrollWidth / handScrollableWidth;
    });
    const barScrollOffset = useDerivedValue(() => {        
        return handScrollOffset.value * barScrollTotalWidth / handScrollableWidth;
    });
    const bottomBarStyle = useAnimatedStyle(() => {        
        return {
            left: withSpring(barScrollOffset.value, {
                mass: 0.01,
                stiffness: 50,
            }),
        };
    });

    useDerivedValue(() => {
        scrollTo(aref, parallaxScrollOffset.value, 0, false); // UI线程必须这么用
    }, [parallaxScrollOffset.value]);

    useEffect(() => {
        const activeIndex = items.findIndex(item => item.key === selected);
        if (activeIndex !== -1) {
            const scrollGoto = selectorWidth /  items.length * activeIndex;
            handScrollOffset.value = scrollGoto;
            bref.current?.scrollTo({x: activeIndex * buttonWidth, y: 0, animated: false});
            if (selectedRef.current !== selected) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                selectedRef.current = selected;
            }
        }
    }, [items, selected]);

    return <Animated.View
        style={[{height: height}, styles.scrollContainer]}
        entering={FadeIn.duration(100)}
        exiting={FadeOut.duration(100)}
    >
        <Animated.ScrollView
            ref={aref}
            horizontal
            pinchGestureEnabled={false}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            style={{width: selectorWidth}}
            scrollEnabled={false}
        >
            {items.map(item => {
                const active = item.key === selected;
                return <View
                    key={item.key}
                    style={[styles.itemContainer, {width: buttonWidth}]}
                >
                    <Text style={[active && styles.activeText, {color: theme.text_color}]}>{item.value}</Text>
                </View>
            })}
        </Animated.ScrollView>
        <View style={{width: selectorWidth}}>
            <Animated.View style={[{width: buttonWidth}, styles.activeItem, {borderBottomColor: theme.text_color}, bottomBarStyle]} />
        </View>
        <Animated.ScrollView
            ref={bref}
            horizontal
            disableIntervalMomentum
            pinchGestureEnabled={false}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            style={[styles.overlayScrollContainer, {width: selectorWidth}, { transform: [{ scaleX: -1 }] }]}
            onScroll={({nativeEvent})=>{
                if (Platform.OS === 'ios') {
                    handScrollOffset.value = nativeEvent.contentOffset.x;
                }
            }}
            onScrollEndDrag={({nativeEvent})=>{
                if (Platform.OS === 'ios') {
                    const selectIndex = Math.min(Math.max(Math.round(nativeEvent.contentOffset.x / buttonWidth), 0), items.length);
                    items[selectIndex]?.onSelect?.();
                    bref.current?.scrollTo({x: selectIndex * buttonWidth, y: 0, animated: false});
                }
            }}
            scrollEventThrottle={16}
            scrollEnabled
        >
            <Pressable
                onPress={({nativeEvent}: {nativeEvent: NativeTouchEvent}) => {
                    const delta = handScrollOffset.value - handScrollOffset.value * (parallaxScrollWidth / handScrollableWidth);
                    const selectIndex = Math.floor((selectorWidth - nativeEvent.locationX + delta) / buttonWidth) ;
                    items[selectIndex]?.onSelect?.();
                    bref.current?.scrollTo({x: selectIndex * buttonWidth, y: 0, animated: false});
                }}
                style={styles.tapHandler}
            >
                {Array.from(Array(items.length).keys()).map(item => {
                    return <View
                            pointerEvents='none'
                            key={item}
                            style={[
                                styles.itemContainer,
                                {width: buttonWidth},
                            ]}
                        />
                })}
                <View
                    pointerEvents='none'
                    style={{
                        width: barScrollTotalWidth,
                    }}
                />
            </Pressable>
        </Animated.ScrollView>
    </Animated.View>
}

export default ScrollSelector;