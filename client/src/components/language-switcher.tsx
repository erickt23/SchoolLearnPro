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
            className="bg-white shadow-md border border-gray-200 hover:bg-gray-50"
          >
            <Globe className="h-4 w-4 mr-2" />
            <span className="font-medium">
              {currentLang?.flag} {currentLang?.label}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => setLanguage(language.code)}
              className={currentLanguage === language.code ? "bg-accent" : ""}
            >
              <span className="mr-2">{language.flag}</span>
              {language.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
