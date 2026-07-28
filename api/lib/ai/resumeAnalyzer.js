import { chatCompletion } from './client.js';
import { MODELS } from './models.js';
import { withRetry } from './retry.js';
import { parseAIJson } from './parser.js';

const RESUME_PROMPT = `Extract a structured candidate profile from this resume. Be precise and specific.

Resume text:
{{RESUME_TEXT}}

Return ONLY raw JSON (no markdown, no code fences) in this exact shape:
{
  "name": "full name or null",
  "title": "professional title (e.g. Full Stack Developer)",
  "yearsExperience": <number or null>,
  "level": "entry|junior|mid|senior|lead|principal|manager",
  "skills": ["Java", "Spring Boot", "React", "SQL"],
  "tools": ["Docker", "Git", "AWS"],
  "languages": ["JavaScript", "Python"],
  "frameworks": ["React", "Express"],
  "cloudSkills": ["Firebase", "AWS"],
  "preferredRoles": ["Software Engineer", "Backend Developer"],
  "avoidRoles": ["Senior", "Lead", "Manager"],
  "education": "Computer Engineering",
  "location": "Zimbabwe",
  "workPreference": "remote|hybrid|onsite|any",
  "highlights": ["2-3 key career highlights"]
}

Rules:
- level must be one of: entry, junior, mid, senior, lead, principal, manager
- workPreference must be one of: remote, hybrid, onsite, any
- yearsExperience: estimate from work history (0-2 = junior, 3-5 = mid, 6-9 = senior, 10+ = lead/principal)
- preferredRoles: roles that match their title and skills
- avoidRoles: seniority levels above their current level (a junior should avoid senior/lead/principal/manager)
- skills: core technical skills ONLY (not tools, not soft skills)
- cloudSkills: cloud platforms and services they know`;

/**
 * Analyze a resume using AI with automatic model failover.
 * Extracts a structured candidate profile ONCE — used for all future job matching.
 * @param {string} apiKey - API key (server-side only)
 * @param {string} resumeText - Extracted resume text
 * @returns {Promise<object>} - Structured candidate profile
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

      // Normalize: ensure arrays exist, level is valid, etc.
      return normalizeProfile(parsed);
    } catch (err) {
      lastError = err;
      console.warn(`[ResumeAnalyzer] Model ${model} failed: ${err.message}`);

      const status = err?.status || err?.response?.status;
      if (status === 401 || status === 403) {
        throw err;
      }
    }
  }

  throw new Error(
    `All models failed. Last error: ${lastError?.message || 'unknown'}`
  );
}

const VALID_LEVELS = ['entry', 'junior', 'mid', 'senior', 'lead', 'principal', 'manager'];
const VALID_WORK_PREF = ['remote', 'hybrid', 'onsite', 'any'];

function normalizeProfile(p) {
  return {
    name: p.name || null,
    title: p.title || null,
    yearsExperience: typeof p.yearsExperience === 'number' ? p.yearsExperience : null,
    level: VALID_LEVELS.includes(p.level) ? p.level : 'mid',
    skills: Array.isArray(p.skills) ? p.skills : [],
    tools: Array.isArray(p.tools) ? p.tools : [],
    languages: Array.isArray(p.languages) ? p.languages : [],
    frameworks: Array.isArray(p.frameworks) ? p.frameworks : [],
    cloudSkills: Array.isArray(p.cloudSkills) ? p.cloudSkills : [],
    preferredRoles: Array.isArray(p.preferredRoles) ? p.preferredRoles : [],
    avoidRoles: Array.isArray(p.avoidRoles) ? p.avoidRoles : [],
    education: p.education || null,
    location: p.location || null,
    workPreference: VALID_WORK_PREF.includes(p.workPreference) ? p.workPreference : 'any',
    highlights: Array.isArray(p.highlights) ? p.highlights : [],
  };
}
