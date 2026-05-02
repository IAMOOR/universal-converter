// import { Scale, Ruler, Droplets, Thermometer, Coins } from 'lucide-react';

export type Category = 'Weight' | 'Length' | 'Volume' | 'Temperature' | 'Currency';

export interface Unit {
  label: string;
  value: string;
  ratio?: number; // ratio to base unit
  description: string;
}

export const CATEGORIES: Record<Category, { icon: any; units: Unit[] }> = {
  Weight: {
    icon: 'Scale',
    units: [
      { label: 'Kilograms (kg)', value: 'kg', ratio: 1, description: 'Standard unit of mass (1 kg = 1000g)' },
      { label: 'Grams (g)', value: 'g', ratio: 0.001, description: 'Metric unit of mass (1000g = 1kg)' },
      { label: 'Milligrams (mg)', value: 'mg', ratio: 0.000001, description: 'Small metric unit (1000mg = 1g)' },
      { label: 'Pounds (lbs)', value: 'lbs', ratio: 0.453592, description: 'Imperial unit of mass (1 lb ≈ 0.454kg)' },
      { label: 'Ounces (oz)', value: 'oz', ratio: 0.0283495, description: 'Small imperial unit (16 oz = 1 lb)' },
    ],
  },
  Length: {
    icon: 'Ruler',
    units: [
      { label: 'Kilometers (km)', value: 'km', ratio: 1000, description: 'Large metric unit (1 km = 1000m)' },
      { label: 'Meters (m)', value: 'm', ratio: 1, description: 'Standard unit of length (100cm = 1m)' },
      { label: 'Centimeters (cm)', value: 'cm', ratio: 0.01, description: 'Metric unit of length (10mm = 1cm)' },
      { label: 'Millimeters (mm)', value: 'mm', ratio: 0.001, description: 'Small metric unit (1000mm = 1m)' },
      { label: 'Miles (mi)', value: 'mi', ratio: 1609.34, description: 'Imperial unit of distance (1 mi ≈ 1.61km)' },
      { label: 'Feet (ft)', value: 'ft', ratio: 0.3048, description: 'Imperial unit of length (1 ft = 12in)' },
      { label: 'Inches (in)', value: 'in', ratio: 0.0254, description: 'Small imperial unit (1 in = 2.54cm)' },
    ],
  },
  Volume: {
    icon: 'Droplets',
    units: [
      { label: 'Liters (L)', value: 'L', ratio: 1, description: 'Standard unit of volume (1000mL = 1L)' },
      { label: 'Milliliters (mL)', value: 'mL', ratio: 0.001, description: 'Small metric unit (1000mL = 1L)' },
      { label: 'Gallons (gal)', value: 'gal', ratio: 3.78541, description: 'Imperial unit of volume (1 gal ≈ 3.78L)' },
      { label: 'Quarts (qt)', value: 'qt', ratio: 0.946353, description: 'Imperial unit of volume (4 qt = 1 gal)' },
      { label: 'Pints (pt)', value: 'pt', ratio: 0.473176, description: 'Imperial unit of volume (2 pt = 1 qt)' },
    ],
  },
  Temperature: {
    icon: 'Thermometer',
    units: [
      { label: 'Celsius (°C)', value: 'C', description: 'Metric temperature scale (0°C = Freezing)' },
      { label: 'Fahrenheit (°F)', value: 'F', description: 'Imperial temperature scale (32°F = Freezing)' },
    ],
  },
  Currency: {
    icon: 'Coins',
    units: [
      { label: 'US Dollar (USD)', value: 'USD', description: 'United States Dollar' },
      { label: 'Euro (EUR)', value: 'EUR', description: 'European Union Euro' },
      { label: 'British Pound (GBP)', value: 'GBP', description: 'British Pound Sterling' },
      { label: 'Japanese Yen (JPY)', value: 'JPY', description: 'Japanese Yen' },
      { label: 'Canadian Dollar (CAD)', value: 'CAD', description: 'Canadian Dollar' },
      { label: 'Australian Dollar (AUD)', value: 'AUD', description: 'Australian Dollar' },
      { label: 'Swiss Franc (CHF)', value: 'CHF', description: 'Swiss Franc' },
      { label: 'Chinese Yuan (CNY)', value: 'CNY', description: 'Chinese Yuan Renminbi' },
      { label: 'Hong Kong Dollar (HKD)', value: 'HKD', description: 'Hong Kong Dollar' },
      { label: 'New Zealand Dollar (NZD)', value: 'NZD', description: 'New Zealand Dollar' },
      { label: 'South Korean Won (KRW)', value: 'KRW', description: 'South Korean Won' },
      { label: 'Singapore Dollar (SGD)', value: 'SGD', description: 'Singapore Dollar' },
      { label: 'Indian Rupee (INR)', value: 'INR', description: 'Indian Rupee' },
      { label: 'Mexican Peso (MXN)', value: 'MXN', description: 'Mexican Peso' },
      { label: 'Brazilian Real (BRL)', value: 'BRL', description: 'Brazilian Real' },
      { label: 'South African Rand (ZAR)', value: 'ZAR', description: 'South African Rand' },
      { label: 'Russian Ruble (RUB)', value: 'RUB', description: 'Russian Ruble' },
      { label: 'Turkish Lira (TRY)', value: 'TRY', description: 'Turkish Lira' },
      { label: 'Swedish Krona (SEK)', value: 'SEK', description: 'Swedish Krona' },
      { label: 'Norwegian Krone (NOK)', value: 'NOK', description: 'Norwegian Krone' },
      { label: 'Danish Krone (DKK)', value: 'DKK', description: 'Danish Krone' },
      { label: 'Polish Zloty (PLN)', value: 'PLN', description: 'Polish Zloty' },
      { label: 'Thai Baht (THB)', value: 'THB', description: 'Thai Baht' },
      { label: 'Indonesian Rupiah (IDR)', value: 'IDR', description: 'Indonesian Rupiah' },
      { label: 'Malaysian Ringgit (MYR)', value: 'MYR', description: 'Malaysian Ringgit' },
      { label: 'Philippine Peso (PHP)', value: 'PHP', description: 'Philippine Peso' },
      { label: 'Czech Koruna (CZK)', value: 'CZK', description: 'Czech Koruna' },
      { label: 'Hungarian Forint (HUF)', value: 'HUF', description: 'Hungarian Forint' },
      { label: 'Israeli New Shekel (ILS)', value: 'ILS', description: 'Israeli New Shekel' },
      { label: 'Chilean Peso (CLP)', value: 'CLP', description: 'Chilean Peso' },
      { label: 'UAE Dirham (AED)', value: 'AED', description: 'United Arab Emirates Dirham' },
      { label: 'Saudi Riyal (SAR)', value: 'SAR', description: 'Saudi Riyal' },
      { label: 'Egyptian Pound (EGP)', value: 'EGP', description: 'Egyptian Pound' },
      { label: 'Nigerian Naira (NGN)', value: 'NGN', description: 'Nigerian Naira' },
      { label: 'Kenyan Shilling (KES)', value: 'KES', description: 'Kenyan Shilling' },
      { label: 'Ghanaian Cedi (GHS)', value: 'GHS', description: 'Ghanaian Cedi' },
    ],
  },
};

export function convertValue(
  value: string,
  category: Category,
  fromUnit: string,
  toUnit: string,
  exchangeRates: Record<string, number> = {}
): { result: string; error: string | null } {
  if (!value) {
    return { result: '', error: null };
  }

  const val = parseFloat(value);
  if (isNaN(val)) {
    return { result: '', error: 'Please enter a valid number' };
  }

  if (category === 'Temperature') {
    if (fromUnit === toUnit) {
      return { result: val.toString(), error: null };
    } else if (fromUnit === 'C' && toUnit === 'F') {
      return { result: ((val * 9) / 5 + 32).toFixed(4).replace(/\.?0+$/, ''), error: null };
    } else if (fromUnit === 'F' && toUnit === 'C') {
      return { result: ((val - 32) * 5 / 9).toFixed(4).replace(/\.?0+$/, ''), error: null };
    }
  }

  if (category === 'Currency') {
    if (exchangeRates[fromUnit] && exchangeRates[toUnit]) {
      const valInUsd = val / exchangeRates[fromUnit];
      const result = valInUsd * exchangeRates[toUnit];
      return { result: result.toFixed(2), error: null };
    } else {
      return { result: 'Loading...', error: null };
    }
  }

  const units = CATEGORIES[category].units;
  const from = units.find((u) => u.value === fromUnit);
  const to = units.find((u) => u.value === toUnit);

  if (from && to && from.ratio && to.ratio) {
    const baseValue = val * from.ratio;
    const result = baseValue / to.ratio;
    return { result: result.toFixed(6).replace(/\.?0+$/, ''), error: null };
  }

  return { result: '', error: null };
}
