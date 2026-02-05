
import React from 'react';
import { motion } from 'framer-motion';
import { WeatherTheme } from '../types';

interface Props {
  theme: WeatherTheme;
}

export const WeatherScene: React.FC<Props> = ({ theme }) => {
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const renderScene = () => {
    switch (theme) {
      case WeatherTheme.RAIN:
        return Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, x: Math.random() * 100 + '%' }}
            animate={{ y: '110vh' }}
            transition={{
              duration: 1 + Math.random(),
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2
            }}
            className="absolute w-[2px] h-8 bg-blue-300/30 blur-[1px]"
          />
        ));
      case WeatherTheme.SNOW:
        return Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, x: Math.random() * 100 + '%' }}
            animate={{ y: '110vh', rotate: 360 }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
            className="absolute w-2 h-2 bg-white rounded-full blur-[2px]"
          />
        ));
      case WeatherTheme.CLOUDS:
        return Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: -200, y: Math.random() * 60 + '%' }}
            animate={{ x: '110vw' }}
            transition={{
              duration: 20 + Math.random() * 30,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
            className="absolute w-64 h-32 bg-white/10 rounded-full blur-3xl"
          />
        ));
      case WeatherTheme.STORM:
        return (
          <motion.div
            animate={{ opacity: [0, 0, 0.5, 0, 0, 0.8, 0, 0] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.41, 0.45, 0.8, 0.81, 0.85, 1] }}
            className="absolute inset-0 bg-white/20"
          />
        );
      case WeatherTheme.CLEAR:
        return (
          <motion.div
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-400/10 rounded-full blur-[120px]"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div variants={containerVariants} animate="animate" className="relative w-full h-full">
        {renderScene()}
      </motion.div>
    </div>
  );
};
