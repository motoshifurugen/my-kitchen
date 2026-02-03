/**
 * Record Camera Screen (S-04a: 写真撮影)
 *
 * Fullscreen camera view for capturing a photo.
 */

import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, IconButton } from '../components/molecules';
import { PressableBase, Text } from '../components/atoms';
import { theme } from '../tokens';
import type { RecordStackParamList } from '../navigation/RecordNavigator';

export const RecordCameraScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RecordStackParamList>>();
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleRequestPermission = useCallback(async () => {
    await requestPermission();
  }, [requestPermission]);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current) {
      return;
    }

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
      if (!photo?.uri) {
        throw new Error('Camera did not return a photo URI.');
      }
      navigation.navigate('RecordSelect', { photoUri: photo.uri });
    } finally {
      setIsCapturing(false);
    }
  }, [navigation]);

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer} edges={['top', 'bottom']}>
        <Text variant="body" style={styles.permissionText}>
          カメラへのアクセスが必要です
        </Text>
        <Button
          label="カメラを許可する"
          onPress={handleRequestPermission}
        />
      </SafeAreaView>
    );
  }

  const captureDisabled = !isCameraReady || isCapturing;

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onCameraReady={() => setIsCameraReady(true)}
      />

      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <IconButton
            icon="X"
            onPress={handleClose}
            accessibilityLabel="やめる"
            iconColor={theme.colors.text.inverse}
          />
        </View>

        <View style={styles.bottomBar}>
          <PressableBase
            style={styles.captureButton}
            onPress={handleCapture}
            accessibilityLabel="写真を撮る"
            disabled={captureDisabled}
          >
            <View style={styles.captureInner} />
          </PressableBase>
        </View>
      </SafeAreaView>
    </View>
  );
};

RecordCameraScreen.displayName = 'RecordCameraScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingTop: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  bottomBar: {
    alignItems: 'center',
    paddingBottom: theme.spacing.xl,
  },
  captureButton: {
    width: theme.size.tap.recommended * 1.4,
    height: theme.size.tap.recommended * 1.4,
    borderRadius: theme.size.tap.recommended,
    borderWidth: 3,
    borderColor: theme.colors.text.inverse,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: theme.size.tap.recommended,
    height: theme.size.tap.recommended,
    borderRadius: theme.size.tap.recommended / 2,
    backgroundColor: theme.colors.text.inverse,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
});
