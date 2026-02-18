/**
 * Production-Grade Smart Crop Recommendation Engine
 * Industry-standard scoring with water, weather, and soil-based logic
 * 
 * Prioritizes:
 * - Short-Term crops for gap farming (quick income, low risk)
 * - Long-Term crops only when conditions are optimal
 */

import { Crop, allCrops, regionClimateData, getCurrentSeason } from "@/data/crops";

// ================================================
// TYPES & INTERFACES
// ================================================
export interface LocalContext {
  state: string;
  district: string;
  soilType: string;
  season: string;
  temperature: number;
  rainfall: number; // mm
  humidity: number;
  irrigationAvailable: boolean;
  availableGapDays?: number; // Days available for gap farming (default: 90)
}

export interface WeatherMatch {
  level: "good" | "moderate" | "poor";
  reason: string;
}

export interface ScoredCrop extends Crop {
  score: number;
  weatherMatch: WeatherMatch;
  waterScore: number;
  recommendation: string;
}

// ================================================
// WATER SCORING FUNCTION
// ================================================
function calculateWaterScore(crop: Crop, availableWaterMm: number): number {
  const required = crop.water.mmPerSeason;
  
  if (availableWaterMm >= required) {
    return 1.0; // Full water availability
  } else if (availableWaterMm >= required * 0.7) {
    return 0.6; // Marginal - can manage with deficit irrigation
  } else {
    return 0.2; // Insufficient - high risk
  }
}

// ================================================
// TEMPERATURE SCORING
// ================================================
function calculateTemperatureScore(crop: Crop, temperature: number): { score: number; fit: boolean } {
  const { min, max } = crop.climate.temperature;
  const optimal = (min + max) / 2;
  
  if (temperature >= min && temperature <= max) {
    // Within range - calculate how close to optimal
    const deviation = Math.abs(temperature - optimal);
    const range = (max - min) / 2;
    const score = 1.0 - (deviation / range) * 0.3; // Max 30% reduction
    return { score: Math.max(0.7, score), fit: true };
  } else if (temperature >= min - 3 && temperature <= max + 3) {
    // Slightly outside range
    return { score: 0.5, fit: false };
  } else {
    // Too far outside range
    return { score: 0.1, fit: false };
  }
}

// ================================================
// SOIL SCORING
// ================================================
function calculateSoilScore(crop: Crop, soilType: string): { score: number; fit: boolean } {
  if (crop.soil.suitable.includes(soilType)) {
    return { score: 1.0, fit: true };
  }
  
  // Loamy soil is generally versatile
  if (crop.soil.suitable.includes("Loamy") && soilType === "Loamy") {
    return { score: 1.0, fit: true };
  }
  
  // Partial match for similar soil types
  const similarSoils: Record<string, string[]> = {
    "Loamy": ["Sandy", "Clay"],
    "Sandy": ["Loamy", "Red"],
    "Red": ["Sandy", "Loamy"],
    "Black": ["Clay", "Loamy"],
    "Clay": ["Black", "Loamy"],
  };
  
  if (similarSoils[soilType]?.some(s => crop.soil.suitable.includes(s))) {
    return { score: 0.6, fit: false };
  }
  
  return { score: 0.3, fit: false };
}

// ================================================
// HUMIDITY SCORING
// ================================================
function calculateHumidityScore(crop: Crop, humidity: number): number {
  const { min, max } = crop.climate.humidity;
  
  if (humidity >= min && humidity <= max) {
    return 1.0;
  } else if (humidity >= min - 10 && humidity <= max + 10) {
    return 0.7;
  }
  return 0.4;
}

// ================================================
// SEASON SCORING
// ================================================
function calculateSeasonScore(crop: Crop, season: string): { score: number; fit: boolean } {
  if (crop.seasons.includes(season)) {
    return { score: 1.0, fit: true };
  }
  
  // Zaid crops can overlap with early Kharif
  if (season === "Kharif" && crop.seasons.includes("Zaid")) {
    return { score: 0.7, fit: true };
  }
  
  // Some overlap between Rabi and late Zaid
  if (season === "Zaid" && crop.seasons.includes("Rabi")) {
    return { score: 0.5, fit: false };
  }
  
  return { score: 0.2, fit: false };
}

// ================================================
// MAIN DECISION SCORING ENGINE
// ================================================
export function calculateCropScore(crop: Crop, context: LocalContext): ScoredCrop {
  // Calculate available water (rainfall + irrigation bonus)
  const irrigationBonus = context.irrigationAvailable ? 200 : 0;
  const availableWaterMm = context.rainfall + irrigationBonus;
  
  // Calculate individual scores
  const waterScore = calculateWaterScore(crop, availableWaterMm);
  const tempResult = calculateTemperatureScore(crop, context.temperature);
  const soilResult = calculateSoilScore(crop, context.soilType);
  const humidityScore = calculateHumidityScore(crop, context.humidity);
  const seasonResult = calculateSeasonScore(crop, context.season);
  
  // ================================================
  // WEIGHTED SCORING LOGIC
  // ================================================
  let score = 0;
  
  // 1. Duration Type Priority (40 points max for short-term)
  if (crop.duration.durationType === "short-term") {
    score += 40;
  } else {
    // Long-term crops only get bonus if ALL conditions are good
    if (waterScore >= 0.8 && tempResult.fit && soilResult.fit && seasonResult.fit) {
      score += 20;
    } else {
      score += 5; // Minimal score for long-term in suboptimal conditions
    }
  }
  
  // 2. Water Score (20 points max)
  score += waterScore * 20;
  
  // 3. Temperature Fit (20 points max)
  score += tempResult.score * 20;
  
  // 4. Soil Fit (10 points max)
  score += soilResult.score * 10;
  
  // 5. Profit Level (10 points max)
  if (crop.economics.profitLevel === "high") {
    score += 10;
  } else if (crop.economics.profitLevel === "medium") {
    score += 5;
  }
  
  // 6. Gap Farming Suitability Bonus
  if (crop.gapFarming.suitable) {
    score += 8;
  }
  
  // 7. Season Fit Modifier
  if (!seasonResult.fit) {
    score *= 0.6; // 40% penalty for wrong season
  }
  
  // 8. Check if crop fits in available gap days
  const availableGapDays = context.availableGapDays || 90;
  if (crop.duration.maxDays > availableGapDays) {
    score *= 0.5; // 50% penalty if doesn't fit in gap
  }
  
  // ================================================
  // WEATHER MATCH DETERMINATION
  // ================================================
  const avgConditionScore = (waterScore + tempResult.score + humidityScore) / 3;
  let weatherMatch: WeatherMatch;
  
  if (avgConditionScore >= 0.8 && tempResult.fit) {
    weatherMatch = {
      level: "good",
      reason: `Current ${context.temperature}°C and ${context.rainfall}mm rainfall matches crop needs well`,
    };
  } else if (avgConditionScore >= 0.5) {
    weatherMatch = {
      level: "moderate",
      reason: `Weather conditions are acceptable but not optimal for this crop`,
    };
  } else {
    weatherMatch = {
      level: "poor",
      reason: `Current weather may stress this crop. Consider irrigation or timing`,
    };
  }
  
  // ================================================
  // GENERATE HUMAN RECOMMENDATION
  // ================================================
  let recommendation: string;
  
  if (crop.duration.durationType === "short-term" && crop.gapFarming.suitable) {
    recommendation = `This crop is recommended because current rainfall (${context.rainfall}mm), ${context.soilType} soil, and ${context.season} season support quick harvest with low risk. ${crop.gapFarming.reason}`;
  } else if (crop.duration.durationType === "long-term" && score >= 70) {
    recommendation = `Weather window is stable with sufficient water (${availableWaterMm}mm available). Soil supports long duration growth. Suitable for main season planning.`;
  } else if (crop.duration.durationType === "long-term") {
    recommendation = `Consider only if you have stable irrigation and can commit to ${crop.duration.minDays}-${crop.duration.maxDays} days. Current conditions require careful management.`;
  } else {
    recommendation = `${crop.gapFarming.reason || "Suitable for current conditions."}`;
  }
  
  return {
    ...crop,
    score: Math.round(score),
    weatherMatch,
    waterScore: Math.round(waterScore * 100),
    recommendation,
  };
}

// ================================================
// MAIN RECOMMENDATION FUNCTION
// ================================================
export function getSmartRecommendations(context: LocalContext): ScoredCrop[] {
  // Score all crops
  const scoredCrops = allCrops.map(crop => calculateCropScore(crop, context));
  
  // Sort by score (highest first)
  // For same score, prefer shorter duration
  scoredCrops.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.duration.maxDays - b.duration.maxDays;
  });
  
  // Filter out very low scores and return top 12
  return scoredCrops
    .filter(crop => crop.score >= 30)
    .slice(0, 12);
}

// ================================================
// UTILITY: Get region defaults
// ================================================
export function getRegionDefaults(district: string): LocalContext | null {
  const data = regionClimateData[district];
  if (!data) return null;
  
  const currentMonth = new Date().getMonth() + 1;
  
  return {
    state: "",
    district,
    soilType: data.soilTypes[0],
    season: getCurrentSeason(currentMonth),
    temperature: data.avgTemperature,
    rainfall: data.avgRainfall,
    humidity: data.avgHumidity,
    irrigationAvailable: false,
  };
}

// ================================================
// UTILITY: Get season-based advice
// ================================================
export function getSeasonalAdvice(context: LocalContext): string {
  const { season, state, district, soilType } = context;
  const month = new Date().toLocaleString('default', { month: 'long' });
  
  if (season === "Kharif") {
    return `It is ${month} in ${district || state || "your region"} with ${soilType} soil. Monsoon conditions favor short-term leafy vegetables and gap crops for quick returns with low risk.`;
  } else if (season === "Rabi") {
    return `It is ${month} in ${district || state || "your region"} with cooler temperatures. Both short-term greens and long-term crops are viable with proper irrigation.`;
  } else {
    return `It is ${month} (Zaid season) in ${district || state || "your region"}. Focus on heat-tolerant short-term crops like Okra, Cucumber, and gourds for gap farming.`;
  }
}
