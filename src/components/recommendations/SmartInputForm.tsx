import { useState, useCallback, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HelpCircle,
  MapPin,
  Mountain,
  Calendar,
  Thermometer,
  Droplets,
  Cloud,
  Sprout,
  Loader2,
  Mic,
  Navigation,
  RefreshCw,
  Satellite,
  Timer,
  AlertCircle,
} from "lucide-react";
import { VoiceInput } from "@/components/VoiceInput";
import { soilTypeInfo, seasonInfo } from "@/data/cropData";
import { indianStates, stateDistricts, districtVillages } from "@/data/indianLocations";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SmartInputFormProps {
  onSubmit: (data: SmartInputData) => void;
  isLoading?: boolean;
  isBeginnerMode?: boolean;
}

export interface SmartInputData {
  region: string;
  state?: string;
  district?: string;
  village?: string;
  soilType: string;
  season: string;
  landType: "dry" | "wet" | "coastal" | "hill";
  irrigationType?: string;
  irrigationReliability?: "stable" | "moderate" | "uncertain";
  temperature: number;
  rainfall: number;
  humidity: number;
  rainfallReliability?: "high" | "medium" | "low";
  // Farm history
  previousCrop?: string;
  previousCropWaterDemand?: "low" | "medium" | "high";
  previousCropSoilImpact?: "nitrogen_depletion" | "moisture_loss" | "neutral" | "improvement";
  // Crop preference
  cropDurationPreference?: "short-term" | "long-term" | "any";
  // Real-time satellite data
  ndvi?: number;
  ndviAvailable?: boolean;
  soilMoisture?: number;
  soilMoistureLevel?: "very_low" | "low" | "moderate" | "high";
  // Weather features
  rainyDays?: number;
  drySpellDays?: number;
  max3DayRainfall?: number;
  // GPS-based spatial data
  gpsDetected?: boolean;
  latitude?: number;
  longitude?: number;
  elevationEstimate?: number;
  elevationCategory?: "plains" | "low_hills" | "high_hills" | "coastal";
  rainfallZone?: "arid" | "semi_arid" | "sub_humid" | "humid" | "per_humid";
  icarRegion?: string;
  soilGroup?: string;
}

const soilTypes = Object.keys(soilTypeInfo);
const seasons = Object.keys(seasonInfo);

// Map states to regions
const stateToRegion: Record<string, string> = {
  "Punjab": "North India", "Haryana": "North India", "Uttar Pradesh": "North India",
  "Uttarakhand": "North India", "Himachal Pradesh": "North India", "Delhi": "North India",
  "Rajasthan": "North India", "Jammu & Kashmir": "North India", "Ladakh": "North India",
  "Karnataka": "South India", "Tamil Nadu": "South India", "Kerala": "South India",
  "Andhra Pradesh": "South India", "Telangana": "South India",
  "West Bengal": "East India", "Bihar": "East India", "Odisha": "East India",
  "Jharkhand": "East India",
  "Maharashtra": "West India", "Gujarat": "West India", "Goa": "West India",
  "Madhya Pradesh": "Central India", "Chhattisgarh": "Central India",
  "Assam": "Northeast India", "Arunachal Pradesh": "Northeast India", "Manipur": "Northeast India",
  "Meghalaya": "Northeast India", "Mizoram": "Northeast India", "Nagaland": "Northeast India",
  "Sikkim": "Northeast India", "Tripura": "Northeast India",
};

// Soil group to soil type mapping
const soilGroupToType: Record<string, string> = {
  "Alluvial": "Alluvial",
  "Red & Black": "Red",
  "Black (Regur)": "Black",
  "Black & Alluvial": "Black",
  "Black": "Black",
  "Red & Laterite": "Laterite",
  "Red": "Red",
  "Laterite": "Laterite",
  "Sandy & Saline": "Sandy",
  "Mountain": "Loamy",
  "Mixed": "Loamy",
};

export function SmartInputForm({
  onSubmit,
  isLoading = false,
  isBeginnerMode = true,
}: SmartInputFormProps) {
  const [formData, setFormData] = useState<SmartInputData>({
    region: "North India",
    state: "",
    district: "",
    village: "",
    soilType: "Loamy",
    season: "Rabi",
    landType: "wet",
    irrigationType: undefined,
    irrigationReliability: undefined,
    temperature: 25,
    rainfall: 800,
    humidity: 65,
    rainfallReliability: undefined,
    // Farm history
    previousCrop: undefined,
    previousCropWaterDemand: undefined,
    previousCropSoilImpact: undefined,
    // Crop preference
    cropDurationPreference: "any",
    // Satellite
    ndvi: undefined,
    ndviAvailable: false,
    soilMoisture: undefined,
    soilMoistureLevel: undefined,
    rainyDays: undefined,
    drySpellDays: undefined,
    max3DayRainfall: undefined,
  });

  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [isSatelliteLoading, setIsSatelliteLoading] = useState(false);
  const [weatherFetched, setWeatherFetched] = useState(false);
  const [satelliteFetched, setSatelliteFetched] = useState(false);
  const [districts, setDistricts] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);

  // Update districts when state changes
  useEffect(() => {
    if (formData.state) {
      const selectedState = indianStates.find(s => s.name === formData.state);
      if (selectedState) {
        const stateDistricts2 = stateDistricts[selectedState.code] || [];
        setDistricts(stateDistricts2);
        setFormData(d => ({ ...d, district: "", village: "" }));
        // Auto-update region based on state
        const region = stateToRegion[formData.state] || "North India";
        setFormData(d => ({ ...d, region }));
      }
    }
  }, [formData.state]);

  // Update villages when district changes
  useEffect(() => {
    if (formData.district) {
      const villageList = districtVillages[formData.district] || [];
      setVillages(villageList);
      setFormData(d => ({ ...d, village: "" }));
    }
  }, [formData.district]);

  // Auto-fetch weather when state or district changes
  const fetchWeatherData = useCallback(async () => {
    if (!formData.state) {
      toast({
        title: "Select Location",
        description: "Please select a state first to fetch weather data",
        variant: "destructive",
      });
      return;
    }

    setIsWeatherLoading(true);
    try {
      const selectedState = indianStates.find(s => s.name === formData.state);
      if (!selectedState) throw new Error("State not found");

      const { data, error } = await supabase.functions.invoke("get-weather", {
        body: {
          lat: selectedState.lat,
          lon: selectedState.lon,
          days: 30
        },
      });

      if (error) throw error;

      if (data?.success && data?.current) {
        const temp = Math.round(data.current.temperature);
        const humidity = Math.round(data.current.humidity);

        // Use seasonal rainfall (30-day cumulative × 4 for 4-month season)
        let totalRainfall = data.stats?.totalRainfall || 0;
        const wasEstimated = data.stats?.rainfallEstimated || false;

        // Apply minimum safe value
        if (totalRainfall < 50) {
          totalRainfall = Math.max(100, totalRainfall);
        }

        const seasonalRainfall = Math.round(totalRainfall * 4);

        // Get enhanced weather features
        const rainyDays = data.stats?.rainyDays;
        const drySpellDays = data.stats?.maxDrySpellDays;
        const max3DayRainfall = data.stats?.max3DayRainfall;

        setFormData(d => ({
          ...d,
          temperature: temp,
          humidity: humidity,
          rainfall: Math.min(2500, seasonalRainfall),
          rainyDays,
          drySpellDays,
          max3DayRainfall,
        }));

        setWeatherFetched(true);
        toast({
          title: wasEstimated ? "Weather (Historical)" : "Weather Updated ✓",
          description: `${formData.state}: ${temp}°C, ${Math.min(2500, seasonalRainfall)}mm seasonal rainfall${rainyDays ? `, ${rainyDays} rainy days` : ""}`,
          variant: wasEstimated ? "default" : undefined,
        });
      }
    } catch (error) {
      console.error("Weather fetch error:", error);
      toast({
        title: "Weather Fetch Failed",
        description: "Could not fetch weather data. Please enter manually.",
        variant: "destructive",
      });
    } finally {
      setIsWeatherLoading(false);
    }
  }, [formData.state]);

  // Fetch satellite data (NDVI + Soil Moisture)
  const fetchSatelliteData = useCallback(async () => {
    if (!formData.state) {
      toast({
        title: "Select Location",
        description: "Please select a state first to fetch satellite data",
        variant: "destructive",
      });
      return;
    }

    setIsSatelliteLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-satellite-data", {
        body: {
          state: formData.state,
          district: formData.district,
          season: formData.season,
        },
      });

      if (error) throw error;

      if (data?.ndvi || data?.soilMoisture) {
        const ndvi = data.ndvi?.value;
        const ndviAvailable = data.ndvi?.available ?? false;
        const soilMoisture = data.soilMoisture?.value;
        const soilMoistureLevel = data.soilMoisture?.level;

        setFormData(d => ({
          ...d,
          ndvi,
          ndviAvailable,
          soilMoisture,
          soilMoistureLevel,
        }));

        setSatelliteFetched(true);
        toast({
          title: "Satellite Data Loaded ✓",
          description: `NDVI: ${ndvi?.toFixed(2) || "N/A"} | Soil Moisture: ${soilMoisture?.toFixed(0) || "N/A"}%`,
        });
      }
    } catch (error) {
      console.error("Satellite fetch error:", error);
      toast({
        title: "Satellite Data Unavailable",
        description: "Could not fetch satellite data. Recommendations will use reduced accuracy.",
        variant: "default",
      });
    } finally {
      setIsSatelliteLoading(false);
    }
  }, [formData.state, formData.district, formData.season]);

  const handleSubmit = () => {
    if (!formData.state) {
      toast({
        title: "Location Required",
        description: "Please select your state for accurate recommendations",
        variant: "destructive",
      });
      return;
    }
    onSubmit(formData);
  };

  // Voice input handler
  const handleVoiceResult = useCallback((text: string) => {
    const lowerText = text.toLowerCase();

    // Parse states from voice input
    for (const state of indianStates) {
      if (lowerText.includes(state.name.toLowerCase())) {
        setFormData(d => ({ ...d, state: state.name }));
        toast({ title: "State Updated", description: `Set to ${state.name}` });
        break;
      }
    }

    // Parse soil types
    const soilMappings: Record<string, string> = {
      "black": "Black", "red": "Red", "sandy": "Sandy",
      "loamy": "Loamy", "clay": "Clay", "laterite": "Laterite", "alluvial": "Alluvial",
    };

    for (const [key, value] of Object.entries(soilMappings)) {
      if (lowerText.includes(key)) {
        setFormData(d => ({ ...d, soilType: value }));
        toast({ title: "Soil Type Updated", description: `Set to ${value}` });
        break;
      }
    }

    // Parse seasons
    if (lowerText.includes("kharif") || lowerText.includes("monsoon")) {
      setFormData(d => ({ ...d, season: "Kharif" }));
      toast({ title: "Season Updated", description: "Set to Kharif (Monsoon)" });
    } else if (lowerText.includes("rabi") || lowerText.includes("winter")) {
      setFormData(d => ({ ...d, season: "Rabi" }));
      toast({ title: "Season Updated", description: "Set to Rabi (Winter)" });
    } else if (lowerText.includes("zaid") || lowerText.includes("summer")) {
      setFormData(d => ({ ...d, season: "Zaid" }));
      toast({ title: "Season Updated", description: "Set to Zaid (Summer)" });
    }

    // Parse land type
    if (lowerText.includes("wet") || lowerText.includes("irrigated")) {
      setFormData(d => ({ ...d, landType: "wet" }));
      toast({ title: "Land Type Updated", description: "Set to Wet Land (Irrigated)" });
    } else if (lowerText.includes("dry") || lowerText.includes("rain")) {
      setFormData(d => ({ ...d, landType: "dry" }));
      toast({ title: "Land Type Updated", description: "Set to Dry Land (Rain-fed)" });
    }

    // Parse temperature
    const tempMatch = lowerText.match(/(\d+)\s*(degree|°|celsius|temp)/);
    if (tempMatch) {
      const temp = parseInt(tempMatch[1]);
      if (temp >= 5 && temp <= 45) {
        setFormData(d => ({ ...d, temperature: temp }));
        toast({ title: "Temperature Updated", description: `Set to ${temp}°C` });
      }
    }

    // Parse rainfall
    const rainMatch = lowerText.match(/(\d+)\s*(mm|millimeter|rainfall)/);
    if (rainMatch) {
      const rain = parseInt(rainMatch[1]);
      if (rain >= 100 && rain <= 2000) {
        setFormData(d => ({ ...d, rainfall: rain }));
        toast({ title: "Rainfall Updated", description: `Set to ${rain}mm` });
      }
    }

    // Parse humidity
    const humidityMatch = lowerText.match(/(\d+)\s*(%|percent|humidity)/);
    if (humidityMatch) {
      const humidity = parseInt(humidityMatch[1]);
      if (humidity >= 20 && humidity <= 95) {
        setFormData(d => ({ ...d, humidity }));
        toast({ title: "Humidity Updated", description: `Set to ${humidity}%` });
      }
    }
  }, []);

  const selectedSoil = soilTypeInfo[formData.soilType as keyof typeof soilTypeInfo];
  const selectedSeason = seasonInfo[formData.season as keyof typeof seasonInfo];

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sprout className="h-5 w-5 text-primary" />
            Tell Us About Your Farm
          </CardTitle>
          <div className="flex items-center gap-2">
            <VoiceInput onResult={handleVoiceResult} />
            {isBeginnerMode && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Mic className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-medium">Voice Commands</p>
                    <p className="text-xs mt-1">Try saying:</p>
                    <ul className="text-xs mt-1 space-y-0.5">
                      <li>"Maharashtra black soil"</li>
                      <li>"Kharif season wet land"</li>
                      <li>"Temperature 30 degrees"</li>
                      <li>"Rainfall 800 mm"</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        {isBeginnerMode && (
          <p className="text-sm text-muted-foreground">
            Select your location to <strong>auto-fetch weather</strong> ⛅ and get personalized crop recommendations.
            Hover over <HelpCircle className="inline h-3 w-3" /> for help!
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="state" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                State *
              </Label>
            </div>
            <Select
              value={formData.state}
              onValueChange={(v) => setFormData((d) => ({ ...d, state: v }))}
            >
              <SelectTrigger id="state">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {indianStates.map((state) => (
                  <SelectItem key={state.code} value={state.name}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="district" className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-blue-500" />
                District
              </Label>
            </div>
            <Select
              value={formData.district}
              onValueChange={(v) => setFormData((d) => ({ ...d, district: v }))}
              disabled={!formData.state}
            >
              <SelectTrigger id="district">
                <SelectValue placeholder={formData.state ? "Select district" : "Select state first"} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Village Selector */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="village" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" />
                Village/Mandal
              </Label>
            </div>
            <Select
              value={formData.village}
              onValueChange={(v) => setFormData((d) => ({ ...d, village: v }))}
              disabled={!formData.district || villages.length === 0}
            >
              <SelectTrigger id="village">
                <SelectValue placeholder={formData.district ? "Select village" : "Select district first"} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {villages.map((village) => (
                  <SelectItem key={village} value={village}>
                    {village}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Soil Type */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="soil" className="flex items-center gap-2">
              <Mountain className="h-4 w-4 text-amber-600" />
              Soil Type
            </Label>
            {isBeginnerMode && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>What type of soil does your farm have?</p>
                    <p className="mt-1 text-xs">
                      Not sure? Loamy soil is brown and crumbly. Black soil is dark and sticky.
                      Sandy soil feels gritty.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <Select
            value={formData.soilType}
            onValueChange={(v) => setFormData((d) => ({ ...d, soilType: v }))}
          >
            <SelectTrigger id="soil">
              <SelectValue placeholder="Select soil type" />
            </SelectTrigger>
            <SelectContent>
              {soilTypes.map((soil) => {
                const info = soilTypeInfo[soil as keyof typeof soilTypeInfo];
                return (
                  <SelectItem key={soil} value={soil}>
                    <span className="flex items-center gap-2">
                      <span>{info.icon}</span>
                      {info.name}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {
            isBeginnerMode && selectedSoil && (
              <p className="text-xs text-muted-foreground">{selectedSoil.description}</p>
            )
          }
        </div>

        {/* Auto-fetch Weather + Satellite Buttons */}
        <div className="grid gap-3 md:grid-cols-2">
          {/* Weather Button */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <Cloud className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Weather Data</p>
              <p className="text-xs text-muted-foreground">
                Auto-fill temp, rainfall, humidity
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchWeatherData}
              disabled={isWeatherLoading || !formData.state}
              className="shrink-0"
            >
              {isWeatherLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ...
                </>
              ) : weatherFetched ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </>
              ) : (
                <>
                  <Cloud className="h-4 w-4 mr-1" />
                  Fetch
                </>
              )}
            </Button>
          </div >

          {/* Satellite Button */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/5 border border-accent/20">
            <Satellite className="h-5 w-5 text-accent shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Satellite Data</p>
              <p className="text-xs text-muted-foreground">
                NDVI + Soil Moisture
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSatelliteData}
              disabled={isSatelliteLoading || !formData.state}
              className="shrink-0"
            >
              {isSatelliteLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ...
                </>
              ) : satelliteFetched ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </>
              ) : (
                <>
                  <Satellite className="h-4 w-4 mr-1" />
                  Fetch
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Satellite Data Display (if fetched) */}
        {
          satelliteFetched && (formData.ndvi !== undefined || formData.soilMoisture !== undefined) && (
            <div className="grid gap-2 md:grid-cols-2 p-3 rounded-lg bg-muted/50 border">
              {formData.ndviAvailable && formData.ndvi !== undefined && (
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${formData.ndvi >= 0.6 ? "bg-green-500" : formData.ndvi >= 0.4 ? "bg-amber-500" : "bg-red-500"}`} />
                  <span className="text-sm">NDVI: <strong>{formData.ndvi.toFixed(2)}</strong> ({formData.ndvi >= 0.6 ? "Healthy" : formData.ndvi >= 0.4 ? "Moderate" : "Stressed"})</span>
                </div>
              )}
              {formData.soilMoisture !== undefined && (
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Soil Moisture: <strong>{formData.soilMoisture.toFixed(0)}%</strong> ({formData.soilMoistureLevel || "unknown"})</span>
                </div>
              )}
            </div>
          )
        }

        {/* Season Selection */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              Season
            </Label>
            {isBeginnerMode && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>When do you want to sow?</p>
                    <ul className="mt-1 text-xs space-y-1">
                      <li>🌧️ Kharif: June-Oct (Monsoon)</li>
                      <li>❄️ Rabi: Oct-Mar (Winter)</li>
                      <li>☀️ Zaid: Mar-Jun (Summer)</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {seasons.map((season) => {
              const info = seasonInfo[season as keyof typeof seasonInfo];
              return (
                <button
                  key={season}
                  type="button"
                  onClick={() => setFormData((d) => ({ ...d, season }))}
                  className={`rounded-xl border-2 p-4 text-center transition-all ${formData.season === season
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                    }`}
                >
                  <span className="text-2xl">{info.icon}</span>
                  <p className="mt-1 font-medium text-foreground">{season}</p>
                  <p className="text-xs text-muted-foreground">{info.months}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Land Type */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              Land Type
            </Label>
            {isBeginnerMode && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Do you have irrigation (canal, tube well, pond)?</p>
                    <p className="mt-1 text-xs">
                      Wet land = Can water regularly. Dry land = Depends on rain.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <RadioGroup
            value={formData.landType}
            onValueChange={(v) => setFormData((d) => ({ ...d, landType: v as "dry" | "wet" }))}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="wet" id="wet" />
              <Label htmlFor="wet" className="flex items-center gap-1 cursor-pointer">
                💧 Wet Land (Irrigated)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dry" id="dry" />
              <Label htmlFor="dry" className="flex items-center gap-1 cursor-pointer">
                🏜️ Dry Land (Rain-fed)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Farm History Section (Advanced) */}
        {
          !isBeginnerMode && (
            <div className="space-y-4 p-4 rounded-lg border border-amber-200 bg-amber-50/50 dark:bg-amber-900/10 dark:border-amber-800">
              <div className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-amber-600" />
                <h4 className="font-medium text-foreground">Farm History (for better rotation advice)</h4>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {/* Previous Crop */}
                <div className="space-y-2">
                  <Label className="text-sm">Previous Year Crop</Label>
                  <Select
                    value={formData.previousCrop || ""}
                    onValueChange={(v) => setFormData((d) => ({ ...d, previousCrop: v || undefined }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select previous crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None / New Field</SelectItem>
                      <SelectItem value="rice">Rice / Paddy</SelectItem>
                      <SelectItem value="wheat">Wheat</SelectItem>
                      <SelectItem value="maize">Maize / Corn</SelectItem>
                      <SelectItem value="cotton">Cotton</SelectItem>
                      <SelectItem value="sugarcane">Sugarcane</SelectItem>
                      <SelectItem value="groundnut">Groundnut</SelectItem>
                      <SelectItem value="pulse">Pulses (Dal)</SelectItem>
                      <SelectItem value="vegetables">Vegetables</SelectItem>
                      <SelectItem value="fallow">Fallow / Rest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Previous Crop Water Demand */}
                <div className="space-y-2">
                  <Label className="text-sm">Previous Crop Water Use</Label>
                  <Select
                    value={formData.previousCropWaterDemand || ""}
                    onValueChange={(v) => setFormData((d) => ({ ...d, previousCropWaterDemand: v as SmartInputData["previousCropWaterDemand"] || undefined }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Water demand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Millets, Pulses)</SelectItem>
                      <SelectItem value="medium">Medium (Wheat, Maize)</SelectItem>
                      <SelectItem value="high">High (Rice, Sugarcane)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Soil Impact */}
                <div className="space-y-2">
                  <Label className="text-sm">Soil Condition After</Label>
                  <Select
                    value={formData.previousCropSoilImpact || ""}
                    onValueChange={(v) => setFormData((d) => ({ ...d, previousCropSoilImpact: v as SmartInputData["previousCropSoilImpact"] || undefined }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Soil impact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="improvement">Improved (After pulses)</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="nitrogen_depletion">Nitrogen Depleted</SelectItem>
                      <SelectItem value="moisture_loss">Soil Dried Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )
        }

        {/* Crop Duration Preference */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-primary" />
              Crop Duration Preference
            </Label>
            {isBeginnerMode && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Short-term crops (20-60 days) are safer with quick returns. Long-term crops (60+ days) need more planning.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "any", label: "Any", icon: "🌱", desc: "Show all" },
              { value: "short-term", label: "Short-Term", icon: "⚡", desc: "20-60 days" },
              { value: "long-term", label: "Long-Term", icon: "🌾", desc: "60+ days" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData((d) => ({ ...d, cropDurationPreference: option.value as SmartInputData["cropDurationPreference"] }))}
                className={`rounded-xl border-2 p-3 text-center transition-all ${formData.cropDurationPreference === option.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
                  }`}
              >
                <span className="text-xl">{option.icon}</span>
                <p className="mt-1 text-sm font-medium text-foreground">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Weather Conditions */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                Temperature
              </Label>
              <span className="text-sm font-medium text-primary">{formData.temperature}°C</span>
            </div>
            <Slider
              value={[formData.temperature]}
              onValueChange={([v]) => setFormData((d) => ({ ...d, temperature: v }))}
              min={5}
              max={45}
              step={1}
              className="w-full"
            />
            {isBeginnerMode && (
              <p className="text-xs text-muted-foreground">
                {formData.temperature < 15 ? "Cold" : formData.temperature < 25 ? "Mild" : formData.temperature < 35 ? "Warm" : "Hot"} weather
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-blue-500" />
                Annual Rainfall
              </Label>
              <span className="text-sm font-medium text-primary">{formData.rainfall}mm</span>
            </div>
            <Slider
              value={[formData.rainfall]}
              onValueChange={([v]) => setFormData((d) => ({ ...d, rainfall: v }))}
              min={100}
              max={2000}
              step={50}
              className="w-full"
            />
            {isBeginnerMode && (
              <p className="text-xs text-muted-foreground">
                {formData.rainfall < 500 ? "Low (Arid)" : formData.rainfall < 1000 ? "Medium (Semi-arid)" : "High (Humid)"} rainfall area
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-cyan-500" />
                Humidity
              </Label>
              <span className="text-sm font-medium text-primary">{formData.humidity}%</span>
            </div>
            <Slider
              value={[formData.humidity]}
              onValueChange={([v]) => setFormData((d) => ({ ...d, humidity: v }))}
              min={20}
              max={95}
              step={5}
              className="w-full"
            />
            {isBeginnerMode && (
              <p className="text-xs text-muted-foreground">
                {formData.humidity < 40 ? "Dry air" : formData.humidity < 70 ? "Moderate" : "Humid"}
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          size="lg"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Finding Best Crops...
            </>
          ) : (
            <>
              <Sprout className="h-4 w-4" />
              Get Smart Recommendations
            </>
          )}
        </Button>
      </CardContent >
    </Card >
  );
}
