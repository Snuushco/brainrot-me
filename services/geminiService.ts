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
    const timeoutId = setTimeout(() => {
      console.error('Request timeout after 90 seconds');
      controller.abort();
    }, 90000); // 90 second timeout
    
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
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText.substring(0, 500));
        throw new Error("error.generationFailed");
      }

      const data = await response.json();
      console.log('API response data keys:', Object.keys(data));
      
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
