
import { GoogleGenAI, Type } from "@google/genai";

// Always use process.env.API_KEY directly as a named parameter in the constructor
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const explainConcept = async (concept: 'token' | 'context' | 'both') => {
  const ai = getAIClient();
  const prompt = `Explain the concept of ${concept} in the field of Large Language Models (LLMs). 
  Provide a structured JSON response with fields: definition, analogy, and importance. 
  Keep it professional yet accessible.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            definition: { type: Type.STRING },
            analogy: { type: Type.STRING },
            importance: { type: Type.STRING },
          },
          propertyOrdering: ["definition", "analogy", "importance"]
        }
      }
    });
    // Use .text property directly
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error fetching explanation:", error);
    return null;
  }
};

export const simulateTokenization = async (text: string) => {
  const ai = getAIClient();
  const prompt = `Tokenize the following text as an LLM would. Return a JSON array of strings, where each string is a "token". 
  Text: "${text}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    // Use .text property directly
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error tokenizing:", error);
    return [];
  }
};
