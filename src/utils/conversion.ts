export type Category = 'Weight' | 'Length' | 'Volume' | 'Temperature' | 'Currency' | 'Digital';

export interface Unit {
  label: string;
  value: string;
  ratio?: number; // ratio to base unit
  description: string;
}

export const CATEGORIES: Record<Category, { units: Unit[] }> = {
  Weight: {
    units: [
      { label: 'Kilograms (kg)', value: 'kg', ratio: 1, description: 'Standard unit of mass (1 kg = 1000g)' },
      { label: 'Grams (g)', value: 'g', ratio: 0.001, description: 'Metric unit of mass (1000g = 1kg)' },
      { label: 'Milligrams (mg)', value: 'mg', ratio: 0.000001, description: 'Small metric unit (1000mg = 1g)' },
      { label: 'Pounds (lbs)', value: 'lbs', ratio: 0.453592, description: 'Imperial unit of mass (1 lb ≈ 0.454kg)' },
      { label: 'Ounces (oz)', value: 'oz', ratio: 0.0283495, description: 'Small imperial unit (16 oz = 1 lb)' },
      { label: 'Metric Tonnes (t)', value: 'tonnes', ratio: 1000, description: 'Heavy metric mass unit (1 t = 1000kg)' },
    ],
  },
  Length: {
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
    units: [
      { label: 'Liters (L)', value: 'L', ratio: 1, description: 'Standard unit of volume (1000mL = 1L)' },
      { label: 'Milliliters (mL)', value: 'mL', ratio: 0.001, description: 'Small metric unit (1000mL = 1L)' },
      { label: 'Gallons (gal)', value: 'gal', ratio: 3.78541, description: 'Imperial unit of volume (1 gal ≈ 3.78L)' },
      { label: 'Quarts (qt)', value: 'qt', ratio: 0.946353, description: 'Imperial unit of volume (4 qt = 1 gal)' },
      { label: 'Pints (pt)', value: 'pt', ratio: 0.473176, description: 'Imperial unit of volume (2 pt = 1 qt)' },
      { label: 'Cups (cup)', value: 'cups', ratio: 0.236588, description: 'Standard culinary cup (1 cup ≈ 236.6 mL)' },
      { label: 'Tablespoons (tbsp)', value: 'tbsp', ratio: 0.014787, description: 'Standard cooking tablespoon (1 tbsp ≈ 14.8 mL)' },
      { label: 'Teaspoons (tsp)', value: 'tsp', ratio: 0.004929, description: 'Standard cooking teaspoon (1 tsp ≈ 4.9 mL)' },
    ],
  },
  Temperature: {
    units: [
      { label: 'Celsius (°C)', value: 'C', description: 'Metric temperature scale (0°C = Freezing)' },
      { label: 'Fahrenheit (°F)', value: 'F', description: 'Imperial temperature scale (32°F = Freezing)' },
    ],
  },
  Currency: {
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
  Digital: {
    units: [
      { label: 'Terabytes (TB)', value: 'TB', ratio: 1099511627776, description: 'Large digital storage (1 TB = 1024 GB)' },
      { label: 'Gigabytes (GB)', value: 'GB', ratio: 1073741824, description: 'Standard unit of data storage (1 GB = 1024 MB)' },
      { label: 'Megabytes (MB)', value: 'MB', ratio: 1048576, description: 'Digital data size (1 MB = 1024 KB)' },
      { label: 'Kilobytes (KB)', value: 'KB', ratio: 1024, description: 'Small data size (1 KB = 1024 Bytes)' },
      { label: 'Bytes (B)', value: 'bytes', ratio: 1, description: 'Basic digital memory unit (1 Byte = 8 Bits)' },
      { label: 'Bits (b)', value: 'bits', ratio: 0.125, description: 'Smallest unit of binary data' },
    ],
  }
};

export const getConvertedValue = (
  val: number,
  fromU: string,
  toU: string,
  category: Category,
  exchangeRates: Record<string, number> = {}
) => {
  if (category === 'Temperature') {
    if (fromU === toU) {
      return val;
    } else if (fromU === 'C' && toU === 'F') {
      return (val * 9) / 5 + 32;
    } else if (fromU === 'C' && toU === 'K') {
      return val + 273.15;
    } else if (fromU === 'F' && toU === 'C') {
      return ((val - 32) * 5) / 9;
    } else if (fromU === 'F' && toU === 'K') {
      return ((val - 32) * 5) / 9 + 273.15;
    } else if (fromU === 'K' && toU === 'C') {
      return val - 273.15;
    } else if (fromU === 'K' && toU === 'F') {
      return ((val - 273.15) * 9) / 5 + 32;
    }
    // Fallback logic from original code, though technically this won't be reached with complete cases.
    return ((val - 32) * 5) / 9;
  }

  if (category === 'Currency') {
    if (exchangeRates[fromU] && exchangeRates[toU]) {
      const valInUsd = val / exchangeRates[fromU];
      return valInUsd * exchangeRates[toU];
    }
    return 0;
  }

  const units = CATEGORIES[category].units;
  const fromObj = units.find((u) => u.value === fromU);
  const toObj = units.find((u) => u.value === toU);

  if (fromObj && toObj && fromObj.ratio && toObj.ratio) {
    const baseValue = val * fromObj.ratio;
    return baseValue / toObj.ratio;
  }
  return 0;
};
