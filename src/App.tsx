/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  Scale, 
  Ruler, 
  Droplets, 
  Thermometer, 
  Calculator as CalculatorIcon, 
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
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
  History,
  Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Modality } from "@google/genai";

type Category = 'Weight' | 'Length' | 'Volume' | 'Temperature' | 'Currency';

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
};

// Audio processing constants
const SAMPLE_RATE = 16000;
const CHUNK_SIZE = 2048;

function Tooltip({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="group relative inline-flex items-center ml-2"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={`p-1 rounded-full transition-colors ${isOpen ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'} cursor-help`}>
        <Info size={14} />
      </div>
      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 pointer-events-none transition-all duration-200 w-56 z-[100] ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
        <div className="bg-slate-900 text-white text-[11px] py-2.5 px-4 rounded-2xl shadow-2xl border border-slate-700 leading-relaxed text-center backdrop-blur-sm bg-opacity-95">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [category, setCategory] = useState<Category>('Weight');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string>('Idle');
  const [fromUnit, setFromUnit] = useState(CATEGORIES['Weight'].units[0].value);
  const [toUnit, setToUnit] = useState(CATEGORIES['Weight'].units[3].value);
  const [fromValue, setFromValue] = useState<string>('1');
  const [toValue, setToValue] = useState<string>('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [copied, setCopied] = useState(false);

  // Calculator state
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrevValue, setCalcPrevValue] = useState<number | null>(null);
  const [calcOperator, setCalcOperator] = useState<string | null>(null);
  const [calcWaitingForOperand, setCalcWaitingForOperand] = useState(false);
  const [calcHistory, setCalcHistory] = useState<{ expression: string; result: string }[]>([]);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [loadingRates, setLoadingRates] = useState(false);

  const fetchRates = async () => {
    setLoadingRates(true);
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
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
    const val = parseFloat(fromValue);
    if (isNaN(val)) {
      setToValue('');
      return;
    }

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
    // Reset units when category changes
    const defaultUnits = CATEGORIES[category].units;
    setFromUnit(defaultUnits[0].value);
    setToUnit(defaultUnits[defaultUnits.length > 1 ? 1 : 0].value);
  }, [category]);

  const handleCopy = () => {
    navigator.clipboard.writeText(toValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    setFromValue(toValue);
  };

  // Calculator Logic
  const inputDigit = (digit: string) => {
    if (calcWaitingForOperand) {
      setCalcDisplay(digit);
      setCalcWaitingForOperand(false);
    } else {
      setCalcDisplay(calcDisplay === '0' ? digit : calcDisplay + digit);
    }
  };

  const inputDot = () => {
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
    setCalcDisplay('0');
    setCalcPrevValue(null);
    setCalcOperator(null);
    setCalcWaitingForOperand(false);
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(calcDisplay);

    if (calcPrevValue === null) {
      setCalcPrevValue(inputValue);
    } else if (calcOperator) {
      const currentValue = calcPrevValue || 0;
      const newValue = calculate(currentValue, inputValue, calcOperator);
      
      if (nextOperator === '=') {
        setCalcHistory(prev => [{
          expression: `${currentValue} ${calcOperator} ${inputValue}`,
          result: String(newValue)
        }, ...prev].slice(0, 10));
      }
      
      setCalcPrevValue(newValue);
      setCalcDisplay(String(newValue));
    }

    setCalcWaitingForOperand(true);
    setCalcOperator(nextOperator);
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
    setFromValue(calcDisplay);
    setShowCalculator(false);
  };

  // Voice Assistant Logic
  const toggleVoice = async () => {
    if (isVoiceActive) {
      setIsVoiceActive(false);
      setIsListening(false);
      setVoiceStatus('Idle');
      return;
    }

    try {
      setIsVoiceActive(true);
      setVoiceStatus('Connecting...');
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: SAMPLE_RATE });
      
      // Setup playback
      let nextStartTime = 0;
      const playAudio = (base64Data: string) => {
        const binary = atob(base64Data);
        const len = binary.length;
        const bytes = new Int16Array(len / 2);
        for (let i = 0; i < len; i += 2) {
          bytes[i / 2] = (binary.charCodeAt(i + 1) << 8) | binary.charCodeAt(i);
        }
        
        const float32Data = new Float32Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) {
          float32Data[i] = bytes[i] / 32768;
        }
        
        const buffer = audioContext.createBuffer(1, float32Data.length, SAMPLE_RATE);
        buffer.copyToChannel(float32Data, 0);
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        
        const startTime = Math.max(audioContext.currentTime, nextStartTime);
        source.start(startTime);
        nextStartTime = startTime + buffer.duration;
      };

      const session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "You are a helpful voice assistant for a unit converter app. Help users with conversions, math, and general questions. Keep responses concise and friendly. You can hear the user and respond with voice.",
        },
        callbacks: {
          onopen: () => {
            setVoiceStatus('Ready');
            setIsListening(true);
            
            // Start recording
            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
              const source = audioContext.createMediaStreamSource(stream);
              const processor = audioContext.createScriptProcessor(CHUNK_SIZE, 1, 1);
              
              source.connect(processor);
              processor.connect(audioContext.destination);
              
              processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmData = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                  pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
                }
                
                const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
                session.sendRealtimeInput({
                  audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
                });
              };

              // Store cleanup
              (window as any)._voiceCleanup = () => {
                stream.getTracks().forEach(t => t.stop());
                processor.disconnect();
                source.disconnect();
                audioContext.close();
                session.close();
              };
            });
          },
          onmessage: (message) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              playAudio(base64Audio);
            }
            if (message.serverContent?.interrupted) {
              // Handle interruption if needed
            }
          },
          onclose: () => {
            setIsVoiceActive(false);
            setIsListening(false);
            setVoiceStatus('Idle');
          },
          onerror: (err) => {
            console.error('Voice Error:', err);
            setIsVoiceActive(false);
            setIsListening(false);
            setVoiceStatus('Error');
          }
        }
      });

    } catch (error) {
      console.error('Failed to start voice:', error);
      setIsVoiceActive(false);
      setVoiceStatus('Failed');
    }
  };

  useEffect(() => {
    return () => {
      if ((window as any)._voiceCleanup) {
        (window as any)._voiceCleanup();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
      >
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-semibold tracking-tight">Converter</h1>
            <div className="flex gap-2">
              <button 
                onClick={toggleVoice}
                className={`p-2 rounded-xl transition-all ${isVoiceActive ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                title="Voice Assistant"
              >
                {isVoiceActive ? <Mic size={20} /> : <MicOff size={20} />}
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
            {isVoiceActive && (
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                {voiceStatus}
              </div>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex p-2 bg-slate-100 gap-1">
          {(Object.keys(CATEGORIES) as Category[]).map((cat) => {
            const Icon = CATEGORIES[cat].icon;
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-1 flex flex-col items-center py-3 px-1 rounded-2xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-200/50'
                }`}
              >
                <Icon size={20} className="mb-1" />
                <span className="text-[10px] font-medium uppercase tracking-wider">{cat}</span>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {!showCalculator ? (
              <motion.div
                key="converter"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 space-y-6"
              >
                {/* From Section */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">From</label>
                    <Tooltip text={CATEGORIES[category].units.find(u => u.value === fromUnit)?.description || ''} />
                  </div>
                  <div className="relative group">
                    <input
                      type="number"
                      value={fromValue}
                      onChange={(e) => setFromValue(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl px-4 py-4 text-2xl font-semibold outline-none transition-all"
                      placeholder="0"
                    />
                    <div className="absolute right-2 top-2 bottom-2 w-40">
                      <select
                        value={fromUnit}
                        onChange={(e) => setFromUnit(e.target.value)}
                        className="w-full h-full bg-white border border-slate-200 rounded-xl px-3 text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        {CATEGORIES[category].units.map((u) => (
                          <option key={u.value} value={u.value}>{u.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center -my-3 relative z-10">
                  <button 
                    onClick={swapUnits}
                    className="bg-white border border-slate-200 p-3 rounded-full text-slate-400 hover:text-blue-500 hover:border-blue-200 shadow-sm transition-all active:scale-95"
                  >
                    <ArrowRightLeft size={18} />
                  </button>
                </div>

                {/* To Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">To</label>
                      <Tooltip text={CATEGORIES[category].units.find(u => u.value === toUnit)?.description || ''} />
                    </div>
                    {category === 'Currency' && (
                      <button 
                        onClick={fetchRates}
                        className="text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-600 transition-colors flex items-center gap-1"
                        disabled={loadingRates}
                      >
                        {loadingRates ? <Loader2 size={10} className="animate-spin" /> : 'Refresh Rates'}
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <input
                      type="text"
                      readOnly
                      value={toValue}
                      className="w-full bg-blue-50/50 border-2 border-transparent rounded-2xl px-4 py-4 text-2xl font-semibold text-blue-700 outline-none"
                      placeholder="0"
                    />
                    <div className="absolute right-2 top-2 bottom-2 w-40">
                      <select
                        value={toUnit}
                        onChange={(e) => setToUnit(e.target.value)}
                        className="w-full h-full bg-white border border-slate-200 rounded-xl px-3 text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        {CATEGORIES[category].units.map((u) => (
                          <option key={u.value} value={u.value}>{u.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4">
                  <button
                    onClick={handleCopy}
                    disabled={!toValue}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {copied ? (
                      <>
                        <Check size={18} className="text-green-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        <span>Copy Result</span>
                      </>
                    )}
                  </button>
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
                <div className="bg-slate-900 rounded-2xl p-4 mb-4 text-right">
                  <div className="text-slate-500 text-xs h-4 mb-1">
                    {calcPrevValue !== null ? `${calcPrevValue} ${calcOperator || ''}` : ''}
                  </div>
                  <div className="text-white text-3xl font-mono font-bold truncate">
                    {calcDisplay}
                  </div>
                </div>

                {calcHistory.length > 0 && (
                  <div className="mb-4 space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      <History size={10} />
                      History
                    </div>
                    {calcHistory.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCalcDisplay(item.result);
                          setCalcWaitingForOperand(true);
                        }}
                        className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                      >
                        <div className="text-[10px] text-slate-400 group-hover:text-slate-500">{item.expression} =</div>
                        <div className="text-sm font-mono font-bold text-slate-700 group-hover:text-blue-600">{item.result}</div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-4 gap-2">
                  <button onClick={clearCalc} className="col-span-2 bg-red-50 text-red-600 py-4 rounded-xl font-bold hover:bg-red-100 transition-colors">AC</button>
                  <button onClick={() => setCalcDisplay(calcDisplay.slice(0, -1) || '0')} className="bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center"><Delete size={18} /></button>
                  <button onClick={() => performOperation('/')} className="bg-blue-50 text-blue-600 py-4 rounded-xl font-bold hover:bg-blue-100 transition-colors flex items-center justify-center"><Divide size={18} /></button>
                  
                  {[7, 8, 9].map(n => (
                    <button key={n} onClick={() => inputDigit(String(n))} className="bg-slate-50 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors">{n}</button>
                  ))}
                  <button onClick={() => performOperation('*')} className="bg-blue-50 text-blue-600 py-4 rounded-xl font-bold hover:bg-blue-100 transition-colors flex items-center justify-center"><X size={18} /></button>
                  
                  {[4, 5, 6].map(n => (
                    <button key={n} onClick={() => inputDigit(String(n))} className="bg-slate-50 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors">{n}</button>
                  ))}
                  <button onClick={() => performOperation('-')} className="bg-blue-50 text-blue-600 py-4 rounded-xl font-bold hover:bg-blue-100 transition-colors flex items-center justify-center"><Minus size={18} /></button>
                  
                  {[1, 2, 3].map(n => (
                    <button key={n} onClick={() => inputDigit(String(n))} className="bg-slate-50 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors">{n}</button>
                  ))}
                  <button onClick={() => performOperation('+')} className="bg-blue-50 text-blue-600 py-4 rounded-xl font-bold hover:bg-blue-100 transition-colors flex items-center justify-center"><Plus size={18} /></button>
                  
                  <button onClick={() => inputDigit('0')} className="col-span-2 bg-slate-50 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors">0</button>
                  <button onClick={inputDot} className="bg-slate-50 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors">.</button>
                  <button onClick={() => performOperation('=')} className="bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center shadow-lg shadow-blue-200"><Equal size={18} /></button>
                </div>

                <button
                  onClick={handleUseInConverter}
                  className="w-full mt-4 bg-slate-900 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                >
                  Use in Converter
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            Universal Metric Converter & Calculator
          </p>
        </div>
      </motion.div>
    </div>
  );
}
