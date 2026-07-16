export const TEMP_CELSIUS = 'C';
export const TEMP_FAHRENHEIT = 'F';

const FAHRENHEIT_OFFSET = 32;
const FAHRENHEIT_MULTIPLIER = 9 / 5;
const CELSIUS_MULTIPLIER = 5 / 9;

export function convertTemperature(val: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) {
    return val;
  }

  if (fromUnit === TEMP_CELSIUS && toUnit === TEMP_FAHRENHEIT) {
    return (val * FAHRENHEIT_MULTIPLIER) + FAHRENHEIT_OFFSET;
  }

  return (val - FAHRENHEIT_OFFSET) * CELSIUS_MULTIPLIER;
}
