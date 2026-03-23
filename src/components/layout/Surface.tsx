import { type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

/** Subtle full-bleed background for auth or section shells */
export type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'muted' | 'brand';
};

const variantMap = {
  default: 'bg-[var(--color-surface)]',
  muted: 'bg-slate-100/80',
  brand:
    'bg-gradient-to-br from-slate-50 via-white to-indigo-50/40',
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
