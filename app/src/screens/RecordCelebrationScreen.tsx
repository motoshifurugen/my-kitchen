/**
 * Record Celebration Screen (S-08: セレブレーション)
 *
 * Shows a gentle completion message and returns to S-01.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { AppImage, Text } from '../components/atoms';
import { Button } from '../components/molecules';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { duration, easing, theme } from '../tokens';
import { MENU_CATALOG } from '../data/menuCatalog';
import { BACKGROUND_ASSETS, getCharacterAsset } from '../assets/manifest';
import { getCelebrationCharacterLayout } from '../constants/celebrationLayout';
import { useWorldSignals } from '../state/worldSignals';
import type { RecordStackParamList } from '../navigation/RecordNavigator';
import type { RootStackParamList } from '../navigation/MainNavigator';
import type { ShelfStackParamList } from '../navigation/ShelfNavigator';

const CELEBRATION_MESSAGES = [
  '記録しました。',
  '棚に1枚、追加されました。',
  '今日の分、残しておきます。',
  'また作った日が増えました。',
  '静かに、積み重なりました。',
  '今日のひと皿、残しました。',
  '棚に、ひとつ増えました。',
];

// Number of confetti particles
const CONFETTI_COUNT = 20;

// Bookshelf position (left side, ~20% from left edge)
const BOOKSHELF_X_RATIO = 0.2;

/**
 * Confetti seed for stable random values.
 * Generated once per component mount, not during render.
 */
interface ConfettiSeed {
  startXOffset: number;
  startYOffset: number;
  endXOffset: number;
  endYOffset: number;
  rotation: number;
  durationOffset: number;
}

/**
 * Generate stable confetti seeds.
 * Called once in useMemo to avoid random values changing on re-render.
 */
function generateConfettiSeeds(count: number): ConfettiSeed[] {
  return Array.from({ length: count }, () => ({
    startXOffset: (Math.random() - 0.5) * 100,
    startYOffset: (Math.random() - 0.5) * 100,
    endXOffset: (Math.random() - 0.5) * 0.6,
    endYOffset: 0.3 + Math.random() * 0.4,
    rotation: Math.random() * 360,
    durationOffset: Math.random() * 1000,
  }));
}

export const RecordCelebrationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RecordStackParamList>>();
  const route = useRoute<RouteProp<RecordStackParamList, 'RecordCelebration'>>();
  const { celebrationMode } = useReducedMotion();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const lightAnim = useRef(new Animated.Value(0)).current;
  const messageOpacity = useRef(new Animated.Value(0)).current;
  const confettiAnims = useRef(
    Array.from({ length: CONFETTI_COUNT }, () => ({
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  const { recipeTitle, recipeId, menuId } = route.params;
  const menuItem = useMemo(() => {
    if (!menuId) return null;
    return MENU_CATALOG.find((item) => item.id === menuId);
  }, [menuId]);

  const message = useMemo(() => {
    const index = Math.floor(Math.random() * CELEBRATION_MESSAGES.length);
    return CELEBRATION_MESSAGES[index];
  }, []);

  // Character layout computed from screen dimensions
  const characterLayout = useMemo(
    () => getCelebrationCharacterLayout(screenWidth, screenHeight),
    [screenWidth, screenHeight]
  );

  // Get current age group for character asset
  const currentAgeGroup = useWorldSignals((state) => state.ageGroup);

  // Pre-compute confetti seeds once to avoid random values changing on re-render
  const confettiSeeds = useMemo(() => generateConfettiSeeds(CONFETTI_COUNT), []);

  // Bookshelf position (center of light animation)
  const bookshelfX = screenWidth * BOOKSHELF_X_RATIO;
  const bookshelfY = screenHeight * 0.5;

  useEffect(() => {
    const lightSequence =
      celebrationMode === 'full'
        ? Animated.timing(lightAnim, {
            toValue: 1,
            duration: duration.celebration,
            easing: easing.celebration,
            useNativeDriver: true,
          })
        : Animated.timing(lightAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          });

    const messageSequence = Animated.timing(messageOpacity, {
      toValue: 1,
      duration: duration.normal,
      easing: easing.easeOut,
      useNativeDriver: true,
    });

    // Confetti animation (only in full celebration mode)
    if (celebrationMode === 'full') {
      const confettiAnimations = confettiAnims.map((anim, index) => {
        const seed = confettiSeeds[index];
        const startX = bookshelfX + seed.startXOffset;
        const startY = bookshelfY + seed.startYOffset;
        const endX = startX + seed.endXOffset * screenWidth;
        const endY = startY - screenHeight * seed.endYOffset;
        const rotation = seed.rotation;

        return Animated.parallel([
          Animated.timing(anim.translateY, {
            toValue: endY - startY,
            duration: 2000 + seed.durationOffset,
            delay: index * 50,
            easing: easing.easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateX, {
            toValue: endX - startX,
            duration: 2000 + seed.durationOffset,
            delay: index * 50,
            easing: easing.easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(anim.rotate, {
            toValue: rotation,
            duration: 2000 + seed.durationOffset,
            delay: index * 50,
            easing: easing.easeOut,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(anim.opacity, {
              toValue: 1,
              duration: 200,
              delay: index * 50,
              useNativeDriver: true,
            }),
            Animated.timing(anim.opacity, {
              toValue: 0,
              duration: 500,
              delay: 1500,
              useNativeDriver: true,
            }),
          ]),
        ]);
      });

      Animated.parallel([
        lightSequence,
        Animated.delay(100),
        messageSequence,
        ...confettiAnimations,
      ]).start();
    } else {
      Animated.sequence([
        lightSequence,
        Animated.delay(100),
        messageSequence,
      ]).start();
    }
  }, [celebrationMode, lightAnim, messageOpacity, confettiAnims, confettiSeeds, bookshelfX, bookshelfY, screenWidth, screenHeight]);

  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(message);
  }, [message]);

  const handleViewEncyclopedia = () => {
    const parentNavigation = navigation.getParent<NavigationProp<RootStackParamList>>('RootStack');
    navigation.popToTop();
    if (parentNavigation) {
      parentNavigation.navigate('MainTabs', {
        screen: 'Shelf',
        params: {
          screen: 'EncyclopediaGrid',
          params: {
            title: 'マイ図鑑',
            mode: 'all' as const,
            openCardId: recipeId,
          },
        },
      });
      parentNavigation.goBack();
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const parentNavigation = navigation.getParent<NavigationProp<RootStackParamList>>('RootStack');
      navigation.popToTop();
      if (parentNavigation) {
        parentNavigation.navigate('MainTabs', { screen: 'Home' });
        parentNavigation.goBack();
      }
    }, 5000); // Extended timeout to allow user to see the button

    return () => clearTimeout(timeout);
  }, [navigation]);

  const lightScale = lightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1.3],
  });

  const lightOpacity = lightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.45],
  });

  return (
    <View style={styles.container}>
      {/* Bookshelf background (standalone, not using WorldScene) */}
      <Image
        source={BACKGROUND_ASSETS.tools_shell}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        accessibilityLabel="本棚の背景"
      />

      {/* Character overlay with responsive positioning */}
      <Image
        source={getCharacterAsset(currentAgeGroup)}
        style={[
          styles.character,
          {
            top: characterLayout.top,
            left: characterLayout.left,
            width: characterLayout.width,
            height: characterLayout.height,
          },
        ]}
        contentFit="contain"
        accessibilityLabel="キャラクター"
      />

      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        {/* Confetti particles */}
        {celebrationMode === 'full' &&
          confettiAnims.map((anim, index) => {
            const seed = confettiSeeds[index];
            const startX = bookshelfX + seed.startXOffset;
            const startY = bookshelfY + seed.startYOffset;
            const rotate = anim.rotate.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg'],
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.confetti,
                  {
                    left: startX,
                    top: startY,
                    opacity: anim.opacity,
                    transform: [
                      { translateX: anim.translateX },
                      { translateY: anim.translateY },
                      { rotate },
                    ],
                  },
                ]}
              />
            );
          })}

        {/* Light spread animation (centered on bookshelf) */}
        {celebrationMode === 'full' && (
          <Animated.View
            style={[
              styles.lightSpread,
              {
                left: bookshelfX - 210, // Half of width (420 / 2)
                top: bookshelfY - 210, // Half of height (420 / 2)
                opacity: lightOpacity,
                transform: [{ scale: lightScale }],
              },
            ]}
          />
        )}

        <Animated.View style={[styles.messageContainer, { opacity: messageOpacity }]}>
          {/* Menu icon */}
          {menuItem && (
            <View style={styles.iconContainer}>
              <AppImage
                source={menuItem.icon}
                width={64}
                height={64}
                rounded="lg"
                accessibilityLabel={menuItem.label}
              />
            </View>
          )}

          {/* Message */}
          <Text
            variant="subheading"
            style={styles.message}
            accessibilityRole="text"
            accessibilityLabel={message}
          >
            {message}
          </Text>

          {/* View Encyclopedia button */}
          <View style={styles.buttonContainer}>
            <Button
              label="図鑑を見る"
              variant="secondary"
              size="md"
              iconLeft="Books"
              onPress={handleViewEncyclopedia}
              accessibilityLabel="図鑑を見る"
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

RecordCelebrationScreen.displayName = 'RecordCelebrationScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  character: {
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.accent.primary,
  },
  lightSpread: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: theme.colors.accent.subtle,
  },
  messageContainer: {
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconContainer: {
    marginBottom: theme.spacing.sm,
  },
  message: {
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  buttonContainer: {
    marginTop: theme.spacing.md,
    width: '100%',
    maxWidth: 200,
  },
});
