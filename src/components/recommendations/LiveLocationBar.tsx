/**
 * Live Location Bar Component
 * Shows real-time GPS detection progress and live map
 */

import { useState } from "react";
import { 
  MapPin, Navigation, Crosshair, CheckCircle2, AlertTriangle, 
  Loader2, Upload, Edit3, RefreshCw, Signal, Satellite
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DetectedLocation, GPSDetectionState, GPSReading } from "@/hooks/useGPSLocation";

interface LiveLocationBarProps {
  location: DetectedLocation | null;
  detectionState: GPSDetectionState;
  readings: GPSReading[];
  isDetecting: boolean;
  onDetect: () => void;
  onExtractFromImage: (file: File) => void;
  onManualSet: (lat: number, lon: number) => void;
  onClear: () => void;
  className?: string;
}

// India map bounds
const INDIA_BOUNDS = {
  minLat: 8.0,
  maxLat: 37.0,
  minLon: 68.0,
  maxLon: 97.0,
};

function toSvgCoords(lat: number, lon: number): { x: number; y: number } {
  const x = ((lon - INDIA_BOUNDS.minLon) / (INDIA_BOUNDS.maxLon - INDIA_BOUNDS.minLon)) * 100;
  const y = ((INDIA_BOUNDS.maxLat - lat) / (INDIA_BOUNDS.maxLat - INDIA_BOUNDS.minLat)) * 100;
  return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
}

const statusIcons = {
  idle: MapPin,
  acquiring: Signal,
  stabilizing: Satellite,
  validating: Loader2,
  ready: CheckCircle2,
  error: AlertTriangle,
};

const statusColors = {
  idle: "text-muted-foreground",
  acquiring: "text-blue-500",
  stabilizing: "text-amber-500",
  validating: "text-primary",
  ready: "text-green-500",
  error: "text-destructive",
};

export function LiveLocationBar({
  location,
  detectionState,
  readings,
  isDetecting,
  onDetect,
  onExtractFromImage,
  onManualSet,
  onClear,
  className,
}: LiveLocationBarProps) {
  const [manualLat, setManualLat] = useState("");
  const [manualLon, setManualLon] = useState("");
  const [showManual, setShowManual] = useState(false);
  
  const StatusIcon = statusIcons[detectionState.status];
  const statusColor = statusColors[detectionState.status];
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onExtractFromImage(file);
    }
  };
  
  const handleManualSubmit = () => {
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);
    if (!isNaN(lat) && !isNaN(lon) && lat >= 6 && lat <= 38 && lon >= 68 && lon <= 98) {
      onManualSet(lat, lon);
      setShowManual(false);
      setManualLat("");
      setManualLon("");
    }
  };
  
  // Get current reading position for live tracking
  const currentReading = readings[readings.length - 1];
  const currentCoords = currentReading 
    ? toSvgCoords(currentReading.latitude, currentReading.longitude)
    : location 
      ? toSvgCoords(location.latitude, location.longitude)
      : null;

  return (
    <div className={cn(
      "rounded-xl border bg-card overflow-hidden",
      className
    )}>
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/5 to-primary/10 border-b">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-full bg-background",
            detectionState.status === "validating" && "animate-pulse"
          )}>
            <StatusIcon className={cn("h-4 w-4", statusColor, 
              detectionState.status === "validating" && "animate-spin"
            )} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {location ? (
                <>
                  {location.village && `${location.village}, `}
                  {location.district}
                </>
              ) : (
                "Location Not Set"
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {detectionState.message}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {location && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge 
                    variant={location.confidenceScore >= 80 ? "default" : "secondary"}
                    className={cn(
                      "text-xs",
                      location.confidenceScore >= 90 && "bg-green-500",
                      location.confidenceScore >= 80 && location.confidenceScore < 90 && "bg-blue-500",
                      location.confidenceScore < 80 && "bg-amber-500"
                    )}
                  >
                    {location.confidenceScore}%
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Confidence Score</p>
                  <p className="text-xs text-muted-foreground">
                    Accuracy: ±{Math.round(location.accuracy)}m | 
                    Readings: {location.readingsCount}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {!isDetecting && (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={onDetect}
                className="h-8"
              >
                <Crosshair className="h-3.5 w-3.5 mr-1" />
                {location ? "Re-detect" : "Detect GPS"}
              </Button>
              
              <Popover open={showManual} onOpenChange={setShowManual}>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 px-2">
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Manual Coordinates</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Latitude"
                        value={manualLat}
                        onChange={(e) => setManualLat(e.target.value)}
                        className="h-8 text-xs"
                      />
                      <Input
                        placeholder="Longitude"
                        value={manualLon}
                        onChange={(e) => setManualLon(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <Button size="sm" className="w-full h-8" onClick={handleManualSubmit}>
                      Set Location
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button size="sm" variant="ghost" className="h-8 px-2" asChild>
                  <span>
                    <Upload className="h-3.5 w-3.5" />
                  </span>
                </Button>
              </label>
              
              {location && (
                <Button size="sm" variant="ghost" className="h-8 px-2" onClick={onClear}>
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          )}
          
          {isDetecting && (
            <Button size="sm" variant="outline" disabled className="h-8">
              <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
              Detecting...
            </Button>
          )}
        </div>
      </div>
      
      {/* Progress Bar (during detection) */}
      {isDetecting && (
        <div className="px-4 py-2 bg-muted/30">
          <Progress value={detectionState.progress} className="h-1.5" />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-muted-foreground">
              {readings.length} readings collected
            </span>
            {currentReading && (
              <span className="text-[10px] text-muted-foreground">
                ±{Math.round(currentReading.accuracy)}m accuracy
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Mini Map (when location is available or detecting) */}
      {(location || (isDetecting && currentCoords)) && (
        <div className="relative h-20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Simplified India outline */}
            <path
              d="M25,10 Q35,8 45,12 L55,10 Q65,8 75,15 L78,25 Q80,35 75,45 L78,55 Q82,65 75,75 L70,85 Q65,90 55,92 L50,95 Q45,93 40,90 L35,85 Q30,80 28,70 L25,60 Q22,50 25,40 L23,30 Q20,20 25,10 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-muted-foreground/30"
            />
            
            {/* Grid lines */}
            {[20, 40, 60, 80].map((pos) => (
              <g key={pos}>
                <line x1={pos} y1="0" x2={pos} y2="100" stroke="currentColor" strokeWidth="0.2" className="text-muted-foreground/10" />
                <line x1="0" y1={pos} x2="100" y2={pos} stroke="currentColor" strokeWidth="0.2" className="text-muted-foreground/10" />
              </g>
            ))}
            
            {/* All readings (during detection) */}
            {readings.map((reading, i) => {
              const coords = toSvgCoords(reading.latitude, reading.longitude);
              return (
                <circle
                  key={i}
                  cx={coords.x}
                  cy={coords.y}
                  r="1.5"
                  className="fill-blue-400/50"
                />
              );
            })}
            
            {/* Current/Final location marker */}
            {currentCoords && (
              <>
                <circle
                  cx={currentCoords.x}
                  cy={currentCoords.y}
                  r={isDetecting ? "6" : "4"}
                  className={cn(
                    isDetecting ? "fill-blue-500/30 animate-ping" : "fill-primary/20"
                  )}
                />
                <circle
                  cx={currentCoords.x}
                  cy={currentCoords.y}
                  r={isDetecting ? "3" : "2.5"}
                  className={cn(
                    "stroke-white stroke-[0.5]",
                    isDetecting ? "fill-blue-500" : "fill-primary"
                  )}
                />
              </>
            )}
          </svg>
          
          {/* Coordinates overlay */}
          {location && (
            <div className="absolute bottom-1 left-2 right-2 flex justify-between items-center">
              <span className="text-[9px] text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded">
                {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
              </span>
              <span className="text-[9px] text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded">
                {location.state} • {location.region}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Location details (when confirmed) */}
      {location && location.confidenceScore >= 80 && !isDetecting && (
        <div className="px-4 py-2 border-t bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Navigation className="h-3 w-3" />
              {location.characteristics.landType}
            </span>
            <span>{location.characteristics.soilGroup}</span>
            <span>{location.characteristics.rainfallZone.replace("_", " ")}</span>
          </div>
          <Badge variant="outline" className="text-[10px]">
            {location.source === "gps" ? "📡 GPS" : location.source === "exif" ? "📷 EXIF" : "✏️ Manual"}
          </Badge>
        </div>
      )}
      
      {/* Manual correction prompt (low confidence) */}
      {location && location.confidenceScore < 80 && !isDetecting && (
        <div className="px-4 py-2 border-t bg-amber-50 dark:bg-amber-900/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Low confidence ({location.confidenceScore}%). Consider manual correction.</span>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-6 text-xs"
            onClick={() => setShowManual(true)}
          >
            Correct
          </Button>
        </div>
      )}
    </div>
  );
}
