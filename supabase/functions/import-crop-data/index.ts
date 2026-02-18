import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// CSV data will be embedded and imported in batches
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    const { action, data, offset, batchSize } = body;

    if (action === "clear") {
      // Clear existing data
      const { error } = await supabase
        .from("crop_yield_data")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) {
        console.error("Error clearing data:", error);
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Data cleared" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "import" && data) {
      // Import batch of records
      const records = data.map((row: any) => ({
        state: row.state || null,
        district: row.district || null,
        year: row.year ? parseInt(row.year) : null,
        season: mapSeason(row.season),
        crop: row.crop?.toLowerCase() || null,
        area_hectares: parseFloat(row.area) || null,
        production: parseFloat(row.production) || null,
        yield: convertYieldToKgPerHa(parseFloat(row.yield) || 0),
        rainfall: parseFloat(row.annual_rainfall) || null,
        annual_rainfall: parseFloat(row.annual_rainfall) || null,
        fertilizer_used: row.fertilizer ? String(row.fertilizer) : null,
        pesticide: parseFloat(row.pesticide) || null,
        // Set nullable fields
        temperature: null,
        humidity: null,
        soil_type: null,
        region: mapStateToRegion(row.state),
        irrigation_type: null,
      }));

      const { error } = await supabase
        .from("crop_yield_data")
        .insert(records);

      if (error) {
        console.error("Error inserting batch:", error);
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, imported: records.length }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "stats") {
      const { data: count, error } = await supabase
        .from("crop_yield_data")
        .select("id", { count: "exact", head: true });

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get unique states, districts, crops count
      const { data: statesData } = await supabase
        .from("crop_yield_data")
        .select("state")
        .not("state", "is", null);

      const { data: cropsData } = await supabase
        .from("crop_yield_data")
        .select("crop")
        .not("crop", "is", null);

      const uniqueStates = new Set(statesData?.map((r: any) => r.state)).size;
      const uniqueCrops = new Set(cropsData?.map((r: any) => r.crop)).size;

      return new Response(
        JSON.stringify({ 
          success: true, 
          total_records: count,
          unique_states: uniqueStates,
          unique_crops: uniqueCrops,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Import error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Map season names to standardized format
function mapSeason(season: string): string {
  const seasonLower = season?.toLowerCase() || "";
  if (seasonLower === "kharif") return "kharif";
  if (seasonLower === "rabi") return "rabi";
  if (seasonLower === "summer" || seasonLower === "zaid") return "zaid";
  if (seasonLower === "winter") return "rabi";
  if (seasonLower === "autumn") return "kharif";
  if (seasonLower === "whole year") return "kharif"; // Default to kharif
  return seasonLower;
}

// Convert yield from tons/hectare to kg/hectare
function convertYieldToKgPerHa(yieldTonsPerHa: number): number {
  // The dataset yield is already in tons/hectare, convert to kg/ha
  // Note: Some values are already quite high, indicating they might be in different units
  // We'll cap extremely high values
  const kgPerHa = yieldTonsPerHa * 1000;
  return Math.min(kgPerHa, 100000); // Cap at 100 tons/ha
}

// Map state to region
function mapStateToRegion(state: string): string {
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
  
  return "central-india"; // Default
}
