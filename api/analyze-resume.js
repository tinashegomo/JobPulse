import { analyzeResume } from './lib/ai/resumeAnalyzer.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const apiKey = process.env.OPENCODE_API_KEY;
  if (!apiKey) {
    console.error('[API] OPENCODE_API_KEY not set on server');
    return res.status(500).json({
      success: false,
      message: 'AI service is not configured.',
    });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Missing prompt in request body' });
  }

  try {
    // prompt contains the full resume text wrapped in the analysis prompt
    // We extract just the resume text from the prompt for the analyzer
    const resumeTextMatch = prompt.match(/Resume text:\n([\s\S]*?)\n\nExtract/);
    const resumeText = resumeTextMatch ? resumeTextMatch[1].trim() : prompt;

    const result = await analyzeResume(apiKey, resumeText);

    return res.status(200).json(result);
  } catch (err) {
    console.error('[API] AI analysis failed:', err.message);
    return res.status(500).json({
      success: false,
      message: 'AI analysis is temporarily unavailable.',
    });
  }
}
