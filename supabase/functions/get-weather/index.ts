import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Open-Meteo API (free, no API key required) - supports up to 16-day forecast
// For extended 30-day forecast, we use historical data + seasonal patterns
const WEATHER_API_BASE = "https://api.open-meteo.com/v1/forecast";
const HISTORICAL_API_BASE = "https://archive-api.open-meteo.com/v1/archive";

// Indian states coordinates mapping
const stateCoordinates: Record<string, { lat: number; lon: number; name: string }> = {
  "AP": { lat: 15.9129, lon: 79.74, name: "Andhra Pradesh" },
  "AR": { lat: 28.218, lon: 94.7278, name: "Arunachal Pradesh" },
  "AS": { lat: 26.2006, lon: 92.9376, name: "Assam" },
  "BR": { lat: 25.0961, lon: 85.3131, name: "Bihar" },
  "CG": { lat: 21.2787, lon: 81.8661, name: "Chhattisgarh" },
  "GA": { lat: 15.2993, lon: 74.124, name: "Goa" },
  "GJ": { lat: 22.2587, lon: 71.1924, name: "Gujarat" },
  "HR": { lat: 29.0588, lon: 76.0856, name: "Haryana" },
  "HP": { lat: 31.1048, lon: 77.1734, name: "Himachal Pradesh" },
  "JH": { lat: 23.6102, lon: 85.2799, name: "Jharkhand" },
  "KA": { lat: 15.3173, lon: 75.7139, name: "Karnataka" },
  "KL": { lat: 10.8505, lon: 76.2711, name: "Kerala" },
  "MP": { lat: 22.9734, lon: 78.6569, name: "Madhya Pradesh" },
  "MH": { lat: 19.7515, lon: 75.7139, name: "Maharashtra" },
  "MN": { lat: 24.6637, lon: 93.9063, name: "Manipur" },
  "ML": { lat: 25.467, lon: 91.3662, name: "Meghalaya" },
  "MZ": { lat: 23.1645, lon: 92.9376, name: "Mizoram" },
  "NL": { lat: 26.1584, lon: 94.5624, name: "Nagaland" },
  "OD": { lat: 20.9517, lon: 85.0985, name: "Odisha" },
  "PB": { lat: 31.1471, lon: 75.3412, name: "Punjab" },
  "RJ": { lat: 27.0238, lon: 74.2179, name: "Rajasthan" },
  "SK": { lat: 27.533, lon: 88.5122, name: "Sikkim" },
  "TN": { lat: 11.1271, lon: 78.6569, name: "Tamil Nadu" },
  "TS": { lat: 18.1124, lon: 79.0193, name: "Telangana" },
  "TR": { lat: 23.9408, lon: 91.9882, name: "Tripura" },
  "UP": { lat: 26.8467, lon: 80.9462, name: "Uttar Pradesh" },
  "UK": { lat: 30.0668, lon: 79.0193, name: "Uttarakhand" },
  "WB": { lat: 22.9868, lon: 87.855, name: "West Bengal" },
  "DL": { lat: 28.7041, lon: 77.1025, name: "Delhi" },
  "JK": { lat: 33.7782, lon: 76.5762, name: "Jammu & Kashmir" },
  "LA": { lat: 34.1526, lon: 77.5771, name: "Ladakh" },
  // Legacy region mappings for backward compatibility
  "north-india": { lat: 28.6139, lon: 77.209, name: "North India (Delhi)" },
  "south-india": { lat: 13.0827, lon: 80.2707, name: "South India (Chennai)" },
  "east-india": { lat: 22.5726, lon: 88.3639, name: "East India (Kolkata)" },
  "west-india": { lat: 19.076, lon: 72.8777, name: "West India (Mumbai)" },
  "central-india": { lat: 23.2599, lon: 77.4126, name: "Central India (Bhopal)" },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { region = "north-india", lat: customLat, lon: customLon, days = 16 } = await req.json();
    
    // Use custom coordinates if provided, otherwise use state/region mapping
    let coords: { lat: number; lon: number; name: string };
    if (customLat && customLon) {
      coords = { lat: customLat, lon: customLon, name: "Custom Location" };
    } else {
      coords = stateCoordinates[region] || stateCoordinates["north-india"];
    }
    
    console.log(`Fetching weather for ${coords.name} (${coords.lat}, ${coords.lon}) - ${days} days`);
    
    // Fetch weather data from Open-Meteo (max 16 days forecast)
    const forecastDays = Math.min(days, 16);
    const forecastUrl = `${WEATHER_API_BASE}?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean,precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_days=${forecastDays}`;
    
    const forecastResponse = await fetch(forecastUrl);
    
    if (!forecastResponse.ok) {
      throw new Error(`Weather API error: ${forecastResponse.status}`);
    }
    
    const forecastData = await forecastResponse.json();
    
    // For extended forecast (days 17-30), use historical data from same period last year
    let extendedForecast: any[] = [];
    if (days > 16) {
      try {
        const today = new Date();
        const lastYear = new Date(today);
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        
        // Get dates for the extended period (days 17-30) from last year
        const startDate = new Date(lastYear);
        startDate.setDate(startDate.getDate() + 16);
        const endDate = new Date(lastYear);
        endDate.setDate(endDate.getDate() + Math.min(days - 1, 29));
        
        const startStr = startDate.toISOString().split('T')[0];
        const endStr = endDate.toISOString().split('T')[0];
        
        const historicalUrl = `${HISTORICAL_API_BASE}?latitude=${coords.lat}&longitude=${coords.lon}&start_date=${startStr}&end_date=${endStr}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean,wind_speed_10m_max&timezone=auto`;
        
        console.log(`Fetching historical data for extended forecast: ${historicalUrl}`);
        
        const historicalResponse = await fetch(historicalUrl);
        
        if (historicalResponse.ok) {
          const historicalData = await historicalResponse.json();
          
          if (historicalData.daily) {
            // Map historical data to extended forecast
            const futureDates: string[] = [];
            for (let i = 16; i < days && i < 30; i++) {
              const futureDate = new Date(today);
              futureDate.setDate(futureDate.getDate() + i);
              futureDates.push(futureDate.toISOString().split('T')[0]);
            }
            
            extendedForecast = historicalData.daily.time.slice(0, futureDates.length).map((date: string, index: number) => ({
              date: futureDates[index],
              temperature_2m_max: historicalData.daily.temperature_2m_max[index],
              temperature_2m_min: historicalData.daily.temperature_2m_min[index],
              precipitation_sum: historicalData.daily.precipitation_sum[index],
              relative_humidity_2m_mean: historicalData.daily.relative_humidity_2m_mean[index],
              wind_speed_10m_max: historicalData.daily.wind_speed_10m_max[index],
              weather_code: historicalData.daily.weather_code[index],
              isHistoricalBased: true,
            }));
          }
        }
      } catch (histError) {
        console.log("Could not fetch historical data for extended forecast:", histError);
      }
    }
    
    // Map weather codes to conditions
    const getWeatherCondition = (code: number): string => {
      if (code === 0) return "Clear";
      if (code <= 3) return "Partly Cloudy";
      if (code <= 48) return "Foggy";
      if (code <= 57) return "Drizzle";
      if (code <= 67) return "Rain";
      if (code <= 77) return "Snow";
      if (code <= 82) return "Showers";
      if (code <= 99) return "Thunderstorm";
      return "Unknown";
    };
    
    const getWeatherIcon = (code: number): string => {
      if (code === 0) return "sun";
      if (code <= 3) return "cloud-sun";
      if (code <= 48) return "cloud";
      if (code <= 67) return "cloud-rain";
      if (code <= 77) return "cloud-snow";
      if (code <= 99) return "cloud-lightning";
      return "cloud";
    };
    
    // Current weather
    const current = {
      temperature: Math.round(forecastData.current.temperature_2m),
      feelsLike: Math.round(forecastData.current.apparent_temperature),
      humidity: forecastData.current.relative_humidity_2m,
      precipitation: forecastData.current.precipitation,
      windSpeed: Math.round(forecastData.current.wind_speed_10m),
      pressure: Math.round(forecastData.current.surface_pressure),
      condition: getWeatherCondition(forecastData.current.weather_code),
      icon: getWeatherIcon(forecastData.current.weather_code),
    };
    
    // Build complete forecast
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    // First 16 days from Open-Meteo forecast
    const baseForecast = forecastData.daily.time.map((date: string, index: number) => {
      const d = new Date(date);
      return {
        day: dayNames[d.getDay()],
        date: date,
        tempMax: Math.round(forecastData.daily.temperature_2m_max[index]),
        tempMin: Math.round(forecastData.daily.temperature_2m_min[index]),
        precipitation: forecastData.daily.precipitation_sum[index] || 0,
        precipitationProbability: forecastData.daily.precipitation_probability_max?.[index] || 0,
        humidity: forecastData.daily.relative_humidity_2m_mean[index],
        windSpeed: Math.round(forecastData.daily.wind_speed_10m_max?.[index] || 0),
        condition: getWeatherCondition(forecastData.daily.weather_code[index]),
        icon: getWeatherIcon(forecastData.daily.weather_code[index]),
        isHistoricalBased: false,
      };
    });
    
    // Add extended forecast (days 17-30) based on historical data
    const extendedForecastMapped = extendedForecast.map((day: any) => {
      const d = new Date(day.date);
      return {
        day: dayNames[d.getDay()],
        date: day.date,
        tempMax: Math.round(day.temperature_2m_max),
        tempMin: Math.round(day.temperature_2m_min),
        precipitation: day.precipitation_sum || 0,
        precipitationProbability: day.precipitation_sum > 0 ? 60 : 20, // Estimated
        humidity: Math.round(day.relative_humidity_2m_mean),
        windSpeed: Math.round(day.wind_speed_10m_max || 0),
        condition: getWeatherCondition(day.weather_code),
        icon: getWeatherIcon(day.weather_code),
        isHistoricalBased: true,
      };
    });
    
    const forecast = [...baseForecast, ...extendedForecastMapped];
    
    // Calculate stats
    const avgTemp = Math.round(forecast.reduce((sum: number, day: any) => sum + (day.tempMax + day.tempMin) / 2, 0) / forecast.length);
    const totalRainfall = Math.round(forecast.reduce((sum: number, day: any) => sum + day.precipitation, 0));
    const humidityRange = {
      min: Math.min(...forecast.map((d: any) => d.humidity)),
      max: Math.max(...forecast.map((d: any) => d.humidity)),
    };
    
    // Generate farming recommendations based on weather
    const recommendations = [];
    
    const rainyDays = forecast.filter((d: any) => d.precipitation > 5).length;
    const avgHumidity = forecast.reduce((sum: number, d: any) => sum + d.humidity, 0) / forecast.length;
    const heavyRainDays = forecast.filter((d: any) => d.precipitation > 20).length;
    
    if (rainyDays >= 5) {
      recommendations.push({
        title: "Extended Rain Period",
        description: `Rain expected on ${rainyDays} days over the next ${forecast.length} days. Plan irrigation and drainage accordingly. Consider waterlogging-resistant crop varieties.`,
        type: "info",
      });
    } else if (rainyDays >= 2) {
      recommendations.push({
        title: "Irrigation Advisory",
        description: `Rain expected on ${rainyDays} days. Consider reducing irrigation schedules to prevent waterlogging.`,
        type: "info",
      });
    }
    
    if (heavyRainDays > 3) {
      recommendations.push({
        title: "Flood Risk Alert",
        description: "Multiple days of heavy rainfall predicted. Ensure proper drainage and protect seedlings. Delay sowing if possible.",
        type: "warning",
      });
    }
    
    if (avgTemp >= 25 && avgTemp <= 30 && totalRainfall > 10 && totalRainfall < 300) {
      recommendations.push({
        title: "Optimal Planting Window",
        description: "Current weather conditions are favorable for planting rice, wheat, and pulses. Good time for Kharif/Rabi sowing.",
        type: "positive",
      });
    }
    
    if (avgHumidity > 75) {
      recommendations.push({
        title: "Pest Alert",
        description: "High humidity levels may increase pest and fungal activity. Monitor crops closely for signs of disease. Consider preventive fungicide application.",
        type: "warning",
      });
    }
    
    if (current.temperature > 35) {
      recommendations.push({
        title: "Heat Stress Warning",
        description: "High temperatures may stress crops. Ensure adequate irrigation, mulching, and consider shade nets for sensitive crops.",
        type: "warning",
      });
    }
    
    if (avgTemp < 15) {
      recommendations.push({
        title: "Cold Weather Advisory",
        description: "Cold temperatures expected. Protect frost-sensitive crops with covers. Good conditions for wheat and mustard.",
        type: "info",
      });
    }
    
    if (totalRainfall < 20 && forecast.length >= 14) {
      recommendations.push({
        title: "Dry Spell Expected",
        description: "Low rainfall predicted for the coming weeks. Plan irrigation and consider drought-tolerant varieties. Mulching recommended.",
        type: "warning",
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        title: "Stable Conditions",
        description: "Weather conditions are stable. Good time for regular farming activities including sowing, fertilizing, and harvesting.",
        type: "positive",
      });
    }
    
    // Determine farming conditions rating
    let farmingConditions = "Good";
    if (avgTemp > 40 || avgTemp < 5 || totalRainfall > 500 || heavyRainDays > 5) {
      farmingConditions = "Poor";
    } else if (rainyDays > 10 || avgHumidity > 85 || avgTemp > 38) {
      farmingConditions = "Fair";
    } else if (avgTemp >= 20 && avgTemp <= 32 && totalRainfall >= 20 && totalRainfall <= 200) {
      farmingConditions = "Excellent";
    }
    
    // Weekly summary for easier viewing
    const weeklySummary = [];
    for (let i = 0; i < forecast.length; i += 7) {
      const weekData = forecast.slice(i, Math.min(i + 7, forecast.length));
      const weekNum = Math.floor(i / 7) + 1;
      weeklySummary.push({
        week: `Week ${weekNum}`,
        startDate: weekData[0]?.date,
        endDate: weekData[weekData.length - 1]?.date,
        avgTempMax: Math.round(weekData.reduce((s, d) => s + d.tempMax, 0) / weekData.length),
        avgTempMin: Math.round(weekData.reduce((s, d) => s + d.tempMin, 0) / weekData.length),
        totalRain: Math.round(weekData.reduce((s, d) => s + d.precipitation, 0)),
        rainyDays: weekData.filter(d => d.precipitation > 2).length,
        avgHumidity: Math.round(weekData.reduce((s, d) => s + d.humidity, 0) / weekData.length),
      });
    }
    
    // Calculate enhanced rainfall features for ML accuracy
    const dailyPrecip = forecast.map((d: any) => d.precipitation);
    
    // Max 3-day rainfall (rolling window)
    let max3DayRainfall = 0;
    for (let i = 0; i < dailyPrecip.length - 2; i++) {
      const sum3Day = dailyPrecip[i] + dailyPrecip[i + 1] + dailyPrecip[i + 2];
      max3DayRainfall = Math.max(max3DayRainfall, sum3Day);
    }
    
    // Dry spell days (consecutive days with <2mm)
    let maxDrySpell = 0;
    let currentDrySpell = 0;
    for (const precip of dailyPrecip) {
      if (precip < 2) {
        currentDrySpell++;
        maxDrySpell = Math.max(maxDrySpell, currentDrySpell);
      } else {
        currentDrySpell = 0;
      }
    }
    
    // Ensure minimum safe rainfall values (never return 0 for valid regions)
    // Historical seasonal minimums as fallback
    const seasonalMinimum: Record<string, number> = {
      "north-india": 150,
      "south-india": 250,
      "east-india": 300,
      "west-india": 200,
      "central-india": 180,
    };
    
    // Apply minimum safe value if totalRainfall is near zero
    let effectiveTotalRainfall = totalRainfall;
    let rainfallEstimated = false;
    
    if (totalRainfall < 10) {
      // Use historical minimum for the region
      const regionKey = Object.keys(stateCoordinates)
        .find(key => stateCoordinates[key].name === coords.name) || region;
      const baseRegion = regionKey.includes("india") ? regionKey : 
        regionKey.match(/^(AP|TS|KA|KL|TN)$/i) ? "south-india" :
        regionKey.match(/^(WB|OD|BR|JH|AS|AR|MN|ML|MZ|NL|TR|SK)$/i) ? "east-india" :
        regionKey.match(/^(MH|GJ|GA)$/i) ? "west-india" :
        regionKey.match(/^(MP|CG)$/i) ? "central-india" : "north-india";
      
      effectiveTotalRainfall = seasonalMinimum[baseRegion] || 150;
      rainfallEstimated = true;
      console.log(`Low rainfall detected (${totalRainfall}mm). Using historical minimum: ${effectiveTotalRainfall}mm`);
    }
    
    return new Response(JSON.stringify({
      success: true,
      region: coords.name,
      coordinates: { lat: coords.lat, lon: coords.lon },
      forecastDays: forecast.length,
      current,
      forecast,
      weeklySummary,
      stats: {
        avgTemp,
        totalRainfall: effectiveTotalRainfall, // Use safe minimum
        actualTotalRainfall: totalRainfall, // Keep actual for reference
        humidityRange: `${humidityRange.min}-${humidityRange.max}%`,
        farmingConditions,
        rainyDays,
        heavyRainDays,
        // NEW: Enhanced rainfall features for ML
        rainfallEstimated,
        max3DayRainfall: Math.round(max3DayRainfall),
        maxDrySpellDays: maxDrySpell,
        avgDailyRainfall: Math.round((effectiveTotalRainfall / forecast.length) * 10) / 10,
      },
      recommendations,
      note: rainfallEstimated 
        ? `Rainfall data supplemented with historical averages (${effectiveTotalRainfall}mm). Actual recorded: ${totalRainfall}mm.`
        : extendedForecast.length > 0 
          ? "Extended forecast (days 17-30) is based on historical weather patterns and may be less accurate." 
          : undefined,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch weather data' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
