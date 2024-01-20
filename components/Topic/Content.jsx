import React, { useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import { selectLanguage } from '@xcoolsports/data';

const styles = StyleSheet.create({
  container: {
    padding: theme.v_spacing_lg,
  },
  title: {
    marginVertical: theme.v_spacing_xs, 
    fontWeight: 'bold',
    fontSize: theme.font_size_heading,
  },
  date: {
    marginVertical: theme.v_spacing_xs, 
    fontSize: theme.font_size_icontext,
  },
  content: {
    marginVertical: theme.v_spacing_xs, 
    fontSize: theme.font_size_base,
  },
});

const Content = ({ topic }) => {
  const language = useSelector(selectLanguage);
  const theme = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, {color: theme.text_color}]}>{topic.title}</Text>
      <Text style={[styles.date, {color: theme.fill_mask}]}>{ new Date(topic.created_at).toLocaleString({language}) }</Text>
      <Text style={[styles.content, {color: theme.text_color}]}>{topic.content}</Text>
    </View>
  )
};

export default Content;
