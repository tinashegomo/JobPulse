import { useJobs } from '../hooks/useJobs';
import { useFCMToken } from '../hooks/useFCMToken';
import JobCard from '../components/jobs/JobCard';
import PermissionBanner from '../components/shared/PermissionBanner';
import EmptyState from '../components/shared/EmptyState';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { groupJobsByTime } from '../utils/groupJobsByTime';
import { Briefcase } from 'lucide-react';

const Home = () => {
  const { jobs, loading, error } = useJobs();
  const { permission, requestPermission } = useFCMToken();
  const groups = groupJobsByTime(jobs);

  return (
    <div className="flex flex-col gap-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold">Jobs</h1>
          <p className="mt-4 text-body-normal text-text-secondary">
            Live feed of detected job postings
          </p>
        </div>
        <span className="px-12 py-6 bg-brand-tint text-brand-primary rounded-pill text-ui-badge font-semibold">
          {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
        </span>
      </div>

      <PermissionBanner
        permission={permission}
        onRequestPermission={requestPermission}
      />

      {error && (
        <div className="p-16 bg-danger-bg border border-danger-main/20 rounded-card text-danger-main text-body-normal">
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
        <div className="flex flex-col gap-32">
          {groups.map((group) => (
            <div key={group.label} className="flex flex-col gap-12">
              <h2 className="text-ui-label font-semibold text-text-muted uppercase tracking-wider">
                {group.label}
              </h2>
              {group.jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
