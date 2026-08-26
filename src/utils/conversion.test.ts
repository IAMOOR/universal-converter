import { describe, it, expect } from 'vitest';
import { getConvertedValue } from './conversion';

describe('getConvertedValue', () => {
  it('converts same temperature unit correctly', () => {
    expect(getConvertedValue(100, 'C', 'C', 'Temperature')).toBe(100);
    expect(getConvertedValue(100, 'F', 'F', 'Temperature')).toBe(100);
  });

  it('converts C to F correctly', () => {
    expect(getConvertedValue(0, 'C', 'F', 'Temperature')).toBe(32);
    expect(getConvertedValue(100, 'C', 'F', 'Temperature')).toBe(212);
  });

  it('converts F to C correctly', () => {
    expect(getConvertedValue(32, 'F', 'C', 'Temperature')).toBe(0);
    expect(getConvertedValue(212, 'F', 'C', 'Temperature')).toBe(100);
  });

  it('converts C to K correctly', () => {
    expect(getConvertedValue(0, 'C', 'K', 'Temperature')).toBe(273.15);
  });

  it('converts F to K correctly', () => {
    expect(getConvertedValue(32, 'F', 'K', 'Temperature')).toBe(273.15);
  });

  it('converts K to C correctly', () => {
    expect(getConvertedValue(273.15, 'K', 'C', 'Temperature')).toBe(0);
  });

  it('converts K to F correctly', () => {
    expect(getConvertedValue(273.15, 'K', 'F', 'Temperature')).toBe(32);
  });

  it('converts weight units correctly', () => {
    // 1 kg = 1 kg
    expect(getConvertedValue(1, 'kg', 'kg', 'Weight')).toBe(1);
    // 1 kg = 1000 g
    expect(getConvertedValue(1, 'kg', 'g', 'Weight')).toBe(1000);
    // 1000 g = 1 kg
    expect(getConvertedValue(1000, 'g', 'kg', 'Weight')).toBe(1);
  });

  it('converts length units correctly', () => {
    expect(getConvertedValue(1, 'km', 'm', 'Length')).toBe(1000);
    expect(getConvertedValue(100, 'cm', 'm', 'Length')).toBe(1);
  });

  it('converts currency with exchange rates correctly', () => {
    const rates = { USD: 1, EUR: 0.85, GBP: 0.75 };

    // 100 USD to EUR
    expect(getConvertedValue(100, 'USD', 'EUR', 'Currency', rates)).toBe(85);

    // 85 EUR to USD
    expect(getConvertedValue(85, 'EUR', 'USD', 'Currency', rates)).toBe(100);

    // EUR to GBP
    expect(getConvertedValue(85, 'EUR', 'GBP', 'Currency', rates)).toBeCloseTo(75);
  });

  it('returns 0 for currency without proper rates', () => {
    expect(getConvertedValue(100, 'USD', 'EUR', 'Currency', {})).toBe(0);
  });

  it('returns 0 for unknown units', () => {
    expect(getConvertedValue(100, 'unknown1', 'unknown2', 'Weight')).toBe(0);
  });
});
