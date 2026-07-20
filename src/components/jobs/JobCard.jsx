import { useState } from 'react';
import { ExternalLink, MapPin, Building2, Clock, Eye, EyeOff, Trash2, Info } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { markJobSeen, markJobUnseen, hideJob } from '../../api/firestoreService';
import JobDetailModal from './JobDetailModal';

const Dot = () => <span className="text-text-disabled text-[10px] shrink-0">·</span>;

const JobCard = ({ job }) => {
  const { currentUser } = useAuth();
  const seen = job.seen;
  const [detailOpen, setDetailOpen] = useState(false);

  const handleApply = async () => {
    if (!currentUser) return;
    await markJobSeen(currentUser.uid, job.source, job.externalJobId);
    window.open(job.jobUrl, '_blank', 'noopener,noreferrer');
  };

  const handleToggleSeen = async () => {
    if (!currentUser) return;
    if (seen) {
      await markJobUnseen(currentUser.uid, job.source, job.externalJobId);
    } else {
      await markJobSeen(currentUser.uid, job.source, job.externalJobId);
    }
  };

  const handleHide = async () => {
    if (!currentUser) return;
    await hideJob(currentUser.uid, job.source, job.externalJobId);
  };

  return (
    <>
      <div
        className={`group flex items-center gap-10 rounded-lg bg-surface-default border border-border-default px-10 py-8 transition-colors duration-150 hover:border-brand-primary/30 hover:bg-surface-muted/40 ${
          seen ? 'opacity-45' : ''
        }`}
      >
        {/* Left: all info in two tight lines, no separate footer row */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-6">
            <h3 className="text-[13.5px] font-semibold text-text-primary truncate leading-tight">
              {job.title}
            </h3>
            {seen && (
              <span className="px-4 py-0.5 bg-success-main/10 text-success-main rounded text-[9px] font-semibold uppercase tracking-wide shrink-0">
                Seen
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mt-2 text-text-secondary overflow-hidden">
            <Building2 size={11} className="shrink-0 opacity-70" />
            <span className="text-[11.5px] font-medium truncate max-w-[30%]">{job.company}</span>
            <Dot />
            <MapPin size={11} className="shrink-0 opacity-70" />
            <span className="text-[11.5px] truncate max-w-[30%]">{job.location}</span>
            <Dot />
            <Clock size={11} className="shrink-0 opacity-70" />
            <span className="text-[11.5px] whitespace-nowrap">{job.postedText}</span>
            <Dot />
            <span className="px-4 py-[1px] bg-brand-tint text-brand-primary rounded text-[9px] font-semibold uppercase tracking-wide shrink-0">
              {job.source}
            </span>
          </div>
        </div>

        {/* Right: compact actions, icon-only except Apply */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setDetailOpen(true)}
            title="View details"
            className="p-6 rounded-md text-text-muted hover:text-brand-primary hover:bg-brand-tint transition-colors"
          >
            <Info size={14} />
          </button>
          <button
            onClick={handleToggleSeen}
            title={seen ? 'Mark as unseen' : 'Mark as seen'}
            className="p-6 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors hidden sm:inline-flex"
          >
            {seen ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button
            onClick={handleHide}
            title="Hide from list"
            className="p-6 rounded-md text-text-muted hover:text-danger-main hover:bg-danger-bg transition-colors hidden sm:inline-flex"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-4 px-10 py-5 bg-brand-primary text-white rounded-md text-[12px] font-semibold shadow-sm hover:bg-brand-hover active:bg-brand-pressed transition-all duration-150"
          >
            Apply
            <ExternalLink size={11} />
          </button>
        </div>
      </div>

      <JobDetailModal
        job={job}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
};

export default JobCard;