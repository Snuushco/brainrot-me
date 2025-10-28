import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import enTranslations from '../locales/en.json';
import nlTranslations from '../locales/nl.json';

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

// Translation mappings
const translationFiles: Record<string, Record<string, string>> = {
  en: enTranslations,
  nl: nlTranslations,
};

// Provider component
export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  const [translations, setTranslations] = useState<Record<string, string>>(translationFiles.en);

  useEffect(() => {
    // Detect browser language or get from local storage
    const savedLang = localStorage.getItem('language');
    const browserLang = navigator.language.split('-')[0];
    const initialLang = savedLang || (supportedLanguages.includes(browserLang) ? browserLang : 'en');
    setLanguageState(initialLang);
    setTranslations(translationFiles[initialLang] || translationFiles.en);
  }, []);

  useEffect(() => {
    // Update translations when language changes
    const selectedTranslations = translationFiles[language] || translationFiles.en;
    setTranslations(selectedTranslations);
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
