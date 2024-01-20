import React, { useContext } from 'react';
import { Text, Pressable, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AntDesign } from '@expo/vector-icons'; 
import { useTranslation } from 'react-i18next';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import { api, toastActions, toastTypes, selectCurrentUser } from '@xcoolsports/data';
import AnimatedReactionIcons from '@xcoolsports/components/utils/AnimationComponents/AnimatedReactionIcons';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  textSmall: {
    textAlign: 'center', 
    fontSize: theme.font_size_icontext,
  },
  textDefault: {
    textAlign: 'center', 
    fontSize: theme.font_size_base,
  },
});

const Like = ({ style, topic, size, navigation }) => {
  const { t, i18n } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);

  const [updateTopicLike] = api.endpoints.updateTopicLike.useMutation();

  const handleLikeSubmit = async () => {
    if (!currentUser.is_logged_in) { 
      navigation.navigate(`${t('登录')}`); 
      return; 
    } else if (!currentUser.is_verified) {
      navigation.navigate(`${t("输入手机号")}`, { verificationType: "VERIFYPHONE" });
      dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '记得要验证手机号哦' }));
      return;
    } else if (currentUser.is_banned.users) {
      dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '账号被封, 请耐心等待' }));
      return;
    }

    const newLike = {
      topicID: topic.id,
    };

    if (topic.i_like === 1) {
      newLike.like = 0;
    } else {
      newLike.like = 1;
    }

    await updateTopicLike(newLike);
  };

  if (size === 'small') {
    return (
      <View style={[styles.container, style]}>
        {
          topic?.i_like === 1
            ? 
            <Pressable hitSlop={{top:50, bottom:50, right:50, left: 50}} onPress={handleLikeSubmit}>
              <AntDesign name="like1" size={theme.icon_size_xxs} color={theme.brand_error} />
            </Pressable>
            : 
            <AnimatedReactionIcons 
              containerStyle={styles.container}
              hitSlop={{top:20, bottom:20, right:20, left: 20}}
              onPress={handleLikeSubmit}
              onPressInComponent={<AntDesign name="like2" size={theme.icon_size_xxs} color={theme.secondary_variant} />}
            >
              <AntDesign name="like2" size={theme.icon_size_xxs} color={theme.secondary_variant} />
            </AnimatedReactionIcons>
        }

        
        <View pointerEvents='none'>
          <Text style={[{color: theme.secondary_variant}, styles.textSmall]}> {topic?.num_likes} </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, style]}>
      {
        topic?.i_like === 1
          ? 
          <Pressable hitSlop={{top:10, bottom:10, right:30}} onPress={handleLikeSubmit}>
            <AntDesign name="like1" size={theme.icon_size} color={theme.brand_error} />
          </Pressable>
          : 
          <AnimatedReactionIcons 
            containerStyle={styles.container}
            hitSlop={{top:10, bottom:10, right:30}}
            onPress={handleLikeSubmit}
            onPressInComponent={<AntDesign name="like2" size={theme.icon_size} color={theme.secondary_variant} />}
          >
            <AntDesign name="like2" size={theme.icon_size} color={theme.secondary_variant} />
          </AnimatedReactionIcons>
      }

      <View pointerEvents='none'>
        <Text style={[{color: theme.secondary_variant}, styles.textDefault]}> {topic?.num_likes} </Text>
      </View>
    </View>
  )
}

export default Like;