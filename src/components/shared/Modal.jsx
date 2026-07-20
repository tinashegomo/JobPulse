import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ open, onClose, title, children, className = '' }) => {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Prevent the page behind the modal from scrolling while it's open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-16">
      {/* Backdrop — click to close */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative w-full max-w-lg max-h-[85vh] rounded-card bg-surface-default shadow-elevation-4 flex flex-col animate-modal-in ${className}`}
      >
        <div className="flex items-center justify-between px-24 py-16 border-b border-border-default shrink-0">
          <h2 id="modal-title" className="text-h3 font-semibold text-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-6 rounded-input hover:bg-surface-muted transition-colors press-scale"
          >
            <X size={18} className="text-text-muted" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-24 py-16">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;