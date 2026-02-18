/**
 * Industry-Standard Crop Data for Indian Agriculture
 * Focused on: Gap Farming | Real-time Local Accuracy | Short-Term vs Long-Term Decision Making
 * 
 * Classification:
 * - Short-Term Crops: 20–60 days (Gap farming, quick income, low risk)
 * - Long-Term Crops: 60+ days (Main seasonal crops, higher planning required)
 */

export interface Crop {
  id: string;
  name: string;
  localNames: string[];
  category: "leafy" | "vegetable" | "pulse" | "oilseed" | "grain" | "cash";
  duration: {
    minDays: number;
    maxDays: number;
    durationType: "short-term" | "long-term";
  };
  water: {
    requirement: "low" | "medium" | "high";
    mmPerSeason: number;
    irrigationType: "rainfed" | "drip" | "sprinkler" | "flood";
  };
  climate: {
    temperature: { min: number; max: number };
    rainfall: { min: number; max: number };
    humidity: { min: number; max: number };
  };
  soil: {
    suitable: string[];
    phRange: [number, number];
  };
  economics: {
    yieldPerAcreKg: number;
    avgMarketPricePerKg: number;
    profitLevel: "low" | "medium" | "high";
  };
  gapFarming: {
    suitable: boolean;
    reason: string;
  };
  seasons: string[];
  regions: string[];
}

// ================================================
// SHORT-TERM CROPS (20-60 days) - Gap Farming Focus
// ================================================
const shortTermCrops: Crop[] = [
  // Leafy Vegetables - Super Fast (20-35 days)
  {
    id: "spinach",
    name: "Spinach",
    localNames: ["Palakura", "Palak"],
    category: "leafy",
    duration: { minDays: 25, maxDays: 35, durationType: "short-term" },
    water: { requirement: "medium", mmPerSeason: 150, irrigationType: "drip" },
    climate: {
      temperature: { min: 15, max: 30 },
      rainfall: { min: 100, max: 200 },
      humidity: { min: 50, max: 80 },
    },
    soil: { suitable: ["Loamy", "Sandy", "Red"], phRange: [6.0, 7.5] },
    economics: { yieldPerAcreKg: 3000, avgMarketPricePerKg: 25, profitLevel: "high" },
    gapFarming: { suitable: true, reason: "Fast 25-35 day cycle with multiple harvests possible" },
    seasons: ["Rabi", "Zaid"],
    regions: ["South India", "North India", "Central India"],
  },
  {
    id: "coriander",
    name: "Coriander",
    localNames: ["Kothimeera", "Dhaniya"],
    category: "leafy",
    duration: { minDays: 30, maxDays: 45, durationType: "short-term" },
    water: { requirement: "low", mmPerSeason: 120, irrigationType: "drip" },
    climate: {
      temperature: { min: 17, max: 27 },
      rainfall: { min: 80, max: 150 },
      humidity: { min: 40, max: 70 },
    },
    soil: { suitable: ["Loamy", "Sandy", "Black"], phRange: [6.0, 8.0] },
    economics: { yieldPerAcreKg: 800, avgMarketPricePerKg: 80, profitLevel: "high" },
    gapFarming: { suitable: true, reason: "High market demand, quick 30-45 day harvest" },
    seasons: ["Rabi", "Zaid", "Kharif"],
    regions: ["South India", "Central India", "North India"],
  },
  {
    id: "fenugreek",
    name: "Fenugreek",
    localNames: ["Menthi", "Methi"],
    category: "leafy",
    duration: { minDays: 25, maxDays: 40, durationType: "short-term" },
    water: { requirement: "low", mmPerSeason: 100, irrigationType: "drip" },
    climate: {
      temperature: { min: 10, max: 25 },
      rainfall: { min: 80, max: 150 },
      humidity: { min: 40, max: 65 },
    },
    soil: { suitable: ["Loamy", "Sandy", "Clay"], phRange: [5.5, 8.0] },
    economics: { yieldPerAcreKg: 1200, avgMarketPricePerKg: 45, profitLevel: "high" },
    gapFarming: { suitable: true, reason: "Low water need, 25-40 day cycle, steady demand" },
    seasons: ["Rabi", "Zaid"],
    regions: ["North India", "Central India", "South India"],
  },
  {
    id: "amaranthus",
    name: "Amaranthus",
    localNames: ["Thotakura", "Chaulai"],
    category: "leafy",
    duration: { minDays: 20, maxDays: 30, durationType: "short-term" },
    water: { requirement: "low", mmPerSeason: 100, irrigationType: "drip" },
    climate: {
      temperature: { min: 20, max: 35 },
      rainfall: { min: 100, max: 200 },
      humidity: { min: 50, max: 85 },
    },
    soil: { suitable: ["Loamy", "Sandy", "Red"], phRange: [6.0, 7.0] },
    economics: { yieldPerAcreKg: 4000, avgMarketPricePerKg: 20, profitLevel: "medium" },
    gapFarming: { suitable: true, reason: "Fastest leafy crop, 20-30 days, heat tolerant" },
    seasons: ["Kharif", "Zaid"],
    regions: ["South India", "East India", "Central India"],
  },
  {
    id: "gongura",
    name: "Gongura",
    localNames: ["Sorrel Leaves", "Ambadi"],
    category: "leafy",
    duration: { minDays: 35, maxDays: 50, durationType: "short-term" },
    water: { requirement: "low", mmPerSeason: 120, irrigationType: "rainfed" },
    climate: {
      temperature: { min: 20, max: 35 },
      rainfall: { min: 100, max: 250 },
      humidity: { min: 50, max: 80 },
    },
    soil: { suitable: ["Red", "Sandy", "Loamy"], phRange: [5.5, 7.5] },
    economics: { yieldPerAcreKg: 3500, avgMarketPricePerKg: 30, profitLevel: "high" },
    gapFarming: { suitable: true, reason: "High demand in AP/TS, multiple harvests from single sowing" },
    seasons: ["Kharif", "Rabi"],
    regions: ["South India"],
  },

  // Short-Duration Vegetables (40-60 days)
  {
    id: "radish",
    name: "Radish",
    localNames: ["Mooli", "Mullangi"],
    category: "vegetable",
    duration: { minDays: 35, maxDays: 50, durationType: "short-term" },
    water: { requirement: "medium", mmPerSeason: 180, irrigationType: "drip" },
    climate: {
      temperature: { min: 10, max: 25 },
      rainfall: { min: 100, max: 200 },
      humidity: { min: 50, max: 70 },
    },
    soil: { suitable: ["Sandy", "Loamy"], phRange: [6.0, 7.0] },
    economics: { yieldPerAcreKg: 8000, avgMarketPricePerKg: 15, profitLevel: "medium" },
    gapFarming: { suitable: true, reason: "Quick 35-50 day cycle, high yield per acre" },
    seasons: ["Rabi", "Zaid"],
    regions: ["North India", "Central India"],
  },
  {
    id: "cucumber",
    name: "Cucumber",
    localNames: ["Kakdi", "Dosakai"],
    category: "vegetable",
    duration: { minDays: 45, maxDays: 60, durationType: "short-term" },
    water: { requirement: "medium", mmPerSeason: 200, irrigationType: "drip" },
    climate: {
      temperature: { min: 20, max: 35 },
      rainfall: { min: 150, max: 300 },
      humidity: { min: 60, max: 85 },
    },
    soil: { suitable: ["Loamy", "Sandy"], phRange: [6.0, 7.0] },
    economics: { yieldPerAcreKg: 6000, avgMarketPricePerKg: 18, profitLevel: "medium" },
    gapFarming: { suitable: true, reason: "45-60 day cycle, continuous picking for 2-3 weeks" },
    seasons: ["Kharif", "Zaid"],
    regions: ["South India", "Central India", "North India"],
  },
  {
    id: "beans",
    name: "Cluster Beans",
    localNames: ["Guar", "Gorikayalu"],
    category: "vegetable",
    duration: { minDays: 45, maxDays: 55, durationType: "short-term" },
    water: { requirement: "low", mmPerSeason: 150, irrigationType: "rainfed" },
    climate: {
      temperature: { min: 25, max: 40 },
      rainfall: { min: 100, max: 200 },
      humidity: { min: 40, max: 70 },
    },
    soil: { suitable: ["Sandy", "Loamy"], phRange: [7.0, 8.5] },
    economics: { yieldPerAcreKg: 3000, avgMarketPricePerKg: 35, profitLevel: "high" },
    gapFarming: { suitable: true, reason: "Drought tolerant, 45-55 days, fixes nitrogen" },
    seasons: ["Kharif", "Zaid"],
    regions: ["North India", "West India", "Central India"],
  },
  {
    id: "okra",
    name: "Okra",
    localNames: ["Bhindi", "Bendakaya"],
    category: "vegetable",
    duration: { minDays: 45, maxDays: 60, durationType: "short-term" },
    water: { requirement: "medium", mmPerSeason: 180, irrigationType: "drip" },
    climate: {
      temperature: { min: 22, max: 35 },
      rainfall: { min: 150, max: 300 },
      humidity: { min: 60, max: 85 },
    },
    soil: { suitable: ["Loamy", "Sandy", "Black"], phRange: [6.0, 7.5] },
    economics: { yieldPerAcreKg: 4000, avgMarketPricePerKg: 25, profitLevel: "high" },
    gapFarming: { suitable: true, reason: "First harvest in 45-60 days, continues for 60+ days" },
    seasons: ["Kharif", "Zaid"],
    regions: ["South India", "Central India", "North India"],
  },
  {
    id: "carrot",
    name: "Carrot",
    localNames: ["Gajar", "Carrot"],
    category: "vegetable",
    duration: { minDays: 50, maxDays: 60, durationType: "short-term" },
    water: { requirement: "medium", mmPerSeason: 200, irrigationType: "drip" },
    climate: {
      temperature: { min: 10, max: 25 },
      rainfall: { min: 100, max: 200 },
      humidity: { min: 50, max: 70 },
    },
    soil: { suitable: ["Sandy", "Loamy"], phRange: [6.0, 7.0] },
    economics: { yieldPerAcreKg: 10000, avgMarketPricePerKg: 20, profitLevel: "high" },
    gapFarming: { suitable: true, reason: "50-60 day harvest, high market value" },
    seasons: ["Rabi"],
    regions: ["North India", "Central India"],
  },
];

// ================================================
// LONG-TERM CROPS (60+ days) - Main Seasonal Crops
// ================================================
const longTermCrops: Crop[] = [
  // Pulses
  {
    id: "green-gram",
    name: "Green Gram",
    localNames: ["Moong", "Pesalu"],
    category: "pulse",
    duration: { minDays: 60, maxDays: 75, durationType: "long-term" },
    water: { requirement: "low", mmPerSeason: 200, irrigationType: "rainfed" },
    climate: {
      temperature: { min: 25, max: 40 },
      rainfall: { min: 200, max: 400 },
      humidity: { min: 40, max: 70 },
    },
    soil: { suitable: ["Loamy", "Sandy", "Red"], phRange: [6.0, 7.5] },
    economics: { yieldPerAcreKg: 500, avgMarketPricePerKg: 90, profitLevel: "high" },
    gapFarming: { suitable: true, reason: "Short-duration pulse, 60-75 days, good for gap periods" },
    seasons: ["Kharif", "Zaid"],
    regions: ["Central India", "South India", "North India"],
  },
  {
    id: "black-gram",
    name: "Black Gram",
    localNames: ["Urad", "Minumulu"],
    category: "pulse",
    duration: { minDays: 65, maxDays: 80, durationType: "long-term" },
    water: { requirement: "low", mmPerSeason: 220, irrigationType: "rainfed" },
    climate: {
      temperature: { min: 25, max: 35 },
      rainfall: { min: 250, max: 450 },
      humidity: { min: 60, max: 85 },
    },
    soil: { suitable: ["Loamy", "Black", "Red"], phRange: [6.0, 7.5] },
    economics: { yieldPerAcreKg: 400, avgMarketPricePerKg: 100, profitLevel: "high" },
    gapFarming: { suitable: true, reason: "65-80 days, high MSP, nitrogen fixing" },
    seasons: ["Kharif", "Rabi"],
    regions: ["Central India", "South India"],
  },
  {
    id: "groundnut",
    name: "Groundnut",
    localNames: ["Moongphali", "Pallilu"],
    category: "oilseed",
    duration: { minDays: 100, maxDays: 130, durationType: "long-term" },
    water: { requirement: "medium", mmPerSeason: 400, irrigationType: "rainfed" },
    climate: {
      temperature: { min: 22, max: 35 },
      rainfall: { min: 400, max: 700 },
      humidity: { min: 50, max: 75 },
    },
    soil: { suitable: ["Sandy", "Loamy", "Red"], phRange: [6.0, 7.0] },
    economics: { yieldPerAcreKg: 1200, avgMarketPricePerKg: 55, profitLevel: "medium" },
    gapFarming: { suitable: false, reason: "100-130 days duration, requires full season planning" },
    seasons: ["Kharif"],
    regions: ["West India", "South India", "Central India"],
  },
  {
    id: "brinjal",
    name: "Brinjal",
    localNames: ["Baingan", "Vankaya"],
    category: "vegetable",
    duration: { minDays: 65, maxDays: 80, durationType: "long-term" },
    water: { requirement: "medium", mmPerSeason: 300, irrigationType: "drip" },
    climate: {
      temperature: { min: 18, max: 35 },
      rainfall: { min: 200, max: 400 },
      humidity: { min: 50, max: 80 },
    },
    soil: { suitable: ["Loamy", "Black", "Red"], phRange: [5.5, 7.0] },
    economics: { yieldPerAcreKg: 12000, avgMarketPricePerKg: 18, profitLevel: "high" },
    gapFarming: { suitable: true, reason: "First harvest at 65 days, continuous picking for 4-5 months" },
    seasons: ["Kharif", "Rabi"],
    regions: ["South India", "Central India", "East India"],
  },
  {
    id: "tomato",
    name: "Tomato",
    localNames: ["Tamatar", "Tomato"],
    category: "vegetable",
    duration: { minDays: 70, maxDays: 90, durationType: "long-term" },
    water: { requirement: "medium", mmPerSeason: 350, irrigationType: "drip" },
    climate: {
      temperature: { min: 18, max: 32 },
      rainfall: { min: 200, max: 400 },
      humidity: { min: 50, max: 75 },
    },
    soil: { suitable: ["Loamy", "Sandy", "Black"], phRange: [6.0, 7.0] },
    economics: { yieldPerAcreKg: 15000, avgMarketPricePerKg: 20, profitLevel: "high" },
    gapFarming: { suitable: false, reason: "70-90 days to first harvest, price volatility risk" },
    seasons: ["Rabi", "Kharif"],
    regions: ["South India", "Central India", "North India"],
  },
  {
    id: "chilli",
    name: "Chilli",
    localNames: ["Mirchi", "Mirapa"],
    category: "vegetable",
    duration: { minDays: 75, maxDays: 100, durationType: "long-term" },
    water: { requirement: "medium", mmPerSeason: 300, irrigationType: "drip" },
    climate: {
      temperature: { min: 20, max: 35 },
      rainfall: { min: 200, max: 400 },
      humidity: { min: 50, max: 75 },
    },
    soil: { suitable: ["Loamy", "Black", "Red"], phRange: [6.0, 7.0] },
    economics: { yieldPerAcreKg: 2500, avgMarketPricePerKg: 80, profitLevel: "high" },
    gapFarming: { suitable: false, reason: "75-100 days duration, requires stable weather window" },
    seasons: ["Kharif", "Rabi"],
    regions: ["South India", "Central India"],
  },

  // Grains - Long Duration
  {
    id: "paddy",
    name: "Paddy",
    localNames: ["Dhan", "Vari"],
    category: "grain",
    duration: { minDays: 110, maxDays: 140, durationType: "long-term" },
    water: { requirement: "high", mmPerSeason: 1200, irrigationType: "flood" },
    climate: {
      temperature: { min: 20, max: 35 },
      rainfall: { min: 1000, max: 2000 },
      humidity: { min: 70, max: 90 },
    },
    soil: { suitable: ["Clay", "Loamy", "Black"], phRange: [5.5, 7.0] },
    economics: { yieldPerAcreKg: 2000, avgMarketPricePerKg: 22, profitLevel: "medium" },
    gapFarming: { suitable: false, reason: "110-140 days, high water requirement, main season crop" },
    seasons: ["Kharif"],
    regions: ["South India", "East India", "North India"],
  },
  {
    id: "maize",
    name: "Maize",
    localNames: ["Makka", "Mokka Jonna"],
    category: "grain",
    duration: { minDays: 90, maxDays: 110, durationType: "long-term" },
    water: { requirement: "medium", mmPerSeason: 500, irrigationType: "sprinkler" },
    climate: {
      temperature: { min: 18, max: 32 },
      rainfall: { min: 500, max: 800 },
      humidity: { min: 50, max: 75 },
    },
    soil: { suitable: ["Loamy", "Sandy", "Black"], phRange: [5.5, 7.5] },
    economics: { yieldPerAcreKg: 2500, avgMarketPricePerKg: 18, profitLevel: "medium" },
    gapFarming: { suitable: false, reason: "90-110 days duration, needs stable weather" },
    seasons: ["Kharif", "Rabi"],
    regions: ["North India", "South India", "Central India"],
  },

  // Cash Crops - Very Long Duration
  {
    id: "cotton",
    name: "Cotton",
    localNames: ["Kapas", "Pratti"],
    category: "cash",
    duration: { minDays: 150, maxDays: 180, durationType: "long-term" },
    water: { requirement: "medium", mmPerSeason: 600, irrigationType: "drip" },
    climate: {
      temperature: { min: 20, max: 35 },
      rainfall: { min: 500, max: 900 },
      humidity: { min: 50, max: 75 },
    },
    soil: { suitable: ["Black", "Loamy"], phRange: [6.0, 8.0] },
    economics: { yieldPerAcreKg: 600, avgMarketPricePerKg: 65, profitLevel: "medium" },
    gapFarming: { suitable: false, reason: "150-180 days, major seasonal commitment required" },
    seasons: ["Kharif"],
    regions: ["Central India", "West India", "South India"],
  },
  {
    id: "sugarcane",
    name: "Sugarcane",
    localNames: ["Ganna", "Cheruku"],
    category: "cash",
    duration: { minDays: 300, maxDays: 365, durationType: "long-term" },
    water: { requirement: "high", mmPerSeason: 2000, irrigationType: "flood" },
    climate: {
      temperature: { min: 20, max: 35 },
      rainfall: { min: 1000, max: 1800 },
      humidity: { min: 60, max: 85 },
    },
    soil: { suitable: ["Loamy", "Black", "Clay"], phRange: [6.0, 8.0] },
    economics: { yieldPerAcreKg: 35000, avgMarketPricePerKg: 3, profitLevel: "medium" },
    gapFarming: { suitable: false, reason: "10-12 months duration, not suitable for gap farming" },
    seasons: ["Kharif"],
    regions: ["North India", "South India", "West India"],
  },

  // Additional Vegetables
  {
    id: "bottle-gourd",
    name: "Bottle Gourd",
    localNames: ["Lauki", "Anapakaya"],
    category: "vegetable",
    duration: { minDays: 55, maxDays: 70, durationType: "short-term" },
    water: { requirement: "medium", mmPerSeason: 250, irrigationType: "drip" },
    climate: {
      temperature: { min: 22, max: 35 },
      rainfall: { min: 150, max: 300 },
      humidity: { min: 60, max: 85 },
    },
    soil: { suitable: ["Loamy", "Sandy", "Black"], phRange: [6.0, 7.0] },
    economics: { yieldPerAcreKg: 8000, avgMarketPricePerKg: 12, profitLevel: "medium" },
    gapFarming: { suitable: true, reason: "55-70 days to first harvest, continuous bearing" },
    seasons: ["Kharif", "Zaid"],
    regions: ["North India", "Central India", "South India"],
  },
  {
    id: "ridge-gourd",
    name: "Ridge Gourd",
    localNames: ["Turai", "Beerakaya"],
    category: "vegetable",
    duration: { minDays: 50, maxDays: 65, durationType: "short-term" },
    water: { requirement: "medium", mmPerSeason: 200, irrigationType: "drip" },
    climate: {
      temperature: { min: 22, max: 35 },
      rainfall: { min: 150, max: 300 },
      humidity: { min: 60, max: 85 },
    },
    soil: { suitable: ["Loamy", "Sandy"], phRange: [6.0, 7.0] },
    economics: { yieldPerAcreKg: 6000, avgMarketPricePerKg: 15, profitLevel: "medium" },
    gapFarming: { suitable: true, reason: "50-65 days, heat tolerant, steady market" },
    seasons: ["Kharif", "Zaid"],
    regions: ["South India", "Central India"],
  },
  {
    id: "bitter-gourd",
    name: "Bitter Gourd",
    localNames: ["Karela", "Kakarakaya"],
    category: "vegetable",
    duration: { minDays: 55, maxDays: 70, durationType: "short-term" },
    water: { requirement: "medium", mmPerSeason: 220, irrigationType: "drip" },
    climate: {
      temperature: { min: 22, max: 35 },
      rainfall: { min: 150, max: 300 },
      humidity: { min: 55, max: 80 },
    },
    soil: { suitable: ["Loamy", "Sandy", "Black"], phRange: [6.0, 7.0] },
    economics: { yieldPerAcreKg: 5000, avgMarketPricePerKg: 25, profitLevel: "high" },
    gapFarming: { suitable: true, reason: "55-70 days, medicinal value, premium pricing" },
    seasons: ["Kharif", "Zaid"],
    regions: ["South India", "Central India", "East India"],
  },
  {
    id: "pumpkin",
    name: "Pumpkin",
    localNames: ["Kaddu", "Gummadikaya"],
    category: "vegetable",
    duration: { minDays: 90, maxDays: 120, durationType: "long-term" },
    water: { requirement: "medium", mmPerSeason: 350, irrigationType: "drip" },
    climate: {
      temperature: { min: 20, max: 35 },
      rainfall: { min: 200, max: 400 },
      humidity: { min: 50, max: 80 },
    },
    soil: { suitable: ["Loamy", "Sandy", "Black"], phRange: [6.0, 7.0] },
    economics: { yieldPerAcreKg: 12000, avgMarketPricePerKg: 10, profitLevel: "low" },
    gapFarming: { suitable: false, reason: "90-120 days, bulky transport, lower returns" },
    seasons: ["Kharif", "Rabi"],
    regions: ["Central India", "North India", "South India"],
  },
  {
    id: "french-beans",
    name: "French Beans",
    localNames: ["Beans", "Chikkudu"],
    category: "vegetable",
    duration: { minDays: 50, maxDays: 60, durationType: "short-term" },
    water: { requirement: "medium", mmPerSeason: 200, irrigationType: "drip" },
    climate: {
      temperature: { min: 15, max: 28 },
      rainfall: { min: 150, max: 250 },
      humidity: { min: 50, max: 75 },
    },
    soil: { suitable: ["Loamy", "Sandy"], phRange: [6.0, 7.0] },
    economics: { yieldPerAcreKg: 4000, avgMarketPricePerKg: 30, profitLevel: "high" },
    gapFarming: { suitable: true, reason: "50-60 days, high value, continuous harvest" },
    seasons: ["Rabi", "Kharif"],
    regions: ["South India", "North India", "Central India"],
  },
  {
    id: "cowpea",
    name: "Cowpea",
    localNames: ["Lobia", "Bobbarlu"],
    category: "pulse",
    duration: { minDays: 60, maxDays: 75, durationType: "long-term" },
    water: { requirement: "low", mmPerSeason: 180, irrigationType: "rainfed" },
    climate: {
      temperature: { min: 22, max: 38 },
      rainfall: { min: 150, max: 300 },
      humidity: { min: 40, max: 70 },
    },
    soil: { suitable: ["Sandy", "Loamy", "Red"], phRange: [5.5, 7.5] },
    economics: { yieldPerAcreKg: 600, avgMarketPricePerKg: 70, profitLevel: "medium" },
    gapFarming: { suitable: true, reason: "60-75 days, drought tolerant, dual purpose (grain + fodder)" },
    seasons: ["Kharif", "Zaid"],
    regions: ["Central India", "South India", "West India"],
  },
  // Additional Short-Term Crops
  {
    id: "lettuce",
    name: "Lettuce",
    localNames: ["Salad Patta", "Lettuce"],
    category: "leafy",
    duration: { minDays: 30, maxDays: 45, durationType: "short-term" },
    water: { requirement: "medium", mmPerSeason: 150, irrigationType: "drip" },
    climate: {
      temperature: { min: 10, max: 25 },
      rainfall: { min: 80, max: 150 },
      humidity: { min: 50, max: 75 },
    },
    soil: { suitable: ["Loamy", "Sandy"], phRange: [6.0, 7.0] },
    economics: { yieldPerAcreKg: 4000, avgMarketPricePerKg: 60, profitLevel: "high" },
    gapFarming: { suitable: true, reason: "Premium salad crop, 30-45 days, high demand in urban areas" },
    seasons: ["Rabi", "Zaid"],
    regions: ["North India", "South India"],
  },
  {
    id: "mint",
    name: "Mint",
    localNames: ["Pudina", "Mint"],
    category: "leafy",
    duration: { minDays: 30, maxDays: 40, durationType: "short-term" },
    water: { requirement: "medium", mmPerSeason: 160, irrigationType: "drip" },
    climate: {
      temperature: { min: 15, max: 30 },
      rainfall: { min: 100, max: 180 },
      humidity: { min: 55, max: 80 },
    },
    soil: { suitable: ["Loamy", "Sandy", "Clay"], phRange: [6.0, 7.5] },
    economics: { yieldPerAcreKg: 2500, avgMarketPricePerKg: 50, profitLevel: "high" },
    gapFarming: { suitable: true, reason: "Perennial herb, continuous harvest, high daily demand" },
    seasons: ["Kharif", "Rabi", "Zaid"],
    regions: ["North India", "Central India", "South India"],
  },
  {
    id: "spring-onion",
    name: "Spring Onion",
    localNames: ["Hara Pyaz", "Spring Onion"],
    category: "vegetable",
    duration: { minDays: 40, maxDays: 55, durationType: "short-term" },
    water: { requirement: "medium", mmPerSeason: 180, irrigationType: "drip" },
    climate: {
      temperature: { min: 12, max: 28 },
      rainfall: { min: 100, max: 200 },
      humidity: { min: 50, max: 70 },
    },
    soil: { suitable: ["Loamy", "Sandy"], phRange: [6.0, 7.0] },
    economics: { yieldPerAcreKg: 6000, avgMarketPricePerKg: 35, profitLevel: "high" },
    gapFarming: { suitable: true, reason: "40-55 days cycle, premium pricing, restaurant demand" },
    seasons: ["Rabi", "Zaid"],
    regions: ["North India", "Central India"],
  },
  {
    id: "drumstick-leaves",
    name: "Drumstick Leaves",
    localNames: ["Moringa", "Munagaku"],
    category: "leafy",
    duration: { minDays: 45, maxDays: 60, durationType: "short-term" },
    water: { requirement: "low", mmPerSeason: 100, irrigationType: "rainfed" },
    climate: {
      temperature: { min: 22, max: 40 },
      rainfall: { min: 80, max: 200 },
      humidity: { min: 40, max: 70 },
    },
    soil: { suitable: ["Sandy", "Loamy", "Red"], phRange: [6.0, 8.0] },
    economics: { yieldPerAcreKg: 3000, avgMarketPricePerKg: 40, profitLevel: "high" },
    gapFarming: { suitable: true, reason: "Superfood demand, drought tolerant, continuous harvest" },
    seasons: ["Kharif", "Rabi", "Zaid"],
    regions: ["South India", "Central India"],
  },
  {
    id: "snake-gourd",
    name: "Snake Gourd",
    localNames: ["Chichinda", "Potlakaya"],
    category: "vegetable",
    duration: { minDays: 50, maxDays: 60, durationType: "short-term" },
    water: { requirement: "medium", mmPerSeason: 200, irrigationType: "drip" },
    climate: {
      temperature: { min: 22, max: 35 },
      rainfall: { min: 150, max: 300 },
      humidity: { min: 60, max: 85 },
    },
    soil: { suitable: ["Loamy", "Sandy"], phRange: [6.0, 7.0] },
    economics: { yieldPerAcreKg: 7000, avgMarketPricePerKg: 20, profitLevel: "medium" },
    gapFarming: { suitable: true, reason: "50-60 days harvest, heat tolerant, continuous bearing" },
    seasons: ["Kharif", "Zaid"],
    regions: ["South India", "East India"],
  },
  {
    id: "ivy-gourd",
    name: "Ivy Gourd",
    localNames: ["Tindora", "Dondakaya"],
    category: "vegetable",
    duration: { minDays: 45, maxDays: 55, durationType: "short-term" },
    water: { requirement: "low", mmPerSeason: 150, irrigationType: "drip" },
    climate: {
      temperature: { min: 20, max: 35 },
      rainfall: { min: 100, max: 250 },
      humidity: { min: 50, max: 80 },
    },
    soil: { suitable: ["Loamy", "Sandy", "Red"], phRange: [6.0, 7.5] },
    economics: { yieldPerAcreKg: 5000, avgMarketPricePerKg: 25, profitLevel: "high" },
    gapFarming: { suitable: true, reason: "Perennial climber, daily harvest, low maintenance" },
    seasons: ["Kharif", "Zaid"],
    regions: ["South India", "Central India"],
  },
  {
    id: "ash-gourd",
    name: "Ash Gourd",
    localNames: ["Petha", "Boodida Gummadi"],
    category: "vegetable",
    duration: { minDays: 55, maxDays: 70, durationType: "short-term" },
    water: { requirement: "medium", mmPerSeason: 220, irrigationType: "drip" },
    climate: {
      temperature: { min: 20, max: 35 },
      rainfall: { min: 150, max: 300 },
      humidity: { min: 55, max: 80 },
    },
    soil: { suitable: ["Loamy", "Sandy", "Black"], phRange: [6.0, 7.5] },
    economics: { yieldPerAcreKg: 12000, avgMarketPricePerKg: 10, profitLevel: "medium" },
    gapFarming: { suitable: true, reason: "Long storage life, medicinal value, temple demand" },
    seasons: ["Kharif", "Zaid"],
    regions: ["South India", "Central India", "North India"],
  },

  // Additional Long-Term Crops
  {
    id: "wheat",
    name: "Wheat",
    localNames: ["Gehun", "Godhumai"],
    category: "grain",
    duration: { minDays: 110, maxDays: 130, durationType: "long-term" },
    water: { requirement: "medium", mmPerSeason: 450, irrigationType: "flood" },
    climate: {
      temperature: { min: 10, max: 25 },
      rainfall: { min: 250, max: 400 },
      humidity: { min: 40, max: 65 },
    },
    soil: { suitable: ["Loamy", "Clay", "Black"], phRange: [6.0, 7.5] },
    economics: { yieldPerAcreKg: 1800, avgMarketPricePerKg: 25, profitLevel: "medium" },
    gapFarming: { suitable: false, reason: "110-130 days, main rabi season crop, needs planning" },
    seasons: ["Rabi"],
    regions: ["North India", "Central India"],
  },
  {
    id: "jowar",
    name: "Jowar (Sorghum)",
    localNames: ["Jowar", "Jonna"],
    category: "grain",
    duration: { minDays: 90, maxDays: 120, durationType: "long-term" },
    water: { requirement: "low", mmPerSeason: 300, irrigationType: "rainfed" },
    climate: {
      temperature: { min: 20, max: 40 },
      rainfall: { min: 250, max: 500 },
      humidity: { min: 35, max: 60 },
    },
    soil: { suitable: ["Black", "Loamy", "Red"], phRange: [5.5, 8.0] },
    economics: { yieldPerAcreKg: 1200, avgMarketPricePerKg: 28, profitLevel: "medium" },
    gapFarming: { suitable: false, reason: "Drought tolerant, 90-120 days, dual purpose (grain+fodder)" },
    seasons: ["Kharif", "Rabi"],
    regions: ["Central India", "South India", "West India"],
  },
  {
    id: "bajra",
    name: "Bajra (Pearl Millet)",
    localNames: ["Bajra", "Sajjalu"],
    category: "grain",
    duration: { minDays: 70, maxDays: 90, durationType: "long-term" },
    water: { requirement: "low", mmPerSeason: 250, irrigationType: "rainfed" },
    climate: {
      temperature: { min: 25, max: 45 },
      rainfall: { min: 150, max: 350 },
      humidity: { min: 30, max: 55 },
    },
    soil: { suitable: ["Sandy", "Loamy"], phRange: [6.0, 8.0] },
    economics: { yieldPerAcreKg: 800, avgMarketPricePerKg: 32, profitLevel: "medium" },
    gapFarming: { suitable: false, reason: "Hot climate grain, 70-90 days, extremely drought tolerant" },
    seasons: ["Kharif"],
    regions: ["West India", "North India"],
  },
  {
    id: "chickpea",
    name: "Chickpea (Chana)",
    localNames: ["Chana", "Senagalu"],
    category: "pulse",
    duration: { minDays: 95, maxDays: 115, durationType: "long-term" },
    water: { requirement: "low", mmPerSeason: 200, irrigationType: "rainfed" },
    climate: {
      temperature: { min: 10, max: 28 },
      rainfall: { min: 150, max: 300 },
      humidity: { min: 35, max: 55 },
    },
    soil: { suitable: ["Loamy", "Black", "Sandy"], phRange: [6.0, 8.0] },
    economics: { yieldPerAcreKg: 600, avgMarketPricePerKg: 65, profitLevel: "high" },
    gapFarming: { suitable: false, reason: "95-115 days, major rabi pulse, nitrogen fixing" },
    seasons: ["Rabi"],
    regions: ["Central India", "North India", "West India"],
  },
  {
    id: "pigeon-pea",
    name: "Pigeon Pea (Arhar/Tur)",
    localNames: ["Arhar", "Kandi Pappu"],
    category: "pulse",
    duration: { minDays: 150, maxDays: 180, durationType: "long-term" },
    water: { requirement: "medium", mmPerSeason: 350, irrigationType: "rainfed" },
    climate: {
      temperature: { min: 18, max: 35 },
      rainfall: { min: 400, max: 700 },
      humidity: { min: 50, max: 75 },
    },
    soil: { suitable: ["Loamy", "Black", "Red"], phRange: [5.5, 7.5] },
    economics: { yieldPerAcreKg: 500, avgMarketPricePerKg: 85, profitLevel: "high" },
    gapFarming: { suitable: false, reason: "Long duration pulse, 150-180 days, high MSP" },
    seasons: ["Kharif"],
    regions: ["Central India", "South India"],
  },
  {
    id: "lentil",
    name: "Lentil (Masoor)",
    localNames: ["Masoor", "Misur Pappu"],
    category: "pulse",
    duration: { minDays: 100, maxDays: 120, durationType: "long-term" },
    water: { requirement: "low", mmPerSeason: 180, irrigationType: "rainfed" },
    climate: {
      temperature: { min: 12, max: 25 },
      rainfall: { min: 150, max: 300 },
      humidity: { min: 40, max: 60 },
    },
    soil: { suitable: ["Loamy", "Sandy", "Clay"], phRange: [5.5, 8.0] },
    economics: { yieldPerAcreKg: 450, avgMarketPricePerKg: 75, profitLevel: "medium" },
    gapFarming: { suitable: false, reason: "100-120 days, cool weather pulse, export demand" },
    seasons: ["Rabi"],
    regions: ["Central India", "North India"],
  },
  {
    id: "mustard",
    name: "Mustard (Sarson)",
    localNames: ["Sarson", "Avalu"],
    category: "oilseed",
    duration: { minDays: 100, maxDays: 120, durationType: "long-term" },
    water: { requirement: "low", mmPerSeason: 200, irrigationType: "rainfed" },
    climate: {
      temperature: { min: 10, max: 25 },
      rainfall: { min: 150, max: 300 },
      humidity: { min: 40, max: 60 },
    },
    soil: { suitable: ["Loamy", "Sandy", "Clay"], phRange: [5.5, 8.0] },
    economics: { yieldPerAcreKg: 700, avgMarketPricePerKg: 55, profitLevel: "medium" },
    gapFarming: { suitable: false, reason: "100-120 days, major rabi oilseed, dual purpose (oil+greens)" },
    seasons: ["Rabi"],
    regions: ["North India", "Central India", "East India"],
  },
  {
    id: "sunflower",
    name: "Sunflower",
    localNames: ["Surajmukhi", "Poddu Thiru Puvvu"],
    category: "oilseed",
    duration: { minDays: 85, maxDays: 100, durationType: "long-term" },
    water: { requirement: "medium", mmPerSeason: 350, irrigationType: "sprinkler" },
    climate: {
      temperature: { min: 18, max: 35 },
      rainfall: { min: 300, max: 500 },
      humidity: { min: 45, max: 70 },
    },
    soil: { suitable: ["Loamy", "Black", "Red"], phRange: [6.0, 7.5] },
    economics: { yieldPerAcreKg: 800, avgMarketPricePerKg: 60, profitLevel: "medium" },
    gapFarming: { suitable: false, reason: "85-100 days, high oil content, bee pollination needed" },
    seasons: ["Kharif", "Rabi"],
    regions: ["South India", "Central India"],
  },
  {
    id: "sesame",
    name: "Sesame (Til)",
    localNames: ["Til", "Nuvvulu"],
    category: "oilseed",
    duration: { minDays: 80, maxDays: 95, durationType: "long-term" },
    water: { requirement: "low", mmPerSeason: 200, irrigationType: "rainfed" },
    climate: {
      temperature: { min: 25, max: 40 },
      rainfall: { min: 200, max: 400 },
      humidity: { min: 40, max: 65 },
    },
    soil: { suitable: ["Sandy", "Loamy", "Red"], phRange: [5.5, 8.0] },
    economics: { yieldPerAcreKg: 350, avgMarketPricePerKg: 120, profitLevel: "high" },
    gapFarming: { suitable: false, reason: "80-95 days, premium oil crop, export quality" },
    seasons: ["Kharif", "Zaid"],
    regions: ["Central India", "West India", "South India"],
  },
  {
    id: "castor",
    name: "Castor",
    localNames: ["Arandi", "Amudamu"],
    category: "oilseed",
    duration: { minDays: 120, maxDays: 150, durationType: "long-term" },
    water: { requirement: "low", mmPerSeason: 300, irrigationType: "rainfed" },
    climate: {
      temperature: { min: 20, max: 38 },
      rainfall: { min: 300, max: 600 },
      humidity: { min: 40, max: 65 },
    },
    soil: { suitable: ["Sandy", "Loamy", "Red"], phRange: [5.0, 8.0] },
    economics: { yieldPerAcreKg: 600, avgMarketPricePerKg: 50, profitLevel: "medium" },
    gapFarming: { suitable: false, reason: "120-150 days, industrial oil crop, drought tolerant" },
    seasons: ["Kharif"],
    regions: ["West India", "South India"],
  },
  {
    id: "potato",
    name: "Potato",
    localNames: ["Aloo", "Bangala Dumpa"],
    category: "vegetable",
    duration: { minDays: 80, maxDays: 100, durationType: "long-term" },
    water: { requirement: "medium", mmPerSeason: 400, irrigationType: "sprinkler" },
    climate: {
      temperature: { min: 12, max: 25 },
      rainfall: { min: 200, max: 350 },
      humidity: { min: 50, max: 70 },
    },
    soil: { suitable: ["Sandy", "Loamy"], phRange: [5.5, 7.0] },
    economics: { yieldPerAcreKg: 12000, avgMarketPricePerKg: 15, profitLevel: "medium" },
    gapFarming: { suitable: false, reason: "80-100 days, major vegetable crop, storage needed" },
    seasons: ["Rabi"],
    regions: ["North India", "East India", "Central India"],
  },
  {
    id: "onion",
    name: "Onion",
    localNames: ["Pyaz", "Ullipayalu"],
    category: "vegetable",
    duration: { minDays: 100, maxDays: 130, durationType: "long-term" },
    water: { requirement: "medium", mmPerSeason: 400, irrigationType: "drip" },
    climate: {
      temperature: { min: 15, max: 30 },
      rainfall: { min: 200, max: 400 },
      humidity: { min: 50, max: 70 },
    },
    soil: { suitable: ["Loamy", "Black", "Sandy"], phRange: [6.0, 7.5] },
    economics: { yieldPerAcreKg: 10000, avgMarketPricePerKg: 20, profitLevel: "medium" },
    gapFarming: { suitable: false, reason: "100-130 days, price volatile, storage income" },
    seasons: ["Rabi", "Kharif"],
    regions: ["West India", "South India", "Central India"],
  },
  {
    id: "garlic",
    name: "Garlic",
    localNames: ["Lehsun", "Vellulli"],
    category: "vegetable",
    duration: { minDays: 120, maxDays: 150, durationType: "long-term" },
    water: { requirement: "medium", mmPerSeason: 350, irrigationType: "drip" },
    climate: {
      temperature: { min: 10, max: 25 },
      rainfall: { min: 150, max: 300 },
      humidity: { min: 40, max: 60 },
    },
    soil: { suitable: ["Loamy", "Sandy"], phRange: [6.0, 7.5] },
    economics: { yieldPerAcreKg: 3000, avgMarketPricePerKg: 80, profitLevel: "high" },
    gapFarming: { suitable: false, reason: "120-150 days, high value crop, long storage" },
    seasons: ["Rabi"],
    regions: ["Central India", "North India", "West India"],
  },
  {
    id: "turmeric",
    name: "Turmeric (Haldi)",
    localNames: ["Haldi", "Pasupu"],
    category: "cash",
    duration: { minDays: 240, maxDays: 280, durationType: "long-term" },
    water: { requirement: "high", mmPerSeason: 800, irrigationType: "flood" },
    climate: {
      temperature: { min: 20, max: 35 },
      rainfall: { min: 600, max: 1200 },
      humidity: { min: 65, max: 85 },
    },
    soil: { suitable: ["Loamy", "Clay", "Red"], phRange: [5.5, 7.5] },
    economics: { yieldPerAcreKg: 8000, avgMarketPricePerKg: 80, profitLevel: "high" },
    gapFarming: { suitable: false, reason: "8-9 months duration, high value spice crop" },
    seasons: ["Kharif"],
    regions: ["South India", "East India", "Central India"],
  },
  {
    id: "ginger",
    name: "Ginger (Adrak)",
    localNames: ["Adrak", "Allam"],
    category: "cash",
    duration: { minDays: 210, maxDays: 250, durationType: "long-term" },
    water: { requirement: "high", mmPerSeason: 700, irrigationType: "drip" },
    climate: {
      temperature: { min: 20, max: 35 },
      rainfall: { min: 600, max: 1000 },
      humidity: { min: 60, max: 85 },
    },
    soil: { suitable: ["Loamy", "Sandy", "Red"], phRange: [5.5, 7.0] },
    economics: { yieldPerAcreKg: 6000, avgMarketPricePerKg: 60, profitLevel: "high" },
    gapFarming: { suitable: false, reason: "7-8 months, shade tolerant, high value spice" },
    seasons: ["Kharif"],
    regions: ["South India", "East India", "North East India"],
  },
  {
    id: "jute",
    name: "Jute",
    localNames: ["Patsan", "Jute"],
    category: "cash",
    duration: { minDays: 100, maxDays: 120, durationType: "long-term" },
    water: { requirement: "high", mmPerSeason: 600, irrigationType: "flood" },
    climate: {
      temperature: { min: 25, max: 38 },
      rainfall: { min: 800, max: 1500 },
      humidity: { min: 70, max: 90 },
    },
    soil: { suitable: ["Loamy", "Clay"], phRange: [5.5, 7.5] },
    economics: { yieldPerAcreKg: 1000, avgMarketPricePerKg: 45, profitLevel: "low" },
    gapFarming: { suitable: false, reason: "100-120 days, fiber crop, needs retting" },
    seasons: ["Kharif"],
    regions: ["East India"],
  },
  {
    id: "tobacco",
    name: "Tobacco",
    localNames: ["Tambaku", "Pogaku"],
    category: "cash",
    duration: { minDays: 120, maxDays: 150, durationType: "long-term" },
    water: { requirement: "medium", mmPerSeason: 400, irrigationType: "drip" },
    climate: {
      temperature: { min: 18, max: 35 },
      rainfall: { min: 250, max: 500 },
      humidity: { min: 45, max: 70 },
    },
    soil: { suitable: ["Sandy", "Loamy", "Red"], phRange: [5.5, 7.5] },
    economics: { yieldPerAcreKg: 800, avgMarketPricePerKg: 150, profitLevel: "high" },
    gapFarming: { suitable: false, reason: "120-150 days, regulated crop, curing required" },
    seasons: ["Rabi"],
    regions: ["South India", "Central India"],
  },
];

// Combine all crops
export const allCrops: Crop[] = [...shortTermCrops, ...longTermCrops];

// Get crops by duration type
export function getShortTermCrops(): Crop[] {
  return allCrops.filter(crop => crop.duration.durationType === "short-term");
}

export function getLongTermCrops(): Crop[] {
  return allCrops.filter(crop => crop.duration.durationType === "long-term");
}

// Get gap farming suitable crops
export function getGapFarmingCrops(): Crop[] {
  return allCrops.filter(crop => crop.gapFarming.suitable);
}

// ================================================
// DISTRICT/STATE CLIMATE AVERAGES (Pre-stored)
// ================================================
export const regionClimateData: Record<string, {
  avgTemperature: number;
  avgRainfall: number;
  avgHumidity: number;
  soilTypes: string[];
  currentSeason: string;
}> = {
  // Andhra Pradesh Districts
  "Guntur": { avgTemperature: 32, avgRainfall: 350, avgHumidity: 65, soilTypes: ["Black", "Red"], currentSeason: "Kharif" },
  "Krishna": { avgTemperature: 31, avgRainfall: 400, avgHumidity: 70, soilTypes: ["Black", "Loamy"], currentSeason: "Kharif" },
  "East Godavari": { avgTemperature: 30, avgRainfall: 500, avgHumidity: 75, soilTypes: ["Loamy", "Clay"], currentSeason: "Kharif" },
  "West Godavari": { avgTemperature: 30, avgRainfall: 480, avgHumidity: 73, soilTypes: ["Loamy", "Clay"], currentSeason: "Kharif" },
  "Anantapur": { avgTemperature: 33, avgRainfall: 250, avgHumidity: 50, soilTypes: ["Red", "Sandy"], currentSeason: "Kharif" },
  "Kurnool": { avgTemperature: 33, avgRainfall: 280, avgHumidity: 52, soilTypes: ["Black", "Red"], currentSeason: "Kharif" },

  // Telangana Districts  
  "Hyderabad": { avgTemperature: 31, avgRainfall: 350, avgHumidity: 60, soilTypes: ["Red", "Black"], currentSeason: "Kharif" },
  "Warangal": { avgTemperature: 32, avgRainfall: 400, avgHumidity: 65, soilTypes: ["Black", "Red"], currentSeason: "Kharif" },
  "Karimnagar": { avgTemperature: 32, avgRainfall: 380, avgHumidity: 62, soilTypes: ["Black", "Red"], currentSeason: "Kharif" },
  "Khammam": { avgTemperature: 31, avgRainfall: 450, avgHumidity: 68, soilTypes: ["Black", "Red"], currentSeason: "Kharif" },
  "Nizamabad": { avgTemperature: 31, avgRainfall: 400, avgHumidity: 63, soilTypes: ["Black", "Red"], currentSeason: "Kharif" },

  // Uttar Pradesh Districts
  "Lucknow": { avgTemperature: 27, avgRainfall: 300, avgHumidity: 60, soilTypes: ["Loamy", "Clay"], currentSeason: "Kharif" },
  "Varanasi": { avgTemperature: 28, avgRainfall: 350, avgHumidity: 65, soilTypes: ["Loamy", "Sandy"], currentSeason: "Kharif" },
  "Agra": { avgTemperature: 29, avgRainfall: 250, avgHumidity: 55, soilTypes: ["Sandy", "Loamy"], currentSeason: "Kharif" },
  "Meerut": { avgTemperature: 27, avgRainfall: 280, avgHumidity: 58, soilTypes: ["Loamy", "Clay"], currentSeason: "Kharif" },

  // Maharashtra Districts
  "Pune": { avgTemperature: 28, avgRainfall: 400, avgHumidity: 60, soilTypes: ["Black", "Red"], currentSeason: "Kharif" },
  "Nashik": { avgTemperature: 27, avgRainfall: 350, avgHumidity: 55, soilTypes: ["Black", "Loamy"], currentSeason: "Kharif" },
  "Nagpur": { avgTemperature: 30, avgRainfall: 380, avgHumidity: 58, soilTypes: ["Black", "Loamy"], currentSeason: "Kharif" },
  "Ahmednagar": { avgTemperature: 29, avgRainfall: 300, avgHumidity: 52, soilTypes: ["Black", "Red"], currentSeason: "Kharif" },

  // West Bengal Districts
  "Kolkata": { avgTemperature: 29, avgRainfall: 600, avgHumidity: 80, soilTypes: ["Loamy", "Clay"], currentSeason: "Kharif" },
  "Burdwan": { avgTemperature: 28, avgRainfall: 550, avgHumidity: 78, soilTypes: ["Loamy", "Clay"], currentSeason: "Kharif" },
  "Hooghly": { avgTemperature: 28, avgRainfall: 580, avgHumidity: 79, soilTypes: ["Loamy", "Clay"], currentSeason: "Kharif" },
};

// Season data by month
export function getCurrentSeason(month: number): string {
  if (month >= 6 && month <= 9) return "Kharif"; // June-September
  if (month >= 10 || month <= 2) return "Rabi"; // October-February
  return "Zaid"; // March-May
}

export function getSeasonMonths(season: string): string {
  switch (season) {
    case "Kharif": return "June - September (Monsoon)";
    case "Rabi": return "October - February (Winter)";
    case "Zaid": return "March - May (Summer)";
    default: return "";
  }
}
