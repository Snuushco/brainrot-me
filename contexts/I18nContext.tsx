import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Define the shape of the context
interface I18nContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  translations: Record<string, string>;
}

// Create the context with a default value
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Available languages
const supportedLanguages = ['en', 'nl'];

// Provider component
export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    // Detect browser language or get from local storage
    const savedLang = localStorage.getItem('language');
    const browserLang = navigator.language.split('-')[0];
    const initialLang = savedLang || (supportedLanguages.includes(browserLang) ? browserLang : 'en');
    setLanguageState(initialLang);
  }, []);

  useEffect(() => {
    // Load translations when language changes
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`/locales/${language}.json`);
        if (!response.ok) {
            // Fallback to English if the language file is not found
            console.warn(`Translation file for '${language}' not found, falling back to 'en'.`);
            const fallbackResponse = await fetch(`/locales/en.json`);
            const data = await fallbackResponse.json();
            setTranslations(data);
            return;
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to English on error
        try {
            const fallbackResponse = await fetch(`/locales/en.json`);
            const data = await fallbackResponse.json();
            setTranslations(data);
        } catch(e) {
            console.error('Failed to load fallback translations', e);
        }
      }
    };

    fetchTranslations();
  }, [language]);

  const setLanguage = (lang: string) => {
    if (supportedLanguages.includes(lang)) {
      localStorage.setItem('language', lang);
      setLanguageState(lang);
    }
  };

  // Translation function
  const t = (key: string): string => {
    return translations[key] || key;
  };

  const value = { language, setLanguage, t, translations };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

// Custom hook to use the context
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
