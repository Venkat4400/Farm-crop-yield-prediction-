import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Droplet,
  Thermometer,
  Sun,
  Calendar,
  MapPin,
  ChevronRight,
  HelpCircle,
  Sprout,
  Zap,
  TrendingUp,
  Clock,
  Leaf,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CropInfo } from "@/data/cropData";
import { cn } from "@/lib/utils";

interface CropRecommendationCardProps {
  crop: CropInfo & { 
    score?: number; 
    matchReasons?: string[]; 
    confidence?: number;
    isGapCrop?: boolean;
    isQuickHarvest?: boolean;
    profitPotential?: "high" | "medium" | "low";
  };
  rank: number;
  isBeginnerMode?: boolean;
}

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900";
    case 2:
      return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800";
    case 3:
      return "bg-gradient-to-r from-amber-600 to-orange-700 text-amber-100";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getWaterIcon = (level: "low" | "medium" | "high") => {
  const drops = level === "low" ? 1 : level === "medium" ? 2 : 3;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: drops }).map((_, i) => (
        <Droplet key={i} className="h-3 w-3 fill-blue-500 text-blue-500" />
      ))}
      {Array.from({ length: 3 - drops }).map((_, i) => (
        <Droplet key={i} className="h-3 w-3 text-muted-foreground/30" />
      ))}
    </div>
  );
};

const getHarvestBadge = (days: number) => {
  if (days <= 35) return { text: "Super Fast", color: "bg-green-500 text-white", icon: Zap };
  if (days <= 60) return { text: "Quick Harvest", color: "bg-emerald-500 text-white", icon: Clock };
  if (days <= 90) return { text: "Gap Crop", color: "bg-blue-500 text-white", icon: Calendar };
  return null;
};

const getProfitBadge = (profit: "high" | "medium" | "low" | undefined) => {
  if (profit === "high") return { text: "High Profit", color: "bg-amber-500 text-white" };
  if (profit === "medium") return { text: "Good Returns", color: "bg-yellow-500 text-yellow-900" };
  return null;
};

export function CropRecommendationCard({
  crop,
  rank,
  isBeginnerMode = true,
}: CropRecommendationCardProps) {
  const confidence = crop.confidence || (crop.score ? Math.min(95, Math.round(crop.score * 0.8)) : 75);
  const harvestBadge = getHarvestBadge(crop.growingDays);
  const profitBadge = getProfitBadge(crop.profitPotential);
  const isLeafy = crop.category === "leafy-vegetables";
  const isGapCrop = crop.isGapCrop || crop.category === "gap-crops" || isLeafy;

  return (
    <Card className={cn(
      "group overflow-hidden border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg animate-slide-up",
      isGapCrop && "ring-1 ring-primary/20"
    )}>
      <CardHeader className="relative pb-2">
        {/* Gap Farming Badges */}
        {(harvestBadge || profitBadge || isLeafy) && (
          <div className="absolute -right-1 -top-1 flex flex-col gap-1 items-end">
            {harvestBadge && (
              <Badge className={cn("text-[10px] font-bold gap-1 px-2", harvestBadge.color)}>
                <harvestBadge.icon className="h-3 w-3" />
                {harvestBadge.text}
              </Badge>
            )}
            {isLeafy && (
              <Badge className="text-[10px] font-bold gap-1 px-2 bg-green-600 text-white">
                <Leaf className="h-3 w-3" />
                Leafy Green
              </Badge>
            )}
            {profitBadge && (
              <Badge className={cn("text-[10px] font-bold gap-1 px-2", profitBadge.color)}>
                <TrendingUp className="h-3 w-3" />
                {profitBadge.text}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-start justify-between pr-20">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{crop.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">{crop.name}</h3>
                <Badge className={cn("text-xs font-bold", getRankColor(rank))}>
                  #{rank}
                </Badge>
              </div>
              <Badge variant="secondary" className="mt-1 text-xs">
                {crop.category.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
              </Badge>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{confidence}%</div>
                  <p className="text-xs text-muted-foreground">match</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>How well this crop matches your conditions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground">{crop.description}</p>

        {/* Key indicators with emphasis on harvest time */}
        <div className="grid grid-cols-2 gap-3">
          {/* Growing Days - Highlighted for gap crops */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn(
                  "flex items-center gap-2 rounded-lg p-2",
                  crop.growingDays <= 45 ? "bg-green-100 dark:bg-green-900/30" :
                  crop.growingDays <= 90 ? "bg-blue-50 dark:bg-blue-900/20" : "bg-muted/50"
                )}>
                  <Calendar className={cn(
                    "h-4 w-4",
                    crop.growingDays <= 45 ? "text-green-600" :
                    crop.growingDays <= 90 ? "text-blue-600" : "text-primary"
                  )} />
                  <span className={cn(
                    "text-xs font-semibold",
                    crop.growingDays <= 45 && "text-green-700 dark:text-green-400"
                  )}>
                    {crop.growingDays} days
                  </span>
                  {crop.growingDays <= 45 && <Zap className="h-3 w-3 text-green-600" />}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Growing Period</p>
                <p className="text-xs">
                  {crop.growingDays <= 45 
                    ? `Super fast! Ready to harvest in just ${crop.growingDays} days`
                    : crop.growingDays <= 90
                    ? `Quick crop - harvest in ${crop.growingDays} days`
                    : `Takes ${crop.growingDays} days from sowing to harvest`
                  }
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
                  <Thermometer className="h-4 w-4 text-orange-500" />
                  <span className="text-xs">
                    {crop.minTemp}°C - {crop.maxTemp}°C
                  </span>
                  {isBeginnerMode && (
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Temperature Range</p>
                <p className="text-xs">
                  This crop grows best between {crop.minTemp}°C and {crop.maxTemp}°C
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
                  {getWaterIcon(crop.waterRequirement)}
                  <span className="text-xs capitalize">{crop.waterRequirement}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Water Requirement</p>
                <p className="text-xs">
                  {crop.waterRequirement === "low" &&
                    "Needs less water. Good for dry areas or less irrigation."}
                  {crop.waterRequirement === "medium" &&
                    "Needs regular watering. Normal irrigation is enough."}
                  {crop.waterRequirement === "high" &&
                    "Needs lots of water. Must have good irrigation or rainfall."}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
                  <Sprout className="h-4 w-4 text-green-600" />
                  <span className="text-xs truncate">{crop.yieldRange}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Expected Yield</p>
                <p className="text-xs">
                  You can expect {crop.yieldRange} from your field
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Match reasons */}
        {crop.matchReasons && crop.matchReasons.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-foreground">Why this crop?</p>
            <ul className="space-y-1">
              {crop.matchReasons.slice(0, 4).map((reason, idx) => (
                <li
                  key={idx}
                  className={cn(
                    "flex items-center gap-2 text-xs",
                    reason.includes("⚡") || reason.includes("💰") || reason.includes("🥬")
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  <span className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    reason.includes("⚡") ? "bg-green-500" :
                    reason.includes("💰") ? "bg-amber-500" :
                    reason.includes("🥬") ? "bg-emerald-500" : "bg-primary"
                  )} />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Seasons and soil */}
        <div className="flex flex-wrap gap-1">
          {crop.seasons.map((season) => (
            <Badge key={season} variant="outline" className="text-xs">
              {season}
            </Badge>
          ))}
          {crop.soilTypes.slice(0, 2).map((soil) => (
            <Badge key={soil} variant="outline" className="text-xs">
              {soil}
            </Badge>
          ))}
        </div>

        <Link to="/predict">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground"
          >
            Calculate Exact Yield
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
