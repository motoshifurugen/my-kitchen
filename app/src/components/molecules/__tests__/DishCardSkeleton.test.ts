/**
 * DishCardSkeleton Tests
 *
 * Tests for skeleton loading card dimensions.
 */

import { getCardDimensions } from '../dishCardUtils';

describe('DishCardSkeleton', () => {
  describe('dimensions match DishCardItem', () => {
    it('uses same dimensions for 2 columns', () => {
      const { cardWidth, cardHeight } = getCardDimensions(320, 2);
      // Skeleton should use the same utility function
      expect(cardWidth).toBeCloseTo(136, 0);
      expect(cardHeight).toBeCloseTo(cardWidth * 1.2, 0);
    });

    it('uses same dimensions for 3 columns', () => {
      const { cardWidth, cardHeight } = getCardDimensions(375, 3);
      expect(cardWidth).toBeCloseTo(106.33, 0);
      expect(cardHeight).toBeCloseTo(cardWidth * 1.2, 0);
    });

    it('uses same dimensions for 4 columns', () => {
      const { cardWidth, cardHeight } = getCardDimensions(768, 4);
      expect(cardWidth).toBeCloseTo(176, 0);
      expect(cardHeight).toBeCloseTo(cardWidth * 1.2, 0);
    });
  });
});
