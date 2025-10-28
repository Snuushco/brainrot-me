import React from 'react';
import { useI18n } from '../contexts/I18nContext';

interface PromptInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, isLoading }) => {
  const { t } = useI18n();
  return (
    <div className="w-full">
      <label htmlFor="prompt" className="text-sm font-medium text-brand-text-secondary mb-2 block">{t('prompt.label')}</label>
      <input
        id="prompt"
        name="prompt"
        type="text"
        className="w-full bg-brand-bg border border-brand-secondary rounded-lg p-3 text-brand-text focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-300 placeholder:text-brand-text-secondary/50 disabled:opacity-50"
        placeholder={t('prompt.placeholder')}
        value={value}
        onChange={onChange}
        disabled={isLoading}
      />
    </div>
  );
};
