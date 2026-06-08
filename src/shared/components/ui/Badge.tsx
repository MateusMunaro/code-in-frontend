import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@shared/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  dot = false,
  className,
  ...props
}) => {
  const baseStyles = cn(
    'inline-flex items-center font-mono uppercase tracking-wider',
    'transition-colors duration-150 border'
  );

  const variants = {
    default: 'bg-brand-gray/50 border-brand-secondary/30 text-theme-text-secondary',
    primary: 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary',
    secondary: 'bg-brand-gray/50 border-brand-secondary/30 text-brand-secondary',
    success: 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600',
    error: 'bg-theme-error/10 border-theme-error/30 text-theme-error',
    outline: 'bg-transparent border-brand-secondary/30 text-theme-text-secondary',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  const dotColors = {
    default: 'bg-gray-400',
    primary: 'bg-brand-primary',
    secondary: 'bg-brand-secondary',
    success: 'bg-brand-primary',
    warning: 'bg-yellow-400',
    error: 'bg-red-400',
    outline: 'bg-gray-400',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'animate-pulse',
            size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-2.5 h-2.5',
            dotColors[variant]
          )}
        />
      )}
      {Icon && <Icon className={iconSizes[size]} />}
      {children}
    </span>
  );
};

// Status-specific badges
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, ...props }) => {
  const statusConfig = {
    pending: { variant: 'warning' as const, label: '[PENDING]', dot: true },
    processing: { variant: 'primary' as const, label: '[ACTIVE]', dot: true },
    completed: { variant: 'success' as const, label: '[DONE]', dot: false },
    failed: { variant: 'error' as const, label: '[FAIL]', dot: false },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} dot={config.dot} {...props}>
      {config.label}
    </Badge>
  );
};
