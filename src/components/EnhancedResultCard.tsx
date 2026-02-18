import { TrendingUp, Wheat, Droplets, Thermometer, Target, Satellite, Leaf, AlertTriangle, Info, ShieldCheck, CheckCircle2, Lightbulb, DollarSign, CloudRain, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SatelliteData } from "@/hooks/useSatelliteData";
import type { ConfidenceBreakdown } from "@/lib/agronomicValidation";
import { ConfidenceBreakdownBar } from "./ConfidenceBreakdownBar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProfitClassification {
  profit: number;
  revenue: number;
  costPerHectare: number;
  profitCategory: string;
  profitLevel: "exultant" | "highly_profitable" | "good" | "mid" | "normal" | "bad" | "loss";
}

interface RootZoneMoisture {
  moisture: number;
  level: "very_low" | "low" | "moderate" | "high";
  isEstimated: boolean;
}

interface EnhancedResultCardProps {
  predictedYield: number;
  yieldRange?: { min: number; max: number };
  crop: string;
  confidence: number;
  confidenceBreakdown?: ConfidenceBreakdown;
  reliabilityStatus?: "High" | "Medium" | "Low";
  satelliteData?: SatelliteData | null;
  additionalInfo?: {
    temperature?: number;
    rainfall?: number;
    irrigationType?: string;
    optimalRange?: string;
    effectiveWater?: number;
    seasonalRainfall?: number;
    irrigationContribution?: number;
    waterSource?: string;
    isWaterEstimated?: boolean;
    rootZoneMoisture?: RootZoneMoisture;
  };
  warnings?: string[];
  recommendations?: string[];
  assumptions?: string[];
  yieldAdjustmentReason?: string;
  profitClassification?: ProfitClassification;
  label?: string; // "AI-assisted agricultural decision support"
  className?: string;
}

export function EnhancedResultCard({
  predictedYield,
  yieldRange,
  crop,
  confidence,
  confidenceBreakdown,
  reliabilityStatus,
  satelliteData,
  additionalInfo,
  warnings = [],
  recommendations = [],
  assumptions = [],
  yieldAdjustmentReason,
  profitClassification,
  label = "AI-assisted agricultural decision support",
  className,
}: EnhancedResultCardProps) {
  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return "text-primary";
    if (conf >= 65) return "text-accent";
    return "text-destructive";
  };

  const getConfidenceBg = (conf: number) => {
    if (conf >= 80) return "bg-primary/10";
    if (conf >= 65) return "bg-accent/10";
    return "bg-destructive/10";
  };

  const getNDVIHealthColor = (status?: string) => {
    switch (status) {
      case "healthy": return "text-primary";
      case "moderate": return "text-accent";
      case "poor": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getCropHealthSummary = (): { text: string; color: string } => {
    if (!satelliteData) {
      return { text: "No satellite data available", color: "text-muted-foreground" };
    }

    const ndviStatus = satelliteData.ndvi.status;
    const moistureLevel = satelliteData.soilMoisture.level;

    // CON-2: Healthy NDVI with low moisture = water-stressed
    if (ndviStatus === "healthy" && (moistureLevel === "low" || moistureLevel === "very_low")) {
      return { text: "Visually healthy but water-stressed - yield depends on water availability", color: "text-accent" };
    }
    if (ndviStatus === "healthy" && moistureLevel !== "low") {
      return { text: "Dense vegetation with adequate moisture", color: "text-primary" };
    }
    if (ndviStatus === "moderate" && moistureLevel === "moderate") {
      return { text: "Moderate vegetation - developing canopy", color: "text-accent" };
    }
    if (ndviStatus === "poor" || moistureLevel === "low" || moistureLevel === "very_low") {
      return { text: "Crop stress detected - consider intervention", color: "text-destructive" };
    }
    return { text: "Moderate conditions - monitor regularly", color: "text-accent" };
  };

  const healthSummary = getCropHealthSummary();

  // Calculate data reliability
  const hasNDVI = satelliteData?.ndvi.available ?? false;
  const hasSoilMoisture = satelliteData?.soilMoisture.available ?? false;
  const hasIrrigation = !!additionalInfo?.irrigationType || (additionalInfo?.rainfall && additionalInfo.rainfall > 0);
  
  const dataReliabilityScore = confidenceBreakdown 
    ? confidenceBreakdown.finalConfidence 
    : (
        (hasNDVI ? 30 : 0) +
        (hasSoilMoisture ? 30 : 0) +
        (hasIrrigation ? 20 : 0) +
        20 // Base score
      );

  const getReliabilityColor = (status?: string) => {
    switch (status) {
      case "High": return "text-primary bg-primary/10";
      case "Medium": return "text-accent bg-accent/10";
      case "Low": return "text-destructive bg-destructive/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getProfitColor = (level?: string) => {
    switch (level) {
      case "exultant":
      case "highly_profitable": return "text-primary bg-primary/10";
      case "good":
      case "mid": return "text-accent bg-accent/10";
      case "normal": return "text-foreground bg-muted";
      case "bad":
      case "loss": return "text-destructive bg-destructive/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5" />
      <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-accent/5" />

      <div className="relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Wheat className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Yield Prediction</h3>
              <p className="text-sm text-muted-foreground capitalize">{crop}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {satelliteData && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <Satellite className="h-3.5 w-3.5" />
                Satellite Enhanced
              </div>
            )}
            <span className="text-[10px] text-muted-foreground italic">{label}</span>
          </div>
        </div>

        {/* Main Result */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-foreground">
              {predictedYield.toLocaleString()}
            </span>
            <span className="text-lg text-muted-foreground">kg/hectare</span>
          </div>
          
          {/* Yield Range */}
          {yieldRange && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Expected range: </span>
              {yieldRange.min.toLocaleString()} – {yieldRange.max.toLocaleString()} kg/ha
            </div>
          )}
          
        {/* Confidence with visual breakdown */}
        <div className={cn("rounded-lg p-3 space-y-3", getConfidenceBg(confidence))}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className={cn("h-5 w-5", getConfidenceColor(confidence))} />
              <span className={cn("font-medium", getConfidenceColor(confidence))}>
                {confidence}% Confidence
              </span>
            </div>
            <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium", getReliabilityColor(reliabilityStatus))}>
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{reliabilityStatus || "Medium"}</span>
            </div>
          </div>
          
          {/* Visual Confidence Breakdown Bar */}
          {confidenceBreakdown && (
            <ConfidenceBreakdownBar
              baseConfidence={confidenceBreakdown.baseConfidence}
              ndviBonus={confidenceBreakdown.ndviBonus}
              soilMoistureBonus={confidenceBreakdown.soilMoistureBonus}
              irrigationBonus={confidenceBreakdown.irrigationBonus}
              agronomicPenalty={confidenceBreakdown.agronomicPenalty}
              estimationPenalty={confidenceBreakdown.estimationPenalty}
              finalConfidence={confidenceBreakdown.finalConfidence}
            />
          )}
        </div>

        {/* Yield Adjustment Reason */}
        {yieldAdjustmentReason && yieldAdjustmentReason !== "Standard conditions" && (
          <div className="rounded-lg bg-secondary/50 p-2 text-xs text-muted-foreground">
            <span className="font-medium">Yield adjusted: </span>{yieldAdjustmentReason}
          </div>
        )}
      </div>

        {/* Satellite Data Summary */}
        {satelliteData && (
          <div className="grid grid-cols-2 gap-3">
            {/* NDVI */}
            <div className="rounded-lg bg-muted/50 p-3 space-y-1">
              <div className="flex items-center gap-2">
                <Leaf className={cn("h-4 w-4", getNDVIHealthColor(satelliteData.ndvi.status))} />
                <span className="text-xs font-medium text-muted-foreground">NDVI</span>
              </div>
              <p className={cn("text-lg font-bold", getNDVIHealthColor(satelliteData.ndvi.status))}>
                {satelliteData.ndvi.value.toFixed(2)}
              </p>
              <p className={cn("text-xs capitalize", getNDVIHealthColor(satelliteData.ndvi.status))}>
                {satelliteData.ndvi.status} vegetation
              </p>
            </div>
            
            {/* Soil Moisture */}
            <div className="rounded-lg bg-muted/50 p-3 space-y-1">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Soil Moisture</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                {satelliteData.soilMoisture.value < 1 ? "<1%" : `${satelliteData.soilMoisture.value.toFixed(1)}%`}
              </p>
              <p className="text-xs text-muted-foreground">
                {satelliteData.soilMoisture.level === "very_low" 
                  ? "Very Low (satellite-estimated)" 
                  : `${satelliteData.soilMoisture.level.charAt(0).toUpperCase() + satelliteData.soilMoisture.level.slice(1)} level`}
              </p>
            </div>
          </div>
        )}

        {/* Crop Health Summary */}
        <div className="rounded-lg border border-border bg-secondary/30 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground text-sm">Crop Health Summary</span>
          </div>
          <p className={cn("text-sm", healthSummary.color)}>{healthSummary.text}</p>
        </div>

        {/* Profit Classification */}
        {profitClassification && (
          <div className={cn("rounded-lg p-3 space-y-2", getProfitColor(profitClassification.profitLevel))}>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium text-sm">Profit Classification</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="font-bold">₹{profitClassification.revenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cost</p>
                <p className="font-medium">₹{profitClassification.costPerHectare.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Profit</p>
                <p className={cn("font-bold", profitClassification.profit >= 0 ? "text-primary" : "text-destructive")}>
                  ₹{profitClassification.profit.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="font-bold">{profitClassification.profitCategory}</p>
              </div>
            </div>
          </div>
        )}

        {/* Seasonal Water Info */}
        {additionalInfo && (additionalInfo.seasonalRainfall !== undefined || additionalInfo.effectiveWater !== undefined) && (
          <div className="rounded-lg bg-muted/50 p-3 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <CloudRain className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground text-sm">Seasonal Water (4-Month)</span>
              {additionalInfo.isWaterEstimated && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600">Estimated</span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Rainfall</p>
                <p className="font-bold text-foreground">{additionalInfo.seasonalRainfall || 0}mm</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Irrigation</p>
                <p className="font-bold text-foreground">{additionalInfo.irrigationContribution || 0}mm</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-bold text-primary">{additionalInfo.effectiveWater || 0}mm</p>
              </div>
            </div>
            {additionalInfo.rootZoneMoisture && (
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <Waves className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Root-Zone Moisture (seasonal):</span>
                <span className="text-sm font-medium text-foreground">
                  {additionalInfo.rootZoneMoisture.moisture}% ({additionalInfo.rootZoneMoisture.level})
                </span>
              </div>
            )}
          </div>
        )}

        {/* Additional Info (Temperature, etc.) */}
        {additionalInfo && (additionalInfo.temperature || additionalInfo.irrigationType) && (
          <div className="grid grid-cols-3 gap-3 rounded-xl bg-muted/50 p-3">
            {additionalInfo.temperature && (
              <div className="space-y-1 text-center">
                <Thermometer className="mx-auto h-4 w-4 text-accent" />
                <p className="text-sm font-medium text-foreground">{additionalInfo.temperature}°C</p>
                <p className="text-xs text-muted-foreground">Temperature</p>
              </div>
            )}
            {additionalInfo.irrigationType && (
              <div className="space-y-1 text-center">
                <Waves className="mx-auto h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-foreground capitalize">{additionalInfo.irrigationType}</p>
                <p className="text-xs text-muted-foreground">Irrigation</p>
              </div>
            )}
            {additionalInfo.optimalRange && (
              <div className="space-y-1 text-center">
                <Target className="mx-auto h-4 w-4 text-chart-orange" />
                <p className="text-sm font-medium text-foreground">{additionalInfo.optimalRange}</p>
                <p className="text-xs text-muted-foreground">Optimal</p>
              </div>
            )}
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="font-medium text-amber-700 dark:text-amber-400 text-sm">Warnings & Advisories</span>
            </div>
            <ul className="space-y-1">
              {warnings.slice(0, 5).map((warning, idx) => (
                <li key={idx} className="text-xs text-amber-700 dark:text-amber-300">
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span className="font-medium text-primary text-sm">Recommendations</span>
            </div>
            <ul className="space-y-1">
              {recommendations.slice(0, 3).map((rec, idx) => (
                <li key={idx} className="text-xs text-foreground flex items-start gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Assumptions & Data Sources */}
        {assumptions.length > 0 && (
          <div className="rounded-lg border border-border bg-secondary/30 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-muted-foreground text-sm">Assumptions & Data Sources</span>
            </div>
            <ul className="space-y-1">
              {assumptions.slice(0, 4).map((assumption, idx) => (
                <li key={idx} className="text-xs text-muted-foreground">
                  • {assumption}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* MANDATORY DISCLAIMER */}
        <div className="rounded-lg bg-muted/50 p-3 space-y-2 border border-border">
          <p className="text-xs text-center text-muted-foreground font-medium">
            ⚠️ AI-Assisted Agricultural Decision Support
          </p>
          <p className="text-xs text-center text-muted-foreground">
            This prediction is for decision support only. Satellite-derived indicators have spatial and temporal uncertainty.
            Confidence reflects <span className="font-medium">data completeness</span>, not guaranteed accuracy.
          </p>
          <p className="text-xs text-center text-muted-foreground italic">
            Predictions do not replace professional agronomic advice. Profit estimates assume favorable conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
