import { useState } from 'react';
import { useJobs } from '../hooks/useJobs';
import { useFCMToken } from '../hooks/useFCMToken';
import { useAuth } from '../hooks/useAuth';
import { hideAllJobs } from '../api/firestoreService';
import JobCard from '../components/jobs/JobCard';
import PermissionBanner from '../components/shared/PermissionBanner';
import EmptyState from '../components/shared/EmptyState';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Button from '../components/shared/Button';
import Modal from '../components/shared/Modal';
import { groupJobsByTime } from '../utils/groupJobsByTime';
import { Briefcase, Trash2 } from 'lucide-react';

const Home = () => {
  const { jobs, loading, error } = useJobs();
  const { permission, requestPermission } = useFCMToken();
  const { currentUser } = useAuth();
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const groups = groupJobsByTime(jobs);

  const handleClearAll = async () => {
    if (!currentUser) return;
    setClearing(true);
    try {
      await hideAllJobs(currentUser.uid);
      setClearModalOpen(false);
    } catch {
      // silent
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="flex flex-col gap-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold">Jobs</h1>
          <p className="mt-4 text-body-normal text-text-secondary">
            Live feed of detected job postings
          </p>
        </div>
        <div className="flex items-center gap-8">
          {jobs.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              className="px-6 sm:px-10"
              onClick={() => setClearModalOpen(true)}
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">Clear all</span>
            </Button>
          )}
          <span className="px-12 py-6 bg-brand-tint text-brand-primary rounded-pill text-ui-badge font-semibold">
            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
          </span>
        </div>
      </div>

      <PermissionBanner
        permission={permission}
        onRequestPermission={requestPermission}
      />

      {error && (
        <div className="p-14 bg-danger-bg border border-danger-main/20 rounded-card text-danger-main text-body-normal">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Loading jobs..." />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs yet"
          description="Jobs will appear here as they're detected by the scraper. Make sure your search alerts are set up and the backend is running."
        />
      ) : (
        <div className="flex flex-col gap-16">
          {groups.map((group) => (
            <div key={group.label} className="flex flex-col gap-10">
              <h2 className="text-ui-label font-semibold text-text-muted uppercase tracking-wider">
                {group.label}
              </h2>
              <div className="flex flex-col gap-10 animate-stagger">
                {group.jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        title="Clear All Jobs"
      >
        <div className="flex flex-col gap-16">
          <p className="text-body-normal text-text-secondary">
            This will hide all {jobs.length} jobs from your list. They won't
            appear again unless the scraper detects new postings.
          </p>
          <div className="flex justify-end gap-8">
            <Button
              variant="ghost"
              size="md"
              onClick={() => setClearModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleClearAll}
              disabled={clearing}
            >
              {clearing ? 'Clearing...' : 'Clear all jobs'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
