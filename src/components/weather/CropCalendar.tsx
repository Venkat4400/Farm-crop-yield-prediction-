import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Sprout, Sun, CloudRain, Snowflake, Wheat } from "lucide-react";
import { crops, cropCategories } from "@/data/cropData";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const seasonMonths = {
  Kharif: { start: 5, end: 9, color: "bg-green-500", label: "Monsoon Season", icon: CloudRain },
  Rabi: { start: 9, end: 2, color: "bg-amber-500", label: "Winter Season", icon: Snowflake },
  Zaid: { start: 2, end: 5, color: "bg-orange-500", label: "Summer Season", icon: Sun },
};

interface CropCalendarProps {
  selectedRegion?: string;
}

export function CropCalendar({ selectedRegion = "North India" }: CropCalendarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  const filteredCrops = crops.filter((crop) => {
    const matchesCategory = selectedCategory === "all" || crop.category === selectedCategory;
    const matchesRegion = crop.regions.some(r =>
      r.toLowerCase().includes(selectedRegion.toLowerCase().replace("-", " "))
    );
    return matchesCategory && matchesRegion;
  });

  const getMonthsForSeason = (season: string) => {
    const info = seasonMonths[season as keyof typeof seasonMonths];
    if (!info) return [];

    const monthList: number[] = [];
    if (info.start <= info.end) {
      for (let i = info.start; i <= info.end; i++) {
        monthList.push(i);
      }
    } else {
      for (let i = info.start; i < 12; i++) {
        monthList.push(i);
      }
      for (let i = 0; i <= info.end; i++) {
        monthList.push(i);
      }
    }
    return monthList;
  };

  const getCropSeasonColor = (crop: typeof crops[0]) => {
    if (crop.seasons.includes("Kharif")) return "bg-green-100 border-green-300 text-green-800";
    if (crop.seasons.includes("Rabi")) return "bg-amber-100 border-amber-300 text-amber-800";
    if (crop.seasons.includes("Zaid")) return "bg-orange-100 border-orange-300 text-orange-800";
    return "bg-gray-100 border-gray-300 text-gray-800";
  };

  const getCropsForMonth = (monthIndex: number) => {
    return filteredCrops.filter((crop) => {
      return crop.seasons.some((season) => {
        const monthsInSeason = getMonthsForSeason(season);
        return monthsInSeason.includes(monthIndex);
      });
    });
  };

  const currentMonth = new Date().getMonth();

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5 text-primary" />
            Crop Calendar
          </CardTitle>
          <div className="flex items-center gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Crops" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                {cropCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "calendar" | "list")}>
              <TabsList className="grid w-[140px] grid-cols-2">
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Season Legend */}
        <div className="mt-4 flex flex-wrap gap-3">
          {Object.entries(seasonMonths).map(([season, info]) => {
            const Icon = info.icon;
            return (
              <div key={season} className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${info.color}`} />
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {season} ({info.label})
                </span>
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent>
        {viewMode === "calendar" ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {months.map((month, index) => {
              const cropsInMonth = getCropsForMonth(index);
              const isCurrentMonth = index === currentMonth;

              // Determine season for this month
              let seasonColor = "border-border/50";
              let seasonBg = "bg-card";
              let seasonAcccent = "bg-primary";

              if (index >= 5 && index <= 9) { // Kharif
                seasonColor = "border-green-500/30";
                seasonBg = "bg-green-500/5 hover:bg-green-500/10";
                seasonAcccent = "bg-green-500";
              }
              else if (index >= 10 || index <= 2) { // Rabi
                seasonColor = "border-amber-500/30";
                seasonBg = "bg-amber-500/5 hover:bg-amber-500/10";
                seasonAcccent = "bg-amber-500";
              }
              else { // Zaid
                seasonColor = "border-orange-500/30";
                seasonBg = "bg-orange-500/5 hover:bg-orange-500/10";
                seasonAcccent = "bg-orange-500";
              }

              return (
                <div
                  key={month}
                  className={`
                    group relative overflow-hidden rounded-2xl border-2 p-4 transition-all duration-300
                    hover:-translate-y-1 hover:shadow-lg ${seasonColor} ${seasonBg}
                    ${isCurrentMonth ? "ring-2 ring-primary ring-offset-2 scale-[1.02] shadow-md border-primary" : ""}
                    animate-in fade-in zoom-in-95 fill-mode-both
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`absolute top-0 left-0 w-full h-1 ${seasonAcccent} opacity-20`} />

                  <div className="mb-3 flex items-center justify-between">
                    <h4 className={`text-base font-bold ${isCurrentMonth ? "text-primary" : "text-foreground"}`}>
                      {month.slice(0, 3)}
                    </h4>
                    {isCurrentMonth && (
                      <Badge variant="default" className="text-[10px] px-1.5 py-0 h-5 animate-pulse">
                        Now
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 min-h-[50px] content-start">
                    {cropsInMonth.slice(0, 5).map((crop) => (
                      <div
                        key={crop.name}
                        className="relative h-8 w-8 overflow-hidden rounded-full border border-primary/10 shadow-sm transition-all duration-300 hover:scale-125 hover:z-20 hover:border-primary hover:shadow-md cursor-help group"
                        title={crop.name}
                      >
                        {crop.image ? (
                          <img
                            src={crop.image}
                            alt={crop.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-primary/5 text-lg">
                            {crop.icon}
                          </div>
                        )}
                      </div>
                    ))}
                    {cropsInMonth.length > 5 && (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background/50 text-xs font-medium text-muted-foreground border border-border">
                        +{cropsInMonth.length - 5}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      {cropsInMonth.length} Crops
                    </p>
                    <div className={`h-1.5 w-1.5 rounded-full ${seasonAcccent}`} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(seasonMonths).map(([season, info]) => {
              const seasonCrops = filteredCrops.filter((crop) =>
                crop.seasons.includes(season)
              );
              const Icon = info.icon;

              return (
                <div key={season} className="rounded-xl border p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full ${info.color}`} />
                    <Icon className="h-5 w-5" />
                    <h3 className="font-semibold text-foreground">{season} Season</h3>
                    <span className="text-sm text-muted-foreground">({info.label})</span>
                    <Badge variant="secondary" className="ml-auto">
                      {seasonCrops.length} crops
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {seasonCrops.map((crop) => (
                      <Badge
                        key={crop.name}
                        variant="outline"
                        className={cn(
                          "group flex items-center gap-2 pl-1 transition-all duration-300 hover:bg-background hover:shadow-sm",
                          getCropSeasonColor(crop)
                        )}
                      >
                        <div className="h-5 w-5 overflow-hidden rounded-full border border-black/10 group-hover:scale-110 transition-transform">
                          {crop.image ? (
                            <img src={crop.image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-[10px] bg-background">
                              {crop.icon}
                            </span>
                          )}
                        </div>
                        {crop.name}
                      </Badge>
                    ))}
                  </div>
                  {seasonCrops.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No crops match your filters for this season.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Tips */}
        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wheat className="h-5 w-5 text-primary" />
            <h4 className="font-semibold text-foreground">Sowing Tips for {selectedRegion.replace("-", " ")}</h4>
          </div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>🌧️ <strong>Kharif (June-October):</strong> Sow at the onset of monsoon. Good for rice, cotton, maize.</li>
            <li>❄️ <strong>Rabi (October-March):</strong> Sow after monsoon. Best for wheat, chickpea, mustard.</li>
            <li>☀️ <strong>Zaid (March-June):</strong> Short-duration crops. Ideal for moong, watermelon, cucumber.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
