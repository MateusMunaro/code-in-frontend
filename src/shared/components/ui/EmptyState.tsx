import React from 'react';
import { cn } from '@shared/lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center border bg-brand-dark font-mono',
        className
      )}
      style={{ borderColor: 'var(--color-border-default)' }}
      {...props}
    >
      {icon && (
        <div className="mb-4 text-brand-primary opacity-50">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-display uppercase tracking-widest text-theme-text mb-2">{title}</h3>
      {description && (
        <p className="text-theme-text-secondary max-w-sm mb-6 text-sm">// {description}</p>
      )}
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};
