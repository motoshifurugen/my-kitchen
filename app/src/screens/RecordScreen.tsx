/**
 * Record Screen (S-04a: 写真撮影/選択)
 *
 * Entry step for record flow. Photo is optional.
 */

import React, { useCallback } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { FlowShell } from '../components/templates';
import { Button } from '../components/molecules';
import { Divider, Text } from '../components/atoms';
import { theme } from '../tokens';
import type { RecordStackParamList } from '../navigation/RecordNavigator';
import type { RootTabParamList } from '../navigation/TabNavigator';
import type { NavigationProp } from '@react-navigation/native';

export const RecordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RecordStackParamList>>();

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
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('写真へのアクセスが必要です');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];
    if (!asset?.uri) {
      throw new Error('Image picker returned no asset URI.');
    }

    navigation.navigate('RecordForm', { photoUri: asset.uri });
  }, [navigation]);

  const handleSkip = useCallback(() => {
    navigation.navigate('RecordForm', { photoUri: null });
  }, [navigation]);

  return (
    <FlowShell
      header={{
        title: '記録する',
        rightIcon: 'X',
        onRightPress: navigateToHome,
        rightAccessibilityLabel: 'やめる',
      }}
      showWorldBackground={false}
    >
      <View style={styles.content}>
        <Button
          label="写真を撮る"
          iconLeft="Camera"
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleOpenCamera}
        />

        <Button
          label="ライブラリから選ぶ"
          iconLeft="Image"
          variant="secondary"
          size="lg"
          fullWidth
          onPress={handlePickFromLibrary}
        />

        <Divider margin="lg" />

        <Button
          label="写真なしで続ける"
          variant="ghost"
          size="md"
          fullWidth
          onPress={handleSkip}
        />

        <Text variant="caption" style={styles.hint}>
          写真はあとからでも追加できます
        </Text>
      </View>
    </FlowShell>
  );
};

RecordScreen.displayName = 'RecordScreen';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.screen.horizontal,
    gap: theme.spacing.md,
  },
  hint: {
    textAlign: 'center',
    color: theme.colors.text.tertiary,
  },
});
