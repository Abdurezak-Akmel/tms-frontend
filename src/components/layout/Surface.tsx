import { type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

/** Subtle full-bleed background for auth or section shells */
export type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'muted' | 'brand';
};

const variantMap = {
  default: 'bg-[var(--color-surface)] dark:bg-slate-900',
  muted: 'bg-slate-100/80 dark:bg-slate-800/80',
  brand:
    'bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-900/20',
};

export function Surface({
  className,
  variant = 'default',
  ...props
}: SurfaceProps) {
  return (
    <div className={cn('min-h-dvh', variantMap[variant], className)} {...props} />
  );
}
