/**
 * Onboarding Welcome Screen (S-07a)
 *
 * First screen of onboarding flow.
 *
 * Per UX spec (06-microcopy.md §S-07a):
 * - メインメッセージ: わたしの台所図鑑へようこそ
 * - 開始ボタン: はじめる
 * - スキップ: あとで設定する
 *
 * Note: No WorldScene, No Footer during onboarding.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Spacer, AppImage } from '../../components/atoms';
import { Button, Text } from '../../components/ui';
import { theme } from '../../tokens';
import type { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;

export const OnboardingWelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleStart = () => {
    navigation.navigate('Signals');
  };


  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <AppImage
            source={require('../../../assets/tools/tools_pan.webp')}
            width={120}
            height={120}
            contentFit="contain"
            accessibilityLabel="フライパンのイラスト"
          />
        </View>

        <Spacer size="lg" />

        {/* Main Message */}
        <View style={styles.messageContainer}>
          <Text size="xl" weight="bold" style={styles.title}>
            わたしの台所図鑑{'\n'}へようこそ
          </Text>
        </View>

        <Spacer size="md" />

        {/* Body Text */}
        <View style={styles.bodyContainer}>
          <Text size="md" color={theme.colors.text.secondary} style={styles.bodyText}>
            毎日の料理をそっと追加して{'\n'}あなただけの本棚をつくりましょう
          </Text>
        </View>

        <Spacer size="xl" />

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            label="はじめる"
            variant="primary"
            size="lg"
            onPress={handleStart}
            style={styles.startButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

OnboardingWelcomeScreen.displayName = 'OnboardingWelcomeScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D5BC9D',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.screen.horizontal,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  bodyContainer: {
    alignItems: 'center',
  },
  bodyText: {
    textAlign: 'center',
  },
  actions: {
    alignItems: 'center',
    width: '100%',
  },
  startButton: {
    alignSelf: 'center',
  },
});
