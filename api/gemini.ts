// Vercel serverless function to proxy Gemini API calls
export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: any) {
  console.log('API called with method:', req.method);
  
  if (req.method !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    
    if (!API_KEY) {
      console.error('API key not configured');
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'API key not configured' }),
      };
    }

    console.log('API key found, processing request...');

    const { base64ImageData, mimeType, mergeObject, promptTemplate, defaultMergeObject } = req.body;

    const objectToMergeWith = (mergeObject && mergeObject.trim() !== '')
      ? mergeObject.trim()
      : defaultMergeObject;

    const finalPrompt = promptTemplate.replace('{OBJECT}', objectToMergeWith);

    console.log('Calling Gemini API with model: gemini-2.0-flash-exp');
    console.log('Image size:', base64ImageData.length, 'characters');
    console.log('Prompt length:', finalPrompt.length, 'characters');
    
    // Call Gemini API directly via REST
    try {
      const apiResponse = await Promise.race([
        fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      inlineData: {
                        mimeType: mimeType,
                        data: base64ImageData,
                      },
                    },
                    {
                      text: finalPrompt,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.9,
              },
            }),
          }
        ),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Gemini API timeout after 80 seconds')), 80000)
        )
      ]);
      
      const response = await apiResponse as Response;
      console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'API request failed',
          details: errorText 
        }),
      };
    }

    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'Gemini API request failed', 
          details: fetchError instanceof Error ? fetchError.message : 'Unknown error'
        }),
      };
    }

    const result = await response.json();
    console.log('Gemini API response received:', JSON.stringify(result).substring(0, 500));

    // Extract image data from response
    const candidates = result.candidates;
    if (!candidates || candidates.length === 0) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No candidates returned' }),
      };
    }

    const parts = candidates[0].content?.parts;
    if (!parts) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No parts in response' }),
      };
    }

    for (const part of parts) {
      if (part.inlineData) {
        const generatedMimeType = part.inlineData.mimeType;
        const generatedBase64 = part.inlineData.data;
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            image: `data:${generatedMimeType};base64,${generatedBase64}` 
          }),
        };
      }
    }

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'No image data in response' }),
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Generation failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
    };
  }
}
