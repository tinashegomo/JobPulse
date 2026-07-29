import { analyzeResume } from './lib/ai/resumeAnalyzer.js';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin once
let db;
if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  if (serviceAccount.project_id) {
    initializeApp({ credential: cert(serviceAccount) });
    db = getFirestore();
  }
}

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

  const { prompt, userId } = req.body;
  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Missing prompt in request body' });
  }

  try {
    // Extract just the resume text from the prompt
    const resumeTextMatch = prompt.match(/Resume text:\n([\s\S]*?)\n\n/);
    const resumeText = resumeTextMatch ? resumeTextMatch[1].trim() : prompt;

    const profile = await analyzeResume(apiKey, resumeText);

    // Save structured profile to Firestore if userId provided
    if (userId && db) {
      await db.collection('resume_profiles').doc(userId).set({
        profile,
        updatedAt: new Date(),
      });
      console.log(`[API] Saved resume profile for user ${userId}`);
    } else if (userId && !db) {
      console.warn('[API] FIREBASE_SERVICE_ACCOUNT not set — resume_profiles NOT saved. Profile only returned to frontend.');
    }

    return res.status(200).json(profile);
  } catch (err) {
    console.error('[API] AI analysis failed:', err.message);
    return res.status(500).json({
      success: false,
      message: 'AI analysis is temporarily unavailable.',
    });
  }
}
