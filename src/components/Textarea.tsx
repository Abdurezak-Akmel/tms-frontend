import { type TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const generatedId = id || Math.random().toString(36).substring(2, 9);

    return (
      <div className="w-full space-y-1.5 text-left">
        <label htmlFor={generatedId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
        <div className="relative">
          <textarea
            id={generatedId}
            ref={ref}
            className={`
              block w-full rounded-xl sm:text-sm bg-white border outline-none transition-all duration-200 shadow-sm py-3 px-4 resize-y min-h-[120px]
              ${error
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 hover:border-indigo-300'}
              ${className}
            `}
            {...props}
          />
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

Textarea.displayName = 'Textarea';
