import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Upload, Loader2, Leaf, Droplets, FlaskConical, AlertCircle, CheckCircle2, X, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface SoilAnalysisResult {
  soilType: string;
  quality: "excellent" | "good" | "moderate" | "poor";
  phLevel: number;
  healthScore: number;
  moisture: string;
  organicMatter: string;
  recommendations: string[];
  suitableCrops: string[];
}

interface SoilAnalysisProps {
  onAnalysisComplete?: (result: SoilAnalysisResult) => void;
}

export function SoilAnalysis({ onAnalysisComplete }: SoilAnalysisProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SoilAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notify parent when analysis is complete
  useEffect(() => {
    if (result && onAnalysisComplete) {
      onAnalysisComplete(result);
    }
  }, [result, onAnalysisComplete]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-soil", {
        body: { image },
      });

      if (error) throw error;

      setResult(data.analysis);
      toast({
        title: "Analysis Complete",
        description: "AI has analyzed your soil sample successfully.",
      });
    } catch (error) {
      console.error("Soil analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent": return "text-green-600 bg-green-100";
      case "good": return "text-primary bg-primary/10";
      case "moderate": return "text-yellow-600 bg-yellow-100";
      case "poor": return "text-red-600 bg-red-100";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getPhColor = (ph: number) => {
    if (ph >= 6 && ph <= 7.5) return "text-green-600";
    if (ph >= 5.5 && ph < 6) return "text-yellow-600";
    if (ph > 7.5 && ph <= 8) return "text-yellow-600";
    return "text-red-600";
  };

  const clearImage = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="p-4 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <FlaskConical className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Soil Analysis</h3>
          <p className="text-xs text-muted-foreground">Upload soil image for health & pH analysis</p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {!image ? (
        <div 
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex gap-2 mb-2">
            <Camera className="h-5 w-5 text-muted-foreground" />
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Click to upload soil photo
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <img 
              src={image} 
              alt="Soil sample" 
              className="w-full h-24 object-cover rounded-lg"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={clearImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          {!result && (
            <Button
              size="sm"
              className="w-full"
              onClick={analyzeImage}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FlaskConical className="h-3 w-3" />
                  Analyze Soil
                </>
              )}
            </Button>
          )}

          {result && (
            <div className="space-y-2 text-xs">
              {/* Soil Type & Quality */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">{result.soilType}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Quality:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getQualityColor(result.quality)}`}>
                  {result.quality}
                </span>
              </div>

              {/* pH Level */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <FlaskConical className="h-3 w-3" />
                  pH Level:
                </span>
                <span className={`font-bold ${getPhColor(result.phLevel)}`}>
                  {result.phLevel.toFixed(1)}
                </span>
              </div>

              {/* Health Score */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Leaf className="h-3 w-3" />
                  Health:
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${result.healthScore}%` }}
                    />
                  </div>
                  <span className="font-medium">{result.healthScore}%</span>
                </div>
              </div>

              {/* Moisture */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Droplets className="h-3 w-3" />
                  Moisture:
                </span>
                <span className="font-medium">{result.moisture}</span>
              </div>

              {/* Suitable Crops */}
              <div className="pt-2 border-t border-border">
                <p className="text-muted-foreground mb-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  Suitable crops:
                </p>
                <div className="flex flex-wrap gap-1">
                  {result.suitableCrops.slice(0, 4).map((crop, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px]">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <p className="text-muted-foreground mb-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-accent" />
                    Recommendation:
                  </p>
                  <p className="text-foreground">{result.recommendations[0]}</p>
                </div>
              )}

              {/* Auto-Apply Button */}
              <div className="pt-2 border-t border-border space-y-2">
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={() => onAnalysisComplete?.(result)}
                >
                  <ArrowRight className="h-3 w-3 mr-1" />
                  Apply to Crop Form
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={clearImage}
                >
                  Analyze Another Sample
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
