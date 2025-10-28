import React from 'react';
import { ImageIcon, DownloadIcon } from './IconComponents';
import { useI18n } from '../contexts/I18nContext';

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, isLoading }) => {
  const { t } = useI18n();
  
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `brainrot-${new Date().toISOString()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-lg font-bold text-brand-text-secondary text-center">{t('display.label')}</h3>
      <div className="relative group aspect-square w-full bg-brand-bg border border-brand-secondary rounded-2xl flex items-center justify-center p-2">
        {isLoading ? (
          <div className="w-full h-full bg-brand-secondary/50 rounded-lg animate-pulse-slow" />
        ) : imageUrl ? (
          <>
            <img src={imageUrl} alt={t('display.label')} className="max-w-full max-h-full object-contain rounded-lg" />
            <button
              onClick={handleDownload}
              className="absolute bottom-4 right-4 bg-brand-primary text-brand-bg p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-primary"
              aria-label={t('display.download.aria')}
            >
              <DownloadIcon className="h-6 w-6" />
            </button>
          </>
        ) : (
          <div className="text-center text-brand-text-secondary">
            <ImageIcon className="h-16 w-16 mx-auto opacity-30" />
            <p className="mt-2 text-sm">{t('display.placeholder')}</p>
          </div>
        )}
      </div>
       {!isLoading && imageUrl && (
        <button
          type="button"
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-brand-secondary text-base font-bold rounded-lg shadow-sm text-brand-text bg-brand-surface hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg focus:ring-brand-primary transition-all duration-300"
        >
          <DownloadIcon className="h-5 w-5" />
          {t('display.download')}
        </button>
      )}
    </div>
  );
};
