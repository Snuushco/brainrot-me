// Vercel serverless function to proxy Gemini API calls
export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: any) {
  if (req.method !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { GoogleGenAI, Modality } = await import('@google/genai');
    
    const API_KEY = process.env.GEMINI_API_KEY;
    
    if (!API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured' }),
      };
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const { base64ImageData, mimeType, mergeObject, promptTemplate, defaultMergeObject } = req.body;

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
        return {
          statusCode: 200,
          body: JSON.stringify({ 
            image: `data:${generatedMimeType};base64,${generatedBase64}` 
          }),
        };
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'No image generated' }),
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Generation failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
    };
  }
}
