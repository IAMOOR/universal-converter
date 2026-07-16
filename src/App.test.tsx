import { describe, it, expect } from 'vitest';
import { calculate } from './App';

describe('calculate', () => {
  it('adds correctly', () => {
    expect(calculate(1, 2, '+')).toBe(3);
  });

  it('subtracts correctly', () => {
    expect(calculate(5, 3, '-')).toBe(2);
  });

  it('multiplies correctly', () => {
    expect(calculate(4, 3, '*')).toBe(12);
  });

  it('divides correctly', () => {
    expect(calculate(10, 2, '/')).toBe(5);
  });

  it('returns next operand for unsupported operator', () => {
    expect(calculate(5, 10, '^')).toBe(10);
    expect(calculate(5, 10, 'unknown')).toBe(10);
  });
});
