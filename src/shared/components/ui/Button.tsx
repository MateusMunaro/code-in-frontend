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
    'inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-100 font-mono',
    'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-brand-black',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  );

  const variants = {
    primary: cn(
      'bg-brand-primary text-black hover:bg-white',
      'shadow-retro hover:shadow-none border-2 border-transparent hover:border-brand-primary'
    ),
    secondary: cn(
      'bg-brand-gray text-brand-secondary hover:text-white',
      'border border-[#333] hover:border-brand-primary'
    ),
    outline: cn(
      'bg-transparent border-2 border-brand-primary text-brand-primary',
      'hover:bg-brand-primary hover:text-black hover:shadow-retro'
    ),
    ghost: cn(
      'bg-transparent text-gray-400 hover:text-brand-primary',
      'border border-transparent hover:border-brand-primary/30'
    ),
    danger: cn(
      'bg-transparent text-red-400 border border-red-500/50',
      'hover:bg-red-500 hover:text-black hover:border-red-500'
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
        <span className={cn('font-mono animate-blink', iconPosition === 'right' && 'order-last')}>
          [...]
        </span>
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
