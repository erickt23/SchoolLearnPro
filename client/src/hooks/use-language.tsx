import { createContext, ReactNode, useContext, useState, useEffect } from "react";

type Language = 'fr' | 'ht';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (french: string, haitian: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('fr');

  useEffect(() => {
    // Load saved language preference from localStorage
    const saved = localStorage.getItem('eduhaiti-language') as Language;
    if (saved && (saved === 'fr' || saved === 'ht')) {
      setCurrentLanguage(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('eduhaiti-language', lang);
  };

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'fr' ? 'ht' : 'fr';
    setLanguage(newLang);
  };

  const t = (french: string, haitian: string): string => {
    return currentLanguage === 'fr' ? french : haitian;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        toggleLanguage,
        t
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
