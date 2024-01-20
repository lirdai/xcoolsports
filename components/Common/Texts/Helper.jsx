import React, { useContext } from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import Container from '@xcoolsports/components/Common/Container';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
    header: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        paddingVertical: 10,
    },
    title: {
        fontWeight: 'bold',
        paddingVertical: 10
    },
    paragraphLine: {
        paddingVertical: 10
    }
});

const Helper = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const theme = useContext(ThemeContext);

    return <Container 
            header={{ 
                title: `${t('常见问题')}`, 
                headerTitle: { showTitle: true }, 
                headerLeft: { onPress: navigation.goBack },
                headerRight: {},
            }}
        >
        <ScrollView style={styles.container}>
            <Text style={[styles.header, {color: theme.text_color}]}>《常见问题》</Text>

            <Text style={[styles.title, {color: theme.text_color}]}> 1. 我是一个普通用户，我想注册官方账号，该怎么操作？ </Text>
            <Text style={[styles.paragraphLine, {color: theme.text_color}]}>
                认证手机号, 然后用户菜单栏里面会出现,【官方认证】一栏，官方认证后，等待申请通过。
                如果情况紧急, 可以在用户菜单栏里面, 找到【联系我们】，会有客服人员解答您的所有问题。
            </Text>

            <Text style={[styles.title, {color: theme.text_color}]}> 2. 我玩了不少配对游戏，有很多的积分，请问游戏积分有什么用，如何兑换？ </Text>
            <Text style={[styles.paragraphLine, {color: theme.text_color}]}>
                自5000积分起, 每加5000积分, 可以兑换一次礼物。
                例如: 游戏积分5000分, 可以兑换一个价值 $50 的小礼物; 游戏积分10000分, 可以兑换一个价值 $100 的小礼物, 以此类推。
                如果需要兑换礼物，可以在用户菜单栏里面, 找到【联系我们】, 会有客服人员解答您的所有问题。
            </Text>
        </ScrollView>
    </Container>
}

export default Helper;