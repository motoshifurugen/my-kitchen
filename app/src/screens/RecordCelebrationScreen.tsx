/**
 * Record Celebration Screen (S-08: セレブレーション)
 *
 * Shows a gentle completion message and returns to S-01.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, View } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WorldScene } from '../components/world';
import { Text } from '../components/atoms';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { duration, easing, theme } from '../tokens';
import type { RecordStackParamList } from '../navigation/RecordNavigator';
import type { RootTabParamList } from '../navigation/TabNavigator';

const CELEBRATION_MESSAGES = [
  '記録しました。',
  '棚に1枚、追加されました。',
  '今日の分、残しておきます。',
  'また作った日が増えました。',
  '静かに、積み重なりました。',
  '今日のひと皿、残しました。',
  '棚に、ひとつ増えました。',
];

export const RecordCelebrationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RecordStackParamList>>();
  const { celebrationMode } = useReducedMotion();
  const lightAnim = useRef(new Animated.Value(0)).current;
  const messageOpacity = useRef(new Animated.Value(0)).current;

  const message = useMemo(() => {
    const index = Math.floor(Math.random() * CELEBRATION_MESSAGES.length);
    return CELEBRATION_MESSAGES[index];
  }, []);

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

    Animated.sequence([
      lightSequence,
      Animated.delay(100),
      messageSequence,
    ]).start();
  }, [celebrationMode, lightAnim, messageOpacity]);

  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(message);
  }, [message]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const parentNavigation = navigation.getParent<NavigationProp<RootTabParamList>>();
      navigation.popToTop();
      parentNavigation?.navigate('Home');
    }, 2000);

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
      <WorldScene blurred={false} />

      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        {celebrationMode === 'full' && (
          <Animated.View
            style={[
              styles.lightSpread,
              {
                opacity: lightOpacity,
                transform: [{ scale: lightScale }],
              },
            ]}
          />
        )}

        <Animated.View style={[styles.messageContainer, { opacity: messageOpacity }]}>
          <Text
            variant="subheading"
            style={styles.message}
            accessibilityRole="text"
            accessibilityLabel={message}
          >
            {message}
          </Text>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  message: {
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
});
