/**
 * Key-Value Storage Wrapper
 *
 * Lightweight persistence for app state using AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  hasCompletedOnboarding: 'hasCompletedOnboarding',
  notificationsEnabled: 'notificationsEnabled',
  lastAppOpenAt: 'lastAppOpenAt',
  lastNotificationSentAt: 'lastNotificationSentAt',
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;

export type StorageSchema = {
  hasCompletedOnboarding: boolean;
  notificationsEnabled: boolean;
  lastAppOpenAt: string;
  lastNotificationSentAt: string;
};

const keyToString = (key: StorageKey) => STORAGE_KEYS[key];

export const storage = {
  async get<K extends StorageKey>(key: K): Promise<StorageSchema[K] | null> {
    const raw = await AsyncStorage.getItem(keyToString(key));
    if (raw === null) return null;
    return JSON.parse(raw) as StorageSchema[K];
  },

  async set<K extends StorageKey>(key: K, value: StorageSchema[K]): Promise<void> {
    await AsyncStorage.setItem(keyToString(key), JSON.stringify(value));
  },

  async remove(key: StorageKey): Promise<void> {
    await AsyncStorage.removeItem(keyToString(key));
  },
};
