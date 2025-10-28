import { GoogleGenAI, Modality } from "@google/genai";

// Get API key from environment variable (injected at build time)
const API_KEY = import.meta.env.API_KEY || (typeof window !== 'undefined' && (window as any).GEMINI_API_KEY);

if (!API_KEY) {
  console.error("API_KEY is not set. The app will not be able to generate images.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const generateBrainrotImage = async (
  base64ImageData: string,
  mimeType: string,
  mergeObject: string,
  promptTemplate: string,
  defaultMergeObject: string
): Promise<string> => {
  if (!ai) {
    throw new Error("API key is not configured. Please check your environment variables.");
  }

  try {
    const objectToMergeWith = (mergeObject && mergeObject.trim() !== '')
      ? mergeObject.trim()
      : defaultMergeObject;

    const finalPrompt = promptTemplate.replace('{OBJECT}', objectToMergeWith);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: finalPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
        temperature: 0.9,
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const generatedMimeType = part.inlineData.mimeType;
        const generatedBase64 = part.inlineData.data;
        return `data:${generatedMimeType};base64,${generatedBase64}`;
      }
    }

    throw new Error("error.noImageGenerated");
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message === "error.noImageGenerated") {
        throw error;
    }
    throw new Error("error.generationFailed");
  }
};
