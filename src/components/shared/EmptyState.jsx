import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center py-48 text-center animate-fade-in">
      <div className="p-20 bg-surface-muted rounded-full mb-16">
        <Icon size={32} className="text-text-muted" />
      </div>
      <h3 className="text-h3 font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="mt-8 text-body-normal text-text-secondary max-w-[400px]">
          {description}
        </p>
      )}
    </div>
  );
};

export default EmptyState;
