const VARIANTS = {
  primary:
    'bg-brand-primary text-white shadow-elevation-1 hover:bg-brand-hover hover:shadow-elevation-2 active:bg-brand-pressed',
  secondary:
    'bg-surface-elevated text-text-primary border border-border-default shadow-elevation-1 hover:bg-surface-muted hover:shadow-elevation-2',
  danger:
    'bg-danger-main text-white shadow-elevation-1 hover:bg-danger-hover active:opacity-90',
  ghost:
    'bg-transparent text-text-secondary hover:bg-surface-muted hover:text-text-primary',
};

const SIZES = {
  sm: 'px-10 py-6 text-ui-label gap-4',
  md: 'px-14 py-8 text-ui-label gap-6',
  lg: 'px-18 py-10 text-body-normal gap-6',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-input font-semibold transition-all duration-200 press-scale ${
        VARIANTS[variant] || VARIANTS.primary
      } ${SIZES[size] || SIZES.md} ${
        disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
