/**
 * Vibration API integration for tactile haptic feedback on supported mobile devices.
 */

export type HapticFeedbackType = 'swap' | 'calculate' | 'tick' | 'clear' | 'error' | 'success';

/**
 * Checks if the Web Vibration API is supported on the current device and browser.
 */
export const isVibrationSupported = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    typeof navigator.vibrate === 'function'
  );
};

/**
 * Tactile vibration patterns (in milliseconds):
 * - swap: snappy dual-pulse pattern [25, 35, 25] for swapping units
 * - calculate: solid confirmation pulse [40] for calculation results
 * - tick: light, quick pulse [15] for keypad and selection interactions
 * - clear: triple warning pulse [20, 20, 20] when resetting or clearing
 * - error: alert double pulse [50, 40, 50] on mathematical or input errors
 * - success: distinct confirmation pulse [30] on copy or restore
 */
const HAPTIC_PATTERNS: Record<HapticFeedbackType, number | number[]> = {
  swap: [25, 35, 25],
  calculate: 40,
  tick: 15,
  clear: [20, 20, 20],
  error: [50, 40, 50],
  success: 30,
};

/**
 * Triggers tactile vibration feedback if supported and enabled.
 * Safely handles any permission or runtime errors silently.
 */
export const triggerHaptic = (
  type: HapticFeedbackType,
  enabled: boolean = true
): boolean => {
  if (!enabled || !isVibrationSupported()) {
    return false;
  }

  try {
    const pattern = HAPTIC_PATTERNS[type] ?? 15;
    return navigator.vibrate(pattern);
  } catch {
    // Graceful fallback on devices that throw or restrict vibration
    return false;
  }
};
