import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { importCropDataFromCSV, getImportStats } from "@/utils/importCropData";
import { Upload, Database, CheckCircle2, Loader2 } from "lucide-react";

interface ImportStats {
  total_records: number;
  unique_states: number;
  unique_crops: number;
}

export default function DataImport() {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [stats, setStats] = useState<ImportStats | null>(null);
  const [importComplete, setImportComplete] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    setIsImporting(true);
    setProgress(0);
    setImportComplete(false);

    try {
      const csvText = await file.text();
      
      const result = await importCropDataFromCSV(csvText, (prog, msg) => {
        setProgress(prog);
        setProgressMessage(msg);
      });

      if (result.success) {
        toast.success(`Successfully imported ${result.imported.toLocaleString()} records!`);
        setImportComplete(true);
        await fetchStats();
      } else {
        toast.error(result.error || "Import failed");
      }
    } catch (error) {
      toast.error("Failed to import data");
      console.error(error);
    } finally {
      setIsImporting(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getImportStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Crop Data Import</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Crop Yield Dataset
            </CardTitle>
            <CardDescription>
              Upload the comprehensive Indian crop yield CSV file to update the prediction database.
              This will replace all existing data with the new dataset.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isImporting}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload">
                <Button asChild disabled={isImporting}>
                  <span>
                    {isImporting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Select CSV File
                      </>
                    )}
                  </span>
                </Button>
              </label>
              
              <Button variant="outline" onClick={fetchStats} disabled={isImporting}>
                <Database className="mr-2 h-4 w-4" />
                Refresh Stats
              </Button>
            </div>

            {isImporting && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground">{progressMessage}</p>
              </div>
            )}

            {importComplete && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span>Import completed successfully!</span>
              </div>
            )}
          </CardContent>
        </Card>

        {stats && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Current Database Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary">
                    {stats.total_records?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Records</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary">
                    {stats.unique_states || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">States</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary">
                    {stats.unique_crops || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Crops</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Dataset Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              The CSV file should have the following columns:
            </p>
            <code className="block bg-muted p-3 rounded text-sm">
              state, district, year, season, crop, area, production, yield, annual_rainfall, fertilizer, pesticide
            </code>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
