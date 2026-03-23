import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, error, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        data-invalid={error ? '' : undefined}
        className={cn(
          'min-h-[100px] w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-[color,box-shadow,border-color]',
          'placeholder:text-slate-400',
          'focus-visible:border-[var(--color-brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/25',
          'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
          'aria-invalid:border-rose-500 aria-invalid:ring-rose-500/20 data-[invalid]:border-rose-500 data-[invalid]:ring-rose-500/20',
          className,
        )}
        {...props}
      />
    );
  },
);
