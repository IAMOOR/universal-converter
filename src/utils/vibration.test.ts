import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { isVibrationSupported, triggerHaptic } from './vibration.ts';

describe('vibration utilities', () => {
  const originalWindow = globalThis.window;
  const originalNavigator = globalThis.navigator;

  afterEach(() => {
    // Restore global state
    if (originalWindow !== undefined) {
      globalThis.window = originalWindow;
    } else {
      // @ts-expect-error cleanup window
      delete globalThis.window;
    }

    if (originalNavigator !== undefined) {
      globalThis.navigator = originalNavigator;
    } else {
      // @ts-expect-error cleanup navigator
      delete globalThis.navigator;
    }
  });

  describe('isVibrationSupported', () => {
    it('returns false when window is undefined', () => {
      // @ts-expect-error simulate undefined window
      delete globalThis.window;
      // @ts-expect-error simulate undefined navigator
      delete globalThis.navigator;

      assert.strictEqual(isVibrationSupported(), false);
    });

    it('returns false when window is defined but navigator is undefined', () => {
      // @ts-expect-error mock window
      globalThis.window = {};
      // @ts-expect-error simulate undefined navigator
      delete globalThis.navigator;

      assert.strictEqual(isVibrationSupported(), false);
    });

    it('returns false when navigator exists but vibrate is undefined', () => {
      // @ts-expect-error mock window
      globalThis.window = {};
      // @ts-expect-error mock navigator without vibrate
      globalThis.navigator = {};

      assert.strictEqual(isVibrationSupported(), false);
    });

    it('returns false when navigator.vibrate is not a function', () => {
      // @ts-expect-error mock window
      globalThis.window = {};
      // @ts-expect-error mock navigator with non-function vibrate
      globalThis.navigator = { vibrate: true };

      assert.strictEqual(isVibrationSupported(), false);
    });

    it('returns true when window, navigator, and navigator.vibrate function exist', () => {
      // @ts-expect-error mock window
      globalThis.window = {};
      // @ts-expect-error mock navigator with vibrate function
      globalThis.navigator = {
        vibrate: () => true,
      };

      assert.strictEqual(isVibrationSupported(), true);
    });
  });

  describe('triggerHaptic', () => {
    it('returns false when enabled is false even if vibration is supported', () => {
      let vibrateCalled = false;
      // @ts-expect-error mock window
      globalThis.window = {};
      // @ts-expect-error mock navigator
      globalThis.navigator = {
        vibrate: () => {
          vibrateCalled = true;
          return true;
        },
      };

      const result = triggerHaptic('swap', false);
      assert.strictEqual(result, false);
      assert.strictEqual(vibrateCalled, false);
    });

    it('returns false when vibration is not supported', () => {
      // @ts-expect-error simulate undefined window
      delete globalThis.window;
      // @ts-expect-error simulate undefined navigator
      delete globalThis.navigator;

      const result = triggerHaptic('calculate', true);
      assert.strictEqual(result, false);
    });

    it('calls navigator.vibrate with correct pattern for valid feedback types', () => {
      const calls: any[] = [];
      // @ts-expect-error mock window
      globalThis.window = {};
      // @ts-expect-error mock navigator
      globalThis.navigator = {
        vibrate: (pattern: any) => {
          calls.push(pattern);
          return true;
        },
      };

      assert.strictEqual(triggerHaptic('swap'), true);
      assert.deepStrictEqual(calls[0], [25, 35, 25]);

      assert.strictEqual(triggerHaptic('calculate'), true);
      assert.strictEqual(calls[1], 40);

      assert.strictEqual(triggerHaptic('tick'), true);
      assert.strictEqual(calls[2], 15);

      assert.strictEqual(triggerHaptic('clear'), true);
      assert.deepStrictEqual(calls[3], [20, 20, 20]);

      assert.strictEqual(triggerHaptic('error'), true);
      assert.deepStrictEqual(calls[4], [50, 40, 50]);

      assert.strictEqual(triggerHaptic('success'), true);
      assert.strictEqual(calls[5], 30);
    });

    it('falls back to default pattern 15 if unknown type is passed', () => {
      const calls: any[] = [];
      // @ts-expect-error mock window
      globalThis.window = {};
      // @ts-expect-error mock navigator
      globalThis.navigator = {
        vibrate: (pattern: any) => {
          calls.push(pattern);
          return true;
        },
      };

      // @ts-expect-error testing fallback for invalid type
      assert.strictEqual(triggerHaptic('unknown'), true);
      assert.strictEqual(calls[0], 15);
    });

    it('returns false and handles exceptions gracefully when navigator.vibrate throws', () => {
      // @ts-expect-error mock window
      globalThis.window = {};
      // @ts-expect-error mock navigator
      globalThis.navigator = {
        vibrate: () => {
          throw new Error('NotAllowedError');
        },
      };

      assert.strictEqual(triggerHaptic('tick'), false);
    });
  });
});
