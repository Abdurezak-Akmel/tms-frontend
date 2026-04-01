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
        'flex h-10 w-full min-w-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161b22] px-3.5 py-2 text-sm text-slate-900 dark:text-[#e6edf3] shadow-sm transition-all duration-150',
        'placeholder:text-slate-400 dark:placeholder:text-[#484f58]',
        'focus-visible:border-[var(--color-brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/20 dark:focus-visible:ring-[var(--color-brand)]/30',
        'hover:border-slate-300 dark:hover:border-slate-600',
        'disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-[#0d1117] disabled:text-slate-400 dark:disabled:text-[#484f58]',
        'aria-invalid:border-rose-500 aria-invalid:ring-rose-500/20 data-[invalid]:border-rose-500 data-[invalid]:ring-rose-500/20',
        className,
      )}
      {...props}
    />
  );
});
