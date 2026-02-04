/**
 * useLoadingState Hook Tests
 *
 * Tests for time-based loading state transitions.
 * Thresholds per design spec:
 * - < 200ms: nothing
 * - 200-900ms: mini indicator
 * - > 900ms: skeleton
 * - > 3000ms: skeleton + message
 */

import { renderHook, act } from '@testing-library/react-native';
import { useLoadingState, LoadingState } from '../useLoadingState';

interface TestProps {
  isLoading: boolean;
}

// Thresholds from design spec
const INDICATOR_THRESHOLD = 200;
const SKELETON_THRESHOLD = 900;
const MESSAGE_THRESHOLD = 3000;

describe('useLoadingState', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initial state', () => {
    it('returns showNothing when loading starts', () => {
      const { result } = renderHook(() => useLoadingState(true));

      expect(result.current.showNothing).toBe(true);
      expect(result.current.showIndicator).toBe(false);
      expect(result.current.showSkeleton).toBe(false);
      expect(result.current.showMessage).toBe(false);
    });

    it('returns all false when not loading', () => {
      const { result } = renderHook(() => useLoadingState(false));

      expect(result.current.showNothing).toBe(false);
      expect(result.current.showIndicator).toBe(false);
      expect(result.current.showSkeleton).toBe(false);
      expect(result.current.showMessage).toBe(false);
    });
  });

  describe('threshold transitions', () => {
    it('shows indicator after 200ms', () => {
      const { result } = renderHook(() => useLoadingState(true));

      act(() => {
        jest.advanceTimersByTime(INDICATOR_THRESHOLD);
      });

      expect(result.current.showNothing).toBe(false);
      expect(result.current.showIndicator).toBe(true);
      expect(result.current.showSkeleton).toBe(false);
      expect(result.current.showMessage).toBe(false);
    });

    it('shows skeleton after 900ms', () => {
      const { result } = renderHook(() => useLoadingState(true));

      act(() => {
        jest.advanceTimersByTime(SKELETON_THRESHOLD);
      });

      expect(result.current.showNothing).toBe(false);
      expect(result.current.showIndicator).toBe(false);
      expect(result.current.showSkeleton).toBe(true);
      expect(result.current.showMessage).toBe(false);
    });

    it('shows message after 3000ms', () => {
      const { result } = renderHook(() => useLoadingState(true));

      act(() => {
        jest.advanceTimersByTime(MESSAGE_THRESHOLD);
      });

      expect(result.current.showNothing).toBe(false);
      expect(result.current.showIndicator).toBe(false);
      expect(result.current.showSkeleton).toBe(true);
      expect(result.current.showMessage).toBe(true);
    });
  });

  describe('loading completion', () => {
    it('resets all states when loading completes before 200ms', () => {
      const { result, rerender } = renderHook<LoadingState, TestProps>(
        ({ isLoading }) => useLoadingState(isLoading),
        { initialProps: { isLoading: true } }
      );

      act(() => {
        jest.advanceTimersByTime(100);
      });

      rerender({ isLoading: false });

      expect(result.current.showNothing).toBe(false);
      expect(result.current.showIndicator).toBe(false);
      expect(result.current.showSkeleton).toBe(false);
      expect(result.current.showMessage).toBe(false);
    });

    it('resets all states when loading completes between 200-900ms', () => {
      const { result, rerender } = renderHook<LoadingState, TestProps>(
        ({ isLoading }) => useLoadingState(isLoading),
        { initialProps: { isLoading: true } }
      );

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current.showIndicator).toBe(true);

      rerender({ isLoading: false });

      expect(result.current.showNothing).toBe(false);
      expect(result.current.showIndicator).toBe(false);
      expect(result.current.showSkeleton).toBe(false);
      expect(result.current.showMessage).toBe(false);
    });

    it('resets all states when loading completes after 900ms', () => {
      const { result, rerender } = renderHook<LoadingState, TestProps>(
        ({ isLoading }) => useLoadingState(isLoading),
        { initialProps: { isLoading: true } }
      );

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.showSkeleton).toBe(true);

      rerender({ isLoading: false });

      expect(result.current.showNothing).toBe(false);
      expect(result.current.showIndicator).toBe(false);
      expect(result.current.showSkeleton).toBe(false);
      expect(result.current.showMessage).toBe(false);
    });
  });

  describe('restart loading', () => {
    it('resets timers when loading restarts', () => {
      const { result, rerender } = renderHook<LoadingState, TestProps>(
        ({ isLoading }) => useLoadingState(isLoading),
        { initialProps: { isLoading: true } }
      );

      // Advance to indicator state
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(result.current.showIndicator).toBe(true);

      // Stop loading
      rerender({ isLoading: false });
      expect(result.current.showIndicator).toBe(false);

      // Restart loading
      rerender({ isLoading: true });
      expect(result.current.showNothing).toBe(true);

      // Should start from beginning
      act(() => {
        jest.advanceTimersByTime(100);
      });
      expect(result.current.showNothing).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('clears timers on unmount', () => {
      const { unmount } = renderHook(() => useLoadingState(true));

      unmount();

      // Should not throw or cause state updates
      act(() => {
        jest.advanceTimersByTime(5000);
      });
    });
  });
});
