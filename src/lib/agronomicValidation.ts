/**
 * Agronomic Validation Engine
 * Validates crop-season-water compatibility and provides warnings
 */

export interface CropWaterRequirements {
  minRainfall: number;
  maxRainfall: number;
  waterCategory: "low" | "medium" | "high";
  optimalIrrigation: string[];
  droughtTolerance: "low" | "medium" | "high";
}

export interface SeasonCropCompatibility {
  optimal: string[];
  acceptable: string[];
  notRecommended: string[];
}

export interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  recommendations: string[];
  reliabilityImpact: number; // Negative values reduce confidence
}

// Crop water requirements database (mm per season - 4 MONTH CUMULATIVE)
export const cropWaterRequirements: Record<string, CropWaterRequirements> = {
  rice: { minRainfall: 1000, maxRainfall: 2000, waterCategory: "high", optimalIrrigation: ["flood", "canal"], droughtTolerance: "low" },
  sugarcane: { minRainfall: 1500, maxRainfall: 2500, waterCategory: "high", optimalIrrigation: ["drip", "flood"], droughtTolerance: "low" },
  jute: { minRainfall: 1200, maxRainfall: 2000, waterCategory: "high", optimalIrrigation: ["canal", "flood"], droughtTolerance: "low" },
  banana: { minRainfall: 1000, maxRainfall: 2000, waterCategory: "high", optimalIrrigation: ["drip", "sprinkler"], droughtTolerance: "low" },
  
  wheat: { minRainfall: 400, maxRainfall: 800, waterCategory: "medium", optimalIrrigation: ["canal", "sprinkler"], droughtTolerance: "medium" },
  maize: { minRainfall: 500, maxRainfall: 1000, waterCategory: "medium", optimalIrrigation: ["sprinkler", "drip"], droughtTolerance: "medium" },
  corn: { minRainfall: 500, maxRainfall: 1000, waterCategory: "medium", optimalIrrigation: ["sprinkler", "drip"], droughtTolerance: "medium" },
  cotton: { minRainfall: 500, maxRainfall: 1000, waterCategory: "medium", optimalIrrigation: ["drip", "sprinkler"], droughtTolerance: "medium" },
  potato: { minRainfall: 500, maxRainfall: 800, waterCategory: "medium", optimalIrrigation: ["drip", "sprinkler"], droughtTolerance: "medium" },
  soybean: { minRainfall: 450, maxRainfall: 700, waterCategory: "medium", optimalIrrigation: ["sprinkler", "drip"], droughtTolerance: "medium" },
  groundnut: { minRainfall: 500, maxRainfall: 700, waterCategory: "medium", optimalIrrigation: ["sprinkler", "drip"], droughtTolerance: "medium" },
  sunflower: { minRainfall: 400, maxRainfall: 600, waterCategory: "medium", optimalIrrigation: ["drip", "sprinkler"], droughtTolerance: "medium" },
  
  bajra: { minRainfall: 250, maxRainfall: 600, waterCategory: "low", optimalIrrigation: ["rainfed", "sprinkler"], droughtTolerance: "high" },
  jowar: { minRainfall: 300, maxRainfall: 600, waterCategory: "low", optimalIrrigation: ["rainfed", "sprinkler"], droughtTolerance: "high" },
  mustard: { minRainfall: 250, maxRainfall: 450, waterCategory: "low", optimalIrrigation: ["rainfed", "sprinkler"], droughtTolerance: "high" },
  chickpea: { minRainfall: 250, maxRainfall: 500, waterCategory: "low", optimalIrrigation: ["rainfed", "sprinkler"], droughtTolerance: "high" },
  gram: { minRainfall: 250, maxRainfall: 500, waterCategory: "low", optimalIrrigation: ["rainfed", "sprinkler"], droughtTolerance: "high" },
  barley: { minRainfall: 300, maxRainfall: 500, waterCategory: "low", optimalIrrigation: ["rainfed", "canal"], droughtTolerance: "high" },
};

// Irrigation water contribution per season (mm) based on type
export const irrigationSeasonalContribution: Record<string, number> = {
  rainfed: 0,
  canal: 400,
  borewell: 350,
  drip: 300,
  sprinkler: 350,
  flood: 500,
};

// Soil water retention factor by soil type
export const soilRetentionFactor: Record<string, number> = {
  loamy: 0.35,
  clay: 0.45,
  sandy: 0.20,
  silt: 0.40,
  alluvial: 0.38,
  black: 0.42,
  red: 0.30,
  laterite: 0.25,
  peat: 0.50,
  chalky: 0.28,
  saline: 0.22,
};

// Season-crop compatibility
export const seasonCropCompatibility: Record<string, SeasonCropCompatibility> = {
  kharif: {
    optimal: ["rice", "cotton", "maize", "corn", "groundnut", "soybean", "bajra", "jowar", "jute", "sugarcane"],
    acceptable: ["sunflower", "potato"],
    notRecommended: ["wheat", "mustard", "chickpea", "gram", "barley"],
  },
  rabi: {
    optimal: ["wheat", "mustard", "chickpea", "gram", "barley", "potato", "sunflower"],
    acceptable: ["maize", "cotton"],
    notRecommended: ["rice", "jute", "bajra"],
  },
  zaid: {
    optimal: ["sunflower", "groundnut", "watermelon", "cucumber", "muskmelon"],
    acceptable: ["maize", "corn", "sugarcane"],
    notRecommended: ["wheat", "rice", "cotton", "mustard"],
  },
};

// Irrigation efficiency factors (water availability multiplier)
export const irrigationEfficiency: Record<string, number> = {
  rainfed: 1.0,
  canal: 1.8,
  borewell: 1.5,
  drip: 2.5,
  sprinkler: 2.0,
  flood: 1.4,
};

// Historical SEASONAL rainfall by region (4-month cumulative in mm)
export const historicalSeasonalRainfall: Record<string, Record<string, number>> = {
  "north-india": { kharif: 650, rabi: 100, zaid: 50 },
  "south-india": { kharif: 800, rabi: 250, zaid: 100 },
  "east-india": { kharif: 1100, rabi: 150, zaid: 80 },
  "west-india": { kharif: 700, rabi: 80, zaid: 40 },
  "central-india": { kharif: 900, rabi: 100, zaid: 60 },
};

// Profit classification thresholds and labels
export interface ProfitClassification {
  profit: number;
  revenue: number;
  costPerHectare: number;
  profitCategory: string;
  profitLevel: "exultant" | "highly_profitable" | "good" | "mid" | "normal" | "bad" | "loss";
}

// MSP prices (₹/kg) for major crops
export const cropMSP: Record<string, number> = {
  rice: 23,
  wheat: 22,
  maize: 20,
  cotton: 62,
  sugarcane: 3.15, // per kg
  groundnut: 60,
  soybean: 45,
  bajra: 24,
  jowar: 32,
  mustard: 55,
  gram: 55,
  barley: 18,
  jute: 50,
  potato: 15,
  sunflower: 65,
  chickpea: 55,
  corn: 20,
};

// Cultivation cost per hectare (₹)
export const cropCultivationCost: Record<string, number> = {
  rice: 42000,
  wheat: 35000,
  maize: 32000,
  cotton: 48000,
  sugarcane: 85000,
  groundnut: 38000,
  soybean: 28000,
  bajra: 18000,
  jowar: 20000,
  mustard: 25000,
  gram: 22000,
  barley: 20000,
  jute: 35000,
  potato: 55000,
  sunflower: 30000,
  chickpea: 22000,
  corn: 32000,
};

/**
 * Calculate profit classification (7 levels)
 */
export function calculateProfitClassification(
  yieldKgPerHa: number,
  crop: string
): ProfitClassification {
  const cropLower = crop.toLowerCase();
  const msp = cropMSP[cropLower] || 25; // Default MSP
  const cost = cropCultivationCost[cropLower] || 35000; // Default cost
  
  const revenue = yieldKgPerHa * msp;
  const profit = revenue - cost;
  
  let profitCategory: string;
  let profitLevel: ProfitClassification["profitLevel"];
  
  if (profit >= 60000) {
    profitCategory = "Exultant (Highly Profitable)";
    profitLevel = "exultant";
  } else if (profit >= 40000) {
    profitCategory = "Highly Profitable";
    profitLevel = "highly_profitable";
  } else if (profit >= 25000) {
    profitCategory = "Good";
    profitLevel = "good";
  } else if (profit >= 15000) {
    profitCategory = "Mid-Level";
    profitLevel = "mid";
  } else if (profit >= 5000) {
    profitCategory = "Normal";
    profitLevel = "normal";
  } else if (profit >= 0) {
    profitCategory = "Bad (Low Margin)";
    profitLevel = "bad";
  } else {
    profitCategory = "Don't Do (Loss Expected)";
    profitLevel = "loss";
  }
  
  return {
    profit: Math.round(profit),
    revenue: Math.round(revenue),
    costPerHectare: cost,
    profitCategory,
    profitLevel,
  };
}

/**
 * Estimate root-zone soil moisture from seasonal water availability
 * (NOT snapshot satellite - this is 4-month cumulative)
 */
export function estimateRootZoneMoisture(
  seasonalRainfall: number,
  irrigationType: string,
  soilType: string
): { moisture: number; level: "very_low" | "low" | "moderate" | "high"; isEstimated: boolean } {
  const soilLower = soilType.toLowerCase();
  const irrigationLower = irrigationType?.toLowerCase() || "rainfed";
  
  const retentionFactor = soilRetentionFactor[soilLower] || 0.30;
  const irrigationContribution = irrigationSeasonalContribution[irrigationLower] || 0;
  
  const totalWater = seasonalRainfall + irrigationContribution;
  
  // Root-zone moisture estimation: (rainfall + irrigation) * retention / scaling
  const moisture = Math.min(45, (totalWater * retentionFactor) / 10);
  
  let level: "very_low" | "low" | "moderate" | "high";
  if (moisture < 1) {
    level = "very_low";
  } else if (moisture < 20) {
    level = "low";
  } else if (moisture < 40) {
    level = "moderate";
  } else {
    level = "high";
  }
  
  return {
    moisture: Math.round(moisture * 10) / 10,
    level,
    isEstimated: true,
  };
}

/**
 * Calculate SEASONAL effective water availability (4-month cumulative)
 * NOT snapshot - uses historical + irrigation contribution
 */
export function calculateEffectiveWater(
  inputRainfall: number,
  irrigationType: string | undefined,
  season: string,
  region: string
): { effectiveWater: number; seasonalRainfall: number; irrigationContribution: number; source: string; isEstimated: boolean } {
  const seasonLower = season.toLowerCase();
  const regionLower = region.toLowerCase();
  const irrigationLower = (irrigationType || "rainfed").toLowerCase();
  
  // Get irrigation contribution (seasonal - 4 months)
  const irrigationContribution = irrigationSeasonalContribution[irrigationLower] || 0;
  
  // Get historical seasonal rainfall as base
  const historicalRain = historicalSeasonalRainfall[regionLower]?.[seasonLower] || 500;
  
  let seasonalRainfall: number;
  let source: string;
  let isEstimated: boolean;
  
  // If input rainfall is zero/missing, use historical seasonal data
  if (!inputRainfall || inputRainfall === 0) {
    seasonalRainfall = historicalRain;
    isEstimated = true;
    source = irrigationContribution > 0 
      ? `Historical (${historicalRain}mm) + ${irrigationType} (${irrigationContribution}mm)`
      : `Historical seasonal average (${historicalRain}mm)`;
  } else {
    // If user provided rainfall, treat it as seasonal estimate
    // (multiply by 4 if it looks like monthly data < 300mm)
    seasonalRainfall = inputRainfall < 300 ? inputRainfall * 4 : inputRainfall;
    isEstimated = inputRainfall < 300; // Estimated if we had to multiply
    source = irrigationContribution > 0
      ? `Rainfall (${seasonalRainfall}mm) + ${irrigationType} (${irrigationContribution}mm)`
      : `Recorded rainfall (${seasonalRainfall}mm)`;
  }
  
  const effectiveWater = seasonalRainfall + irrigationContribution;
  
  return {
    effectiveWater,
    seasonalRainfall,
    irrigationContribution,
    source,
    isEstimated,
  };
}

/**
 * Validate crop-season-water compatibility
 */
export function validateAgronomicInputs(
  crop: string,
  season: string,
  rainfall: number,
  irrigationType: string | undefined,
  region: string
): ValidationResult {
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let reliabilityImpact = 0;
  
  const cropLower = crop.toLowerCase();
  const seasonLower = season.toLowerCase();
  
  // Get crop water requirements
  const waterReqs = cropWaterRequirements[cropLower];
  
  // 1. Validate season-crop compatibility
  const seasonCompat = seasonCropCompatibility[seasonLower];
  if (seasonCompat) {
    if (seasonCompat.notRecommended.includes(cropLower)) {
      warnings.push(`⚠️ ${crop} is not typically grown in ${season} season - prediction may be less reliable`);
      reliabilityImpact -= 10;
      recommendations.push(`Consider growing ${crop} in its optimal season for better yields`);
    } else if (!seasonCompat.optimal.includes(cropLower) && !seasonCompat.acceptable.includes(cropLower)) {
      // Crop not in any list - unknown
      recommendations.push(`Verify local suitability for ${crop} in ${season} season`);
    }
  }
  
  // 2. Calculate effective water availability
  const { effectiveWater, source, isEstimated } = calculateEffectiveWater(
    rainfall,
    irrigationType,
    season,
    region
  );
  
  if (isEstimated) {
    warnings.push(`📊 Water availability estimated from: ${source}`);
    reliabilityImpact -= 5;
  }
  
  // 3. Validate water requirements
  if (waterReqs) {
    if (effectiveWater < waterReqs.minRainfall) {
      const deficit = waterReqs.minRainfall - effectiveWater;
      
      if (waterReqs.waterCategory === "high") {
        warnings.push(`🚨 ${crop} requires high water (${waterReqs.minRainfall}mm+). Current: ${Math.round(effectiveWater)}mm. Irrigation dependency: HIGH`);
        reliabilityImpact -= 15;
        recommendations.push(`Install ${waterReqs.optimalIrrigation[0]} irrigation to meet water demand`);
      } else {
        warnings.push(`⚠️ Water deficit of ${Math.round(deficit)}mm for optimal ${crop} growth`);
        reliabilityImpact -= 8;
        recommendations.push(`Supplement with ${waterReqs.optimalIrrigation[0]} irrigation if possible`);
      }
      
      if (waterReqs.droughtTolerance === "low" && effectiveWater < waterReqs.minRainfall * 0.5) {
        warnings.push(`🚨 Critical: ${crop} has low drought tolerance - yield severely affected`);
        reliabilityImpact -= 20;
      }
    } else if (effectiveWater > waterReqs.maxRainfall && waterReqs.droughtTolerance === "high") {
      warnings.push(`💧 Excess water (${Math.round(effectiveWater)}mm) may affect ${crop} - consider drainage`);
      reliabilityImpact -= 5;
    }
  }
  
  // 4. Special validation: Rice + Rabi + Low water
  if (cropLower === "rice" && seasonLower === "rabi" && effectiveWater < 800) {
    warnings.push(`🚨 Rice in Rabi season requires assured irrigation - rainfall alone is insufficient`);
    reliabilityImpact -= 20;
    recommendations.push(`Switch to wheat, mustard, or gram for Rabi season without irrigation`);
  }
  
  // 5. Zero rainfall without irrigation warning
  if ((!rainfall || rainfall === 0) && (!irrigationType || irrigationType === "rainfed")) {
    warnings.push(`⚠️ Zero rainfall recorded and no irrigation selected - prediction uses historical averages`);
    reliabilityImpact -= 15;
    recommendations.push(`Provide irrigation type for more accurate prediction`);
  }
  
  return {
    isValid: reliabilityImpact > -30, // Allow prediction but flag low reliability
    warnings,
    recommendations,
    reliabilityImpact,
  };
}

/**
 * Calculate yield adjustment factor based on NDVI and agronomic conditions
 */
export function calculateYieldAdjustment(
  baseYield: number,
  ndviValue: number | undefined,
  ndviAvailable: boolean,
  soilMoistureLevel: string | undefined,
  effectiveWater: number,
  crop: string
): { adjustedYield: number; adjustmentFactor: number; reason: string } {
  let adjustmentFactor = 1.0;
  const reasons: string[] = [];
  const cropLower = crop.toLowerCase();
  const waterReqs = cropWaterRequirements[cropLower];
  
  // NDVI-based adjustment (FINAL RULES)
  // CON-2: NDVI >= healthy AND soil_moisture low → water-stressed
  if (ndviAvailable && ndviValue !== undefined) {
    if (ndviValue < 0.2) {
      adjustmentFactor *= 0.5;
      reasons.push("Bare/failed vegetation detected");
    } else if (ndviValue < 0.4) {
      adjustmentFactor *= 0.7;
      reasons.push("Stressed or early growth vegetation");
    } else if (ndviValue >= 0.6 && (soilMoistureLevel === "low" || soilMoistureLevel === "very_low")) {
      // CON-2: Healthy NDVI but water-stressed
      adjustmentFactor *= 0.85;
      reasons.push("Healthy vegetation detected; yield depends on water and nutrient availability");
    } else if (ndviValue >= 0.6) {
      adjustmentFactor *= 1.05;
      reasons.push("Dense vegetation - healthy crop development");
    }
  }
  
  // Soil moisture adjustment (FINAL RULES)
  if (soilMoistureLevel === "very_low") {
    adjustmentFactor *= 0.75;
    reasons.push("Very low soil moisture - drought stress possible");
  } else if (soilMoistureLevel === "low") {
    adjustmentFactor *= 0.85;
    reasons.push("Low soil moisture - drought stress possible");
  } else if (soilMoistureLevel === "high" && waterReqs?.droughtTolerance === "high") {
    adjustmentFactor *= 0.95;
    reasons.push("High moisture may affect drought-tolerant crop");
  }
  
  // Water availability adjustment
  if (waterReqs) {
    if (effectiveWater < waterReqs.minRainfall * 0.5) {
      adjustmentFactor *= 0.7;
      reasons.push("Severe water deficit");
    } else if (effectiveWater < waterReqs.minRainfall * 0.75) {
      adjustmentFactor *= 0.85;
      reasons.push("Moderate water deficit");
    }
  }
  
  // Cap adjustments to reasonable range
  adjustmentFactor = Math.max(0.4, Math.min(1.15, adjustmentFactor));
  
  return {
    adjustedYield: Math.round(baseYield * adjustmentFactor),
    adjustmentFactor,
    reason: reasons.length > 0 ? reasons.join("; ") : "Standard conditions",
  };
}

/**
 * Calculate comprehensive confidence score with transparent breakdown
 */
export interface ConfidenceBreakdown {
  baseConfidence: number;
  ndviBonus: number;
  soilMoistureBonus: number;
  irrigationBonus: number;
  agronomicPenalty: number;
  estimationPenalty: number;
  finalConfidence: number;
  reliabilityStatus: "High" | "Medium" | "Low";
}

/**
 * FINAL CONFIDENCE FORMULA:
 * Base: 60%
 * +10 NDVI available
 * +10 Irrigation info available (when rainfall=0)
 * -15 Soil moisture uncertain (<1%)
 * -10 Rainfall estimated
 * Max: 85%
 */
export function calculateConfidence(
  hasNDVI: boolean,
  hasSoilMoisture: boolean,
  hasIrrigation: boolean,
  hasWaterSource: boolean, // rainfall > 0 OR irrigation contribution > 0
  agronomicReliabilityImpact: number,
  isWaterEstimated: boolean,
  soilMoistureVeryLow: boolean = false
): ConfidenceBreakdown {
  // ===== CORRECT CONFIDENCE FLOW =====
  // Base confidence (data reliability, not model accuracy)
  let confidence = 60;
  
  // ===== POSITIVE SIGNALS FIRST =====
  const ndviBonus = hasNDVI ? 10 : 0;
  confidence += ndviBonus;
  
  // Soil moisture derived from seasonal data = valid
  const soilMoistureBonus = hasSoilMoisture && !soilMoistureVeryLow ? 10 : 0;
  confidence += soilMoistureBonus;
  
  // Irrigation bonus when rainfall is zero but irrigation is provided
  const irrigationBonus = hasIrrigation ? 10 : 0;
  confidence += irrigationBonus;
  
  // ===== AGRONOMIC CHECK =====
  // Only apply penalty if there's a mismatch AND no irrigation override
  const agronomicPenalty = hasIrrigation 
    ? Math.max(agronomicReliabilityImpact, -5) // Reduced penalty if irrigation available
    : Math.min(0, agronomicReliabilityImpact);
  confidence += agronomicPenalty;
  
  // ===== DATA QUALITY PENALTIES =====
  // Only penalize estimation if we don't have seasonal derived data
  const estimationPenalty = (isWaterEstimated && !hasWaterSource) ? -10 : 0;
  confidence += estimationPenalty;
  
  // Very low soil moisture penalty (only if truly very low after seasonal calculation)
  const soilMoisturePenalty = soilMoistureVeryLow && !hasIrrigation ? -15 : 0;
  confidence += soilMoisturePenalty;
  
  // ===== FINAL CLAMP (at END only) =====
  // Min 0%, Max 85% - NEVER clamp to artificial 35% floor
  const finalConfidence = Math.min(85, Math.max(0, confidence));
  
  // Determine reliability status
  let reliabilityStatus: "High" | "Medium" | "Low";
  if (finalConfidence >= 75) {
    reliabilityStatus = "High";
  } else if (finalConfidence >= 55) {
    reliabilityStatus = "Medium";
  } else {
    reliabilityStatus = "Low";
  }
  
  return {
    baseConfidence: 60,
    ndviBonus,
    soilMoistureBonus,
    irrigationBonus,
    agronomicPenalty: agronomicPenalty + soilMoisturePenalty,
    estimationPenalty,
    finalConfidence: Math.round(finalConfidence),
    reliabilityStatus,
  };
}
