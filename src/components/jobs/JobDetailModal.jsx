import { ExternalLink, MapPin, Building2, Clock, Briefcase } from 'lucide-react';
import Modal from '../shared/Modal';

const JobDetailModal = ({ job, open, onClose }) => {
  if (!job) return null;

  return (
    <Modal open={open} onClose={onClose} title="Job Details">
      <div className="flex flex-col gap-16">
        <div>
          <h2 className="text-h2 font-bold text-text-primary">{job.title}</h2>
          <div className="flex items-center gap-8 mt-8 text-text-secondary">
            <Building2 size={15} />
            <span className="text-body-normal font-medium">{job.company}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-8">
          <div className="flex items-center gap-6 px-10 py-4 bg-surface-muted rounded-chip text-body-small text-text-secondary">
            <MapPin size={13} />
            {job.location}
          </div>
          <div className="flex items-center gap-6 px-10 py-4 bg-surface-muted rounded-chip text-body-small text-text-secondary">
            <Clock size={13} />
            {job.postedText}
          </div>
          <div className="flex items-center gap-6 px-10 py-4 bg-brand-tint rounded-chip text-body-small text-brand-primary font-medium">
            <Briefcase size={13} />
            {job.source}
          </div>
        </div>

        {job.description && (
          <div className="flex flex-col gap-8">
            <h3 className="text-h4 font-semibold text-text-primary">Description</h3>
            <div
              className="prose prose-sm max-w-none text-body-normal text-text-secondary leading-relaxed [&_ul]:list-disc [&_ul]:pl-20 [&_ul]:my-8 [&_ol]:list-decimal [&_ol]:pl-20 [&_ol]:my-8 [&_li]:my-4 [&_p]:my-6 [&_strong]:text-text-primary [&_strong]:font-semibold [&_a]:text-brand-primary [&_a]:underline [&_a]:underline-offset-2 [&_h1]:text-h3 [&_h1]:font-bold [&_h1]:my-8 [&_h2]:text-h4 [&_h2]:font-semibold [&_h2]:my-6 [&_h3]:text-body-normal [&_h3]:font-semibold [&_h3]:my-4"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>
        )}

        {!job.description && (
          <div className="py-12 text-center text-body-normal text-text-muted bg-surface-muted rounded-card">
            Full description not available. Visit the job listing to see complete details.
          </div>
        )}

        <a
          href={job.jobUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-6 px-16 py-10 bg-brand-primary text-white rounded-input text-ui-label font-semibold shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed press-scale transition-all duration-200"
        >
          Apply Now
          <ExternalLink size={14} />
        </a>
      </div>
    </Modal>
  );
};

export default JobDetailModal;
