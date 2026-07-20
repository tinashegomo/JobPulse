import { useState } from 'react';
import { ExternalLink, MapPin, Building2, Clock, Eye, EyeOff, Trash2, Info } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { markJobSeen, markJobUnseen, hideJob } from '../../api/firestoreService';
import Badge from '../shared/Badge';
import JobDetailModal from './JobDetailModal';

const SOURCE_VARIANT = {
  LINKEDIN: 'brand',
  REMOTEOK: 'info',
};

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
        className={`rounded-card bg-surface-default border border-border-default shadow-elevation-2 p-18 animate-fade-in transition-opacity duration-200 ${
          seen ? 'opacity-50' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-12">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-8">
              {seen && (
                <Badge variant="success">Seen</Badge>
              )}
              <h3 className="text-h4 font-semibold text-text-primary truncate">
                {job.title}
              </h3>
            </div>
            <div className="flex items-center gap-8 mt-6 text-text-secondary">
              <Building2 size={13} />
              <span className="text-body-normal">{job.company}</span>
            </div>
            <div className="flex items-center gap-8 mt-4 text-text-muted">
              <MapPin size={13} />
              <span className="text-body-small">{job.location}</span>
              <span className="text-text-disabled">·</span>
              <Clock size={13} />
              <span className="text-body-small">{job.postedText}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <button
              onClick={() => setDetailOpen(true)}
              title="View details"
              className="p-7 rounded-input text-text-muted hover:text-brand-primary hover:bg-brand-tint transition-colors press-scale"
            >
              <Info size={15} />
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-4 px-12 py-8 bg-brand-primary text-white rounded-input text-ui-label font-medium shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed press-scale transition-all duration-200"
            >
              <span className="hidden sm:inline">Apply</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-10 pt-10 border-t border-border-default">
          <Badge variant={SOURCE_VARIANT[job.source] || 'neutral'}>
            {job.source}
          </Badge>

          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleSeen}
              title={seen ? 'Mark as unseen' : 'Mark as seen'}
              className="p-6 rounded-input text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors press-scale"
            >
              {seen ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
            <button
              onClick={handleHide}
              title="Hide from list"
              className="p-6 rounded-input text-text-muted hover:text-danger-main hover:bg-danger-bg transition-colors press-scale"
            >
              <Trash2 size={13} />
            </button>
          </div>
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
