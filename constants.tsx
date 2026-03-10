
import React from 'react';
import { Sun, Cloud, CloudRain, Snowflake, CloudLightning, Moon, CloudSun } from 'lucide-react';
import { WeatherTheme } from './types';

export const THEME_CONFIG = {
  [WeatherTheme.CLEAR]: {
    bg: 'from-blue-400 via-blue-500 to-yellow-200',
    icon: <Sun className="text-yellow-400" size={64} />,
    color: 'text-yellow-100'
  },
  [WeatherTheme.CLOUDS]: {
    bg: 'from-gray-400 via-blue-300 to-gray-200',
    icon: <Cloud className="text-gray-100" size={64} />,
    color: 'text-gray-100'
  },
  [WeatherTheme.RAIN]: {
    bg: 'from-blue-700 via-blue-600 to-gray-600',
    icon: <CloudRain className="text-blue-200" size={64} />,
    color: 'text-blue-100'
  },
  [WeatherTheme.SNOW]: {
    bg: 'from-blue-100 via-blue-200 to-white',
    icon: <Snowflake className="text-blue-300" size={64} />,
    color: 'text-blue-800'
  },
  [WeatherTheme.STORM]: {
    bg: 'from-indigo-900 via-purple-900 to-gray-900',
    icon: <CloudLightning className="text-yellow-300" size={64} />,
    color: 'text-purple-100'
  },
  [WeatherTheme.NIGHT]: {
    bg: 'from-slate-900 via-blue-900 to-indigo-900',
    icon: <Moon className="text-blue-100" size={64} />,
    color: 'text-blue-100'
  },
  [WeatherTheme.DEFAULT]: {
    bg: 'from-sky-400 via-blue-500 to-indigo-600',
    icon: <CloudSun className="text-white" size={64} />,
    color: 'text-white'
  }
};
