/**
 * Record Screen (S-04a, S-04b, S-04c)
 *
 * Multi-step recording flow:
 * - S-04a: 写真撮影/選択
 * - S-04b: 料理名・メモ・タグ入力
 * - S-04c: 確認画面 (未実装)
 */

import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FlowShell } from '../components/templates';
import { Button, IconButton, TextField, TextArea, Chip } from '../components/molecules';
import { Divider, PressableBase, Text } from '../components/atoms';
import { theme } from '../tokens';

// ---------------------------------------------------------------------------
// Types & Constants
// ---------------------------------------------------------------------------

type RecordStep = 'photo' | 'input' | 'confirm';

interface RecordData {
  photoUri?: string;
  dishName: string;
  memo: string;
  tags: string[];
}

const INITIAL_RECORD_DATA: RecordData = {
  dishName: '',
  memo: '',
  tags: [],
};

const DEFAULT_TAGS = [
  '朝ごはん',
  '昼ごはん',
  '夜ごはん',
  'おやつ',
  '作り置き',
] as const;

export const RecordScreen: React.FC = () => {
  const navigation = useNavigation();
  const cameraRef = useRef<CameraView>(null);

  // Step management
  const [step, setStep] = useState<RecordStep>('photo');
  const [recordData, setRecordData] = useState<RecordData>(INITIAL_RECORD_DATA);
  const [errors, setErrors] = useState<{ dishName?: string }>({});

  // Camera state
  const [cameraVisible, setCameraVisible] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [libraryPermission, requestLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const handleCancel = useCallback(() => {
    // @ts-ignore - tab navigation typing will be introduced later
    navigation.navigate('Home');
  }, [navigation]);

  const ensureCameraPermission = useCallback(async () => {
    if (cameraPermission?.granted) {
      return true;
    }
    const response = await requestCameraPermission();
    return response.granted;
  }, [cameraPermission, requestCameraPermission]);

  const ensureLibraryPermission = useCallback(async () => {
    if (libraryPermission?.granted) {
      return true;
    }
    const response = await requestLibraryPermission();
    return response.granted;
  }, [libraryPermission, requestLibraryPermission]);

  // ---------------------------------------------------------------------------
  // S-04a → S-04b transition
  // ---------------------------------------------------------------------------

  const handleAdvance = useCallback((uri?: string) => {
    setRecordData((prev) => ({ ...prev, photoUri: uri }));
    setStep('input');
  }, []);

  const handleOpenCamera = useCallback(async () => {
    const granted = await ensureCameraPermission();
    if (!granted) {
      Alert.alert('カメラへのアクセスが必要です', '設定から許可してください。');
      return;
    }
    setCameraVisible(true);
  }, [ensureCameraPermission]);

  const handlePickFromLibrary = useCallback(async () => {
    const granted = await ensureLibraryPermission();
    if (!granted) {
      Alert.alert('写真へのアクセスが必要です', '設定から許可してください。');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      handleAdvance(result.assets[0].uri);
    }
  }, [ensureLibraryPermission, handleAdvance]);

  const handleSkip = useCallback(() => {
    handleAdvance();
  }, [handleAdvance]);

  // ---------------------------------------------------------------------------
  // S-04b handlers
  // ---------------------------------------------------------------------------

  const handleBackToPhoto = useCallback(() => {
    setStep('photo');
    setErrors({});
  }, []);

  const handleTagToggle = useCallback((tag: string) => {
    setRecordData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  }, []);

  const handleSubmitInput = useCallback(() => {
    if (!recordData.dishName.trim()) {
      setErrors({ dishName: '料理名だけ、ひとつ入れると進めます' });
      return;
    }
    setErrors({});
    setStep('confirm');
  }, [recordData.dishName]);

  const handleCapture = useCallback(async () => {
    if (isCapturing || !cameraRef.current) {
      return;
    }

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });
      if (photo?.uri) {
        setCameraVisible(false);
        handleAdvance(photo.uri);
      }
    } catch (error) {
      Alert.alert('撮影に失敗しました', 'もう一度お試しください。');
    } finally {
      setIsCapturing(false);
    }
  }, [handleAdvance, isCapturing]);

  // ---------------------------------------------------------------------------
  // S-04b: Input form step
  // ---------------------------------------------------------------------------

  if (step === 'input') {
    return (
      <FlowShell
        header={{
          title: '記録する',
          showBack: true,
          onBack: handleBackToPhoto,
          rightIcon: 'X',
          onRightPress: handleCancel,
          rightAccessibilityLabel: 'やめる',
        }}
        showWorldBackground
        scrollable
        avoidKeyboard
      >
        <View style={styles.formContent}>
          {/* 料理名（必須） */}
          <TextField
            label="料理名 *"
            value={recordData.dishName}
            onChangeText={(text) => {
              setRecordData((prev) => ({ ...prev, dishName: text }));
              if (errors.dishName) setErrors({});
            }}
            error={errors.dishName}
            placeholder="例: 肉じゃが"
          />

          {/* メモ（任意） */}
          <TextArea
            label="メモ（任意）"
            value={recordData.memo}
            onChangeText={(text) =>
              setRecordData((prev) => ({ ...prev, memo: text }))
            }
            numberOfLines={3}
            placeholder="今日の気分や工夫したこと"
          />

          {/* タグ（任意） */}
          <View>
            <Text variant="caption" color={theme.colors.text.secondary}>
              タグ（任意）
            </Text>
            <View style={styles.tagContainer}>
              {DEFAULT_TAGS.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  selected={recordData.tags.includes(tag)}
                  onPress={() => handleTagToggle(tag)}
                />
              ))}
            </View>
          </View>

          {/* 確認へボタン */}
          <View style={styles.submitContainer}>
            <Button label="確認へ" onPress={handleSubmitInput} fullWidth />
          </View>
        </View>
      </FlowShell>
    );
  }

  // ---------------------------------------------------------------------------
  // S-04c: Confirm step (TODO)
  // ---------------------------------------------------------------------------

  if (step === 'confirm') {
    return (
      <FlowShell
        header={{
          title: '確認',
          showBack: true,
          onBack: () => setStep('input'),
          rightIcon: 'X',
          onRightPress: handleCancel,
          rightAccessibilityLabel: 'やめる',
        }}
        showWorldBackground
      >
        <View style={styles.content}>
          <Text variant="body" color={theme.colors.text.primary}>
            確認画面は次のイテレーションで実装します
          </Text>
        </View>
      </FlowShell>
    );
  }

  // ---------------------------------------------------------------------------
  // S-04a: Photo step (default)
  // ---------------------------------------------------------------------------

  return (
    <>
      <FlowShell
        header={{
          title: '記録する',
          rightIcon: 'X',
          onRightPress: handleCancel,
          rightAccessibilityLabel: 'やめる',
        }}
        showWorldBackground
      >
        <View style={styles.content}>
          <View style={styles.options}>
            <Button
              label="写真を撮る"
              iconLeft="Camera"
              onPress={handleOpenCamera}
              fullWidth
            />
            <Button
              label="ライブラリから選ぶ"
              iconLeft="Image"
              variant="secondary"
              onPress={handlePickFromLibrary}
              fullWidth
            />
          </View>

          <Divider margin="lg" />

          <View style={styles.skip}>
            <Button
              label="写真なしで続ける"
              variant="ghost"
              onPress={handleSkip}
              fullWidth
            />
            <Text
              variant="caption"
              color={theme.colors.text.secondary}
              style={styles.hint}
            >
              写真はあとからでも追加できます
            </Text>
          </View>
        </View>
      </FlowShell>

      <Modal
        visible={cameraVisible}
        animationType="slide"
        onRequestClose={() => setCameraVisible(false)}
      >
        <View style={styles.cameraContainer}>
          <CameraView ref={cameraRef} style={styles.camera} facing="back" />

          <SafeAreaView style={styles.cameraOverlay} edges={['top', 'bottom']}>
            <View style={styles.cameraHeader}>
              <IconButton
                icon="X"
                onPress={() => setCameraVisible(false)}
                accessibilityLabel="やめる"
              />
            </View>
            <View style={styles.cameraFooter}>
              <PressableBase
                style={styles.captureButton}
                onPress={handleCapture}
                accessibilityLabel="撮影する"
                disabled={isCapturing}
              >
                {isCapturing ? (
                  <ActivityIndicator color={theme.colors.text.inverse} />
                ) : (
                  <View style={styles.captureInner} />
                )}
              </PressableBase>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingVertical: theme.spacing.lg,
  },
  options: {
    gap: theme.spacing.md,
  },
  skip: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  hint: {
    textAlign: 'center',
  },
  // S-04b: Input form styles
  formContent: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  submitContainer: {
    marginTop: 'auto',
    paddingTop: theme.spacing.lg,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  cameraHeader: {
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.screen.horizontal,
  },
  cameraFooter: {
    alignItems: 'center',
    paddingBottom: theme.spacing.xl,
  },
  captureButton: {
    width: theme.size.tap.recommended,
    height: theme.size.tap.recommended,
    borderRadius: theme.size.tap.recommended / 2,
    borderWidth: 2,
    borderColor: theme.colors.text.inverse,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: theme.size.tap.recommended - 16,
    height: theme.size.tap.recommended - 16,
    borderRadius: (theme.size.tap.recommended - 16) / 2,
    backgroundColor: theme.colors.text.inverse,
  },
});
