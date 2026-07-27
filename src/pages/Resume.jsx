import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/shared/Button';
import { Save, CheckCircle2, FileText, Sparkles, User, Briefcase, Code, Wrench, FolderOpen, GraduationCap, MapPin } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

async function analyzeResumeWithAI(resumeText) {
  if (!GEMINI_API_KEY || !resumeText) return null;

  const prompt = `Analyze this resume/CV and extract structured information. Be thorough and specific.

Resume text:
${resumeText}

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

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const cleaned = rawText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function SummarySection({ label, icon: Icon, items, text }) {
  if ((!items || items.length === 0) && !text) return null;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-brand-primary" />
        <span className="text-[13px] font-semibold text-text-primary">{label}</span>
      </div>
      {items && items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <span key={i} className="text-[12px] font-medium px-2.5 py-1 rounded-pill bg-surface-muted text-text-secondary border border-border-default">
              {item}
            </span>
          ))}
        </div>
      )}
      {text && (
        <p className="text-[13px] text-text-secondary leading-relaxed">{text}</p>
      )}
    </div>
  );
}

export default function Resume() {
  const { currentUser } = useAuth();
  const [resumeText, setResumeText] = useState('');
  const [summary, setSummary] = useState(null);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const fetchResume = async () => {
      try {
        const snap = await getDoc(doc(db, 'resumes', currentUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          setResumeText(data.resumeText || '');
          setSummary(data.summary || null);
          if (data.updatedAt?.toDate) {
            setLastUpdated(data.updatedAt.toDate());
          }
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser || !resumeText.trim()) return;
    setSaving(true);
    setAnalyzing(true);
    try {
      const aiSummary = await analyzeResumeWithAI(resumeText.trim());

      await setDoc(doc(db, 'resumes', currentUser.uid), {
        resumeText: resumeText.trim(),
        summary: aiSummary,
        updatedAt: new Date(),
      });

      setSummary(aiSummary);
      setLastUpdated(new Date());
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // silent
    } finally {
      setSaving(false);
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-6">
      <PageHeader
        title="Resume"
        subtitle="Paste your CV for personalized job matching"
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 p-4 rounded-[12px] bg-brand-primary/5 border border-brand-primary/15">
          <FileText className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
          <p className="text-[13px] text-text-secondary leading-relaxed">
            Paste your full CV/resume below. The AI will analyze it to understand your skills,
            tools, projects, and experience — then use this to personally score how well each
            job matches your background. This never affects which jobs you see, only how
            they're sorted and filtered.
          </p>
        </div>

        {loading ? (
          <div className="h-48 rounded-[12px] bg-surface-muted animate-pulse" />
        ) : (
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your full CV here — include your skills, tools, projects, work experience, education, and any other relevant details..."
            className="w-full min-h-[280px] p-4 rounded-[12px] border border-border-default bg-surface-default text-[15px] text-text-primary placeholder:text-text-muted resize-y transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 leading-relaxed"
          />
        )}

        <div className="flex items-center justify-between gap-3">
          <div className="text-[12px] text-text-muted">
            {lastUpdated && (
              <span>Last updated: {lastUpdated.toLocaleDateString()} {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="flex items-center gap-1.5 text-[13px] text-success-main font-medium animate-slide-up">
                <CheckCircle2 className="w-4 h-4" />
                Saved
              </span>
            )}
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              disabled={saving || !resumeText.trim()}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {analyzing ? 'Analyzing...' : saving ? 'Saving...' : 'Save & Analyze'}
            </Button>
          </div>
        </div>
      </div>

      {/* AI Summary Section */}
      {summary && (
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            <h2 className="text-[16px] font-semibold text-text-primary">What the AI understood</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summary.name && (
              <div className="flex items-center gap-3 p-3 rounded-[12px] bg-surface-elevated border border-border-default">
                <User className="w-5 h-5 text-text-muted shrink-0" />
                <div>
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Name</span>
                  <p className="text-[14px] font-medium text-text-primary">{summary.name}</p>
                </div>
              </div>
            )}
            {summary.title && (
              <div className="flex items-center gap-3 p-3 rounded-[12px] bg-surface-elevated border border-border-default">
                <Briefcase className="w-5 h-5 text-text-muted shrink-0" />
                <div>
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Title</span>
                  <p className="text-[14px] font-medium text-text-primary">{summary.title}</p>
                </div>
              </div>
            )}
            {summary.location && (
              <div className="flex items-center gap-3 p-3 rounded-[12px] bg-surface-elevated border border-border-default">
                <MapPin className="w-5 h-5 text-text-muted shrink-0" />
                <div>
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Location</span>
                  <p className="text-[14px] font-medium text-text-primary">{summary.location}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 p-4 rounded-[12px] bg-surface-elevated border border-border-default">
            <SummarySection label="Skills" icon={Code} items={summary.skills} />
            <SummarySection label="Tools & Platforms" icon={Wrench} items={summary.tools} />
            <SummarySection label="Languages" icon={Code} items={summary.languages} />
            <SummarySection label="Frameworks" icon={FolderOpen} items={summary.frameworks} />
            <SummarySection label="Projects" icon={FolderOpen} items={summary.projects} />
            <SummarySection label="Experience" icon={Briefcase} text={summary.experience} />
            <SummarySection label="Education" icon={GraduationCap} text={summary.education} />
            {summary.highlights && summary.highlights.length > 0 && (
              <SummarySection label="Key Highlights" icon={Sparkles} items={summary.highlights} />
            )}
          </div>
        </div>
      )}

      {!summary && !loading && resumeText && (
        <div className="flex items-center gap-3 p-4 rounded-[12px] bg-surface-muted border border-border-default">
          <Sparkles className="w-5 h-5 text-text-muted shrink-0" />
          <p className="text-[13px] text-text-muted">
            Save your resume to see the AI analysis of your skills, tools, and experience.
          </p>
        </div>
      )}
    </div>
  );
}
