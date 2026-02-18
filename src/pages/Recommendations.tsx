import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Sprout,
  Beaker,
  BarChart3,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SmartInputForm, SmartInputData } from "@/components/recommendations/SmartInputForm";
import { IndustryCropCard } from "@/components/recommendations/IndustryCropCard";
import { FertilizerGuide } from "@/components/recommendations/FertilizerGuide";
import { CropCharts } from "@/components/recommendations/CropCharts";
import { getSmartCropRecommendations, SmartScoredCrop, getSeasonalAdvice } from "@/lib/smartCropEngine";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

export default function Recommendations() {
  const [activeTab, setActiveTab] = useState<"crops" | "fertilizer" | "charts">("crops");
  const [isBeginnerMode, setIsBeginnerMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<SmartScoredCrop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<SmartScoredCrop | undefined>();
  const [hasSearched, setHasSearched] = useState(false);
  const [inputData, setInputData] = useState<SmartInputData | null>(null);
  const [seasonalAdvice, setSeasonalAdvice] = useState<string>("");
  const { t } = useLanguage();

  const handleSubmit = async (data: SmartInputData) => {
    setIsLoading(true);
    setInputData(data);
    await new Promise((r) => setTimeout(r, 600));

    const context = {
      state: data.state || "",
      district: data.district || "",
      soilType: data.soilType,
      season: data.season,
      temperature: data.temperature,
      rainfall: data.rainfall,
      humidity: data.humidity,
      irrigationAvailable: data.landType === "wet",
      irrigationType: data.irrigationType,
      irrigationReliability: data.irrigationReliability,
      availableGapDays: 90,
      rainfallReliability: data.rainfallReliability,
      // Farm history for rotation
      previousCrop: data.previousCrop,
      previousCropWaterDemand: data.previousCropWaterDemand,
      previousCropSoilImpact: data.previousCropSoilImpact,
      // Crop preference
      cropDurationPreference: data.cropDurationPreference,
      // Satellite data
      ndvi: data.ndvi,
      ndviAvailable: data.ndviAvailable,
      soilMoisture: data.soilMoisture,
      soilMoistureLevel: data.soilMoistureLevel,
      // Weather features
      rainyDays: data.rainyDays,
      drySpellDays: data.drySpellDays,
      max3DayRainfall: data.max3DayRainfall,
      // GPS-based spatial data
      latitude: data.latitude,
      longitude: data.longitude,
      elevationEstimate: data.elevationEstimate,
      elevationCategory: data.elevationCategory,
      rainfallZone: data.rainfallZone,
      icarRegion: data.icarRegion,
      landType: data.landType,
    };

    const results = getSmartCropRecommendations(context);
    setRecommendations(results);
    setSeasonalAdvice(getSeasonalAdvice(context));
    setHasSearched(true);
    setIsLoading(false);

    if (results.length > 0) {
      setSelectedCrop(results[0]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  {t("rec.title")}
                </h1>
                <p className="text-muted-foreground">
                  {t("rec.subtitle")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="beginner-mode" className="text-sm cursor-pointer">
                  {isBeginnerMode ? t("rec.beginner_mode") : t("rec.advanced_mode")}
                </Label>
                <Switch
                  id="beginner-mode"
                  checked={isBeginnerMode}
                  onCheckedChange={setIsBeginnerMode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Input Form */}
        <div className="mb-8">
          <SmartInputForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isBeginnerMode={isBeginnerMode}
          />
        </div>

        {/* Results Section */}
        {hasSearched && (
          <>
            {/* Tab Navigation */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="crops" className="flex items-center gap-2">
                  <Sprout className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("rec.crops_tab")}</span>
                  <span className="sm:hidden">Crops</span>
                  {recommendations.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {recommendations.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="charts" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("rec.charts_tab")}</span>
                  <span className="sm:hidden">Charts</span>
                </TabsTrigger>
                <TabsTrigger value="fertilizer" className="flex items-center gap-2">
                  <Beaker className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("rec.fertilizer_tab")}</span>
                  <span className="sm:hidden">Fertilizer</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="crops" className="mt-6">
                {seasonalAdvice && (
                  <div className="mb-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-sm text-foreground">{seasonalAdvice}</p>
                  </div>
                )}
                {recommendations.length > 0 ? (
                  <div className="space-y-8">
                    {/* Short-Term Crops Section */}
                    {recommendations.filter(c => c.duration.durationType === "short-term").length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                            <span className="text-lg">⚡</span>
                            <h3 className="text-sm font-bold text-green-700 dark:text-green-400">Short-Term Crops</h3>
                          </div>
                          <p className="text-xs text-muted-foreground">20-60 days | Gap farming | Quick income | Low risk</p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {recommendations
                            .filter(c => c.duration.durationType === "short-term")
                            .map((crop, idx) => (
                              <div key={crop.id} onClick={() => setSelectedCrop(crop)} className="cursor-pointer">
                                <IndustryCropCard crop={crop} rank={idx + 1} />
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Long-Term Crops Section */}
                    {recommendations.filter(c => c.duration.durationType === "long-term").length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                            <span className="text-lg">🌾</span>
                            <h3 className="text-sm font-bold text-blue-700 dark:text-blue-400">Long-Term Crops</h3>
                          </div>
                          <p className="text-xs text-muted-foreground">60+ days | Main season | Higher planning required</p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {recommendations
                            .filter(c => c.duration.durationType === "long-term")
                            .map((crop, idx) => (
                              <div key={crop.id} onClick={() => setSelectedCrop(crop)} className="cursor-pointer">
                                <IndustryCropCard
                                  crop={crop}
                                  rank={recommendations.filter(c => c.duration.durationType === "short-term").length + idx + 1}
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Sprout className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      No suitable crops found for your conditions. Try adjusting your inputs.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="charts" className="mt-6">
                {recommendations.length > 0 ? (
                  <CropCharts recommendations={recommendations} />
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Charts will appear after you get crop recommendations.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="fertilizer" className="mt-6">
                <FertilizerGuide
                  selectedCrop={selectedCrop}
                  isBeginnerMode={isBeginnerMode}
                  soilType={inputData?.soilType}
                  region={inputData?.region}
                />
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Initial State */}
        {!hasSearched && (
          <div className="text-center py-12 rounded-xl border border-dashed border-border">
            <Sprout className="h-16 w-16 mx-auto text-primary/50 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {t("rec.top_recommendations")}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t("rec.no_results")}
            </p>
          </div>
        )}

        {/* NPK Guide Section - Direct Full Screen Size */}
        <div className="mt-12 w-full space-y-4">
          <div className="flex items-center gap-2">
            <Beaker className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Understanding NPK Nutrients</h2>
          </div>
          <div className="w-full overflow-hidden rounded-2xl border border-border shadow-soft">
            <img
              src="/images/npk-guide.png"
              alt="NPK Nutrients Guide - Nitrogen, Phosphorus, Potassium"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
