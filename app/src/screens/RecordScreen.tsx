/**
 * Record Screen (S-04: 記録)
 *
 * Unified screen for photo + form.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  type NavigationProp,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { FlowShell } from '../components/templates';
import { Button, IconButton } from '../components/molecules';
import { AppImage, Icon, PressableBase, Surface, Text } from '../components/atoms';
import { theme } from '../tokens';
import type { RecordStackParamList } from '../navigation/RecordNavigator';
import type { RootStackParamList } from '../navigation/MainNavigator';
import { MENU_CATALOG } from '../data/menuCatalog';
import { recordCooking } from '../repositories';
import { getErrorMessage } from '../utils/errorMessages';

const MENU_GROUPS: { label: string; ids: string[] }[] = [
  {
    label: 'ご飯もの',
    ids: [
      'menu_curry_rice',
      'menu_egg_rice',
      'menu_fried_rice',
      'menu_gyudon',
      'menu_natto_rice',
      'menu_omurice',
      'menu_oyakodon',
      'menu_onigiri',
    ],
  },
  {
    label: '麺',
    ids: ['menu_ramen', 'menu_soba', 'menu_udon', 'menu_yakisoba'],
  },
  {
    label: '主菜',
    ids: [
      'menu_ginger_pork',
      'menu_hamburger',
      'menu_karaage',
      'menu_tonkatsu',
      'menu_stir_fried_pork',
    ],
  },
  {
    label: '副菜',
    ids: [
      'menu_salad',
      'menu_potato_salad',
      'menu_chilled_tofu',
      'menu_sashimi',
      'menu_gyoza',
      'menu_tamagoyaki',
    ],
  },
  {
    label: '汁もの',
    ids: ['menu_miso_soup', 'menu_stew'],
  },
];

export const RecordScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RecordStackParamList>>();
  const route = useRoute<RouteProp<RecordStackParamList, 'RecordSelect'>>();
  const scrollRef = useRef<ScrollView | null>(null);

  const [photoUri, setPhotoUri] = useState<string | null>(route.params?.photoUri ?? null);
  const [dishName, setDishName] = useState('');
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [memo, setMemo] = useState('');
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [photoSize, setPhotoSize] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (route.params?.photoUri !== undefined) {
      setPhotoUri(route.params.photoUri ?? null);
    }
  }, [route.params?.photoUri]);

  /**
   * NOTE (Regression Guard):
   * Record flow is presented as a RootStack modal (MainNavigator).
   * Do NOT navigate to Tab routes here, or the close animation won't run.
   * Always close the modal via RootStack goBack().
   */
  const navigateToHome = useCallback(() => {
    const rootNavigation = navigation.getParent<NavigationProp<RootStackParamList>>('RootStack');
    if (rootNavigation?.canGoBack()) {
      rootNavigation.goBack();
      return;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const navigateToSettings = useCallback(() => {
    const rootNavigation = navigation.getParent<NavigationProp<RootStackParamList>>('RootStack');
    if (rootNavigation) {
      rootNavigation.navigate('MainTabs', { screen: 'Settings' });
    }
  }, [navigation]);

  const handleOpenCamera = useCallback(() => {
    navigation.navigate('RecordCamera');
  }, [navigation]);

  const showPhotoAccessAlert = useCallback(() => {
    const { title, message } = getErrorMessage('photoAccess');
    Alert.alert(title, message, [
      { text: '閉じる', style: 'cancel' },
      {
        text: '設定を開く',
        onPress: () => {
          Linking.openSettings();
        },
      },
    ]);
  }, []);

  /**
   * NOTE (Regression Guard):
   * expo-image-picker v15 changed API:
   * - PermissionStatus.LIMITED was removed -> use accessPrivileges === 'limited'
   * - MediaTypeOptions.Images ("Images") is rejected -> use ['images']
   * Keep this block aligned with v15+ or the button will stop working on iOS.
   */
  const handlePickFromLibrary = useCallback(async () => {
    try {
      const currentPermission = await ImagePicker.getMediaLibraryPermissionsAsync();
      const isCurrentGranted =
        currentPermission.granted ||
        currentPermission.accessPrivileges === 'all' ||
        currentPermission.accessPrivileges === 'limited';

      let permissionGranted = isCurrentGranted;
      if (!permissionGranted) {
        const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();
        permissionGranted =
          requested.granted ||
          requested.accessPrivileges === 'all' ||
          requested.accessPrivileges === 'limited';
      }

      if (!permissionGranted) {
        showPhotoAccessAlert();
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'] as unknown as ImagePicker.MediaTypeOptions,
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (asset?.uri) {
        setPhotoUri(asset.uri);
      }
    } catch {
      showPhotoAccessAlert();
    }
  }, [showPhotoAccessAlert]);

  const handleClearPhoto = useCallback(() => {
    setPhotoUri(null);
  }, []);

  const scrollToInput = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 120, animated: true });
    }, 50);
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

  const handleSelectMenuFromModal = useCallback((label: string, id: string) => {
    setDishName(label);
    setSelectedMenuId(id);
    setShowMenuModal(false);
  }, []);

  const isDishNameValid = dishName.trim().length > 0;

  const handleSave = useCallback(async () => {
    if (!isDishNameValid || isSaving) return;
    setIsSaving(true);
    try {
      const { recipeId } = await recordCooking({
        title: dishName.trim(),
        memo: memo.trim() || undefined,
        photoUri,
      });
      navigation.replace('RecordCelebration', {
        recipeTitle: dishName.trim(),
        recipeId,
        menuId: selectedMenuId || null,
      });
    } catch (error) {
      console.error('[record] save failed', error);
      const { title, message } = getErrorMessage('save');
      Alert.alert(title, message);
    } finally {
      setIsSaving(false);
    }
  }, [dishName, isDishNameValid, isSaving, memo, navigation, photoUri, selectedMenuId]);

  const suggestionVisible = showSuggestions && filteredMenuItems.length > 0;
  const memoButtonLabel = memo.trim().length > 0 ? 'メモ ✓' : 'メモを追加';
  const photoHint = photoUri ? 'タップで撮り直し' : '写真なしでも追加できます';
  const resolvedPhotoSize = photoSize || 120;

  return (
    <FlowShell
      header={{
        title: '今日の料理',
        rightIcon: 'X',
        onRightPress: navigateToHome,
        rightAccessibilityLabel: 'やめる',
      }}
      showWorldBackground={false}
      backgroundColor="#E5D4C8"
      avoidKeyboard
    >
      <ScrollView
        ref={(ref) => {
          scrollRef.current = ref;
        }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <Surface rounded="lg" elevation="sm" padding="lg" style={styles.card}>
          <View
            style={styles.photoRow}
            onLayout={(event) => {
              const width = event.nativeEvent.layout.width;
              const gap = theme.spacing.md;
              const nextSize = Math.floor((width - gap) / 2);
              if (nextSize > 0 && nextSize !== photoSize) {
                setPhotoSize(nextSize);
              }
            }}
          >
            <PressableBase
              style={[styles.photoCell, { minHeight: resolvedPhotoSize }]}
              onPress={handleOpenCamera}
              accessibilityLabel="写真を撮る"
            >
              <View style={[styles.photoArea, { width: resolvedPhotoSize, height: resolvedPhotoSize }]}>
                {photoUri ? (
                  <AppImage
                    source={{ uri: photoUri }}
                    rounded="lg"
                    accessibilityLabel="選択した写真"
                    style={styles.photoPreview}
                  />
                ) : (
                  <View style={styles.photoPlaceholder} accessibilityLabel="写真なし">
                    <Icon name="Camera" size={28} color={theme.colors.text.tertiary} />
                  </View>
                )}
              </View>
            </PressableBase>

            <View style={[styles.libraryCell, { minHeight: resolvedPhotoSize }]}>
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
                  style={styles.deleteButton}
                />
              )}
            </View>
          </View>
          <View style={styles.photoHintRow}>
            <Text variant="caption" style={styles.photoHint}>
              {photoHint}
            </Text>
          </View>

          <View style={styles.formSection}>
            <Text variant="caption" style={styles.sectionLabel}>
              料理名 *
            </Text>
            <Surface rounded="md" padding="sm" style={styles.inputSurface}>
              {selectedMenu?.icon && (
                <AppImage
                  source={selectedMenu.icon}
                  width={28}
                  height={28}
                  rounded="md"
                  accessibilityLabel={selectedMenu.label}
                />
              )}
              <TextInput
                value={dishName}
                onChangeText={handleDishNameChange}
                placeholder="例：カレーライス"
                placeholderTextColor={theme.colors.text.tertiary}
                style={styles.textInput}
                accessibilityLabel="料理名"
                accessibilityHint="必須項目です"
                accessibilityRequired
                onFocus={() => {
                  setShowSuggestions(true);
                  scrollToInput();
                }}
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
                      width={28}
                      height={28}
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
                onPress={() => setShowMenuModal(true)}
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
              iconLeft="Books"
              variant="primary"
              fullWidth
              onPress={handleSave}
              disabled={!isDishNameValid || isSaving}
              accessibilityLabel="図鑑に加える"
            />
          </View>
        </Surface>
      </ScrollView>

      <Modal
        visible={showMemoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMemoModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <Surface rounded="lg" elevation="lg" padding="lg" style={styles.memoModalCard}>
            <View style={styles.modalHeader}>
              <Text variant="subheading">メモ</Text>
              <PressableBase
                style={styles.modalAction}
                onPress={() => setShowMemoModal(false)}
                accessibilityLabel="保存"
              >
                <Text variant="caption" style={styles.modalActionLabel}>
                  保存
                </Text>
              </PressableBase>
            </View>
            <TextInput
              value={memo}
              onChangeText={setMemo}
              placeholder="メモを書く"
              placeholderTextColor={theme.colors.text.tertiary}
              multiline
              style={styles.memoInput}
            />
          </Surface>
        </View>
      </Modal>

      <Modal
        visible={showMenuModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenuModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <Surface rounded="lg" elevation="lg" padding="lg" style={styles.menuModalCard}>
            <View style={styles.menuModalHeader}>
              <Text variant="subheading">候補から選ぶ</Text>
              <PressableBase
                style={styles.modalAction}
                onPress={() => setShowMenuModal(false)}
                accessibilityLabel="閉じる"
              >
                <Text variant="caption" style={styles.modalActionLabel}>
                  閉じる
                </Text>
              </PressableBase>
            </View>
            <ScrollView contentContainerStyle={styles.menuModalContent}>
              {MENU_GROUPS.map((group) => {
                const items = MENU_CATALOG.filter((item) => group.ids.includes(item.id));
                if (items.length === 0) return null;
                return (
                  <View key={group.label} style={styles.menuGroup}>
                    <Text variant="caption" style={styles.menuGroupLabel}>
                      {group.label}
                    </Text>
                    <View style={styles.menuGrid}>
                      {items.map((item) => (
                        <PressableBase
                          key={item.id}
                          style={styles.menuGridItem}
                          onPress={() => handleSelectMenuFromModal(item.label, item.id)}
                          accessibilityLabel={item.label}
                        >
                          <AppImage
                            source={item.icon}
                            width={40}
                            height={40}
                            rounded="md"
                            accessibilityLabel={item.label}
                          />
                          <Text variant="caption" style={styles.menuGridLabel}>
                            {item.label}
                          </Text>
                        </PressableBase>
                      ))}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </Surface>
        </View>
      </Modal>
    </FlowShell>
  );
};

RecordScreen.displayName = 'RecordScreen';

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingBottom: theme.spacing.xl,
  },
  card: {
    gap: theme.spacing.md,
  },
  photoRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'flex-start',
  },
  photoCell: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  libraryCell: {
    flex: 1,
    gap: 0,
    justifyContent: 'space-between',
  },
  deleteButton: {
    marginTop: -theme.spacing.xs,
  },
  photoArea: {
    alignItems: 'center',
    justifyContent: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoHint: {
    textAlign: 'left',
    color: theme.colors.text.tertiary,
  },
  photoHintRow: {
    marginTop: 0,
  },
  formSection: {
    gap: theme.spacing.md,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  memoModalCard: {
    width: '100%',
    maxWidth: 420,
    gap: theme.spacing.md,
  },
  menuModalCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '80%',
    gap: theme.spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalAction: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  modalActionLabel: {
    color: theme.colors.text.secondary,
  },
  memoInput: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    color: theme.colors.text.primary,
    textAlignVertical: 'top',
  },
  menuModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuModalContent: {
    gap: theme.spacing.lg,
  },
  menuGroup: {
    gap: theme.spacing.sm,
  },
  menuGroupLabel: {
    color: theme.colors.text.secondary,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  menuGridItem: {
    width: '30%',
    minWidth: 90,
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.surface.elevated,
  },
  menuGridLabel: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
});
