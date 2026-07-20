const VARIANTS = {
  brand: 'bg-brand-tint text-brand-primary',
  success: 'bg-success-main/15 text-success-main',
  info: 'bg-info-main/15 text-info-main',
  warning: 'bg-warning-main/15 text-warning-main',
  danger: 'bg-danger-bg text-danger-main',
  neutral: 'bg-surface-muted text-text-secondary',
};

const Badge = ({ children, variant = 'brand', className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-8 py-2 rounded-chip text-ui-badge font-medium ${VARIANTS[variant] || VARIANTS.brand} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
