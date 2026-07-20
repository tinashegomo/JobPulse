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

  const handleClose = () => {
    setIsOpen(false);
    setKeyword('');
    setLocation('');
    setWorkType('remote');
    setSaveKeyword(false);
  };

  return (
    <>
      {atLimit && (
        <div className="flex items-center gap-8 px-14 py-10 rounded-card bg-warning-bg border border-warning-main/20 text-warning-main text-body-normal">
          <AlertTriangle size={16} className="shrink-0" />
          <span>
            Maximum of {ALERT_LIMIT} alerts reached.
          </span>
        </div>
      )}

      <Button
        onClick={() => !atLimit && setIsOpen(true)}
        disabled={atLimit}
        variant={atLimit ? 'secondary' : 'primary'}
        size="md"
      >
        <Plus size={16} />
        New Alert
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-16">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-surface-default border border-border-default shadow-elevation-4 p-20 animate-scale-in max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-16">
              <h3 className="text-h3 font-semibold">Create Search Alert</h3>
              <button
                onClick={handleClose}
                className="p-6 rounded-lg hover:bg-surface-muted transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-12">
              <div className="flex flex-col gap-5">
                <label className="text-[13px] font-semibold text-text-secondary">
                  Job Title / Keyword *
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full rounded-lg border border-border-default bg-surface-elevated px-10 py-8 text-[13.5px] text-text-primary placeholder:text-text-muted outline-none transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  required
                />

                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-5 mt-1">
                    {keywords.map((k) => (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => setKeyword(k.keyword)}
                        className={`inline-flex items-center gap-3 px-8 py-3 rounded-full text-[11px] font-medium transition-all border ${
                          keyword === k.keyword
                            ? 'bg-brand-tint text-brand-primary border-brand-primary/30'
                            : 'bg-surface-elevated text-text-secondary border-border-default hover:border-brand-primary/30 hover:text-brand-primary'
                        }`}
                      >
                        <Bookmark size={9} />
                        {k.keyword}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="flex flex-col gap-5">
                  <label className="text-[13px] font-semibold text-text-secondary">
                    Country
                  </label>
                  <CountrySelect value={location} onChange={setLocation} />
                </div>
                <div className="flex flex-col gap-5">
                  <label className="text-[13px] font-semibold text-text-secondary">
                    Work Type
                  </label>
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    className="w-full rounded-lg border border-border-default bg-surface-elevated px-10 py-8 text-[13.5px] text-text-primary outline-none transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  >
                    <option value="remote">Remote</option>
                    <option value="on-site">On-site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-6 cursor-pointer text-[12.5px] text-text-secondary">
                <input
                  type="checkbox"
                  checked={saveKeyword}
                  onChange={(e) => setSaveKeyword(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-brand-primary"
                />
                <BookmarkCheck size={13} />
                Save keyword for reuse
              </label>

              <div className="flex justify-end gap-6 pt-2">
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="ghost"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Create Alert
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertForm;
