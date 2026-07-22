import { ExternalLink, MapPin, Building2, Clock, Briefcase } from 'lucide-react';
import Modal from '../shared/Modal';
import { formatJobDescription } from '../../utils/formatJobDescription';

const JobDetailModal = ({ job, open, onClose, onApply }) => {
  if (!job) return null;

  const formattedDescription = formatJobDescription(job.description);

  const handleApply = () => {
    if (onApply) onApply();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Job Details">
      <div className="flex flex-col gap-14">
        <div>
          <h2 className="text-[19px] font-bold text-text-primary leading-snug">
            {job.title}
          </h2>
          <div className="flex items-center gap-6 mt-4 text-text-secondary">
            <Building2 size={13} className="opacity-70" />
            <span className="text-[13px] font-medium">{job.company}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-5 px-8 py-3 bg-surface-muted rounded-chip text-[11.5px] text-text-secondary">
            <MapPin size={12} />
            {job.location}
          </div>
          <div className="flex items-center gap-5 px-8 py-3 bg-surface-muted rounded-chip text-[11.5px] text-text-secondary">
            <Clock size={12} />
            {job.postedText}
          </div>
          <div className="flex items-center gap-5 px-8 py-3 bg-brand-tint rounded-chip text-[11.5px] text-brand-primary font-semibold">
            <Briefcase size={12} />
            {job.source}
          </div>
        </div>

        <div className="border-t border-border-default/60" />

        {formattedDescription ? (
          <div className="flex flex-col gap-6">
            <h3 className="text-[13px] font-semibold text-text-primary uppercase tracking-wide">
              Description
            </h3>
            <div
              className="prose prose-sm max-w-none text-[13.5px] text-text-secondary leading-relaxed [&_ul]:list-disc [&_ul]:pl-18 [&_ul]:my-6 [&_ol]:list-decimal [&_ol]:pl-18 [&_ol]:my-6 [&_li]:my-3 [&_li]:pl-2 [&_p]:my-5 [&_strong]:text-text-primary [&_strong]:font-semibold [&_a]:text-brand-primary [&_a]:underline [&_a]:underline-offset-2 [&_h4]:text-[14px] [&_h4]:font-bold [&_h4]:text-text-primary [&_h4]:mt-8 [&_h4]:mb-3"
              dangerouslySetInnerHTML={{ __html: formattedDescription }}
            />
          </div>
        ) : (
          <div className="py-10 text-center text-[12.5px] text-text-muted bg-surface-muted rounded-card">
            Full description not available. Visit the job listing to see complete details.
          </div>
        )}

        <button
          onClick={handleApply}
          className="inline-flex items-center justify-center gap-6 px-16 py-9 bg-brand-primary text-white rounded-input text-[13px] font-semibold shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed press-scale transition-all duration-200"
        >
          Apply Now
          <ExternalLink size={13} />
        </button>
      </div>
    </Modal>
  );
};

export default JobDetailModal;
