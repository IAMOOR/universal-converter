import { describe, it, expect } from 'vitest';
import { calculate } from './calculate';

describe('calculate', () => {
  it('should add two numbers correctly', () => {
    expect(calculate(5, 3, '+')).toBe(8);
    expect(calculate(-5, 3, '+')).toBe(-2);
    expect(calculate(0.1, 0.2, '+')).toBeCloseTo(0.3);
  });

  it('should subtract two numbers correctly', () => {
    expect(calculate(5, 3, '-')).toBe(2);
    expect(calculate(3, 5, '-')).toBe(-2);
    expect(calculate(0.3, 0.2, '-')).toBeCloseTo(0.1);
  });

  it('should multiply two numbers correctly', () => {
    expect(calculate(5, 3, '*')).toBe(15);
    expect(calculate(-5, 3, '*')).toBe(-15);
    expect(calculate(0, 5, '*')).toBe(0);
    expect(calculate(0.2, 0.3, '*')).toBeCloseTo(0.06);
  });

  it('should divide two numbers correctly', () => {
    expect(calculate(15, 3, '/')).toBe(5);
    expect(calculate(5, 2, '/')).toBe(2.5);
    expect(calculate(5, 0, '/')).toBe(Infinity);
    expect(calculate(-5, 0, '/')).toBe(-Infinity);
  });

  it('should return next number for unknown operator', () => {
    expect(calculate(5, 3, '^')).toBe(3);
    expect(calculate(5, 3, '')).toBe(3);
    expect(calculate(5, 3, 'unknown')).toBe(3);
  });
});
