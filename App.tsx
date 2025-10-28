import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { PromptInput } from './components/PromptInput';
import { GenerateButton } from './components/GenerateButton';
import { ImageDisplay } from './components/ImageDisplay';
import { generateBrainrotImage } from './services/geminiService';
import { useI18n } from './contexts/I18nContext';
import { LanguageSelector } from './components/LanguageSelector';


interface ImageData {
  base64: string;
  mimeType: string;
}

function App() {
  const { t, translations } = useI18n();
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [mergeObject, setMergeObject] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((base64: string, mimeType: string) => {
    setOriginalImage({ base64, mimeType });
    setGeneratedImage(null);
    setError(null);
  }, []);

  const handleGenerate = async () => {
    if (!originalImage) {
      setError(t('error.uploadFirst'));
      return;
    }
    if (!translations['gemini.prompt.base']) {
        // Translations not loaded yet, prevent running
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateBrainrotImage(
        originalImage.base64, 
        originalImage.mimeType, 
        mergeObject,
        t('gemini.prompt.base'),
        t('gemini.prompt.defaultObject')
      );
      setGeneratedImage(result);
    } catch (err) {
      console.error(err);
      const errorMessage = (err instanceof Error && err.message) ? t(err.message) : t('error.unknown');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 font-sans">
      <LanguageSelector />
      <Header />
      <main className="flex-grow container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Input Column */}
        <div className="flex flex-col gap-6 p-6 bg-brand-surface rounded-2xl border border-brand-secondary">
          <ImageUpload onImageUpload={handleImageUpload} previewUrl={originalImage ? `data:${originalImage.mimeType};base64,${originalImage.base64}` : null} />
          <PromptInput
            value={mergeObject}
            onChange={(e) => setMergeObject(e.target.value)}
            isLoading={isLoading}
          />
          <GenerateButton
            onClick={handleGenerate}
            isLoading={isLoading}
            disabled={!originalImage || isLoading}
          />
          {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center">{error}</div>}
        </div>

        {/* Output Column */}
        <div className="flex flex-col items-center justify-center p-6 bg-brand-surface rounded-2xl border border-brand-secondary">
          <ImageDisplay
            imageUrl={generatedImage}
            isLoading={isLoading}
          />
        </div>
      </main>
      <footer className="text-center p-4 mt-8 text-brand-text-secondary text-sm">
        {t('footer.poweredBy')}
      </footer>
    </div>
  );
}

export default App;
