import { supabase } from "@/integrations/supabase/client";

interface CropDataRow {
  state: string;
  district: string;
  year: string;
  season: string;
  crop: string;
  area: string;
  production: string;
  yield: string;
  annual_rainfall: string;
  fertilizer: string;
  pesticide: string;
}

// Parse CSV text into array of objects
function parseCSV(csvText: string): CropDataRow[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  const data: CropDataRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length >= headers.length) {
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || '';
      });
      data.push(row as CropDataRow);
    }
  }
  
  return data;
}

// Import data in batches
export async function importCropDataFromCSV(
  csvText: string,
  onProgress?: (progress: number, message: string) => void
): Promise<{ success: boolean; imported: number; error?: string }> {
  try {
    const data = parseCSV(csvText);
    const totalRecords = data.length;
    const batchSize = 500;
    let imported = 0;
    
    onProgress?.(0, `Parsed ${totalRecords.toLocaleString()} records. Starting import...`);
    
    // Clear existing data
    onProgress?.(1, "Clearing existing data...");
    const { error: clearError } = await supabase.functions.invoke("import-crop-data", {
      body: { action: "clear" }
    });
    
    if (clearError) {
      return { success: false, imported: 0, error: clearError.message };
    }
    
    // Import in batches
    for (let i = 0; i < totalRecords; i += batchSize) {
      const batch = data.slice(i, Math.min(i + batchSize, totalRecords));
      const progress = Math.round((i / totalRecords) * 100);
      
      onProgress?.(progress, `Importing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(totalRecords / batchSize)}...`);
      
      const { error: importError } = await supabase.functions.invoke("import-crop-data", {
        body: { action: "import", data: batch }
      });
      
      if (importError) {
        console.error("Batch import error:", importError);
        // Continue with next batch
      } else {
        imported += batch.length;
      }
    }
    
    onProgress?.(100, `Import complete! ${imported.toLocaleString()} records imported.`);
    
    return { success: true, imported };
  } catch (error) {
    return { 
      success: false, 
      imported: 0, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

// Get import stats
export async function getImportStats(): Promise<{
  total_records: number;
  unique_states: number;
  unique_crops: number;
}> {
  const { data, error } = await supabase.functions.invoke("import-crop-data", {
    body: { action: "stats" }
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}
