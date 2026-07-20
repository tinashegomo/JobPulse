import { useState } from 'react';
import { Plus, X, AlertTriangle } from 'lucide-react';
import { buildLinkedInSearchUrl } from '../../utils/buildLinkedInSearchUrl';
import CountrySelect from '../shared/CountrySelect';

const ALERT_LIMIT = 20;

const AlertForm = ({ onSubmit, alertCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [workType, setWorkType] = useState('remote');

  const atLimit = alertCount >= ALERT_LIMIT;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim() || atLimit) return;

    const label = location
      ? `${keyword.trim()} - ${location}`
      : keyword.trim();

    const searchUrl = buildLinkedInSearchUrl({
      keyword: keyword.trim(),
      location,
      workType,
    });

    onSubmit({
      label,
      keyword: keyword.trim(),
      location: location || null,
      workType,
      searchUrl,
    });

    setKeyword('');
    setLocation('');
    setWorkType('remote');
    setIsOpen(false);
  };

  const inputBase =
    'w-full rounded-input border bg-surface-elevated px-16 py-12 text-body-normal text-text-primary placeholder:text-text-muted outline-none transition-all duration-200';
  const inputOk =
    'border-border-default focus:border-border-focus focus-ring';

  return (
    <div className="flex flex-col gap-8">
      {atLimit && !isOpen && (
        <div className="flex items-center gap-8 px-16 py-12 rounded-card bg-amber-50 border border-amber-200 text-amber-800 text-body-normal">
          <AlertTriangle size={18} className="shrink-0" />
          <span>
            You've reached the maximum of {ALERT_LIMIT} alerts. Delete an existing alert to create a new one.
          </span>
        </div>
      )}

      {!isOpen ? (
        <button
          onClick={() => !atLimit && setIsOpen(true)}
          disabled={atLimit}
          className={`flex items-center gap-8 rounded-input px-16 py-8 text-sm font-semibold transition-all duration-200 ${
            atLimit
              ? 'bg-surface-muted text-text-muted cursor-not-allowed'
              : 'bg-brand-primary text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed press-scale'
          }`}
        >
          <Plus size={18} />
          New Alert
        </button>
      ) : (
        <div className="rounded-card bg-surface-default border border-border-default shadow-elevation-2 p-24 animate-scale-in">
          <div className="flex items-center justify-between mb-16">
            <h3 className="text-h3 font-semibold">Create Search Alert</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-8 rounded-input hover:bg-surface-muted transition-colors press-scale"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-16">
            <div>
              <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
                Job Title / Keyword *
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. Software Engineer"
                className={`${inputBase} ${inputOk}`}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
              <div>
                <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
                  Country
                </label>
                <CountrySelect value={location} onChange={setLocation} />
              </div>
              <div>
                <label className="mb-8 block text-ui-label font-semibold text-text-secondary">
                  Work Type
                </label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className={`${inputBase} ${inputOk}`}
                >
                  <option value="remote">Remote</option>
                  <option value="on-site">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <p className="text-ui-caption text-text-muted">
              Jobs posted in the last 8 hours on LinkedIn and RemoteOK. Label: &quot;{keyword || '...'} - {location || '...'}&quot;
            </p>

            <div className="flex justify-end gap-8">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-input px-16 py-8 text-sm font-medium text-text-secondary hover:bg-surface-muted press-scale transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-input bg-brand-primary px-16 py-8 text-sm font-semibold text-neutral-0 shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed press-scale transition-all duration-200"
              >
                Create Alert
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AlertForm;
