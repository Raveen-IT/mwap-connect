import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoadingPage } from '@/components/ui/loading-page';

// Define supported languages
export type Language = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr' | 'gu';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

// Language options (supporting major Indian languages)
export const languageOptions: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' }
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Add an alias for useLanguage as useTranslation for backward compatibility
export const useTranslation = useLanguage;

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Get saved language or default to English
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang || 'en';
  });
  
  // Translations object
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
    // Load translations for the selected language
    loadTranslations(language);
  }, [language]);

  // Load translations for the selected language
  const loadTranslations = async (lang: Language) => {
    setIsLoading(true);
    try {
      // Dynamically import the translation file
      const translationModule = await import(`../translations/${lang}.json`);
      setTranslations(prevTranslations => ({
        ...prevTranslations,
        [lang]: translationModule.default
      }));
    } catch (error) {
      console.error(`Failed to load translations for ${lang}`, error);
      // Fall back to English if translations cannot be loaded
      if (lang !== 'en') {
        setLanguage('en');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Translation function
  const t = (key: string): string => {
    if (isLoading || !translations[language]) {
      return key; // Return key as fallback while loading
    }
    
    return translations[language][key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {isLoading && <LoadingPage message="Changing language..." />}
      {children}
    </LanguageContext.Provider>
  );
};
