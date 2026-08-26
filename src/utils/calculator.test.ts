import { describe, it, expect } from 'vitest';
import { calculate } from './calculator';

describe('calculate', () => {
  it('adds two numbers', () => {
    expect(calculate(2, 3, '+')).toBe(5);
  });

  it('subtracts two numbers', () => {
    expect(calculate(5, 2, '-')).toBe(3);
  });

  it('multiplies two numbers', () => {
    expect(calculate(4, 3, '*')).toBe(12);
  });

  it('divides two numbers', () => {
    expect(calculate(10, 2, '/')).toBe(5);
  });

  it('returns the next number for unknown operator', () => {
    expect(calculate(10, 5, 'unknown')).toBe(5);
  });

  it('handles negative numbers', () => {
    expect(calculate(-5, -3, '+')).toBe(-8);
    expect(calculate(-5, -3, '-')).toBe(-2);
    expect(calculate(-5, -3, '*')).toBe(15);
    expect(calculate(-15, -3, '/')).toBe(5);
  });

  it('handles floating point numbers', () => {
    expect(calculate(0.1, 0.2, '+')).toBeCloseTo(0.3);
    expect(calculate(1.5, 0.5, '-')).toBe(1);
    expect(calculate(2.5, 2, '*')).toBe(5);
    expect(calculate(5.5, 2, '/')).toBe(2.75);
  });
});
