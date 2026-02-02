import React from 'react';
import { cn } from '@shared/lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary';
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className,
  ...props
}) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  const variants = {
    default: 'border-white/20 border-t-white',
    primary: 'border-brand-primary/20 border-t-brand-primary',
    secondary: 'border-brand-secondary/20 border-t-brand-secondary',
  };

  return (
    <div
      className={cn(
        'rounded-full animate-spin',
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

// Full Page Loading
export interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Carregando...',
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-black">
      <div className="relative">
        <Spinner size="xl" />
        <div className="absolute inset-0 animate-ping">
          <Spinner size="xl" className="opacity-30" />
        </div>
      </div>
      <p className="mt-4 text-gray-400 animate-pulse">{message}</p>
    </div>
  );
};

// Inline Loading
export interface InlineLoadingProps {
  text?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  text = 'Carregando',
}) => {
  return (
    <div className="flex items-center gap-2 text-gray-400">
      <Spinner size="sm" />
      <span className="text-sm">{text}</span>
    </div>
  );
};

// Skeleton Loader
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className,
  ...props
}) => {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(
        'bg-white/10 animate-pulse',
        variants[variant],
        className
      )}
      style={{
        width: width ?? (variant === 'circular' ? height : '100%'),
        height: height ?? (variant === 'text' ? undefined : 100),
      }}
      {...props}
    />
  );
};
