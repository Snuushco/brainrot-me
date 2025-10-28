// Call the serverless API endpoint instead of directly calling Gemini
export const generateBrainrotImage = async (
  base64ImageData: string,
  mimeType: string,
  mergeObject: string,
  promptTemplate: string,
  defaultMergeObject: string
): Promise<string> => {
  try {
    // Determine the API endpoint dynamically
    const apiUrl = import.meta.env.DEV 
      ? '/api/gemini'
      : `${window.location.origin}/api/gemini`;
    
    console.log('Calling API at:', apiUrl);
    
    // Create an abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    try {
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
        signal: controller.signal,
      });
    
      clearTimeout(timeoutId);

      console.log('API response status:', response.status, response.statusText);
      
      const responseClone = response.clone();
      const text = await responseClone.text();
      console.log('API response body (first 500 chars):', text.substring(0, 500));
      
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
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error("Request timeout - image generation took too long");
      }
      if (error.message === "error.noImageGenerated") {
        throw error;
      }
    }
    throw new Error("error.generationFailed");
  }
};
