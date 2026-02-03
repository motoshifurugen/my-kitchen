/**
 * Record Confirm Screen (S-04c: 確認・保存)
 *
 * Shows a summary of the record before saving.
 */

import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';
import { FlowShell } from '../components/templates';
import { Button, Chip } from '../components/molecules';
import { AppImage, Divider, Text } from '../components/atoms';
import { theme } from '../tokens';
import type { RecordStackParamList } from '../navigation/RecordNavigator';

export const RecordConfirmScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RecordStackParamList>>();
  const route = useRoute<RouteProp<RecordStackParamList, 'RecordConfirm'>>();
  const { photoUri, dishName, memo, tags } = route.params;

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSave = useCallback(() => {
    navigation.navigate('RecordCelebration');
  }, [navigation]);

  return (
    <FlowShell
      header={{
        title: '確認',
        showBack: true,
        onBack: handleBack,
      }}
      showWorldBackground
      scrollable
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

        <View style={styles.section}>
          <Text variant="caption" style={styles.label}>
            料理名
          </Text>
          <Text variant="body">{dishName}</Text>
        </View>

        {memo ? (
          <View style={styles.section}>
            <Text variant="caption" style={styles.label}>
              メモ
            </Text>
            <Text variant="body">{memo}</Text>
          </View>
        ) : null}

        {tags.length > 0 ? (
          <View style={styles.section}>
            <Text variant="caption" style={styles.label}>
              タグ
            </Text>
            <View style={styles.tagList}>
              {tags.map((tag) => (
                <Chip key={tag} label={tag} />
              ))}
            </View>
          </View>
        ) : null}

        <Text variant="caption" style={styles.hint}>
          記録はあとから編集できます
        </Text>

        <Button
          label="保存する"
          variant="primary"
          fullWidth
          onPress={handleSave}
          accessibilityLabel="保存する"
        />
      </View>
    </FlowShell>
  );
};

RecordConfirmScreen.displayName = 'RecordConfirmScreen';

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
  section: {
    gap: theme.spacing.xs,
  },
  label: {
    color: theme.colors.text.secondary,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  hint: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
});
