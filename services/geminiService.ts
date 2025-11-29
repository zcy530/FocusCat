import { GoogleGenAI } from "@google/genai";
import { PetState } from '../types';

// Initialize Gemini
// Note: In a real app, ensure process.env.API_KEY is defined. 
// For this demo, we assume the environment is set up correctly as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePetThought = async (pet: PetState, context: string): Promise<string> => {
  try {
    const prompt = `
      You are a cute virtual cat named ${pet.name}. 
      Your stats are: Hunger ${pet.hunger}/100, Happiness ${pet.happiness}/100, Health ${pet.health}/100.
      Current Context: ${context}.
      
      Write a very short, cute, one-sentence thought or reaction (max 10 words). 
      Act like a cute cat (meowing, purring, asking for treats). 
      Do not include quotes.
      Use emojis if appropriate.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Meow? (I'm thinking...)";
  }
};
