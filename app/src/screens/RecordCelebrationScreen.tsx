/**
 * Record Celebration Screen (S-08: セレブレーション)
 *
 * Shows a gentle completion message and returns to S-01.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';
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

const CONFETTI_COLORS = [
  '#C17A50',
  '#7B9E87',
  '#D4A85A',
  '#C67B6B',
  '#E8DFD5',
];

// Number of confetti particles
const CONFETTI_COUNT = 24;

// Bookshelf position (centered)
const BOOKSHELF_X_RATIO = 0.5;
const LIGHT_SIZE = 280;
const LIGHT_RADIUS = LIGHT_SIZE / 2;

/**
 * Confetti seed for stable random values.
 * Generated once per component mount, not during render.
 */
interface ConfettiSeed {
  startXRatio: number;
  startYRatio: number;
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
    startXRatio: Math.random(),
    startYRatio: Math.random() * 0.15,
    endXOffset: (Math.random() - 0.5) * 0.2,
    endYOffset: 0.8 + Math.random() * 0.4,
    rotation: Math.random() * 360,
    durationOffset: Math.random() * 1000,
  }));
}

export const RecordCelebrationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RecordStackParamList>>();
  const route = useRoute<RouteProp<RecordStackParamList, 'RecordCelebration'>>();
  const { celebrationMode } = useReducedMotion();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [topAreaHeight, setTopAreaHeight] = useState(0);
  const [sceneFrame, setSceneFrame] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [backgroundFrame, setBackgroundFrame] = useState({ x: 0, y: 0, width: 0, height: 0 });
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
  const characterScale = 0.7;
  const characterYOffset = 40;

  // Get current age group for character asset
  const currentAgeGroup = useWorldSignals((state) => state.ageGroup);

  // Pre-compute confetti seeds once to avoid random values changing on re-render
  const confettiSeeds = useMemo(() => generateConfettiSeeds(CONFETTI_COUNT), []);

  // Bookshelf position (center of light animation)
  const bookshelfX =
    backgroundFrame.width > 0 && sceneFrame.width > 0
      ? sceneFrame.x + backgroundFrame.x + backgroundFrame.width * 0.5
      : sceneFrame.width > 0
        ? sceneFrame.x + sceneFrame.width * 0.5
        : screenWidth * BOOKSHELF_X_RATIO;
  const bookshelfY =
    backgroundFrame.height > 0 && sceneFrame.height > 0
      ? sceneFrame.y + backgroundFrame.y + backgroundFrame.height * 0.5
      : sceneFrame.height > 0
        ? sceneFrame.y + sceneFrame.height * 0.5
        : topAreaHeight > 0
          ? topAreaHeight * 0.5
          : screenHeight * 0.35;

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
        const startX = screenWidth * seed.startXRatio;
        const startY = screenHeight * seed.startYRatio;
        const endX = startX + seed.endXOffset * screenWidth;
        const endY = startY + screenHeight * seed.endYOffset;
        const rotation = seed.rotation;
        const travelDuration = 2600 + seed.durationOffset;
        const fadeOutDelay = Math.round(travelDuration * 0.45);
        const fadeOutDuration = Math.round(travelDuration * 0.35);

        return Animated.parallel([
          Animated.timing(anim.translateY, {
            toValue: endY - startY,
            duration: travelDuration,
            delay: index * 50,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateX, {
            toValue: endX - startX,
            duration: travelDuration,
            delay: index * 50,
            easing: easing.easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(anim.rotate, {
            toValue: rotation,
            duration: travelDuration,
            delay: index * 50,
            easing: easing.easeOut,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(anim.opacity, {
              toValue: 1,
              duration: 180,
              delay: index * 50,
              useNativeDriver: true,
            }),
            Animated.delay(fadeOutDelay),
            Animated.timing(anim.opacity, {
              toValue: 0,
              duration: fadeOutDuration,
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
      if (parentNavigation.canGoBack()) {
        parentNavigation.goBack();
      }
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const parentNavigation = navigation.getParent<NavigationProp<RootStackParamList>>('RootStack');
      navigation.popToTop();
      if (parentNavigation) {
        parentNavigation.navigate('MainTabs', { screen: 'Home' });
        if (parentNavigation.canGoBack()) {
          parentNavigation.goBack();
        }
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
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View
          style={styles.topArea}
          onLayout={(event) => {
            const height = event.nativeEvent.layout.height;
            if (height > 0 && height !== topAreaHeight) {
              setTopAreaHeight(height);
            }
          }}
        >
          <View
            style={styles.sceneFrame}
            onLayout={(event) => {
              const { x, y, width, height } = event.nativeEvent.layout;
              if (width > 0 && height > 0) {
                setSceneFrame({ x, y, width, height });
              }
            }}
          >
            {/* Bookshelf background (standalone, not using WorldScene) */}
          <Image
            source={BACKGROUND_ASSETS.tools_shell}
            style={styles.backgroundImage}
            contentFit="contain"
            accessibilityLabel="本棚の背景"
            onLayout={(event) => {
              const { x, y, width, height } = event.nativeEvent.layout;
              if (width > 0 && height > 0) {
                setBackgroundFrame({ x, y, width, height });
              }
            }}
          />

            {/* Character overlay (stacked on bookshelf) */}
            <Image
              source={getCharacterAsset(currentAgeGroup)}
              style={[
                styles.character,
                {
                  transform: [{ scale: characterScale }, { translateY: characterYOffset }],
                },
              ]}
              contentFit="contain"
              accessibilityLabel="キャラクター"
            />
          </View>

          {/* Confetti particles */}
          {celebrationMode === 'full' &&
            confettiAnims.map((anim, index) => {
              const seed = confettiSeeds[index];
              const startX = screenWidth * seed.startXRatio;
              const startY = screenHeight * seed.startYRatio;
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
                    backgroundColor: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
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
                  left: bookshelfX - LIGHT_RADIUS,
                  top: bookshelfY - LIGHT_RADIUS,
                  opacity: lightOpacity,
                  transform: [{ scale: lightScale }],
                },
              ]}
            />
          )}
        </View>

        <View style={styles.bottomArea}>
          <Animated.View style={[styles.messageContainer, { opacity: messageOpacity }]}>
            {/* Menu icon */}
          {menuItem && (
            <View style={styles.iconContainer}>
              <View style={styles.menuCard}>
                <AppImage
                  source={menuItem.icon}
                  width={64}
                  height={64}
                  rounded="lg"
                  accessibilityLabel={menuItem.label}
                />
              </View>
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
        </View>
      </SafeAreaView>
    </View>
  );
};

RecordCelebrationScreen.displayName = 'RecordCelebrationScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5D4C8',
  },
  safeArea: {
    flex: 1,
  },
  topArea: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sceneFrame: {
    width: '86%',
    height: '86%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  bottomArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  character: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.accent.primary,
    zIndex: 10,
  },
  lightSpread: {
    position: 'absolute',
    width: LIGHT_SIZE,
    height: LIGHT_SIZE,
    borderRadius: LIGHT_RADIUS,
    backgroundColor: '#FFFFFF',
    zIndex: 2,
  },
  messageContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconContainer: {
    marginBottom: theme.spacing.sm,
  },
  menuCard: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface.elevated,
    ...theme.shadow.sm,
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
