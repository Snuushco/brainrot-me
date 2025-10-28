import React from 'react';
import { SparklesIcon, LoadingSpinnerIcon } from './IconComponents';
import { useI18n } from '../contexts/I18nContext';

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, isLoading, disabled }) => {
  const { t } = useI18n();
  return (
    <div className="w-full mt-4">
        <label className="text-sm font-medium text-brand-text-secondary mb-2 block">{t('generate.label')}</label>
        <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-transparent text-lg font-bold rounded-lg shadow-lg text-brand-bg bg-brand-primary hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
        >
        {isLoading ? (
            <>
            <LoadingSpinnerIcon className="h-6 w-6 animate-spin-slow" />
            <span>{t('generate.button.loading')}</span>
            </>
        ) : (
            <>
            <SparklesIcon className="h-6 w-6" />
            <span>{t('generate.button.default')}</span>
            </>
        )}
        </button>
    </div>
  );
};
