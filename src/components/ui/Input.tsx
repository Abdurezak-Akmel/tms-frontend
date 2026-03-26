import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Shown when input has aria-invalid or data-invalid */
  error?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      data-invalid={error ? '' : undefined}
      className={cn(
        'flex h-10 w-full min-w-0 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 shadow-sm transition-[color,box-shadow,border-color]',
        'placeholder:text-slate-400 dark:placeholder:text-slate-500',
        'focus-visible:border-[var(--color-brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/25 dark:focus-visible:ring-[var(--color-brand)]/40',
        'disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-400',
        'aria-invalid:border-rose-500 aria-invalid:ring-rose-500/20 data-[invalid]:border-rose-500 data-[invalid]:ring-rose-500/20',
        className,
      )}
      {...props}
    />
  );
});
