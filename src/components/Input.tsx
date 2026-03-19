import React, { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const generatedId = id || Math.random().toString(36).substring(2, 9);

    return (
      <div className="w-full space-y-1.5 text-left">
        <label htmlFor={generatedId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            id={generatedId}
            ref={ref}
            className={`
              block w-full rounded-xl sm:text-sm bg-white border border-slate-200 transition-all duration-200 outline-none
              ${leftIcon ? 'pl-10' : 'pl-3'}
              ${rightIcon ? 'pr-10' : 'pr-3'}
              ${error
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 hover:border-indigo-300'}
              shadow-sm py-2.5 px-3
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightIcon}
            </div>
          )}
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

Input.displayName = 'Input';
