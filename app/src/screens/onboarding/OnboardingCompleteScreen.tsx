/**
 * Onboarding Complete Screen (S-07c)
 *
 * Final screen of onboarding flow.
 *
 * Per UX spec (06-microcopy.md §S-07c):
 * - メインメッセージ: 準備ができました
 * - サブメッセージ: さっそく記録をはじめましょう
 * - 開始ボタン: はじめる
 *
 * Note: No WorldScene, No Footer during onboarding.
 */

import React, { useRef, useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacer } from '../../components/atoms';
import { Button, Text } from '../../components/ui';
import { theme } from '../../tokens';
import { duration, easing } from '../../tokens';

export interface OnboardingCompleteScreenProps {
  onComplete: () => void;
}

// Animation durations
const FADE_OUT_DURATION = 600; // 白転の時間（600ms）
const DELAY_BEFORE_COMPLETE = 300; // 白転後の待機時間（300ms）

export const OnboardingCompleteScreen: React.FC<OnboardingCompleteScreenProps> = ({
  onComplete,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStart = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // 白転アニメーション（フェードアウト）
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: FADE_OUT_DURATION,
      easing: easing.easeOut,
      useNativeDriver: true,
    }).start(() => {
      // アニメーション完了後、少し待ってからonCompleteを呼ぶ
      setTimeout(() => {
        onComplete();
      }, DELAY_BEFORE_COMPLETE);
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Main Message */}
        <View style={styles.messageContainer}>
          <Text size="xl" weight="bold" style={styles.title}>
            準備ができました
          </Text>

          <Spacer size="md" />

          <Text
            size="md"
            color={theme.colors.text.secondary}
            style={styles.subtitle}
          >
            さっそく記録をはじめましょう
          </Text>
        </View>

        <Spacer size="xl" />

        {/* Start Button */}
        <View style={styles.actions}>
          <Button
            label="はじめる"
            variant="primary"
            size="lg"
            onPress={handleStart}
            disabled={isAnimating}
          />
        </View>
      </View>

      {/* White overlay for fade out animation */}
      <Animated.View
        style={[
          styles.whiteOverlay,
          {
            opacity: fadeAnim,
          },
        ]}
        pointerEvents={isAnimating ? 'auto' : 'none'}
      />
    </SafeAreaView>
  );
};

OnboardingCompleteScreen.displayName = 'OnboardingCompleteScreen';

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
  messageContainer: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  actions: {
    alignItems: 'center',
  },
  whiteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
  },
});
