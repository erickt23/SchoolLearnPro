import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { getTranslation, type Language, type TranslationKey } from "@/lib/i18n";

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  nextLanguage: () => void;
  t: (french: string, haitian: string, english: string) => string;
  tKey: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('fr');

  useEffect(() => {
    // Load saved language preference from localStorage
    const saved = localStorage.getItem('eduhaiti-language') as Language;
    if (saved && (saved === 'fr' || saved === 'ht' || saved === 'en')) {
      setCurrentLanguage(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('eduhaiti-language', lang);
  };

  const nextLanguage = () => {
    const languages: Language[] = ['fr', 'ht', 'en'];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const t = (french: string, haitian: string, english: string): string => {
    switch (currentLanguage) {
      case 'fr': return french;
      case 'ht': return haitian;
      case 'en': return english;
      default: return french;
    }
  };

  const tKey = (key: TranslationKey): string => {
    return getTranslation(key, currentLanguage);
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        nextLanguage,
        t,
        tKey
      }}
    >
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
