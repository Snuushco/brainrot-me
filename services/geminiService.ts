// Call the serverless API endpoint instead of directly calling Gemini
export const generateBrainrotImage = async (
  base64ImageData: string,
  mimeType: string,
  mergeObject: string,
  promptTemplate: string,
  defaultMergeObject: string
): Promise<string> => {
  try {
    // Determine the API endpoint
    const apiUrl = import.meta.env.DEV 
      ? '/api/gemini'
      : 'https://brainrot-me.vercel.app/api/gemini';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64ImageData,
        mimeType,
        mergeObject,
        promptTemplate,
        defaultMergeObject,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      throw new Error(errorData.error || "error.generationFailed");
    }

    const data = await response.json();
    
    if (!data.image) {
      throw new Error("error.noImageGenerated");
    }

    return data.image;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message === "error.noImageGenerated") {
        throw error;
    }
    throw new Error("error.generationFailed");
  }
};
