const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`rounded-card bg-surface-default border border-border-default shadow-elevation-2 ${
        hover ? 'hover-lift cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
