/**
 * Celebration Layout Tests
 *
 * Tests for the celebration screen layout helper that computes
 * character positioning on the bookshelf background.
 *
 * Key concept: Background uses contentFit="cover", so we must compute
 * the effective drawn image rect (after cover scaling/cropping) to
 * correctly anchor the character's feet.
 */

import {
  CELEBRATION_BG,
  CELEBRATION_CHARACTER,
  getCoverImageRect,
  getCelebrationCharacterLayout,
} from '../celebrationLayout';

describe('celebrationLayout', () => {
  describe('CELEBRATION_BG constants', () => {
    it('should define background intrinsic dimensions', () => {
      expect(CELEBRATION_BG.WIDTH).toBe(1536);
      expect(CELEBRATION_BG.HEIGHT).toBe(2784);
    });

    it('should define correct aspect ratio', () => {
      const expectedAspect = 1536 / 2784;
      expect(CELEBRATION_BG.ASPECT).toBeCloseTo(expectedAspect, 4);
    });

    it('should define feet anchor Y ratio in background space', () => {
      // Feet anchor should be somewhere in lower portion of image
      expect(CELEBRATION_BG.FEET_ANCHOR_Y_RATIO).toBeGreaterThan(0.5);
      expect(CELEBRATION_BG.FEET_ANCHOR_Y_RATIO).toBeLessThan(1.0);
    });
  });

  describe('CELEBRATION_CHARACTER constants', () => {
    it('should define character intrinsic dimensions', () => {
      expect(CELEBRATION_CHARACTER.WIDTH).toBe(768);
      expect(CELEBRATION_CHARACTER.HEIGHT).toBe(1392);
    });

    it('should define character width ratio relative to background', () => {
      // Character should be roughly 30-60% of background width
      expect(CELEBRATION_CHARACTER.WIDTH_RATIO).toBeGreaterThan(0.2);
      expect(CELEBRATION_CHARACTER.WIDTH_RATIO).toBeLessThan(0.7);
    });

    it('should define foot anchor Y ratio within character image', () => {
      // Foot anchor should be near bottom of character image
      expect(CELEBRATION_CHARACTER.FOOT_Y_RATIO).toBeGreaterThan(0.8);
      expect(CELEBRATION_CHARACTER.FOOT_Y_RATIO).toBeLessThan(1.0);
    });
  });

  describe('getCoverImageRect', () => {
    it('should compute correct rect when screen is narrower than image aspect', () => {
      // Screen: 390x844 (iPhone 14 Pro-ish)
      // Image aspect: 1536/2784 ≈ 0.552
      // Screen aspect: 390/844 ≈ 0.462
      // Screen is narrower (0.462 < 0.552), so image scales to fill HEIGHT
      // and overflows horizontally (left/right cropped)
      const rect = getCoverImageRect(390, 844, CELEBRATION_BG.WIDTH, CELEBRATION_BG.HEIGHT);

      // Height should equal screen height (scaled to fill height)
      expect(rect.height).toBe(844);

      // Width should be > screen width (overflows horizontally)
      expect(rect.width).toBeGreaterThan(390);

      // Centered: left should be negative (cropped from sides)
      expect(rect.left).toBeLessThan(0);

      // Top should be 0 (no vertical offset)
      expect(rect.top).toBe(0);
    });

    it('should compute correct rect when screen is wider than image aspect', () => {
      // Landscape-ish screen: 800x600
      // Screen aspect: 800/600 ≈ 1.33
      // Image aspect: ~0.552
      // Screen is wider (1.33 > 0.552), so image scales to fill WIDTH
      // and overflows vertically (top/bottom cropped)
      const rect = getCoverImageRect(800, 600, CELEBRATION_BG.WIDTH, CELEBRATION_BG.HEIGHT);

      // Width should equal screen width (scaled to fill width)
      expect(rect.width).toBe(800);

      // Height should be > screen height (overflows vertically)
      expect(rect.height).toBeGreaterThan(600);

      // Centered: top should be negative (cropped from top/bottom)
      expect(rect.top).toBeLessThan(0);

      // Left should be 0 (no horizontal offset)
      expect(rect.left).toBe(0);
    });

    it('should compute correct rect when aspect ratios match exactly', () => {
      // Screen matches image aspect exactly
      const screenWidth = 384;
      const screenHeight = 696; // 384/696 ≈ 0.552
      const rect = getCoverImageRect(screenWidth, screenHeight, CELEBRATION_BG.WIDTH, CELEBRATION_BG.HEIGHT);

      // Should fill exactly with no overflow
      expect(rect.width).toBeCloseTo(screenWidth, 0);
      expect(rect.height).toBeCloseTo(screenHeight, 0);
      expect(rect.top).toBeCloseTo(0, 0);
      expect(rect.left).toBeCloseTo(0, 0);
    });
  });

  describe('getCelebrationCharacterLayout', () => {
    // Test with iPhone 14 Pro dimensions (390x844)
    const screenWidth = 390;
    const screenHeight = 844;

    it('should return layout object with required properties', () => {
      const layout = getCelebrationCharacterLayout(screenWidth, screenHeight);

      expect(layout).toHaveProperty('top');
      expect(layout).toHaveProperty('left');
      expect(layout).toHaveProperty('width');
      expect(layout).toHaveProperty('height');
    });

    it('should return numeric values for all properties', () => {
      const layout = getCelebrationCharacterLayout(screenWidth, screenHeight);

      expect(typeof layout.top).toBe('number');
      expect(typeof layout.left).toBe('number');
      expect(typeof layout.width).toBe('number');
      expect(typeof layout.height).toBe('number');
    });

    it('should center character horizontally', () => {
      const layout = getCelebrationCharacterLayout(screenWidth, screenHeight);

      // Character should be centered: left + width/2 ≈ screenWidth/2
      const charCenterX = layout.left + layout.width / 2;
      expect(charCenterX).toBeCloseTo(screenWidth / 2, 0);
    });

    it('should position character feet at background feet anchor', () => {
      const layout = getCelebrationCharacterLayout(screenWidth, screenHeight);

      // Character feet Y = layout.top + (character height * foot ratio)
      const charFeetY = layout.top + layout.height * CELEBRATION_CHARACTER.FOOT_Y_RATIO;

      // Background feet anchor in screen space
      const bgRect = getCoverImageRect(screenWidth, screenHeight, CELEBRATION_BG.WIDTH, CELEBRATION_BG.HEIGHT);
      const bgFeetY = bgRect.top + bgRect.height * CELEBRATION_BG.FEET_ANCHOR_Y_RATIO;

      // Feet should align (within 1px tolerance)
      expect(charFeetY).toBeCloseTo(bgFeetY, 0);
    });

    it('should scale character proportionally', () => {
      const layout = getCelebrationCharacterLayout(screenWidth, screenHeight);

      // Character aspect ratio should be preserved
      const charAspect = layout.width / layout.height;
      const expectedAspect = CELEBRATION_CHARACTER.WIDTH / CELEBRATION_CHARACTER.HEIGHT;

      expect(charAspect).toBeCloseTo(expectedAspect, 2);
    });

    it('should scale character width relative to background drawn width', () => {
      const layout = getCelebrationCharacterLayout(screenWidth, screenHeight);
      const bgRect = getCoverImageRect(screenWidth, screenHeight, CELEBRATION_BG.WIDTH, CELEBRATION_BG.HEIGHT);

      // Character width should be approximately WIDTH_RATIO * bgRect.width
      const expectedWidth = CELEBRATION_CHARACTER.WIDTH_RATIO * bgRect.width;
      expect(layout.width).toBeCloseTo(expectedWidth, 0);
    });

    it('should work correctly for different screen sizes', () => {
      // iPad-ish dimensions
      const ipadLayout = getCelebrationCharacterLayout(820, 1180);
      expect(ipadLayout.width).toBeGreaterThan(0);
      expect(ipadLayout.height).toBeGreaterThan(0);

      // iPhone SE dimensions
      const seLayout = getCelebrationCharacterLayout(375, 667);
      expect(seLayout.width).toBeGreaterThan(0);
      expect(seLayout.height).toBeGreaterThan(0);

      // Character should be proportionally larger on larger screens
      expect(ipadLayout.width).toBeGreaterThan(seLayout.width);
    });
  });
});
