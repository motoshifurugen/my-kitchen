/**
 * Record Form Screen (S-04b: 入力フォーム)
 *
 * Collects dish name (required), memo (optional), and tags (optional).
 * Photo is optional and passed from S-04a.
 */

import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';
import { FlowShell } from '../components/templates';
import { Button, TextArea, TextField, Chip } from '../components/molecules';
import { AppImage, Divider, Text } from '../components/atoms';
import { theme } from '../tokens';
import type { RecordStackParamList } from '../navigation/RecordNavigator';

export const RecordFormScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RecordStackParamList>>();
  const route = useRoute<RouteProp<RecordStackParamList, 'RecordForm'>>();
  const { photoUri } = route.params ?? { photoUri: null };
  const [dishName, setDishName] = useState('');
  const [memo, setMemo] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showDishNameError, setShowDishNameError] = useState(false);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const isDishNameValid = useMemo(() => dishName.trim().length > 0, [dishName]);

  const handleAddTag = useCallback(() => {
    const nextTag = tagInput.trim();
    if (!nextTag) return;
    if (tags.includes(nextTag)) {
      setTagInput('');
      return;
    }
    setTags((prev) => [...prev, nextTag]);
    setTagInput('');
  }, [tagInput, tags]);

  const handleNext = useCallback(() => {
    if (!isDishNameValid) {
      setShowDishNameError(true);
      return;
    }
    navigation.navigate('RecordConfirm', {
      photoUri,
      dishName: dishName.trim(),
      memo: memo.trim(),
      tags,
    });
  }, [isDishNameValid, navigation, photoUri, dishName, memo, tags]);

  return (
    <FlowShell
      header={{
        title: '記録する',
        showBack: true,
        onBack: handleBack,
      }}
      showWorldBackground
      scrollable
      avoidKeyboard
    >
      <View style={styles.content}>
        {photoUri ? (
          <AppImage
            source={{ uri: photoUri }}
            rounded="lg"
            accessibilityLabel="選択した写真"
            style={styles.photoPreview}
          />
        ) : (
          <View style={styles.photoPlaceholder} accessibilityLabel="写真なし" />
        )}

        <Divider margin="lg" />

        <TextField
          label="料理名 *"
          value={dishName}
          onChangeText={(text) => {
            setDishName(text);
            if (showDishNameError && text.trim().length > 0) {
              setShowDishNameError(false);
            }
          }}
          placeholder="（空欄）"
          accessibilityLabel="料理名"
          accessibilityHint="必須項目です"
          accessibilityRequired
          error={showDishNameError ? '料理名を入力してください' : undefined}
        />

        <TextArea
          label="メモ（任意）"
          value={memo}
          onChangeText={setMemo}
          placeholder=""
          numberOfLines={4}
        />

        <View style={styles.tagSection}>
          <Text variant="caption" style={styles.tagLabel}>
            タグ（任意）
          </Text>
          {tags.length > 0 && (
            <View style={styles.tagList}>
              {tags.map((tag) => (
                <Chip key={tag} label={tag} />
              ))}
            </View>
          )}
          <View style={styles.tagInputRow}>
            <TextField
              value={tagInput}
              onChangeText={setTagInput}
              accessibilityLabel="タグ"
            />
            <View style={styles.tagButton}>
              <Button
                label="+ タグを追加"
                variant="ghost"
                onPress={handleAddTag}
                accessibilityLabel="タグを追加"
              />
            </View>
          </View>
        </View>

        <Button
          label="確認へ"
          variant="primary"
          fullWidth
          onPress={handleNext}
          accessibilityLabel="確認へ進む"
        />
      </View>
    </FlowShell>
  );
};

RecordFormScreen.displayName = 'RecordFormScreen';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  photoPreview: {
    width: '100%',
    height: 220,
  },
  photoPlaceholder: {
    width: '100%',
    height: 220,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  tagSection: {
    gap: theme.spacing.sm,
  },
  tagLabel: {
    color: theme.colors.text.secondary,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tagInputRow: {
    gap: theme.spacing.sm,
  },
  tagButton: {
    alignSelf: 'flex-start',
  },
});
