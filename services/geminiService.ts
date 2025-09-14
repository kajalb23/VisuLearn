
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import type { ExplanationResponse } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this context, we'll alert the developer.
  console.error("API_KEY environment variable not set!");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateExplanation = async (question: string): Promise<ExplanationResponse> => {
  const model = 'gemini-2.5-flash';
  
  const fullPrompt = `${SYSTEM_PROMPT}\n\nQuestion: "${question}"`;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: fullPrompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.5,
        }
    });

    const responseText = response.text.trim();
    
    // Sometimes the model might wrap the JSON in markdown, so we strip it.
    const jsonStr = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '');

    const parsedResponse: ExplanationResponse = JSON.parse(jsonStr);

    if (!parsedResponse.text || !parsedResponse.visualization) {
        throw new Error("Invalid JSON structure received from API.");
    }
    
    return parsedResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Failed to parse the response from the AI. It might not be valid JSON.");
    }
    throw new Error("Failed to get explanation from AI. Please check your API key and network connection.");
  }
};
