import { CropInfo, crops, soilTypeInfo, seasonInfo } from "@/data/cropData";

interface RecommendationInput {
  region: string;
  state?: string;
  district?: string;
  soilType: string;
  season: string;
  temperature: number;
  rainfall: number;
  humidity: number;
  landType: "dry" | "wet";
  prioritizeGapFarming?: boolean;
}

interface ScoredCrop extends CropInfo {
  score: number;
  matchReasons: string[];
  confidence: number;
  isGapCrop: boolean;
  isQuickHarvest: boolean;
  profitPotential: "high" | "medium" | "low";
}

// State-specific crop suitability data (validated agricultural data)
const stateCropSuitability: Record<string, string[]> = {
  "Punjab": ["Wheat", "Rice", "Cotton", "Sugarcane", "Maize", "Potato", "Mustard", "Radish (Mooli)", "Carrot (Gajar)"],
  "Haryana": ["Wheat", "Rice", "Cotton", "Sugarcane", "Mustard", "Bajra (Pearl Millet)", "Jowar (Sorghum)", "Cluster Beans (Guar)"],
  "Uttar Pradesh": ["Wheat", "Rice", "Sugarcane", "Potato", "Mustard", "Peas", "Maize", "Bottle Gourd (Lauki)", "Radish (Mooli)"],
  "Rajasthan": ["Bajra (Pearl Millet)", "Mustard", "Jowar (Sorghum)", "Groundnut", "Wheat", "Chickpea (Chana)", "Cluster Beans (Guar)"],
  "Gujarat": ["Cotton", "Groundnut", "Wheat", "Sugarcane", "Bajra (Pearl Millet)", "Cumin", "Onion", "Cluster Beans (Guar)"],
  "Maharashtra": ["Cotton", "Sugarcane", "Soybean", "Onion", "Jowar (Sorghum)", "Wheat", "Groundnut", "Brinjal (Baingan)"],
  "Madhya Pradesh": ["Soybean", "Wheat", "Chickpea (Chana)", "Cotton", "Maize", "Mustard", "Pigeon Pea (Arhar/Tur)"],
  "Karnataka": ["Rice", "Sugarcane", "Cotton", "Maize", "Jowar (Sorghum)", "Groundnut", "Coffee", "Curry Leaves (Karivepaku)"],
  "Tamil Nadu": ["Rice", "Sugarcane", "Cotton", "Groundnut", "Coconut", "Banana", "Turmeric", "Brinjal (Baingan)", "Okra (Bhindi)"],
  "Andhra Pradesh": ["Rice", "Cotton", "Groundnut", "Sugarcane", "Chilli", "Tobacco", "Maize", "Gongura (Sorrel Leaves)", "Curry Leaves (Karivepaku)"],
  "Telangana": ["Rice", "Cotton", "Maize", "Soybean", "Chilli", "Turmeric", "Groundnut", "Gongura (Sorrel Leaves)", "Chukka Kura (Sorrel/Roselle)"],
  "Kerala": ["Rice", "Coconut", "Rubber", "Tea", "Coffee", "Banana", "Pepper", "Amaranthus (Thotakura)"],
  "West Bengal": ["Rice", "Jute", "Potato", "Tea", "Wheat", "Mustard", "Maize", "Palakura (Spinach)"],
  "Bihar": ["Rice", "Wheat", "Maize", "Sugarcane", "Potato", "Lentil", "Chickpea (Chana)", "Okra (Bhindi)"],
  "Odisha": ["Rice", "Groundnut", "Sugarcane", "Jute", "Maize", "Pigeon Pea (Arhar/Tur)", "Green Gram (Moong)", "Amaranthus (Thotakura)"],
  "Jharkhand": ["Rice", "Wheat", "Maize", "Pigeon Pea (Arhar/Tur)", "Potato", "Tomato", "Onion"],
  "Chhattisgarh": ["Rice", "Maize", "Soybean", "Pigeon Pea (Arhar/Tur)", "Groundnut", "Sugarcane"],
  "Assam": ["Rice", "Tea", "Jute", "Potato", "Banana", "Sugarcane", "Maize"],
  "Himachal Pradesh": ["Apple", "Wheat", "Maize", "Rice", "Potato", "Peas", "Ginger", "French Beans"],
  "Uttarakhand": ["Rice", "Wheat", "Sugarcane", "Soybean", "Potato", "Apple", "Mandarin", "French Beans"],
};

// Rainfall suitability ranges (mm/year)
const cropRainfallRanges: Record<string, { min: number; max: number; optimal: number }> = {
  "Rice": { min: 1000, max: 2000, optimal: 1500 },
  "Wheat": { min: 400, max: 800, optimal: 600 },
  "Maize": { min: 500, max: 1000, optimal: 750 },
  "Cotton": { min: 500, max: 1000, optimal: 800 },
  "Sugarcane": { min: 1000, max: 1800, optimal: 1400 },
  "Groundnut": { min: 500, max: 800, optimal: 650 },
  "Soybean": { min: 600, max: 1000, optimal: 800 },
  "Mustard": { min: 300, max: 600, optimal: 450 },
  "Chickpea (Chana)": { min: 300, max: 600, optimal: 450 },
  "Potato": { min: 500, max: 900, optimal: 700 },
  "Onion": { min: 400, max: 700, optimal: 550 },
  "Bajra (Pearl Millet)": { min: 200, max: 500, optimal: 350 },
  "Jowar (Sorghum)": { min: 300, max: 600, optimal: 450 },
  "Kothimeera (Coriander)": { min: 200, max: 500, optimal: 350 },
  "Palakura (Spinach)": { min: 300, max: 600, optimal: 450 },
  "Menthi (Fenugreek)": { min: 200, max: 500, optimal: 350 },
  "Gongura (Sorrel Leaves)": { min: 300, max: 700, optimal: 500 },
  "Okra (Bhindi)": { min: 400, max: 800, optimal: 600 },
  "Cucumber (Kakdi)": { min: 400, max: 700, optimal: 550 },
  "Bottle Gourd (Lauki)": { min: 400, max: 800, optimal: 600 },
  "Brinjal (Baingan)": { min: 500, max: 900, optimal: 700 },
  "Radish (Mooli)": { min: 300, max: 500, optimal: 400 },
};

// Gap crop profit potential based on market demand and input costs
const gapCropProfitPotential: Record<string, "high" | "medium" | "low"> = {
  "Gongura (Sorrel Leaves)": "high",
  "Kothimeera (Coriander)": "high",
  "Palakura (Spinach)": "medium",
  "Menthi (Fenugreek)": "high",
  "Chukka Kura (Sorrel/Roselle)": "medium",
  "Amaranthus (Thotakura)": "medium",
  "Curry Leaves (Karivepaku)": "high",
  "Okra (Bhindi)": "high",
  "Cucumber (Kakdi)": "medium",
  "Bottle Gourd (Lauki)": "medium",
  "Ridge Gourd (Turai)": "medium",
  "Bitter Gourd (Karela)": "high",
  "Pumpkin (Kaddu)": "low",
  "Brinjal (Baingan)": "high",
  "Radish (Mooli)": "medium",
  "Carrot (Gajar)": "medium",
  "Short Tomato": "high",
  "Short Chilli": "high",
  "Cluster Beans (Guar)": "medium",
  "Cowpea (Lobia)": "medium",
  "French Beans": "high",
  "Groundnut (Short Duration)": "medium",
  "Green Gram (Moong)": "high",
  "Black Gram (Urad)": "high",
};

export function getSmartCropRecommendations(input: RecommendationInput): ScoredCrop[] {
  const { region, state, district, soilType, season, temperature, rainfall, humidity, landType, prioritizeGapFarming = true } = input;

  // Score each crop
  const scoredCrops: ScoredCrop[] = crops.map((crop) => {
    let score = 0;
    const matchReasons: string[] = [];
    
    // Determine if this is a gap/quick harvest crop
    const isGapCrop = crop.category === "gap-crops" || crop.category === "leafy-vegetables";
    const isQuickHarvest = crop.growingDays <= 90;
    const profitPotential = gapCropProfitPotential[crop.name] || (isGapCrop ? "medium" : "low");

    // 1. Season match (weight: 20)
    if (crop.seasons.includes(season)) {
      score += 20;
      matchReasons.push(`✓ Ideal for ${season} season`);
    } else if (crop.seasons.includes("Zaid") && season === "Kharif") {
      score += 10; // Zaid crops can overlap
    } else {
      score -= 10;
    }

    // 2. Soil type match (weight: 18)
    if (crop.soilTypes.includes(soilType)) {
      score += 18;
      matchReasons.push(`✓ Grows well in ${soilType} soil`);
    } else if (crop.soilTypes.includes("Loamy")) {
      score += 8;
    }

    // 3. Region match (weight: 12)
    if (crop.regions.includes(region)) {
      score += 12;
      matchReasons.push(`✓ Suitable for ${region}`);
    }

    // 4. State-specific suitability (weight: 18)
    if (state && stateCropSuitability[state]) {
      if (stateCropSuitability[state].includes(crop.name)) {
        score += 18;
        matchReasons.push(`✓ Popular in ${state}`);
      }
    }

    // 5. Temperature match (weight: 12)
    if (temperature >= crop.minTemp && temperature <= crop.maxTemp) {
      score += 12;
      matchReasons.push(`✓ Temperature ${temperature}°C is ideal`);
    } else if (temperature >= crop.minTemp - 3 && temperature <= crop.maxTemp + 3) {
      score += 6;
    } else {
      score -= 5;
    }

    // 6. Rainfall match (weight: 12)
    const rainfallRange = cropRainfallRanges[crop.name];
    if (rainfallRange) {
      if (rainfall >= rainfallRange.min && rainfall <= rainfallRange.max) {
        const distanceFromOptimal = Math.abs(rainfall - rainfallRange.optimal);
        const range = rainfallRange.max - rainfallRange.min;
        const rainfallScore = 12 * (1 - distanceFromOptimal / range);
        score += Math.max(6, rainfallScore);
        matchReasons.push(`✓ Rainfall ${rainfall}mm suits this crop`);
      } else if (rainfall >= rainfallRange.min - 100 && rainfall <= rainfallRange.max + 100) {
        score += 4;
      }
    } else {
      const rainfallLevel = rainfall < 500 ? "low" : rainfall < 1000 ? "medium" : "high";
      if (crop.rainfall === rainfallLevel) {
        score += 10;
        matchReasons.push(`✓ Rainfall matches crop needs`);
      } else if (rainfallLevel === "medium") {
        score += 5;
      }
    }

    // 7. Water requirement vs land type (weight: 8)
    if (landType === "wet" && crop.waterRequirement === "high") {
      score += 8;
      matchReasons.push("✓ Suitable for irrigated land");
    } else if (landType === "dry" && crop.waterRequirement === "low") {
      score += 8;
      matchReasons.push("✓ Good for rain-fed farming");
    } else if (landType === "wet" && crop.waterRequirement === "medium") {
      score += 5;
    } else if (landType === "dry" && crop.waterRequirement === "medium") {
      score += 3;
    }

    // 8. Humidity consideration (weight: 5)
    if (humidity > 70 && crop.waterRequirement === "high") {
      score += 5;
    } else if (humidity < 50 && crop.waterRequirement === "low") {
      score += 5;
    }

    // =====================
    // GAP FARMING BONUSES
    // =====================
    
    // 9. Quick harvest bonus (weight: 15 if prioritizing gap farming)
    if (prioritizeGapFarming && isQuickHarvest) {
      const harvestBonus = Math.max(5, 15 - Math.floor(crop.growingDays / 10));
      score += harvestBonus;
      if (crop.growingDays <= 45) {
        matchReasons.push(`⚡ Super quick harvest (${crop.growingDays} days)`);
      } else if (crop.growingDays <= 60) {
        matchReasons.push(`⚡ Quick harvest (${crop.growingDays} days)`);
      } else {
        matchReasons.push(`✓ Ready in ${crop.growingDays} days`);
      }
    }

    // 10. Leafy vegetable bonus for gap farming (weight: 12)
    if (prioritizeGapFarming && crop.category === "leafy-vegetables") {
      score += 12;
      matchReasons.push("🥬 Leafy green - multiple harvests possible");
    }

    // 11. High profit potential bonus (weight: 10)
    if (profitPotential === "high") {
      score += 10;
      matchReasons.push("💰 High market demand & profit");
    } else if (profitPotential === "medium") {
      score += 5;
    }

    // 12. Gap crop category bonus (weight: 8)
    if (prioritizeGapFarming && isGapCrop) {
      score += 8;
    }

    // Penalize long-duration crops when gap farming is prioritized
    if (prioritizeGapFarming && crop.growingDays > 120) {
      score -= 15;
    } else if (prioritizeGapFarming && crop.growingDays > 90) {
      score -= 8;
    }

    // Calculate confidence based on match factors
    const maxPossibleScore = prioritizeGapFarming ? 160 : 115;
    const confidence = Math.min(99, Math.round((score / maxPossibleScore) * 100));

    return {
      ...crop,
      score,
      matchReasons,
      confidence,
      isGapCrop,
      isQuickHarvest,
      profitPotential,
    };
  });

  // Sort by score and return top recommendations with minimum threshold
  return scoredCrops
    .filter((crop) => crop.score >= 30)
    .sort((a, b) => {
      // Primary sort by score
      if (b.score !== a.score) return b.score - a.score;
      // Secondary sort: prefer shorter duration for gap farming
      if (prioritizeGapFarming) return a.growingDays - b.growingDays;
      return 0;
    })
    .slice(0, 12); // Return top 12 recommendations
}

export function getSoilRecommendation(soilType: string) {
  return soilTypeInfo[soilType as keyof typeof soilTypeInfo] || soilTypeInfo.Loamy;
}

export function getSeasonRecommendation(season: string) {
  return seasonInfo[season as keyof typeof seasonInfo] || seasonInfo.Kharif;
}

// Get expected yield based on conditions
export function getExpectedYield(crop: CropInfo, input: RecommendationInput): string {
  const baseYield = crop.yieldRange;
  const [minStr, maxStr] = baseYield.split("-").map(s => s.trim());
  
  // Parse yield values
  const minYield = parseInt(minStr.replace(/,/g, ""));
  const maxYield = parseInt(maxStr.replace(/,/g, ""));
  
  // Adjust based on conditions
  let yieldMultiplier = 1.0;
  
  // Temperature adjustment
  const optimalTemp = (crop.minTemp + crop.maxTemp) / 2;
  const tempDiff = Math.abs(input.temperature - optimalTemp);
  if (tempDiff <= 3) {
    yieldMultiplier += 0.1;
  } else if (tempDiff > 8) {
    yieldMultiplier -= 0.15;
  }
  
  // Irrigation adjustment
  if (input.landType === "wet" && crop.waterRequirement === "high") {
    yieldMultiplier += 0.15;
  } else if (input.landType === "dry" && crop.waterRequirement === "high") {
    yieldMultiplier -= 0.2;
  }
  
  // Calculate adjusted yield
  const adjustedMin = Math.round(minYield * yieldMultiplier);
  const adjustedMax = Math.round(maxYield * yieldMultiplier);
  
  return `${adjustedMin.toLocaleString()}-${adjustedMax.toLocaleString()} kg/ha`;
}
