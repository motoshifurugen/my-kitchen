/**
 * Tap Bloom Overlay
 *
 * Global tap micro-interaction that shows a soft, quiet bloom at the tap point.
 * Designed to feel like a subtle light stain in the 2.5D kitchen world.
 */

import React, { useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, type NativeSyntheticEvent, type NativeTouchEvent, useWindowDimensions } from 'react-native';
import { theme } from '../../tokens';

interface TapBloomOverlayProps {
  children: React.ReactNode;
}

// DEV toggle for quickly disabling the effect during testing.
const DEV_DISABLE_TAP_BLOOM = false;

const BLOOM_OPACITY_MAX = 0.22;
const BLOOM_SCALE_FROM = 0.85;
const BLOOM_SCALE_TO = 1.15;
const BLOOM_DURATION_MS = 520;
const BLOOM_APPEAR_MS = 120;
const BLOOM_FADE_MS = BLOOM_DURATION_MS - BLOOM_APPEAR_MS;
const COOLDOWN_MS = 600;

const TAP_MAX_DURATION_MS = 250;
const TAP_MOVE_THRESHOLD_PX = 8;

type TouchSnapshot = {
  startX: number;
  startY: number;
  startTime: number;
  moved: boolean;
  multiTouch: boolean;
};

export const TapBloomOverlay: React.FC<TapBloomOverlayProps> = ({ children }) => {
  if (__DEV__ && DEV_DISABLE_TAP_BLOOM) {
    return <>{children}</>;
  }

  const { width: screenWidth } = useWindowDimensions();
  const bloomSize = useMemo(() => {
    const base = screenWidth * 0.32;
    return Math.min(140, Math.max(96, Math.round(base)));
  }, [screenWidth]);
  const bloomRadius = bloomSize / 2;
  const innerInset = Math.round(bloomSize * 0.18);

  const position = useRef(new Animated.ValueXY({ x: -9999, y: -9999 })).current;
  const scale = useRef(new Animated.Value(BLOOM_SCALE_FROM)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const activeAnim = useRef<Animated.CompositeAnimation | null>(null);
  const lastTriggerRef = useRef(0);
  const touchRef = useRef<TouchSnapshot | null>(null);

  const runBloom = (x: number, y: number) => {
    const now = Date.now();
    lastTriggerRef.current = now;

    position.setValue({ x: x - bloomRadius, y: y - bloomRadius });
    scale.setValue(BLOOM_SCALE_FROM);
    opacity.setValue(0);

    if (activeAnim.current) {
      activeAnim.current.stop();
    }

    activeAnim.current = Animated.sequence([
      Animated.parallel([
        Animated.timing(scale, {
          toValue: BLOOM_SCALE_TO,
          duration: BLOOM_APPEAR_MS,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: BLOOM_OPACITY_MAX,
          duration: BLOOM_APPEAR_MS,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        duration: BLOOM_FADE_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    activeAnim.current.start();
  };

  const handleTouchStartCapture = (event: NativeSyntheticEvent<NativeTouchEvent>) => {
    const touch = event.nativeEvent.touches?.[0];
    if (!touch) return;

    touchRef.current = {
      startX: touch.pageX,
      startY: touch.pageY,
      startTime: Date.now(),
      moved: false,
      multiTouch: event.nativeEvent.touches.length > 1,
    };
  };

  const handleTouchMoveCapture = (event: NativeSyntheticEvent<NativeTouchEvent>) => {
    const snapshot = touchRef.current;
    if (!snapshot || snapshot.moved) return;

    const touch = event.nativeEvent.touches?.[0];
    if (!touch) return;

    const dx = touch.pageX - snapshot.startX;
    const dy = touch.pageY - snapshot.startY;
    if (Math.hypot(dx, dy) > TAP_MOVE_THRESHOLD_PX) {
      snapshot.moved = true;
    }

    if (event.nativeEvent.touches.length > 1) {
      snapshot.multiTouch = true;
    }
  };

  const handleTouchEndCapture = (event: NativeSyntheticEvent<NativeTouchEvent>) => {
    const snapshot = touchRef.current;
    touchRef.current = null;
    if (!snapshot || snapshot.moved || snapshot.multiTouch) return;

    const duration = Date.now() - snapshot.startTime;
    if (duration > TAP_MAX_DURATION_MS) return;

    const touch = event.nativeEvent.changedTouches?.[0];
    if (!touch) return;

    // Cooldown is enforced only as a single-instance rule; we still replace the bloom immediately.
    if (Date.now() - lastTriggerRef.current < COOLDOWN_MS) {
      runBloom(touch.pageX, touch.pageY);
      return;
    }

    runBloom(touch.pageX, touch.pageY);
  };

  const handleTouchCancelCapture = () => {
    touchRef.current = null;
  };

  return (
    <View
      style={styles.root}
      collapsable={false}
      // Capture touch positions without claiming responder so child interactions stay intact.
      onStartShouldSetResponderCapture={() => false}
      onMoveShouldSetResponderCapture={() => false}
      onTouchStartCapture={handleTouchStartCapture}
      onTouchMoveCapture={handleTouchMoveCapture}
      onTouchEndCapture={handleTouchEndCapture}
      onTouchCancelCapture={handleTouchCancelCapture}
      // Fallback listeners for platforms where capture callbacks do not fire reliably.
      onTouchStart={handleTouchStartCapture}
      onTouchMove={handleTouchMoveCapture}
      onTouchEnd={handleTouchEndCapture}
      onTouchCancel={handleTouchCancelCapture}
    >
      {children}
      {/* pointerEvents="none" ensures the overlay never blocks buttons or scroll. */}
      <View pointerEvents="none" style={styles.overlay}>
        <Animated.View
          accessible={false}
          pointerEvents="none"
          style={[
            styles.bloom,
            {
              width: bloomSize,
              height: bloomSize,
              borderRadius: bloomRadius,
              opacity,
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { scale },
              ],
            },
          ]}
        >
          <View
            pointerEvents="none"
            style={[
              styles.bloomOuter,
              {
                borderRadius: bloomRadius,
              },
            ]}
          />
          <View
            pointerEvents="none"
            style={[
              styles.bloomInner,
              {
                top: innerInset,
                left: innerInset,
                right: innerInset,
                bottom: innerInset,
                borderRadius: bloomRadius - innerInset,
              },
            ]}
          />
        </Animated.View>
      </View>
    </View>
  );
};

TapBloomOverlay.displayName = 'TapBloomOverlay';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: theme.elevation.overlay,
    elevation: theme.elevation.overlay,
  },
  bloom: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  bloomOuter: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E6C9A8',
    opacity: 0.55,
  },
  bloomInner: {
    position: 'absolute',
    backgroundColor: '#E6C9A8',
    opacity: 0.85,
  },
});
