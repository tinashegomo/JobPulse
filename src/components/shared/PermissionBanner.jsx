import { Bell, BellOff } from 'lucide-react';

const PermissionBanner = ({ permission, onRequestPermission }) => {
  if (permission === 'granted') return null;

  return (
    <div className="glass-panel p-20 flex items-center gap-16 animate-slide-up border-l-4 border-l-warning-500">
      <div className="shrink-0 p-12 bg-warning-bg rounded-card">
        {permission === 'denied' ? (
          <BellOff size={24} className="text-warning-main" />
        ) : (
          <Bell size={24} className="text-warning-main" />
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-h4 font-semibold text-text-primary">
          {permission === 'denied'
            ? 'Notifications are blocked'
            : 'Enable push notifications'}
        </h3>
        <p className="mt-4 text-body-small text-text-secondary">
          {permission === 'denied'
            ? 'Please enable notifications in your browser settings to receive job alerts.'
            : 'Get notified instantly when new jobs match your search alerts.'}
        </p>
      </div>
      {permission === 'default' && (
        <button
          onClick={onRequestPermission}
          className="px-16 py-10 bg-brand-primary text-white rounded-input text-ui-label font-medium hover:bg-brand-hover transition-colors shrink-0"
        >
          Enable
        </button>
      )}
    </div>
  );
};

export default PermissionBanner;
