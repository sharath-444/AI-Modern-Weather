
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Wind, Droplets, Thermometer, Calendar,
  History, Loader2, RefreshCw, Cloud, Volume2, ShieldCheck,
  Music, Lightbulb, Clock, Sun, Moon, X, Trash2
} from 'lucide-react';
import { WeatherData, WeatherTheme } from './types';
import { fetchWeatherByCity } from './services/geminiWeather';
import { THEME_CONFIG } from './constants';
import { AnimatedWeatherIcon } from './components/AnimatedWeatherIcon';
import { ForecastCard } from './components/ForecastCard';
import { PremiumBackground } from './components/PremiumBackground';
import { CountUp } from './components/CountUp';

const App: React.FC = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [theme, setTheme] = useState<WeatherTheme>(WeatherTheme.DEFAULT);

  const handleSearch = useCallback(async (searchCity?: string) => {
    const query = searchCity || city;
    if (!query) return;

    setLoading(true);
    setError(null);

    // Safety timeout to prevent infinite loading state
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError("The request is taking too long. Please try again.");
      }
    }, 15000);

    try {
      const data = await fetchWeatherByCity(query);
      clearTimeout(timeoutId);

      setWeather(data);

      // Update history
      const updatedHistory = [data.city, ...searchHistory.filter(c => c.toLowerCase() !== data.city.toLowerCase())].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('skycast_history', JSON.stringify(updatedHistory));
      localStorage.setItem('skycast_last_city', data.city);

      const cond = data.condition.toLowerCase();
      if (!data.isDay) setTheme(WeatherTheme.NIGHT);
      else if (cond.includes('clear')) setTheme(WeatherTheme.CLEAR);
      else if (cond.includes('rain')) setTheme(WeatherTheme.RAIN);
      else if (cond.includes('cloud')) setTheme(WeatherTheme.CLOUDS);
      else if (cond.includes('snow')) setTheme(WeatherTheme.SNOW);
      else if (cond.includes('storm')) setTheme(WeatherTheme.STORM);
      else setTheme(WeatherTheme.DEFAULT);

      setCity('');
    } catch (err: any) {
      clearTimeout(timeoutId);
      setError(err.message || "Failed to fetch weather.");
    } finally {
      setLoading(false);
    }
  }, [city, searchHistory, loading]);

  useEffect(() => {
    const saved = localStorage.getItem('skycast_history');
    const lastCity = localStorage.getItem('skycast_last_city');
    if (saved) setSearchHistory(JSON.parse(saved));

    // Auto-load last city or default to London
    handleSearch(lastCity || 'London');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('skycast_history');
  };

  const speakSummary = () => {
    if (!weather) return;
    window.speechSynthesis.cancel();
    const text = `Weather in ${weather.city}: ${weather.condition}, ${Math.round(weather.temperature)} degrees. ${weather.tips[0]}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const getAqiColor = (aqi: number) => {
    if (aqi < 50) return 'text-green-400';
    if (aqi < 100) return 'text-yellow-400';
    if (aqi < 150) return 'text-orange-400';
    return 'text-red-400';
  };

  const config = THEME_CONFIG[theme] || THEME_CONFIG[WeatherTheme.DEFAULT];

  return (
    <div className={`min-h-screen transition-all duration-1000 bg-[#020617] flex flex-col items-center p-4 md:p-8 overflow-y-auto relative selection:bg-white/30`}>
      <PremiumBackground theme={theme} />

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-4xl z-20 flex flex-col md:flex-row gap-3 mb-6"
      >
        <div className="relative flex-1 group">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for a city..."
            className="w-full h-14 pl-12 pr-12 rounded-2xl glass text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-lg"
          />
          <Search className="absolute left-4 top-4 text-white/70 group-focus-within:text-white transition-colors" />
          {city && (
            <button onClick={() => setCity('')} className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSearch()}
            disabled={loading}
            className="h-12 px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold flex items-center justify-center transition-all disabled:opacity-50 backdrop-blur-md border border-white/5"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Search'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((p) => {
                  handleSearch(`coordinates ${p.coords.latitude}, ${p.coords.longitude}`);
                }, () => setError("Location access denied."));
              }
            }}
            className="h-12 w-12 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center justify-center transition-all backdrop-blur-md border border-white/5"
          >
            <MapPin size={20} />
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-24 z-10"
          >
            <RefreshCw size={100} className="text-white/20 animate-spin-slow mb-8" />
            <p className="text-white text-2xl font-light tracking-widest animate-pulse">SYNCHRONIZING...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-dark p-10 rounded-[3rem] text-center max-w-md w-full z-10 border-red-500/20"
          >
            <Cloud size={48} className="text-red-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3">
              {error === 'City not found' ? 'City Not Found' : 'Atmospheric Interference'}
            </h3>
            <p className="text-white/60 mb-8 leading-relaxed">
              {error === 'City not found'
                ? `We couldn't locate "${city || 'the target'}". Please check the spelling or try a larger city.`
                : error}
            </p>
            <button onClick={() => handleSearch('London')} className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all border border-white/10">
              Try London
            </button>
          </motion.div>
        ) : weather ? (
          <motion.div
            key="weather"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-5 z-10 pb-12"
          >
            {/* Main Weather Display */}
            <div className="lg:col-span-8 glass p-6 md:p-10 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between min-h-[450px] shadow-2xl border border-white/5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{weather.city}</h2>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border border-emerald-500/10 flex items-center gap-1">
                      <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                      Live AI
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-black text-white/70">{weather.localTime}</span>
                    <span className="bg-cyan-500/10 px-3 py-1 rounded-full text-[10px] font-black text-cyan-400 uppercase">{weather.isDay ? 'Day' : 'Night'}</span>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} onClick={speakSummary} className="bg-white/10 p-5 rounded-full text-white backdrop-blur-xl border border-white/20">
                  <Volume2 size={28} />
                </motion.button>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8 my-8">
                <AnimatedWeatherIcon condition={weather.condition} size={150} />
                <div className="text-center md:text-left flex items-baseline">
                  <CountUp value={weather.temperature} className="text-[5rem] md:text-[8rem] font-black text-white leading-none tracking-tighter" suffix="°" />
                  <div className="ml-6 border-lborder-white/10 pl-6">
                    <span className="text-2xl md:text-3xl font-black text-white leading-tight uppercase tracking-tight">{weather.condition}</span>
                    <p className="text-white/50 text-base font-medium italic mt-1">"{weather.description}"</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Wind', value: weather.windSpeed, icon: <Wind size={16} />, unit: ' km/h' },
                  { label: 'Humidity', value: weather.humidity, icon: <Droplets size={16} />, unit: '%' },
                  { label: 'Feels', value: weather.feelsLike, icon: <Thermometer size={16} />, unit: '°' },
                  { label: 'AQI', value: weather.aqi, icon: <ShieldCheck size={16} />, unit: '', color: getAqiColor(weather.aqi) }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-[1.5rem] flex flex-col items-center justify-center border border-white/5 backdrop-blur-sm">
                    <div className="text-white/30 mb-1">{stat.icon}</div>
                    <div className={`text-xl font-black ${stat.color || 'text-white'}`}>
                      <CountUp value={stat.value} suffix={stat.unit} />
                    </div>
                    <span className="text-[9px] uppercase font-black text-white/20 tracking-widest mt-0.5">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-5">
              <div className="glass p-6 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-white/0 border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-400/10 rounded-2xl text-yellow-400"><Lightbulb size={20} /></div>
                  <h4 className="text-white font-black text-lg">AI Insights</h4>
                </div>
                <div className="space-y-4">
                  {weather.tips.map((tip, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/40 mt-1.5 flex-shrink-0" />
                      <p className="text-white/70 text-xs font-medium leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-300">
                    <Music size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] text-white/30 font-black uppercase tracking-widest leading-none mb-1">Atmosphere</p>
                    <p className="text-white font-black text-base">{weather.musicMood}</p>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-[2.5rem] flex-1 border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-white font-black flex items-center gap-3 uppercase text-[10px] tracking-widest opacity-30">
                    <History size={14} /> History
                  </h4>
                  {searchHistory.length > 0 && <button onClick={clearHistory} className="text-white/20 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>}
                </div>
                <div className="flex flex-col gap-2">
                  {searchHistory.map((h, i) => (
                    <button key={i} onClick={() => handleSearch(h)} className="text-left text-white/60 py-3 px-4 rounded-xl hover:text-white transition-all flex items-center justify-between group backdrop-blur-sm border border-transparent hover:border-white/5 hover:bg-white/5">
                      <span className="font-bold text-sm">{h}</span>
                      <Search size={12} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-12 mt-6">
              <h3 className="text-xl font-black text-white/40 mb-6 flex items-center gap-3 tracking-widest uppercase text-xs">
                <Calendar size={18} />
                5-Day Analytics
              </h3>
              <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
                {weather.forecast.map((day, idx) => (
                  <ForecastCard key={idx} day={day} index={idx} />
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <style>{`
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
