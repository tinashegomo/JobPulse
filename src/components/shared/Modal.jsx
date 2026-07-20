import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({ open, onClose, title, children, className = '' }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={`w-full max-w-lg rounded-card bg-surface-default shadow-elevation-4 p-0 ${className}`}
    >
      {open && (
        <div className="flex flex-col max-h-[80vh]">
          <div className="flex items-center justify-between px-24 py-16 border-b border-border-default">
            <h2 className="text-h3 font-semibold text-text-primary">{title}</h2>
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
      )}
    </dialog>
  );
};

export default Modal;
