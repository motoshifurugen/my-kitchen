/**
 * DishCardItem Tests
 *
 * Tests for dish card item display logic.
 */

import { getCardDimensions } from '../dishCardUtils';

describe('getCardDimensions', () => {
  describe('2 columns (compact)', () => {
    it('calculates correct card width for 320pt screen', () => {
      // Available width = 320 - 2*20 = 280
      // Card width = (280 - 8) / 2 = 136
      const { cardWidth } = getCardDimensions(320, 2);
      expect(cardWidth).toBeCloseTo(136, 0);
    });
  });

  describe('3 columns (regular)', () => {
    it('calculates correct card width for 375pt screen', () => {
      // Available width = 375 - 2*20 = 335
      // Card width = (335 - 2*8) / 3 = 106.33
      const { cardWidth } = getCardDimensions(375, 3);
      expect(cardWidth).toBeCloseTo(106.33, 0);
    });
  });

  describe('4 columns (tablet)', () => {
    it('calculates correct card width for 768pt screen', () => {
      // Available width = 768 - 2*20 = 728
      // Card width = (728 - 3*8) / 4 = 176
      const { cardWidth } = getCardDimensions(768, 4);
      expect(cardWidth).toBeCloseTo(176, 0);
    });
  });

  describe('card height', () => {
    it('calculates height as width * 1.2', () => {
      const { cardWidth, cardHeight } = getCardDimensions(375, 3);
      expect(cardHeight).toBeCloseTo(cardWidth * 1.2, 0);
    });
  });
});
