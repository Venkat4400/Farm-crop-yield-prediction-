import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CropRecommendation {
  name: string;
  confidence: number;
  expectedYield: string;
  season: string;
  reason: string;
  icon: string;
}

interface FertilizerRecommendation {
  nutrient: string;
  current: number;
  recommended: number;
  status: "low" | "optimal" | "high";
  tip: string;
}

interface RecommendationsData {
  cropRecommendations: CropRecommendation[];
  fertilizerRecommendations: FertilizerRecommendation[];
  actionItems: string[];
  context: {
    region: string;
    soilType: string;
    season: string;
    temperature: number;
    humidity: number;
    rainfall: number;
  };
}

interface RecommendationsInput {
  region?: string;
  soilType?: string;
  season?: string;
  temperature?: number;
  humidity?: number;
  rainfall?: number;
  currentCrop?: string;
}

export function useRecommendations() {
  const [data, setData] = useState<RecommendationsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async (input: RecommendationsInput = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: response, error: invokeError } = await supabase.functions.invoke("get-recommendations", {
        body: input,
      });

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      if (!response?.success) {
        throw new Error(response?.error || "Failed to get recommendations");
      }

      setData(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get recommendations";
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
    fetchRecommendations,
  };
}
