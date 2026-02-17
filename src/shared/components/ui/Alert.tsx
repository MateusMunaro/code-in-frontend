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
      container: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      icon: Info,
    },
    success: {
      container: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
      icon: CheckCircle,
    },
    warning: {
      container: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
      icon: AlertTriangle,
    },
    error: {
      container: 'bg-red-500/10 border-red-500/20 text-red-400',
      icon: AlertCircle,
    },
  };

  const config = variants[variant];
  const IconComponent = icon || config.icon;

  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 p-4 rounded-lg border',
        config.container,
        className
      )}
      {...props}
    >
      <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-medium mb-1">{title}</h4>
        )}
        <div className="text-sm opacity-90">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
