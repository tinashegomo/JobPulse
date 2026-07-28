import { chatCompletion } from './client.js';
import { MODELS } from './models.js';
import { withRetry } from './retry.js';
import { parseAIJson } from './parser.js';

const RESUME_PROMPT = `Analyze this resume/CV and extract structured information. Be thorough and specific.

Resume text:
{{RESUME_TEXT}}

Extract the following in ONLY raw JSON (no markdown, no code fences):
{
  "name": "full name or null",
  "title": "professional title (e.g. Full Stack Developer)",
  "skills": ["list of key technical skills"],
  "tools": ["list of tools and platforms used"],
  "languages": ["programming languages"],
  "frameworks": ["frameworks and libraries"],
  "projects": ["notable projects with brief descriptions"],
  "experience": "summary of work experience (2-3 sentences)",
  "education": "education details",
  "location": "location if mentioned",
  "highlights": ["2-3 key career highlights or achievements"]
}`;

/**
 * Analyze a resume using AI with automatic model failover.
 * Tries models in order; returns first successful result.
 * @param {string} apiKey - API key (server-side only)
 * @param {string} resumeText - Extracted resume text
 * @returns {Promise<object>} - Structured resume data
 * @throws {Error} - If all models fail
 */
export async function analyzeResume(apiKey, resumeText) {
  const prompt = RESUME_PROMPT.replace('{{RESUME_TEXT}}', resumeText);

  let lastError;

  for (const model of MODELS) {
    try {
      console.log(`[ResumeAnalyzer] Trying model: ${model}`);

      const rawText = await withRetry(
        () => chatCompletion({ apiKey, model, prompt }),
        `ResumeAnalyzer:${model}`
      );

      if (!rawText) {
        throw new Error('Empty response from model');
      }

      const parsed = parseAIJson(rawText);
      console.log(`[ResumeAnalyzer] Success with model: ${model}`);
      return parsed;
    } catch (err) {
      lastError = err;
      console.warn(`[ResumeAnalyzer] Model ${model} failed: ${err.message}`);

      // If not retryable (e.g. invalid API key), fail immediately
      const status = err?.status || err?.response?.status;
      if (status === 401 || status === 403) {
        throw err;
      }

      // Continue to next model
    }
  }

  throw new Error(
    `All models failed. Last error: ${lastError?.message || 'unknown'}`
  );
}
