import { type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'outline'
  | 'info';

const variantClasses: Record<BadgeVariant, string> = {
  default:
    'border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  success:
    'border-transparent bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-500/30',
  warning:
    'border-transparent bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/25 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-500/30',
  danger:
    'border-transparent bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20 dark:bg-rose-950/40 dark:text-rose-400 dark:ring-rose-500/30',
  outline:
    'border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400',
  info:
    'border-transparent bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20 dark:bg-sky-950/40 dark:text-sky-400 dark:ring-sky-500/30',
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
