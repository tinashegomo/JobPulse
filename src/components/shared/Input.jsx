const Input = ({
  label,
  error,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-6 ${containerClassName}`}>
      {label && (
        <label className="text-ui-label font-semibold text-text-secondary">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-input border bg-surface-elevated px-12 py-10 text-body-normal text-text-primary placeholder:text-text-muted outline-none transition-all duration-200 border-border-default focus:border-border-focus focus-ring ${
          error ? 'border-danger-main focus:border-danger-main' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-ui-caption text-danger-main">{error}</span>
      )}
    </div>
  );
};

export default Input;
