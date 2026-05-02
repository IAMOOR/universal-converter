import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculate } from './calculator.ts';

test('calculate handles addition correctly', () => {
  assert.strictEqual(calculate(5, 3, '+'), 8);
  assert.strictEqual(calculate(-5, 3, '+'), -2);
  assert.strictEqual(calculate(0, 0, '+'), 0);
});

test('calculate handles subtraction correctly', () => {
  assert.strictEqual(calculate(10, 4, '-'), 6);
  assert.strictEqual(calculate(4, 10, '-'), -6);
  assert.strictEqual(calculate(0, 0, '-'), 0);
});

test('calculate handles multiplication correctly', () => {
  assert.strictEqual(calculate(4, 3, '*'), 12);
  assert.strictEqual(calculate(-4, 3, '*'), -12);
  assert.strictEqual(calculate(-4, -3, '*'), 12);
  assert.strictEqual(calculate(5, 0, '*'), 0);
});

test('calculate handles division correctly', () => {
  assert.strictEqual(calculate(10, 2, '/'), 5);
  assert.strictEqual(calculate(-10, 2, '/'), -5);
  // Note: Division by zero is typically handled by the caller,
  // but JavaScript returns Infinity, let's verify that behavior or if it's fine
  assert.strictEqual(calculate(5, 0, '/'), Infinity);
});

test('calculate returns next operand for unknown or default operator', () => {
  assert.strictEqual(calculate(5, 3, '='), 3);
  assert.strictEqual(calculate(5, 3, '^'), 3);
  assert.strictEqual(calculate(5, 3, ''), 3);
  assert.strictEqual(calculate(5, 3, 'foo'), 3);
});
