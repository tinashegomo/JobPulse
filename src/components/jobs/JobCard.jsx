import { ExternalLink, MapPin, Building2, Clock, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { markJobSeen, markJobUnseen, hideJob } from '../../api/firestoreService';

const JobCard = ({ job }) => {
  const { currentUser } = useAuth();
  const seen = job.seen;

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
    <div
      className={`rounded-card bg-surface-default border border-border-default shadow-elevation-2 p-20 animate-fade-in transition-opacity duration-200 ${
        seen ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-12">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-8">
            {seen && (
              <span className="px-6 py-2 bg-success-bg text-success-main rounded-chip text-ui-badge font-medium shrink-0">
                Seen
              </span>
            )}
            <h3 className="text-h4 font-semibold text-text-primary truncate">
              {job.title}
            </h3>
          </div>
          <div className="flex items-center gap-8 mt-8 text-text-secondary">
            <Building2 size={14} />
            <span className="text-body-normal">{job.company}</span>
          </div>
          <div className="flex items-center gap-8 mt-4 text-text-muted">
            <MapPin size={14} />
            <span className="text-body-small">{job.location}</span>
          </div>
          <div className="flex items-center gap-8 mt-4 text-text-muted">
            <Clock size={14} />
            <span className="text-body-small">{job.postedText}</span>
          </div>
        </div>

        <button
          onClick={handleApply}
          className="flex items-center gap-4 px-12 py-8 bg-brand-primary text-white rounded-input text-ui-label font-medium shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed press-scale transition-all duration-200 shrink-0"
        >
          <span className="hidden sm:inline">Apply</span>
          <ExternalLink size={14} />
        </button>
      </div>

      <div className="flex items-center justify-between mt-12 pt-12 border-t border-border-default">
        <div className="flex items-center gap-8">
          <span className="px-8 py-2 bg-brand-tint text-brand-primary rounded-chip text-ui-badge font-medium">
            {job.source}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleSeen}
            title={seen ? 'Mark as unseen' : 'Mark as seen'}
            className="p-6 rounded-input text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors press-scale"
          >
            {seen ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button
            onClick={handleHide}
            title="Hide from list"
            className="p-6 rounded-input text-text-muted hover:text-danger-main hover:bg-danger-bg transition-colors press-scale"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
