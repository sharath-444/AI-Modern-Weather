
export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  description: string;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  sunrise: string;
  sunset: string;
  forecast: ForecastDay[];
  lastUpdated: string;
  // New fields
  aqi: number;
  aqiStatus: string;
  localTime: string;
  isDay: boolean;
  tips: string[];
  musicMood: string;
}

export interface ForecastDay {
  day: string;
  temp: number;
  condition: string;
}

export enum WeatherTheme {
  CLEAR = 'clear',
  CLOUDS = 'clouds',
  RAIN = 'rain',
  SNOW = 'snow',
  STORM = 'storm',
  NIGHT = 'night',
  DEFAULT = 'default'
}
