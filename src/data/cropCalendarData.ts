// Smart Crop Calendar Data for Indian Agriculture
// Comprehensive 12-month data for all major Indian crops

export interface MonthlyAction {
  stage: string;
  stageLocal: string; // Telugu/Hindi
  waterNeed: 'low' | 'medium' | 'high' | 'none';
  weather: 'rainy' | 'dry' | 'cool' | 'hot' | 'humid';
  risks: Array<{
    type: 'drought' | 'flood' | 'pest' | 'disease' | 'frost' | 'heat';
    level: 'low' | 'medium' | 'high';
  }>;
  action: string;
  actionLocal: string;
  isActive: boolean;
  tips?: string[];
}

export interface CropCalendarCrop {
  id: string;
  name: string;
  nameLocal: string; // Telugu/Hindi
  icon: string;
  season: 'kharif' | 'rabi' | 'zaid' | 'perennial';
  category: 'cereal' | 'pulse' | 'oilseed' | 'cash' | 'vegetable' | 'fruit' | 'plantation';
  duration: string;
  months: MonthlyAction[];
}

// Helper to create off-season month
const offSeason = (weather: MonthlyAction['weather'] = 'dry'): MonthlyAction => ({
  stage: 'Off-Season',
  stageLocal: 'విశ్రాంతి కాలం / बंद सीजन',
  waterNeed: 'none',
  weather,
  risks: [],
  action: 'Rest field, add organic matter',
  actionLocal: 'పొలం విశ్రాంతి, సేంద్రీయ పదార్థాలు కలపండి',
  isActive: false,
  tips: ['Plough field deeply', 'Add farm yard manure', 'Green manuring beneficial']
});

const fieldPrep = (weather: MonthlyAction['weather'] = 'hot'): MonthlyAction => ({
  stage: 'Field Preparation',
  stageLocal: 'భూమి సిద్ధం / खेत की तैयारी',
  waterNeed: 'low',
  weather,
  risks: [],
  action: 'Prepare nursery, plough field',
  actionLocal: 'నాట్లకు సిద్ధం చేయండి',
  isActive: true,
  tips: ['Level the field', 'Check seed quality', 'Apply basal fertilizer']
});

// KHARIF CROPS
export const riceKharif: CropCalendarCrop = {
  id: 'rice-kharif',
  name: 'Rice (Paddy)',
  nameLocal: 'వరి / धान',
  icon: '🌾',
  season: 'kharif',
  category: 'cereal',
  duration: '120-150 days',
  months: [
    // January
    offSeason('cool'),
    // February
    offSeason('cool'),
    // March
    offSeason('hot'),
    // April
    offSeason('hot'),
    // May
    fieldPrep('hot'),
    // June - Nursery/Sowing
    {
      stage: 'Nursery Sowing',
      stageLocal: 'నారుమడి / नर्सरी',
      waterNeed: 'high',
      weather: 'rainy',
      risks: [{ type: 'flood', level: 'medium' }],
      action: 'Prepare wet nursery bed, sow seeds',
      actionLocal: 'తడి నారుమడి, విత్తనాలు వేయండి',
      isActive: true,
      tips: ['Use certified seeds', 'Maintain 2-3cm water', 'Apply DAP in nursery']
    },
    // July - Transplanting
    {
      stage: 'Transplanting',
      stageLocal: 'నాట్లు వేయడం / रोपाई',
      waterNeed: 'high',
      weather: 'rainy',
      risks: [{ type: 'flood', level: 'high' }, { type: 'pest', level: 'medium' }],
      action: 'Transplant 21-25 day seedlings',
      actionLocal: '21-25 రోజుల మొక్కలు నాటండి',
      isActive: true,
      tips: ['2-3 seedlings per hill', 'Spacing 20x15cm', 'Apply nitrogen after 1 week']
    },
    // August - Tillering
    {
      stage: 'Tillering Stage',
      stageLocal: 'పిలక దశ / कल्ले निकलना',
      waterNeed: 'high',
      weather: 'rainy',
      risks: [{ type: 'pest', level: 'high' }, { type: 'disease', level: 'medium' }],
      action: 'Maintain water, apply nitrogen',
      actionLocal: 'నీరు నిలపండి, నత్రజని వేయండి',
      isActive: true,
      tips: ['Watch for stem borer', 'Apply urea (40kg/acre)', 'Weed management critical']
    },
    // September - Panicle
    {
      stage: 'Panicle Formation',
      stageLocal: 'కంకి ఏర్పాటు / बाली बनना',
      waterNeed: 'high',
      weather: 'humid',
      risks: [{ type: 'disease', level: 'high' }, { type: 'pest', level: 'medium' }],
      action: 'Critical water stage, apply potash',
      actionLocal: 'నీరు ముఖ్యం, పొటాష్ వేయండి',
      isActive: true,
      tips: ['Never let field dry', 'Spray for blast disease', 'Apply potash now']
    },
    // October - Grain Filling
    {
      stage: 'Grain Filling',
      stageLocal: 'గింజ నింపుట / दाना भरना',
      waterNeed: 'medium',
      weather: 'humid',
      risks: [{ type: 'pest', level: 'medium' }],
      action: 'Maintain moisture, bird scaring',
      actionLocal: 'తేమ నిలపండి, పక్షులను తరిమండి',
      isActive: true,
      tips: ['Reduce water gradually', 'Watch for rice bug', 'Stop irrigation 10 days before harvest']
    },
    // November - Harvest
    {
      stage: 'Harvesting',
      stageLocal: 'కోత / कटाई',
      waterNeed: 'none',
      weather: 'dry',
      risks: [],
      action: 'Harvest when 80% grains golden',
      actionLocal: '80% గింజలు పసుపు రంగులో మారినప్పుడు కోయండి',
      isActive: true,
      tips: ['Harvest at 20-22% moisture', 'Dry to 14% for storage', 'Thresh within 24 hours']
    },
    // December
    offSeason('cool'),
  ]
};

export const maize: CropCalendarCrop = {
  id: 'maize',
  name: 'Maize (Corn)',
  nameLocal: 'మొక్కజొన్న / मक्का',
  icon: '🌽',
  season: 'kharif',
  category: 'cereal',
  duration: '90-120 days',
  months: [
    offSeason('cool'),
    offSeason('cool'),
    offSeason('hot'),
    offSeason('hot'),
    fieldPrep('hot'),
    // June
    {
      stage: 'Sowing',
      stageLocal: 'విత్తడం / बुवाई',
      waterNeed: 'medium',
      weather: 'rainy',
      risks: [{ type: 'drought', level: 'medium' }],
      action: 'Sow seeds 5cm deep, 60x20cm spacing',
      actionLocal: '5cm లోతులో విత్తనాలు వేయండి',
      isActive: true,
      tips: ['Treat seeds with Thiram', 'Apply DAP in furrows', 'Early sowing preferred']
    },
    // July
    {
      stage: 'Vegetative Growth',
      stageLocal: 'ఆకు పెరుగుదల / पत्ती वृद्धि',
      waterNeed: 'medium',
      weather: 'rainy',
      risks: [{ type: 'pest', level: 'medium' }],
      action: 'Thin plants, weed control',
      actionLocal: 'మొక్కలను సన్నగా చేయండి, కలుపు తీయండి',
      isActive: true,
      tips: ['Keep 1 plant per hill', 'Earthing up at 30 days', 'Apply nitrogen']
    },
    // August
    {
      stage: 'Tasseling',
      stageLocal: 'పువ్వు దశ / फूल आना',
      waterNeed: 'high',
      weather: 'rainy',
      risks: [{ type: 'drought', level: 'high' }],
      action: 'Critical water stage, avoid stress',
      actionLocal: 'నీరు ముఖ్యం, ఒత్తిడి నివారించండి',
      isActive: true,
      tips: ['Water stress now = 50% yield loss', 'Watch for armyworm', 'Apply urea side-dressing']
    },
    // September
    {
      stage: 'Cob Formation',
      stageLocal: 'కంకి ఏర్పాటు / भुट्टा बनना',
      waterNeed: 'medium',
      weather: 'humid',
      risks: [{ type: 'pest', level: 'medium' }],
      action: 'Support plants, pest watch',
      actionLocal: 'మొక్కలకు ఆధారం, పురుగు గమనించండి',
      isActive: true,
      tips: ['Check for cob borer', 'Maintain soil moisture', 'Birds start becoming a problem']
    },
    // October
    {
      stage: 'Maturity',
      stageLocal: 'పరిపక్వత / परिपक्वता',
      waterNeed: 'low',
      weather: 'dry',
      risks: [],
      action: 'Harvest when husks dry, kernels hard',
      actionLocal: 'పొర ఎండినప్పుడు కోయండి',
      isActive: true,
      tips: ['Black layer at kernel base', 'Moisture 25-30%', 'Dry to 12% for storage']
    },
    offSeason('cool'),
    offSeason('cool'),
  ]
};

export const cotton: CropCalendarCrop = {
  id: 'cotton',
  name: 'Cotton',
  nameLocal: 'పత్తి / कपास',
  icon: '🧶',
  season: 'kharif',
  category: 'cash',
  duration: '150-180 days',
  months: [
    offSeason('cool'),
    offSeason('cool'),
    offSeason('hot'),
    // April
    fieldPrep('hot'),
    // May
    {
      stage: 'Sowing',
      stageLocal: 'విత్తడం / बुवाई',
      waterNeed: 'medium',
      weather: 'hot',
      risks: [{ type: 'drought', level: 'medium' }],
      action: 'Sow with pre-monsoon showers',
      actionLocal: 'వర్షాలకు ముందు విత్తండి',
      isActive: true,
      tips: ['Bt cotton preferred', 'Spacing 90x60cm', 'Treat seeds with imidacloprid']
    },
    // June
    {
      stage: 'Germination',
      stageLocal: 'మొలక దశ / अंकुरण',
      waterNeed: 'medium',
      weather: 'rainy',
      risks: [{ type: 'pest', level: 'medium' }],
      action: 'Gap filling, early weeding',
      actionLocal: 'ఖాళీలు నింపండి, కలుపు తీయండి',
      isActive: true,
      tips: ['Replant gaps within 15 days', 'Watch for jassids', 'First weeding at 20 days']
    },
    // July
    {
      stage: 'Vegetative Growth',
      stageLocal: 'ఆకు పెరుగుదల / वनस्पति वृद्धि',
      waterNeed: 'medium',
      weather: 'rainy',
      risks: [{ type: 'pest', level: 'high' }],
      action: 'Nitrogen application, pest scouting',
      actionLocal: 'నత్రజని వేయండి, పురుగులు గమనించండి',
      isActive: true,
      tips: ['Apply urea at 30 days', 'Regular scouting for bollworm', 'Avoid excess nitrogen']
    },
    // August
    {
      stage: 'Squaring',
      stageLocal: 'మొగ్గ దశ / कली बनना',
      waterNeed: 'high',
      weather: 'rainy',
      risks: [{ type: 'pest', level: 'high' }, { type: 'disease', level: 'medium' }],
      action: 'Critical stage, IPM for bollworm',
      actionLocal: 'ముఖ్య దశ, పురుగు నియంత్రణ',
      isActive: true,
      tips: ['Pheromone traps for bollworm', 'Spray if ETL crossed', 'Light trap installation']
    },
    // September
    {
      stage: 'Flowering',
      stageLocal: 'పుష్పించే దశ / फूल आना',
      waterNeed: 'high',
      weather: 'humid',
      risks: [{ type: 'pest', level: 'high' }, { type: 'disease', level: 'high' }],
      action: 'Pest control critical, potash application',
      actionLocal: 'పురుగు నియంత్రణ, పొటాష్ వేయండి',
      isActive: true,
      tips: ['Spray for pink bollworm', 'Apply MOP', 'Watch for bacterial blight']
    },
    // October
    {
      stage: 'Boll Formation',
      stageLocal: 'పువ్వు కాయ దశ / टिंडे बनना',
      waterNeed: 'medium',
      weather: 'humid',
      risks: [{ type: 'pest', level: 'medium' }],
      action: 'Maintain moisture, late pest watch',
      actionLocal: 'తేమ నిలపండి, పురుగు గమనించండి',
      isActive: true,
      tips: ['Defoliant spray if needed', 'Harvest scheduling', 'Control American bollworm']
    },
    // November
    {
      stage: 'First Picking',
      stageLocal: 'మొదటి కోత / पहली तुड़ाई',
      waterNeed: 'low',
      weather: 'dry',
      risks: [],
      action: 'Pick open bolls, grade cotton',
      actionLocal: 'విచ్చిన కాయలను ఏరండి',
      isActive: true,
      tips: ['Pick only fully open bolls', '3-4 pickings typical', 'Separate contaminated cotton']
    },
    // December
    {
      stage: 'Final Picking',
      stageLocal: 'చివరి కోత / अंतिम तुड़ाई',
      waterNeed: 'none',
      weather: 'cool',
      risks: [],
      action: 'Complete harvest, stalk destruction',
      actionLocal: 'పంట పూర్తి, మొక్కలు నాశనం',
      isActive: true,
      tips: ['Destroy stalks to kill pink bollworm', 'Plan next crop', 'Sell before moisture loss']
    },
  ]
};

export const groundnut: CropCalendarCrop = {
  id: 'groundnut',
  name: 'Groundnut (Peanut)',
  nameLocal: 'వేరుశనగ / मूंगफली',
  icon: '🥜',
  season: 'kharif',
  category: 'oilseed',
  duration: '100-130 days',
  months: [
    offSeason('cool'),
    offSeason('cool'),
    offSeason('hot'),
    offSeason('hot'),
    // May
    fieldPrep('hot'),
    // June
    {
      stage: 'Sowing',
      stageLocal: 'విత్తడం / बुवाई',
      waterNeed: 'medium',
      weather: 'rainy',
      risks: [{ type: 'drought', level: 'medium' }],
      action: 'Sow in ridges, 30x10cm spacing',
      actionLocal: 'బోదెలలో విత్తండి',
      isActive: true,
      tips: ['Treat seeds with Rhizobium', 'Apply gypsum at sowing', 'Use certified seeds']
    },
    // July
    {
      stage: 'Vegetative Growth',
      stageLocal: 'ఆకు పెరుగుదల / पत्ती वृद्धि',
      waterNeed: 'medium',
      weather: 'rainy',
      risks: [{ type: 'pest', level: 'medium' }],
      action: 'Weeding, earthing up',
      actionLocal: 'కలుపు తీయండి, మట్టి ఎత్తండి',
      isActive: true,
      tips: ['Hand weeding at 20 days', 'Earthing up at 30 days', 'Watch for leaf miner']
    },
    // August
    {
      stage: 'Flowering & Pegging',
      stageLocal: 'పుష్పించే దశ / फूल आना',
      waterNeed: 'high',
      weather: 'rainy',
      risks: [{ type: 'disease', level: 'high' }],
      action: 'Apply gypsum 500kg/ha, avoid waterlogging',
      actionLocal: 'జిప్సం వేయండి, నీరు నిలకుండా చూడండి',
      isActive: true,
      tips: ['Gypsum critical for pod filling', 'Spray for tikka disease', 'Maintain soil moisture']
    },
    // September
    {
      stage: 'Pod Development',
      stageLocal: 'కాయ పెరుగుదల / फली विकास',
      waterNeed: 'medium',
      weather: 'humid',
      risks: [{ type: 'disease', level: 'medium' }, { type: 'pest', level: 'medium' }],
      action: 'Maintain moisture, disease watch',
      actionLocal: 'తేమ నిలపండి, రోగాలు గమనించండి',
      isActive: true,
      tips: ['Check for collar rot', 'Control red hairy caterpillar', 'Stop irrigation near harvest']
    },
    // October
    {
      stage: 'Harvesting',
      stageLocal: 'కోత / खुदाई',
      waterNeed: 'low',
      weather: 'dry',
      risks: [],
      action: 'Harvest when leaves yellow, pods mature',
      actionLocal: 'ఆకులు పసుపు, కాయలు పక్వమైనప్పుడు కోయండి',
      isActive: true,
      tips: ['Test dig for maturity', 'Dry to 8-10% moisture', 'Separate diseased pods']
    },
    offSeason('cool'),
    offSeason('cool'),
  ]
};

// RABI CROPS
export const wheat: CropCalendarCrop = {
  id: 'wheat',
  name: 'Wheat',
  nameLocal: 'గోధుమ / गेहूं',
  icon: '🌾',
  season: 'rabi',
  category: 'cereal',
  duration: '120-150 days',
  months: [
    // January
    {
      stage: 'Tillering',
      stageLocal: 'పిలక దశ / कल्ले निकलना',
      waterNeed: 'medium',
      weather: 'cool',
      risks: [{ type: 'frost', level: 'medium' }],
      action: 'First irrigation, nitrogen top dress',
      actionLocal: 'మొదటి తడి, నత్రజని వేయండి',
      isActive: true,
      tips: ['Irrigate at crown root stage', 'Apply urea 50kg/ha', 'Watch for aphids']
    },
    // February
    {
      stage: 'Jointing',
      stageLocal: 'కణుపు దశ / गांठ बनना',
      waterNeed: 'high',
      weather: 'cool',
      risks: [{ type: 'disease', level: 'medium' }],
      action: 'Second irrigation, rust watch',
      actionLocal: 'రెండవ తడి, తుప్పు గమనించండి',
      isActive: true,
      tips: ['Critical irrigation stage', 'Spray propiconazole for rust', 'Apply second urea dose']
    },
    // March
    {
      stage: 'Heading & Flowering',
      stageLocal: 'కంకి దశ / बाली निकलना',
      waterNeed: 'high',
      weather: 'dry',
      risks: [{ type: 'heat', level: 'medium' }, { type: 'disease', level: 'high' }],
      action: 'Third irrigation, disease management',
      actionLocal: 'మూడవ తడి, రోగ నియంత్రణ',
      isActive: true,
      tips: ['Never miss this irrigation', 'Watch for Karnal bunt', 'Avoid stress']
    },
    // April
    {
      stage: 'Grain Filling & Harvest',
      stageLocal: 'గింజ నింపుట / दाना भरना',
      waterNeed: 'medium',
      weather: 'hot',
      risks: [{ type: 'heat', level: 'high' }],
      action: 'Final irrigation, harvest timely',
      actionLocal: 'చివరి తడి, సమయానికి కోయండి',
      isActive: true,
      tips: ['Harvest at 12-14% moisture', 'Avoid shattering losses', 'Store in dry place']
    },
    // May
    offSeason('hot'),
    // June
    offSeason('rainy'),
    // July
    offSeason('rainy'),
    // August
    offSeason('rainy'),
    // September
    offSeason('humid'),
    // October
    fieldPrep('dry'),
    // November
    {
      stage: 'Sowing',
      stageLocal: 'విత్తడం / बुवाई',
      waterNeed: 'medium',
      weather: 'cool',
      risks: [],
      action: 'Sow treated seeds, 22.5cm rows',
      actionLocal: 'శుద్ధి చేసిన విత్తనాలు వేయండి',
      isActive: true,
      tips: ['November 15-30 optimal', 'Seed rate 100kg/ha', 'Pre-sowing irrigation']
    },
    // December
    {
      stage: 'Germination',
      stageLocal: 'మొలక దశ / अंकुरण',
      waterNeed: 'low',
      weather: 'cool',
      risks: [{ type: 'frost', level: 'low' }],
      action: 'Ensure proper stand, no irrigation',
      actionLocal: 'మొక్కలు సరిగా ఉన్నాయో చూడండి',
      isActive: true,
      tips: ['Gap filling if needed', 'No irrigation till 21 days', 'Protect from frost']
    },
  ]
};

export const chickpea: CropCalendarCrop = {
  id: 'chickpea',
  name: 'Chickpea (Gram)',
  nameLocal: 'శనగలు / चना',
  icon: '🫘',
  season: 'rabi',
  category: 'pulse',
  duration: '100-120 days',
  months: [
    // January
    {
      stage: 'Flowering',
      stageLocal: 'పుష్పించే దశ / फूल आना',
      waterNeed: 'low',
      weather: 'cool',
      risks: [{ type: 'frost', level: 'medium' }, { type: 'pest', level: 'medium' }],
      action: 'Light irrigation if needed, pest watch',
      actionLocal: 'అవసరమైతే తేలిక తడి, పురుగు గమనించండి',
      isActive: true,
      tips: ['Avoid excess water', 'Watch for pod borer', 'Frost protection if severe']
    },
    // February
    {
      stage: 'Pod Formation',
      stageLocal: 'కాయ ఏర్పాటు / फली बनना',
      waterNeed: 'low',
      weather: 'cool',
      risks: [{ type: 'pest', level: 'high' }],
      action: 'Pod borer management critical',
      actionLocal: 'కాయ తొలుచు పురుగు నియంత్రణ',
      isActive: true,
      tips: ['Spray Helicoverpa NPV', 'Bird perches for predation', 'No excess irrigation']
    },
    // March
    {
      stage: 'Maturity & Harvest',
      stageLocal: 'పరిపక్వత & కోత / परिपक्वता',
      waterNeed: 'none',
      weather: 'dry',
      risks: [{ type: 'heat', level: 'medium' }],
      action: 'Harvest when leaves dry, pods brown',
      actionLocal: 'ఆకులు ఎండి, కాయలు గోధుమ రంగులో',
      isActive: true,
      tips: ['Harvest in morning', 'Thresh after drying', 'Store at 10% moisture']
    },
    offSeason('hot'),
    offSeason('hot'),
    offSeason('rainy'),
    offSeason('rainy'),
    offSeason('rainy'),
    offSeason('humid'),
    // October
    fieldPrep('dry'),
    // November
    {
      stage: 'Sowing',
      stageLocal: 'విత్తడం / बुवाई',
      waterNeed: 'medium',
      weather: 'cool',
      risks: [],
      action: 'Sow in conserved moisture, 30x10cm',
      actionLocal: 'నేలలో తేమ ఉన్నప్పుడు విత్తండి',
      isActive: true,
      tips: ['Treat with Rhizobium', 'October-November optimal', 'Seed rate 80-100kg/ha']
    },
    // December
    {
      stage: 'Vegetative Growth',
      stageLocal: 'ఆకు పెరుగుదల / वनस्पति वृद्धि',
      waterNeed: 'low',
      weather: 'cool',
      risks: [{ type: 'disease', level: 'medium' }],
      action: 'Minimal water, weed control',
      actionLocal: 'తక్కువ నీరు, కలుపు తీయండి',
      isActive: true,
      tips: ['Gram needs less water', 'Watch for wilt', 'Hand weeding beneficial']
    },
  ]
};

export const mustard: CropCalendarCrop = {
  id: 'mustard',
  name: 'Mustard',
  nameLocal: 'ఆవాలు / सरसों',
  icon: '🌻',
  season: 'rabi',
  category: 'oilseed',
  duration: '90-120 days',
  months: [
    // January
    {
      stage: 'Flowering',
      stageLocal: 'పుష్పించే దశ / फूल आना',
      waterNeed: 'medium',
      weather: 'cool',
      risks: [{ type: 'frost', level: 'medium' }, { type: 'pest', level: 'high' }],
      action: 'Aphid control, irrigation',
      actionLocal: 'పేను నియంత్రణ, తడి',
      isActive: true,
      tips: ['Spray for aphids', 'Yellow fields indicate aphid damage', 'Light irrigation']
    },
    // February
    {
      stage: 'Siliqua Formation',
      stageLocal: 'కాయ ఏర్పాటు / फली बनना',
      waterNeed: 'medium',
      weather: 'cool',
      risks: [{ type: 'pest', level: 'medium' }],
      action: 'Pod development, final spray',
      actionLocal: 'కాయ అభివృద్ధి, చివరి పిచికారీ',
      isActive: true,
      tips: ['Critical water stage', 'No stress now', 'Watch for painted bug']
    },
    // March
    {
      stage: 'Harvest',
      stageLocal: 'కోత / कटाई',
      waterNeed: 'none',
      weather: 'dry',
      risks: [{ type: 'heat', level: 'low' }],
      action: 'Harvest when 75% pods brown',
      actionLocal: '75% కాయలు గోధుమ రంగులో కోయండి',
      isActive: true,
      tips: ['Harvest in morning to avoid shattering', 'Thresh immediately', 'Oil content highest now']
    },
    offSeason('hot'),
    offSeason('hot'),
    offSeason('rainy'),
    offSeason('rainy'),
    offSeason('rainy'),
    offSeason('humid'),
    // October
    fieldPrep('dry'),
    // November
    {
      stage: 'Sowing',
      stageLocal: 'విత్తడం / बुवाई',
      waterNeed: 'medium',
      weather: 'cool',
      risks: [],
      action: 'Sow in rows 45cm apart',
      actionLocal: '45cm అంతరంలో విత్తండి',
      isActive: true,
      tips: ['Seed rate 4-5 kg/ha', 'Apply sulphur at sowing', 'October 15-Nov 15 optimal']
    },
    // December
    {
      stage: 'Vegetative Growth',
      stageLocal: 'ఆకు పెరుగుదల / वनस्पति वृद्धि',
      waterNeed: 'low',
      weather: 'cool',
      risks: [{ type: 'frost', level: 'low' }],
      action: 'First irrigation at 30 DAS, thinning',
      actionLocal: '30 రోజులకు మొదటి తడి',
      isActive: true,
      tips: ['Thin to single plant', 'Weed control important', 'Apply nitrogen if deficient']
    },
  ]
};

// ZAID CROPS
export const watermelon: CropCalendarCrop = {
  id: 'watermelon',
  name: 'Watermelon',
  nameLocal: 'పుచ్చకాయ / तरबूज',
  icon: '🍉',
  season: 'zaid',
  category: 'vegetable',
  duration: '80-110 days',
  months: [
    offSeason('cool'),
    // February
    {
      stage: 'Sowing',
      stageLocal: 'విత్తడం / बुवाई',
      waterNeed: 'medium',
      weather: 'cool',
      risks: [],
      action: 'Sow in raised beds, mulching',
      actionLocal: 'ఎత్తైన బెడ్లలో విత్తండి',
      isActive: true,
      tips: ['Spacing 2x1.5m', 'Apply manure in pits', 'Mulching conserves moisture']
    },
    // March
    {
      stage: 'Vine Growth',
      stageLocal: 'తీగ పెరుగుదల / बेल बढ़ना',
      waterNeed: 'high',
      weather: 'hot',
      risks: [{ type: 'pest', level: 'medium' }],
      action: 'Regular irrigation, vine training',
      actionLocal: 'క్రమం తప్పకుండా నీరు, తీగలను సరిచేయండి',
      isActive: true,
      tips: ['Drip irrigation ideal', 'Watch for fruit fly', 'Pinch growing tips']
    },
    // April
    {
      stage: 'Flowering & Fruiting',
      stageLocal: 'పుష్పించే & కాయ దశ / फूल और फल',
      waterNeed: 'high',
      weather: 'hot',
      risks: [{ type: 'heat', level: 'medium' }, { type: 'pest', level: 'high' }],
      action: 'Maintain moisture, pollination support',
      actionLocal: 'తేమ నిలపండి, పరాగసంపర్కం సహాయం',
      isActive: true,
      tips: ['Hand pollination morning 6-9AM', 'Reduce watering at fruit maturity', 'Cover fruits from sun']
    },
    // May
    {
      stage: 'Harvest',
      stageLocal: 'కోత / तुड़ाई',
      waterNeed: 'medium',
      weather: 'hot',
      risks: [{ type: 'heat', level: 'high' }],
      action: 'Harvest when tendril near fruit dries',
      actionLocal: 'పండు దగ్గర తీగ ఎండినప్పుడు కోయండి',
      isActive: true,
      tips: ['Thump test for ripeness', 'Yellow ground spot indicates ripe', 'Harvest early morning']
    },
    offSeason('rainy'),
    offSeason('rainy'),
    offSeason('rainy'),
    offSeason('humid'),
    offSeason('dry'),
    offSeason('cool'),
    offSeason('cool'),
  ]
};

export const cucumber: CropCalendarCrop = {
  id: 'cucumber',
  name: 'Cucumber',
  nameLocal: 'దోసకాయ / खीरा',
  icon: '🥒',
  season: 'zaid',
  category: 'vegetable',
  duration: '45-60 days',
  months: [
    offSeason('cool'),
    // February
    {
      stage: 'Sowing',
      stageLocal: 'విత్తడం / बुवाई',
      waterNeed: 'medium',
      weather: 'cool',
      risks: [],
      action: 'Sow in raised beds or pits',
      actionLocal: 'బెడ్లలో లేదా గుంటల్లో విత్తండి',
      isActive: true,
      tips: ['Spacing 1.5x0.6m', 'Use organic manure', 'Mulch with straw']
    },
    // March
    {
      stage: 'Vegetative Growth',
      stageLocal: 'ఆకు పెరుగుదల / पत्ती वृद्धि',
      waterNeed: 'high',
      weather: 'hot',
      risks: [{ type: 'pest', level: 'medium' }],
      action: 'Trellising, regular watering',
      actionLocal: 'ఆధారం ఇవ్వండి, క్రమంగా నీరు',
      isActive: true,
      tips: ['Stake plants for better yield', 'Apply nitrogen fertilizer', 'Watch for beetles']
    },
    // April
    {
      stage: 'Flowering & Fruiting',
      stageLocal: 'పుష్పించే దశ / फूल और फल',
      waterNeed: 'high',
      weather: 'hot',
      risks: [{ type: 'disease', level: 'medium' }, { type: 'pest', level: 'medium' }],
      action: 'Frequent harvesting encourages yield',
      actionLocal: 'తరచుగా కోయడం దిగుబడి పెంచుతుంది',
      isActive: true,
      tips: ['Harvest every 2-3 days', 'Morning harvest best', 'Avoid waterlogging']
    },
    // May
    {
      stage: 'Final Harvest',
      stageLocal: 'చివరి కోత / अंतिम तुड़ाई',
      waterNeed: 'medium',
      weather: 'hot',
      risks: [{ type: 'heat', level: 'high' }],
      action: 'Complete harvest before heat peaks',
      actionLocal: 'వేడి పెరగకముందు పంట పూర్తి చేయండి',
      isActive: true,
      tips: ['Quality declines in extreme heat', 'Plan next crop', 'Leave few for seed']
    },
    offSeason('rainy'),
    offSeason('rainy'),
    offSeason('rainy'),
    offSeason('humid'),
    offSeason('dry'),
    offSeason('cool'),
    offSeason('cool'),
  ]
};

// PERENNIAL/PLANTATION CROPS
export const sugarcane: CropCalendarCrop = {
  id: 'sugarcane',
  name: 'Sugarcane',
  nameLocal: 'చెరకు / गन्ना',
  icon: '🎋',
  season: 'perennial',
  category: 'cash',
  duration: '10-12 months',
  months: [
    // January
    {
      stage: 'Grand Growth',
      stageLocal: 'పెద్ద పెరుగుదల / तेज वृद्धि',
      waterNeed: 'high',
      weather: 'cool',
      risks: [{ type: 'frost', level: 'low' }],
      action: 'Heavy irrigation, earthing up',
      actionLocal: 'భారీ తడి, మట్టి ఎత్తడం',
      isActive: true,
      tips: ['Irrigate every 15-20 days', 'Apply potash', 'Trashing recommended']
    },
    // February
    {
      stage: 'Planting (Spring)',
      stageLocal: 'నాటడం / बुवाई',
      waterNeed: 'high',
      weather: 'cool',
      risks: [],
      action: 'Plant setts in trenches, irrigate',
      actionLocal: 'కందకాలలో సెట్లు నాటండి',
      isActive: true,
      tips: ['Feb-March best for spring cane', '3-bud setts preferred', 'Treat setts with fungicide']
    },
    // March
    {
      stage: 'Germination',
      stageLocal: 'మొలక దశ / अंकुरण',
      waterNeed: 'high',
      weather: 'hot',
      risks: [{ type: 'pest', level: 'medium' }],
      action: 'Gap filling, first weeding',
      actionLocal: 'ఖాళీలు నింపండి, మొదటి కలుపు తీయండి',
      isActive: true,
      tips: ['Gap fill within 30 days', 'Watch for early shoot borer', 'Light irrigation']
    },
    // April
    {
      stage: 'Tillering',
      stageLocal: 'పిలక దశ / कल्ले निकलना',
      waterNeed: 'high',
      weather: 'hot',
      risks: [{ type: 'pest', level: 'high' }],
      action: 'Nitrogen application, earthing up',
      actionLocal: 'నత్రజని, మట్టి ఎత్తడం',
      isActive: true,
      tips: ['Apply urea in splits', 'Control early borer', 'First earthing up']
    },
    // May
    {
      stage: 'Tillering Continued',
      stageLocal: 'పిలక దశ కొనసాగింపు',
      waterNeed: 'high',
      weather: 'hot',
      risks: [{ type: 'drought', level: 'medium' }],
      action: 'Frequent irrigation, trash mulching',
      actionLocal: 'తరచుగా తడి, ఆకుల మల్చింగ్',
      isActive: true,
      tips: ['Trash mulch conserves moisture', 'Watch for internode borer', 'Final nitrogen dose']
    },
    // June
    {
      stage: 'Grand Growth Begins',
      stageLocal: 'పెద్ద పెరుగుదల ప్రారంభం',
      waterNeed: 'high',
      weather: 'rainy',
      risks: [{ type: 'pest', level: 'medium' }],
      action: 'Tie canes, pest management',
      actionLocal: 'చెరకులు కట్టండి, పురుగు నియంత్రణ',
      isActive: true,
      tips: ['Propping prevents lodging', 'Borer control critical', 'Reduce irrigation if rainy']
    },
    // July
    {
      stage: 'Cane Elongation',
      stageLocal: 'చెరకు పెరుగుదల',
      waterNeed: 'high',
      weather: 'rainy',
      risks: [{ type: 'flood', level: 'medium' }],
      action: 'Drainage, continue tying',
      actionLocal: 'నీరు తీయడం, కట్టడం కొనసాగించండి',
      isActive: true,
      tips: ['Avoid waterlogging', 'Second earthing up', 'Top borer control']
    },
    // August
    {
      stage: 'Rapid Growth',
      stageLocal: 'వేగవంతమైన పెరుగుదల',
      waterNeed: 'high',
      weather: 'rainy',
      risks: [{ type: 'disease', level: 'medium' }],
      action: 'Tying, disease watch',
      actionLocal: 'కట్టడం, రోగాలు గమనించండి',
      isActive: true,
      tips: ['Watch for red rot', 'Remove water shoot', 'Maximum growth period']
    },
    // September
    {
      stage: 'Growth Continues',
      stageLocal: 'పెరుగుదల కొనసాగుతుంది',
      waterNeed: 'medium',
      weather: 'humid',
      risks: [{ type: 'pest', level: 'medium' }],
      action: 'Detrashing, propping',
      actionLocal: 'ఆకులు తీయడం, ఆధారం ఇవ్వడం',
      isActive: true,
      tips: ['Remove dry leaves', 'Support heavy canes', 'Woolly aphid control']
    },
    // October
    {
      stage: 'Maturity Begins',
      stageLocal: 'పరిపక్వత ప్రారంభం',
      waterNeed: 'medium',
      weather: 'dry',
      risks: [],
      action: 'Reduce irrigation, sugar accumulation',
      actionLocal: 'తడి తగ్గించండి, చక్కెర పెరుగుతుంది',
      isActive: true,
      tips: ['Ripening chemical if needed', 'Test for brix', 'Plan harvest schedule']
    },
    // November
    {
      stage: 'Ripening',
      stageLocal: 'పక్వం అవుతోంది',
      waterNeed: 'low',
      weather: 'cool',
      risks: [],
      action: 'Withhold irrigation, field marking',
      actionLocal: 'తడి ఆపండి, పొలం గుర్తులు వేయండి',
      isActive: true,
      tips: ['Brix should be 18-20%', 'Coordinate with mill', 'Harvest mature fields first']
    },
    // December
    {
      stage: 'Harvest',
      stageLocal: 'కోత / कटाई',
      waterNeed: 'none',
      weather: 'cool',
      risks: [],
      action: 'Cut at ground level, transport to mill',
      actionLocal: 'నేల దగ్గర కోయండి, మిల్లుకు పంపండి',
      isActive: true,
      tips: ['Cut early morning', 'Crush within 24 hours', 'Keep trash for next crop']
    },
  ]
};

export const banana: CropCalendarCrop = {
  id: 'banana',
  name: 'Banana',
  nameLocal: 'అరటి / केला',
  icon: '🍌',
  season: 'perennial',
  category: 'fruit',
  duration: '11-14 months',
  months: [
    // January - Can be harvesting or growth depending on planting
    {
      stage: 'Bunch Development / Harvest',
      stageLocal: 'గెల అభివృద్ధి / गहर विकास',
      waterNeed: 'high',
      weather: 'cool',
      risks: [{ type: 'frost', level: 'low' }],
      action: 'Protect bunches, harvest mature ones',
      actionLocal: 'గెలలను రక్షించండి, పక్వమైనవి కోయండి',
      isActive: true,
      tips: ['Cover bunches in cold', 'Harvest at 75% maturity', 'Prop heavy bunches']
    },
    // February
    {
      stage: 'Planting (Spring)',
      stageLocal: 'నాటడం / रोपण',
      waterNeed: 'medium',
      weather: 'cool',
      risks: [],
      action: 'Plant suckers in pits, irrigate',
      actionLocal: 'గుంటల్లో పిల్లలు నాటండి',
      isActive: true,
      tips: ['Sword suckers best', 'Pit size 45x45x45cm', 'Apply FYM in pit']
    },
    // March
    {
      stage: 'Vegetative Growth',
      stageLocal: 'ఆకు పెరుగుదల / वनस्पति वृद्धि',
      waterNeed: 'high',
      weather: 'hot',
      risks: [{ type: 'pest', level: 'medium' }],
      action: 'Regular irrigation, nitrogen',
      actionLocal: 'క్రమంగా తడి, నత్రజని',
      isActive: true,
      tips: ['Irrigate every 4-5 days', 'Watch for rhizome weevil', 'Mulching beneficial']
    },
    // April
    {
      stage: 'Active Growth',
      stageLocal: 'చురుకైన పెరుగుదల',
      waterNeed: 'high',
      weather: 'hot',
      risks: [{ type: 'drought', level: 'medium' }, { type: 'pest', level: 'high' }],
      action: 'Heavy watering, sucker management',
      actionLocal: 'భారీ తడి, పిల్లల నిర్వహణ',
      isActive: true,
      tips: ['Remove excess suckers', 'Apply second N dose', 'Drip irrigation ideal']
    },
    // May
    {
      stage: 'Continued Growth',
      stageLocal: 'నిరంతర పెరుగుదల',
      waterNeed: 'high',
      weather: 'hot',
      risks: [{ type: 'drought', level: 'high' }],
      action: 'Never allow moisture stress',
      actionLocal: 'తేమ లోపం ఉండకూడదు',
      isActive: true,
      tips: ['Critical moisture period', 'Leaf emergence should be regular', 'Potash application']
    },
    // June
    {
      stage: 'Monsoon Growth',
      stageLocal: 'వర్షాకాల పెరుగుదల',
      waterNeed: 'medium',
      weather: 'rainy',
      risks: [{ type: 'flood', level: 'medium' }, { type: 'disease', level: 'high' }],
      action: 'Drainage, Sigatoka watch',
      actionLocal: 'నీరు తీయడం, సిగటోకా గమనించండి',
      isActive: true,
      tips: ['Good drainage essential', 'Spray for leaf spot', 'Avoid waterlogging']
    },
    // July
    {
      stage: 'Pre-flowering',
      stageLocal: 'పుష్పించడానికి ముందు',
      waterNeed: 'medium',
      weather: 'rainy',
      risks: [{ type: 'disease', level: 'medium' }],
      action: 'Prepare for flowering, propping',
      actionLocal: 'పుష్పించడానికి సిద్ధం, ఆధారం',
      isActive: true,
      tips: ['Prop heavy plants', 'Apply micronutrients', 'Control panama wilt']
    },
    // August
    {
      stage: 'Flowering',
      stageLocal: 'పుష్పించే దశ / फूल आना',
      waterNeed: 'high',
      weather: 'rainy',
      risks: [{ type: 'pest', level: 'medium' }],
      action: 'Bunch emergence, cover if needed',
      actionLocal: 'గెల బయటకు రావడం, కవర్ చేయండి',
      isActive: true,
      tips: ['Blue polythene cover for quality', 'Denaveling important', 'Spray for thrips']
    },
    // September
    {
      stage: 'Finger Development',
      stageLocal: 'పండు అభివృద్ధి',
      waterNeed: 'high',
      weather: 'humid',
      risks: [{ type: 'pest', level: 'medium' }],
      action: 'Maintain moisture, support bunches',
      actionLocal: 'తేమ నిలపండి, గెలకు ఆధారం',
      isActive: true,
      tips: ['Regular irrigation critical', 'Prop all bunches', 'Watch for scarring beetle']
    },
    // October
    {
      stage: 'Bunch Filling',
      stageLocal: 'గెల నింపుట',
      waterNeed: 'high',
      weather: 'dry',
      risks: [],
      action: 'Continue irrigation, potash',
      actionLocal: 'తడి కొనసాగించండి, పొటాష్',
      isActive: true,
      tips: ['Potash improves fruit quality', 'Maintain prop support', 'Plan harvest date']
    },
    // November
    {
      stage: 'Maturity',
      stageLocal: 'పరిపక్వత / परिपक्वता',
      waterNeed: 'medium',
      weather: 'cool',
      risks: [],
      action: 'Monitor maturity, prepare for harvest',
      actionLocal: 'పక్వం గమనించండి, కోతకు సిద్ధం',
      isActive: true,
      tips: ['Fingers should be plump', 'Cut when 80% mature', 'Careful handling']
    },
    // December
    {
      stage: 'Harvest',
      stageLocal: 'కోత / कटाई',
      waterNeed: 'low',
      weather: 'cool',
      risks: [],
      action: 'Harvest bunches, remove old plants',
      actionLocal: 'గెలలు కోయండి, పాత మొక్కలు తీయండి',
      isActive: true,
      tips: ['Use sharp knife', 'Leave ratoon if good', 'Cure before transport']
    },
  ]
};

// Export all crops
export const allCalendarCrops: CropCalendarCrop[] = [
  // Kharif
  riceKharif,
  maize,
  cotton,
  groundnut,
  // Rabi
  wheat,
  chickpea,
  mustard,
  // Zaid
  watermelon,
  cucumber,
  // Perennial
  sugarcane,
  banana,
];

// Get crops by season
export const getCropsBySeason = (season: CropCalendarCrop['season']): CropCalendarCrop[] => {
  return allCalendarCrops.filter(crop => crop.season === season);
};

// Get crops by category
export const getCropsByCategory = (category: CropCalendarCrop['category']): CropCalendarCrop[] => {
  return allCalendarCrops.filter(crop => crop.category === category);
};

// Month names
export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const monthNamesShort = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Season info for shading
export const seasonInfo = {
  kharif: {
    name: 'Kharif',
    nameLocal: 'ఖరీఫ్ / खरीफ',
    months: [5, 6, 7, 8, 9], // June to October
    colorClass: 'bg-green-500',
    bgClass: 'bg-green-50 dark:bg-green-950/30',
    borderClass: 'border-green-400',
    textClass: 'text-green-700 dark:text-green-400',
  },
  rabi: {
    name: 'Rabi',
    nameLocal: 'రబీ / रबी',
    months: [9, 10, 11, 0, 1], // October to February
    colorClass: 'bg-blue-500',
    bgClass: 'bg-blue-50 dark:bg-blue-950/30',
    borderClass: 'border-blue-400',
    textClass: 'text-blue-700 dark:text-blue-400',
  },
  zaid: {
    name: 'Zaid',
    nameLocal: 'జైద్ / जायद',
    months: [2, 3, 4], // March to May
    colorClass: 'bg-amber-500',
    bgClass: 'bg-amber-50 dark:bg-amber-950/30',
    borderClass: 'border-amber-400',
    textClass: 'text-amber-700 dark:text-amber-400',
  },
};

// Get season for a month
export const getSeasonForMonth = (monthIndex: number): 'kharif' | 'rabi' | 'zaid' => {
  if (monthIndex >= 5 && monthIndex <= 9) return 'kharif';
  if (monthIndex >= 10 || monthIndex <= 1) return 'rabi';
  return 'zaid';
};
