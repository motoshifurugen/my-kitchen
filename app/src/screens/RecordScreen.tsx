/**
 * Record Screen (S-04: 記録)
 *
 * Unified screen for photo + form.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { FlowShell } from '../components/templates';
import { Button, TextArea, TextField } from '../components/molecules';
import { AppImage, PressableBase, Surface, Text, Divider } from '../components/atoms';
import { theme } from '../tokens';
import type { RecordStackParamList } from '../navigation/RecordNavigator';
import type { RootTabParamList } from '../navigation/TabNavigator';
import { MENU_CATALOG } from '../data/menuCatalog';

export const RecordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RecordStackParamList>>();
  const route = useRoute<RouteProp<RecordStackParamList, 'RecordSelect'>>();
  const { height: windowHeight } = useWindowDimensions();

  const [photoUri, setPhotoUri] = useState<string | null>(route.params?.photoUri ?? null);
  const [dishName, setDishName] = useState('');
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [memo, setMemo] = useState('');
  const [showMemo, setShowMemo] = useState(false);

  useEffect(() => {
    if (route.params?.photoUri !== undefined) {
      setPhotoUri(route.params.photoUri ?? null);
    }
  }, [route.params?.photoUri]);

  const navigateToHome = useCallback(() => {
    const parentNavigation = navigation.getParent<NavigationProp<RootTabParamList>>();
    if (parentNavigation) {
      parentNavigation.navigate('Home');
      return;
    }
    navigation.navigate('RecordSelect');
  }, [navigation]);

  const handleOpenCamera = useCallback(() => {
    navigation.navigate('RecordCamera');
  }, [navigation]);

  const handlePickFromLibrary = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('写真にアクセスできませんでした。\n\n設定から許可をご確認ください。');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (asset?.uri) {
        setPhotoUri(asset.uri);
      }
    } catch {
      Alert.alert('写真にアクセスできませんでした。\n\n設定から許可をご確認ください。');
    }
  }, []);

  const handleClearPhoto = useCallback(() => {
    setPhotoUri(null);
  }, []);

  const isDishNameValid = dishName.trim().length > 0;

  const filteredMenuItems = useMemo(() => {
    const query = dishName.trim();
    if (!query) return MENU_CATALOG.slice(0, 6);
    const lower = query.toLowerCase();
    return MENU_CATALOG.filter((item) =>
      item.label.includes(query) || item.id.toLowerCase().includes(lower)
    ).slice(0, 6);
  }, [dishName]);

  const handleSelectMenu = useCallback((label: string, id: string) => {
    setDishName(label);
    setSelectedMenuId(id);
  }, []);

  const handleDishNameChange = useCallback((text: string) => {
    setDishName(text);
    setSelectedMenuId(null);
  }, []);

  const handleSave = useCallback(() => {
    if (!isDishNameValid) return;
    navigation.navigate('RecordCelebration');
  }, [isDishNameValid, navigation]);

  const photoAreaHeight = Math.max(200, Math.min(320, Math.round(windowHeight * 0.33)));

  return (
    <FlowShell
      header={{
        title: '今日の料理',
        rightIcon: 'X',
        onRightPress: navigateToHome,
        rightAccessibilityLabel: 'やめる',
      }}
      showWorldBackground
      scrollable
      avoidKeyboard
    >
      <View style={styles.content}>
        <Surface rounded="lg" elevation="sm" padding="lg" style={styles.card}>
          <View style={[styles.photoArea, { height: photoAreaHeight }]}>
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
          </View>

          <View style={styles.photoActions}>
            <Button
              label="写真を撮る"
              iconLeft="Camera"
              variant="primary"
              size="md"
              fullWidth
              onPress={handleOpenCamera}
            />
            <Button
              label="ライブラリから選ぶ"
              iconLeft="Image"
              variant="secondary"
              size="md"
              fullWidth
              onPress={handlePickFromLibrary}
            />
            {photoUri && (
              <Button
                label="写真を削除"
                variant="ghost"
                size="sm"
                fullWidth
                onPress={handleClearPhoto}
              />
            )}
            <Text variant="caption" style={styles.photoHint}>
              写真なしでも追加できます
            </Text>
          </View>

          <Divider margin="lg" />

          <View style={styles.formSection}>
            <TextField
              label="料理名 *"
              value={dishName}
              onChangeText={handleDishNameChange}
              placeholder="（空欄）"
              accessibilityLabel="料理名"
              accessibilityHint="必須項目です"
              accessibilityRequired
            />

            <View style={styles.suggestionHeader}>
              <Text variant="caption" style={styles.sectionLabel}>
                候補から選ぶ（任意）
              </Text>
              {selectedMenuId ? (
                <Text variant="caption" style={styles.selectedHint}>
                  選択中
                </Text>
              ) : null}
            </View>
            <View style={styles.suggestionList}>
              {filteredMenuItems.map((item) => (
                <PressableBase
                  key={item.id}
                  style={({ pressed }) => [
                    styles.suggestionItem,
                    pressed && styles.suggestionPressed,
                    selectedMenuId === item.id && styles.suggestionSelected,
                  ]}
                  onPress={() => handleSelectMenu(item.label, item.id)}
                  accessibilityLabel={item.label}
                >
                  <AppImage
                    source={item.icon}
                    width={36}
                    height={36}
                    rounded="md"
                    accessibilityLabel={item.label}
                  />
                  <Text variant="body" style={styles.suggestionLabel}>
                    {item.label}
                  </Text>
                </PressableBase>
              ))}
            </View>
            <Text variant="caption" style={styles.freeTextHint}>
              候補にない場合は、そのまま追加できます
            </Text>

            <View style={styles.memoSection}>
              {!showMemo ? (
                <Button
                  label="メモを追加"
                  variant="ghost"
                  size="sm"
                  onPress={() => setShowMemo(true)}
                  fullWidth
                />
              ) : (
                <TextArea
                  label="メモ（任意）"
                  value={memo}
                  onChangeText={setMemo}
                  numberOfLines={4}
                />
              )}
            </View>

            <Button
              label="図鑑に加える"
              variant="primary"
              fullWidth
              onPress={handleSave}
              disabled={!isDishNameValid}
              accessibilityLabel="図鑑に加える"
            />
          </View>
        </Surface>
      </View>
    </FlowShell>
  );
};

RecordScreen.displayName = 'RecordScreen';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingBottom: theme.spacing.xl,
  },
  card: {
    gap: theme.spacing.lg,
  },
  photoArea: {
    width: '100%',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  photoActions: {
    gap: theme.spacing.sm,
  },
  photoHint: {
    textAlign: 'center',
    color: theme.colors.text.tertiary,
  },
  formSection: {
    gap: theme.spacing.lg,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    color: theme.colors.text.secondary,
  },
  selectedHint: {
    color: theme.colors.text.tertiary,
  },
  suggestionList: {
    gap: theme.spacing.sm,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  suggestionPressed: {
    opacity: theme.opacity.pressed,
  },
  suggestionSelected: {
    borderColor: theme.colors.accent.primary,
  },
  suggestionLabel: {
    flex: 1,
  },
  freeTextHint: {
    color: theme.colors.text.tertiary,
  },
  memoSection: {
    gap: theme.spacing.sm,
  },
});
