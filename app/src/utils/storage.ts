/**
 * Storage Utilities
 *
 * AsyncStorage wrapper functions for persistent data:
 * - Onboarding completion flag
 * - World signals (ageGroup, householdType)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'onboarding.completed',
  AGE_GROUP: 'worldSignals.ageGroup',
  HOUSEHOLD_TYPE: 'worldSignals.householdType',
} as const;

// ============================================================================
// Onboarding Storage
// ============================================================================

/**
 * Check if onboarding has been completed
 * @returns true if completed, false otherwise
 */
export async function getOnboardingCompleted(): Promise<boolean> {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
  return value === '1';
}

/**
 * Mark onboarding as completed
 */
export async function setOnboardingCompleted(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, '1');
}

// ============================================================================
// World Signals Storage
// ============================================================================

type AgeGroup = 'young' | 'adult' | 'mature';
type HouseholdType = 'solo' | 'family';

/**
 * Get stored ageGroup
 * @returns ageGroup value or null if not set
 */
export async function getAgeGroup(): Promise<AgeGroup | null> {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.AGE_GROUP);
  if (value === 'young' || value === 'adult' || value === 'mature') {
    return value;
  }
  return null;
}

/**
 * Store ageGroup
 * @param ageGroup - value to store, or null to clear
 */
export async function setAgeGroup(ageGroup: AgeGroup | null): Promise<void> {
  if (ageGroup === null) {
    await AsyncStorage.removeItem(STORAGE_KEYS.AGE_GROUP);
  } else {
    await AsyncStorage.setItem(STORAGE_KEYS.AGE_GROUP, ageGroup);
  }
}

/**
 * Get stored householdType
 * @returns householdType value or null if not set
 */
export async function getHouseholdType(): Promise<HouseholdType | null> {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.HOUSEHOLD_TYPE);
  if (value === 'solo' || value === 'family') {
    return value;
  }
  return null;
}

/**
 * Store householdType
 * @param householdType - value to store, or null to clear
 */
export async function setHouseholdType(householdType: HouseholdType | null): Promise<void> {
  if (householdType === null) {
    await AsyncStorage.removeItem(STORAGE_KEYS.HOUSEHOLD_TYPE);
  } else {
    await AsyncStorage.setItem(STORAGE_KEYS.HOUSEHOLD_TYPE, householdType);
  }
}
