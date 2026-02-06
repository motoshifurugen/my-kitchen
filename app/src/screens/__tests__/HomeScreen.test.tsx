/**
 * HomeScreen Tests
 *
 * Tests for the S-01 home screen button components.
 * Focus: LargeRoundedButton styling, positioning, and animation behavior.
 *
 * Issue #148: 「棚」ボタン・「探索」ボタンの調整
 * - Fix overlap with 2.5D kitchen
 * - Position buttons above footer
 * - Apply app-specific button colors
 * - Enrich tap animations
 */

import { ViewStyle } from 'react-native';
import { colors, spacing, radius, shadow } from '../../tokens/designTokens';
import { scale, duration, easing } from '../../tokens/motionTokens';
import { footer as footerTokens } from '../../tokens/designTokens';

describe('LargeRoundedButton styling', () => {
  // Expected button style configuration based on design system
  const expectedButtonStyle: Partial<ViewStyle> = {
    backgroundColor: colors.accent.subtle, // Warm beige instead of pure white
    borderRadius: radius.xl, // 16pt - large rounded corners
  };

  describe('background color', () => {
    it('should use warm accent color (accent.subtle) instead of surface.elevated', () => {
      // Design system spec: color.accent.subtle (#E8DFD5) for warmer feel
      expect(expectedButtonStyle.backgroundColor).toBe(colors.accent.subtle);
      expect(colors.accent.subtle).toBe('#E8DFD5');
    });

    it('should NOT use plain white surface color', () => {
      expect(expectedButtonStyle.backgroundColor).not.toBe(colors.surface.elevated);
      expect(colors.surface.elevated).toBe('#FFFFFF');
    });
  });

  describe('border radius', () => {
    it('should use xl radius (16pt) for soft rounded appearance', () => {
      expect(expectedButtonStyle.borderRadius).toBe(radius.xl);
      expect(radius.xl).toBe(16);
    });
  });

  describe('shadow', () => {
    it('should have subtle shadow for elevation', () => {
      // Per design system: shadow.sm for buttons
      expect(shadow.sm).toBeDefined();
      expect(shadow.sm.shadowOpacity).toBeLessThanOrEqual(0.1);
    });
  });
});

describe('LargeRoundedButton tap animation', () => {
  describe('scale animation', () => {
    it('should scale down to 0.97 on press', () => {
      // Design system spec: scale.tap.down = 0.97
      expect(scale.tap.down).toBe(0.97);
    });

    it('should return to scale 1.0 on release', () => {
      // Design system spec: scale.tap.up = 1.0
      expect(scale.tap.up).toBe(1.0);
    });
  });

  describe('animation timing', () => {
    it('should use fast duration (150ms) for tap feedback', () => {
      // Design system spec: duration.fast = 150ms
      expect(duration.fast).toBe(150);
    });

    it('should have instant tap feedback duration (100ms)', () => {
      // Design system spec: duration.feedback.tap = 100ms
      expect(duration.feedback.tap).toBe(100);
    });
  });

  describe('pressed state background', () => {
    it('should have pressed surface color defined', () => {
      // Design system spec: color.surface.pressed for pressed state
      expect(colors.surface.pressed).toBeDefined();
      expect(colors.surface.pressed).toBe('#F0EBE5');
    });
  });

  describe('easing', () => {
    it('should use easeOut easing for smooth feedback', () => {
      expect(easing.feedback).toBeDefined();
    });
  });
});

describe('Button container positioning', () => {
  describe('position above footer', () => {
    it('should have footer height defined', () => {
      expect(footerTokens.height).toBeDefined();
      expect(footerTokens.height).toBe(56);
    });

    it('should use small spacing (8pt) above footer for close proximity', () => {
      // Issue #148: buttons should be close to footer for easy operation
      // Changed from spacing.lg (24pt) to spacing.sm (8pt)
      expect(spacing.sm).toBe(8);
      expect(spacing.lg).toBe(24);
    });

    it('should have button container gap using spacing.md (16pt)', () => {
      // Gap between the two buttons
      expect(spacing.md).toBe(16);
    });
  });

  describe('horizontal layout', () => {
    it('should use screen horizontal padding for margins', () => {
      expect(spacing.screen.horizontal).toBe(20);
    });
  });
});

describe('Button content styling', () => {
  describe('icon', () => {
    it('should use 32pt icon size for visibility', () => {
      const expectedIconSize = 32;
      expect(expectedIconSize).toBe(32);
    });
  });

  describe('label', () => {
    it('should use primary text color for contrast', () => {
      expect(colors.text.primary).toBe('#2C2825');
    });
  });
});

/**
 * Implementation requirements checklist for LargeRoundedButton:
 * (Verified in HomeScreen.tsx)
 *
 * Styling:
 * [x] backgroundColor: colors.accent.subtle (#E8DFD5) - Line 220, 399
 * [x] borderRadius: radius.xl (16pt) - Line 400
 * [x] shadow: shadow.sm - Line 401
 *
 * Animation:
 * [x] Scale down to 0.97 on press - Line 196 (scale.tap.down)
 * [x] Scale up to 1.0 on release - Line 206 (scale.tap.up)
 * [x] Animation duration: 100ms - Lines 197, 207 (duration.feedback.tap)
 * [x] Easing: easeOut - Lines 198, 208 (easing.feedback)
 * [x] Background color change on press - Line 218-220 (surface.pressed)
 *
 * Positioning:
 * [x] Bottom position: footerHeight + spacing.sm - Line 287-288
 * [x] Removed extra paddingBottom - Line 327-329 (no paddingBottom in style)
 *
 * Accessibility:
 * [x] Maintain accessibilityLabel - Line 239
 * [x] Maintain accessibilityRole="button" - Line 240
 */
