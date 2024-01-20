import React, { useState, useContext } from 'react';
import { Pressable, Text, View, StyleSheet, Switch, TextInput } from 'react-native';
import { Chip } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons'; 
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import SlideUpModal from '@xcoolsports/components/utils/SlideUpModal';
import { selectTags, configActions } from '@xcoolsports/data';
import PrimaryContainedButton from '@xcoolsports/components/utils/Buttons/PrimaryContainedButton';
import SecondaryContainedButton from '@xcoolsports/components/utils/Buttons/SecondaryContainedButton';

const styles = StyleSheet.create({
  container: {
    padding: theme.v_spacing_lg,
  },
  textInput: {
    borderBottomWidth: 1,
    height: 50,
  },
  textarea: {
    paddingHorizontal: 0,
    marginHorizontal: 0,
    height: 300,
    borderBottomWidth: 1,
  },
  textContainer: {
    paddingBottom: theme.v_spacing_2xl, 
  },
  switch: {
    height: 50,
    flexDirection: 'row', 
    alignItems: 'center',
  },
  row: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between',
  },
  text: {
    flexDirection: "row", 
    justifyContent: 'flex-end', 
    flexShrink: 1, 
    marginLeft: theme.h_spacing_xl,
  },
  button: {
    marginVertical: 15, 
    borderRadius: 10, 
  },
  modalContainer: {
    margin: theme.v_spacing_lg,
    marginTop: 0,
  },
  radioGroup: {
    maxHeight: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radio: {
    alignItems: 'flex-start',
    justifyContent: "center",
    width: '33.33333%',
  },
});

const Content = ({ 
  onEdit, content, title, tags, isPublic, submitLoaing, 
  setTitle, setContent, setIsPublic, setTags,
  handleTopicSubmit, handleEventSubmit, isEvent,
}) => {
  const { t, i18n } = useTranslation();
  const [addTag, setAddTag] = useState('');
  const [tagsModal, setTagsModal] = useState(false);
  const totalTags = useSelector(selectTags);
  const theme = useContext(ThemeContext);

  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <TextInput 
        style={[styles.textInput, {color: theme.text_color, borderBottomColor: theme.fill_disabled}]}
        placeholder={t("填写标题会有更多赞哦")}
        placeholderTextColor={theme.secondary_variant}
        onChangeText={text => setTitle(text)}
        value={title}
        maxLength={50}
      />

      <TextInput 
        onFocus={onEdit}
        placeholder={t("添加正文")}
        placeholderTextColor={theme.secondary_variant}
        style={[styles.textarea, {
          color: theme.text_color, borderBottomColor: theme.fill_disabled,
          textAlignVertical: 'top', paddingVertical: theme.v_spacing_md,
        }]}
        multiline
        numberOfLines={12}
        maxLength={5000}
        clear={true} 
        value={content}
        onChangeText={(text) => setContent(text)}
      />

      <View style={styles.switch}>
        <Text style={{ marginRight: theme.h_spacing_md, color: theme.text_color }}>{t("公开可见")}</Text>
        <Switch
          trackColor={{ false: theme.fill_placeholder, true: theme.secondary_color }}
          thumbColor={isPublic ? theme.fill_base : theme.fill_base}
          ios_backgroundColor={theme.fill_placeholder}
          onValueChange={(e) => setIsPublic(e)}
          value={isPublic}
        />
      </View>

      <Pressable hitSlop={10} onPress={() => setTagsModal(true)} style={styles.row}> 
        <Text style={{color: theme.text_color}}>{t("标签")}</Text>
        <View style={styles.text}>
          {tags.length !== 0 && <Text style={{color: theme.text_color}} numberOfLines={1}> {tags[0]} </Text>}
          <AntDesign name="edit" size={theme.icon_size_xxs} color={theme.fill_mask} />
        </View>
      </Pressable>

      <SlideUpModal
        title={t("请选择标签")}
        onClose={() => setTagsModal(false)}
        visible={tagsModal}
        onOk={() => setTagsModal(false)}
        okTitle={t("确定")}
        disableOk={tags.length === 0}
      >
        <View style={styles.modalContainer}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
            {totalTags.map((tag) => 
              <Chip 
                key={tag} 
                mode="outlined" 
                closeIcon="close"
                onPress={() => {
                  if (tag !== tags[0]) setTags([tag]);
                  else setTags((prev) => prev.filter((t) => t !== tag));
                }} 
                style={tag === tags[0]
                  ? { fontSize: theme.font_size_base, backgroundColor: theme.primary_variant, margin: theme.v_spacing_xs } 
                  : { fontSize: theme.font_size_base, backgroundColor: theme.fill_base, margin: theme.v_spacing_xs }}
                textStyle={tag === tags[0]
                  ? { color: theme.fill_base }
                  : { color: theme.secondary_variant }}
              >{tag}</Chip>
            )}
          </View>

          <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginVertical: theme.v_spacing_lg, }}>
            <TextInput
              style={{ 
                borderWidth: 1, flex: 1, borderRadius: 10, borderColor: theme.fill_disabled, 
                padding: theme.v_spacing_sm, marginHorizontal: theme.h_spacing_sm,
                height: 45, color: theme.text_color,
              }}
              placeholder={t("你的标签")}
              placeholderTextColor={theme.secondary_variant}
              value={addTag}
              onChangeText={(text) => {
                setAddTag(text);
              }}
              onSubmitEditing={({ nativeEvent: { text }}) => {
                setAddTag('');
                dispatch(configActions.addTags(addTag));
              }}
            />

            <SecondaryContainedButton 
              buttonFreeStyle={{height: 45, width: 80}} 
              onPress={() => {
                setAddTag('');
                dispatch(configActions.addTags(addTag));
              }}
              textFreeStyle={{fontSize: theme.font_size_base}} 
              disabled={addTag === ''}
              buttonText={'添加'} 
            />
          </View> 
        </View> 
      </SlideUpModal>

      <PrimaryContainedButton 
        buttonFreeStyle={{height: 50, marginVertical: theme.v_spacing_2xl}} 
        onPress={isEvent ? handleEventSubmit : handleTopicSubmit}
        loading={submitLoaing}
        textFreeStyle={{fontSize: theme.font_size_caption}} 
        buttonText={'提交'} 
      />
    </View>
  )
};

export default Content;