import { type SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, id, options, placeholder, ...props }, ref) => {
    const generatedId = id || Math.random().toString(36).substring(2, 9);

    return (
      <div className="w-full space-y-1.5 text-left">
        <label htmlFor={generatedId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
        <div className="relative">
          <select
            id={generatedId}
            ref={ref}
            className={`
              appearance-none block w-full rounded-xl sm:text-sm bg-white border outline-none transition-all duration-200 shadow-sm py-2.5 pl-3 pr-10 cursor-pointer
              ${error
                ? 'border-red-300 text-red-900 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 hover:border-indigo-300'}
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
