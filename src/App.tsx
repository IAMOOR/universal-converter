/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Scale, 
  Ruler, 
  Droplets, 
  Thermometer, 
  Calculator as CalculatorIcon, 
  Cpu,
  Copy, 
  Check, 
  ArrowRightLeft,
  ChevronDown,
  Plus,
  Minus,
  X,
  Divide,
  Equal,
  Delete,
  Info,
  Loader2,
  History,
  Coins,
  Sun,
  Moon,
  Contrast,
  Star,
  LineChart as LucideLineChart,
  Vibrate,
  VibrateOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerHaptic, isVibrationSupported } from './utils/vibration';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';

type Category = 'Weight' | 'Length' | 'Volume' | 'Temperature' | 'Currency' | 'Digital';
type Theme = 'light' | 'dark' | 'high-contrast';

interface Unit {
  label: string;
  value: string;
  ratio?: number; // ratio to base unit
  description: string;
}

const CATEGORIES: Record<Category, { icon: any; units: Unit[] }> = {
  Weight: {
    icon: Scale,
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
    icon: Ruler,
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
    icon: Droplets,
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
    icon: Thermometer,
    units: [
      { label: 'Celsius (°C)', value: 'C', description: 'Metric temperature scale (0°C = Freezing)' },
      { label: 'Fahrenheit (°F)', value: 'F', description: 'Imperial temperature scale (32°F = Freezing)' },
    ],
  },
  Currency: {
    icon: Coins,
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
    icon: Cpu,
    units: [
      { label: 'Terabytes (TB)', value: 'TB', ratio: 1099511627776, description: 'Large digital storage (1 TB = 1024 GB)' },
      { label: 'Gigabytes (GB)', value: 'GB', ratio: 1073741824, description: 'Standard unit of data storage (1 GB = 1024 MB)' },
      { label: 'Megabytes (MB)', value: 'MB', ratio: 1048576, description: 'Digital data size (1 MB = 1024 KB)' },
      { label: 'Kilobytes (KB)', value: 'KB', ratio: 1024, description: 'Small data size (1 KB = 1024 Bytes)' },
      { label: 'Bytes (B)', value: 'bytes', ratio: 1, description: 'Basic digital memory unit (1 Byte = 8 Bits)' },
      { label: 'Bits (b)', value: 'bits', ratio: 0.125, description: 'Smallest unit of binary data' },
    ],
  },
};

const PRESETS = [
  {
    id: 'cooking',
    name: '🍳 Cooking Volume',
    category: 'Volume' as Category,
    description: 'Culinary measurements (cups, tbsp, tsp, and metric/imperial volumes)',
    units: ['L', 'mL', 'gal', 'qt', 'pt', 'cups', 'tbsp', 'tsp'],
    defaultFrom: 'cups',
    defaultTo: 'mL'
  },
  {
    id: 'weight',
    name: '⚖️ Standard Weight',
    category: 'Weight' as Category,
    description: 'Common weight and mass scales including metric tonnes',
    units: ['kg', 'g', 'mg', 'lbs', 'oz', 'tonnes'],
    defaultFrom: 'lbs',
    defaultTo: 'kg'
  },
  {
    id: 'digital',
    name: '💾 Digital Storage',
    category: 'Digital' as Category,
    description: 'Data sizes from bits up to terabytes',
    units: ['bits', 'bytes', 'KB', 'MB', 'GB', 'TB'],
    defaultFrom: 'GB',
    defaultTo: 'MB'
  }
];

function Tooltip({ text, theme }: { text: string; theme: Theme }) {
  const [isOpen, setIsOpen] = useState(false);
  const isHighContrast = theme === 'high-contrast';

  return (
    <div 
      className="group relative inline-flex items-center ml-2"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={`p-1 rounded-full transition-colors ${
        isOpen 
          ? (isHighContrast ? 'bg-white text-black' : 'bg-blue-50 text-blue-500') 
          : (isHighContrast ? 'bg-black border border-white text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600')
      } cursor-help`}>
        <Info size={14} />
      </div>
      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 pointer-events-none transition-all duration-200 w-56 z-[100] ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
        <div className={`${isHighContrast ? 'bg-white text-black border-2 border-black' : 'bg-slate-900 text-white border border-slate-700 backdrop-blur-sm bg-opacity-95'} text-[11px] py-2.5 px-4 rounded-2xl shadow-2xl leading-relaxed text-center`}>
          {text}
          <div className={`absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent ${isHighContrast ? 'border-t-white' : 'border-t-slate-900'}`} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [category, setCategory] = useState<Category>('Weight');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const [pinnedUnits, setPinnedUnits] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem('converter_pinned_units');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const togglePin = useCallback((unitValue: string) => {
    setPinnedUnits(prev => {
      const currentPinned = prev[category] || [];
      const updated = currentPinned.includes(unitValue)
        ? currentPinned.filter(u => u !== unitValue)
        : [...currentPinned, unitValue];
      
      const next = { ...prev, [category]: updated };
      try {
        localStorage.setItem('converter_pinned_units', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save pinned units', err);
      }
      return next;
    });
  }, [category]);

  const isPinned = useCallback((unitValue: string) => {
    return (pinnedUnits[category] || []).includes(unitValue);
  }, [pinnedUnits, category]);

  const currentUnits = useMemo(() => {
    const allUnits = CATEGORIES[category].units;
    let filtered = allUnits;
    if (activePreset) {
      const preset = PRESETS.find(p => p.id === activePreset);
      if (preset && preset.category === category) {
        filtered = allUnits.filter(u => preset.units.includes(u.value));
      }
    }

    const pinned = pinnedUnits[category] || [];
    if (pinned.length === 0) return filtered;

    const pinnedList = filtered.filter(u => pinned.includes(u.value));
    const unpinnedList = filtered.filter(u => !pinned.includes(u.value));
    return [...pinnedList, ...unpinnedList];
  }, [category, activePreset, pinnedUnits]);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('converter_haptics_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const toggleHaptics = useCallback(() => {
    setHapticsEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('converter_haptics_enabled', String(next));
      } catch (err) {
        console.error('Failed to save haptics setting', err);
      }
      if (next) {
        triggerHaptic('success', true);
      }
      return next;
    });
  }, []);
  const [fromUnit, setFromUnit] = useState(CATEGORIES['Weight'].units[0].value);
  const [toUnit, setToUnit] = useState(CATEGORIES['Weight'].units[3].value);
  const [fromValue, setFromValue] = useState<string>('1');
  const [toValue, setToValue] = useState<string>('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [copied, setCopied] = useState(false);
  const [converterError, setConverterError] = useState<string | null>(null);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [loadingRates, setLoadingRates] = useState(false);
  const [showChart, setShowChart] = useState(true);

  const getConvertedValue = useCallback((val: number, fromU: string, toU: string) => {
    if (category === 'Temperature') {
      if (fromU === toU) {
        return val;
      } else if (fromU === 'C' && toU === 'F') {
        return (val * 9) / 5 + 32;
      } else {
        return ((val - 32) * 5) / 9;
      }
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
  }, [category, exchangeRates]);

  const chartData = useMemo(() => {
    let steps = [1, 5, 10, 25, 50, 100];
    if (category === 'Temperature') {
      steps = [-10, 0, 10, 20, 30, 40, 50, 100];
    } else if (category === 'Currency') {
      steps = [1, 10, 50, 100, 250, 500, 1000];
    } else if (category === 'Digital') {
      steps = [1, 8, 64, 512, 1024, 2048, 4096];
    }

    return steps.map(step => {
      const converted = getConvertedValue(step, fromUnit, toUnit);
      return {
        inputValue: step,
        convertedValue: parseFloat(converted.toFixed(4)),
        inputLabel: `${step} ${fromUnit}`,
        convertedLabel: `${converted.toFixed(2)} ${toUnit}`
      };
    });
  }, [category, fromUnit, toUnit, getConvertedValue]);

  // Calculator state
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrevValue, setCalcPrevValue] = useState<number | null>(null);
  const [calcOperator, setCalcOperator] = useState<string | null>(null);
  const [calcWaitingForOperand, setCalcWaitingForOperand] = useState(false);
  const [calcHistory, setCalcHistory] = useState<{ expression: string; result: string }[]>([]);
  const [calcError, setCalcError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [showCalcCurrency, setShowCalcCurrency] = useState(false);
  const [calcFromCurrency, setCalcFromCurrency] = useState('USD');
  const [calcToCurrency, setCalcToCurrency] = useState('EUR');
  const [currencyHistory, setCurrencyHistory] = useState<{
    fromAmount: string;
    fromUnit: string;
    toAmount: string;
    toUnit: string;
    date: string;
  }[]>([]);

  const themeStyles = {
    light: {
      bg: 'bg-slate-50',
      card: 'bg-white border-slate-100 shadow-slate-200/50',
      header: 'bg-slate-900 text-white',
      tabs: 'bg-slate-100',
      tabActive: 'bg-white text-blue-600 shadow-sm',
      tabInactive: 'text-slate-500 hover:bg-slate-200/50',
      input: 'bg-slate-50 border-transparent focus:border-blue-500 focus:bg-white text-slate-900',
      inputTo: 'bg-blue-50/50 text-blue-700 border-transparent',
      label: 'text-slate-400',
      desc: 'text-slate-500',
      historyCard: 'bg-slate-50 border-slate-100 hover:border-blue-100',
      historyText: 'text-slate-700',
      historySub: 'text-slate-400',
      calcDisplay: 'bg-slate-900 text-white',
      calcPrev: 'text-slate-500',
      calcBtn: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
      calcBtnOp: 'bg-blue-500 text-white hover:bg-blue-600',
      calcBtnEq: 'bg-slate-900 text-white hover:bg-slate-800',
      calcHistoryCard: 'bg-slate-50 border-slate-100 hover:border-blue-200 hover:bg-white',
      calcHistoryText: 'text-slate-700',
      calcHistorySub: 'text-slate-400',
      primaryBtn: 'bg-slate-900 text-white hover:bg-slate-800',
    },
    dark: {
      bg: 'bg-slate-950',
      card: 'bg-slate-900 border-slate-800 shadow-black/50',
      header: 'bg-slate-950 text-white',
      tabs: 'bg-slate-950',
      tabActive: 'bg-slate-800 text-blue-400 shadow-sm',
      tabInactive: 'text-slate-500 hover:bg-slate-800/50',
      input: 'bg-slate-800 border-transparent focus:border-blue-500 focus:bg-slate-800 text-white',
      inputTo: 'bg-blue-900/20 text-blue-300 border-transparent',
      label: 'text-slate-500',
      desc: 'text-slate-400',
      historyCard: 'bg-slate-800 border-slate-700 hover:border-blue-900',
      historyText: 'text-slate-200',
      historySub: 'text-slate-500',
      calcDisplay: 'bg-slate-950 text-white',
      calcPrev: 'text-slate-600',
      calcBtn: 'bg-slate-800 text-slate-200 hover:bg-slate-700',
      calcBtnOp: 'bg-blue-600 text-white hover:bg-blue-500',
      calcBtnEq: 'bg-slate-950 text-white hover:bg-slate-800',
      calcHistoryCard: 'bg-slate-800 border-slate-700 hover:border-blue-900 hover:bg-slate-800',
      calcHistoryText: 'text-slate-200',
      calcHistorySub: 'text-slate-500',
      primaryBtn: 'bg-blue-600 text-white hover:bg-blue-500',
    },
    'high-contrast': {
      bg: 'bg-black',
      card: 'bg-black border-4 border-white shadow-none',
      header: 'bg-black border-b-4 border-white text-white',
      tabs: 'bg-black',
      tabActive: 'bg-white text-black border-2 border-black',
      tabInactive: 'text-white border-2 border-transparent hover:border-white',
      input: 'bg-black border-2 border-white focus:border-yellow-400 text-white',
      inputTo: 'bg-black border-2 border-white text-yellow-400',
      label: 'text-white font-bold',
      desc: 'text-yellow-400 font-bold',
      historyCard: 'bg-black border-2 border-white hover:border-yellow-400',
      historyText: 'text-white',
      historySub: 'text-yellow-400',
      calcDisplay: 'bg-black border-2 border-white text-white',
      calcPrev: 'text-yellow-400',
      calcBtn: 'bg-black border-2 border-white text-white hover:bg-white hover:text-black',
      calcBtnOp: 'bg-white text-black font-black',
      calcBtnEq: 'bg-yellow-400 text-black font-black',
      calcHistoryCard: 'bg-black border-2 border-white hover:border-yellow-400 hover:bg-white hover:text-black',
      calcHistoryText: 'text-white',
      calcHistorySub: 'text-yellow-400',
    }
  };

  const s = themeStyles[theme];

  const fetchRates = async () => {
    setLoadingRates(true);
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      if (data && data.rates) {
        setExchangeRates(data.rates);
      }
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
    } finally {
      setLoadingRates(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const convert = useCallback(() => {
    if (!fromValue) {
      setToValue('');
      setConverterError(null);
      return;
    }

    const val = parseFloat(fromValue);
    if (isNaN(val)) {
      setToValue('');
      setConverterError('Please enter a valid number');
      return;
    }

    setConverterError(null);

    if (category === 'Temperature') {
      if (fromUnit === toUnit) {
        setToValue(val.toString());
      } else if (fromUnit === 'C' && toUnit === 'F') {
        setToValue(((val * 9) / 5 + 32).toFixed(4).replace(/\.?0+$/, ''));
      } else {
        setToValue(((val - 32) * 5 / 9).toFixed(4).replace(/\.?0+$/, ''));
      }
      return;
    }

    if (category === 'Currency') {
      if (exchangeRates[fromUnit] && exchangeRates[toUnit]) {
        // Convert fromUnit to USD first, then to toUnit
        const valInUsd = val / exchangeRates[fromUnit];
        const result = valInUsd * exchangeRates[toUnit];
        setToValue(result.toFixed(2));
      } else {
        setToValue('Loading...');
      }
      return;
    }

    const units = CATEGORIES[category].units;
    const from = units.find((u) => u.value === fromUnit);
    const to = units.find((u) => u.value === toUnit);

    if (from && to && from.ratio && to.ratio) {
      const baseValue = val * from.ratio;
      const result = baseValue / to.ratio;
      setToValue(result.toFixed(6).replace(/\.?0+$/, ''));
    }
  }, [category, fromUnit, toUnit, fromValue, exchangeRates]);

  useEffect(() => {
    convert();
  }, [convert]);

  useEffect(() => {
    const preset = activePreset ? PRESETS.find(p => p.id === activePreset) : null;
    
    let currentAllowedPreset = preset;
    if (preset && preset.category !== category) {
      setActivePreset(null);
      currentAllowedPreset = null;
    }

    const allowedUnits = currentAllowedPreset
      ? CATEGORIES[category].units.filter(u => currentAllowedPreset!.units.includes(u.value))
      : CATEGORIES[category].units;

    const allowedValues = allowedUnits.map(u => u.value);

    if (!allowedValues.includes(fromUnit) || !allowedValues.includes(toUnit) || fromUnit === toUnit) {
      setFromUnit(allowedValues[0]);
      setToUnit(allowedValues[allowedValues.length > 1 ? 1 : 0]);
    }
  }, [category, activePreset]);

  const handleCopy = useCallback(() => {
    triggerHaptic('success', hapticsEnabled);
    navigator.clipboard.writeText(toValue);
    setCopied(true);
    
    if (category === 'Currency' && fromValue && toValue) {
      setCurrencyHistory(prev => [{
        fromAmount: fromValue,
        fromUnit: fromUnit,
        toAmount: toValue,
        toUnit: toUnit,
        date: new Date().toLocaleString()
      }, ...prev].slice(0, 10));
    }
    
    setTimeout(() => setCopied(false), 2000);
  }, [toValue, category, fromValue, fromUnit, toUnit, hapticsEnabled]);

  const swapUnits = useCallback(() => {
    triggerHaptic('swap', hapticsEnabled);
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    setFromValue(toValue);
  }, [fromUnit, toUnit, toValue, hapticsEnabled]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (!showCalculator) swapUnits();
      }

      if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        if (!showCalculator && toValue) {
          handleCopy();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCalculator, swapUnits, handleCopy, toValue]);

  // Calculator Logic
  const inputDigit = (digit: string) => {
    triggerHaptic('tick', hapticsEnabled);
    setCalcError(null);
    if (calcWaitingForOperand) {
      setCalcDisplay(digit);
      setCalcWaitingForOperand(false);
    } else {
      setCalcDisplay(calcDisplay === '0' ? digit : calcDisplay + digit);
    }
  };

  const inputDot = () => {
    triggerHaptic('tick', hapticsEnabled);
    setCalcError(null);
    if (calcWaitingForOperand) {
      setCalcDisplay('0.');
      setCalcWaitingForOperand(false);
      return;
    }
    if (!calcDisplay.includes('.')) {
      setCalcDisplay(calcDisplay + '.');
    }
  };

  const clearCalc = () => {
    triggerHaptic('clear', hapticsEnabled);
    setCalcDisplay('0');
    setCalcPrevValue(null);
    setCalcOperator(null);
    setCalcWaitingForOperand(false);
    setCalcError(null);
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(calcDisplay);

    if (calcPrevValue === null) {
      triggerHaptic(nextOperator === '=' ? 'calculate' : 'tick', hapticsEnabled);
      setCalcPrevValue(inputValue);
    } else if (calcOperator) {
      const currentValue = calcPrevValue || 0;
      
      if (calcOperator === '/' && inputValue === 0) {
        triggerHaptic('error', hapticsEnabled);
        setCalcError('Cannot divide by zero');
        setCalcPrevValue(null);
        setCalcOperator(null);
        setCalcWaitingForOperand(true);
        return;
      }

      const newValue = calculate(currentValue, inputValue, calcOperator);
      
      if (nextOperator === '=') {
        triggerHaptic('calculate', hapticsEnabled);
        setCalcHistory(prev => [{
          expression: `${currentValue} ${calcOperator} ${inputValue}`,
          result: String(newValue)
        }, ...prev].slice(0, 10));
      } else {
        triggerHaptic('tick', hapticsEnabled);
      }
      
      setCalcPrevValue(newValue);
      setCalcDisplay(String(newValue));
    }

    setCalcWaitingForOperand(true);
    setCalcOperator(nextOperator === '=' ? null : nextOperator);
  };

  const calculate = (prev: number, next: number, op: string) => {
    switch (op) {
      case '+': return prev + next;
      case '-': return prev - next;
      case '*': return prev * next;
      case '/': return prev / next;
      default: return next;
    }
  };

  const handleUseInConverter = () => {
    triggerHaptic('success', hapticsEnabled);
    setFromValue(calcDisplay);
    setShowCalculator(false);
  };

  const handleCalcCurrencyConvert = () => {
    const val = parseFloat(calcDisplay);
    if (isNaN(val)) {
      triggerHaptic('error', hapticsEnabled);
      setCalcError('Invalid number');
      return;
    }

    if (exchangeRates[calcFromCurrency] && exchangeRates[calcToCurrency]) {
      triggerHaptic('calculate', hapticsEnabled);
      const valInUsd = val / exchangeRates[calcFromCurrency];
      const result = valInUsd * exchangeRates[calcToCurrency];
      const formattedResult = result.toFixed(2);
      
      setCalcHistory(prev => [{
        expression: `${val} ${calcFromCurrency} to ${calcToCurrency}`,
        result: formattedResult
      }, ...prev].slice(0, 10));
      
      setCalcDisplay(formattedResult);
      setCalcWaitingForOperand(true);
      setShowCalcCurrency(false);
    } else {
      triggerHaptic('error', hapticsEnabled);
      setCalcError('Rates not loaded');
    }
  };

  const swapCalcCurrencies = () => {
    triggerHaptic('swap', hapticsEnabled);
    const temp = calcFromCurrency;
    setCalcFromCurrency(calcToCurrency);
    setCalcToCurrency(temp);
  };

  return (
    <div className={`min-h-[100dvh] flex items-center justify-center md:p-4 font-sans transition-colors duration-300 ${s.bg}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full min-h-[100dvh] md:min-h-fit md:max-w-md !rounded-none md:!rounded-3xl shadow-xl !border-0 md:!border flex flex-col transition-all duration-300 ${s.card}`}
      >
        {/* Header */}
        <div className={`p-6 !rounded-t-none md:!rounded-t-3xl transition-colors duration-300 ${s.header}`}>
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-semibold tracking-tight">Converter</h1>
            <div className="flex gap-2">
              <div className="flex bg-slate-800/50 p-1 rounded-xl gap-1 mr-2">
                <button 
                  onClick={() => setTheme('light')}
                  className={`p-1.5 rounded-lg transition-all ${theme === 'light' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}
                  title="Light Mode"
                >
                  <Sun size={14} />
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Dark Mode"
                >
                  <Moon size={14} />
                </button>
                <button 
                  onClick={() => setTheme('high-contrast')}
                  className={`p-1.5 rounded-lg transition-all ${theme === 'high-contrast' ? 'bg-yellow-400 text-black' : 'text-slate-400 hover:text-white'}`}
                  title="High Contrast"
                >
                  <Contrast size={14} />
                </button>
              </div>
              <button 
                onClick={toggleHaptics}
                className={`p-2 rounded-xl transition-all touch-manipulation active:scale-95 cursor-pointer ${
                  hapticsEnabled 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title={hapticsEnabled ? "Tactile vibration feedback enabled (click to mute)" : "Tactile vibration feedback disabled (click to enable)"}
                aria-label={hapticsEnabled ? "Disable tactile feedback" : "Enable tactile feedback"}
              >
                {hapticsEnabled ? <Vibrate size={20} /> : <VibrateOff size={20} />}
              </button>
              <button 
                onClick={() => setShowCalculator(!showCalculator)}
                className={`p-2 rounded-xl transition-colors ${showCalculator ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                title="Calculator"
              >
                <CalculatorIcon size={20} />
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-slate-400 text-sm">Universal Metric & Math Tool</p>
            {isVibrationSupported() && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${hapticsEnabled ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <span>{hapticsEnabled ? 'Haptics On' : 'Haptics Muted'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className={`flex p-2 gap-1 transition-colors ${s.tabs}`}>
          {(Object.keys(CATEGORIES) as Category[]).map((cat) => {
            const Icon = CATEGORIES[cat].icon;
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  triggerHaptic('tick', hapticsEnabled);
                  setCategory(cat);
                }}
                className={`flex-1 flex flex-col items-center py-3 px-1 rounded-2xl transition-all duration-200 ${
                  isActive 
                    ? s.tabActive 
                    : s.tabInactive
                }`}
              >
                <Icon size={20} className="mb-1" />
                <span className="text-[10px] font-medium uppercase tracking-wider">{cat}</span>
              </button>
            );
          })}
        </div>

        <div className="relative flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {!showCalculator ? (
              <motion.div
                key="converter"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 space-y-6"
              >
                {/* Unit Presets Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${s.label}`}>Unit Presets</label>
                    {activePreset && (
                      <button 
                        onClick={() => {
                          setActivePreset(null);
                          const defaultUnits = CATEGORIES[category].units;
                          setFromUnit(defaultUnits[0].value);
                          setToUnit(defaultUnits[defaultUnits.length > 1 ? 1 : 0].value);
                        }}
                        className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors"
                      >
                        Reset to All Units
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scroll-smooth">
                    {PRESETS.map((p) => {
                      const isActive = activePreset === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            triggerHaptic('tick', hapticsEnabled);
                            setActivePreset(p.id);
                            setCategory(p.category);
                            setFromUnit(p.defaultFrom);
                            setToUnit(p.defaultTo);
                          }}
                          className={`shrink-0 px-3.5 py-2.5 rounded-2xl text-xs font-semibold tracking-wide border transition-all active:scale-95 flex flex-col items-start gap-0.5 text-left min-w-[130px] cursor-pointer ${
                            isActive
                              ? theme === 'high-contrast'
                                ? 'bg-white text-black border-black font-black'
                                : 'bg-blue-500 text-white border-transparent shadow-sm'
                              : theme === 'high-contrast'
                                ? 'bg-black text-white border-white'
                                : 'bg-slate-100/80 hover:bg-slate-200/60 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60 text-slate-700 border-transparent'
                          }`}
                        >
                          <span className="font-bold text-xs">{p.name}</span>
                          <span className={`text-[9px] font-normal opacity-75 ${isActive ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                            {p.units.length} Preset Units
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Favorite Units Quick-Access */}
                {(pinnedUnits[category] || []).length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${s.label}`}>Favorite Units (Quick Select)</label>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(pinnedUnits[category] || []).map((val) => {
                        const unit = CATEGORIES[category].units.find(u => u.value === val);
                        if (!unit) return null;
                        const isCurrentlyFrom = fromUnit === val;
                        const isCurrentlyTo = toUnit === val;
                        return (
                          <div 
                            key={val}
                            className={`flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-xl text-xs font-semibold transition-all border ${
                              isCurrentlyFrom
                                ? theme === 'high-contrast'
                                  ? 'bg-white text-black border-black font-black'
                                  : 'bg-blue-500 text-white border-transparent shadow-sm'
                                : isCurrentlyTo
                                  ? theme === 'high-contrast'
                                    ? 'bg-white text-black border-black font-black'
                                    : 'bg-emerald-500 text-white border-transparent shadow-sm'
                                  : theme === 'high-contrast'
                                    ? 'bg-black text-white border-white'
                                    : 'bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                            }`}
                          >
                            <span>⭐ {unit.label.split(' ')[0]}</span>
                            <div className="flex items-center gap-0.5 border-l border-current/20 pl-1.5">
                              <button
                                type="button"
                                onClick={() => setFromUnit(val)}
                                disabled={isCurrentlyTo}
                                className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase disabled:opacity-30 hover:bg-current/10 cursor-pointer`}
                                title="Set as 'From' unit"
                              >
                                From
                              </button>
                              <button
                                type="button"
                                onClick={() => setToUnit(val)}
                                disabled={isCurrentlyFrom}
                                className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase disabled:opacity-30 hover:bg-current/10 cursor-pointer`}
                                title="Set as 'To' unit"
                              >
                                To
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* From Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <label className={`text-xs font-bold uppercase tracking-widest ml-1 ${s.label}`}>From</label>
                      <Tooltip text={CATEGORIES[category].units.find(u => u.value === fromUnit)?.description || ''} theme={theme} />
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePin(fromUnit)}
                      className={`text-xs flex items-center gap-1 transition-all cursor-pointer ${
                        isPinned(fromUnit)
                          ? 'text-amber-500 font-bold'
                          : 'text-slate-400 dark:text-slate-500 hover:text-amber-500'
                      }`}
                      title={isPinned(fromUnit) ? "Unfavorite this unit" : "Favorite this unit"}
                    >
                      <Star size={12} fill={isPinned(fromUnit) ? "currentColor" : "none"} />
                      <span>{isPinned(fromUnit) ? 'Favorited' : 'Favorite'}</span>
                    </button>
                  </div>
                  <div className="relative group">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={fromValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^-?\d*\.?\d*$/.test(val)) {
                          setFromValue(val);
                        }
                      }}
                      className={`w-full border-2 rounded-2xl px-4 py-4 text-2xl font-semibold outline-none transition-all ${
                        converterError ? 'border-red-500 focus:border-red-500' : `focus:border-blue-500 ${s.input}`
                      }`}
                      placeholder="0"
                    />
                    <div className="absolute right-2 top-2 bottom-2 w-40">
                      <select
                        value={fromUnit}
                        onChange={(e) => setFromUnit(e.target.value)}
                        className={`w-full h-full border rounded-xl px-3 text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${theme === 'high-contrast' ? 'bg-black text-white border-white' : 'bg-white border-slate-200'}`}
                      >
                        {currentUnits.map((u) => (
                          <option key={u.value} value={u.value}>
                            {isPinned(u.value) ? `⭐ ${u.label}` : u.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="px-1 flex items-start gap-1.5 min-h-[2rem]">
                    <Info size={10} className={`mt-1 shrink-0 ${s.label}`} />
                    <p className={`text-[11px] leading-relaxed italic ${s.desc}`}>
                      {CATEGORIES[category].units.find(u => u.value === fromUnit)?.description}
                    </p>
                  </div>
                  {converterError && (
                    <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 animate-pulse">
                      {converterError}
                    </p>
                  )}
                </div>

                {/* Swap Button */}
                <div className="flex justify-center -my-3 relative z-10">
                  <button 
                    onClick={swapUnits}
                    title="Swap units (Alt + S)"
                    className={`p-3 rounded-full border shadow-sm transition-all active:scale-95 ${theme === 'high-contrast' ? 'bg-black border-white text-white hover:bg-white hover:text-black' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-500 hover:border-blue-200'}`}
                  >
                    <ArrowRightLeft size={18} />
                  </button>
                </div>

                {/* To Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <label className={`text-xs font-bold uppercase tracking-widest ml-1 ${s.label}`}>To</label>
                      <Tooltip text={CATEGORIES[category].units.find(u => u.value === toUnit)?.description || ''} theme={theme} />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => togglePin(toUnit)}
                        className={`text-xs flex items-center gap-1 transition-all cursor-pointer ${
                          isPinned(toUnit)
                            ? 'text-amber-500 font-bold'
                            : 'text-slate-400 dark:text-slate-500 hover:text-amber-500'
                        }`}
                        title={isPinned(toUnit) ? "Unfavorite this unit" : "Favorite this unit"}
                      >
                        <Star size={12} fill={isPinned(toUnit) ? "currentColor" : "none"} />
                        <span>{isPinned(toUnit) ? 'Favorited' : 'Favorite'}</span>
                      </button>
                      {category === 'Currency' && (
                        <button 
                          onClick={fetchRates}
                          className="text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer border-l pl-3 border-slate-200 dark:border-slate-700"
                          disabled={loadingRates}
                        >
                          {loadingRates ? <Loader2 size={10} className="animate-spin" /> : 'Refresh Rates'}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="relative group">
                    <input
                      type="text"
                      readOnly
                      value={toValue}
                      className={`w-full border-2 rounded-2xl px-4 py-4 text-2xl font-semibold outline-none transition-all ${s.inputTo}`}
                      placeholder="0"
                    />
                    <div className="absolute right-2 top-2 bottom-2 w-40">
                      <select
                        value={toUnit}
                        onChange={(e) => setToUnit(e.target.value)}
                        className={`w-full h-full border rounded-xl px-3 text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${theme === 'high-contrast' ? 'bg-black text-white border-white' : 'bg-white border-slate-200'}`}
                      >
                        {currentUnits.map((u) => (
                          <option key={u.value} value={u.value}>
                            {isPinned(u.value) ? `⭐ ${u.label}` : u.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="px-1 flex items-start gap-1.5 min-h-[2rem]">
                    <Info size={10} className={`mt-1 shrink-0 ${s.label}`} />
                    <p className={`text-[11px] leading-relaxed italic ${s.desc}`}>
                      {CATEGORIES[category].units.find(u => u.value === toUnit)?.description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4">
                  <button
                    onClick={handleCopy}
                    disabled={!toValue}
                    title="Copy result (Alt + C)"
                    className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${theme === 'high-contrast' ? 'bg-white text-black border-2 border-black font-black' : s.primaryBtn}`}
                  >
                    {copied ? (
                      <>
                        <Check size={18} className="text-green-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        <span>Copy Result <span className="opacity-60 text-xs ml-1 font-normal">(Alt + C)</span></span>
                      </>
                    )}
                  </button>
                </div>

                {/* Currency History */}
                {category === 'Currency' && currencyHistory.length > 0 && (
                  <div className="mt-8 space-y-3">
                    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-1 ${s.label}`}>
                      <History size={12} />
                      Currency History
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                      {currencyHistory.map((item, idx) => (
                        <div 
                          key={idx}
                          className={`border rounded-2xl p-4 flex justify-between items-center group transition-colors ${s.historyCard}`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${s.historyText}`}>{item.fromAmount} {item.fromUnit}</span>
                              <ArrowRightLeft size={10} className="text-slate-300" />
                              <span className="text-sm font-bold text-blue-600">{item.toAmount} {item.toUnit}</span>
                            </div>
                            <div className={`text-[10px] ${s.historySub}`}>{item.date}</div>
                          </div>
                          <button 
                            onClick={() => {
                              triggerHaptic('swap', hapticsEnabled);
                              setFromValue(item.fromAmount);
                              setFromUnit(item.fromUnit);
                              setToUnit(item.toUnit);
                            }}
                            className={`p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 ${theme === 'high-contrast' ? 'text-white hover:text-yellow-400' : 'text-slate-400 hover:text-blue-500 hover:bg-white'}`}
                            title="Restore"
                          >
                            <History size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Reference Chart Section */}
                <div className="mt-8 border-t pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowChart(!showChart)}
                      className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-1 transition-colors cursor-pointer select-none ${s.label} hover:text-blue-500`}
                    >
                      <LucideLineChart size={12} />
                      Quick Reference Chart ({fromUnit} → {toUnit})
                      <ChevronDown 
                        size={12} 
                        className={`transition-transform duration-200 ${showChart ? 'rotate-180' : ''}`} 
                      />
                    </button>
                  </div>

                  <AnimatePresence>
                    {showChart && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden space-y-4"
                      >
                        {/* Chart Container */}
                        <div className={`h-44 w-full rounded-2xl border p-2.5 transition-colors ${
                          theme === 'high-contrast'
                            ? 'bg-black border-white'
                            : theme === 'dark'
                              ? 'bg-slate-950 border-slate-800'
                              : 'bg-slate-50 border-slate-100'
                        }`}>
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={chartData}
                              margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                            >
                              <defs>
                                <linearGradient id={`chartGrad-${theme}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop 
                                    offset="5%" 
                                    stopColor={
                                      theme === 'high-contrast' 
                                        ? '#facc15' 
                                        : theme === 'dark' 
                                          ? '#3b82f6' 
                                          : '#2563eb'
                                    } 
                                    stopOpacity={0.3}
                                  />
                                  <stop 
                                    offset="95%" 
                                    stopColor={
                                      theme === 'high-contrast' 
                                        ? '#facc15' 
                                        : theme === 'dark' 
                                          ? '#3b82f6' 
                                          : '#2563eb'
                                    } 
                                    stopOpacity={0.0}
                                  />
                                </linearGradient>
                              </defs>
                              <CartesianGrid 
                                strokeDasharray="3 3" 
                                stroke={
                                  theme === 'high-contrast' 
                                    ? '#ffffff' 
                                    : theme === 'dark' 
                                      ? 'rgba(255, 255, 255, 0.08)' 
                                      : 'rgba(0, 0, 0, 0.04)'
                                } 
                                vertical={false} 
                              />
                              <XAxis 
                                dataKey="inputValue" 
                                stroke={
                                  theme === 'high-contrast' 
                                    ? '#ffffff' 
                                    : theme === 'dark' 
                                      ? '#64748b' 
                                      : '#94a3b8'
                                } 
                                fontSize={9}
                                tickLine={false}
                                axisLine={false}
                              />
                              <YAxis 
                                stroke={
                                  theme === 'high-contrast' 
                                    ? '#ffffff' 
                                    : theme === 'dark' 
                                      ? '#64748b' 
                                      : '#94a3b8'
                                } 
                                fontSize={9}
                                tickLine={false}
                                axisLine={false}
                              />
                              <RechartsTooltip 
                                cursor={{ 
                                  stroke: theme === 'high-contrast' 
                                    ? '#ffffff' 
                                    : theme === 'dark' 
                                      ? 'rgba(255, 255, 255, 0.12)' 
                                      : 'rgba(0, 0, 0, 0.05)', 
                                  strokeWidth: 1 
                                }}
                                content={({ active, payload }: any) => {
                                  if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                      <div className={`p-2.5 border rounded-xl text-xs shadow-xl leading-relaxed ${
                                        theme === 'high-contrast'
                                          ? 'bg-black text-white border-white border-2'
                                          : 'bg-slate-900/95 text-white border-slate-800'
                                      }`}>
                                        <p className="font-bold">{data.inputLabel}</p>
                                        <p className={`${theme === 'high-contrast' ? 'text-yellow-300' : 'text-blue-400'} font-extrabold`}>{data.convertedLabel}</p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="convertedValue" 
                                stroke={
                                  theme === 'high-contrast' 
                                    ? '#facc15' 
                                    : theme === 'dark' 
                                      ? '#3b82f6' 
                                      : '#2563eb'
                                } 
                                strokeWidth={2}
                                fillOpacity={1} 
                                fill={`url(#chartGrad-${theme})`} 
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Numeric Grid Reference */}
                        <div className="space-y-2">
                          <label className={`text-[9px] font-bold uppercase tracking-widest ml-1 ${s.label}`}>Quick Multipliers</label>
                          <div className={`grid grid-cols-3 gap-2`}>
                            {chartData.map((item, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => {
                                  triggerHaptic('tick', hapticsEnabled);
                                  setFromValue(String(item.inputValue));
                                }}
                                className={`p-2.5 rounded-xl text-center border transition-all active:scale-95 cursor-pointer flex flex-col justify-center items-center ${
                                  theme === 'high-contrast'
                                    ? 'bg-black border-white text-white hover:bg-white hover:text-black border-2'
                                    : theme === 'dark'
                                      ? 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white'
                                      : 'bg-slate-50 border-slate-200/60 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <span className="text-[10px] font-bold">{item.inputValue} {fromUnit}</span>
                                <span className={`text-[10px] font-extrabold truncate max-w-full mt-0.5 ${
                                  theme === 'high-contrast' 
                                    ? 'text-yellow-400' 
                                    : 'text-blue-600 dark:text-blue-400'
                                }`}>
                                  {item.convertedValue.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="calculator"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <div className={`rounded-2xl p-4 mb-4 text-right transition-all border ${s.calcDisplay} ${calcError ? 'ring-2 ring-red-500 border-red-500' : 'border-transparent'}`}>
                  <div className="text-xs h-4 mb-1 flex justify-between items-center">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowCalcCurrency(!showCalcCurrency)}
                        className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md transition-colors ${showCalcCurrency ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                      >
                        FX Convert
                      </button>
                    </div>
                    {calcError ? (
                      <span className="text-red-400 font-bold uppercase tracking-widest">Error</span>
                    ) : (
                      <span className={s.calcPrev}>{calcPrevValue !== null ? `${calcPrevValue} ${calcOperator || ''}` : ''}</span>
                    )}
                  </div>
                  <div className={`text-3xl font-mono font-bold truncate ${calcError ? 'text-red-400' : ''}`}>
                    {calcError || calcDisplay}
                  </div>
                </div>

                <AnimatePresence>
                  {showCalcCurrency && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mb-4"
                    >
                      <div className={`p-4 rounded-2xl border ${theme === 'high-contrast' ? 'bg-black border-white' : 'bg-slate-50 border-slate-100'} space-y-3`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${s.label}`}>Currency Converter</span>
                          <button onClick={() => setShowCalcCurrency(false)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="flex-1 space-y-1">
                            <label className={`text-[9px] font-bold uppercase tracking-widest ml-1 ${s.label}`}>From</label>
                            <select
                              value={calcFromCurrency}
                              onChange={(e) => setCalcFromCurrency(e.target.value)}
                              className={`w-full p-2 rounded-xl text-xs font-bold border outline-none transition-colors ${theme === 'high-contrast' ? 'bg-black text-white border-white' : 'bg-white border-slate-200 text-slate-700'}`}
                            >
                              {CATEGORIES['Currency'].units.map(u => (
                                <option key={u.value} value={u.value}>{u.value}</option>
                              ))}
                            </select>
                          </div>
                          <div className="pt-4 shrink-0">
                            <button
                              type="button"
                              onClick={swapCalcCurrencies}
                              title="Swap currencies"
                              aria-label="Swap currencies"
                              className={`p-2 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                                theme === 'high-contrast'
                                  ? 'bg-black text-white border-white'
                                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-500'
                              }`}
                            >
                              <ArrowRightLeft size={14} />
                            </button>
                          </div>
                          <div className="flex-1 space-y-1">
                            <label className={`text-[9px] font-bold uppercase tracking-widest ml-1 ${s.label}`}>To</label>
                            <select
                              value={calcToCurrency}
                              onChange={(e) => setCalcToCurrency(e.target.value)}
                              className={`w-full p-2 rounded-xl text-xs font-bold border outline-none transition-colors ${theme === 'high-contrast' ? 'bg-black text-white border-white' : 'bg-white border-slate-200 text-slate-700'}`}
                            >
                              {CATEGORIES['Currency'].units.map(u => (
                                <option key={u.value} value={u.value}>{u.value}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <button
                          onClick={handleCalcCurrencyConvert}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98] ${theme === 'high-contrast' ? 'bg-white text-black' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                          Convert {calcDisplay} {calcFromCurrency}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {calcHistory.length > 0 && (
                  <div className="mb-6 space-y-2">
                    <div className="flex items-center justify-between px-1 mb-2">
                      <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${s.label}`}>
                        <History size={12} />
                        Calculation History
                      </div>
                      <button 
                        onClick={() => setCalcHistory([])}
                        className="text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                      {calcHistory.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            triggerHaptic('tick', hapticsEnabled);
                            setCalcDisplay(item.result);
                            setCalcWaitingForOperand(true);
                          }}
                          className={`w-full text-left p-3 rounded-2xl border transition-all group ${s.calcHistoryCard}`}
                        >
                          <div className="flex justify-between items-center">
                            <div className={`text-[10px] font-medium truncate mr-2 ${s.calcHistorySub}`}>
                              {item.expression} =
                            </div>
                            <div className="text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              Reuse
                            </div>
                          </div>
                          <div className={`text-lg font-mono font-bold group-hover:text-blue-600 ${s.calcHistoryText}`}>
                            {item.result}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-4 gap-2">
                  <button onClick={clearCalc} className={`col-span-2 py-4 rounded-xl font-bold transition-all active:scale-95 ${theme === 'high-contrast' ? 'bg-black border-2 border-white text-white hover:bg-white hover:text-black' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>AC</button>
                  <button onClick={() => {
                    triggerHaptic('clear', hapticsEnabled);
                    setCalcDisplay(calcDisplay.slice(0, -1) || '0');
                  }} className={`py-4 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center ${s.calcBtn}`}><Delete size={18} /></button>
                  <button onClick={() => performOperation('/')} className={`py-4 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center ${calcOperator === '/' ? 'ring-2 ring-blue-400' : ''} ${s.calcBtnOp}`}><Divide size={18} /></button>
                  
                  {[7, 8, 9].map(n => (
                    <button key={n} onClick={() => inputDigit(String(n))} className={`py-4 rounded-xl font-bold transition-all active:scale-95 ${s.calcBtn}`}>{n}</button>
                  ))}
                  <button onClick={() => performOperation('*')} className={`py-4 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center ${calcOperator === '*' ? 'ring-2 ring-blue-400' : ''} ${s.calcBtnOp}`}><X size={18} /></button>
                  
                  {[4, 5, 6].map(n => (
                    <button key={n} onClick={() => inputDigit(String(n))} className={`py-4 rounded-xl font-bold transition-all active:scale-95 ${s.calcBtn}`}>{n}</button>
                  ))}
                  <button onClick={() => performOperation('-')} className={`py-4 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center ${calcOperator === '-' ? 'ring-2 ring-blue-400' : ''} ${s.calcBtnOp}`}><Minus size={18} /></button>
                  
                  {[1, 2, 3].map(n => (
                    <button key={n} onClick={() => inputDigit(String(n))} className={`py-4 rounded-xl font-bold transition-all active:scale-95 ${s.calcBtn}`}>{n}</button>
                  ))}
                  <button onClick={() => performOperation('+')} className={`py-4 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center ${calcOperator === '+' ? 'ring-2 ring-blue-400' : ''} ${s.calcBtnOp}`}><Plus size={18} /></button>
                  
                  <button onClick={() => inputDigit('0')} className={`col-span-2 py-4 rounded-xl font-bold transition-all active:scale-95 ${s.calcBtn}`}>0</button>
                  <button onClick={inputDot} className={`py-4 rounded-xl font-bold transition-all active:scale-95 ${s.calcBtn}`}>.</button>
                  <button onClick={() => performOperation('=')} className={`py-4 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center ${s.calcBtnEq}`}><Equal size={18} /></button>
                </div>

                <button
                  onClick={handleUseInConverter}
                  className={`w-full mt-4 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${theme === 'high-contrast' ? 'bg-white text-black border-2 border-black font-black' : s.primaryBtn}`}
                >
                  Use in Converter
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className={`mt-auto px-6 py-4 border-t text-center !rounded-b-none md:!rounded-b-3xl transition-colors ${theme === 'high-contrast' ? 'bg-black border-white' : 'bg-slate-50 border-slate-100'}`}>
          <p className={`text-[10px] uppercase tracking-widest font-bold ${s.label}`}>
            Universal Metric Converter & Calculator
          </p>
        </div>
      </motion.div>
    </div>
  );
}
