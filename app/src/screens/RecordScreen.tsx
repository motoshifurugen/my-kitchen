/**
 * Record Screen (S-04: 記録)
 *
 * Unified screen for photo + form.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  type NavigationProp,
  type RouteProp,
} from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { FlowShell, ModalShell } from '../components/templates';
import { Button } from '../components/molecules';
import { AppImage, Divider, PressableBase, Surface, Text } from '../components/atoms';
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
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const handleDishNameChange = useCallback((text: string) => {
    setDishName(text);
    setSelectedMenuId(null);
    setShowSuggestions(true);
  }, []);

  const filteredMenuItems = useMemo(() => {
    const query = dishName.trim();
    if (!query) return MENU_CATALOG.slice(0, 6);
    const lower = query.toLowerCase();
    return MENU_CATALOG.filter((item) =>
      item.label.includes(query) || item.id.toLowerCase().includes(lower)
    ).slice(0, 6);
  }, [dishName]);

  const selectedMenu = useMemo(
    () => MENU_CATALOG.find((item) => item.id === selectedMenuId),
    [selectedMenuId]
  );

  const handleSelectMenu = useCallback((label: string, id: string) => {
    setDishName(label);
    setSelectedMenuId(id);
    setShowSuggestions(false);
  }, []);

  const isDishNameValid = dishName.trim().length > 0;

  const handleSave = useCallback(() => {
    if (!isDishNameValid) return;
    navigation.navigate('RecordCelebration');
  }, [isDishNameValid, navigation]);

  const photoAreaHeight = Math.max(120, Math.min(180, Math.round(windowHeight * 0.22)));
  const suggestionVisible = showSuggestions && filteredMenuItems.length > 0;

  const memoButtonLabel = memo.trim().length > 0 ? 'メモ ✓' : 'メモを追加';

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
          <View style={styles.photoRow}>
            <PressableBase
              style={styles.photoCell}
              onPress={handleOpenCamera}
              accessibilityLabel="写真を撮る"
            >
              <View style={[styles.photoArea, { height: photoAreaHeight }]}
              >
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
              <Text variant="caption" style={styles.photoTapHint}>
                タップで撮り直し
              </Text>
            </PressableBase>

            <View style={styles.libraryCell}>
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
            </View>
          </View>

          <Text variant="caption" style={styles.photoHint}>
            写真なしでも追加できます
          </Text>

          <Divider margin="lg" />

          <View style={styles.formSection}>
            <Text variant="caption" style={styles.sectionLabel}>
              料理名 *
            </Text>
            <Surface rounded="md" padding="sm" style={styles.inputSurface}>
              {selectedMenu?.icon && (
                <AppImage
                  source={selectedMenu.icon}
                  width={32}
                  height={32}
                  rounded="md"
                  accessibilityLabel={selectedMenu.label}
                />
              )}
              <TextInput
                value={dishName}
                onChangeText={handleDishNameChange}
                placeholder="（空欄）"
                placeholderTextColor={theme.colors.text.tertiary}
                style={styles.textInput}
                accessibilityLabel="料理名"
                accessibilityHint="必須項目です"
                accessibilityRequired
              />
            </Surface>

            {suggestionVisible && (
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
                      width={32}
                      height={32}
                      rounded="md"
                      accessibilityLabel={item.label}
                    />
                    <Text variant="body" style={styles.suggestionLabel}>
                      {item.label}
                    </Text>
                  </PressableBase>
                ))}
              </View>
            )}

            <View style={styles.splitRow}>
              <PressableBase
                style={styles.splitButton}
                onPress={() => setShowSuggestions((prev) => !prev)}
                accessibilityLabel="候補から選ぶ"
              >
                <AppImage
                  source={MENU_CATALOG[0].icon}
                  width={28}
                  height={28}
                  rounded="md"
                  accessibilityLabel="候補の例"
                />
                <Text variant="caption" style={styles.splitLabel}>
                  候補から選ぶ
                </Text>
              </PressableBase>

              <PressableBase
                style={styles.splitButton}
                onPress={() => setShowMemoModal(true)}
                accessibilityLabel={memoButtonLabel}
              >
                <Text variant="caption" style={styles.splitLabel}>
                  {memoButtonLabel}
                </Text>
              </PressableBase>
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

      <ModalShell
        visible={showMemoModal}
        onClose={() => setShowMemoModal(false)}
        header={{ title: 'メモ' }}
        animationType="slide"
      >
        <View style={styles.memoModalContent}>
          <TextInput
            value={memo}
            onChangeText={setMemo}
            placeholder="メモを書く"
            placeholderTextColor={theme.colors.text.tertiary}
            multiline
            style={styles.memoInput}
          />
          <Button
            label="OK"
            variant="primary"
            fullWidth
            onPress={() => setShowMemoModal(false)}
          />
        </View>
      </ModalShell>
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
  photoRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'stretch',
  },
  photoCell: {
    flex: 1,
  },
  libraryCell: {
    flex: 1,
    gap: theme.spacing.sm,
    justifyContent: 'center',
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
  photoTapHint: {
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    color: theme.colors.text.tertiary,
  },
  photoHint: {
    textAlign: 'center',
    color: theme.colors.text.tertiary,
  },
  formSection: {
    gap: theme.spacing.lg,
  },
  sectionLabel: {
    color: theme.colors.text.secondary,
  },
  inputSurface: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  textInput: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.md,
    paddingVertical: theme.spacing.xs,
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
  splitRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  splitButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.surface.elevated,
    gap: theme.spacing.xs,
  },
  splitLabel: {
    color: theme.colors.text.secondary,
  },
  memoModalContent: {
    flex: 1,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  memoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    color: theme.colors.text.primary,
    textAlignVertical: 'top',
  },
});
