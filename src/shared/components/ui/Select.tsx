import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@shared/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      placeholder = 'Selecione uma opção',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    // Group options by group field
    const groupedOptions = options.reduce<Record<string, SelectOption[]>>(
      (acc, option) => {
        const group = option.group || '';
        if (!acc[group]) acc[group] = [];
        acc[group].push(option);
        return acc;
      },
      {}
    );

    const hasGroups = Object.keys(groupedOptions).some((key) => key !== '');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full bg-brand-dark border border-white/10 rounded-lg',
              'text-white appearance-none cursor-pointer',
              'px-4 py-3 pr-10',
              'transition-all duration-200',
              'focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          >
            <option value="" disabled className="text-gray-500">
              {placeholder}
            </option>
            {hasGroups
              ? Object.entries(groupedOptions).map(([group, groupOptions]) =>
                  group ? (
                    <optgroup key={group} label={group} className="bg-brand-dark text-gray-400">
                      {groupOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          disabled={option.disabled}
                          className="bg-brand-dark text-white"
                        >
                          {option.label}
                        </option>
                      ))}
                    </optgroup>
                  ) : (
                    groupOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        className="bg-brand-dark text-white"
                      >
                        {option.label}
                      </option>
                    ))
                  )
                )
              : options.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className="bg-brand-dark text-white"
                  >
                    {option.label}
                  </option>
                ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
        {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-gray-500">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
