import { Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import Badge from '../shared/Badge';

const WORK_TYPE_VARIANT = {
  remote: 'success',
  hybrid: 'info',
  'on-site': 'warning',
};

const WORK_TYPE_LABELS = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  'on-site': 'On-site',
};

const AlertCard = ({ alert, onToggle, onDelete }) => {
  return (
    <div className="glass-panel p-18 animate-fade-in">
      <div className="flex items-start justify-between gap-12">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-8 flex-wrap">
            <h3 className="text-h4 font-semibold text-text-primary">
              {alert.label}
            </h3>
            {alert.workType && (
              <Badge variant={WORK_TYPE_VARIANT[alert.workType] || 'neutral'}>
                {WORK_TYPE_LABELS[alert.workType] || alert.workType}
              </Badge>
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

        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={() => onToggle(alert.id, !alert.enabled)}
            className="p-7 rounded-input hover:bg-surface-muted transition-colors press-scale"
            title={alert.enabled ? 'Disable alert' : 'Enable alert'}
          >
            {alert.enabled ? (
              <ToggleRight size={22} className="text-success-main" />
            ) : (
              <ToggleLeft size={22} className="text-text-disabled" />
            )}
          </button>
          <button
            onClick={() => onDelete(alert.id)}
            className="p-7 rounded-input hover:bg-danger-bg transition-colors press-scale"
            title="Delete alert"
          >
            <Trash2 size={16} className="text-danger-main" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
