import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import { isVibrationSupported, triggerHaptic, type HapticFeedbackType } from './vibration';

describe('vibration utility', () => {
  const originalWindow = globalThis.window;
  const originalNavigator = globalThis.navigator;

  afterEach(() => {
    // Restore global state after each test
    if (originalWindow !== undefined) {
      globalThis.window = originalWindow;
    } else {
      delete (globalThis as Record<string, unknown>).window;
    }

    if (originalNavigator !== undefined) {
      globalThis.navigator = originalNavigator;
    } else {
      delete (globalThis as Record<string, unknown>).navigator;
    }
  });

  describe('isVibrationSupported', () => {
    it('returns false when window is undefined', () => {
      delete (globalThis as Record<string, unknown>).window;
      expect(isVibrationSupported()).toBe(false);
    });

    it('returns false when navigator is undefined', () => {
      globalThis.window = {} as unknown as Window & typeof globalThis;
      delete (globalThis as Record<string, unknown>).navigator;
      expect(isVibrationSupported()).toBe(false);
    });

    it('returns false when navigator.vibrate is undefined', () => {
      globalThis.window = {} as unknown as Window & typeof globalThis;
      globalThis.navigator = {} as unknown as Navigator;
      expect(isVibrationSupported()).toBe(false);
    });

    it('returns false when navigator.vibrate is not a function', () => {
      globalThis.window = {} as unknown as Window & typeof globalThis;
      globalThis.navigator = { vibrate: 'not-a-function' } as unknown as Navigator;
      expect(isVibrationSupported()).toBe(false);
    });

    it('returns true when navigator.vibrate is a function', () => {
      globalThis.window = {} as unknown as Window & typeof globalThis;
      globalThis.navigator = { vibrate: () => true } as unknown as Navigator;
      expect(isVibrationSupported()).toBe(true);
    });
  });

  describe('triggerHaptic', () => {
    let vibrateMock: ReturnType<typeof mock>;

    beforeEach(() => {
      vibrateMock = mock(() => true);
      globalThis.window = {} as unknown as Window & typeof globalThis;
      globalThis.navigator = { vibrate: vibrateMock } as unknown as Navigator;
    });

    it('returns false when enabled is false even if vibration is supported', () => {
      const result = triggerHaptic('tick', false);
      expect(result).toBe(false);
      expect(vibrateMock).not.toHaveBeenCalled();
    });

    it('returns false when vibration is not supported even if enabled is true', () => {
      delete (globalThis as Record<string, unknown>).navigator;
      const result = triggerHaptic('tick', true);
      expect(result).toBe(false);
    });

    it('defaults enabled parameter to true', () => {
      const result = triggerHaptic('tick');
      expect(result).toBe(true);
      expect(vibrateMock).toHaveBeenCalledWith(15);
    });

    it('calls navigator.vibrate with pattern [25, 35, 25] for swap', () => {
      const result = triggerHaptic('swap');
      expect(result).toBe(true);
      expect(vibrateMock).toHaveBeenCalledWith([25, 35, 25]);
    });

    it('calls navigator.vibrate with pattern 40 for calculate', () => {
      const result = triggerHaptic('calculate');
      expect(result).toBe(true);
      expect(vibrateMock).toHaveBeenCalledWith(40);
    });

    it('calls navigator.vibrate with pattern 15 for tick', () => {
      const result = triggerHaptic('tick');
      expect(result).toBe(true);
      expect(vibrateMock).toHaveBeenCalledWith(15);
    });

    it('calls navigator.vibrate with pattern [20, 20, 20] for clear', () => {
      const result = triggerHaptic('clear');
      expect(result).toBe(true);
      expect(vibrateMock).toHaveBeenCalledWith([20, 20, 20]);
    });

    it('calls navigator.vibrate with pattern [50, 40, 50] for error', () => {
      const result = triggerHaptic('error');
      expect(result).toBe(true);
      expect(vibrateMock).toHaveBeenCalledWith([50, 40, 50]);
    });

    it('calls navigator.vibrate with pattern 30 for success', () => {
      const result = triggerHaptic('success');
      expect(result).toBe(true);
      expect(vibrateMock).toHaveBeenCalledWith(30);
    });

    it('falls back to 15 when given an unknown feedback type', () => {
      const result = triggerHaptic('unknown' as unknown as HapticFeedbackType);
      expect(result).toBe(true);
      expect(vibrateMock).toHaveBeenCalledWith(15);
    });

    it('returns false if navigator.vibrate returns false', () => {
      vibrateMock.mockImplementation(() => false);
      const result = triggerHaptic('tick');
      expect(result).toBe(false);
      expect(vibrateMock).toHaveBeenCalledWith(15);
    });

    it('catches runtime errors thrown by navigator.vibrate and returns false gracefully', () => {
      vibrateMock.mockImplementation(() => {
        throw new Error('Vibration permission denied or restricted');
      });
      const result = triggerHaptic('tick');
      expect(result).toBe(false);
      expect(vibrateMock).toHaveBeenCalled();
    });
  });
});
