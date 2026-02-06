/**
 * Navigation Transitions
 *
 * Custom transition animations for React Navigation.
 * Implements the transition patterns defined in docs/ux/phase-1/02-design-system.md
 *
 * @see docs/ux/phase-1/02-design-system.md §遷移パターン詳細
 */

import { TransitionSpec, CardStyleInterpolator } from '@react-navigation/stack';
import { duration, easing, distance } from '../tokens/motionTokens';

// ============================================================================
// Transition Specs
// ============================================================================

/**
 * Fade transition spec
 * Used for: Footer navigation (200ms)
 */
export const fadeTransitionSpec: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: duration.transition.fade, // 200ms
    easing: easing.easeOut,
  },
};

/**
 * Soft Slide transition spec
 * Used for: List → Detail, Settings (250ms)
 */
export const softSlideTransitionSpec: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: duration.transition.slide, // 250ms
    easing: easing.easeOut,
  },
};

/**
 * Overlay transition spec
 * Used for: Record flow overlay (300ms)
 */
export const overlayTransitionSpec: TransitionSpec = {
  animation: 'timing',
  config: {
    duration: duration.transition.overlay, // 300ms
    easing: easing.easeOut,
  },
};

// ============================================================================
// Card Style Interpolators
// ============================================================================

/**
 * Fade card style interpolator
 * opacity: 0 → 1
 */
export const fadeCardStyleInterpolator: CardStyleInterpolator = ({ current }) => {
  return {
    cardStyle: {
      opacity: current.progress,
    },
  };
};

/**
 * Soft Slide card style interpolator (right to left)
 * translateX: 30pt → 0
 * opacity: 0 → 1
 */
export const softSlideRightCardStyleInterpolator: CardStyleInterpolator = ({
  current,
  layouts,
}) => {
  return {
    cardStyle: {
      opacity: current.progress,
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [distance.slide.short, 0], // 30pt → 0
          }),
        },
      ],
    },
  };
};

/**
 * Soft Slide card style interpolator (left to right, for back navigation)
 * translateX: -30pt → 0
 * opacity: 0 → 1
 */
export const softSlideLeftCardStyleInterpolator: CardStyleInterpolator = ({
  current,
  layouts,
}) => {
  return {
    cardStyle: {
      opacity: current.progress,
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-distance.slide.short, 0], // -30pt → 0
          }),
        },
      ],
    },
  };
};

/**
 * Overlay card style interpolator (bottom to top)
 * translateY: 20pt → 0 (or from screen bottom)
 * opacity: 0 → 1
 */
export const overlayCardStyleInterpolator: CardStyleInterpolator = ({
  current,
  layouts,
}) => {
  return {
    cardStyle: {
      opacity: current.progress,
      transform: [
        {
          translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [distance.overlay.raise, 0], // 20pt → 0
          }),
        },
      ],
    },
  };
};

/**
 * Slide up from bottom card style interpolator (full screen)
 * translateY: screen.height → 0
 * opacity: 0 → 1
 * Used for: Record flow entry
 */
export const slideUpFromBottomCardStyleInterpolator: CardStyleInterpolator = ({
  current,
  layouts,
}) => {
  const screenHeight = layouts?.screen?.height ?? 0;
  return {
    cardStyle: {
      opacity: current.progress,
      transform: [
        {
          translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [screenHeight, 0], // screen height → 0
          }),
        },
      ],
    },
  };
};

/**
 * Slide down to bottom card style interpolator (full screen)
 * translateY: 0 → screen.height
 * opacity: 1 → 0
 * Used for: Record flow exit
 */
export const slideDownToBottomCardStyleInterpolator: CardStyleInterpolator = ({
  current,
  layouts,
}) => {
  const screenHeight = layouts?.screen?.height ?? 0;
  return {
    cardStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0], // 1 → 0
      }),
      transform: [
        {
          translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, screenHeight], // 0 → screen height
          }),
        },
      ],
    },
  };
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get transition config for Footer navigation (Fade)
 */
export const getFadeTransitionConfig = () => ({
  transitionSpec: fadeTransitionSpec,
  cardStyleInterpolator: fadeCardStyleInterpolator,
});

/**
 * Get transition config for Soft Slide (List → Detail)
 */
export const getSoftSlideTransitionConfig = () => ({
  transitionSpec: softSlideTransitionSpec,
  cardStyleInterpolator: softSlideRightCardStyleInterpolator,
});

/**
 * Get transition config for Overlay (Record flow)
 */
export const getOverlayTransitionConfig = () => ({
  transitionSpec: overlayTransitionSpec,
  cardStyleInterpolator: overlayCardStyleInterpolator,
});

/**
 * Get transition config for Slide Up from Bottom (Record flow entry)
 */
export const getSlideUpFromBottomTransitionConfig = () => ({
  transitionSpec: overlayTransitionSpec,
  cardStyleInterpolator: slideUpFromBottomCardStyleInterpolator,
});

/**
 * Get transition config for Slide Down to Bottom (Record flow exit)
 */
export const getSlideDownToBottomTransitionConfig = () => ({
  transitionSpec: overlayTransitionSpec,
  cardStyleInterpolator: slideDownToBottomCardStyleInterpolator,
});

