import { useState } from 'react';
import { Plus, X, AlertTriangle, Bookmark, BookmarkCheck } from 'lucide-react';
import { buildLinkedInSearchUrl } from '../../utils/buildLinkedInSearchUrl';
import CountrySelect from '../shared/CountrySelect';
import Button from '../shared/Button';

const ALERT_LIMIT = 20;

const AlertForm = ({ onSubmit, alertCount = 0, keywords = [], onSaveKeyword }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [workType, setWorkType] = useState('remote');
  const [saveKeyword, setSaveKeyword] = useState(false);

  const atLimit = alertCount >= ALERT_LIMIT;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim() || atLimit) return;

    if (saveKeyword && onSaveKeyword) {
      const exists = keywords.some(
        (k) => k.keyword.toLowerCase() === keyword.trim().toLowerCase()
      );
      if (!exists) onSaveKeyword(keyword.trim());
    }

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
    setSaveKeyword(false);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-8">
      {atLimit && !isOpen && (
        <div className="flex items-center gap-8 px-14 py-10 rounded-card bg-warning-bg border border-warning-main/20 text-warning-main text-body-normal">
          <AlertTriangle size={16} className="shrink-0" />
          <span>
            Maximum of {ALERT_LIMIT} alerts reached. Delete one to create a new alert.
          </span>
        </div>
      )}

      {!isOpen ? (
        <Button
          onClick={() => !atLimit && setIsOpen(true)}
          disabled={atLimit}
          variant={atLimit ? 'secondary' : 'primary'}
          size="md"
        >
          <Plus size={16} />
          New Alert
        </Button>
      ) : (
        <div className="rounded-card bg-surface-default border border-border-default shadow-elevation-2 p-20 animate-scale-in">
          <div className="flex items-center justify-between mb-16">
            <h3 className="text-h3 font-semibold">Create Search Alert</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-6 rounded-input hover:bg-surface-muted transition-colors press-scale"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-14">
            <div className="flex flex-col gap-6">
              <label className="text-ui-label font-semibold text-text-secondary">
                Job Title / Keyword *
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="w-full rounded-input border bg-surface-elevated px-12 py-10 text-body-normal text-text-primary placeholder:text-text-muted outline-none transition-all duration-200 border-border-default focus:border-border-focus focus-ring"
                required
              />

              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-6 mt-2">
                  {keywords.map((k) => (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => setKeyword(k.keyword)}
                      className={`inline-flex items-center gap-4 px-10 py-4 rounded-chip text-ui-badge font-medium transition-all duration-200 border ${
                        keyword === k.keyword
                          ? 'bg-brand-tint text-brand-primary border-brand-primary/30'
                          : 'bg-surface-elevated text-text-secondary border-border-default hover:border-brand-primary/30 hover:text-brand-primary'
                      }`}
                    >
                      <Bookmark size={10} />
                      {k.keyword}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-14">
              <div className="flex flex-col gap-6">
                <label className="text-ui-label font-semibold text-text-secondary">
                  Country
                </label>
                <CountrySelect value={location} onChange={setLocation} />
              </div>
              <div className="flex flex-col gap-6">
                <label className="text-ui-label font-semibold text-text-secondary">
                  Work Type
                </label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full rounded-input border bg-surface-elevated px-12 py-10 text-body-normal text-text-primary placeholder:text-text-muted outline-none transition-all duration-200 border-border-default focus:border-border-focus focus-ring"
                >
                  <option value="remote">Remote</option>
                  <option value="on-site">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-8 cursor-pointer text-body-normal text-text-secondary">
              <input
                type="checkbox"
                checked={saveKeyword}
                onChange={(e) => setSaveKeyword(e.target.checked)}
                className="w-4 h-4 rounded border-border-default text-brand-primary accent-brand-primary"
              />
              <BookmarkCheck size={14} />
              Save keyword for reuse
            </label>

            <p className="text-ui-caption text-text-muted">
              Jobs posted in the last 10 hours on LinkedIn and RemoteOK.
            </p>

            <div className="flex justify-end gap-8">
              <Button
                type="button"
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="md"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Create Alert
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AlertForm;
