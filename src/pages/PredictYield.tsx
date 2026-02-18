import { useState, useCallback } from "react";
import { CropForm } from "@/components/CropForm";
import { EnhancedResultCard } from "@/components/EnhancedResultCard";
import { SatelliteDataCard } from "@/components/SatelliteDataCard";
import { SoilAnalysis, SoilAnalysisResult } from "@/components/SoilAnalysis";
import { Button } from "@/components/ui/button";
import { Sprout, Lightbulb, ArrowLeft, History, Brain, Target, TrendingUp, Satellite, AlertTriangle, Droplets } from "lucide-react"; import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import type { SatelliteData } from "@/hooks/useSatelliteData";
import { toast } from "@/hooks/use-toast";

interface ProfitClassification {
  profit: number;
  revenue: number;
  costPerHectare: number;
  profitCategory: string;
  profitLevel: "exultant" | "highly_profitable" | "good" | "mid" | "normal" | "bad" | "loss";
}

interface RootZoneMoisture {
  moisture: number;
  level: "very_low" | "low" | "moderate" | "high";
  isEstimated: boolean;
}

interface PredictionResult {
  yield: number;
  crop: string;
  confidence: number;
  confidenceBreakdown?: {
    baseConfidence: number;
    ndviBonus: number;
    soilMoistureBonus: number;
    irrigationBonus: number;
    agronomicPenalty: number;
    estimationPenalty: number;
    finalConfidence: number;
    reliabilityStatus: "High" | "Medium" | "Low";
  };
  reliabilityStatus?: "High" | "Medium" | "Low";
  temperature?: number;
  rainfall?: number;
  irrigationType?: string;
  effectiveWater?: number;
  seasonalRainfall?: number;
  irrigationContribution?: number;
  waterSource?: string;
  isWaterEstimated?: boolean;
  rootZoneMoisture?: RootZoneMoisture;
  yieldAdjustmentReason?: string;
  model_accuracy?: {
    r2_score: number;
    mae: number;
    rmse: number;
  };
  satelliteData?: SatelliteData | null;
  warnings?: string[];
  recommendations?: string[];
  profitClassification?: ProfitClassification;
}

export default function PredictYield() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(null);
  const [soilAnalysis, setSoilAnalysis] = useState<SoilAnalysisResult | null>(null);

  const handlePredict = (formData: any) => {
    setResult({
      yield: formData.yield,
      crop: formData.crop,
      confidence: formData.confidence,
      confidenceBreakdown: formData.confidenceBreakdown,
      reliabilityStatus: formData.reliabilityStatus,
      temperature: formData.temperature ? parseInt(formData.temperature) : 28,
      rainfall: formData.rainfall ? parseInt(formData.rainfall) : 0,
      irrigationType: formData.irrigationType,
      effectiveWater: formData.effectiveWater,
      seasonalRainfall: formData.seasonalRainfall,
      irrigationContribution: formData.irrigationContribution,
      waterSource: formData.waterSource,
      isWaterEstimated: formData.isWaterEstimated,
      rootZoneMoisture: formData.rootZoneMoisture,
      yieldAdjustmentReason: formData.yieldAdjustmentReason,
      model_accuracy: formData.model_accuracy,
      satelliteData: formData.satelliteData || satelliteData,
      warnings: formData.warnings || [],
      recommendations: formData.recommendations || [],
      profitClassification: formData.profitClassification,
    });
  };

  const handleSatelliteData = (data: SatelliteData | null) => {
    setSatelliteData(data);
  };

  const handleSoilAnalysis = useCallback((result: SoilAnalysisResult) => {
    setSoilAnalysis(result);
    toast({
      title: "Soil Analysis Ready",
      description: `Detected ${result.soilType} soil with ${result.moisture} moisture. Recommended crops: ${result.suitableCrops.slice(0, 3).join(", ")}`,
    });
  }, []);

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
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Predict Crop Yield</h1>
              <p className="text-muted-foreground">Satellite-enhanced agricultural decision support</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Satellite className="h-4 w-4" />
              NDVI Integrated
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form Section */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                  <Sprout className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Crop Details</h2>
                  <p className="text-sm text-muted-foreground">
                    Fill in the information below for satellite-enhanced prediction
                  </p>
                </div>
              </div>

              <CropForm
                onPredict={handlePredict}
                onSatelliteData={handleSatelliteData}
                soilAnalysisData={soilAnalysis}
              />
            </div>

            {/* Satellite Data Preview (shown when loaded but before prediction) */}
            {satelliteData && !result && (
              <div className="mt-6">
                <SatelliteDataCard data={satelliteData} />
              </div>
            )}

            {/* AI Soil Analysis - Compact Section */}
            <div className="mt-6">
              <SoilAnalysis onAnalysisComplete={handleSoilAnalysis} />
              {soilAnalysis && (
                <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-primary font-medium">✓ Soil Analysis Applied:</span>
                    <span className="text-muted-foreground">
                      {soilAnalysis.soilType} • {soilAnalysis.moisture} moisture • pH {soilAnalysis.phLevel}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Suitable crops: {soilAnalysis.suitableCrops.slice(0, 4).join(", ")}
                  </p>
                </div>
              )}
            </div>

            {/* Tips Section */}
            <div className="mt-4 rounded-2xl border border-border bg-secondary/30 p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                  <Lightbulb className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Satellite-Enhanced Predictions</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>• Click "Auto-fill Weather" for 4-month seasonal rainfall data</li>
                    <li>• Click "Satellite NDVI" to fetch real-time vegetation health data</li>
                    <li>• Upload soil image for AI-powered soil type & moisture analysis</li>
                    <li>• NDVI &gt; 0.5 indicates healthy crops, &lt; 0.3 suggests stress</li>
                    <li>• Confidence increases when satellite + soil data are available</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Irrigation Guide - Full Width Display */}
            <div className="mt-8 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                  <Droplets className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Irrigation Methods Reference</h3>
              </div>
              <div className="overflow-hidden rounded-xl border border-border">
                <img
                  src="/images/irrigation-methods.jpg"
                  alt="Irrigation Methods Guide"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-700 dark:text-amber-400">Important Notice</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    This system supports agricultural planning using satellite-derived insights.
                    Predictions do not guarantee accuracy and should not replace professional
                    agronomic advice or farmer expertise.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-2">
            {result ? (
              <div className="space-y-6 animate-slide-up">
                <EnhancedResultCard
                  predictedYield={result.yield}
                  crop={result.crop}
                  confidence={result.confidence}
                  confidenceBreakdown={result.confidenceBreakdown}
                  reliabilityStatus={result.reliabilityStatus}
                  satelliteData={result.satelliteData}
                  additionalInfo={{
                    temperature: result.temperature,
                    rainfall: result.rainfall,
                    irrigationType: result.irrigationType,
                    effectiveWater: result.effectiveWater,
                    seasonalRainfall: result.seasonalRainfall,
                    irrigationContribution: result.irrigationContribution,
                    waterSource: result.waterSource,
                    isWaterEstimated: result.isWaterEstimated,
                    rootZoneMoisture: result.rootZoneMoisture,
                    optimalRange: "3.5k-6.5k",
                  }}
                  warnings={result.warnings}
                  recommendations={result.recommendations}
                  yieldAdjustmentReason={result.yieldAdjustmentReason}
                  profitClassification={result.profitClassification}
                />

                {/* Model Accuracy Card */}
                {result.model_accuracy && (
                  <div className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-foreground">ML Model Accuracy</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 rounded-lg bg-primary/5">
                        <Target className="h-4 w-4 text-primary mx-auto mb-1" />
                        <p className="text-lg font-bold text-primary">
                          {(result.model_accuracy.r2_score * 100).toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">R² Score</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-accent/5">
                        <TrendingUp className="h-4 w-4 text-accent mx-auto mb-1" />
                        <p className="text-lg font-bold text-accent">
                          {result.model_accuracy.mae.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">MAE</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-secondary">
                        <TrendingUp className="h-4 w-4 text-foreground mx-auto mb-1" />
                        <p className="text-lg font-bold text-foreground">
                          {result.model_accuracy.rmse.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">RMSE</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Satellite Data Card (detailed view) */}
                {result.satelliteData && (
                  <SatelliteDataCard data={result.satelliteData} />
                )}

                <div className="rounded-xl border border-border bg-card p-4">
                  <h4 className="mb-3 font-medium text-foreground">Recommendations</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {result.satelliteData?.soilMoisture.level === "low" && (
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive" />
                        <span className="text-destructive">Urgent: Increase irrigation - low soil moisture detected</span>
                      </li>
                    )}
                    {result.satelliteData?.ndvi.status === "poor" && (
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                        <span className="text-amber-600 dark:text-amber-400">Check for pest/disease - NDVI indicates crop stress</span>
                      </li>
                    )}
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      Apply NPK fertilizer based on soil test results
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      Monitor weather forecasts for irrigation planning
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      Re-check satellite data weekly during critical growth stages
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Link to="/history" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <History className="h-4 w-4" />
                      View History
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setResult(null);
                      setSatelliteData(null);
                    }}
                  >
                    New Prediction
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <Satellite className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">Satellite-Enhanced Prediction</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Fill in the form and click "Satellite NDVI" for enhanced accuracy,
                  then "Predict Crop Yield" to see results
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>✓ NDVI vegetation health index</p>
                  <p>✓ Soil moisture monitoring</p>
                  <p>✓ Data reliability scoring</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
