import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
];

export function LanguageSelector({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={(v) => setLanguage(v as "en" | "te" | "hi")}>
      <SelectTrigger className={`w-[130px] ${className}`}>
        <Globe className="h-4 w-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2">
              <span>{lang.nativeName}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
