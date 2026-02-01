/**
 * Reduced Motion Hook
 *
 * Detects system preference for reduced motion and provides
 * appropriate fallback behaviors based on motion tokens.
 *
 * When reduced motion is enabled:
 * - Slide transitions become fade transitions
 * - Overlay transitions become fade transitions
 * - World ambient animations are disabled
 * - Celebration effects are simplified to message-only
 * - Tap feedback is preserved (per spec)
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { reducedMotion, transition, duration } from '../tokens';

export interface ReducedMotionConfig {
  isEnabled: boolean;

  // Transition alternatives
  getTransitionDuration: (type: 'slide' | 'overlay' | 'fade') => number;
  getTransitionType: (type: 'slide' | 'overlay' | 'fade') => 'slide' | 'overlay' | 'fade';

  // World behavior
  shouldAnimateWorld: boolean;

  // Celebration behavior
  celebrationMode: 'full' | 'messageOnly';

  // Tap feedback is always enabled
  tapFeedbackEnabled: true;
}

export const useReducedMotion = (): ReducedMotionConfig => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Check initial value
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setIsEnabled(enabled);
    });

    // Subscribe to changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        setIsEnabled(enabled);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    isEnabled,

    getTransitionDuration: (type) => {
      if (!isEnabled) {
        switch (type) {
          case 'slide':
            return transition.slideRight.duration;
          case 'overlay':
            return transition.overlay.duration;
          case 'fade':
          default:
            return transition.fade.duration;
        }
      }
      // Reduced motion: all transitions use fade duration
      return duration.transition.fade;
    },

    getTransitionType: (type) => {
      if (!isEnabled) return type;

      // Convert slide/overlay to fade
      switch (type) {
        case 'slide':
          return reducedMotion.transition.slide as 'fade';
        case 'overlay':
          return reducedMotion.transition.overlay as 'fade';
        default:
          return 'fade';
      }
    },

    shouldAnimateWorld: !isEnabled && reducedMotion.world !== 'static',

    celebrationMode: isEnabled ? 'messageOnly' : 'full',

    // Tap feedback is always preserved per spec
    tapFeedbackEnabled: true,
  };
};

/**
 * Simple boolean hook for quick checks
 */
export const useIsReducedMotion = (): boolean => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setIsEnabled);

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setIsEnabled
    );

    return () => subscription.remove();
  }, []);

  return isEnabled;
};
