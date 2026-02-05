
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData } from "../types";

export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  // Instantiate inside the function to ensure fresh API key state
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Act as an expert meteorologist. Get the current weather and a 5-day forecast for ${city}. 
  Return ONLY a valid JSON object.
  
  Fields to include: 
  - city, country
  - temperature (Celsius)
  - condition (One word: Clear, Clouds, Rain, Snow, or Storm)
  - description (Short poetic description)
  - high, low (Int)
  - humidity (%), windSpeed (km/h), feelsLike
  - sunrise, sunset (HH:mm format)
  - aqi (1 to 500 scale)
  - aqiStatus (e.g., "Good", "Fair", "Polluted")
  - localTime (HH:mm)
  - isDay (Boolean)
  - tips (Array of 3 strings)
  - musicMood (A genre)
  - forecast (Array of 5 objects: {day: string, temp: number, condition: string})`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        // Removed googleSearch as it can conflict with responseMimeType: application/json 
        // and cause formatting errors or excessive latency.
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            city: { type: Type.STRING },
            country: { type: Type.STRING },
            temperature: { type: Type.NUMBER },
            condition: { type: Type.STRING },
            description: { type: Type.STRING },
            high: { type: Type.NUMBER },
            low: { type: Type.NUMBER },
            humidity: { type: Type.NUMBER },
            windSpeed: { type: Type.NUMBER },
            feelsLike: { type: Type.NUMBER },
            sunrise: { type: Type.STRING },
            sunset: { type: Type.STRING },
            aqi: { type: Type.NUMBER },
            aqiStatus: { type: Type.STRING },
            localTime: { type: Type.STRING },
            isDay: { type: Type.BOOLEAN },
            musicMood: { type: Type.STRING },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            forecast: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  temp: { type: Type.NUMBER },
                  condition: { type: Type.STRING },
                },
                required: ["day", "temp", "condition"]
              }
            }
          },
          required: ["city", "country", "temperature", "condition", "forecast", "aqi", "isDay", "localTime", "tips", "musicMood"]
        }
      }
    });

    const jsonStr = response.text?.trim() || "{}";
    const data = JSON.parse(jsonStr);
    
    return {
      ...data,
      lastUpdated: new Date().toLocaleTimeString(),
    };
  } catch (error) {
    console.error("Gemini Weather Error:", error);
    throw new Error(`Unable to reach the atmosphere in "${city}". Please check your connection or city name.`);
  }
};
