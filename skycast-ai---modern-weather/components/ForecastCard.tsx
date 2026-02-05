
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
      className="glass p-4 rounded-3xl flex flex-col items-center justify-between min-w-[100px] flex-1"
    >
      <span className="text-white/80 text-sm font-medium">{day.day}</span>
      <div className="my-2">
        <AnimatedWeatherIcon condition={day.condition} size={32} />
      </div>
      <span className="text-white text-lg font-bold">{Math.round(day.temp)}°</span>
    </motion.div>
  );
};
