/**
 * Industry-Standard Crop Recommendation Card
 * Farmer-friendly UI with clear decision indicators
 * 
 * Shows ONLY:
 * - Duration: Short-Term / Long-Term
 * - Water Need: mm/season
 * - Weather Match: Good / Moderate / Poor
 * - Gap Farming: Yes / No
 * - Profit: Low / Medium / High
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Droplet,
  Thermometer,
  Clock,
  Leaf,
  IndianRupee,
  ChevronRight,
  Cloud,
  CheckCircle,
  AlertCircle,
  XCircle,
  Timer,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SmartScoredCrop } from "@/lib/smartCropEngine";
import { cn } from "@/lib/utils";

interface IndustryCropCardProps {
  crop: SmartScoredCrop;
  rank: number;
}

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-amber-500 text-white";
    case 2:
      return "bg-slate-400 text-white";
    case 3:
      return "bg-orange-600 text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getWeatherIcon = (level: "good" | "moderate" | "poor") => {
  switch (level) {
    case "good":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "moderate":
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case "poor":
      return <XCircle className="h-4 w-4 text-red-500" />;
  }
};

const getWeatherColor = (level: "good" | "moderate" | "poor") => {
  switch (level) {
    case "good":
      return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
    case "moderate":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
    case "poor":
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
  }
};

const getProfitColor = (level: "low" | "medium" | "high") => {
  switch (level) {
    case "high":
      return "bg-emerald-500 text-white";
    case "medium":
      return "bg-blue-500 text-white";
    case "low":
      return "bg-slate-400 text-white";
  }
};

const getProfitOutlookBadge = (outlook: string) => {
  switch (outlook) {
    case "exultant":
      return { bg: "bg-emerald-500", text: "Exultant", icon: "🌟" };
    case "high":
      return { bg: "bg-green-500", text: "High", icon: "📈" };
    case "good":
      return { bg: "bg-blue-500", text: "Good", icon: "👍" };
    case "mid_level":
      return { bg: "bg-amber-500", text: "Mid-Level", icon: "➡️" };
    case "normal":
      return { bg: "bg-slate-400", text: "Normal", icon: "📊" };
    case "low":
      return { bg: "bg-orange-500", text: "Low", icon: "⚠️" };
    case "dont_do":
      return { bg: "bg-red-500", text: "Don't Do", icon: "🚫" };
    default:
      return { bg: "bg-slate-400", text: "Unknown", icon: "❓" };
  }
};

const getRiskBadge = (level: "low" | "medium" | "high") => {
  switch (level) {
    case "low":
      return { bg: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400", text: "Low Risk", icon: "✓" };
    case "medium":
      return { bg: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400", text: "Medium Risk", icon: "!" };
    case "high":
      return { bg: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400", text: "High Risk", icon: "⚠" };
  }
};

const getRiskIcon = (level: "low" | "medium" | "high") => {
  switch (level) {
    case "low":
      return <CheckCircle className="h-3 w-3 text-green-600" />;
    case "medium":
      return <AlertCircle className="h-3 w-3 text-amber-500" />;
    case "high":
      return <XCircle className="h-3 w-3 text-red-500" />;
  }
};

export function IndustryCropCard({ crop, rank }: IndustryCropCardProps) {
  const isShortTerm = crop.duration.durationType === "short-term";
  const avgDays = Math.round((crop.duration.minDays + crop.duration.maxDays) / 2);
  
  return (
    <Card className={cn(
      "overflow-hidden border transition-all hover:shadow-lg relative",
      isShortTerm && "ring-1 ring-primary/30 border-primary/20",
      crop.isSafestChoice && "ring-2 ring-green-500/50 border-green-300"
    )}>
      {/* Safest Choice Badge */}
      {crop.isSafestChoice && (
        <div className="absolute -top-0 -right-0 z-10">
          <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
            🛡️ Safest Choice
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Badge className={cn("text-sm font-bold px-2 py-1", getRankBadge(rank))}>
              #{rank}
            </Badge>
            <div>
              <h3 className="text-lg font-bold text-foreground">{crop.name}</h3>
              <p className="text-xs text-muted-foreground">
                {crop.localNames.join(" / ")}
              </p>
            </div>
          </div>
          
          {/* Duration Type Badge */}
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs font-semibold",
              isShortTerm 
                ? "bg-green-50 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400" 
                : "bg-slate-50 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300"
            )}
          >
            {isShortTerm ? "Short-Term" : "Long-Term"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Key Indicators Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Duration */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2.5">
                  <Timer className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm font-semibold">{avgDays} days</p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{crop.duration.minDays}-{crop.duration.maxDays} days from sowing to harvest</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Water Need */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2.5">
                  <Droplet className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Water Need</p>
                    <p className="text-sm font-semibold">{crop.water.mmPerSeason} mm</p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Requires {crop.water.mmPerSeason}mm water per season</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Best with {crop.water.irrigationType} irrigation
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Weather Match */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn(
                  "flex items-center gap-2 rounded-lg border p-2.5",
                  getWeatherColor(crop.weatherMatch.level)
                )}>
                  <Cloud className="h-4 w-4" />
                  <div>
                    <p className="text-xs opacity-80">Weather</p>
                    <p className="text-sm font-semibold capitalize">{crop.weatherMatch.level}</p>
                  </div>
                  {getWeatherIcon(crop.weatherMatch.level)}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{crop.weatherMatch.reason}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Profit Outlook */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2.5">
                  <IndianRupee className="h-4 w-4 text-amber-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Profit Outlook</p>
                    <Badge className={cn("text-xs", getProfitOutlookBadge(crop.profitOutlook).bg, "text-white")}>
                      {getProfitOutlookBadge(crop.profitOutlook).icon} {getProfitOutlookBadge(crop.profitOutlook).text}
                    </Badge>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="font-medium">{crop.profitNote}</p>
                <p className="text-xs text-muted-foreground mt-1">Yield: {crop.economics.yieldPerAcreKg} kg/acre</p>
                <p className="text-xs text-muted-foreground">Avg Price: ₹{crop.economics.avgMarketPricePerKg}/kg</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Risk Level Badge with Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={cn("text-xs", getRiskBadge(crop.riskLevel).bg)}>
              {getRiskBadge(crop.riskLevel).icon} {getRiskBadge(crop.riskLevel).text}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Confidence: {crop.confidence}%
            </Badge>
          </div>
          
          {/* Risk Breakdown (compact) */}
          <div className="grid grid-cols-4 gap-1 text-xs">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/50">
                    {getRiskIcon(crop.riskScores.waterRisk)}
                    <span className="text-muted-foreground">Water</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent><p>{crop.riskScores.waterRiskReason}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/50">
                    {getRiskIcon(crop.riskScores.durationRisk)}
                    <span className="text-muted-foreground">Time</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent><p>{crop.duration.durationType === "short-term" ? "Short duration = lower risk" : "Long duration = higher exposure"}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/50">
                    {getRiskIcon(crop.riskScores.climateRisk)}
                    <span className="text-muted-foreground">Climate</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent><p>{crop.riskScores.climateRiskReason}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/50">
                    {getRiskIcon(crop.riskScores.rotationRisk)}
                    <span className="text-muted-foreground">Rotation</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent><p>{crop.riskScores.rotationRiskReason}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Safety Reason (if safest choice) */}
        {crop.isSafestChoice && crop.safetyReason && (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-2">
            <p className="text-xs text-green-700 dark:text-green-400 font-medium">
              🛡️ {crop.safetyReason}
            </p>
          </div>
        )}
        
        {/* Gap Farming Indicator */}
        <div className={cn(
          "flex items-center gap-3 rounded-lg border p-3",
          crop.gapFarming.suitable 
            ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" 
            : "bg-muted/50 border-transparent"
        )}>
          <Leaf className={cn(
            "h-5 w-5",
            crop.gapFarming.suitable ? "text-green-600" : "text-muted-foreground"
          )} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                Gap Farming: {crop.gapFarming.suitable ? "Yes" : "No"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {crop.gapFarming.reason}
            </p>
          </div>
        </div>
        
        {/* Recommendation Reason */}
        <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
          <p className="text-xs text-foreground leading-relaxed">
            {crop.recommendation}
          </p>
        </div>
        
        {/* Soil & Season Tags */}
        <div className="flex flex-wrap gap-1.5">
          {crop.seasons.map((season) => (
            <Badge key={season} variant="outline" className="text-xs">
              {season}
            </Badge>
          ))}
          {crop.soil.suitable.slice(0, 2).map((soil) => (
            <Badge key={soil} variant="secondary" className="text-xs">
              {soil}
            </Badge>
          ))}
        </div>
        
        <Link to="/predict">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between hover:bg-primary hover:text-primary-foreground"
          >
            Calculate Exact Yield
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
