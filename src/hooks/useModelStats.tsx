import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ModelInfo {
  name: string;
  r2Score: number;
  mae: number;
  rmse: number;
  trainingSamples: number;
  lastTrained: string;
  isActive: boolean;
}

interface Stats {
  totalPredictions: number;
  todayPredictions: number;
  monthPredictions: number;
  avgYield: number;
  uniqueUsers: number;
  cropDistribution: Record<string, number>;
}

interface ModelStatsData {
  model: ModelInfo;
  stats: Stats;
}

export function useModelStats() {
  const [data, setData] = useState<ModelStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: response, error: invokeError } = await supabase.functions.invoke("get-model-stats", {
        body: {},
      });

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      if (!response?.success) {
        throw new Error(response?.error || "Failed to fetch model stats");
      }

      setData(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch model stats";
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
    fetchStats,
  };
}
