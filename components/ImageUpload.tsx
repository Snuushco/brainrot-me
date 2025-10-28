import React, { useRef } from 'react';
import { UploadIcon } from './IconComponents';
import { useI18n } from '../contexts/I18nContext';

interface ImageUploadProps {
  onImageUpload: (base64: string, mimeType: string) => void;
  previewUrl: string | null;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const match = result.match(/^data:(.+);base64,(.+)$/);
        if (match) {
            onImageUpload(match[2], match[1]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label htmlFor="file-upload" className="text-sm font-medium text-brand-text-secondary mb-2 block">{t('upload.label')}</label>
      <div
        onClick={handleAreaClick}
        className="relative flex justify-center items-center w-full h-64 bg-brand-bg border-2 border-dashed border-brand-secondary rounded-lg cursor-pointer hover:border-brand-primary transition-colors duration-300 group"
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" />
        ) : (
          <div className="text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-brand-text-secondary group-hover:text-brand-primary transition-colors duration-300" />
            <p className="mt-2 text-sm text-brand-text-secondary">
              <span className="font-semibold text-brand-primary">{t('upload.cta')}</span> {t('upload.drag')}
            </p>
            <p className="text-xs text-brand-text-secondary/70">{t('upload.formats')}</p>
          </div>
        )}
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/gif, image/webp"
        />
      </div>
    </div>
  );
};
