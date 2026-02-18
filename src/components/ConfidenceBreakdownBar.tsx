import { cn } from "@/lib/utils";
import { Satellite, Droplets, Waves, AlertTriangle, Minus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConfidenceBreakdownBarProps {
  baseConfidence?: number;
  ndviBonus?: number;
  soilMoistureBonus?: number;
  irrigationBonus?: number;
  agronomicPenalty?: number;
  estimationPenalty?: number;
  finalConfidence: number;
  compact?: boolean;
  className?: string;
}

export function ConfidenceBreakdownBar({
  baseConfidence = 60,
  ndviBonus = 0,
  soilMoistureBonus = 0,
  irrigationBonus = 0,
  agronomicPenalty = 0,
  estimationPenalty = 0,
  finalConfidence,
  compact = false,
  className,
}: ConfidenceBreakdownBarProps) {
  // Calculate segment widths as percentage of max (85%)
  const maxConfidence = 85;
  const segments = [
    {
      label: "Base",
      value: baseConfidence,
      color: "bg-muted-foreground/60",
      icon: null,
      width: (baseConfidence / maxConfidence) * 100
    },
    {
      label: "NDVI",
      value: ndviBonus,
      color: "bg-primary",
      icon: Satellite,
      width: (Math.max(0, ndviBonus) / maxConfidence) * 100
    },
    {
      label: "Moisture",
      value: soilMoistureBonus,
      color: "bg-chart-blue",
      icon: Droplets,
      width: (Math.max(0, soilMoistureBonus) / maxConfidence) * 100
    },
    {
      label: "Irrigation",
      value: irrigationBonus,
      color: "bg-accent",
      icon: Waves,
      width: (Math.max(0, irrigationBonus) / maxConfidence) * 100
    },
  ];

  const penalties = [
    { label: "Agronomic", value: agronomicPenalty },
    { label: "Estimation", value: estimationPenalty },
  ].filter(p => p.value < 0);

  const totalPenalty = Math.abs(agronomicPenalty) + Math.abs(estimationPenalty);

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("space-y-1", className)}>
              {/* Stacked bar */}
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
                {segments.map((seg, idx) => (
                  seg.value > 0 && (
                    <div
                      key={idx}
                      className={cn(seg.color, "h-full transition-all")}
                      style={{ width: `${seg.width}%` }}
                    />
                  )
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0%</span>
                <span className="font-medium text-foreground">{finalConfidence}%</span>
                <span>85%</span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="font-medium mb-1">Accuracy Analysis:</p>
            <ul className="text-xs space-y-0.5">
              <li>• Base: {baseConfidence}%</li>
              {ndviBonus > 0 && <li className="text-primary">• NDVI: +{ndviBonus}%</li>}
              {soilMoistureBonus > 0 && <li className="text-blue-500">• Moisture: +{soilMoistureBonus}%</li>}
              {irrigationBonus > 0 && <li className="text-accent">• Irrigation: +{irrigationBonus}%</li>}
              {penalties.map((p, i) => (
                <li key={i} className="text-destructive">• {p.label}: {p.value}%</li>
              ))}
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Main stacked progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Accuracy Analysis</span>
          <span className={cn(
            "font-bold",
            finalConfidence >= 75 ? "text-primary" :
              finalConfidence >= 60 ? "text-accent" : "text-destructive"
          )}>
            {finalConfidence}%
          </span>
        </div>

        {/* Stacked bar */}
        <div className="h-4 w-full bg-muted rounded-full overflow-hidden flex relative">
          {segments.map((seg, idx) => (
            seg.value > 0 && (
              <div
                key={idx}
                className={cn(seg.color, "h-full transition-all duration-500 relative group")}
                style={{ width: `${seg.width}%` }}
              >
                {/* Tooltip on hover for each segment */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {seg.icon && <seg.icon className="h-2.5 w-2.5 text-white" />}
                </div>
              </div>
            )
          ))}

          {/* Penalty indicator */}
          {totalPenalty > 0 && (
            <div
              className="absolute right-0 top-0 h-full bg-destructive/30 flex items-center justify-center"
              style={{ width: `${(totalPenalty / maxConfidence) * 100}%` }}
            >
              <Minus className="h-2.5 w-2.5 text-destructive" />
            </div>
          )}
        </div>

        {/* Scale markers */}
        <div className="flex justify-between text-[10px] text-muted-foreground px-1">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>85</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {segments.map((seg, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <div className={cn("h-2.5 w-2.5 rounded-sm", seg.color)} />
            <span className="text-muted-foreground">{seg.label}:</span>
            <span className="font-medium text-foreground">
              {seg.value > 0 ? `+${seg.value}%` : "—"}
            </span>
          </div>
        ))}

        {penalties.length > 0 && (
          <div className="col-span-2 flex items-center gap-1.5 pt-1 border-t border-border mt-1">
            <AlertTriangle className="h-3 w-3 text-destructive" />
            <span className="text-destructive text-xs">
              Penalties: {penalties.map(p => `${p.label} ${p.value}%`).join(", ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}