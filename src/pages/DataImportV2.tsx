import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Upload, Database, AlertCircle, CheckCircle, Trash2, BarChart3 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ImportStats {
  total_records: number;
  unique_states: number;
  unique_crops: number;
  unique_districts: number;
  year_range: string;
  avg_yield: number;
}

interface CSVRow {
  state: string;
  district: string;
  crop_year?: string;
  year?: string;
  season: string;
  crop: string;
  area?: string;
  production?: string;
  yield?: string;
  annual_rainfall?: string;
  fertilizer?: string;
  pesticide?: string;
}

// Season normalization
const normalizeSeason = (season: string): string => {
  const s = season?.toLowerCase()?.trim() || "";
  const mapping: Record<string, string> = {
    'winter': 'rabi',
    'summer': 'zaid',
    'autumn': 'kharif',
    'whole year': 'annual',
    'monsoon': 'kharif',
  };
  return mapping[s] || s;
};

// State to region mapping
const mapStateToRegion = (state: string): string => {
  const stateUpper = state?.toUpperCase() || "";
  
  const regionMapping: Record<string, string[]> = {
    "north-india": ["JAMMU AND KASHMIR", "HIMACHAL PRADESH", "PUNJAB", "HARYANA", "UTTARAKHAND", "UTTAR PRADESH", "DELHI"],
    "south-india": ["ANDHRA PRADESH", "TELANGANA", "KARNATAKA", "TAMIL NADU", "KERALA", "PUDUCHERRY"],
    "east-india": ["BIHAR", "JHARKHAND", "WEST BENGAL", "ODISHA", "ASSAM", "SIKKIM", "ARUNACHAL PRADESH", "NAGALAND", "MANIPUR", "MIZORAM", "TRIPURA", "MEGHALAYA"],
    "west-india": ["RAJASTHAN", "GUJARAT", "MAHARASHTRA", "GOA"],
    "central-india": ["MADHYA PRADESH", "CHHATTISGARH"],
  };

  for (const [region, states] of Object.entries(regionMapping)) {
    if (states.some(s => stateUpper.includes(s) || s.includes(stateUpper))) {
      return region;
    }
  }
  
  return "central-india";
};

// Parse CSV text
const parseCSV = (csvText: string): CSVRow[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  const data: CSVRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    // Handle CSV with quoted fields
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    if (values.length >= headers.length) {
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      data.push(row as CSVRow);
    }
  }
  
  return data;
};

export default function DataImportV2() {
  const navigate = useNavigate();
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState<ImportStats | null>(null);
  const [importComplete, setImportComplete] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      // Get total count
      const { count: totalCount } = await supabase
        .from("crop_yield_data")
        .select("*", { count: "exact", head: true });

      // Get unique states
      const { data: statesData } = await supabase
        .from("crop_yield_data")
        .select("state");
      const uniqueStates = new Set(statesData?.map(r => r.state).filter(Boolean)).size;

      // Get unique crops
      const { data: cropsData } = await supabase
        .from("crop_yield_data")
        .select("crop");
      const uniqueCrops = new Set(cropsData?.map(r => r.crop).filter(Boolean)).size;

      // Get unique districts
      const { data: districtsData } = await supabase
        .from("crop_yield_data")
        .select("district");
      const uniqueDistricts = new Set(districtsData?.map(r => r.district).filter(Boolean)).size;

      // Get year range and avg yield
      const { data: yieldData } = await supabase
        .from("crop_yield_data")
        .select("year, yield");
      
      const years = yieldData?.map(r => r.year).filter(Boolean).sort() || [];
      const yields = yieldData?.map(r => r.yield).filter(Boolean) || [];
      const avgYield = yields.length > 0 
        ? Math.round(yields.reduce((a, b) => a + b, 0) / yields.length)
        : 0;

      setStats({
        total_records: totalCount || 0,
        unique_states: uniqueStates,
        unique_crops: uniqueCrops,
        unique_districts: uniqueDistricts,
        year_range: years.length > 0 ? `${years[0]} - ${years[years.length - 1]}` : "N/A",
        avg_yield: avgYield,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const clearDatabase = async () => {
    if (!confirm("Are you sure you want to clear ALL existing data? This cannot be undone.")) {
      return;
    }
    
    setIsClearing(true);
    try {
      const { error } = await supabase
        .from("crop_yield_data")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;

      toast({
        title: "Database Cleared",
        description: "All existing crop yield data has been removed.",
      });
      
      await fetchStats();
    } catch (error) {
      toast({
        title: "Error Clearing Database",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setProgress(0);
    setMessage("Reading file...");
    setImportComplete(false);

    try {
      const text = await file.text();
      const data = parseCSV(text);
      
      if (data.length === 0) {
        throw new Error("No valid data found in CSV");
      }

      setMessage(`Parsed ${data.length.toLocaleString()} records. Preparing import...`);
      setProgress(5);

      // Clear existing data first
      setMessage("Clearing existing data...");
      await supabase
        .from("crop_yield_data")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
      setProgress(10);

      // Import in batches
      const batchSize = 500;
      const totalBatches = Math.ceil(data.length / batchSize);
      let imported = 0;

      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, Math.min(i + batchSize, data.length));
        const batchNum = Math.floor(i / batchSize) + 1;
        
        setMessage(`Importing batch ${batchNum}/${totalBatches}...`);
        
        // Transform data for database
        const records = batch.map(row => ({
          state: row.state || null,
          district: row.district || null,
          year: parseInt(row.crop_year || row.year || "0") || null,
          season: normalizeSeason(row.season || "kharif"),
          crop: row.crop?.toLowerCase()?.trim() || null,
          area_hectares: parseFloat(row.area || "0") || null,
          production: parseFloat(row.production || "0") || null,
          yield: parseFloat(row.yield || "0") || 0,
          rainfall: parseFloat(row.annual_rainfall || "0") || 0,
          annual_rainfall: parseFloat(row.annual_rainfall || "0") || null,
          fertilizer_used: row.fertilizer ? String(row.fertilizer) : null,
          pesticide: parseFloat(row.pesticide || "0") || null,
          region: mapStateToRegion(row.state || ""),
          temperature: null,
          humidity: null,
          soil_type: null,
          irrigation_type: null,
        })).filter(r => r.yield > 0 && r.crop); // Only valid records

        const { error } = await supabase
          .from("crop_yield_data")
          .insert(records);

        if (error) {
          console.error(`Batch ${batchNum} error:`, error);
        } else {
          imported += records.length;
        }

        const progressPercent = 10 + ((i + batch.length) / data.length) * 85;
        setProgress(progressPercent);
      }

      setProgress(100);
      setMessage(`Import complete! ${imported.toLocaleString()} records imported.`);
      setImportComplete(true);

      toast({
        title: "Import Successful! 🎉",
        description: `${imported.toLocaleString()} crop yield records imported successfully.`,
      });

      await fetchStats();
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      setMessage("Import failed. Please check the file format.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Import v2.0</h1>
            <p className="text-gray-600">
              Import your cleaned agricultural dataset for ML predictions
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card className="border-2 border-dashed border-green-300 hover:border-green-500 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-green-600" />
                Upload Dataset
              </CardTitle>
              <CardDescription>
                Upload your cleaned CSV file with crop yield data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center p-8 bg-green-50 rounded-lg">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={isImporting}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className={`cursor-pointer flex flex-col items-center gap-3 ${
                    isImporting ? "opacity-50" : "hover:opacity-80"
                  }`}
                >
                  <div className="p-4 bg-green-100 rounded-full">
                    <Upload className="h-8 w-8 text-green-600" />
                  </div>
                  <span className="text-lg font-medium text-gray-700">
                    {isImporting ? "Importing..." : "Click to upload CSV"}
                  </span>
                  <span className="text-sm text-gray-500">
                    Supports up to 500K+ records
                  </span>
                </label>
              </div>

              {isImporting && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-3" />
                  <p className="text-sm text-gray-600 text-center">{message}</p>
                </div>
              )}

              {importComplete && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Success!</AlertTitle>
                  <AlertDescription className="text-green-700">
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={clearDatabase}
                  disabled={isClearing || isImporting}
                  className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isClearing ? "Clearing..." : "Clear All Data"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Database Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Database Statistics
              </CardTitle>
              <CardDescription>
                Current state of your crop yield database
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-700">
                      {stats.total_records.toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-600">Total Records</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-700">
                      {stats.unique_states}
                    </p>
                    <p className="text-sm text-green-600">States</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-700">
                      {stats.unique_crops}
                    </p>
                    <p className="text-sm text-purple-600">Crops</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-700">
                      {stats.unique_districts}
                    </p>
                    <p className="text-sm text-orange-600">Districts</p>
                  </div>
                  <div className="p-4 bg-teal-50 rounded-lg">
                    <p className="text-2xl font-bold text-teal-700">
                      {stats.year_range}
                    </p>
                    <p className="text-sm text-teal-600">Year Range</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <p className="text-2xl font-bold text-amber-700">
                      {stats.avg_yield.toLocaleString()}
                    </p>
                    <p className="text-sm text-amber-600">Avg Yield (kg/ha)</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-pulse text-gray-400">
                    Loading statistics...
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Expected Format */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              Expected CSV Format
            </CardTitle>
            <CardDescription>
              Your dataset should have these columns (case-insensitive)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-blue-50 border-blue-200 mb-4">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Required Columns</AlertTitle>
              <AlertDescription className="text-blue-700">
                State, District, Crop_Year (or Year), Season, Crop, Area, Production, Yield
              </AlertDescription>
            </Alert>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Column</th>
                    <th className="border p-2 text-left">Description</th>
                    <th className="border p-2 text-left">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border p-2 font-medium">State</td><td className="border p-2">Indian state name</td><td className="border p-2">Andhra Pradesh</td></tr>
                  <tr><td className="border p-2 font-medium">District</td><td className="border p-2">District name</td><td className="border p-2">Guntur</td></tr>
                  <tr><td className="border p-2 font-medium">Crop_Year / Year</td><td className="border p-2">Year of cultivation</td><td className="border p-2">2020</td></tr>
                  <tr><td className="border p-2 font-medium">Season</td><td className="border p-2">Kharif, Rabi, Zaid, etc.</td><td className="border p-2">Kharif</td></tr>
                  <tr><td className="border p-2 font-medium">Crop</td><td className="border p-2">Crop name</td><td className="border p-2">Rice</td></tr>
                  <tr><td className="border p-2 font-medium">Area</td><td className="border p-2">Area in hectares</td><td className="border p-2">1250.5</td></tr>
                  <tr><td className="border p-2 font-medium">Production</td><td className="border p-2">Production in tons</td><td className="border p-2">3750</td></tr>
                  <tr><td className="border p-2 font-medium">Yield</td><td className="border p-2">Yield (tons/ha or kg/ha)</td><td className="border p-2">3000</td></tr>
                  <tr><td className="border p-2 font-medium">Annual_Rainfall</td><td className="border p-2">Rainfall in mm (optional)</td><td className="border p-2">1200</td></tr>
                  <tr><td className="border p-2 font-medium">Fertilizer</td><td className="border p-2">Fertilizer kg/ha (optional)</td><td className="border p-2">150</td></tr>
                  <tr><td className="border p-2 font-medium">Pesticide</td><td className="border p-2">Pesticide kg/ha (optional)</td><td className="border p-2">2.5</td></tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
