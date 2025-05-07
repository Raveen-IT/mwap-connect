
/**
 * Utility for interacting with Google's Gemini API
 */

export interface GeminiResponse {
  text: string;
  error?: string;
}

/**
 * Makes a request to the Gemini API to generate a response based on a prompt.
 * 
 * @param prompt The user's message/query
 * @returns Promise with the generated response
 */
export const getGeminiResponse = async (prompt: string): Promise<GeminiResponse> => {
  try {
    const API_KEY = "AIzaSyAPIKhdvLJPYpmRd3rcXk9SZMMpE39wjc0";
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    
    console.log("Sending request to Gemini API with prompt:", prompt);
    
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are MWAP assistant, a helpful AI that provides information for migrant workers about government schemes, benefits, and rights in India.
                
                Context: You're helping migrant workers navigate various welfare schemes, benefits, and legal protections available to them in India. Focus on providing accurate, clear, and helpful information.
                
                User query: ${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error Response:", errorText);
      
      let errorMessage = "API request failed";
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch (e) {
        console.error("Error parsing error response:", e);
      }
      
      return { 
        text: "Sorry, I'm having trouble connecting to my knowledge base. Please try again later.", 
        error: errorMessage
      };
    }

    const data = await response.json();
    console.log("Gemini API response received:", data);
    
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content?.parts?.[0]?.text) {
      return { text: data.candidates[0].content.parts[0].text };
    } else {
      console.error("Unexpected API response structure:", data);
      return { 
        text: "I apologize, but I couldn't generate a proper response. Please try rephrasing your question.", 
        error: "Invalid response format" 
      };
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return { 
      text: "Sorry, I encountered an error while processing your request. Please try again later.", 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
};
