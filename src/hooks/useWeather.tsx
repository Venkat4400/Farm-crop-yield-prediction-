import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  pressure: number;
  condition: string;
  icon: string;
}

interface ForecastDay {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  precipitationProbability?: number;
  humidity: number;
  windSpeed?: number;
  condition: string;
  icon: string;
  isHistoricalBased?: boolean;
}

interface WeeklySummary {
  week: string;
  startDate: string;
  endDate: string;
  avgTempMax: number;
  avgTempMin: number;
  totalRain: number;
  rainyDays: number;
  avgHumidity: number;
}

interface WeatherStats {
  avgTemp: number;
  totalRainfall: number;
  humidityRange: string;
  farmingConditions: string;
  rainyDays?: number;
  heavyRainDays?: number;
}

interface Recommendation {
  title: string;
  description: string;
  type: "positive" | "info" | "warning";
}

interface WeatherData {
  region: string;
  coordinates?: { lat: number; lon: number };
  forecastDays: number;
  current: CurrentWeather;
  forecast: ForecastDay[];
  weeklySummary?: WeeklySummary[];
  stats: WeatherStats;
  recommendations: Recommendation[];
  note?: string;
}

export function useWeather() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (region: string = "north-india", lat?: number, lon?: number, days: number = 30) => {
    setIsLoading(true);
    setError(null);

    try {
      const body: { region: string; days: number; lat?: number; lon?: number } = { region, days };
      if (lat !== undefined && lon !== undefined) {
        body.lat = lat;
        body.lon = lon;
      }
      
      const { data: response, error: invokeError } = await supabase.functions.invoke("get-weather", {
        body,
      });

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      if (!response?.success) {
        throw new Error(response?.error || "Failed to fetch weather");
      }

      setData(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch weather";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchWeather,
  };
}
