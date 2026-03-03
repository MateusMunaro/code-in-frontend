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
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  const variants = {
    default: 'text-white',
    primary: 'text-brand-primary',
    secondary: 'text-brand-secondary',
  };

  // Terminal-style loading indicator instead of spinning circle
  return (
    <span
      className={cn(
        'font-mono animate-blink inline-block',
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      [...]
    </span>
  );
};

// Full Page Loading
export interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'LOADING...',
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-black">
      <div className="border border-brand-primary p-8 bg-brand-dark shadow-retro">
        <p className="font-display text-3xl text-brand-primary uppercase tracking-widest animate-blink">
          {message}
        </p>
      </div>
    </div>
  );
};

// Inline Loading
export interface InlineLoadingProps {
  text?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  text = 'Loading',
}) => {
  return (
    <div className="flex items-center gap-2 text-brand-primary font-mono">
      <Spinner size="sm" />
      <span className="text-sm uppercase tracking-wider">{text}</span>
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
  return (
    <div
      className={cn(
        'bg-[#333] animate-pulse',
        variant === 'text' && 'h-4',
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
