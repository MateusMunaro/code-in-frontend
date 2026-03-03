import React from 'react';
import { LucideIcon, AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@shared/lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  icon?: LucideIcon;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  icon,
  onClose,
  className,
  ...props
}) => {
  const variants = {
    info: {
      container: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      icon: Info,
    },
    success: {
      container: 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary',
      icon: CheckCircle,
    },
    warning: {
      container: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
      icon: AlertTriangle,
    },
    error: {
      container: 'bg-red-500/10 border-red-500/30 text-red-400',
      icon: AlertCircle,
    },
  };

  const config = variants[variant];
  const IconComponent = icon || config.icon;

  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 p-4 border font-mono',
        config.container,
        className
      )}
      {...props}
    >
      <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-bold uppercase tracking-wider mb-1">{title}</h4>
        )}
        <div className="text-sm opacity-90">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 border border-transparent hover:border-current transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
