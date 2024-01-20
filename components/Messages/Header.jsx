import React, {useContext} from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Image from '../utils/Image';
import urlConstants from '../../constants/urls';
import styles from '@xcoolsports/components/LoginUserTabs/Notifications/style';
import Loading from '@xcoolsports/components/Common/Pages/Loading';
import { ThemeContext } from '@xcoolsports/constants/theme';

const Header = ({ navigation, messagePartner }) => {
    const { t, i18n } = useTranslation();
    const theme = useContext(ThemeContext);

    const isLoading = messagePartner === undefined;

    return (
        <View style={styles.header}>
            <Loading isLoading={isLoading} />
            {!isLoading && 
                <Pressable 
                    hitSlop={10}
                    style={styles.header}
                    onPress={() => { 
                        messagePartner?.username
                        ? navigation.push(`${t('看用户')}`, { usernameURL: messagePartner.username })
                        : null
                    }}
                >
                    <Image 
                        containerStyle={styles.messageAvatar}
                        isSelectedUploading={false}
                        editMode={false}
                        showloading={false}
                        source={messagePartner.avatar ? { uri :`${urlConstants.images}/${messagePartner.avatar}` } : require('@xcoolsports/static/avatar.jpg')}
                        resizeMode="cover"
                    />  

                    <Text style={{ width: 150, color: theme.text_color }}>{ messagePartner.nickname }</Text>
                </Pressable>
            }          
        </View>
    );
};

export default Header;