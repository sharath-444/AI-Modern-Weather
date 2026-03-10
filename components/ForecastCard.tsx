
import React from 'react';
import { motion } from 'framer-motion';
import { ForecastDay } from '../types';
import { AnimatedWeatherIcon } from './AnimatedWeatherIcon';

interface Props {
  day: ForecastDay;
  index: number;
}

export const ForecastCard: React.FC<Props> = ({ day, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ y: -5, scale: 1.05 }}
      className="glass p-3 rounded-2xl flex flex-col items-center justify-between min-w-[85px] flex-1 border border-white/5"
    >
      <span className="text-white/50 text-[10px] font-black uppercase tracking-tight">{day.day}</span>
      <div className="my-1">
        <AnimatedWeatherIcon condition={day.condition} size={24} />
      </div>
      <span className="text-white text-base font-black">{Math.round(day.temp)}°</span>
    </motion.div>
  );
};
