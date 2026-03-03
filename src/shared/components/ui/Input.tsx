import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@shared/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon: Icon,
      iconPosition = 'left',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs uppercase tracking-widest text-brand-primary mb-2 font-mono"
          >
            &gt; {label}
          </label>
        )}
        <div className="relative group">
          {Icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-brand-black border-b-2 border-[#333]',
              'text-white placeholder-gray-600 font-mono',
              'transition-colors duration-150',
              'focus:outline-none focus:border-brand-primary',
              Icon && iconPosition === 'left' && 'pl-10',
              Icon && iconPosition === 'right' && 'pr-10',
              !Icon && 'px-4',
              'py-3',
              error && 'border-red-500 focus:border-red-500',
              className
            )}
            {...props}
          />
          {Icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Icon className="w-5 h-5" />
            </div>
          )}
          {/* Blinking cursor indicator */}
          <div className="absolute right-3 bottom-3 text-brand-primary opacity-0 group-focus-within:opacity-100 animate-pulse font-mono">
            _
          </div>
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-400 font-mono">&gt; ERROR: {error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-gray-500 font-mono">// {hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs uppercase tracking-widest text-brand-primary mb-2 font-mono"
          >
            &gt; {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full bg-brand-black border-b-2 border-[#333] px-4 py-3',
            'text-white placeholder-gray-600 font-mono',
            'transition-colors duration-150 resize-none',
            'focus:outline-none focus:border-brand-primary',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-400 font-mono">&gt; ERROR: {error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-gray-500 font-mono">// {hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
