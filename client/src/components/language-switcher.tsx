import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { currentLanguage, toggleLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguage}
        className="bg-white shadow-md border border-gray-200 hover:bg-gray-50"
      >
        <Globe className="h-4 w-4 mr-2" />
        <span className="font-medium">
          {currentLanguage === 'fr' ? 'Kreyòl' : 'Français'}
        </span>
      </Button>
    </div>
  );
}
