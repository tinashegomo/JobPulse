import { Trash2, ToggleLeft, ToggleRight, MapPin, Bookmark } from 'lucide-react';

const WORK_TYPE_STYLES = {
  remote: 'bg-success-main/10 text-success-main',
  hybrid: 'bg-info-main/10 text-info-main',
  'on-site': 'bg-warning-main/10 text-warning-main',
};

const WORK_TYPE_LABELS = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  'on-site': 'On-site',
};

const Dot = () => <span className="text-text-disabled text-[10px] shrink-0">·</span>;

const AlertCard = ({ alert, onToggle, onDelete }) => {
  return (
    <div className="group flex items-center gap-10 rounded-lg bg-surface-default border border-border-default px-10 py-8 transition-colors duration-150 hover:border-brand-primary/30 hover:bg-surface-muted/40">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-6">
          <h3 className="text-[13.5px] font-semibold text-text-primary truncate leading-tight">
            {alert.label}
          </h3>
          {alert.workType && (
            <span
              className={`px-4 py-[1px] rounded text-[9px] font-semibold uppercase tracking-wide shrink-0 ${WORK_TYPE_STYLES[alert.workType] || ''}`}
            >
              {WORK_TYPE_LABELS[alert.workType] || alert.workType}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 mt-2 text-text-secondary overflow-hidden">
          {alert.keyword && (
            <>
              <Bookmark size={11} className="shrink-0 opacity-70" />
              <span className="text-[11.5px] font-medium truncate max-w-[40%]">{alert.keyword}</span>
            </>
          )}
          {alert.keyword && alert.location && <Dot />}
          {alert.location && (
            <>
              <MapPin size={11} className="shrink-0 opacity-70" />
              <span className="text-[11.5px] truncate max-w-[40%]">{alert.location}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onToggle(alert.id, !alert.enabled)}
          className="p-6 rounded-md hover:bg-surface-muted transition-colors"
          title={alert.enabled ? 'Disable alert' : 'Enable alert'}
        >
          {alert.enabled ? (
            <ToggleRight size={18} className="text-success-main" />
          ) : (
            <ToggleLeft size={18} className="text-text-disabled" />
          )}
        </button>
        <button
          onClick={() => onDelete(alert.id)}
          className="p-6 rounded-md hover:bg-danger-bg transition-colors"
          title="Delete alert"
        >
          <Trash2 size={14} className="text-danger-main" />
        </button>
      </div>
    </div>
  );
};

export default AlertCard;
