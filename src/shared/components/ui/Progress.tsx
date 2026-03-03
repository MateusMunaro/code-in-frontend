import React from 'react';
import { cn } from '@shared/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary' | 'success';
  showLabel?: boolean;
  animated?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  animated = true,
  className,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variants = {
    default: 'bg-white',
    primary: 'bg-brand-primary',
    secondary: 'bg-brand-secondary',
    success: 'bg-brand-primary',
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Progress</span>
          <span className="text-xs font-mono text-brand-primary">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(
          'w-full bg-[#333] overflow-hidden border border-[#444]',
          sizes[size]
        )}
      >
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out',
            variants[variant],
            animated && percentage < 100 && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Indeterminate Progress (Loading)
export interface LoadingProgressProps extends Omit<ProgressProps, 'value' | 'showLabel'> { }

export const LoadingProgress: React.FC<LoadingProgressProps> = ({
  size = 'md',
  variant = 'primary',
  className,
  ...props
}) => {
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variants = {
    default: 'bg-white',
    primary: 'bg-brand-primary',
    secondary: 'bg-brand-secondary',
    success: 'bg-brand-primary',
  };

  return (
    <div
      className={cn(
        'w-full bg-[#333] overflow-hidden border border-[#444]',
        sizes[size],
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'h-full w-1/3 animate-[loading_1.5s_ease-in-out_infinite]',
          variants[variant]
        )}
        style={{
          animation: 'loading 1.5s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
};
