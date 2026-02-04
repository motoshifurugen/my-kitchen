/**
 * Onboarding Signals Screen (S-07b)
 *
 * Kitchen Signals selection screen.
 *
 * Per UX spec (06-microcopy.md §S-07b):
 * - タイトル: キッチンの空気感を設定しましょう
 * - 補足: いつでも変更できます
 * - 年代選択（3択: 10代, 20~30代, 40代~）
 * - 好みのジャンル選択（3択: 和食, 中華, イタリアン）
 * - 次へボタン / スキップ
 *
 * Note: No WorldScene, No Footer during onboarding.
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Spacer, AppImage, Text } from '../../components/atoms';
import { Button, LinkButton } from '../../components/ui';
import { Chip } from '../../components/molecules';
import { theme } from '../../tokens';
import { useWorldSignals, AgeGroup } from '../../state/worldSignals';
import { getCharacterAsset } from '../../assets/manifest';
import type { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';

type NavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Signals'>;

// Age group options
type AgeOption = '10代' | '20~30代' | '40代~';

// Genre options
type GenreOption = '和食' | '中華' | 'イタリアン';

// Age group to AgeGroup mapping
const AGE_TO_AGEGROUP: Record<AgeOption, AgeGroup> = {
  '10代': 'young',
  '20~30代': 'adult',
  '40代~': 'mature',
};

export const OnboardingSignalsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { setAgeGroup } = useWorldSignals();

  // Local state for age selection (default: 10代)
  const [selectedAge, setSelectedAge] = useState<AgeOption>('10代');
  const [selectedGenre, setSelectedGenre] = useState<GenreOption | null>(null);

  // Get current age group for character display
  const currentAgeGroup = AGE_TO_AGEGROUP[selectedAge];

  const handleAgeSelect = (age: AgeOption) => {
    setSelectedAge(age);
    // Update world signals
    setAgeGroup(AGE_TO_AGEGROUP[age]);
  };

  const handleNext = () => {
    navigation.navigate('Complete');
  };

  const handleSkip = () => {
    // Skip without changing defaults
    navigation.navigate('Complete');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Character Image */}
        <View style={styles.characterContainer}>
          <AppImage
            source={getCharacterAsset(currentAgeGroup)}
            width={120}
            height={120}
            contentFit="contain"
            accessibilityLabel={`${selectedAge}のキャラクター`}
          />
        </View>

        <Spacer size="lg" />

        {/* Header */}
        <View style={styles.header}>
          <Text variant="heading" style={styles.title}>
            あなたにあった{'\n'}キッチンを準備します
          </Text>
          <Spacer size="xs" />
          <Text variant="body" color={theme.colors.text.secondary}>
            いつでも変更できます
          </Text>
        </View>

        <Spacer size="xl" />

        {/* Age Group Selection */}
        <View style={styles.selectionGroup}>
          <Text variant="caption" color={theme.colors.text.secondary} style={styles.label}>
            あなたの年代
          </Text>
          <Spacer size="sm" />
          <View style={styles.chipGroup}>
            {(['10代', '20~30代', '40代~'] as AgeOption[]).map((age) => (
              <Chip
                key={age}
                label={age}
                selected={selectedAge === age}
                onPress={() => handleAgeSelect(age)}
              />
            ))}
          </View>
        </View>

        <Spacer size="lg" />

        {/* Genre Selection */}
        <View style={styles.selectionGroup}>
          <Text variant="caption" color={theme.colors.text.secondary} style={styles.label}>
            好みのジャンル
          </Text>
          <Spacer size="sm" />
          <View style={styles.chipGroup}>
            {(['和食', '中華', 'イタリアン'] as GenreOption[]).map((genre) => (
              <Chip
                key={genre}
                label={genre}
                selected={selectedGenre === genre}
                onPress={() => setSelectedGenre(genre)}
              />
            ))}
          </View>
        </View>

        <Spacer size="xl" />

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            label="次へ"
            variant="primary"
            size="lg"
            onPress={handleNext}
          />

          <Spacer size="md" />

          <LinkButton
            label="スキップ"
            onPress={handleSkip}
            accessibilityLabel="スキップ"
            accessibilityHint="設定をスキップします"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

OnboardingSignalsScreen.displayName = 'OnboardingSignalsScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D5BC9D',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.screen.horizontal,
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  selectionGroup: {
    width: '100%',
    alignItems: 'center',
  },
  label: {
    textAlign: 'center',
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    justifyContent: 'center',
  },
  actions: {
    alignItems: 'center',
    width: '100%',
  },
});
