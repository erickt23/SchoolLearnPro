import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/use-language";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useLanguage();

  const languages = [
    { code: 'fr' as const, label: 'Français', flag: '🇫🇷' },
    { code: 'ht' as const, label: 'Kreyòl', flag: '🇭🇹' },
    { code: 'en' as const, label: 'English', flag: '🇺🇸' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-white shadow-md border border-gray-200 hover:bg-gray-50 min-w-[140px]"
          >
            <Globe className="h-4 w-4 mr-2" />
            <span className="text-lg mr-2">{currentLang?.flag}</span>
            <span className="font-medium">
              {currentLang?.label}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[140px]">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => setLanguage(language.code)}
              className={`flex items-center ${currentLanguage === language.code ? "bg-accent" : ""}`}
            >
              <span className="text-lg mr-3">{language.flag}</span>
              <span className="font-medium">{language.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}