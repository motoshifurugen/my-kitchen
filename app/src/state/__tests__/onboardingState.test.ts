/**
 * Onboarding State Tests
 *
 * Tests for the onboarding Zustand store with persistence.
 */

// Mock storage utilities
let mockStorageCompleted = false;
jest.mock('../../utils/storage', () => ({
  getOnboardingCompleted: jest.fn(() => Promise.resolve(mockStorageCompleted)),
  setOnboardingCompleted: jest.fn(() => {
    mockStorageCompleted = true;
    return Promise.resolve();
  }),
}));

import {
  useOnboardingState,
  selectShouldShowLoading,
  selectShouldShowOnboarding,
  selectShouldShowMainApp,
} from '../onboardingState';

// Reset store and mocks before each test
beforeEach(() => {
  mockStorageCompleted = false;
  useOnboardingState.setState({
    hasCompletedOnboarding: null,
    isHydrated: false,
  });
  jest.clearAllMocks();
});

describe('Onboarding State', () => {
  describe('Initial State', () => {
    it('hasCompletedOnboarding should be null before hydration', () => {
      const state = useOnboardingState.getState();
      expect(state.hasCompletedOnboarding).toBeNull();
    });

    it('isHydrated should be false before hydration', () => {
      const state = useOnboardingState.getState();
      expect(state.isHydrated).toBe(false);
    });
  });

  describe('hydrate', () => {
    it('should set isHydrated to true', async () => {
      await useOnboardingState.getState().hydrate();
      const state = useOnboardingState.getState();
      expect(state.isHydrated).toBe(true);
    });

    it('should load false from storage when not completed', async () => {
      mockStorageCompleted = false;
      await useOnboardingState.getState().hydrate();
      const state = useOnboardingState.getState();
      expect(state.hasCompletedOnboarding).toBe(false);
    });

    it('should load true from storage when completed', async () => {
      mockStorageCompleted = true;
      await useOnboardingState.getState().hydrate();
      const state = useOnboardingState.getState();
      expect(state.hasCompletedOnboarding).toBe(true);
    });

    it('should not re-hydrate if already hydrated', async () => {
      const { getOnboardingCompleted } = require('../../utils/storage');

      await useOnboardingState.getState().hydrate();
      await useOnboardingState.getState().hydrate();
      await useOnboardingState.getState().hydrate();

      expect(getOnboardingCompleted).toHaveBeenCalledTimes(1);
    });
  });

  describe('completeOnboarding', () => {
    it('should set hasCompletedOnboarding to true', async () => {
      await useOnboardingState.getState().completeOnboarding();
      const state = useOnboardingState.getState();
      expect(state.hasCompletedOnboarding).toBe(true);
    });

    it('should persist to storage', async () => {
      const { setOnboardingCompleted } = require('../../utils/storage');

      await useOnboardingState.getState().completeOnboarding();

      expect(setOnboardingCompleted).toHaveBeenCalledTimes(1);
    });
  });
});

describe('Selectors', () => {
  describe('selectShouldShowLoading', () => {
    it('should return true when not hydrated', () => {
      const state = useOnboardingState.getState();
      expect(selectShouldShowLoading(state)).toBe(true);
    });

    it('should return false when hydrated', async () => {
      await useOnboardingState.getState().hydrate();
      const state = useOnboardingState.getState();
      expect(selectShouldShowLoading(state)).toBe(false);
    });
  });

  describe('selectShouldShowOnboarding', () => {
    it('should return false when not hydrated', () => {
      const state = useOnboardingState.getState();
      expect(selectShouldShowOnboarding(state)).toBe(false);
    });

    it('should return true when hydrated and not completed', async () => {
      mockStorageCompleted = false;
      await useOnboardingState.getState().hydrate();
      const state = useOnboardingState.getState();
      expect(selectShouldShowOnboarding(state)).toBe(true);
    });

    it('should return false when hydrated and completed', async () => {
      mockStorageCompleted = true;
      await useOnboardingState.getState().hydrate();
      const state = useOnboardingState.getState();
      expect(selectShouldShowOnboarding(state)).toBe(false);
    });
  });

  describe('selectShouldShowMainApp', () => {
    it('should return false when not hydrated', () => {
      const state = useOnboardingState.getState();
      expect(selectShouldShowMainApp(state)).toBe(false);
    });

    it('should return false when hydrated but not completed', async () => {
      mockStorageCompleted = false;
      await useOnboardingState.getState().hydrate();
      const state = useOnboardingState.getState();
      expect(selectShouldShowMainApp(state)).toBe(false);
    });

    it('should return true when hydrated and completed', async () => {
      mockStorageCompleted = true;
      await useOnboardingState.getState().hydrate();
      const state = useOnboardingState.getState();
      expect(selectShouldShowMainApp(state)).toBe(true);
    });
  });
});

describe('Usage Scenarios', () => {
  describe('First App Launch', () => {
    it('should show onboarding after hydration', async () => {
      mockStorageCompleted = false;
      await useOnboardingState.getState().hydrate();
      const state = useOnboardingState.getState();

      expect(selectShouldShowLoading(state)).toBe(false);
      expect(selectShouldShowOnboarding(state)).toBe(true);
      expect(selectShouldShowMainApp(state)).toBe(false);
    });
  });

  describe('Return User', () => {
    it('should show main app after hydration', async () => {
      mockStorageCompleted = true;
      await useOnboardingState.getState().hydrate();
      const state = useOnboardingState.getState();

      expect(selectShouldShowLoading(state)).toBe(false);
      expect(selectShouldShowOnboarding(state)).toBe(false);
      expect(selectShouldShowMainApp(state)).toBe(true);
    });
  });

  describe('Completing Onboarding', () => {
    it('should transition to main app after completion', async () => {
      mockStorageCompleted = false;
      await useOnboardingState.getState().hydrate();

      // Before completion
      let state = useOnboardingState.getState();
      expect(selectShouldShowOnboarding(state)).toBe(true);
      expect(selectShouldShowMainApp(state)).toBe(false);

      // Complete onboarding
      await useOnboardingState.getState().completeOnboarding();

      // After completion
      state = useOnboardingState.getState();
      expect(selectShouldShowOnboarding(state)).toBe(false);
      expect(selectShouldShowMainApp(state)).toBe(true);
    });
  });
});
