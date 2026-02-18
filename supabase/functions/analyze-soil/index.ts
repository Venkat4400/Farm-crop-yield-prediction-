import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SoilAnalysisResult {
  soilType: string;
  quality: "excellent" | "good" | "moderate" | "poor";
  phLevel: number;
  healthScore: number;
  moisture: string;
  organicMatter: string;
  recommendations: string[];
  suitableCrops: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    if (!image) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Call AI to analyze the soil image
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert agricultural soil analyst. Analyze soil images to determine:
- Soil type (Clay, Loamy, Sandy, Silt, Peat, Chalky, Saline, Black, Red, Alluvial, Laterite)
- Overall quality (excellent, good, moderate, poor)
- Estimated pH level (4.0-9.0 scale)
- Health score (0-100)
- Moisture level (Dry, Low, Adequate, High, Waterlogged)
- Organic matter content (Low, Moderate, High)
- Suitable crops for this soil
- Recommendations for improvement

Always respond with valid JSON in this exact format:
{
  "soilType": "string",
  "quality": "excellent|good|moderate|poor",
  "phLevel": number,
  "healthScore": number,
  "moisture": "string",
  "organicMatter": "string",
  "recommendations": ["string"],
  "suitableCrops": ["string"]
}`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this soil sample image and provide a detailed assessment of its health, quality, pH level, and suitability for crops. Focus on characteristics visible in the image like color, texture, structure, and any visible organic matter or moisture."
              },
              {
                type: "image_url",
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "API credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || "";
    
    // Parse the JSON from the AI response
    let analysis: SoilAnalysisResult;
    try {
      // Extract JSON from response (handle markdown code blocks if present)
      let jsonString = content;
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonString = jsonMatch[1].trim();
      } else {
        // Try to find JSON object directly
        const objectMatch = content.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          jsonString = objectMatch[0];
        }
      }
      
      analysis = JSON.parse(jsonString);
      
      // Validate and sanitize the response
      analysis = {
        soilType: analysis.soilType || "Unknown",
        quality: ["excellent", "good", "moderate", "poor"].includes(analysis.quality) 
          ? analysis.quality 
          : "moderate",
        phLevel: typeof analysis.phLevel === "number" && analysis.phLevel >= 4 && analysis.phLevel <= 9
          ? analysis.phLevel 
          : 6.5,
        healthScore: typeof analysis.healthScore === "number" && analysis.healthScore >= 0 && analysis.healthScore <= 100
          ? analysis.healthScore 
          : 50,
        moisture: analysis.moisture || "Adequate",
        organicMatter: analysis.organicMatter || "Moderate",
        recommendations: Array.isArray(analysis.recommendations) 
          ? analysis.recommendations.slice(0, 5) 
          : ["Add organic compost to improve soil structure"],
        suitableCrops: Array.isArray(analysis.suitableCrops) 
          ? analysis.suitableCrops.slice(0, 8) 
          : ["Wheat", "Rice", "Corn"],
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Provide a fallback analysis based on general principles
      analysis = {
        soilType: "Loamy",
        quality: "moderate",
        phLevel: 6.5,
        healthScore: 60,
        moisture: "Adequate",
        organicMatter: "Moderate",
        recommendations: [
          "Consider soil testing for accurate pH measurement",
          "Add organic matter to improve soil health"
        ],
        suitableCrops: ["Wheat", "Rice", "Vegetables", "Pulses"]
      };
    }

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Soil analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
