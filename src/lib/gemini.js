import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-3.5-flash';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function generateJSON(prompt) {
  if (!GEMINI_API_KEY) {
    console.warn('[Gemini] Missing VITE_GEMINI_API_KEY');
    return null;
  }

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });

  const rawText = response.text;
  if (!rawText) {
    console.error('[Gemini] No text in response');
    return null;
  }

  const cleaned = rawText.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

export { GEMINI_MODEL };
