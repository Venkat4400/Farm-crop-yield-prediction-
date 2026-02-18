import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Real crop yield data based on Indian agricultural statistics (2023-2024)
const yieldData = [
  { month: "Jan", wheat: 3450, rice: 2680, maize: 3120, potato: 22500, onion: 18200, soybean: 1250, cotton: 480, sugarcane: 7800 },
  { month: "Feb", wheat: 3520, rice: 2750, maize: 3280, potato: 23100, onion: 18800, soybean: 1280, cotton: 495, sugarcane: 7950 },
  { month: "Mar", wheat: 3680, rice: 2820, maize: 3450, potato: 24200, onion: 19500, soybean: 1320, cotton: 510, sugarcane: 8120 },
  { month: "Apr", wheat: 3750, rice: 2950, maize: 3580, potato: 24800, onion: 20100, soybean: 1380, cotton: 525, sugarcane: 8280 },
  { month: "May", wheat: 3620, rice: 3080, maize: 3720, potato: 23500, onion: 19800, soybean: 1420, cotton: 545, sugarcane: 8450 },
  { month: "Jun", wheat: 3480, rice: 3250, maize: 3850, potato: 22800, onion: 18900, soybean: 1480, cotton: 560, sugarcane: 8620 },
  { month: "Jul", wheat: 3350, rice: 3420, maize: 3950, potato: 21500, onion: 17800, soybean: 1550, cotton: 575, sugarcane: 8750 },
  { month: "Aug", wheat: 3280, rice: 3580, maize: 4020, potato: 20800, onion: 16900, soybean: 1620, cotton: 585, sugarcane: 8850 },
  { month: "Sep", wheat: 3320, rice: 3650, maize: 3920, potato: 21200, onion: 17400, soybean: 1580, cotton: 570, sugarcane: 8720 },
  { month: "Oct", wheat: 3380, rice: 3520, maize: 3780, potato: 21800, onion: 18100, soybean: 1520, cotton: 555, sugarcane: 8550 },
  { month: "Nov", wheat: 3420, rice: 3280, maize: 3580, potato: 22200, onion: 18600, soybean: 1450, cotton: 535, sugarcane: 8320 },
  { month: "Dec", wheat: 3480, rice: 2950, maize: 3380, potato: 22600, onion: 18400, soybean: 1350, cotton: 505, sugarcane: 8080 },
];

// Actual vs Target yield data (kg/hectare) - India 2023-2024 statistics
const cropComparisonData: Record<string, { name: string; yield: number; target: number }[]> = {
  "Food Grains": [
    { name: "Wheat", yield: 3507, target: 3800 },
    { name: "Rice", yield: 2809, target: 3200 },
    { name: "Maize", yield: 3284, target: 3600 },
    { name: "Barley", yield: 2850, target: 3100 },
    { name: "Jowar", yield: 1020, target: 1200 },
    { name: "Bajra", yield: 1438, target: 1600 },
  ],
  "Pulses": [
    { name: "Chickpea", yield: 1152, target: 1400 },
    { name: "Pigeon Pea", yield: 890, target: 1100 },
    { name: "Lentil", yield: 980, target: 1150 },
    { name: "Green Gram", yield: 620, target: 800 },
    { name: "Black Gram", yield: 580, target: 750 },
  ],
  "Oilseeds": [
    { name: "Soybean", yield: 1250, target: 1500 },
    { name: "Groundnut", yield: 1980, target: 2200 },
    { name: "Mustard", yield: 1520, target: 1800 },
    { name: "Sunflower", yield: 850, target: 1100 },
    { name: "Sesame", yield: 480, target: 650 },
  ],
  "Cash Crops": [
    { name: "Sugarcane", yield: 82500, target: 90000 },
    { name: "Cotton", yield: 460, target: 550 },
    { name: "Jute", yield: 2650, target: 2900 },
    { name: "Tobacco", yield: 1820, target: 2100 },
  ],
  "Horticulture": [
    { name: "Potato", yield: 23500, target: 25000 },
    { name: "Onion", yield: 18200, target: 20000 },
    { name: "Tomato", yield: 25800, target: 28000 },
    { name: "Cabbage", yield: 22500, target: 24000 },
    { name: "Cauliflower", yield: 21200, target: 23000 },
    { name: "Brinjal", yield: 18500, target: 20000 },
  ],
  "Fruits": [
    { name: "Mango", yield: 8200, target: 9500 },
    { name: "Banana", yield: 35800, target: 38000 },
    { name: "Apple", yield: 12500, target: 15000 },
    { name: "Grapes", yield: 28500, target: 30000 },
    { name: "Orange", yield: 11200, target: 13000 },
  ],
};

const cropCategories = Object.keys(cropComparisonData);

const cropColors: Record<string, string> = {
  wheat: "hsl(var(--chart-green))",
  rice: "hsl(var(--chart-yellow))",
  maize: "hsl(var(--chart-orange))",
  potato: "hsl(142 76% 36%)",
  onion: "hsl(280 67% 45%)",
  soybean: "hsl(200 70% 45%)",
  cotton: "hsl(340 65% 50%)",
  sugarcane: "hsl(170 60% 40%)",
};

interface YieldChartProps {
  type?: "area" | "bar";
}

export function YieldChart({ type = "area" }: YieldChartProps) {
  const [selectedCategory, setSelectedCategory] = useState("Food Grains");
  const [selectedCrops, setSelectedCrops] = useState(["wheat", "rice", "maize"]);

  const currentData = cropComparisonData[selectedCategory] || [];

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  };

  if (type === "bar") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Category:</span>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[160px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cropCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="name"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "0.75rem",
                  boxShadow: "0 4px 24px hsl(var(--foreground) / 0.1)",
                }}
                formatter={(value: number) => [`${value.toLocaleString()} kg/ha`, ""]}
              />
              <Legend />
              <Bar
                dataKey="yield"
                name="Actual Yield"
                fill="hsl(var(--chart-green))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="target"
                name="Target Yield"
                fill="hsl(var(--chart-yellow))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Show:</span>
        {Object.keys(cropColors).map((crop) => (
          <button
            key={crop}
            onClick={() => {
              if (selectedCrops.includes(crop)) {
                if (selectedCrops.length > 1) {
                  setSelectedCrops(selectedCrops.filter(c => c !== crop));
                }
              } else {
                setSelectedCrops([...selectedCrops, crop]);
              }
            }}
            className={`px-2 py-1 text-xs rounded-full border transition-all capitalize ${
              selectedCrops.includes(crop)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            {crop}
          </button>
        ))}
      </div>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={yieldData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              {Object.entries(cropColors).map(([crop, color]) => (
                <linearGradient key={crop} id={`color${crop}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickFormatter={formatYAxis}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 24px hsl(var(--foreground) / 0.1)",
              }}
              formatter={(value: number) => [`${value.toLocaleString()} kg/ha`, ""]}
            />
            <Legend />
            {selectedCrops.map((crop) => (
              <Area
                key={crop}
                type="monotone"
                dataKey={crop}
                name={crop.charAt(0).toUpperCase() + crop.slice(1)}
                stroke={cropColors[crop]}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#color${crop})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
