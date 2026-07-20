import { useAlerts } from '../hooks/useAlerts';
import AlertCard from '../components/alerts/AlertCard';
import AlertForm from '../components/alerts/AlertForm';
import EmptyState from '../components/shared/EmptyState';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { Bell } from 'lucide-react';

const Alerts = () => {
  const { alerts, loading, error, addAlert, editAlert, removeAlert } = useAlerts();

  const handleToggle = (alertId, enabled) => {
    editAlert(alertId, { enabled });
  };

  return (
    <div className="flex flex-col gap-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold">Search Alerts</h1>
          <p className="mt-4 text-body-normal text-text-secondary">
            Manage your LinkedIn job search alerts
          </p>
        </div>
        <AlertForm onSubmit={addAlert} alertCount={alerts.length} />
      </div>

      {error && (
        <div className="p-16 bg-danger-bg border border-danger-main/20 rounded-card text-danger-main text-body-normal">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Loading alerts..." />
      ) : alerts.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No alerts yet"
          description="Create a search alert to monitor LinkedIn for new job postings. Each alert checks for jobs posted in the last 3 days."
        />
      ) : (
        <div className="flex flex-col gap-12">
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onToggle={handleToggle}
              onDelete={removeAlert}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
