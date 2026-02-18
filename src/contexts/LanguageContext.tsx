import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "te" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.predict": "Predict Yield",
    "nav.recommendations": "Recommendations",
    "nav.weather": "Weather",
    "nav.history": "History",
    "nav.login": "Login",
    "nav.logout": "Logout",

    // Recommendations Page
    "rec.title": "Smart Crop Recommendations",
    "rec.subtitle": "Get personalized crop suggestions based on your farm conditions",
    "rec.beginner_mode": "Beginner Mode",
    "rec.advanced_mode": "Advanced Mode",
    "rec.crops_tab": "Recommended Crops",
    "rec.charts_tab": "Visual Insights",
    "rec.fertilizer_tab": "Fertilizer Guide",
    "rec.no_results": "Fill in the form above to get crop recommendations",
    "rec.top_recommendations": "Top Recommendations for You",

    // Form Labels
    "form.title": "Tell Us About Your Farm",
    "form.voice_help": "Fill in these details or use voice input 🎤 to get personalized crop recommendations.",
    "form.region": "Region",
    "form.region_help": "Select the part of India where your farm is located.",
    "form.soil": "Soil Type",
    "form.soil_help": "What type of soil does your farm have?",
    "form.soil_hint": "Not sure? Loamy soil is brown and crumbly. Black soil is dark and sticky. Sandy soil feels gritty.",
    "form.season": "Season",
    "form.season_help": "When do you want to sow?",
    "form.land_type": "Land Type",
    "form.land_help": "Do you have irrigation (canal, tube well, pond)?",
    "form.land_hint": "Wet land = Can water regularly. Dry land = Depends on rain.",
    "form.wet_land": "Wet Land (Irrigated)",
    "form.dry_land": "Dry Land (Rain-fed)",
    "form.temperature": "Temperature",
    "form.temp_help": "Average temperature in your area",
    "form.rainfall": "Rainfall",
    "form.humidity": "Humidity",
    "form.submit": "Get Crop Recommendations",
    "form.loading": "Finding Best Crops...",

    // Seasons
    "season.kharif": "Kharif",
    "season.kharif_desc": "Monsoon Season (June-Oct)",
    "season.rabi": "Rabi",
    "season.rabi_desc": "Winter Season (Oct-Mar)",
    "season.zaid": "Zaid",
    "season.zaid_desc": "Summer Season (Mar-Jun)",

    // Crop Card
    "crop.match": "Match",
    "crop.why_suitable": "Why This Crop Suits You",
    "crop.temp_range": "Temperature Range",
    "crop.water_need": "Water Requirement",
    "crop.growing_period": "Growing Period",
    "crop.days": "days",
    "crop.expected_yield": "Expected Yield",
    "crop.fertilizer_guide": "View Fertilizer Guide",

    // Water Requirements
    "water.low": "Low",
    "water.medium": "Medium",
    "water.high": "High",

    // Fertilizer Guide
    "fert.title": "Fertilizer Guide",
    "fert.understanding": "Understanding NPK",
    "fert.nitrogen": "Nitrogen (N)",
    "fert.nitrogen_desc": "Helps plants grow healthy green leaves",
    "fert.phosphorus": "Phosphorus (P)",
    "fert.phosphorus_desc": "Strengthens roots and helps flowering",
    "fert.potassium": "Potassium (K)",
    "fert.potassium_desc": "Improves overall plant health and disease resistance",
    "fert.organic": "Organic Fertilizers",
    "fert.chemical": "Chemical Fertilizers",
    "fert.quantity": "Quantity",
    "fert.timing": "When to Apply",
    "fert.warnings": "Important Warnings",
    "fert.overuse_warning": "Never use more than recommended. Overuse can damage crops and soil.",

    // Charts
    "chart.yield_comparison": "Yield Comparison",
    "chart.category_distribution": "Category Distribution",
    "chart.rainfall_suitability": "Rainfall Suitability",

    // Weather Page
    "weather.title": "Weather Insights",
    "weather.refresh": "Refresh",
    "weather.forecast": "7-Day Forecast",
    "weather.avg_temp": "Avg. Temperature",
    "weather.total_rainfall": "Total Rainfall",
    "weather.humidity_range": "Humidity Range",
    "weather.farming_conditions": "Farming Conditions",
    "weather.recommendations": "Farming Recommendations",
    "weather.crop_calendar": "Crop Calendar",

    // Crop Calendar
    "calendar.title": "Crop Calendar",
    "calendar.all_crops": "All Crops",
    "calendar.calendar_view": "Calendar",
    "calendar.list_view": "List",
    "calendar.now": "Now",
    "calendar.crops": "crops",
    "calendar.sowing_tips": "Sowing Tips",

    // Voice Commands
    "voice.commands": "Voice Commands",
    "voice.try_saying": "Try saying:",
    "voice.received": "Voice Input Received",
    "voice.not_supported": "Voice Input Not Supported",
    "voice.mic_denied": "Microphone Access Denied",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.back": "Back",
  },
  te: {
    // Navigation
    "nav.home": "హోమ్",
    "nav.dashboard": "డాష్‌బోర్డ్",
    "nav.predict": "దిగుబడి అంచనా",
    "nav.recommendations": "సిఫార్సులు",
    "nav.weather": "వాతావరణం",
    "nav.history": "చరిత్ర",
    "nav.login": "లాగిన్",
    "nav.logout": "లాగ్ అవుట్",

    // Recommendations Page
    "rec.title": "స్మార్ట్ పంట సిఫార్సులు",
    "rec.subtitle": "మీ పొలం పరిస్థితుల ఆధారంగా వ్యక్తిగత పంట సూచనలు పొందండి",
    "rec.beginner_mode": "ప్రారంభకుల మోడ్",
    "rec.advanced_mode": "అధునాతన మోడ్",
    "rec.crops_tab": "సిఫార్సు చేసిన పంటలు",
    "rec.charts_tab": "దృశ్య అంతర్దృష్టులు",
    "rec.fertilizer_tab": "ఎరువుల గైడ్",
    "rec.no_results": "పంట సిఫార్సులు పొందడానికి పై ఫారమ్‌ను పూరించండి",
    "rec.top_recommendations": "మీ కోసం టాప్ సిఫార్సులు",

    // Form Labels
    "form.title": "మీ పొలం గురించి చెప్పండి",
    "form.voice_help": "వ్యక్తిగత పంట సిఫార్సులు పొందడానికి ఈ వివరాలను పూరించండి లేదా వాయిస్ ఇన్‌పుట్ 🎤 ఉపయోగించండి.",
    "form.region": "ప్రాంతం",
    "form.region_help": "మీ పొలం ఉన్న భారతదేశ భాగాన్ని ఎంచుకోండి.",
    "form.soil": "నేల రకం",
    "form.soil_help": "మీ పొలంలో ఏ రకమైన నేల ఉంది?",
    "form.soil_hint": "తెలియదా? లోమీ నేల గోధుమ రంగులో మెత్తగా ఉంటుంది. నల్ల నేల చీకటిగా అంటుకునేలా ఉంటుంది. ఇసుక నేల గరుకుగా ఉంటుంది.",
    "form.season": "సీజన్",
    "form.season_help": "మీరు ఎప్పుడు విత్తనాలు వేయాలనుకుంటున్నారు?",
    "form.land_type": "భూమి రకం",
    "form.land_help": "మీకు నీటిపారుదల (కాలువ, బోరు బావి, చెరువు) ఉందా?",
    "form.land_hint": "తడి భూమి = క్రమంగా నీరు పెట్టవచ్చు. పొడి భూమి = వర్షంపై ఆధారపడుతుంది.",
    "form.wet_land": "తడి భూమి (నీటిపారుదల)",
    "form.dry_land": "పొడి భూమి (వర్షాధారిత)",
    "form.temperature": "ఉష్ణోగ్రత",
    "form.temp_help": "మీ ప్రాంతంలో సగటు ఉష్ణోగ్రత",
    "form.rainfall": "వర్షపాతం",
    "form.humidity": "తేమ",
    "form.submit": "పంట సిఫార్సులు పొందండి",
    "form.loading": "ఉత్తమ పంటలను కనుగొనడం...",

    // Seasons
    "season.kharif": "ఖరీఫ్",
    "season.kharif_desc": "వర్షాకాలం (జూన్-అక్టోబర్)",
    "season.rabi": "రబీ",
    "season.rabi_desc": "శీతాకాలం (అక్టోబర్-మార్చి)",
    "season.zaid": "జైద్",
    "season.zaid_desc": "వేసవి కాలం (మార్చి-జూన్)",

    // Crop Card
    "crop.match": "సరిపోలిక",
    "crop.why_suitable": "ఈ పంట మీకు ఎందుకు సరిపోతుంది",
    "crop.temp_range": "ఉష్ణోగ్రత పరిధి",
    "crop.water_need": "నీటి అవసరం",
    "crop.growing_period": "పెరుగుదల కాలం",
    "crop.days": "రోజులు",
    "crop.expected_yield": "అంచనా దిగుబడి",
    "crop.fertilizer_guide": "ఎరువుల గైడ్ చూడండి",

    // Water Requirements
    "water.low": "తక్కువ",
    "water.medium": "మధ్యస్థం",
    "water.high": "ఎక్కువ",

    // Fertilizer Guide
    "fert.title": "ఎరువుల గైడ్",
    "fert.understanding": "NPK అర్థం చేసుకోవడం",
    "fert.nitrogen": "నత్రజని (N)",
    "fert.nitrogen_desc": "మొక్కలు ఆరోగ్యకరమైన ఆకుపచ్చ ఆకులు పెరగడానికి సహాయపడుతుంది",
    "fert.phosphorus": "భాస్వరం (P)",
    "fert.phosphorus_desc": "వేర్లను బలపరుస్తుంది మరియు పుష్పించడానికి సహాయపడుతుంది",
    "fert.potassium": "పొటాషియం (K)",
    "fert.potassium_desc": "మొత్తం మొక్క ఆరోగ్యం మరియు వ్యాధి నిరోధకతను మెరుగుపరుస్తుంది",
    "fert.organic": "సేంద్రీయ ఎరువులు",
    "fert.chemical": "రసాయన ఎరువులు",
    "fert.quantity": "పరిమాణం",
    "fert.timing": "ఎప్పుడు వేయాలి",
    "fert.warnings": "ముఖ్యమైన హెచ్చరికలు",
    "fert.overuse_warning": "సిఫార్సు కంటే ఎక్కువ ఉపయోగించకండి. అధిక వినియోగం పంటలు మరియు నేలను దెబ్బతీస్తుంది.",

    // Charts
    "chart.yield_comparison": "దిగుబడి పోలిక",
    "chart.category_distribution": "వర్గ పంపిణీ",
    "chart.rainfall_suitability": "వర్షపాతం అనుకూలత",

    // Weather Page
    "weather.title": "వాతావరణ అంతర్దృష్టులు",
    "weather.refresh": "రిఫ్రెష్",
    "weather.forecast": "7-రోజుల అంచనా",
    "weather.avg_temp": "సగటు ఉష్ణోగ్రత",
    "weather.total_rainfall": "మొత్తం వర్షపాతం",
    "weather.humidity_range": "తేమ పరిధి",
    "weather.farming_conditions": "వ్యవసాయ పరిస్థితులు",
    "weather.recommendations": "వ్యవసాయ సిఫార్సులు",
    "weather.crop_calendar": "పంట క్యాలెండర్",

    // Crop Calendar
    "calendar.title": "పంట క్యాలెండర్",
    "calendar.all_crops": "అన్ని పంటలు",
    "calendar.calendar_view": "క్యాలెండర్",
    "calendar.list_view": "జాబితా",
    "calendar.now": "ఇప్పుడు",
    "calendar.crops": "పంటలు",
    "calendar.sowing_tips": "విత్తనం చిట్కాలు",

    // Voice Commands
    "voice.commands": "వాయిస్ ఆదేశాలు",
    "voice.try_saying": "ఇలా చెప్పడానికి ప్రయత్నించండి:",
    "voice.received": "వాయిస్ ఇన్‌పుట్ అందుకుంది",
    "voice.not_supported": "వాయిస్ ఇన్‌పుట్ మద్దతు లేదు",
    "voice.mic_denied": "మైక్రోఫోన్ యాక్సెస్ తిరస్కరించబడింది",

    // Common
    "common.loading": "లోడ్ అవుతోంది...",
    "common.error": "లోపం",
    "common.success": "విజయం",
    "common.cancel": "రద్దు చేయండి",
    "common.save": "సేవ్ చేయండి",
    "common.back": "వెనుకకు",
  },
  hi: {
    // Navigation
    "nav.home": "होम",
    "nav.dashboard": "डैशबोर्ड",
    "nav.predict": "उपज अनुमान",
    "nav.recommendations": "सिफारिशें",
    "nav.weather": "मौसम",
    "nav.history": "इतिहास",
    "nav.login": "लॉगिन",
    "nav.logout": "लॉग आउट",

    // Recommendations Page
    "rec.title": "स्मार्ट फसल सिफारिशें",
    "rec.subtitle": "अपने खेत की स्थिति के आधार पर व्यक्तिगत फसल सुझाव प्राप्त करें",
    "rec.beginner_mode": "शुरुआती मोड",
    "rec.advanced_mode": "उन्नत मोड",
    "rec.crops_tab": "अनुशंसित फसलें",
    "rec.charts_tab": "दृश्य जानकारी",
    "rec.fertilizer_tab": "उर्वरक गाइड",
    "rec.no_results": "फसल सिफारिशें पाने के लिए ऊपर फॉर्म भरें",
    "rec.top_recommendations": "आपके लिए शीर्ष सिफारिशें",

    // Form Labels
    "form.title": "अपने खेत के बारे में बताएं",
    "form.voice_help": "व्यक्तिगत फसल सिफारिशें पाने के लिए ये विवरण भरें या वॉइस इनपुट 🎤 का उपयोग करें।",
    "form.region": "क्षेत्र",
    "form.region_help": "भारत के उस हिस्से का चयन करें जहां आपका खेत है।",
    "form.soil": "मिट्टी का प्रकार",
    "form.soil_help": "आपके खेत में किस प्रकार की मिट्टी है?",
    "form.soil_hint": "पता नहीं? दोमट मिट्टी भूरी और भुरभुरी होती है। काली मिट्टी गहरी और चिपचिपी होती है। रेतीली मिट्टी खुरदरी लगती है।",
    "form.season": "मौसम",
    "form.season_help": "आप कब बुवाई करना चाहते हैं?",
    "form.land_type": "भूमि का प्रकार",
    "form.land_help": "क्या आपके पास सिंचाई (नहर, ट्यूबवेल, तालाब) है?",
    "form.land_hint": "गीली भूमि = नियमित पानी दे सकते हैं। सूखी भूमि = बारिश पर निर्भर।",
    "form.wet_land": "गीली भूमि (सिंचित)",
    "form.dry_land": "सूखी भूमि (वर्षा आधारित)",
    "form.temperature": "तापमान",
    "form.temp_help": "आपके क्षेत्र में औसत तापमान",
    "form.rainfall": "वर्षा",
    "form.humidity": "आर्द्रता",
    "form.submit": "फसल सिफारिशें प्राप्त करें",
    "form.loading": "सर्वोत्तम फसलें खोज रहे हैं...",

    // Seasons
    "season.kharif": "खरीफ",
    "season.kharif_desc": "मानसून मौसम (जून-अक्टूबर)",
    "season.rabi": "रबी",
    "season.rabi_desc": "सर्दी का मौसम (अक्टूबर-मार्च)",
    "season.zaid": "जायद",
    "season.zaid_desc": "गर्मी का मौसम (मार्च-जून)",

    // Crop Card
    "crop.match": "मिलान",
    "crop.why_suitable": "यह फसल आपके लिए क्यों उपयुक्त है",
    "crop.temp_range": "तापमान सीमा",
    "crop.water_need": "पानी की आवश्यकता",
    "crop.growing_period": "उगाने की अवधि",
    "crop.days": "दिन",
    "crop.expected_yield": "अपेक्षित उपज",
    "crop.fertilizer_guide": "उर्वरक गाइड देखें",

    // Water Requirements
    "water.low": "कम",
    "water.medium": "मध्यम",
    "water.high": "अधिक",

    // Fertilizer Guide
    "fert.title": "उर्वरक गाइड",
    "fert.understanding": "NPK को समझें",
    "fert.nitrogen": "नाइट्रोजन (N)",
    "fert.nitrogen_desc": "पौधों को स्वस्थ हरी पत्तियां उगाने में मदद करता है",
    "fert.phosphorus": "फास्फोरस (P)",
    "fert.phosphorus_desc": "जड़ों को मजबूत करता है और फूलने में मदद करता है",
    "fert.potassium": "पोटैशियम (K)",
    "fert.potassium_desc": "समग्र पौधे के स्वास्थ्य और रोग प्रतिरोधक क्षमता में सुधार करता है",
    "fert.organic": "जैविक उर्वरक",
    "fert.chemical": "रासायनिक उर्वरक",
    "fert.quantity": "मात्रा",
    "fert.timing": "कब डालें",
    "fert.warnings": "महत्वपूर्ण चेतावनियां",
    "fert.overuse_warning": "अनुशंसित से अधिक कभी न डालें। अधिक उपयोग फसलों और मिट्टी को नुकसान पहुंचा सकता है।",

    // Charts
    "chart.yield_comparison": "उपज तुलना",
    "chart.category_distribution": "श्रेणी वितरण",
    "chart.rainfall_suitability": "वर्षा उपयुक्तता",

    // Weather Page
    "weather.title": "मौसम जानकारी",
    "weather.refresh": "रिफ्रेश",
    "weather.forecast": "7-दिन का पूर्वानुमान",
    "weather.avg_temp": "औसत तापमान",
    "weather.total_rainfall": "कुल वर्षा",
    "weather.humidity_range": "आर्द्रता सीमा",
    "weather.farming_conditions": "खेती की स्थिति",
    "weather.recommendations": "खेती सिफारिशें",
    "weather.crop_calendar": "फसल कैलेंडर",

    // Crop Calendar
    "calendar.title": "फसल कैलेंडर",
    "calendar.all_crops": "सभी फसलें",
    "calendar.calendar_view": "कैलेंडर",
    "calendar.list_view": "सूची",
    "calendar.now": "अभी",
    "calendar.crops": "फसलें",
    "calendar.sowing_tips": "बुवाई के टिप्स",

    // Voice Commands
    "voice.commands": "वॉइस कमांड",
    "voice.try_saying": "बोलकर देखें:",
    "voice.received": "वॉइस इनपुट प्राप्त",
    "voice.not_supported": "वॉइस इनपुट समर्थित नहीं",
    "voice.mic_denied": "माइक्रोफोन एक्सेस अस्वीकृत",

    // Common
    "common.loading": "लोड हो रहा है...",
    "common.error": "त्रुटि",
    "common.success": "सफलता",
    "common.cancel": "रद्द करें",
    "common.save": "सेव करें",
    "common.back": "वापस",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("app-language");
    return (saved as Language) || "en";
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("app-language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
