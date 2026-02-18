import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Leaf,
  FlaskConical,
  Clock,
  Scale,
  Info,
  MapPin,
  Droplets,
} from "lucide-react";
import { CropInfo, fertilizers, nutrientExplanations, crops } from "@/data/cropData";
import { ScoredCrop } from "@/lib/recommendationEngine";
import { cn } from "@/lib/utils";

interface FertilizerGuideProps {
  selectedCrop?: ScoredCrop | CropInfo;
  isBeginnerMode?: boolean;
  soilType?: string;
  region?: string;
}

// Regional fertilizer adjustments based on soil deficiencies
const regionalFertilizerData: Record<string, {
  nitrogenAdjust: number;
  phosphorusAdjust: number;
  potassiumAdjust: number;
  recommendations: string[];
}> = {
  "North India": {
    nitrogenAdjust: 0,
    phosphorusAdjust: 10,
    potassiumAdjust: 0,
    recommendations: ["Add zinc sulfate for wheat", "Use gypsum for sodic soils in Punjab/Haryana"],
  },
  "South India": {
    nitrogenAdjust: 10,
    phosphorusAdjust: 0,
    potassiumAdjust: 15,
    recommendations: ["Red soils need more nitrogen", "Add lime to reduce acidity in Kerala/Karnataka"],
  },
  "East India": {
    nitrogenAdjust: 15,
    phosphorusAdjust: 15,
    potassiumAdjust: 10,
    recommendations: ["Acidic soils need liming", "Apply boron for oilseeds in West Bengal"],
  },
  "West India": {
    nitrogenAdjust: 0,
    phosphorusAdjust: 20,
    potassiumAdjust: 5,
    recommendations: ["Black soils retain potassium well", "Apply micronutrients for cotton in Gujarat"],
  },
  "Central India": {
    nitrogenAdjust: 5,
    phosphorusAdjust: 15,
    potassiumAdjust: 0,
    recommendations: ["Soybean benefits from Rhizobium inoculation", "Add sulfur for oilseeds"],
  },
  "Northeast India": {
    nitrogenAdjust: 20,
    phosphorusAdjust: 25,
    potassiumAdjust: 15,
    recommendations: ["High rainfall leaches nutrients - split applications", "Add lime to acidic soils"],
  },
};

// Soil-specific fertilizer recommendations
const soilFertilizerData: Record<string, {
  organic: string[];
  adjustments: string;
  micronutrients: string[];
}> = {
  "Black": {
    organic: ["Green manure", "FYM before sowing", "Vermicompost"],
    adjustments: "Black soil retains moisture and potassium. Reduce potash by 20%. Focus on phosphorus.",
    micronutrients: ["Zinc", "Iron", "Manganese"],
  },
  "Red": {
    organic: ["Compost", "Cow dung", "Crop residues"],
    adjustments: "Red soil is low in nitrogen and phosphorus. Increase both by 15-20%.",
    micronutrients: ["Nitrogen", "Phosphorus", "Calcium"],
  },
  "Sandy": {
    organic: ["Well-decomposed FYM", "Green manure", "Bio-fertilizers"],
    adjustments: "Sandy soil doesn't retain nutrients. Use split doses and organic matter.",
    micronutrients: ["All major nutrients", "Magnesium", "Sulfur"],
  },
  "Loamy": {
    organic: ["Balanced organic matter", "Vermicompost", "Compost"],
    adjustments: "Loamy soil is ideal. Follow standard recommendations.",
    micronutrients: ["Based on crop requirement"],
  },
  "Clay": {
    organic: ["Gypsum for drainage", "FYM", "Green manure"],
    adjustments: "Clay soil holds nutrients but has drainage issues. Add gypsum.",
    micronutrients: ["Sulfur", "Boron"],
  },
  "Laterite": {
    organic: ["Lime", "Compost", "Green leaf manure"],
    adjustments: "Laterite soil is acidic and low in nutrients. Add lime and extra NPK.",
    micronutrients: ["Calcium", "Magnesium", "Phosphorus"],
  },
  "Alluvial": {
    organic: ["FYM", "Compost", "Green manure"],
    adjustments: "Alluvial soil is generally fertile. Standard doses work well.",
    micronutrients: ["Zinc", "Boron for specific crops"],
  },
};

export function FertilizerGuide({
  selectedCrop,
  isBeginnerMode = true,
  soilType = "Loamy",
  region = "North India",
}: FertilizerGuideProps) {
  const [activeTab, setActiveTab] = useState<"organic" | "chemical">("organic");

  const organicFertilizers = fertilizers.filter((f) => f.type === "organic");
  const chemicalFertilizers = fertilizers.filter((f) => f.type === "chemical");

  const regionalData = regionalFertilizerData[region] || regionalFertilizerData["North India"];
  const soilData = soilFertilizerData[soilType] || soilFertilizerData["Loamy"];

  return (
    <div className="space-y-6">
      {/* Regional & Soil-specific Recommendations */}
      <Card className="border-green-500/30 bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/30 dark:to-emerald-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-green-600" />
            Location-Based Fertilizer Advice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-card p-4 border border-border">
              <p className="font-medium text-foreground flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-primary" />
                {region} Recommendations
              </p>
              <ul className="space-y-1">
                {regionalData.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-3 w-3 text-green-600 mt-1 shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex gap-2 flex-wrap">
                {regionalData.nitrogenAdjust !== 0 && (
                  <Badge variant="outline" className="text-xs">
                    N: {regionalData.nitrogenAdjust > 0 ? "+" : ""}{regionalData.nitrogenAdjust}%
                  </Badge>
                )}
                {regionalData.phosphorusAdjust !== 0 && (
                  <Badge variant="outline" className="text-xs">
                    P: {regionalData.phosphorusAdjust > 0 ? "+" : ""}{regionalData.phosphorusAdjust}%
                  </Badge>
                )}
                {regionalData.potassiumAdjust !== 0 && (
                  <Badge variant="outline" className="text-xs">
                    K: {regionalData.potassiumAdjust > 0 ? "+" : ""}{regionalData.potassiumAdjust}%
                  </Badge>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-card p-4 border border-border">
              <p className="font-medium text-foreground flex items-center gap-2 mb-2">
                <Droplets className="h-4 w-4 text-amber-600" />
                {soilType} Soil Needs
              </p>
              <p className="text-sm text-muted-foreground mb-2">{soilData.adjustments}</p>
              <div className="flex flex-wrap gap-1">
                {soilData.micronutrients.map((nutrient, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {nutrient}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <strong>Organic options:</strong> {soilData.organic.join(", ")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NPK Explanation for Beginners */}
      {isBeginnerMode && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <HelpCircle className="h-5 w-5 text-primary" />
              What is NPK? (Simple Explanation)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              NPK stands for <strong>Nitrogen (N)</strong>,{" "}
              <strong>Phosphorus (P)</strong>, and <strong>Potassium (K)</strong>.
              These are the three main nutrients that plants need to grow healthy.
              Think of them as vitamins for plants!
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(nutrientExplanations).map(([key, nutrient]) => (
                <div
                  key={key}
                  className="rounded-xl bg-card p-4 border border-border"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">{nutrient.icon}</span>
                    <div>
                      <p className="font-bold text-foreground">
                        {key.charAt(0).toUpperCase() + key.slice(1)} ({nutrient.symbol})
                      </p>
                    </div>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {nutrient.simpleExplanation}
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-3 w-3 text-destructive shrink-0" />
                      <span className="text-muted-foreground">
                        <strong>Too little:</strong> {nutrient.deficiencySign}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Info className="mt-0.5 h-3 w-3 text-amber-500 shrink-0" />
                      <span className="text-muted-foreground">
                        <strong>Too much:</strong> {nutrient.excessSign}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Crop-specific fertilizer if selected */}
      {selectedCrop && (
        <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Leaf className="h-6 w-6 text-green-600" />
              Fertilizer Guide for {selectedCrop.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 font-medium text-foreground flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-green-600" />
                  Organic Options
                </p>
                <ul className="space-y-1">
                  {["Farm Yard Manure (FYM)", "Vermicompost", "Green Manure", "Neem Cake"].map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-3 w-3 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 font-medium text-foreground flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-blue-600" />
                  Chemical Fertilizers (per acre)
                </p>
                <div className="space-y-2">
                  {[
                    { name: "Urea", quantity: "50-80 kg/acre", timing: "Split application" },
                    { name: "DAP", quantity: "40-60 kg/acre", timing: "At sowing/planting" },
                    { name: "MOP (Potash)", quantity: "25-40 kg/acre", timing: "At sowing" }
                  ].map((f, idx) => (
                    <div key={idx} className="rounded-lg bg-muted/50 p-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{f.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {f.quantity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {f.timing}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Adjusted recommendations based on region and soil */}
            <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Adjusted for {region} + {soilType} soil:</strong>
                {" "}Based on your location, consider adjusting NPK doses:
                {regionalData.nitrogenAdjust !== 0 && ` Nitrogen ${regionalData.nitrogenAdjust > 0 ? "+" : ""}${regionalData.nitrogenAdjust}%`}
                {regionalData.phosphorusAdjust !== 0 && ` Phosphorus ${regionalData.phosphorusAdjust > 0 ? "+" : ""}${regionalData.phosphorusAdjust}%`}
                {regionalData.potassiumAdjust !== 0 && ` Potassium ${regionalData.potassiumAdjust > 0 ? "+" : ""}${regionalData.potassiumAdjust}%`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fertilizer Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "organic" | "chemical")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="organic" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Organic (Natural)
          </TabsTrigger>
          <TabsTrigger value="chemical" className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            Chemical
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organic" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {organicFertilizers.map((fert) => (
              <FertilizerCard key={fert.name} fertilizer={fert} isBeginnerMode={isBeginnerMode} />
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-green-50 dark:bg-green-950/30 p-4 border border-green-200 dark:border-green-800">
            <p className="flex items-start gap-2 text-sm text-green-800 dark:text-green-300">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <strong>Tip:</strong> Organic fertilizers improve soil health over time. They are
                safe for the environment and make your soil better each year!
              </span>
            </p>
          </div>
        </TabsContent>

        <TabsContent value="chemical" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {chemicalFertilizers.map((fert) => (
              <FertilizerCard key={fert.name} fertilizer={fert} isBeginnerMode={isBeginnerMode} />
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-800">
            <p className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <strong>Warning:</strong> Use chemical fertilizers carefully. Too much can damage
                crops and pollute water. Always follow recommended quantities!
              </span>
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface FertilizerCardProps {
  fertilizer: (typeof fertilizers)[0];
  isBeginnerMode?: boolean;
}

function FertilizerCard({ fertilizer, isBeginnerMode }: FertilizerCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{fertilizer.icon}</span>
            <div>
              <CardTitle className="text-base">{fertilizer.name}</CardTitle>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs mt-1",
                  fertilizer.type === "organic"
                    ? "border-green-500 text-green-600"
                    : "border-blue-500 text-blue-600"
                )}
              >
                {fertilizer.nutrient}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{fertilizer.description}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
            <Scale className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Quantity per acre</p>
              <p className="text-sm font-medium">{fertilizer.applicationRate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">When to apply</p>
              <p className="text-sm font-medium">{fertilizer.timing}</p>
            </div>
          </div>
        </div>

        {isBeginnerMode && (
          <>
            <div>
              <p className="text-xs font-medium text-foreground mb-1">Benefits:</p>
              <ul className="space-y-1">
                {fertilizer.benefits.slice(0, 3).map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3 text-primary shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {fertilizer.warnings.length > 0 && (
              <div className="rounded-lg bg-destructive/10 p-2">
                <p className="text-xs font-medium text-destructive mb-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Warnings:
                </p>
                <ul className="space-y-1">
                  {fertilizer.warnings.map((warning, idx) => (
                    <li key={idx} className="text-xs text-destructive/80">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
