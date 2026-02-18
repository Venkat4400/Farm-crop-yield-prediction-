/**
 * Mini Map Component for Location Visualization
 * Shows detected farm location on a simplified India map
 */

import { MapPin, Navigation, Mountain, Droplets, Sun, Trees } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DetectedLocation } from "@/hooks/useGPSLocation";

interface LocationMiniMapProps {
  location: DetectedLocation;
  className?: string;
}

const getLandTypeIcon = (landType: string) => {
  switch (landType) {
    case "coastal":
      return <Droplets className="h-3 w-3" />;
    case "hill":
      return <Mountain className="h-3 w-3" />;
    case "rainfed":
      return <Sun className="h-3 w-3" />;
    case "irrigated":
      return <Droplets className="h-3 w-3" />;
    case "plateau":
      return <Trees className="h-3 w-3" />;
    default:
      return <MapPin className="h-3 w-3" />;
  }
};

const getLandTypeColor = (landType: string) => {
  switch (landType) {
    case "coastal":
      return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
    case "hill":
      return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "rainfed":
      return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400";
    case "irrigated":
      return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400";
    case "plateau":
      return "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-900/30 dark:text-stone-400";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getValidationColor = (status: string) => {
  switch (status) {
    case "high":
      return "text-green-600";
    case "medium":
      return "text-amber-500";
    case "low":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
};

// Simplified India map SVG boundaries (approximate)
const INDIA_BOUNDS = {
  minLat: 8.0,
  maxLat: 37.0,
  minLon: 68.0,
  maxLon: 97.0,
};

// Convert lat/lon to SVG coordinates
function toSvgCoords(lat: number, lon: number): { x: number; y: number } {
  const x = ((lon - INDIA_BOUNDS.minLon) / (INDIA_BOUNDS.maxLon - INDIA_BOUNDS.minLon)) * 100;
  const y = ((INDIA_BOUNDS.maxLat - lat) / (INDIA_BOUNDS.maxLat - INDIA_BOUNDS.minLat)) * 100;
  return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
}

export function LocationMiniMap({ location, className }: LocationMiniMapProps) {
  const svgCoords = toSvgCoords(location.latitude, location.longitude);
  
  return (
    <div className={cn(
      "rounded-xl border bg-card p-4 space-y-3",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Detected Location</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge 
                variant="outline" 
                className={cn("text-xs", getValidationColor(location.validationStatus))}
              >
                {location.validationStatus === "high" ? "✓ Verified" : 
                 location.validationStatus === "medium" ? "~ Approximate" : "? Low Accuracy"}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{location.validationNote}</p>
              <p className="text-xs text-muted-foreground mt-1">
                GPS Accuracy: ±{Math.round(location.accuracy)}m
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Mini Map SVG */}
      <div className="relative bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg overflow-hidden border">
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-24"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Simplified India outline */}
          <path
            d="M25,10 Q35,8 45,12 L55,10 Q65,8 75,15 L78,25 Q80,35 75,45 L78,55 Q82,65 75,75 L70,85 Q65,90 55,92 L50,95 Q45,93 40,90 L35,85 Q30,80 28,70 L25,60 Q22,50 25,40 L23,30 Q20,20 25,10 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-muted-foreground/50"
          />
          
          {/* Location marker with pulse animation */}
          <circle
            cx={svgCoords.x}
            cy={svgCoords.y}
            r="8"
            className="fill-primary/20 animate-ping"
          />
          <circle
            cx={svgCoords.x}
            cy={svgCoords.y}
            r="4"
            className="fill-primary stroke-white stroke-2"
          />
          
          {/* Coordinates text */}
          <text
            x="50"
            y="98"
            textAnchor="middle"
            className="fill-muted-foreground text-[3px]"
          >
            {location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E
          </text>
        </svg>
      </div>
      
      {/* Location Details */}
      <div className="space-y-2">
        {/* Administrative Hierarchy */}
        <div className="flex items-start gap-2">
          <Navigation className="h-4 w-4 text-blue-500 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {location.village && `${location.village}, `}{location.district}
            </p>
            <p className="text-xs text-muted-foreground">
              {location.state} • {location.region}
            </p>
          </div>
        </div>
        
        {/* Characteristics Tags */}
        <div className="flex flex-wrap gap-1.5">
          {/* Land Type */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs capitalize", getLandTypeColor(location.characteristics.landType))}
                >
                  {getLandTypeIcon(location.characteristics.landType)}
                  <span className="ml-1">{location.characteristics.landType}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Land classification from LULC data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Elevation */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="text-xs">
                  <Mountain className="h-3 w-3 mr-1" />
                  {location.elevationEstimate}m
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Estimated elevation above sea level</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Category: {location.characteristics.elevationCategory}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Rainfall Zone */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="text-xs capitalize">
                  <Droplets className="h-3 w-3 mr-1" />
                  {location.characteristics.rainfallZone.replace("_", " ")}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>IMD rainfall zone classification</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Soil & ICAR Region */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Soil: {location.characteristics.soilGroup}</span>
          <span>•</span>
          <span>ICAR: {location.characteristics.icarRegion}</span>
        </div>
        
        {/* Weather Grid */}
        <div className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1">
          Weather Grid: {location.nearestWeatherGrid.lat}°N, {location.nearestWeatherGrid.lon}°E (5-10km resolution)
        </div>
      </div>
    </div>
  );
}
