/**
 * World Signals State
 *
 * Manages the current state of the kitchen world:
 * - Time of day (6 buckets)
 * - Season (4)
 * - Age group (3)
 * - Household type (2)
 *
 * These signals control which overlays and props are displayed.
 */

import { create } from 'zustand';

// ============================================================================
// Type Definitions
// ============================================================================

export type TimeOfDay =
  | 'early-morning'  // 4:00-6:00
  | 'morning'        // 6:00-10:00
  | 'day'            // 10:00-16:00
  | 'evening'        // 16:00-19:00
  | 'night'          // 19:00-23:00
  | 'late-night';    // 23:00-4:00

export type Season =
  | 'spring'   // March-May
  | 'summer'   // June-August
  | 'autumn'   // September-November
  | 'winter';  // December-February

export type AgeGroup =
  | 'young'   // 20-30s
  | 'adult'   // 40-50s
  | 'mature'; // 60+

export type HouseholdType =
  | 'solo'    // Single person
  | 'family'; // Multiple people

export interface WorldSignals {
  timeOfDay: TimeOfDay;
  season: Season;
  ageGroup: AgeGroup;
  householdType: HouseholdType;
}

export interface WorldSignalsState extends WorldSignals {
  // Interpolation values (0.0 - 1.0)
  timeBlend: number;       // Blend towards next time bucket
  seasonBlend: number;     // Blend towards next season (2-week transition)

  // Actions
  setTimeOfDay: (time: TimeOfDay) => void;
  setSeason: (season: Season) => void;
  setAgeGroup: (age: AgeGroup) => void;
  setHouseholdType: (household: HouseholdType) => void;
  setTimeBlend: (blend: number) => void;
  setSeasonBlend: (blend: number) => void;
  updateFromSystem: () => void;
}

// ============================================================================
// Time Bucket Mapping
// ============================================================================

export const TIME_BUCKETS: { start: number; end: number; name: TimeOfDay }[] = [
  { start: 4, end: 6, name: 'early-morning' },
  { start: 6, end: 10, name: 'morning' },
  { start: 10, end: 16, name: 'day' },
  { start: 16, end: 19, name: 'evening' },
  { start: 19, end: 23, name: 'night' },
  { start: 23, end: 4, name: 'late-night' }, // Wraps around midnight
];

export const getTimeOfDayFromHour = (hour: number): TimeOfDay => {
  for (const bucket of TIME_BUCKETS) {
    if (bucket.start <= bucket.end) {
      // Normal range (e.g., 6-10)
      if (hour >= bucket.start && hour < bucket.end) {
        return bucket.name;
      }
    } else {
      // Wrapping range (e.g., 23-4)
      if (hour >= bucket.start || hour < bucket.end) {
        return bucket.name;
      }
    }
  }
  return 'day'; // Fallback
};

/**
 * Calculate blend factor towards next time bucket
 * Returns 0.0 at bucket start, approaches 1.0 near bucket end
 */
export const calculateTimeBlend = (hour: number, minute: number): number => {
  const currentTime = hour + minute / 60;
  const bucket = TIME_BUCKETS.find((b) => {
    if (b.start <= b.end) {
      return currentTime >= b.start && currentTime < b.end;
    }
    return currentTime >= b.start || currentTime < b.end;
  });

  if (!bucket) return 0;

  let bucketDuration: number;
  let elapsed: number;

  if (bucket.start <= bucket.end) {
    bucketDuration = bucket.end - bucket.start;
    elapsed = currentTime - bucket.start;
  } else {
    // Wrapping bucket (late-night: 23-4)
    bucketDuration = 24 - bucket.start + bucket.end;
    elapsed = currentTime >= bucket.start
      ? currentTime - bucket.start
      : currentTime + (24 - bucket.start);
  }

  return Math.min(1, elapsed / bucketDuration);
};

// ============================================================================
// Season Mapping
// ============================================================================

export const SEASON_MONTHS: { months: number[]; name: Season }[] = [
  { months: [3, 4, 5], name: 'spring' },
  { months: [6, 7, 8], name: 'summer' },
  { months: [9, 10, 11], name: 'autumn' },
  { months: [12, 1, 2], name: 'winter' },
];

export const getSeasonFromMonth = (month: number): Season => {
  for (const s of SEASON_MONTHS) {
    if (s.months.includes(month)) {
      return s.name;
    }
  }
  return 'spring'; // Fallback
};

/**
 * Calculate season blend for 2-week transition period
 * Returns 0.0 at season start, approaches 1.0 in last 2 weeks
 */
export const calculateSeasonBlend = (month: number, day: number): number => {
  // Transition happens in the last 2 weeks of each season's last month
  const lastMonthOfSeason = [5, 8, 11, 2]; // May, August, November, February
  const currentMonthIndex = lastMonthOfSeason.indexOf(month);

  if (currentMonthIndex === -1) return 0;

  // Last 14 days of the season
  const daysInMonth = new Date(new Date().getFullYear(), month, 0).getDate();
  const transitionStart = daysInMonth - 14;

  if (day < transitionStart) return 0;

  return (day - transitionStart) / 14;
};

// ============================================================================
// Zustand Store
// ============================================================================

const getInitialState = (): WorldSignals & { timeBlend: number; seasonBlend: number } => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();

  return {
    timeOfDay: getTimeOfDayFromHour(hour),
    season: getSeasonFromMonth(month),
    ageGroup: 'adult', // Default
    householdType: 'solo', // Default
    timeBlend: calculateTimeBlend(hour, minute),
    seasonBlend: calculateSeasonBlend(month, day),
  };
};

export const useWorldSignals = create<WorldSignalsState>((set) => ({
  ...getInitialState(),

  setTimeOfDay: (time) => set({ timeOfDay: time }),
  setSeason: (season) => set({ season }),
  setAgeGroup: (age) => set({ ageGroup: age }),
  setHouseholdType: (household) => set({ householdType: household }),
  setTimeBlend: (blend) => set({ timeBlend: Math.max(0, Math.min(1, blend)) }),
  setSeasonBlend: (blend) => set({ seasonBlend: Math.max(0, Math.min(1, blend)) }),

  updateFromSystem: () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    set({
      timeOfDay: getTimeOfDayFromHour(hour),
      season: getSeasonFromMonth(month),
      timeBlend: calculateTimeBlend(hour, minute),
      seasonBlend: calculateSeasonBlend(month, day),
    });
  },
}));

// ============================================================================
// Ordered Arrays for Interpolation
// ============================================================================

export const TIME_ORDER: TimeOfDay[] = [
  'early-morning',
  'morning',
  'day',
  'evening',
  'night',
  'late-night',
];

export const SEASON_ORDER: Season[] = ['spring', 'summer', 'autumn', 'winter'];

export const getNextTimeOfDay = (current: TimeOfDay): TimeOfDay => {
  const index = TIME_ORDER.indexOf(current);
  return TIME_ORDER[(index + 1) % TIME_ORDER.length];
};

export const getNextSeason = (current: Season): Season => {
  const index = SEASON_ORDER.indexOf(current);
  return SEASON_ORDER[(index + 1) % SEASON_ORDER.length];
};
