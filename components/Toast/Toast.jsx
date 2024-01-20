import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { useTranslation } from 'react-i18next'

import theme, { ThemeContext } from '@xcoolsports/constants/theme';
import { toastActions, selectToast } from '@xcoolsports/data';

const icon = {
  "SUCCESS": {
    "name": "checkcircle",
    "color": theme.brand_success,
  },
  "ERROR": {
    "name": "closecircle",
    "color": theme.brand_error,
  },
  "WARNING": {
    "name": "exclamationcircle",
    "color": theme.brand_important,
  },
  "CHAT": {
    "name": "message1",
    "color": theme.brand_wait,
  },
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      position: "absolute",
      top: 40,
      margin: 'auto',
      width: '100%',
      padding: theme.h_spacing_lg,
  },
  box: {
    margin: theme.v_spacing_xs,
    padding: theme.h_spacing_sm,
    flexDirection: 'row',
    alignItems: 'center', 
    borderRadius: theme.radius_lg,
  },
  boxWithShadow: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,  
    elevation: 5,
  },
  text: {
    paddingHorizontal: theme.h_spacing_sm,
  }
});

const Toast = () => {
  const { t, i18n } = useTranslation();
  const toasts = useSelector(selectToast);
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);

  const removeToast = (id) => {
    dispatch(toastActions.removeToast(id));
  };

  return (
    <View style={styles.container} pointerEvents='box-none'>
      {toasts.map((toast) => (
        <Pressable hitSlop={20} onPress={() => removeToast(toast.id)} key={toast.id} style={[styles.box, styles.boxWithShadow, {backgroundColor: theme.fill_base, shadowColor: theme.secondary_color}]}>
          <AntDesign name={icon[toast.type]['name']} size={theme.font_size_caption} color={icon[toast.type]['color']} />
          <Text style={[styles.text, {color: theme.text_color}]}> {t(toast.text)} </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default Toast;
