import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { region, soilType, season, temperature, humidity, rainfall, currentCrop } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }
    
    console.log(`Generating recommendations for: ${region}, ${soilType}, ${season}`);
    
    const systemPrompt = `You are an expert agricultural advisor for Indian farmers. Provide specific, actionable recommendations based on the given conditions. Focus on practical advice that farmers can implement.

Your response must be valid JSON with this exact structure:
{
  "cropRecommendations": [
    {
      "name": "Crop Name",
      "confidence": 85,
      "expectedYield": "4,500-5,000 kg/ha",
      "season": "Rabi",
      "reason": "Brief explanation",
      "icon": "emoji"
    }
  ],
  "fertilizerRecommendations": [
    {
      "nutrient": "Nitrogen (N)",
      "current": 45,
      "recommended": 60,
      "status": "low|optimal|high",
      "tip": "Specific application advice"
    }
  ],
  "actionItems": [
    "Specific action 1",
    "Specific action 2"
  ]
}`;

    const userPrompt = `Generate agricultural recommendations for:
- Region: ${region || "North India"}
- Soil Type: ${soilType || "Loamy"}
- Season: ${season || "Rabi"}
- Temperature: ${temperature || 28}°C
- Humidity: ${humidity || 65}%
- Rainfall: ${rainfall || 100}mm
${currentCrop ? `- Currently growing: ${currentCrop}` : ""}

Provide 4 crop recommendations sorted by confidence, 3 NPK fertilizer recommendations, and 3-5 immediate action items.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Rate limit exceeded. Please try again later." 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "AI credits exhausted. Please add credits to continue." 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI request failed: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from AI");
    }
    
    // Parse JSON from response (handle markdown code blocks)
    let recommendations;
    try {
      // Remove markdown code blocks if present
      const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      recommendations = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Return fallback recommendations
      recommendations = {
        cropRecommendations: [
          { name: "Wheat", confidence: 90, expectedYield: "4,800-5,200 kg/ha", season: "Rabi", reason: "Optimal soil conditions", icon: "🌾" },
          { name: "Rice", confidence: 85, expectedYield: "5,000-5,500 kg/ha", season: "Kharif", reason: "Good water availability", icon: "🍚" },
          { name: "Potato", confidence: 82, expectedYield: "5,500-6,000 kg/ha", season: "Rabi", reason: "Suitable temperature range", icon: "🥔" },
          { name: "Corn", confidence: 78, expectedYield: "4,000-4,500 kg/ha", season: "Kharif", reason: "Moderate suitability", icon: "🌽" },
        ],
        fertilizerRecommendations: [
          { nutrient: "Nitrogen (N)", current: 45, recommended: 60, status: "low", tip: "Apply urea in split doses" },
          { nutrient: "Phosphorus (P)", current: 55, recommended: 50, status: "optimal", tip: "Current levels adequate" },
          { nutrient: "Potassium (K)", current: 35, recommended: 50, status: "low", tip: "Apply potash before planting" },
        ],
        actionItems: [
          "Test soil pH and adjust if necessary",
          "Prepare land with deep plowing",
          "Ensure proper drainage systems",
        ],
      };
    }
    
    return new Response(JSON.stringify({
      success: true,
      ...recommendations,
      context: { region, soilType, season, temperature, humidity, rainfall },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate recommendations' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
