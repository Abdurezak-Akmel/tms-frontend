import { type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'outline';

const variantClasses: Record<BadgeVariant, string> = {
  default:
    'border-transparent bg-slate-100 text-slate-800',
  success:
    'border-transparent bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-600/15',
  warning:
    'border-transparent bg-amber-50 text-amber-900 ring-1 ring-inset ring-amber-600/20',
  danger:
    'border-transparent bg-rose-50 text-rose-800 ring-1 ring-inset ring-rose-600/15',
  outline:
    'border border-slate-200 bg-white text-slate-700',
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
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
