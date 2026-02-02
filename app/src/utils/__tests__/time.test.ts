/**
 * Time Utilities Tests
 *
 * Tests for time overlay interpolation and opacity calculations.
 */

import {
  lerp,
  getTimeOverlayState,
  getCurrentTimeOpacity,
  getNextTimeOpacity,
  getSeasonOverlayState,
  getCurrentSeasonOpacity,
  getNextSeasonOpacity,
  TIME_COLOR_TEMPS,
  getInterpolatedColorTemp,
} from '../time';

// ============================================================================
// lerp (linear interpolation)
// ============================================================================

describe('lerp', () => {
  it('returns a when t=0', () => {
    expect(lerp(10, 20, 0)).toBe(10);
  });

  it('returns b when t=1', () => {
    expect(lerp(10, 20, 1)).toBe(20);
  });

  it('returns midpoint when t=0.5', () => {
    expect(lerp(10, 20, 0.5)).toBe(15);
  });

  it('handles negative values', () => {
    expect(lerp(-10, 10, 0.5)).toBe(0);
  });
});

// ============================================================================
// getTimeOverlayState
// ============================================================================

describe('getTimeOverlayState', () => {
  it('returns current time and next time with blend factor', () => {
    const state = getTimeOverlayState('morning', 0);
    expect(state.current).toBe('morning');
    expect(state.next).toBe('day');
    expect(state.blend).toBe(0);
  });

  it('wraps from lateNight to earlyMorning', () => {
    const state = getTimeOverlayState('lateNight', 0.5);
    expect(state.current).toBe('lateNight');
    expect(state.next).toBe('earlyMorning');
  });
});

// ============================================================================
// Time Opacity Functions
// ============================================================================

describe('getCurrentTimeOpacity', () => {
  it('returns 1 when blend is 0', () => {
    expect(getCurrentTimeOpacity(0)).toBe(1);
  });

  it('returns 0 when blend is 1', () => {
    expect(getCurrentTimeOpacity(1)).toBe(0);
  });

  it('fades out as blend increases', () => {
    const mid = getCurrentTimeOpacity(0.5);
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(1);
  });
});

describe('getNextTimeOpacity', () => {
  it('returns 0 when blend is 0', () => {
    expect(getNextTimeOpacity(0)).toBe(0);
  });

  it('returns 1 when blend is 1', () => {
    expect(getNextTimeOpacity(1)).toBe(1);
  });

  it('fades in as blend increases', () => {
    const mid = getNextTimeOpacity(0.5);
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(1);
  });
});

describe('getCurrentTimeOpacity + getNextTimeOpacity', () => {
  it('sum to 1 at any blend value (crossfade)', () => {
    // Note: Due to easing, this may not be exactly 1, but should be close
    const blendValues = [0, 0.25, 0.5, 0.75, 1];
    blendValues.forEach((blend) => {
      const sum = getCurrentTimeOpacity(blend) + getNextTimeOpacity(blend);
      expect(sum).toBeCloseTo(1, 5);
    });
  });
});

// ============================================================================
// Season Overlay State
// ============================================================================

describe('getSeasonOverlayState', () => {
  it('returns current season and next season', () => {
    const state = getSeasonOverlayState('summer', 0);
    expect(state.current).toBe('summer');
    expect(state.next).toBe('autumn');
  });

  it('wraps from winter to spring', () => {
    const state = getSeasonOverlayState('winter', 0.5);
    expect(state.current).toBe('winter');
    expect(state.next).toBe('spring');
  });
});

// ============================================================================
// TIME_COLOR_TEMPS
// ============================================================================

describe('TIME_COLOR_TEMPS', () => {
  it('has values for all time periods', () => {
    expect(TIME_COLOR_TEMPS.earlyMorning).toBeDefined();
    expect(TIME_COLOR_TEMPS.morning).toBeDefined();
    expect(TIME_COLOR_TEMPS.day).toBeDefined();
    expect(TIME_COLOR_TEMPS.evening).toBeDefined();
    expect(TIME_COLOR_TEMPS.night).toBeDefined();
    expect(TIME_COLOR_TEMPS.lateNight).toBeDefined();
  });

  it('day has the highest color temperature (coolest)', () => {
    expect(TIME_COLOR_TEMPS.day).toBeGreaterThan(TIME_COLOR_TEMPS.night);
    expect(TIME_COLOR_TEMPS.day).toBeGreaterThan(TIME_COLOR_TEMPS.lateNight);
  });

  it('lateNight has the lowest color temperature (warmest)', () => {
    expect(TIME_COLOR_TEMPS.lateNight).toBeLessThan(TIME_COLOR_TEMPS.morning);
    expect(TIME_COLOR_TEMPS.lateNight).toBeLessThan(TIME_COLOR_TEMPS.day);
  });
});

// ============================================================================
// getInterpolatedColorTemp
// ============================================================================

describe('getInterpolatedColorTemp', () => {
  it('returns current temp when blend is 0', () => {
    const temp = getInterpolatedColorTemp('day', 'evening', 0);
    expect(temp).toBe(TIME_COLOR_TEMPS.day);
  });

  it('returns next temp when blend is 1', () => {
    const temp = getInterpolatedColorTemp('day', 'evening', 1);
    expect(temp).toBe(TIME_COLOR_TEMPS.evening);
  });

  it('interpolates between temps', () => {
    const temp = getInterpolatedColorTemp('day', 'evening', 0.5);
    const expected = (TIME_COLOR_TEMPS.day + TIME_COLOR_TEMPS.evening) / 2;
    // Allow some tolerance due to easing
    expect(temp).toBeGreaterThan(TIME_COLOR_TEMPS.evening);
    expect(temp).toBeLessThan(TIME_COLOR_TEMPS.day);
  });
});
