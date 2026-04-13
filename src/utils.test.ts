import { describe, it, expect } from 'vitest';
import { calculate } from './utils';

describe('calculate', () => {
  it('should correctly add two numbers', () => {
    expect(calculate(2, 3, '+')).toBe(5);
    expect(calculate(-2, 3, '+')).toBe(1);
    expect(calculate(0, 0, '+')).toBe(0);
  });

  it('should correctly subtract two numbers', () => {
    expect(calculate(5, 3, '-')).toBe(2);
    expect(calculate(3, 5, '-')).toBe(-2);
    expect(calculate(0, 0, '-')).toBe(0);
  });

  it('should correctly multiply two numbers', () => {
    expect(calculate(4, 3, '*')).toBe(12);
    expect(calculate(-4, 3, '*')).toBe(-12);
    expect(calculate(0, 5, '*')).toBe(0);
  });

  it('should correctly divide two numbers', () => {
    expect(calculate(10, 2, '/')).toBe(5);
    expect(calculate(-10, 2, '/')).toBe(-5);
  });

  it('should return Infinity when dividing by 0', () => {
    expect(calculate(10, 0, '/')).toBe(Infinity);
    expect(calculate(-10, 0, '/')).toBe(-Infinity);
  });

  it('should return NaN when dividing 0 by 0', () => {
    expect(calculate(0, 0, '/')).toBeNaN();
  });

  it('should return the next number for unrecognized operators', () => {
    expect(calculate(2, 3, '%')).toBe(3);
    expect(calculate(2, 3, '^')).toBe(3);
    expect(calculate(2, 3, 'unknown')).toBe(3);
  });
});
