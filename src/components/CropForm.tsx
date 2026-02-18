import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sprout, CloudRain, Thermometer, Droplets, MapPin, Calendar, CloudSun, Loader2, Building, Home, Satellite, Waves, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePrediction } from "@/hooks/usePrediction";
import { useWeather } from "@/hooks/useWeather";
import { useSatelliteData, SatelliteData } from "@/hooks/useSatelliteData";
import { indianStates, getDistrictsForState, getVillagesForDistrict } from "@/data/indianLocations";
import { 
  validateAgronomicInputs, 
  calculateEffectiveWater, 
  calculateYieldAdjustment,
  calculateConfidence,
  calculateProfitClassification,
  estimateRootZoneMoisture,
  type ConfidenceBreakdown
} from "@/lib/agronomicValidation";

const crops = ["Wheat", "Rice", "Corn", "Soybean", "Potato", "Cotton", "Sugarcane", "Barley", "Jowar", "Bajra", "Maize", "Chickpea", "Groundnut", "Mustard", "Sunflower", "Gram", "Jute"];
const soilTypes = ["Loamy", "Clay", "Sandy", "Silt", "Peat", "Chalky", "Saline", "Black", "Red", "Alluvial", "Laterite"];
const seasons = ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"];
const irrigationTypes = ["Rainfed", "Canal", "Borewell", "Drip", "Sprinkler", "Flood"];

interface SoilAnalysisData {
  soilType: string;
  moisture: string;
  phLevel: number;
  suitableCrops: string[];
}

interface CropFormProps {
  onPredict?: (data: any) => void;
  onSatelliteData?: (data: SatelliteData | null) => void;
  soilAnalysisData?: SoilAnalysisData | null;
}

interface FormData {
  crop: string;
  soilType: string;
  state: string;
  district: string;
  village: string;
  season: string;
  rainfall: string;
  temperature: string;
  humidity: string;
  irrigationType: string;
}

export function CropForm({ onPredict, onSatelliteData, soilAnalysisData }: CropFormProps) {
  const [formData, setFormData] = useState<FormData>({
    crop: "",
    soilType: "",
    state: "",
    district: "",
    village: "",
    season: "",
    rainfall: "",
    temperature: "",
    humidity: "",
    irrigationType: "",
  });
  
  const [districts, setDistricts] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);
  
  const { predict, updatePredictionWithEnhancedData, isLoading } = usePrediction();
  const { fetchWeather, isLoading: isWeatherLoading } = useWeather();
  const { fetchSatelliteData, isLoading: isSatelliteLoading, data: satelliteData } = useSatelliteData();

  // Update districts when state changes
  useEffect(() => {
    if (formData.state) {
      const stateDistricts = getDistrictsForState(formData.state);
      setDistricts(stateDistricts);
      setFormData(prev => ({ ...prev, district: "", village: "" }));
      setVillages([]);
    }
  }, [formData.state]);

  // Update villages when district changes
  useEffect(() => {
    if (formData.district) {
      const districtVillages = getVillagesForDistrict(formData.district);
      setVillages(districtVillages);
      setFormData(prev => ({ ...prev, village: "" }));
    }
  }, [formData.district]);

  // Auto-apply soil analysis data when received
  useEffect(() => {
    if (soilAnalysisData) {
      // Map soil analysis soil type to form soil type
      const soilTypeMapping: Record<string, string> = {
        "Clay": "clay",
        "Loamy": "loamy",
        "Sandy": "sandy",
        "Silt": "silt",
        "Peat": "peat",
        "Chalky": "chalky",
        "Saline": "saline",
        "Black": "black",
        "Red": "red",
        "Alluvial": "alluvial",
        "Laterite": "laterite",
      };
      
      const mappedSoilType = soilTypeMapping[soilAnalysisData.soilType] || soilAnalysisData.soilType.toLowerCase();
      
      setFormData(prev => ({
        ...prev,
        soilType: mappedSoilType,
      }));
      
      toast({
        title: "Soil Type Applied",
        description: `Form updated with detected soil type: ${soilAnalysisData.soilType}`,
      });
    }
  }, [soilAnalysisData]);

  const handleUseCurrentWeather = async () => {
    if (!formData.state) {
      toast({
        title: "Select a State",
        description: "Please select a state first to fetch weather data.",
        variant: "destructive",
      });
      return;
    }

    // Fetch 30-day weather data for crop cycle estimation
    const weatherData = await fetchWeather(formData.state, undefined, undefined, 30);
    
    if (weatherData?.current && weatherData?.stats) {
      // ===== IMPROVED RAINFALL HANDLING =====
      // Never allow 0 rainfall - use historical fallbacks
      let rawRainfall = weatherData.stats.totalRainfall || 0;
      const wasEstimated = weatherData.stats.rainfallEstimated || false;
      
      // Apply minimum safe value (100mm) if still near zero
      if (rawRainfall < 50) {
        rawRainfall = Math.max(100, rawRainfall);
      }
      
      // For 4-month crop cycles, extrapolate: 30-day total × 4
      const seasonalRainfall = Math.round(rawRainfall * 4);
      
      // Cap at climatological maximum (2500mm for 4 months - monsoon regions)
      const cappedRainfall = Math.min(2500, seasonalRainfall);
      
      // Use average temperature and humidity from forecast period
      const avgTemp = weatherData.stats.avgTemp || weatherData.current.temperature || 25;
      const avgHumidity = weatherData.forecast && weatherData.forecast.length > 0
        ? Math.round(weatherData.forecast.reduce((sum: number, d: any) => sum + (d.humidity || 0), 0) / weatherData.forecast.length)
        : weatherData.current.humidity || 65;
      
      setFormData((prev) => ({
        ...prev,
        rainfall: String(cappedRainfall),
        temperature: String(avgTemp),
        humidity: String(avgHumidity),
      }));
      
      // Enhanced feedback with ML features
      const rainyDays = weatherData.stats.rainyDays || 0;
      const drySpell = weatherData.stats.maxDrySpellDays || 0;
      
      toast({
        title: wasEstimated ? "Seasonal Weather (Estimated)" : "Seasonal Weather Loaded",
        description: `${weatherData.region}: ~${cappedRainfall}mm rainfall (${rainyDays} rainy days), ${avgTemp}°C avg temp${drySpell > 5 ? `, ${drySpell}-day dry spell` : ""}.`,
        variant: wasEstimated ? "default" : undefined,
      });
    } else {
      // ===== FALLBACK: Use regional historical averages =====
      const regionFallback: Record<string, { rainfall: number; temp: number; humidity: number }> = {
        "AP": { rainfall: 800, temp: 28, humidity: 70 },
        "TS": { rainfall: 750, temp: 28, humidity: 65 },
        "KA": { rainfall: 1000, temp: 26, humidity: 72 },
        "KL": { rainfall: 1200, temp: 27, humidity: 80 },
        "TN": { rainfall: 700, temp: 29, humidity: 70 },
        "MH": { rainfall: 900, temp: 27, humidity: 68 },
        "GJ": { rainfall: 600, temp: 28, humidity: 55 },
        "UP": { rainfall: 650, temp: 26, humidity: 65 },
        "PB": { rainfall: 500, temp: 25, humidity: 60 },
        "HR": { rainfall: 450, temp: 26, humidity: 58 },
        "MP": { rainfall: 900, temp: 27, humidity: 62 },
        "WB": { rainfall: 1100, temp: 27, humidity: 75 },
        "OD": { rainfall: 1200, temp: 28, humidity: 78 },
        "BR": { rainfall: 1000, temp: 27, humidity: 72 },
        "RJ": { rainfall: 400, temp: 28, humidity: 45 },
      };
      
      const fallback = regionFallback[formData.state] || { rainfall: 600, temp: 26, humidity: 65 };
      
      setFormData((prev) => ({
        ...prev,
        rainfall: String(fallback.rainfall),
        temperature: String(fallback.temp),
        humidity: String(fallback.humidity),
      }));
      
      toast({
        title: "Historical Average Used",
        description: `Weather API unavailable. Using historical seasonal average for ${formData.state}: ${fallback.rainfall}mm rainfall.`,
        variant: "default",
      });
    }
  };

  const handleFetchSatelliteData = async () => {
    if (!formData.state) {
      toast({
        title: "Select a State",
        description: "Please select a state first to fetch satellite data.",
        variant: "destructive",
      });
      return;
    }

    const data = await fetchSatelliteData({
      state: formData.state,
      district: formData.district,
      season: formData.season,
      crop: formData.crop,
    });
    
    if (data) {
      onSatelliteData?.(data);
      toast({
        title: "Satellite Data Loaded",
        description: `NDVI: ${data.ndvi.value.toFixed(2)} (${data.ndvi.status}) | Soil Moisture: ${data.soilMoisture.value.toFixed(1)}%`,
      });
    } else {
      toast({
        title: "Satellite Data Unavailable",
        description: "Could not retrieve satellite data. Prediction will use reduced reliability.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.crop || !formData.soilType || !formData.state || !formData.season) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Crop, Soil, State, Season).",
        variant: "destructive",
      });
      return;
    }

    // Check if rainfall is zero and no irrigation type selected - warn but don't block
    const rainfallValue = parseFloat(formData.rainfall) || 0;
    const hasIrrigation = formData.irrigationType && formData.irrigationType !== "rainfed";
    
    if (rainfallValue === 0 && !hasIrrigation) {
      toast({
        title: "Irrigation Recommended",
        description: "Consider selecting an irrigation type for better prediction accuracy when rainfall is zero.",
        variant: "default",
      });
    }

    // Map state code to region for backward compatibility with prediction API
    const stateData = indianStates.find(s => s.code === formData.state);
    const regionMapping: Record<string, string> = {
      "UP": "north-india", "HR": "north-india", "PB": "north-india", "RJ": "north-india", "DL": "north-india", "UK": "north-india", "HP": "north-india", "JK": "north-india", "LA": "north-india",
      "TN": "south-india", "KL": "south-india", "KA": "south-india", "AP": "south-india", "TS": "south-india",
      "WB": "east-india", "OD": "east-india", "BR": "east-india", "JH": "east-india", "AS": "east-india", "AR": "east-india", "MN": "east-india", "ML": "east-india", "MZ": "east-india", "NL": "east-india", "TR": "east-india", "SK": "east-india",
      "MH": "west-india", "GJ": "west-india", "GA": "west-india",
      "MP": "central-india", "CG": "central-india",
    };
    
    const region = regionMapping[formData.state] || "central-india";
    const seasonNormalized = formData.season.split(" ")[0].toLowerCase();

    // ===== AGRONOMIC VALIDATION =====
    const agronomicValidation = validateAgronomicInputs(
      formData.crop,
      seasonNormalized,
      rainfallValue,
      formData.irrigationType,
      region
    );

    // ===== SEASONAL WATER CALCULATION (4-MONTH CUMULATIVE) =====
    const { effectiveWater, seasonalRainfall, irrigationContribution, isEstimated, source } = calculateEffectiveWater(
      rainfallValue,
      formData.irrigationType,
      seasonNormalized,
      region
    );

    // ===== ROOT-ZONE SOIL MOISTURE (SEASONAL ESTIMATED) =====
    const rootZoneMoisture = estimateRootZoneMoisture(
      seasonalRainfall,
      formData.irrigationType,
      formData.soilType
    );

    // Show agronomic warnings if any
    if (agronomicValidation.warnings.length > 0) {
      toast({
        title: "Agronomic Advisory",
        description: agronomicValidation.warnings[0],
        variant: agronomicValidation.reliabilityImpact < -15 ? "destructive" : "default",
      });
    }

    const result = await predict({
      ...formData,
      region,
    });
    
    if (result && onPredict) {
      // ===== YIELD ADJUSTMENT WITH SEASONAL DATA =====
      // Use seasonal root-zone moisture instead of satellite snapshot
      const effectiveMoistureLevel = rootZoneMoisture.moisture >= 30 ? "moderate" : 
                                     rootZoneMoisture.moisture >= 15 ? "low" : "very_low";
      
      const yieldAdjustment = calculateYieldAdjustment(
        result.predicted_yield,
        satelliteData?.ndvi.value,
        satelliteData?.ndvi.available ?? false,
        effectiveMoistureLevel,
        effectiveWater,
        formData.crop
      );

      // ===== SEASONAL YIELD BOOST =====
      // If seasonal water is sufficient, apply realistic yield correction
      let seasonalYield = yieldAdjustment.adjustedYield;
      const cropWaterReq = 1000; // Default for rice-like crops
      
      if (rootZoneMoisture.moisture >= 30 && effectiveWater >= cropWaterReq * 0.6) {
        // Water-sufficient scenario: boost yield to realistic levels
        const boostFactor = Math.min(1.8, 1 + (effectiveWater / cropWaterReq) * 0.5);
        seasonalYield = Math.round(yieldAdjustment.adjustedYield * boostFactor);
      }

      // ===== PROFIT CLASSIFICATION =====
      const profitClassification = calculateProfitClassification(seasonalYield, formData.crop);

      // ===== CONFIDENCE WITH SEASONAL DATA (CORRECT FLOW) =====
      const confidenceBreakdown: ConfidenceBreakdown = calculateConfidence(
        satelliteData?.ndvi.available ?? false,
        rootZoneMoisture.moisture > 0, // Soil moisture derived = valid
        hasIrrigation, // Irrigation available
        effectiveWater > 0, // Has water source (rainfall or irrigation)
        agronomicValidation.reliabilityImpact,
        isEstimated && irrigationContribution === 0, // Only penalize if truly estimated with no irrigation
        rootZoneMoisture.level === "very_low" && !hasIrrigation // Only very low if no irrigation override
      );

      // ===== COLLECT ALL WARNINGS =====
      const warnings: string[] = [...agronomicValidation.warnings];
      
      // Satellite data warnings
      if (!satelliteData?.ndvi.available) {
        warnings.push("Satellite NDVI unavailable – reduced prediction reliability");
      }
      
      // Seasonal water warnings
      if (isEstimated) {
        warnings.push(`Rainfall data missing or zero. Irrigation and historical averages are used.`);
      }
      
      // Satellite uncertainty disclaimer (mandatory)
      warnings.push("Satellite-derived indicators have spatial and temporal uncertainty and are used for decision support only.");

      // Add recommendations
      const recommendations = [...agronomicValidation.recommendations];
      
      if (rootZoneMoisture.level === "low" || rootZoneMoisture.level === "very_low") {
        recommendations.push(`⚠️ Low soil moisture detected – drought stress possible`);
      }

      // Update prediction in database with enhanced data
      await updatePredictionWithEnhancedData(result.id, {
        confidence: confidenceBreakdown.finalConfidence,
        confidenceBreakdown,
        profitClassification,
        adjustedYield: seasonalYield,
      });

      onPredict({
        ...formData,
        region,
        stateName: stateData?.name || formData.state,
        yield: seasonalYield,
        confidence: confidenceBreakdown.finalConfidence,
        confidenceBreakdown,
        reliabilityStatus: confidenceBreakdown.reliabilityStatus,
        yieldAdjustmentReason: yieldAdjustment.reason,
        effectiveWater,
        seasonalRainfall,
        irrigationContribution,
        waterSource: source,
        isWaterEstimated: isEstimated,
        rootZoneMoisture,
        model_accuracy: result.model_accuracy,
        satelliteData,
        warnings,
        recommendations,
        profitClassification,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Crop Selection */}
        <div className="space-y-2">
          <Label htmlFor="crop" className="flex items-center gap-2">
            <Sprout className="h-4 w-4 text-primary" />
            Crop Type *
          </Label>
          <Select
            value={formData.crop}
            onValueChange={(value) => setFormData({ ...formData, crop: value })}
          >
            <SelectTrigger id="crop">
              <SelectValue placeholder="Select crop" />
            </SelectTrigger>
            <SelectContent>
              {crops.map((crop) => (
                <SelectItem key={crop} value={crop.toLowerCase()}>
                  {crop}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Soil Type */}
        <div className="space-y-2">
          <Label htmlFor="soilType" className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-accent/50" />
            Soil Type *
          </Label>
          <Select
            value={formData.soilType}
            onValueChange={(value) => setFormData({ ...formData, soilType: value })}
          >
            <SelectTrigger id="soilType">
              <SelectValue placeholder="Select soil type" />
            </SelectTrigger>
            <SelectContent>
              {soilTypes.map((soil) => (
                <SelectItem key={soil} value={soil.toLowerCase()}>
                  {soil}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* State Selection */}
        <div className="space-y-2">
          <Label htmlFor="state" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            State *
          </Label>
          <Select
            value={formData.state}
            onValueChange={(value) => setFormData({ ...formData, state: value })}
          >
            <SelectTrigger id="state">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {indianStates.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* District Selection */}
        <div className="space-y-2">
          <Label htmlFor="district" className="flex items-center gap-2">
            <Building className="h-4 w-4 text-primary" />
            District
          </Label>
          <Select
            value={formData.district}
            onValueChange={(value) => setFormData({ ...formData, district: value })}
            disabled={!formData.state || districts.length === 0}
          >
            <SelectTrigger id="district">
              <SelectValue placeholder={formData.state ? "Select district" : "Select state first"} />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Village/Town Selection or Input */}
        <div className="space-y-2">
          <Label htmlFor="village" className="flex items-center gap-2">
            <Home className="h-4 w-4 text-primary" />
            Village / Town
          </Label>
          {villages.length > 0 ? (
            <Select
              value={formData.village}
              onValueChange={(value) => setFormData({ ...formData, village: value })}
              disabled={!formData.district}
            >
              <SelectTrigger id="village">
                <SelectValue placeholder="Select village/town" />
              </SelectTrigger>
              <SelectContent>
                {villages.map((village) => (
                  <SelectItem key={village} value={village}>
                    {village}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="village"
              placeholder="Enter village/town name"
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
            />
          )}
        </div>

        {/* Season */}
        <div className="space-y-2">
          <Label htmlFor="season" className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Season *
          </Label>
          <Select
            value={formData.season}
            onValueChange={(value) => setFormData({ ...formData, season: value })}
          >
            <SelectTrigger id="season">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season} value={season.split(" ")[0].toLowerCase()}>
                  {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Irrigation Type - Required if rainfall is 0 */}
        <div className="space-y-2">
          <Label htmlFor="irrigationType" className="flex items-center gap-2">
            <Waves className="h-4 w-4 text-primary" />
            Irrigation Type {(!formData.rainfall || parseFloat(formData.rainfall) === 0) && "*"}
          </Label>
          <Select
            value={formData.irrigationType}
            onValueChange={(value) => setFormData({ ...formData, irrigationType: value })}
          >
            <SelectTrigger id="irrigationType">
              <SelectValue placeholder="Select irrigation type" />
            </SelectTrigger>
            <SelectContent>
              {irrigationTypes.map((type) => (
                <SelectItem key={type} value={type.toLowerCase()}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Weather Auto-fill Section */}
        <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border border-dashed border-primary/30 bg-primary/5">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Auto-fill Weather & Satellite Data</p>
            <p className="text-xs text-muted-foreground">
              Fetch weather forecast and NDVI/soil moisture from satellite sources
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUseCurrentWeather}
              disabled={isWeatherLoading || !formData.state}
            >
              {isWeatherLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <CloudSun className="h-4 w-4" />
                  Weather
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFetchSatelliteData}
              disabled={isSatelliteLoading || !formData.state}
              className="border-primary/50 hover:bg-primary/10"
            >
              {isSatelliteLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Satellite className="h-4 w-4 text-primary" />
                  Satellite NDVI
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Satellite Data Status */}
        {satelliteData && (
          <div className="md:col-span-2 flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Satellite className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Satellite Data Loaded
              </p>
              <p className="text-xs text-muted-foreground">
                NDVI: {satelliteData.ndvi.value.toFixed(2)} ({satelliteData.ndvi.status}) | 
                Soil Moisture: {satelliteData.soilMoisture.value.toFixed(1)}% ({satelliteData.soilMoisture.level})
              </p>
            </div>
          </div>
        )}

        {/* Rainfall */}
        <div className="space-y-2">
          <Label htmlFor="rainfall" className="flex items-center gap-2">
            <CloudRain className="h-4 w-4 text-primary" />
            Rainfall (mm)
          </Label>
          <Input
            id="rainfall"
            type="number"
            placeholder="e.g., 150"
            value={formData.rainfall}
            onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
          />
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <Label htmlFor="temperature" className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-accent" />
            Temperature (°C)
          </Label>
          <Input
            id="temperature"
            type="number"
            placeholder="e.g., 28"
            value={formData.temperature}
            onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
          />
        </div>

        {/* Humidity */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="humidity" className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-primary" />
            Humidity (%)
          </Label>
          <Input
            id="humidity"
            type="number"
            placeholder="e.g., 65"
            value={formData.humidity}
            onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
            className="md:w-1/2"
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            Calculating Prediction...
          </>
        ) : (
          <>
            <Sprout className="h-4 w-4" />
            Predict Crop Yield
          </>
        )}
      </Button>
    </form>
  );
}
