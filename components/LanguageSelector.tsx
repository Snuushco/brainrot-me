import React, { useState } from 'react';
import { useI18n } from '../contexts/I18nContext';

const languageOptions = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'nl', label: 'NL', flag: '🇳🇱' },
];

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const selectedLanguage = languageOptions.find(opt => opt.code === language) || languageOptions[0];

  const handleSelect = (langCode: string) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 z-10">
      <div className="relative inline-block text-left">
        <div>
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-brand-secondary shadow-sm px-4 py-2 bg-brand-surface text-sm font-medium text-brand-text hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg focus:ring-brand-primary"
            id="options-menu"
            aria-haspopup="true"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            {selectedLanguage.flag}
            <span className="ml-2 hidden sm:inline">{selectedLanguage.label}</span>
            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div
            className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-brand-surface ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="py-1" role="none">
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  onClick={() => handleSelect(option.code)}
                  className={`${
                    language === option.code ? 'bg-brand-secondary text-white' : 'text-brand-text-secondary'
                  } group flex items-center w-full px-4 py-2 text-sm hover:bg-brand-secondary hover:text-white`}
                  role="menuitem"
                >
                  <span className="mr-2">{option.flag}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
