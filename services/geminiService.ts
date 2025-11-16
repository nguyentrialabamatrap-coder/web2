
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateArticleContent = async (title: string): Promise<string> => {
  if (!title.trim()) {
    throw new Error("Title cannot be empty.");
  }
  
  const prompt = `Write a compelling and informative crypto news article about "${title}". The article should be well-structured with a clear introduction, a detailed body discussing the key points, and a concluding summary. Use markdown for formatting, including headings, bold text, and bullet points where appropriate. The tone should be professional and suitable for crypto enthusiasts and investors.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini API:", error);
    throw new Error("Failed to generate article content. Please check your API key and try again.");
  }
};
