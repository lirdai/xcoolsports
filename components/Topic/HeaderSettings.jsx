import React, { useState, useContext } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 

import TopicMenu from '@xcoolsports/components/Topic/TopicMenu';
import SlideUpModal from '@xcoolsports/components/utils/SlideUpModal';
import theme, {ThemeContext} from '@xcoolsports/constants/theme';

const styles = StyleSheet.create({
  setting: {
    alignSelf: 'center', 
  },
});

const HeaderSettings = ({ navigation, topic }) => {
  const [openSetttingModal, setOpenSettingModal] = useState(false);
  const theme = useContext(ThemeContext);
  
  if (!topic) return null;

  return (
    <View style={styles.setting}>    
      <Pressable hitSlop={10} onPress={() => setOpenSettingModal(!openSetttingModal)}>
        <AntDesign name="setting" size={theme.icon_size_xxs} color={theme.fill_mask} />
      </Pressable>

      <SlideUpModal
        onClose={() => setOpenSettingModal(false)}
        visible={openSetttingModal}
      >
        <TopicMenu topic={topic} navigation={navigation} onClose={() => setOpenSettingModal(false)} />
      </SlideUpModal>
    </View>
  );
};

export default HeaderSettings;