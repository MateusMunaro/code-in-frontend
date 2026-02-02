import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@shared/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = cn(
    'inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-lg',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-black',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  );

  const variants = {
    primary: cn(
      'bg-brand-primary text-white hover:bg-brand-primaryHover',
      'shadow-glow hover:shadow-glow-lg border border-transparent',
      'focus:ring-brand-primary'
    ),
    secondary: cn(
      'bg-brand-secondary text-white hover:bg-brand-secondaryHover',
      'shadow-glow-violet border border-transparent',
      'focus:ring-brand-secondary'
    ),
    outline: cn(
      'bg-transparent border border-brand-primary text-brand-primary',
      'hover:bg-brand-primary/10',
      'focus:ring-brand-primary'
    ),
    ghost: cn(
      'bg-transparent text-gray-400 hover:text-white hover:bg-white/5',
      'focus:ring-white/20'
    ),
    danger: cn(
      'bg-red-500/10 text-red-400 border border-red-500/20',
      'hover:bg-red-500/20 hover:border-red-500/40',
      'focus:ring-red-500'
    ),
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className={cn('animate-spin', iconSizes[size], iconPosition === 'right' && 'order-last')}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {Icon && !isLoading && iconPosition === 'left' && (
        <Icon className={iconSizes[size]} />
      )}
      {children}
      {Icon && !isLoading && iconPosition === 'right' && (
        <Icon className={iconSizes[size]} />
      )}
    </button>
  );
};
