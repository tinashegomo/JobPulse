import { Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const WORK_TYPE_STYLES = {
  remote: 'bg-success-main/15 text-success-main',
  hybrid: 'bg-info-main/15 text-info-main',
  'on-site': 'bg-warning-main/15 text-warning-main',
};

const WORK_TYPE_LABELS = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  'on-site': 'On-site',
};

const AlertCard = ({ alert, onToggle, onDelete }) => {
  return (
    <div className="glass-panel p-20 animate-fade-in">
      <div className="flex items-start justify-between gap-12">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-8 flex-wrap">
            <h3 className="text-h4 font-semibold text-text-primary">
              {alert.label}
            </h3>
            {alert.workType && (
              <span
                className={`px-8 py-2 rounded-chip text-ui-badge font-medium ${WORK_TYPE_STYLES[alert.workType] || ''}`}
              >
                {WORK_TYPE_LABELS[alert.workType] || alert.workType}
              </span>
            )}
          </div>
          {alert.keyword && (
            <p className="mt-8 text-body-normal text-text-secondary">
              Keyword: <span className="font-medium text-text-primary">{alert.keyword}</span>
            </p>
          )}
          {alert.location && (
            <p className="mt-4 text-body-small text-text-muted">
              Location: {alert.location}
            </p>
          )}
        </div>

        <div className="flex items-center gap-8 shrink-0">
          <button
            onClick={() => onToggle(alert.id, !alert.enabled)}
            className="p-8 rounded-input hover:bg-surface-muted transition-colors"
            title={alert.enabled ? 'Disable alert' : 'Enable alert'}
          >
            {alert.enabled ? (
              <ToggleRight size={24} className="text-success-main" />
            ) : (
              <ToggleLeft size={24} className="text-text-disabled" />
            )}
          </button>
          <button
            onClick={() => onDelete(alert.id)}
            className="p-8 rounded-input hover:bg-danger-bg transition-colors"
            title="Delete alert"
          >
            <Trash2 size={18} className="text-danger-main" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
