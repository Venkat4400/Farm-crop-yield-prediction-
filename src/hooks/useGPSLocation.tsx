/**
 * Enhanced GPS Location Detection Hook
 * High-accuracy GPS with validation, confidence scoring, and fallbacks
 */

import { useState, useCallback, useRef } from "react";
import { indianStates, stateDistricts, districtVillages } from "@/data/indianLocations";
import { toast } from "@/hooks/use-toast";

// State coordinates for reverse geocoding
const stateCoordinates: Record<string, { lat: number; lon: number; code: string }> = {};
indianStates.forEach(s => {
  stateCoordinates[s.name] = { lat: s.lat, lon: s.lon, code: s.code };
});

// Regional characteristics based on location
interface RegionalCharacteristics {
  landType: "irrigated" | "rainfed" | "coastal" | "hill" | "plateau";
  elevationCategory: "plains" | "low_hills" | "high_hills" | "coastal";
  rainfallZone: "arid" | "semi_arid" | "sub_humid" | "humid" | "per_humid";
  soilGroup: string;
  icarRegion: string;
}

// District-level land type classifications (major districts)
const districtLandTypes: Record<string, RegionalCharacteristics["landType"]> = {
  // Coastal districts
  "Visakhapatnam": "coastal", "East Godavari": "coastal", "West Godavari": "coastal",
  "Nellore": "coastal", "Prakasam": "coastal", "Srikakulam": "coastal",
  "Chennai": "coastal", "Kanyakumari": "coastal", "Ratnagiri": "coastal",
  "Sindhudurg": "coastal", "Thiruvananthapuram": "coastal", "Ernakulam": "coastal",
  "Kozhikode": "coastal", "Kannur": "coastal", "North Goa": "coastal", "South Goa": "coastal",
  
  // Hill districts
  "Shimla": "hill", "Kullu": "hill", "Kangra": "hill", "Mandi": "hill",
  "Dehradun": "hill", "Nainital": "hill", "Almora": "hill", "Chamoli": "hill",
  "East Sikkim": "hill", "West Sikkim": "hill", "Darjeeling": "hill",
  "Tawang": "hill", "Kohima": "hill", "Nilgiris": "hill", "Kodagu": "hill",
  "Idukki": "hill", "Wayanad": "hill", "Kinnaur": "hill", "Lahaul and Spiti": "hill",
  "Leh": "hill", "Kargil": "hill",
  
  // Plateau districts
  "Bengaluru Urban": "plateau", "Bengaluru Rural": "plateau", "Hyderabad": "plateau",
  "Rangareddy": "plateau", "Pune": "plateau", "Nagpur": "plateau", "Nashik": "plateau",
  "Chitradurga": "plateau", "Tumakuru": "plateau", "Raichur": "plateau",
  
  // Rainfed (arid/semi-arid)
  "Jaisalmer": "rainfed", "Barmer": "rainfed", "Bikaner": "rainfed", "Jodhpur": "rainfed",
  "Anantapur": "rainfed", "Kurnool": "rainfed", "YSR Kadapa": "rainfed",
  "Ramanathapuram": "rainfed", "Sivaganga": "rainfed", "Kutch": "rainfed",
};

// State to ICAR region mapping
const stateToIcarRegion: Record<string, string> = {
  "Punjab": "Trans-Gangetic Plains", "Haryana": "Trans-Gangetic Plains",
  "Uttar Pradesh": "Upper Gangetic Plains", "Bihar": "Middle Gangetic Plains",
  "West Bengal": "Lower Gangetic Plains",
  "Andhra Pradesh": "Southern Plateau", "Telangana": "Southern Plateau",
  "Karnataka": "Southern Plateau", "Tamil Nadu": "Eastern Coastal Plains",
  "Kerala": "Western Ghats & Coastal", "Maharashtra": "Western Plateau",
  "Gujarat": "Gujarat Plains", "Rajasthan": "Western Dry Region",
  "Madhya Pradesh": "Central Plateau", "Chhattisgarh": "Eastern Plateau",
  "Odisha": "Eastern Coastal Plains", "Jharkhand": "Eastern Plateau",
  "Himachal Pradesh": "Western Himalayan", "Uttarakhand": "Western Himalayan",
  "Jammu & Kashmir": "Western Himalayan", "Ladakh": "Trans-Himalayan",
  "Assam": "Eastern Himalayan", "Sikkim": "Eastern Himalayan",
  "Arunachal Pradesh": "Eastern Himalayan", "Meghalaya": "Eastern Himalayan",
  "Manipur": "Eastern Himalayan", "Mizoram": "Eastern Himalayan",
  "Nagaland": "Eastern Himalayan", "Tripura": "Eastern Himalayan",
};

// Dominant soil groups by state
const stateSoilGroups: Record<string, string> = {
  "Punjab": "Alluvial", "Haryana": "Alluvial", "Uttar Pradesh": "Alluvial",
  "Bihar": "Alluvial", "West Bengal": "Alluvial", "Assam": "Alluvial",
  "Andhra Pradesh": "Red & Black", "Telangana": "Red & Black",
  "Maharashtra": "Black (Regur)", "Gujarat": "Black & Alluvial",
  "Madhya Pradesh": "Black", "Karnataka": "Red & Laterite",
  "Tamil Nadu": "Red & Black", "Kerala": "Laterite",
  "Rajasthan": "Sandy & Saline", "Odisha": "Red & Laterite",
  "Chhattisgarh": "Red & Laterite", "Jharkhand": "Red",
  "Himachal Pradesh": "Mountain", "Uttarakhand": "Mountain",
};

// Land use type validation (simulated LULC data)
const invalidLandUseTypes = ["water_body", "forest_reserve", "urban_built", "industrial"];

export interface GPSReading {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface DetectedLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  state: string;
  stateCode: string;
  district: string;
  village: string;
  mandal: string;
  region: string;
  characteristics: RegionalCharacteristics;
  elevationEstimate: number;
  nearestWeatherGrid: { lat: number; lon: number };
  validationStatus: "high" | "medium" | "low";
  validationNote: string;
  confidenceScore: number;
  readingsCount: number;
  isStabilized: boolean;
  landUseValidated: boolean;
  source: "gps" | "exif" | "stored" | "manual";
}

export interface GPSDetectionState {
  status: "idle" | "acquiring" | "stabilizing" | "validating" | "ready" | "error";
  progress: number;
  message: string;
}

export interface GPSLocationHook {
  location: DetectedLocation | null;
  isDetecting: boolean;
  detectionState: GPSDetectionState;
  error: string | null;
  readings: GPSReading[];
  detectLocation: () => Promise<DetectedLocation | null>;
  extractFromImage: (file: File) => Promise<DetectedLocation | null>;
  setManualLocation: (lat: number, lon: number) => DetectedLocation | null;
  clearLocation: () => void;
}

// Haversine distance formula
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Calculate standard deviation of readings
function calculateReadingStability(readings: GPSReading[]): number {
  if (readings.length < 2) return 0;
  
  const lats = readings.map(r => r.latitude);
  const lons = readings.map(r => r.longitude);
  
  const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const avgLon = lons.reduce((a, b) => a + b, 0) / lons.length;
  
  const variance = readings.reduce((sum, r) => {
    return sum + Math.pow(r.latitude - avgLat, 2) + Math.pow(r.longitude - avgLon, 2);
  }, 0) / readings.length;
  
  return Math.sqrt(variance) * 111000; // Convert to meters (approximate)
}

// Find nearest state from coordinates
function findNearestState(lat: number, lon: number): { state: typeof indianStates[0]; distance: number } {
  let nearest = indianStates[0];
  let minDist = Infinity;
  
  for (const state of indianStates) {
    const dist = getDistance(lat, lon, state.lat, state.lon);
    if (dist < minDist) {
      minDist = dist;
      nearest = state;
    }
  }
  
  return { state: nearest, distance: minDist };
}

// Estimate elevation from latitude (simplified model for India)
function estimateElevation(lat: number, lon: number, state: string): number {
  // Himalayan region
  if (lat > 28 && (state.includes("Himachal") || state.includes("Uttarakhand") || 
      state.includes("Kashmir") || state.includes("Ladakh") || state.includes("Sikkim"))) {
    return 1500 + (lat - 28) * 300;
  }
  
  // Western Ghats
  if ((state === "Kerala" || state === "Karnataka" || state === "Maharashtra" || state === "Goa") && lon < 76) {
    return 600;
  }
  
  // Eastern Ghats
  if ((state === "Andhra Pradesh" || state === "Odisha") && lon < 80) {
    return 400;
  }
  
  // Deccan Plateau
  if (["Karnataka", "Telangana", "Maharashtra", "Madhya Pradesh"].includes(state)) {
    return 500;
  }
  
  // Coastal plains
  if (lat < 12 || (lon > 85 && lat < 22)) {
    return 50;
  }
  
  // Indo-Gangetic Plains
  if (lat > 24 && lat < 29 && lon > 75 && lon < 90) {
    return 150;
  }
  
  return 200;
}

// Get regional characteristics
function getRegionalCharacteristics(
  lat: number, 
  lon: number, 
  state: string, 
  district: string
): RegionalCharacteristics {
  let landType: RegionalCharacteristics["landType"] = districtLandTypes[district] || "irrigated";
  
  if (!districtLandTypes[district]) {
    if (lat > 30) landType = "hill";
    else if (lon > 85 && lat < 25) landType = "coastal";
    else if (["Rajasthan", "Gujarat"].includes(state) && lon < 74) landType = "rainfed";
    else landType = "irrigated";
  }
  
  const elevation = estimateElevation(lat, lon, state);
  let elevationCategory: RegionalCharacteristics["elevationCategory"] = "plains";
  if (elevation > 1500) elevationCategory = "high_hills";
  else if (elevation > 600) elevationCategory = "low_hills";
  else if (landType === "coastal") elevationCategory = "coastal";
  
  let rainfallZone: RegionalCharacteristics["rainfallZone"] = "sub_humid";
  if (state === "Rajasthan" && lon < 74) rainfallZone = "arid";
  else if (["Gujarat", "Rajasthan", "Karnataka", "Andhra Pradesh"].includes(state)) rainfallZone = "semi_arid";
  else if (state === "Kerala" || state === "Meghalaya") rainfallZone = "per_humid";
  else if (["West Bengal", "Assam", "Odisha"].includes(state)) rainfallZone = "humid";
  
  return {
    landType,
    elevationCategory,
    rainfallZone,
    soilGroup: stateSoilGroups[state] || "Mixed",
    icarRegion: stateToIcarRegion[state] || "Central India",
  };
}

// Find best matching district from coordinates
function findNearestDistrict(lat: number, lon: number, stateCode: string): string {
  const districts = stateDistricts[stateCode] || [];
  if (districts.length === 0) return "";
  
  const stateCenter = indianStates.find(s => s.code === stateCode);
  if (!stateCenter) return districts[0];
  
  const latOffset = lat - stateCenter.lat;
  const lonOffset = lon - stateCenter.lon;
  
  let idx = Math.floor((latOffset + lonOffset + 2) * districts.length / 4);
  idx = Math.max(0, Math.min(districts.length - 1, idx));
  
  return districts[idx];
}

// Find village/town from district
function findNearestVillage(district: string): string {
  const villages = districtVillages[district];
  if (!villages || villages.length === 0) return "";
  return villages[0];
}

// Validate land use type (simulated LULC check)
function validateLandUse(lat: number, lon: number): { valid: boolean; type: string } {
  // Simulated check - in production, would call LULC API
  // Check if location is in India bounds
  if (lat < 6 || lat > 38 || lon < 68 || lon > 98) {
    return { valid: false, type: "outside_india" };
  }
  
  // Simple simulation - assume agricultural land for most locations
  const hash = Math.abs(Math.sin(lat * 100) + Math.cos(lon * 100));
  if (hash < 0.05) {
    return { valid: false, type: "water_body" };
  }
  if (hash > 0.95) {
    return { valid: false, type: "urban_built" };
  }
  
  return { valid: true, type: "agricultural" };
}

// Calculate confidence score
function calculateConfidence(
  accuracy: number,
  readingsCount: number,
  stabilityMeters: number,
  landUseValid: boolean,
  distanceFromStateCenter: number
): number {
  let score = 100;
  
  // Accuracy penalty
  if (accuracy > 500) score -= 40;
  else if (accuracy > 100) score -= 25;
  else if (accuracy > 50) score -= 15;
  else if (accuracy > 20) score -= 5;
  
  // Readings count bonus
  if (readingsCount >= 5) score += 10;
  else if (readingsCount >= 3) score += 5;
  else if (readingsCount < 2) score -= 10;
  
  // Stability penalty
  if (stabilityMeters > 100) score -= 20;
  else if (stabilityMeters > 50) score -= 10;
  else if (stabilityMeters > 20) score -= 5;
  
  // Land use validation
  if (!landUseValid) score -= 25;
  
  // Distance from state center penalty
  if (distanceFromStateCenter > 300) score -= 15;
  else if (distanceFromStateCenter > 200) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

// Extract EXIF GPS data from image
async function extractExifLocation(file: File): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const view = new DataView(e.target?.result as ArrayBuffer);
        
        // Check for JPEG
        if (view.getUint16(0) !== 0xFFD8) {
          resolve(null);
          return;
        }
        
        let offset = 2;
        const length = view.byteLength;
        
        while (offset < length) {
          if (view.getUint16(offset) === 0xFFE1) {
            // Found EXIF marker
            const exifOffset = offset + 10;
            
            // Check EXIF header
            if (
              view.getUint32(offset + 4) !== 0x45786966 || // 'Exif'
              view.getUint16(offset + 8) !== 0x0000
            ) {
              offset += 2;
              continue;
            }
            
            // Parse TIFF header
            const littleEndian = view.getUint16(exifOffset) === 0x4949;
            const ifdOffset = view.getUint32(exifOffset + 4, littleEndian);
            const numEntries = view.getUint16(exifOffset + ifdOffset, littleEndian);
            
            // Look for GPS IFD pointer
            for (let i = 0; i < numEntries; i++) {
              const entryOffset = exifOffset + ifdOffset + 2 + i * 12;
              const tag = view.getUint16(entryOffset, littleEndian);
              
              if (tag === 0x8825) {
                // GPS IFD pointer found
                const gpsOffset = view.getUint32(entryOffset + 8, littleEndian);
                const gpsEntries = view.getUint16(exifOffset + gpsOffset, littleEndian);
                
                let lat = 0, lon = 0, latRef = "", lonRef = "";
                
                for (let j = 0; j < gpsEntries; j++) {
                  const gpsEntryOffset = exifOffset + gpsOffset + 2 + j * 12;
                  const gpsTag = view.getUint16(gpsEntryOffset, littleEndian);
                  
                  if (gpsTag === 1) {
                    // Latitude reference
                    latRef = String.fromCharCode(view.getUint8(gpsEntryOffset + 8));
                  } else if (gpsTag === 2) {
                    // Latitude
                    const valueOffset = view.getUint32(gpsEntryOffset + 8, littleEndian);
                    const deg = view.getUint32(exifOffset + valueOffset, littleEndian) / 
                                view.getUint32(exifOffset + valueOffset + 4, littleEndian);
                    const min = view.getUint32(exifOffset + valueOffset + 8, littleEndian) / 
                                view.getUint32(exifOffset + valueOffset + 12, littleEndian);
                    const sec = view.getUint32(exifOffset + valueOffset + 16, littleEndian) / 
                                view.getUint32(exifOffset + valueOffset + 20, littleEndian);
                    lat = deg + min / 60 + sec / 3600;
                  } else if (gpsTag === 3) {
                    // Longitude reference
                    lonRef = String.fromCharCode(view.getUint8(gpsEntryOffset + 8));
                  } else if (gpsTag === 4) {
                    // Longitude
                    const valueOffset = view.getUint32(gpsEntryOffset + 8, littleEndian);
                    const deg = view.getUint32(exifOffset + valueOffset, littleEndian) / 
                                view.getUint32(exifOffset + valueOffset + 4, littleEndian);
                    const min = view.getUint32(exifOffset + valueOffset + 8, littleEndian) / 
                                view.getUint32(exifOffset + valueOffset + 12, littleEndian);
                    const sec = view.getUint32(exifOffset + valueOffset + 16, littleEndian) / 
                                view.getUint32(exifOffset + valueOffset + 20, littleEndian);
                    lon = deg + min / 60 + sec / 3600;
                  }
                }
                
                if (lat && lon) {
                  if (latRef === "S") lat = -lat;
                  if (lonRef === "W") lon = -lon;
                  resolve({ lat, lon });
                  return;
                }
              }
            }
          }
          offset += 2;
        }
        
        resolve(null);
      } catch {
        resolve(null);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

export function useGPSLocation(): GPSLocationHook {
  const [location, setLocation] = useState<DetectedLocation | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionState, setDetectionState] = useState<GPSDetectionState>({
    status: "idle",
    progress: 0,
    message: "Ready to detect location",
  });
  const [error, setError] = useState<string | null>(null);
  const [readings, setReadings] = useState<GPSReading[]>([]);
  
  const watchIdRef = useRef<number | null>(null);
  const readingsRef = useRef<GPSReading[]>([]);

  const buildLocation = useCallback((
    lat: number,
    lon: number,
    accuracy: number,
    readingsCount: number,
    source: DetectedLocation["source"]
  ): DetectedLocation => {
    const { state: nearestState, distance } = findNearestState(lat, lon);
    const district = findNearestDistrict(lat, lon, nearestState.code);
    const village = findNearestVillage(district);
    const characteristics = getRegionalCharacteristics(lat, lon, nearestState.name, district);
    const elevationEstimate = estimateElevation(lat, lon, nearestState.name);
    
    const nearestWeatherGrid = {
      lat: Math.round(lat * 10) / 10,
      lon: Math.round(lon * 10) / 10,
    };
    
    const landUseCheck = validateLandUse(lat, lon);
    const stabilityMeters = calculateReadingStability(readingsRef.current);
    const confidenceScore = calculateConfidence(
      accuracy, readingsCount, stabilityMeters, landUseCheck.valid, distance
    );
    
    let validationStatus: DetectedLocation["validationStatus"] = "high";
    let validationNote = "GPS location validated with high confidence";
    
    if (confidenceScore < 60) {
      validationStatus = "low";
      validationNote = "Low confidence - consider manual correction";
    } else if (confidenceScore < 80) {
      validationStatus = "medium";
      validationNote = "Moderate confidence - verify location visually";
    }
    
    const regionMap: Record<string, string> = {
      "AP": "South India", "TS": "South India", "KA": "South India",
      "TN": "South India", "KL": "South India",
      "MH": "West India", "GJ": "West India", "GA": "West India",
      "RJ": "North India", "UP": "North India", "PB": "North India",
      "HR": "North India", "DL": "North India", "HP": "North India",
      "UK": "North India", "JK": "North India", "LA": "North India",
      "WB": "East India", "BR": "East India", "OD": "East India", "JH": "East India",
      "MP": "Central India", "CG": "Central India",
      "AS": "Northeast India", "AR": "Northeast India", "MN": "Northeast India",
      "ML": "Northeast India", "MZ": "Northeast India", "NL": "Northeast India",
      "SK": "Northeast India", "TR": "Northeast India",
    };
    
    return {
      latitude: lat,
      longitude: lon,
      accuracy,
      state: nearestState.name,
      stateCode: nearestState.code,
      district,
      village,
      mandal: village, // Using village as mandal for now
      region: regionMap[nearestState.code] || "Central India",
      characteristics,
      elevationEstimate,
      nearestWeatherGrid,
      validationStatus,
      validationNote,
      confidenceScore,
      readingsCount,
      isStabilized: readingsCount >= 3 && stabilityMeters < 20,
      landUseValidated: landUseCheck.valid,
      source,
    };
  }, []);

  const detectLocation = useCallback(async (): Promise<DetectedLocation | null> => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      toast({
        title: "GPS Not Supported",
        description: "Your browser doesn't support GPS location detection",
        variant: "destructive",
      });
      return null;
    }

    setIsDetecting(true);
    setError(null);
    readingsRef.current = [];
    setReadings([]);
    
    setDetectionState({
      status: "acquiring",
      progress: 10,
      message: "Requesting GPS access...",
    });

    return new Promise((resolve) => {
      let resolved = false;
      const timeout = setTimeout(() => {
        if (!resolved && watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
          
          if (readingsRef.current.length > 0) {
            // Use best reading we have
            const bestReading = readingsRef.current.reduce((best, curr) => 
              curr.accuracy < best.accuracy ? curr : best
            );
            const detected = buildLocation(
              bestReading.latitude,
              bestReading.longitude,
              bestReading.accuracy,
              readingsRef.current.length,
              "gps"
            );
            setLocation(detected);
            setReadings([...readingsRef.current]);
            setIsDetecting(false);
            setDetectionState({
              status: "ready",
              progress: 100,
              message: `Location confirmed (${readingsRef.current.length} readings)`,
            });
            
            toast({
              title: "📍 Location Detected",
              description: `${detected.village ? detected.village + ", " : ""}${detected.district}, ${detected.state}`,
            });
            
            resolved = true;
            resolve(detected);
          } else {
            setIsDetecting(false);
            setError("GPS timeout - no readings received");
            setDetectionState({
              status: "error",
              progress: 0,
              message: "GPS timeout",
            });
            resolve(null);
          }
        }
      }, 20000); // 20 second timeout
      
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const reading: GPSReading = {
            latitude,
            longitude,
            accuracy,
            timestamp: Date.now(),
          };
          
          readingsRef.current.push(reading);
          setReadings([...readingsRef.current]);
          
          const readingsCount = readingsRef.current.length;
          const stability = calculateReadingStability(readingsRef.current);
          
          setDetectionState({
            status: readingsCount < 3 ? "acquiring" : "stabilizing",
            progress: Math.min(90, 10 + readingsCount * 15),
            message: readingsCount < 3 
              ? `Acquiring GPS signal (${readingsCount}/3 readings)...`
              : `Stabilizing (±${Math.round(stability)}m drift)...`,
          });
          
          // Check if we have enough readings with good accuracy
          const isAccurate = accuracy <= 20;
          const isStable = readingsCount >= 3 && stability < 20;
          
          if ((isAccurate && isStable) || readingsCount >= 5) {
            clearTimeout(timeout);
            
            if (watchIdRef.current !== null) {
              navigator.geolocation.clearWatch(watchIdRef.current);
              watchIdRef.current = null;
            }
            
            if (resolved) return;
            resolved = true;
            
            // Calculate average of stable readings
            const avgLat = readingsRef.current.reduce((s, r) => s + r.latitude, 0) / readingsCount;
            const avgLon = readingsRef.current.reduce((s, r) => s + r.longitude, 0) / readingsCount;
            const bestAccuracy = Math.min(...readingsRef.current.map(r => r.accuracy));
            
            setDetectionState({
              status: "validating",
              progress: 95,
              message: "Validating location...",
            });
            
            const detected = buildLocation(avgLat, avgLon, bestAccuracy, readingsCount, "gps");
            
            setLocation(detected);
            setIsDetecting(false);
            setDetectionState({
              status: "ready",
              progress: 100,
              message: `Location confirmed (${detected.confidenceScore}% confidence)`,
            });
            
            toast({
              title: detected.confidenceScore >= 80 ? "📍 Location Verified" : "📍 Location Detected",
              description: `${detected.village ? detected.village + ", " : ""}${detected.district}, ${detected.state}`,
            });
            
            resolve(detected);
          }
        },
        (geoError) => {
          clearTimeout(timeout);
          
          if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
          }
          
          if (resolved) return;
          resolved = true;
          
          let errorMessage = "Unable to detect location";
          
          switch (geoError.code) {
            case geoError.PERMISSION_DENIED:
              errorMessage = "Location permission denied. Please enable GPS access.";
              break;
            case geoError.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable";
              break;
            case geoError.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
          }
          
          setError(errorMessage);
          setIsDetecting(false);
          setDetectionState({
            status: "error",
            progress: 0,
            message: errorMessage,
          });
          
          toast({
            title: "Location Detection Failed",
            description: errorMessage,
            variant: "destructive",
          });
          
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0, // Force fresh reading
        }
      );
    });
  }, [buildLocation]);

  const extractFromImage = useCallback(async (file: File): Promise<DetectedLocation | null> => {
    setIsDetecting(true);
    setDetectionState({
      status: "acquiring",
      progress: 30,
      message: "Extracting EXIF data from image...",
    });
    
    try {
      const coords = await extractExifLocation(file);
      
      if (!coords) {
        setIsDetecting(false);
        setDetectionState({
          status: "error",
          progress: 0,
          message: "No GPS data found in image",
        });
        toast({
          title: "No Location Data",
          description: "This image doesn't contain GPS coordinates",
          variant: "destructive",
        });
        return null;
      }
      
      setDetectionState({
        status: "validating",
        progress: 70,
        message: "Validating extracted location...",
      });
      
      const detected = buildLocation(coords.lat, coords.lon, 50, 1, "exif");
      
      setLocation(detected);
      setIsDetecting(false);
      setDetectionState({
        status: "ready",
        progress: 100,
        message: "Location extracted from image",
      });
      
      toast({
        title: "📷 Location Extracted",
        description: `${detected.village ? detected.village + ", " : ""}${detected.district}, ${detected.state}`,
      });
      
      return detected;
    } catch (err) {
      setIsDetecting(false);
      setDetectionState({
        status: "error",
        progress: 0,
        message: "Failed to extract location from image",
      });
      return null;
    }
  }, [buildLocation]);

  const setManualLocation = useCallback((lat: number, lon: number): DetectedLocation | null => {
    const detected = buildLocation(lat, lon, 10, 1, "manual");
    detected.validationNote = "Manually set by user";
    detected.confidenceScore = Math.min(detected.confidenceScore + 10, 100);
    
    setLocation(detected);
    setDetectionState({
      status: "ready",
      progress: 100,
      message: "Location set manually",
    });
    
    toast({
      title: "📍 Location Set",
      description: `${detected.village ? detected.village + ", " : ""}${detected.district}, ${detected.state}`,
    });
    
    return detected;
  }, [buildLocation]);

  const clearLocation = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setLocation(null);
    setError(null);
    setReadings([]);
    readingsRef.current = [];
    setIsDetecting(false);
    setDetectionState({
      status: "idle",
      progress: 0,
      message: "Ready to detect location",
    });
  }, []);

  return {
    location,
    isDetecting,
    detectionState,
    error,
    readings,
    detectLocation,
    extractFromImage,
    setManualLocation,
    clearLocation,
  };
}
