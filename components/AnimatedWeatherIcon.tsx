
import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, Snowflake, CloudLightning, Moon, CloudSun } from 'lucide-react';
import { WeatherTheme } from '../types';

interface Props {
  condition: string;
  size?: number;
}

export const AnimatedWeatherIcon: React.FC<Props> = ({ condition, size = 64 }) => {
  const cond = condition.toLowerCase();
  
  const iconProps = {
    size,
    strokeWidth: 1.5,
  };

  if (cond.includes('clear')) {
    return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Sun {...iconProps} className="text-yellow-400" />
      </motion.div>
    );
  }

  if (cond.includes('cloud')) {
    return (
      <motion.div
        animate={{ x: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {cond.includes('sun') ? <CloudSun {...iconProps} className="text-gray-100" /> : <Cloud {...iconProps} className="text-gray-300" />}
      </motion.div>
    );
  }

  if (cond.includes('rain')) {
    return (
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <CloudRain {...iconProps} className="text-blue-400" />
      </motion.div>
    );
  }

  if (cond.includes('snow')) {
    return (
      <motion.div
        animate={{ opacity: [0.7, 1, 0.7], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Snowflake {...iconProps} className="text-blue-100" />
      </motion.div>
    );
  }

  if (cond.includes('storm')) {
    return (
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      >
        <CloudLightning {...iconProps} className="text-yellow-500" />
      </motion.div>
    );
  }

  return <Sun {...iconProps} className="text-yellow-400" />;
};
