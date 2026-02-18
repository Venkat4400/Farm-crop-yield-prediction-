import { TrendingUp, Wheat, Droplets, Thermometer, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  predictedYield: number;
  crop: string;
  confidence: number;
  additionalInfo?: {
    temperature?: number;
    rainfall?: number;
    optimalRange?: string;
  };
  className?: string;
}

export function ResultCard({
  predictedYield,
  crop,
  confidence,
  additionalInfo,
  className,
}: ResultCardProps) {
  const getConfidenceColor = (conf: number) => {
    if (conf >= 85) return "text-primary";
    if (conf >= 70) return "text-accent";
    return "text-destructive";
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-card",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5" />
      <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-accent/5" />

      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Wheat className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Yield Prediction</h3>
            <p className="text-sm text-muted-foreground capitalize">{crop}</p>
          </div>
        </div>

        {/* Main Result */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-foreground">
              {predictedYield.toLocaleString()}
            </span>
            <span className="text-lg text-muted-foreground">kg/hectare</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className={cn("h-5 w-5", getConfidenceColor(confidence))} />
            <span className={cn("font-medium", getConfidenceColor(confidence))}>
              {confidence}% confidence
            </span>
          </div>
        </div>

        {/* Additional Info */}
        {additionalInfo && (
          <div className="grid grid-cols-3 gap-4 rounded-xl bg-muted/50 p-4">
            {additionalInfo.temperature && (
              <div className="space-y-1 text-center">
                <Thermometer className="mx-auto h-5 w-5 text-accent" />
                <p className="text-sm font-medium text-foreground">{additionalInfo.temperature}°C</p>
                <p className="text-xs text-muted-foreground">Temperature</p>
              </div>
            )}
            {additionalInfo.rainfall && (
              <div className="space-y-1 text-center">
                <Droplets className="mx-auto h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-foreground">{additionalInfo.rainfall}mm</p>
                <p className="text-xs text-muted-foreground">Rainfall</p>
              </div>
            )}
            {additionalInfo.optimalRange && (
              <div className="space-y-1 text-center">
                <Target className="mx-auto h-5 w-5 text-chart-orange" />
                <p className="text-sm font-medium text-foreground">{additionalInfo.optimalRange}</p>
                <p className="text-xs text-muted-foreground">Optimal</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
