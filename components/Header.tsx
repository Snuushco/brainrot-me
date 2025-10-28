import React from 'react';
import { useI18n } from '../contexts/I18nContext';

export const Header: React.FC = () => {
  const { t } = useI18n();
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-brand-primary to-cyan-400">
          {t('header.title.1')}
        </span> {t('header.title.2')}
      </h1>
      <p className="mt-3 max-w-2xl mx-auto text-lg text-brand-text-secondary">
        {t('header.subtitle')}
      </p>
    </header>
  );
};
