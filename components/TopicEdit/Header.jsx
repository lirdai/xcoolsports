import React, { useState, useContext } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import {ThemeContext} from '@xcoolsports/constants/theme';
import PopUpModal from '@xcoolsports/components/utils/PopUpModal';
import SecondaryContainedButton from '@xcoolsports/components/utils/Buttons/SecondaryContainedButton';

const styles = StyleSheet.create({
  container: {
    width: 100, 
    alignItems: 'center',
  },
  button: {
    marginVertical: 15, 
    height: 50,
  },
});

const Header = ({ isEvent }) => {
  const { t, i18n } = useTranslation();
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const theme = useContext(ThemeContext);

  if (isEvent) {
    return (
      <View style={styles.container}>
        <Pressable hitSlop={10} onPress={() => setOpenWarningModal(true)} > 
          <Text style={{color: theme.text_color}}>{t('免责声明')}</Text>
        </Pressable>
  
        <PopUpModal
          title={t('免责声明')}
          onClose={() => setOpenWarningModal(false)}
          visible={openWarningModal}
        >
          <View>
            <Text style={{ fontWeight: 'bold', marginBottom: theme.v_spacing_xs, color: theme.text_color }}>顽酷在此声明，发布活动前，请仔细阅读以下内容: </Text>
            <Text style={{color: theme.text_color}}>1. 请认真研读当地法律法规, 以及各种相关应急措施等; </Text>
            <Text style={{color: theme.text_color}}>2. 请写清楚价格所含内容; </Text>
            <Text style={{color: theme.text_color}}>如果出现任何法律或者经济纠纷, 顽酷平台将会尽可能提供信息和帮助, 但顽酷平台将不承担任何法律或经济责任。</Text>

            <SecondaryContainedButton 
              buttonFreeStyle={styles.button} 
              onPress={() => setOpenWarningModal(false)}
              textFreeStyle={{fontSize: theme.font_size_caption}} 
              buttonText={'我知道了'} 
            />
          </View>
        </PopUpModal>
      </View>
    ); 
  }

  if (!isEvent) {
    return (
      <View style={styles.container}>
        <Pressable hitSlop={10} onPress={() => setOpenWarningModal(true)} > 
          <Text style={{color: theme.text_color}}>{t('温馨提示')}</Text>
        </Pressable>
  
        <PopUpModal
          title={t('温馨提示')}
          onClose={() => setOpenWarningModal(false)}
          visible={openWarningModal}
        >
          <View>
            <Text style={{ fontWeight: 'bold', marginBottom: theme.v_spacing_xs, color: theme.text_color }}>顽酷鼓励向上，真实， 原创的内容, 含以下内容的新帖不会被推荐，甚至可能会被封禁: </Text>
            <Text style={{color: theme.text_color}}>1. 含有不文明语言，过度性感图片等不和谐内容;</Text>
            <Text style={{color: theme.text_color}}>2. 含有网址链接，联系方式，二维码或售卖语言;</Text>
            <Text style={{color: theme.text_color}}>3. 冒充他人身份或搬运他人作品;</Text>
            <Text style={{color: theme.text_color}}>4. 通过有奖方式诱导他人点赞，评论，收藏，转发，关注;</Text>
            <Text style={{color: theme.text_color}}>5. 为刻意博取眼球，在标题，封面等处使用夸张表达;</Text>
            <Text style={{color: theme.text_color}}>6. 含有不符合网站主题的内容;</Text>

            <SecondaryContainedButton 
              buttonFreeStyle={styles.button} 
              onPress={() => setOpenWarningModal(false)}
              textFreeStyle={{fontSize: theme.font_size_caption}} 
              buttonText={'我知道了'} 
            />
          </View>
        </PopUpModal>
      </View>
    );
  }
};

export default Header;
