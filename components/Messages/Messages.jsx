import React, { useState, useEffect, useRef, useContext } from 'react';
import { ScrollView, Text, View, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {ThemeContext} from '@xcoolsports/constants/theme';
import Image from '@xcoolsports/components/utils/Image';
import urlConstants from '@xcoolsports/constants/urls';
import Container from '@xcoolsports/components/Common/Container';
import styles from '@xcoolsports/components/LoginUserTabs/Notifications/style';
import Header from '@xcoolsports/components/Messages/Header';
import Loading from '@xcoolsports/components/Common/Pages/Loading';
import { 
    selectCurrentUser, selectMessagesWithUser, 
    selectUserByUsername, api, selectLatestMessage,
} from '@xcoolsports/data';
import SecondaryContainedButton from '@xcoolsports/components/utils/Buttons/SecondaryContainedButton';
import stompClientFactory from '@xcoolsports/utils/stompClientFactory';

// 每30秒get 100个 unread chat，从旧到新
// 然后在redux里面groupby, 分成一个人为一个key对应的聊天array
// 打开聊天记录，设成一直已读，并且能发送聊天记录
// 增加删除功能

const Messages = ({ route, navigation }) => {
    const { t, i18n } = useTranslation();
    const { usernameURL } = route.params;
    const isMounted = useRef(true);
    const chatRef = useRef();
    const stompRef = useRef(stompClientFactory.getInstace()).current;
    const theme = useContext(ThemeContext);

    const [text, setText] = useState('');

    api.endpoints.getUserProfile.useQuery({ username: usernameURL }, { skip: usernameURL === undefined });
    const [markAsRead] = api.endpoints.updateAllMessagesByUserAsRead.useMutation();

    const currentUser = useSelector(selectCurrentUser);
    const messagePartner = useSelector((state) => selectUserByUsername(state, usernameURL));
    const messagesByUser = useSelector((state) => selectMessagesWithUser(state, usernameURL));
    const latestMessage = useSelector(selectLatestMessage);
        
    const handleChatSent = async () => {
        stompRef.send(messagePartner?.username, text);
        setText('');
    };

    const handleChatsMarkedAsRead = async () => {
        await markAsRead({ 
            sender: messagePartner?.username, 
            lte: latestMessage.id, 
            type: "message" 
        });
    }

    useEffect(() => {
        if (messagesByUser?.length && currentUser?.token && messagePartner?.username) handleChatsMarkedAsRead();
    }, [messagesByUser?.length, currentUser?.token, messagePartner?.username]);

    useEffect(() => {
        return () => { isMounted.current = false; }
    }, []);

    const isLoading = currentUser === undefined || messagePartner === undefined || messagesByUser === undefined;

    return (
        <Container
            header={{
                title: `${t('私信')}`,
                headerLeft: {onPress: navigation.goBack},
                headerTitle: {headerTitleComponent: <Header navigation={navigation} messagePartner={messagePartner} />},
                headerRight: {},
            }}
        >
            <Loading isLoading={isLoading} />
            {!isLoading && 
                <View style={{ flex: 1 }}>
                    <ScrollView
                        ref={chatRef}
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        vertical
                        onContentSizeChange={() => chatRef.current?.scrollToEnd({animated: false})}
                        onLayout={() => chatRef.current?.scrollToEnd({animated: false})}
                        // 应该只有在最下面一行显示的时候才贴在最下面
                    >
                        {messagesByUser.map(message => 
                            <View key={message.id} style={styles.chatContainer}>
                                {message.is_incoming
                                    ?
                                    <View style={styles.chatUserContainer}>
                                        <Image 
                                            containerStyle={styles.messageAvatar}
                                            isSelectedUploading={false}
                                            editMode={false}
                                            showloading={false}
                                            source={message.partner.avatar ? { uri :`${urlConstants.images}/${message.partner.avatar}` } : require('@xcoolsports/static/avatar.jpg')}
                                            resizeMode="cover"
                                        />  

                                        <Text style={[styles.chatUserText, {backgroundColor: theme.fill_placeholder, color: theme.text_color}]}>{message.text}</Text>
                                    </View>
                                    :
                                    <View style={styles.chatSelfContainer}>
                                        <Text style={[styles.chatSelfText, {color: theme.text_color}]}>{message.text}</Text>

                                        <Image 
                                            containerStyle={styles.messageAvatar}
                                            isSelectedUploading={false}
                                            editMode={false}
                                            showloading={false}
                                            source={currentUser.avatar ? { uri :`${urlConstants.images}/${currentUser.avatar}` } : require('@xcoolsports/static/avatar.jpg')}
                                            resizeMode="cover"
                                        />  
                                    </View>
                                }
                            </View>
                        )}
                    </ScrollView> 
                    
                    <View style={[styles.inputContainerDefault, {backgroundColor: theme.fill_placeholder}]}>
                        <TextInput
                            placeholderTextColor={theme.secondary_variant}
                            style={[styles.sendTextInput, {backgroundColor: theme.fill_base, color: theme.text_color}]}
                            placeholder={`${t('发送消息')}`}
                            onChangeText={setText}
                            value={text}
                            onSubmitEditing={({ nativeEvent: { text }}) => { 
                                if (text !== '') handleChatSent();
                            }}
                        />
                        
                        {text !== '' && 
                            <SecondaryContainedButton 
                                buttonFreeStyle={{height: 35, width: 80}}
                                onPress={handleChatSent}
                                textFreeStyle={{fontSize: theme.font_size_base, fontWeight: 'bold'}}
                                buttonText={'发送'} 
                            />
                        }
                    </View>
                </View>
            } 
        </Container>        
    );
};

export default Messages;