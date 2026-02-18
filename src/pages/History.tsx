import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Search,
  Download,
  Trash2,
  TrendingUp,
  TrendingDown,
  Filter,
  Loader2,
  Eye,
  Satellite,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ConfidenceBreakdownBar } from "@/components/ConfidenceBreakdownBar";
import { crops } from "@/data/cropData";

interface ModelAccuracy {
  r2_score?: number;
  mae?: number;
  rmse?: number;
  confidenceBreakdown?: {
    baseConfidence: number;
    ndviBonus: number;
    soilMoistureBonus: number;
    irrigationBonus: number;
    agronomicPenalty: number;
    estimationPenalty: number;
    finalConfidence: number;
  };
  profitClassification?: {
    profit: number;
    revenue: number;
    costPerHectare: number;
    profitCategory: string;
    profitLevel: string;
  };
}

interface Prediction {
  id: string;
  created_at: string;
  crop: string;
  region: string;
  soil_type: string;
  predicted_yield: number;
  confidence: number;
  rainfall: number;
  temperature: number;
  humidity: number;
  season: string;
  model_accuracy: ModelAccuracy | null;
}

// Helper to parse yield range string "4,000-6,000 kg/ha" -> { min: 4000, max: 6000 }
const parseYieldRange = (rangeStr?: string) => {
  if (!rangeStr) return null;
  try {
    const cleanStr = rangeStr.replace(/,/g, '').replace(' kg/ha', '');
    const [minStr, maxStr] = cleanStr.split('-');
    const min = parseInt(minStr);
    const max = parseInt(maxStr);
    if (!isNaN(min) && !isNaN(max)) {
      return { min, max };
    }
  } catch (e) {
    console.warn("Failed to parse yield range:", rangeStr);
  }
  return null;
};

// Enhanced status badge based on CROP-SPECIFIC YIELD BENCHMARKS
const getStatusBadge = (prediction: Prediction) => {
  const profitLevel = prediction.model_accuracy?.profitClassification?.profitLevel;
  const yieldKg = prediction.predicted_yield;

  // 1. Priority: Use profit classification if available (most accurate financial metric)
  if (profitLevel) {
    switch (profitLevel) {
      case "exultant":
      case "highly_profitable":
        return (
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20">
            <TrendingUp className="mr-1 h-3 w-3" />
            High Yield
          </Badge>
        );
      case "good":
        return (
          <Badge className="bg-green-500/15 text-green-600 hover:bg-green-500/25 border-green-500/20">
            <TrendingUp className="mr-1 h-3 w-3" />
            Good Yield
          </Badge>
        );
      case "mid":
      case "normal":
        return (
          <Badge className="bg-yellow-500/15 text-yellow-600 hover:bg-yellow-500/25 border-yellow-500/20">
            Medium
          </Badge>
        );
      case "bad":
        return (
          <Badge className="bg-orange-500/15 text-orange-600 hover:bg-orange-500/25 border-orange-500/20">
            <TrendingDown className="mr-1 h-3 w-3" />
            Low Yield
          </Badge>
        );
      case "loss":
        return (
          <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/25 border-destructive/20">
            <TrendingDown className="mr-1 h-3 w-3" />
            Loss Risk
          </Badge>
        );
    }
  }

  // 2. Fallback: Use crop-specific yield benchmarks from cropData
  // We try to find the crop in our static data to get its "standard" yield range
  const cropInfo = crops.find(c => c.name.toLowerCase() === prediction.crop.toLowerCase());
  const benchmarks = parseYieldRange(cropInfo?.yieldRange);

  if (benchmarks) {
    // If we have specific benchmarks for this crop
    const { min, max } = benchmarks;

    if (yieldKg >= max) {
      return (
        <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20">
          <TrendingUp className="mr-1 h-3 w-3" />
          High Yield
        </Badge>
      );
    } else if (yieldKg >= (min + max) / 2) {
      return (
        <Badge className="bg-green-500/15 text-green-600 hover:bg-green-500/25 border-green-500/20">
          Good Yield
        </Badge>
      );
    } else if (yieldKg >= min) {
      return (
        <Badge className="bg-yellow-500/15 text-yellow-600 hover:bg-yellow-500/25 border-yellow-500/20">
          Avg Yield
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/25 border-destructive/20">
          <TrendingDown className="mr-1 h-3 w-3" />
          Below Avg
        </Badge>
      );
    }
  }

  // 3. Last Resort: Generic thresholds (if crop data missing)
  if (yieldKg >= 4000) {
    return (
      <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
        High Yield
      </Badge>
    );
  } else if (yieldKg >= 2500) {
    return (
      <Badge className="bg-green-500/15 text-green-600 hover:bg-green-500/25">
        Good Yield
      </Badge>
    );
  } else if (yieldKg >= 1500) {
    return (
      <Badge className="bg-yellow-500/15 text-yellow-600 hover:bg-yellow-500/25">
        Medium
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/25">
        Low Yield
      </Badge>
    );
  }
};

export default function History() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cropFilter, setCropFilter] = useState("all");

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("predictions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      // Parse model_accuracy from JSON if needed
      const parsed = (data || []).map(p => ({
        ...p,
        model_accuracy: typeof p.model_accuracy === 'string'
          ? JSON.parse(p.model_accuracy)
          : p.model_accuracy
      }));
      setPredictions(parsed);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      toast({
        title: "Error",
        description: "Failed to load prediction history.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("predictions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setPredictions(predictions.filter((p) => p.id !== id));
      toast({
        title: "Deleted",
        description: "Prediction removed from history.",
      });
    } catch (error) {
      console.error("Error deleting prediction:", error);
      toast({
        title: "Error",
        description: "Failed to delete prediction.",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = () => {
    if (predictions.length === 0) {
      toast({
        title: "No Data",
        description: "No predictions to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Date", "Crop", "Region", "Soil Type", "Predicted Yield (kg/ha)", "Accuracy (%)"];
    const rows = predictions.map((p) => [
      new Date(p.created_at).toLocaleDateString(),
      p.crop,
      p.region,
      p.soil_type,
      p.predicted_yield.toString(),
      p.confidence?.toFixed(1) || "N/A",
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `crop-predictions-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast({
      title: "Exported",
      description: "Predictions exported to CSV.",
    });
  };

  const filteredData = predictions.filter((item) => {
    const matchesSearch =
      item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = cropFilter === "all" || item.crop.toLowerCase() === cropFilter;
    return matchesSearch && matchesCrop;
  });

  const avgYield = predictions.length > 0
    ? Math.round(predictions.reduce((acc, item) => acc + item.predicted_yield, 0) / predictions.length)
    : 0;

  const avgConfidence = predictions.length > 0
    ? Math.round(predictions.reduce((acc, item) => acc + (item.confidence || 0), 0) / predictions.length)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Prediction History</h1>
              <p className="text-muted-foreground">View and manage your past predictions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by crop or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={cropFilter} onValueChange={setCropFilter}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                <SelectItem value="wheat">Wheat</SelectItem>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="corn">Corn</SelectItem>
                <SelectItem value="soybean">Soybean</SelectItem>
                <SelectItem value="potato">Potato</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Predictions</p>
            <p className="text-2xl font-bold text-foreground">{predictions.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground">Average Yield</p>
            <p className="text-2xl font-bold text-primary">
              {avgYield.toLocaleString()}{" "}
              <span className="text-sm font-normal text-muted-foreground">kg/ha</span>
            </p>
          </div>
          <div className="rounded-xl border border-border bg-accent/5 p-4">
            <p className="text-sm text-muted-foreground">Avg. Accuracy</p>
            <p className="text-2xl font-bold text-accent">{avgConfidence}%</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Soil Type</TableHead>
                    <TableHead className="text-right">Predicted Yield</TableHead>
                    <TableHead className="text-center">Accuracy</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item, index) => (
                    <TableRow
                      key={item.id}
                      className={cn(
                        "animate-fade-in transition-colors hover:bg-muted/50",
                        index % 2 === 0 ? "bg-background" : "bg-muted/20"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-medium">
                        {new Date(item.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 overflow-hidden rounded-full border border-border bg-muted/50">
                            {crops.find(c => c.name.toLowerCase() === item.crop.toLowerCase())?.image ? (
                              <img
                                src={crops.find(c => c.name.toLowerCase() === item.crop.toLowerCase())?.image}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs">
                                {crops.find(c => c.name.toLowerCase() === item.crop.toLowerCase())?.icon || "🌾"}
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-foreground capitalize">{item.crop}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground capitalize">{item.region.replace(/-/g, " ")}</TableCell>
                      <TableCell className="text-muted-foreground capitalize">{item.soil_type}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {item.predicted_yield.toLocaleString()} kg/ha
                      </TableCell>
                      <TableCell>
                        {/* Compact confidence breakdown bar */}
                        <div className="w-24">
                          {item.model_accuracy?.confidenceBreakdown ? (
                            <ConfidenceBreakdownBar
                              baseConfidence={item.model_accuracy.confidenceBreakdown.baseConfidence}
                              ndviBonus={item.model_accuracy.confidenceBreakdown.ndviBonus}
                              soilMoistureBonus={item.model_accuracy.confidenceBreakdown.soilMoistureBonus}
                              irrigationBonus={item.model_accuracy.confidenceBreakdown.irrigationBonus}
                              agronomicPenalty={item.model_accuracy.confidenceBreakdown.agronomicPenalty}
                              estimationPenalty={item.model_accuracy.confidenceBreakdown.estimationPenalty}
                              finalConfidence={item.confidence}
                              compact
                            />
                          ) : (

                            <span
                              className={cn(
                                "font-medium",
                                !item.confidence ? "text-muted-foreground" :
                                  item.confidence >= 85
                                    ? "text-primary"
                                    : item.confidence >= 70
                                      ? "text-yellow-600"
                                      : "text-destructive"
                              )}
                            >
                              {item.confidence ? `${item.confidence.toFixed(1)}%` : "N/A"}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(item)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Details Dialog */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4 text-muted-foreground hover:text-primary" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 capitalize">
                                  <Satellite className="h-5 w-5 text-primary" />
                                  {item.crop} Prediction Details
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                {/* Yield & Confidence */}
                                <div className="rounded-lg bg-primary/5 p-4">
                                  <p className="text-sm text-muted-foreground mb-1">Predicted Yield</p>
                                  <p className="text-2xl font-bold text-primary">
                                    {item.predicted_yield.toLocaleString()} kg/ha
                                  </p>
                                </div>

                                {/* Confidence Breakdown */}
                                {item.model_accuracy?.confidenceBreakdown && (
                                  <div className="rounded-lg border border-border p-4">
                                    <ConfidenceBreakdownBar
                                      baseConfidence={item.model_accuracy.confidenceBreakdown.baseConfidence}
                                      ndviBonus={item.model_accuracy.confidenceBreakdown.ndviBonus}
                                      soilMoistureBonus={item.model_accuracy.confidenceBreakdown.soilMoistureBonus}
                                      irrigationBonus={item.model_accuracy.confidenceBreakdown.irrigationBonus}
                                      agronomicPenalty={item.model_accuracy.confidenceBreakdown.agronomicPenalty}
                                      estimationPenalty={item.model_accuracy.confidenceBreakdown.estimationPenalty}
                                      finalConfidence={item.confidence}
                                    />
                                  </div>
                                )}

                                {/* Profit Classification */}
                                {item.model_accuracy?.profitClassification && (
                                  <div className="rounded-lg bg-accent/5 p-4 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="h-4 w-4 text-accent" />
                                      <span className="font-medium">Profit: {item.model_accuracy.profitClassification.profitCategory}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                      <div>
                                        <p className="text-xs text-muted-foreground">Revenue</p>
                                        <p className="font-medium">₹{item.model_accuracy.profitClassification.revenue?.toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">Cost</p>
                                        <p className="font-medium">₹{item.model_accuracy.profitClassification.costPerHectare?.toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">Profit</p>
                                        <p className={cn("font-bold", (item.model_accuracy.profitClassification.profit || 0) >= 0 ? "text-primary" : "text-destructive")}>
                                          ₹{item.model_accuracy.profitClassification.profit?.toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Basic Info */}
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Region</p>
                                    <p className="font-medium capitalize">{item.region.replace(/-/g, " ")}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Season</p>
                                    <p className="font-medium capitalize">{item.season || "—"}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Soil Type</p>
                                    <p className="font-medium capitalize">{item.soil_type}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Rainfall</p>
                                    <p className="font-medium">{item.rainfall}mm</p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredData.length === 0 && !isLoading && (
              <div className="mt-8 text-center text-muted-foreground">
                {predictions.length === 0
                  ? "No predictions yet. Make your first prediction!"
                  : "No predictions found matching your criteria."}
              </div>
            )}
          </>
        )}
      </div>
    </div >
  );
}
