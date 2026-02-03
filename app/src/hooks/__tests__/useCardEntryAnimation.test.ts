/**
 * useCardEntryAnimation Tests
 *
 * Tests for card entry animation timing and values.
 */

import { getCardEntryAnimationConfig } from '../useCardEntryAnimation';

describe('getCardEntryAnimationConfig', () => {
  it('returns correct initial delay', () => {
    const config = getCardEntryAnimationConfig();
    expect(config.initialDelay).toBe(300);
  });

  it('returns correct animation duration', () => {
    const config = getCardEntryAnimationConfig();
    expect(config.duration).toBe(180);
  });

  it('returns correct initial values', () => {
    const config = getCardEntryAnimationConfig();
    expect(config.initialOpacity).toBe(0);
    expect(config.initialTranslateY).toBe(8);
    expect(config.initialScale).toBe(0.95);
  });

  it('returns correct final values', () => {
    const config = getCardEntryAnimationConfig();
    expect(config.finalOpacity).toBe(1);
    expect(config.finalTranslateY).toBe(0);
    expect(config.finalScale).toBe(1);
  });

  it('uses native driver', () => {
    const config = getCardEntryAnimationConfig();
    expect(config.useNativeDriver).toBe(true);
  });
});
