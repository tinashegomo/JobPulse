import { useState } from 'react';
import { ExternalLink, MapPin, Building2, Clock, Eye, EyeOff, Trash2, Info } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { markJobSeen, markJobUnseen, hideJob } from '../../api/firestoreService';
import JobDetailModal from './JobDetailModal';

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
        className={`flex items-center gap-8 sm:gap-10 rounded-lg bg-surface-default border border-border-default px-8 py-8 sm:px-12 sm:py-10 transition-colors duration-150 hover:border-brand-primary/30 hover:bg-surface-muted/40 ${
          seen ? 'opacity-45' : ''
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 min-w-0">
            <h3 className="text-[13px] sm:text-[13.5px] font-semibold text-text-primary truncate leading-tight min-w-0">
              {job.title}
            </h3>
            {seen && (
              <span className="px-4 py-[1px] bg-success-main/10 text-success-main rounded text-[8px] sm:text-[9px] font-semibold uppercase tracking-wide shrink-0">
                Seen
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mt-2 text-text-secondary min-w-0 overflow-hidden">
            <Building2 size={10} className="shrink-0 opacity-60" />
            <span className="text-[10.5px] sm:text-[11px] font-medium truncate min-w-0">{job.company}</span>
            <span className="text-text-disabled text-[9px] shrink-0">·</span>
            <MapPin size={10} className="shrink-0 opacity-60" />
            <span className="text-[10.5px] sm:text-[11px] truncate min-w-0">{job.location}</span>
            <span className="text-text-disabled text-[9px] shrink-0">·</span>
            <Clock size={10} className="shrink-0 opacity-60" />
            <span className="text-[10.5px] sm:text-[11px] whitespace-nowrap shrink-0">{job.postedText}</span>
            <span className="px-4 py-[1px] bg-brand-tint text-brand-primary rounded text-[8px] sm:text-[9px] font-semibold uppercase tracking-wide shrink-0 hidden sm:inline">
              {job.source}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-8 shrink-0">
          <button
            onClick={() => setDetailOpen(true)}
            title="View details"
            className="p-4 sm:p-8 rounded-md text-text-muted hover:text-brand-primary hover:bg-brand-tint transition-colors"
          >
            <Info size={13} />
          </button>
          <button
            onClick={handleToggleSeen}
            title={seen ? 'Mark as unseen' : 'Mark as seen'}
            className="p-4 sm:p-8 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors hidden sm:inline-flex"
          >
            {seen ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
          <button
            onClick={handleHide}
            title="Hide from list"
            className="p-4 sm:p-8 rounded-md text-text-muted hover:text-danger-main hover:bg-danger-bg transition-colors hidden sm:inline-flex"
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-4 px-8 sm:px-12 py-4 sm:py-8 bg-brand-primary text-white rounded-md text-[11px] sm:text-[12px] font-semibold shadow-sm hover:bg-brand-hover active:bg-brand-pressed transition-all duration-150"
          >
            Apply
            <ExternalLink size={10} />
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
