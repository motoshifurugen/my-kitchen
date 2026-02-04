/**
 * Storage Utility Tests
 *
 * Tests for AsyncStorage wrapper functions used for:
 * - Onboarding completion flag
 * - World signals persistence (ageGroup, householdType)
 */

// Mock AsyncStorage
const mockStorage: Record<string, string> = {};
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key: string) => Promise.resolve(mockStorage[key] ?? null)),
  setItem: jest.fn((key: string, value: string) => {
    mockStorage[key] = value;
    return Promise.resolve();
  }),
  removeItem: jest.fn((key: string) => {
    delete mockStorage[key];
    return Promise.resolve();
  }),
}));

import {
  STORAGE_KEYS,
  getOnboardingCompleted,
  setOnboardingCompleted,
  getAgeGroup,
  setAgeGroup,
  getHouseholdType,
  setHouseholdType,
} from '../storage';

// Clear mock storage before each test
beforeEach(() => {
  Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
  jest.clearAllMocks();
});

describe('Storage Keys', () => {
  it('should define onboarding completion key', () => {
    expect(STORAGE_KEYS.ONBOARDING_COMPLETED).toBe('onboarding.completed');
  });

  it('should define world signals keys', () => {
    expect(STORAGE_KEYS.AGE_GROUP).toBe('worldSignals.ageGroup');
    expect(STORAGE_KEYS.HOUSEHOLD_TYPE).toBe('worldSignals.householdType');
  });
});

describe('Onboarding Storage', () => {
  describe('getOnboardingCompleted', () => {
    it('should return false when key does not exist', async () => {
      const result = await getOnboardingCompleted();
      expect(result).toBe(false);
    });

    it('should return true when completed', async () => {
      mockStorage[STORAGE_KEYS.ONBOARDING_COMPLETED] = '1';
      const result = await getOnboardingCompleted();
      expect(result).toBe(true);
    });

    it('should return false for invalid values', async () => {
      mockStorage[STORAGE_KEYS.ONBOARDING_COMPLETED] = 'invalid';
      const result = await getOnboardingCompleted();
      expect(result).toBe(false);
    });
  });

  describe('setOnboardingCompleted', () => {
    it('should store "1" when called', async () => {
      await setOnboardingCompleted();
      expect(mockStorage[STORAGE_KEYS.ONBOARDING_COMPLETED]).toBe('1');
    });
  });
});

describe('World Signals Storage', () => {
  describe('ageGroup', () => {
    it('should return null when not set', async () => {
      const result = await getAgeGroup();
      expect(result).toBeNull();
    });

    it('should store and retrieve ageGroup', async () => {
      await setAgeGroup('adult');
      expect(mockStorage[STORAGE_KEYS.AGE_GROUP]).toBe('adult');

      const result = await getAgeGroup();
      expect(result).toBe('adult');
    });

    it('should support all valid ageGroup values', async () => {
      const validValues = ['young', 'adult', 'mature'] as const;

      for (const value of validValues) {
        await setAgeGroup(value);
        const result = await getAgeGroup();
        expect(result).toBe(value);
      }
    });

    it('should clear ageGroup when set to null', async () => {
      await setAgeGroup('adult');
      expect(await getAgeGroup()).toBe('adult');

      await setAgeGroup(null);
      expect(await getAgeGroup()).toBeNull();
    });

    it('should return null for invalid stored values', async () => {
      mockStorage[STORAGE_KEYS.AGE_GROUP] = 'invalid';
      const result = await getAgeGroup();
      expect(result).toBeNull();
    });
  });

  describe('householdType', () => {
    it('should return null when not set', async () => {
      const result = await getHouseholdType();
      expect(result).toBeNull();
    });

    it('should store and retrieve householdType', async () => {
      await setHouseholdType('family');
      expect(mockStorage[STORAGE_KEYS.HOUSEHOLD_TYPE]).toBe('family');

      const result = await getHouseholdType();
      expect(result).toBe('family');
    });

    it('should support all valid householdType values', async () => {
      const validValues = ['solo', 'family'] as const;

      for (const value of validValues) {
        await setHouseholdType(value);
        const result = await getHouseholdType();
        expect(result).toBe(value);
      }
    });

    it('should clear householdType when set to null', async () => {
      await setHouseholdType('family');
      expect(await getHouseholdType()).toBe('family');

      await setHouseholdType(null);
      expect(await getHouseholdType()).toBeNull();
    });

    it('should return null for invalid stored values', async () => {
      mockStorage[STORAGE_KEYS.HOUSEHOLD_TYPE] = 'invalid';
      const result = await getHouseholdType();
      expect(result).toBeNull();
    });
  });
});

describe('Storage Integration', () => {
  it('onboarding and signals should be independent', async () => {
    await setOnboardingCompleted();
    await setAgeGroup('mature');
    await setHouseholdType('solo');

    expect(await getOnboardingCompleted()).toBe(true);
    expect(await getAgeGroup()).toBe('mature');
    expect(await getHouseholdType()).toBe('solo');
  });

  it('clearing signals should not affect onboarding flag', async () => {
    await setOnboardingCompleted();
    await setAgeGroup('adult');

    await setAgeGroup(null);

    expect(await getOnboardingCompleted()).toBe(true);
    expect(await getAgeGroup()).toBeNull();
  });
});
