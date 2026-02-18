import { Satellite, Leaf, Droplets, ThermometerSun, AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SatelliteData } from "@/hooks/useSatelliteData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SatelliteDataCardProps {
  data: SatelliteData;
  className?: string;
}

export function SatelliteDataCard({ data, className }: SatelliteDataCardProps) {
  const { ndvi, soilMoisture, landSurfaceTemperature, warnings, dataSource, timestamp } = data;

  const getNDVIColor = (status: string) => {
    switch (status) {
      case "healthy": return "text-primary";
      case "moderate": return "text-accent";
      case "poor": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getNDVIBgColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-primary/10";
      case "moderate": return "bg-accent/10";
      case "poor": return "bg-destructive/10";
      default: return "bg-muted";
    }
  };

  const getMoistureColor = (level: string) => {
    switch (level) {
      case "high": return "text-primary";
      case "moderate": return "text-accent";
      case "low": return "text-destructive";
      case "very_low": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getMoistureBgColor = (level: string) => {
    switch (level) {
      case "high": return "bg-primary/10";
      case "moderate": return "bg-accent/10";
      case "low": return "bg-destructive/10";
      case "very_low": return "bg-destructive/10";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (available: boolean, isGood: boolean) => {
    if (!available) return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    if (isGood) return <CheckCircle className="h-4 w-4 text-primary" />;
    return <XCircle className="h-4 w-4 text-destructive" />;
  };

  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Satellite className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h4 className="font-medium text-foreground">Satellite Crop Assessment</h4>
          <p className="text-xs text-muted-foreground">{dataSource}</p>
        </div>
      </div>

      {/* NDVI Section */}
      <div className={cn("rounded-lg p-3 mb-3", getNDVIBgColor(ndvi.status))}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Leaf className={cn("h-5 w-5", getNDVIColor(ndvi.status))} />
            <span className="font-medium text-foreground">NDVI (Vegetation Index)</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Normalized Difference Vegetation Index measures crop health from satellite imagery</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {getStatusIcon(ndvi.available, ndvi.status === "healthy")}
        </div>
        <div className="flex items-baseline gap-2">
          <span className={cn("text-2xl font-bold", getNDVIColor(ndvi.status))}>
            {ndvi.value.toFixed(2)}
          </span>
          <span className={cn("text-sm font-medium capitalize", getNDVIColor(ndvi.status))}>
            {ndvi.status}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{ndvi.description}</p>
        
        {/* NDVI Scale */}
        <div className="mt-2 flex items-center gap-1">
          <div className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-destructive via-accent to-primary" />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
          <span>0.0 Bare</span>
          <span>0.2 Stressed</span>
          <span>0.4</span>
          <span>0.6+ Dense</span>
        </div>
      </div>

      {/* Soil Moisture Section */}
      <div className={cn("rounded-lg p-3 mb-3", getMoistureBgColor(soilMoisture.level))}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Droplets className={cn("h-5 w-5", getMoistureColor(soilMoisture.level))} />
            <span className="font-medium text-foreground">Soil Moisture</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Estimated root-zone soil moisture derived from satellite observations</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {getStatusIcon(soilMoisture.available, soilMoisture.level !== "low")}
        </div>
        <div className="flex items-baseline gap-2">
          <span className={cn("text-2xl font-bold", getMoistureColor(soilMoisture.level))}>
            {soilMoisture.value < 1 ? "<1%" : `${soilMoisture.value.toFixed(1)}%`}
          </span>
          <span className={cn("text-sm font-medium", getMoistureColor(soilMoisture.level))}>
            {soilMoisture.level === "very_low" ? "Very Low (satellite-estimated)" : soilMoisture.level.charAt(0).toUpperCase() + soilMoisture.level.slice(1)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{soilMoisture.description}</p>
      </div>

      {/* Land Surface Temperature */}
      {landSurfaceTemperature !== undefined && (
        <div className="rounded-lg p-3 mb-3 bg-secondary/50">
          <div className="flex items-center gap-2 mb-1">
            <ThermometerSun className="h-5 w-5 text-accent" />
            <span className="font-medium text-foreground">Land Surface Temp</span>
          </div>
          <span className="text-xl font-bold text-foreground">{landSurfaceTemperature}°C</span>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="font-medium text-amber-700 dark:text-amber-400">Warnings</span>
          </div>
          <ul className="space-y-1">
            {warnings.map((warning, idx) => (
              <li key={idx} className="text-xs text-amber-700 dark:text-amber-300">
                • {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Timestamp */}
      <p className="text-xs text-muted-foreground mt-3 text-center">
        Updated: {new Date(timestamp).toLocaleString()}
      </p>
    </div>
  );
}
