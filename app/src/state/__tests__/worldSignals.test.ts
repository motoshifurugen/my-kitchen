/**
 * World Signals Tests
 *
 * Tests for time-of-day calculation and state management functions.
 */

import {
  getTimeOfDayFromHour,
  calculateTimeBlend,
  getNextTimeOfDay,
  getNextSeason,
  TIME_ORDER,
  SEASON_ORDER,
} from '../worldSignals';

// ============================================================================
// getTimeOfDayFromHour
// ============================================================================

describe('getTimeOfDayFromHour', () => {
  it('returns earlyMorning for hours 4-5', () => {
    expect(getTimeOfDayFromHour(4)).toBe('earlyMorning');
    expect(getTimeOfDayFromHour(5)).toBe('earlyMorning');
  });

  it('returns morning for hours 6-9', () => {
    expect(getTimeOfDayFromHour(6)).toBe('morning');
    expect(getTimeOfDayFromHour(9)).toBe('morning');
  });

  it('returns day for hours 10-15', () => {
    expect(getTimeOfDayFromHour(10)).toBe('day');
    expect(getTimeOfDayFromHour(12)).toBe('day');
    expect(getTimeOfDayFromHour(15)).toBe('day');
  });

  it('returns evening for hours 16-18', () => {
    expect(getTimeOfDayFromHour(16)).toBe('evening');
    expect(getTimeOfDayFromHour(18)).toBe('evening');
  });

  it('returns night for hours 19-22', () => {
    expect(getTimeOfDayFromHour(19)).toBe('night');
    expect(getTimeOfDayFromHour(22)).toBe('night');
  });

  it('returns lateNight for hours 23-3 (wrapping)', () => {
    expect(getTimeOfDayFromHour(23)).toBe('lateNight');
    expect(getTimeOfDayFromHour(0)).toBe('lateNight');
    expect(getTimeOfDayFromHour(1)).toBe('lateNight');
    expect(getTimeOfDayFromHour(3)).toBe('lateNight');
  });

  it('handles boundary hours correctly', () => {
    // Boundary: earlyMorning ends at 6
    expect(getTimeOfDayFromHour(5)).toBe('earlyMorning');
    expect(getTimeOfDayFromHour(6)).toBe('morning');

    // Boundary: night ends at 23
    expect(getTimeOfDayFromHour(22)).toBe('night');
    expect(getTimeOfDayFromHour(23)).toBe('lateNight');
  });
});

// ============================================================================
// getNextTimeOfDay
// ============================================================================

describe('getNextTimeOfDay', () => {
  it('returns next time in sequence', () => {
    expect(getNextTimeOfDay('earlyMorning')).toBe('morning');
    expect(getNextTimeOfDay('morning')).toBe('day');
    expect(getNextTimeOfDay('day')).toBe('evening');
    expect(getNextTimeOfDay('evening')).toBe('night');
    expect(getNextTimeOfDay('night')).toBe('lateNight');
  });

  it('wraps from lateNight to earlyMorning', () => {
    expect(getNextTimeOfDay('lateNight')).toBe('earlyMorning');
  });
});

// ============================================================================
// getNextSeason
// ============================================================================

describe('getNextSeason', () => {
  it('returns next season in sequence', () => {
    expect(getNextSeason('spring')).toBe('summer');
    expect(getNextSeason('summer')).toBe('autumn');
    expect(getNextSeason('autumn')).toBe('winter');
  });

  it('wraps from winter to spring', () => {
    expect(getNextSeason('winter')).toBe('spring');
  });
});

// ============================================================================
// calculateTimeBlend
// ============================================================================

describe('calculateTimeBlend', () => {
  it('returns 0 at the start of a time bucket', () => {
    // earlyMorning starts at 4:00
    expect(calculateTimeBlend(4, 0)).toBe(0);

    // morning starts at 6:00
    expect(calculateTimeBlend(6, 0)).toBe(0);

    // day starts at 10:00
    expect(calculateTimeBlend(10, 0)).toBe(0);
  });

  it('returns ~0.5 at the middle of a time bucket', () => {
    // earlyMorning is 4:00-6:00 (2 hours), middle is 5:00
    const blend = calculateTimeBlend(5, 0);
    expect(blend).toBeCloseTo(0.5, 1);
  });

  it('returns close to 1 near the end of a time bucket', () => {
    // earlyMorning ends at 6:00, so 5:50 should be close to 1
    const blend = calculateTimeBlend(5, 50);
    expect(blend).toBeGreaterThan(0.8);
    expect(blend).toBeLessThanOrEqual(1);
  });

  it('handles the wrapping lateNight bucket (23:00-4:00)', () => {
    // lateNight starts at 23:00
    expect(calculateTimeBlend(23, 0)).toBe(0);

    // At midnight (0:00), we're 1 hour into a 5-hour bucket
    const blendMidnight = calculateTimeBlend(0, 0);
    expect(blendMidnight).toBeCloseTo(0.2, 1);

    // At 2:00, we're 3 hours into a 5-hour bucket
    const blend2am = calculateTimeBlend(2, 0);
    expect(blend2am).toBeCloseTo(0.6, 1);
  });
});

// ============================================================================
// TIME_ORDER and SEASON_ORDER
// ============================================================================

describe('TIME_ORDER', () => {
  it('has 6 time periods in correct order', () => {
    expect(TIME_ORDER).toHaveLength(6);
    expect(TIME_ORDER[0]).toBe('earlyMorning');
    expect(TIME_ORDER[5]).toBe('lateNight');
  });
});

describe('SEASON_ORDER', () => {
  it('has 4 seasons in correct order', () => {
    expect(SEASON_ORDER).toHaveLength(4);
    expect(SEASON_ORDER[0]).toBe('spring');
    expect(SEASON_ORDER[3]).toBe('winter');
  });
});
