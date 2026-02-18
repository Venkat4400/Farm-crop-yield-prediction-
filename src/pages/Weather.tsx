import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  Sun,
  CloudRain,
  Cloud,
  CloudLightning,
  CloudSnow,
  RefreshCw,
  MapPin,
  Loader2,
  Calendar,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useWeather } from "@/hooks/useWeather";
import { toast } from "@/hooks/use-toast";
import { CropCalendar } from "@/components/weather/CropCalendar";
import { indianStates, stateDistricts } from "@/data/indianLocations";
import { Input } from "@/components/ui/input";

// Major regions
const majorRegions = [
  { value: "north-india", label: "North India" },
  { value: "south-india", label: "South India" },
  { value: "east-india", label: "East India" },
  { value: "west-india", label: "West India" },
  { value: "central-india", label: "Central India" },
  { value: "northeast-india", label: "Northeast India" },
];

// All locations including states and major districts
const allLocations = [
  ...majorRegions,
  ...indianStates.map(state => ({
    value: state.code.toLowerCase(),
    label: state.name,
    type: "state" as const,
    lat: state.lat,
    lon: state.lon
  }))
];

const getWeatherIcon = (iconName: string) => {
  switch (iconName) {
    case "sun":
      return Sun;
    case "cloud-sun":
      return CloudSun;
    case "cloud":
      return Cloud;
    case "cloud-rain":
      return CloudRain;
    case "cloud-lightning":
      return CloudLightning;
    case "cloud-snow":
      return CloudSnow;
    default:
      return CloudSun;
  }
};

export default function Weather() {
  const [selectedRegion, setSelectedRegion] = useState("north-india");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [activeTab, setActiveTab] = useState("weather");
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, error, fetchWeather } = useWeather();

  // Get current state code if a state is selected
  const selectedState = indianStates.find(s => s.code.toLowerCase() === selectedRegion);
  const availableDistricts = selectedState ? stateDistricts[selectedState.code] || [] : [];

  // Filter locations based on search
  const filteredLocations = searchQuery
    ? allLocations.filter(loc => 
        loc.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allLocations;

  useEffect(() => {
    fetchWeather(selectedRegion);
  }, []);

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSelectedDistrict("");
    
    // Find if it's a state to pass coordinates
    const state = indianStates.find(s => s.code.toLowerCase() === region);
    if (state) {
      fetchWeather(region, state.lat, state.lon);
    } else {
      fetchWeather(region);
    }
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    // For districts, we use the state coordinates as approximation
    if (selectedState) {
      fetchWeather(selectedRegion, selectedState.lat, selectedState.lon);
      toast({
        title: `Weather for ${district}`,
        description: `Showing weather data for ${district}, ${selectedState.name}`,
      });
    }
  };

  const handleRefresh = () => {
    const state = indianStates.find(s => s.code.toLowerCase() === selectedRegion);
    if (state) {
      fetchWeather(selectedRegion, state.lat, state.lon);
    } else {
      fetchWeather(selectedRegion);
    }
    toast({
      title: "Weather Updated",
      description: "Latest weather data has been fetched.",
    });
  };

  const CurrentIcon = data?.current?.icon ? getWeatherIcon(data.current.icon) : Sun;
  
  // Get display name for selected location
  const getDisplayName = () => {
    if (selectedDistrict) {
      return `${selectedDistrict}, ${selectedState?.name}`;
    }
    const location = allLocations.find(l => l.value === selectedRegion);
    return location?.label || data?.region || "Loading...";
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
                <h1 className="text-2xl font-bold text-foreground">Weather Insights</h1>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {getDisplayName()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Region/State Select */}
              <Select value={selectedRegion} onValueChange={handleRegionChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="max-h-[400px]">
                  <div className="px-2 pb-2 sticky top-0 bg-popover z-10">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search locations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 h-9"
                      />
                    </div>
                  </div>
                  
                  {!searchQuery && (
                    <SelectGroup>
                      <SelectLabel>Major Regions</SelectLabel>
                      {majorRegions.map((region) => (
                        <SelectItem key={region.value} value={region.value}>
                          {region.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                  
                  <SelectGroup>
                    <SelectLabel>{searchQuery ? "Search Results" : "States & Union Territories"}</SelectLabel>
                    {(searchQuery ? filteredLocations.filter(l => !majorRegions.some(r => r.value === l.value)) : indianStates).map((item) => {
                      const state = 'code' in item ? item : indianStates.find(s => s.code.toLowerCase() === item.value);
                      return (
                        <SelectItem 
                          key={'code' in item ? item.code.toLowerCase() : item.value} 
                          value={'code' in item ? item.code.toLowerCase() : item.value}
                        >
                          {'code' in item ? item.name : item.label}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* District Select (shown when state is selected) */}
              {availableDistricts.length > 0 && (
                <Select value={selectedDistrict || "all-districts"} onValueChange={(val) => handleDistrictChange(val === "all-districts" ? "" : val)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="all-districts">All Districts</SelectItem>
                    {availableDistricts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="weather" className="flex items-center gap-2">
              <CloudSun className="h-4 w-4" />
              Weather
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Crop Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weather" className="mt-6">
            {error && (
              <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
                {error}
              </div>
            )}

            {isLoading && !data ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : data ? (
              <>
                {/* Current Weather */}
                <div className="mb-8 rounded-2xl border border-border bg-gradient-to-br from-secondary/50 to-accent/20 p-8">
                  <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-accent/20">
                        <CurrentIcon className="h-14 w-14 text-accent animate-pulse-soft" />
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-6xl font-bold text-foreground">{data.current.temperature}</span>
                          <span className="text-2xl text-muted-foreground">°C</span>
                        </div>
                        <p className="text-lg text-muted-foreground">{data.current.condition}</p>
                        <p className="text-sm text-muted-foreground">Feels like {data.current.feelsLike}°C</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                      <div className="text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                          <Droplets className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-xl font-bold text-foreground">{data.current.humidity}%</p>
                        <p className="text-xs text-muted-foreground">Humidity</p>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                          <Wind className="h-6 w-6 text-accent" />
                        </div>
                        <p className="text-xl font-bold text-foreground">{data.current.windSpeed} km/h</p>
                        <p className="text-xs text-muted-foreground">Wind Speed</p>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                          <CloudRain className="h-6 w-6 text-secondary-foreground" />
                        </div>
                        <p className="text-xl font-bold text-foreground">{data.current.precipitation}mm</p>
                        <p className="text-xs text-muted-foreground">Precipitation</p>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                          <Thermometer className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-xl font-bold text-foreground">{data.current.pressure} hPa</p>
                        <p className="text-xs text-muted-foreground">Pressure</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weekly Forecast */}
                <div className="mb-8">
                  <h2 className="mb-4 text-xl font-semibold text-foreground">30-Day Forecast</h2>
                  <div className="grid gap-4 sm:grid-cols-7">
                    {data.forecast.map((day, index) => {
                      const DayIcon = getWeatherIcon(day.icon);
                      return (
                        <div
                          key={day.date}
                          className="rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary/50 hover:shadow-md animate-slide-up"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <p className="text-sm font-medium text-muted-foreground">{day.day}</p>
                          <DayIcon className="mx-auto my-3 h-8 w-8 text-accent" />
                          <p className="text-lg font-bold text-foreground">{day.tempMax}°</p>
                          <p className="text-sm text-muted-foreground">{day.tempMin}°</p>
                          <p className="mt-1 text-xs text-muted-foreground">{day.condition}</p>
                          <div className="mt-2 flex items-center justify-center gap-1 text-xs text-primary">
                            <Droplets className="h-3 w-3" />
                            {day.humidity}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stats */}
                <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    title="Avg. Temperature"
                    value={`${data.stats.avgTemp}°C`}
                    subtitle="This week"
                    icon={Thermometer}
                    variant="accent"
                  />
                  <StatCard
                    title="Total Rainfall"
                    value={`${data.stats.totalRainfall}mm`}
                    subtitle="Expected this week"
                    icon={CloudRain}
                    variant="primary"
                  />
                  <StatCard
                    title="Humidity Range"
                    value={data.stats.humidityRange}
                    subtitle="Weekly variation"
                    icon={Droplets}
                    variant="secondary"
                  />
                  <StatCard
                    title="Farming Conditions"
                    value={data.stats.farmingConditions}
                    subtitle="Overall assessment"
                    icon={CloudSun}
                    variant="default"
                  />
                </div>

                {/* Recommendations */}
                <div>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">Farming Recommendations</h2>
                  <div className="space-y-4">
                    {data.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className={`rounded-xl border p-4 animate-slide-up ${
                          rec.type === "positive"
                            ? "border-primary/30 bg-primary/5"
                            : rec.type === "warning"
                            ? "border-accent/30 bg-accent/5"
                            : "border-border bg-card"
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <h3 className="font-semibold text-foreground">{rec.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{rec.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <CropCalendar selectedRegion={selectedRegion} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
