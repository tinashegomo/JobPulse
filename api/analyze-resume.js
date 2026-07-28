import { GoogleGenAI } from '@google/genai';

const GEMINI_MODEL = 'gemini-3.5-flash';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[API] GEMINI_API_KEY not set on server');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt in request body' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    const rawText = response.text;
    if (!rawText) {
      console.error('[API] Gemini returned no text');
      return res.status(500).json({ error: 'No response from AI' });
    }

    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('[API] Gemini error:', err.message);
    return res.status(500).json({ error: 'AI analysis failed' });
  }
}
