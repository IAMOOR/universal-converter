import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import { isVibrationSupported, triggerHaptic, type HapticFeedbackType } from './vibration.ts';

describe('vibration utility', () => {
  const originalWindow = globalThis.window;
  const originalNavigator = globalThis.navigator;

  afterEach(() => {
    // Restore globals
    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      configurable: true,
      writable: true,
    });
  });

  describe('isVibrationSupported', () => {
    it('returns true when navigator.vibrate is a function', () => {
      Object.defineProperty(globalThis, 'window', {
        value: {},
        configurable: true,
        writable: true,
      });
      Object.defineProperty(globalThis, 'navigator', {
        value: { vibrate: () => true },
        configurable: true,
        writable: true,
      });

      expect(isVibrationSupported()).toBe(true);
    });

    it('returns false when window is undefined', () => {
      Object.defineProperty(globalThis, 'window', {
        value: undefined,
        configurable: true,
        writable: true,
      });
      Object.defineProperty(globalThis, 'navigator', {
        value: { vibrate: () => true },
        configurable: true,
        writable: true,
      });

      expect(isVibrationSupported()).toBe(false);
    });

    it('returns false when navigator is undefined', () => {
      Object.defineProperty(globalThis, 'window', {
        value: {},
        configurable: true,
        writable: true,
      });
      Object.defineProperty(globalThis, 'navigator', {
        value: undefined,
        configurable: true,
        writable: true,
      });

      expect(isVibrationSupported()).toBe(false);
    });

    it('returns false when navigator.vibrate is not a function', () => {
      Object.defineProperty(globalThis, 'window', {
        value: {},
        configurable: true,
        writable: true,
      });
      Object.defineProperty(globalThis, 'navigator', {
        value: {},
        configurable: true,
        writable: true,
      });

      expect(isVibrationSupported()).toBe(false);
    });
  });

  describe('triggerHaptic', () => {
    let mockVibrate: ReturnType<typeof mock>;

    beforeEach(() => {
      mockVibrate = mock(() => true);
      Object.defineProperty(globalThis, 'window', {
        value: {},
        configurable: true,
        writable: true,
      });
      Object.defineProperty(globalThis, 'navigator', {
        value: { vibrate: mockVibrate },
        configurable: true,
        writable: true,
      });
    });

    it('returns false and does not vibrate when enabled is false', () => {
      const result = triggerHaptic('tick', false);

      expect(result).toBe(false);
      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it('returns false and does not vibrate when vibration is not supported', () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: {},
        configurable: true,
        writable: true,
      });

      const result = triggerHaptic('tick', true);

      expect(result).toBe(false);
    });

    it('defaults enabled to true and triggers vibration', () => {
      const result = triggerHaptic('tick');

      expect(result).toBe(true);
      expect(mockVibrate).toHaveBeenCalledWith(15);
    });

    it.each([
      ['swap', [25, 35, 25]],
      ['calculate', 40],
      ['tick', 15],
      ['clear', [20, 20, 20]],
      ['error', [50, 40, 50]],
      ['success', 30],
    ] as const)('triggers correct pattern for "%s"', (type, expectedPattern) => {
      const result = triggerHaptic(type);

      expect(result).toBe(true);
      expect(mockVibrate).toHaveBeenCalledWith(expectedPattern);
    });

    it('falls back to default 15ms pattern if unknown haptic type is passed', () => {
      const result = triggerHaptic('unknown' as HapticFeedbackType);

      expect(result).toBe(true);
      expect(mockVibrate).toHaveBeenCalledWith(15);
    });

    it('returns the boolean result returned by navigator.vibrate', () => {
      mockVibrate.mockImplementation(() => false);

      const result = triggerHaptic('calculate');

      expect(result).toBe(false);
      expect(mockVibrate).toHaveBeenCalledWith(40);
    });

    it('catches errors thrown by navigator.vibrate and gracefully returns false', () => {
      mockVibrate.mockImplementation(() => {
        throw new Error('User activation required or permission denied');
      });

      const result = triggerHaptic('tick');

      expect(result).toBe(false);
      expect(mockVibrate).toHaveBeenCalledWith(15);
    });
  });
});
