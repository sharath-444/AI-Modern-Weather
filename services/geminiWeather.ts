
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData } from "../types";

export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  // Instantiate inside the function to ensure fresh API key state
  const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;

  // MOCK MODE: If no key is provided, return high-quality mock data for testing
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY' || apiKey === 'DEVELOPMENT_MOCK') {
    console.warn("Using SkyCast Mock Data (No API Key detected)");
    return getMockWeatherData(city);
  }

  const ai = new GoogleGenAI({ apiKey });

  // Hyper-specific prompt to force real-time accuracy and weather-matched insights
  const prompt = `CRITICAL: SEARCH GOOGLE for the ACTUAL CURRENT weather and EXACT 5-day forecast for ${city} (Today's Date: ${new Date().toDateString()}).
  
  Once you have the real-time data:
  1. Populate the city and current conditions accurately.
  2. Generate 3 "tips" (AI Insights) strictly relevant to the current weather in ${city}. (e.g., if it's storming, suggest staying indoors; if it's hot, suggest hydration).
  3. Select a "musicMood" genre that perfectly fits the current atmospheric vibe (e.g., "Chill Lofi" for clouds, "High-Energy Synth" for clear heat).
  
  If "${city}" is NOT a real location or weather cannot be found, return: {"error": "City not found"}.
  
  Return a valid HTML-free JSON object matching this schema: 
  {
    "city": "Full Name",
    "country": "Country",
    "temperature": 25,
    "condition": "Clear | Clouds | Rain | Snow | Storm",
    "description": "Short poetic description",
    "high": 27, "low": 20,
    "humidity": 60, "windSpeed": 15, "feelsLike": 26,
    "sunrise": "HH:MM", "sunset": "HH:MM",
    "aqi": 50, "aqiStatus": "Good",
    "localTime": "HH:MM",
    "isDay": true,
    "tips": ["Insight 1", "Insight 2", "Insight 3"],
    "musicMood": "Atmospheric Genre",
    "forecast": [
       {"day": "DayName", "temp": 24, "condition": "Clear"},
       {"day": "DayName", "temp": 22, "condition": "Clouds"},
       {"day": "DayName", "temp": 23, "condition": "Rain"},
       {"day": "DayName", "temp": 21, "condition": "Clouds"},
       {"day": "DayName", "temp": 25, "condition": "Clear"}
    ]
  }`;

  try {
    // Standardizing the grounding call for v1.x of @google/genai
    const response = await (ai.models as any).generateContent({
      model: "gemini-1.5-flash-latest",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      tools: [{ googleSearch: {} }],
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text?.() || response.response?.text?.() || "{}";
    const data = JSON.parse(responseText.trim());

    if (data.error === "City not found" || !data.city) {
      throw new Error("City not found");
    }

    return {
      ...data,
      lastUpdated: new Date().toLocaleTimeString(),
    };
  } catch (error: any) {
    if (error.message === "City not found") throw error;
    console.error("Gemini Weather Error:", error);
    return getMockWeatherData(city);
  }
};

// High-quality mock data generator for development
const getMockWeatherData = (city: string): WeatherData => {
  const conditions = ['Clear', 'Clouds', 'Rain', 'Storm', 'Snow'];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];

  return {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    country: "World",
    temperature: 22 + Math.floor(Math.random() * 10),
    condition: condition,
    description: `A mysterious and atmospheric ${condition.toLowerCase()} day in ${city}.`,
    high: 28,
    low: 18,
    humidity: 65,
    windSpeed: 12,
    feelsLike: 24,
    sunrise: "06:20",
    sunset: "18:45",
    aqi: 42,
    aqiStatus: "Good",
    localTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isDay: true,
    tips: [
      "AI suggests carrying an umbrella just in case.",
      "Perfect lighting for architectural photography.",
      "Atmospheric pressure is stabilizing."
    ],
    musicMood: "Synthwave / Lo-fi Beats",
    forecast: [
      { day: "Mon", temp: 24, condition: "Clear" },
      { day: "Tue", temp: 22, condition: "Clouds" },
      { day: "Wed", temp: 19, condition: "Rain" },
      { day: "Thu", temp: 21, condition: "Clouds" },
      { day: "Fri", temp: 25, condition: "Clear" },
    ],
    lastUpdated: new Date().toLocaleTimeString(),
  };
};
