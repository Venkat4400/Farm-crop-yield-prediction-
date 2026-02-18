import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface NDVIData {
  value: number;
  status: "poor" | "moderate" | "healthy";
  description: string;
  available: boolean;
}

export interface SoilMoistureData {
  value: number;
  level: "very_low" | "low" | "moderate" | "high";
  description: string;
  available: boolean;
}

export interface SatelliteData {
  ndvi: NDVIData;
  soilMoisture: SoilMoistureData;
  landSurfaceTemperature?: number;
  dataSource: string;
  timestamp: string;
  warnings: string[];
}

interface FetchParams {
  state: string;
  district?: string;
  season?: string;
  crop?: string;
  latitude?: number;
  longitude?: number;
}

export function useSatelliteData() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<SatelliteData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSatelliteData = async (params: FetchParams): Promise<SatelliteData | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await supabase.functions.invoke("get-satellite-data", {
        body: {
          state: params.state,
          district: params.district,
          season: params.season,
          crop: params.crop,
          latitude: params.latitude,
          longitude: params.longitude,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to fetch satellite data");
      }

      if (!response.data?.success) {
        throw new Error(response.data?.error || "Satellite data fetch failed");
      }

      const satelliteData = response.data.data as SatelliteData;
      setData(satelliteData);
      return satelliteData;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch satellite data";
      setError(message);
      console.error("Satellite data error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setData(null);
    setError(null);
  };

  return {
    fetchSatelliteData,
    isLoading,
    data,
    error,
    clearData,
  };
}
