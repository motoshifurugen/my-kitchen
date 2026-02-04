/**
 * Onboarding State
 *
 * Zustand store for tracking onboarding completion with persistence.
 *
 * State:
 * - hasCompletedOnboarding: boolean | null (null during hydration)
 * - isHydrated: boolean
 *
 * Actions:
 * - completeOnboarding(): Promise<void>
 * - hydrate(): Promise<void>
 */

import { create } from 'zustand';
import {
  getOnboardingCompleted,
  setOnboardingCompleted,
} from '../utils/storage';

// ============================================================================
// Types
// ============================================================================

export interface OnboardingState {
  /**
   * Whether onboarding has been completed.
   * - null: not yet loaded from storage (hydration in progress)
   * - false: not completed, show onboarding
   * - true: completed, show main app
   */
  hasCompletedOnboarding: boolean | null;

  /**
   * Whether state has been hydrated from storage.
   * App should show loading screen until this is true.
   */
  isHydrated: boolean;

  /**
   * Mark onboarding as completed and persist to storage.
   */
  completeOnboarding: () => Promise<void>;

  /**
   * Load onboarding state from storage.
   * Called once on app startup.
   */
  hydrate: () => Promise<void>;
}

// ============================================================================
// Store
// ============================================================================

export const useOnboardingState = create<OnboardingState>((set, get) => ({
  hasCompletedOnboarding: null,
  isHydrated: false,

  completeOnboarding: async () => {
    await setOnboardingCompleted();
    set({ hasCompletedOnboarding: true });
  },

  hydrate: async () => {
    // Avoid re-hydrating if already done
    if (get().isHydrated) return;

    const completed = await getOnboardingCompleted();
    set({
      hasCompletedOnboarding: completed,
      isHydrated: true,
    });
  },
}));

// ============================================================================
// Selectors
// ============================================================================

/**
 * Returns true if app should show loading screen (waiting for hydration)
 */
export const selectShouldShowLoading = (state: OnboardingState): boolean =>
  !state.isHydrated;

/**
 * Returns true if app should show onboarding (hydrated but not completed)
 */
export const selectShouldShowOnboarding = (state: OnboardingState): boolean =>
  state.isHydrated && !state.hasCompletedOnboarding;

/**
 * Returns true if app should show main app (hydrated and completed)
 */
export const selectShouldShowMainApp = (state: OnboardingState): boolean =>
  state.isHydrated && state.hasCompletedOnboarding === true;
