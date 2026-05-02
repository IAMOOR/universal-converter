import { test } from 'node:test';
import assert from 'node:assert';
import { convertValue } from './converter.ts';

test('Weight conversion: kg to g', () => {
  const { result, error } = convertValue('1', 'Weight', 'kg', 'g');
  assert.strictEqual(result, '1000');
  assert.strictEqual(error, null);
});

test('Weight conversion: lbs to kg', () => {
  const { result, error } = convertValue('1', 'Weight', 'lbs', 'kg');
  // 1 lb = 0.453592 kg
  assert.strictEqual(result, '0.453592');
  assert.strictEqual(error, null);
});

test('Length conversion: m to cm', () => {
  const { result, error } = convertValue('1.5', 'Length', 'm', 'cm');
  assert.strictEqual(result, '150');
  assert.strictEqual(error, null);
});

test('Temperature conversion: C to F', () => {
  const { result, error } = convertValue('0', 'Temperature', 'C', 'F');
  assert.strictEqual(result, '32');
  assert.strictEqual(error, null);
});

test('Temperature conversion: F to C', () => {
  const { result, error } = convertValue('32', 'Temperature', 'F', 'C');
  assert.strictEqual(result, '0');
  assert.strictEqual(error, null);
});

test('Currency conversion: USD to EUR', () => {
  const exchangeRates = { USD: 1, EUR: 0.85 };
  const { result, error } = convertValue('100', 'Currency', 'USD', 'EUR', exchangeRates);
  assert.strictEqual(result, '85.00');
  assert.strictEqual(error, null);
});

test('Currency conversion: JPY to GBP', () => {
  const exchangeRates = { USD: 1, JPY: 110, GBP: 0.75 };
  const { result, error } = convertValue('110', 'Currency', 'JPY', 'GBP', exchangeRates);
  // 110 JPY = 1 USD, 1 USD = 0.75 GBP
  assert.strictEqual(result, '0.75');
  assert.strictEqual(error, null);
});

test('Invalid number input', () => {
  const { result, error } = convertValue('abc', 'Weight', 'kg', 'g');
  assert.strictEqual(result, '');
  assert.strictEqual(error, 'Please enter a valid number');
});

test('Empty input', () => {
  const { result, error } = convertValue('', 'Weight', 'kg', 'g');
  assert.strictEqual(result, '');
  assert.strictEqual(error, null);
});

test('Same unit conversion', () => {
  const { result, error } = convertValue('10', 'Length', 'm', 'm');
  assert.strictEqual(result, '10');
  assert.strictEqual(error, null);
});
