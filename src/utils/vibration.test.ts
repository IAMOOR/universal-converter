import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { triggerHaptic, isVibrationSupported } from './vibration';

describe('vibration utility', () => {
  const originalNavigator = globalThis.navigator;
  const originalWindow = (globalThis as any).window;

  beforeEach(() => {
    // In node/bun test environment, window may be undefined. Mock it as a Window object.
    (globalThis as any).window = {};
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
    if (originalWindow === undefined) {
      delete (globalThis as any).window;
    } else {
      (globalThis as any).window = originalWindow;
    }
  });

  describe('isVibrationSupported', () => {
    it('returns true when navigator.vibrate is a function in window environment', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: { vibrate: () => true },
        writable: true,
        configurable: true,
      });
      expect(isVibrationSupported()).toBe(true);
    });

    it('returns false when window is undefined', () => {
      delete (globalThis as any).window;
      Object.defineProperty(globalThis, 'navigator', {
        value: { vibrate: () => true },
        writable: true,
        configurable: true,
      });
      expect(isVibrationSupported()).toBe(false);
    });

    it('returns false when navigator.vibrate is undefined or not a function', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: {},
        writable: true,
        configurable: true,
      });
      expect(isVibrationSupported()).toBe(false);
    });
  });

  describe('triggerHaptic', () => {
    it('returns false when enabled is false', () => {
      let vibrateCalled = false;
      Object.defineProperty(globalThis, 'navigator', {
        value: {
          vibrate: () => {
            vibrateCalled = true;
            return true;
          },
        },
        writable: true,
        configurable: true,
      });

      const result = triggerHaptic('tick', false);
      expect(result).toBe(false);
      expect(vibrateCalled).toBe(false);
    });

    it('returns false when vibration is not supported', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: {},
        writable: true,
        configurable: true,
      });

      const result = triggerHaptic('tick', true);
      expect(result).toBe(false);
    });

    it('triggers vibrate with expected pattern on happy path', () => {
      let patternPassed: any = null;
      Object.defineProperty(globalThis, 'navigator', {
        value: {
          vibrate: (pattern: any) => {
            patternPassed = pattern;
            return true;
          },
        },
        writable: true,
        configurable: true,
      });

      const result = triggerHaptic('swap', true);
      expect(result).toBe(true);
      expect(patternPassed).toEqual([25, 35, 25]);
    });

    it('catches error and returns false when navigator.vibrate throws an exception', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: {
          vibrate: () => {
            throw new Error('NotAllowedError: Vibration is disabled by user policy');
          },
        },
        writable: true,
        configurable: true,
      });

      // Must catch the exception gracefully and return false without crashing
      let result: boolean | undefined;
      expect(() => {
        result = triggerHaptic('error', true);
      }).not.toThrow();
      expect(result).toBe(false);
    });
  });
});
