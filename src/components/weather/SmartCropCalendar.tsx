import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar, Droplets, Sun, CloudRain, Snowflake, Thermometer, AlertTriangle, CheckCircle2, ChevronDown, Sprout, Info, Leaf, Wheat, TreeDeciduous, Sparkles } from "lucide-react";
import { allCalendarCrops, CropCalendarCrop, monthNamesShort, seasonInfo, getSeasonForMonth, getCropsBySeason } from "@/data/cropCalendarData";

interface SmartCropCalendarProps {
  selectedRegion?: string;
}

const waterIcons = {
  none: { bars: 0, color: 'text-muted-foreground' },
  low: { bars: 1, color: 'text-blue-400' },
  medium: { bars: 2, color: 'text-blue-500' },
  high: { bars: 3, color: 'text-blue-600' },
};

const weatherIcons = {
  rainy: { icon: CloudRain, color: 'text-blue-500', label: 'Rainy' },
  dry: { icon: Sun, color: 'text-amber-500', label: 'Dry' },
  cool: { icon: Snowflake, color: 'text-cyan-500', label: 'Cool' },
  hot: { icon: Thermometer, color: 'text-red-500', label: 'Hot' },
  humid: { icon: Droplets, color: 'text-teal-500', label: 'Humid' },
};

const riskColors = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const seasonIcons = {
  kharif: Leaf,
  rabi: Wheat,
  zaid: Sun,
  perennial: TreeDeciduous,
};

export function SmartCropCalendar({ selectedRegion = "All India" }: SmartCropCalendarProps) {
  const [selectedCrop, setSelectedCrop] = useState<CropCalendarCrop>(allCalendarCrops[0]);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);
  
  const currentMonth = new Date().getMonth();

  // Crop counts by season
  const kharifCount = getCropsBySeason('kharif').length;
  const rabiCount = getCropsBySeason('rabi').length;
  const zaidCount = getCropsBySeason('zaid').length;
  const perennialCount = getCropsBySeason('perennial').length;
  const totalCrops = allCalendarCrops.length;

  const getSeasonStyle = (monthIndex: number) => {
    const season = getSeasonForMonth(monthIndex);
    return seasonInfo[season];
  };

  return (
    <Card className="border-primary/20 overflow-hidden">
      {/* Decorative Header Banner */}
      <div className="relative bg-gradient-to-r from-green-500/10 via-amber-500/10 to-blue-500/10 p-4 border-b">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-green-600 text-white shadow-lg">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                Smart Crop Calendar
                <Sparkles className="h-4 w-4 text-amber-500" />
              </h2>
              <p className="text-sm text-muted-foreground">12-month growing guide for Indian farmers</p>
            </div>
          </div>
          
          {/* Total Crops Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-black/30 shadow-sm border">
            <Sprout className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">{totalCrops} Crops</span>
            <span className="text-xs text-muted-foreground">Available</span>
          </div>
        </div>

        {/* Season Count Cards */}
        <div className="relative mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { name: 'Kharif', count: kharifCount, icon: Leaf, color: 'from-green-500 to-emerald-600', bg: 'bg-green-50 dark:bg-green-950/50' },
            { name: 'Rabi', count: rabiCount, icon: Wheat, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50 dark:bg-blue-950/50' },
            { name: 'Zaid', count: zaidCount, icon: Sun, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-950/50' },
            { name: 'Perennial', count: perennialCount, icon: TreeDeciduous, color: 'from-teal-500 to-cyan-600', bg: 'bg-teal-50 dark:bg-teal-950/50' },
          ].map((season) => (
            <div key={season.name} className={`${season.bg} rounded-xl p-3 border border-white/50 dark:border-white/10 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]`}>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${season.color} text-white`}>
                  <season.icon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{season.name}</p>
                  <p className="text-lg font-bold text-foreground">{season.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CardHeader className="pb-4 pt-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Crop Selector */}
          <Select value={selectedCrop.id} onValueChange={(id) => setSelectedCrop(allCalendarCrops.find(c => c.id === id) || allCalendarCrops[0])}>
            <SelectTrigger className="w-full sm:w-[240px] h-12 bg-muted/30 border-2 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedCrop.icon}</span>
                <div className="text-left">
                  <p className="font-medium text-foreground">{selectedCrop.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedCrop.duration}</p>
                </div>
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-[400px]">
              <div className="px-3 py-2 bg-green-50 dark:bg-green-950/30 border-b flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">Kharif Season ({kharifCount})</span>
              </div>
              {allCalendarCrops.filter(c => c.season === 'kharif').map(crop => (
                <SelectItem key={crop.id} value={crop.id} className="py-2">
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{crop.icon}</span>
                    <span className="font-medium">{crop.name}</span>
                  </span>
                </SelectItem>
              ))}
              <div className="px-3 py-2 bg-blue-50 dark:bg-blue-950/30 border-b border-t flex items-center gap-2">
                <Wheat className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Rabi Season ({rabiCount})</span>
              </div>
              {allCalendarCrops.filter(c => c.season === 'rabi').map(crop => (
                <SelectItem key={crop.id} value={crop.id} className="py-2">
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{crop.icon}</span>
                    <span className="font-medium">{crop.name}</span>
                  </span>
                </SelectItem>
              ))}
              <div className="px-3 py-2 bg-amber-50 dark:bg-amber-950/30 border-b border-t flex items-center gap-2">
                <Sun className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">Zaid Season ({zaidCount})</span>
              </div>
              {allCalendarCrops.filter(c => c.season === 'zaid').map(crop => (
                <SelectItem key={crop.id} value={crop.id} className="py-2">
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{crop.icon}</span>
                    <span className="font-medium">{crop.name}</span>
                  </span>
                </SelectItem>
              ))}
              <div className="px-3 py-2 bg-teal-50 dark:bg-teal-950/30 border-b border-t flex items-center gap-2">
                <TreeDeciduous className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-semibold text-teal-700 dark:text-teal-400">Plantation ({perennialCount})</span>
              </div>
              {allCalendarCrops.filter(c => c.season === 'perennial').map(crop => (
                <SelectItem key={crop.id} value={crop.id} className="py-2">
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{crop.icon}</span>
                    <span className="font-medium">{crop.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Selected Crop Info Card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/20">
            <span className="text-4xl drop-shadow-md">{selectedCrop.icon}</span>
            <div>
              <h3 className="font-bold text-foreground">{selectedCrop.name}</h3>
              <p className="text-xs text-muted-foreground">{selectedCrop.nameLocal}</p>
              <div className="flex gap-1.5 mt-1">
                <Badge variant="outline" className={`text-[10px] px-1.5 ${seasonInfo[selectedCrop.season === 'perennial' ? 'kharif' : selectedCrop.season].textClass}`}>
                  {selectedCrop.season === 'perennial' ? '🌳 Year-round' : selectedCrop.season.charAt(0).toUpperCase() + selectedCrop.season.slice(1)}
                </Badge>
                <Badge variant="secondary" className="text-[10px] px-1.5">{selectedCrop.duration}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Season Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-3 p-3 rounded-lg bg-muted/30 border">
          <span className="text-xs font-medium text-muted-foreground">Seasons:</span>
          {Object.entries(seasonInfo).map(([key, info]) => (
            <div key={key} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/50">
              <div className={`h-2.5 w-2.5 rounded-full ${info.colorClass}`} />
              <span className="text-xs text-foreground font-medium">{info.name}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 ml-auto px-2 py-1 rounded-full bg-primary/10 border border-primary/30">
            <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-primary font-medium">Today</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Horizontal Timeline */}
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex gap-3">
            {selectedCrop.months.map((month, index) => {
              const seasonStyle = getSeasonStyle(index);
              const isCurrentMonth = index === currentMonth;
              const WeatherIcon = weatherIcons[month.weather].icon;
              const waterLevel = waterIcons[month.waterNeed];
              
              return (
                <Collapsible key={index} open={expandedMonth === index} onOpenChange={(open) => setExpandedMonth(open ? index : null)}>
                  <div className={`flex-shrink-0 w-[180px] rounded-2xl border-2 transition-all shadow-sm hover:shadow-lg ${
                    month.isActive ? seasonStyle.borderClass + ' ' + seasonStyle.bgClass : 'border-border bg-muted/20'
                  } ${isCurrentMonth ? 'ring-2 ring-primary ring-offset-2 shadow-lg shadow-primary/20' : ''}`}>
                    {/* Month Header */}
                    <div className={`px-4 py-3 border-b rounded-t-xl ${month.isActive ? 'bg-gradient-to-r from-white/50 to-transparent dark:from-black/20' : 'bg-muted/30'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-base font-bold ${isCurrentMonth ? 'text-primary' : 'text-foreground'}`}>
                            {monthNamesShort[index]}
                          </span>
                          {isCurrentMonth && (
                            <Badge className="text-[10px] px-1.5 py-0 bg-primary animate-pulse">Now</Badge>
                          )}
                        </div>
                        <WeatherIcon className={`h-5 w-5 ${weatherIcons[month.weather].color}`} />
                      </div>
                    </div>

                    {/* Stage */}
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`p-1 rounded-md ${month.isActive ? 'bg-primary/10' : 'bg-muted'}`}>
                          <Sprout className={`h-4 w-4 ${month.isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <span className={`text-sm font-semibold ${month.isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {month.stage}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate pl-7">{month.stageLocal.split('/')[0]}</p>
                    </div>

                    {/* Water Level Bar */}
                    <div className="px-4 py-2 border-t border-border/30">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Water Need</span>
                        <span className={`text-[10px] font-medium ${waterLevel.color}`}>{month.waterNeed}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden flex gap-0.5">
                        {[1, 2, 3].map(i => (
                          <div 
                            key={i} 
                            className={`flex-1 rounded-full transition-all ${i <= waterLevel.bars ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-muted-foreground/20'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    {/* Risks */}
                    {month.risks.length > 0 && (
                      <div className="px-4 py-2 border-t border-border/30">
                        <div className="flex flex-wrap gap-1">
                          {month.risks.map((risk, i) => (
                            <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${riskColors[risk.level]}`}>
                              <AlertTriangle className="h-2.5 w-2.5" />
                              {risk.type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action */}
                    <div className="px-4 py-3 border-t border-border/30">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-foreground leading-relaxed line-clamp-2">{month.action}</p>
                      </div>
                    </div>

                    {/* Expand Button */}
                    <CollapsibleTrigger className="w-full px-4 py-2 border-t border-border/30 flex items-center justify-center gap-1.5 hover:bg-muted/50 transition-colors rounded-b-xl">
                      <span className="text-xs text-muted-foreground font-medium">View Tips</span>
                      <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${expandedMonth === index ? 'rotate-180' : ''}`} />
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-4 py-3 border-t border-border/30 bg-gradient-to-b from-muted/50 to-muted/20 rounded-b-xl">
                        {month.tips?.map((tip, i) => (
                          <p key={i} className="text-xs text-muted-foreground flex items-start gap-2 mb-1.5 last:mb-0">
                            <span className="text-primary font-bold">•</span> 
                            <span>{tip}</span>
                          </p>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Advisory Note */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50">
            <Info className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Advisory Note</p>
            <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-0.5">
              This crop calendar is advisory and adjusts based on weather and field conditions. 
              Actual timing may vary by ±2 weeks based on your region.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}