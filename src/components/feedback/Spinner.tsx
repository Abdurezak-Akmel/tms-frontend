import { type HTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export type SpinnerProps = HTMLAttributes<HTMLDivElement> & {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
};

const sizeMap = {
  sm: 'size-4',
  md: 'size-8',
  lg: 'size-12',
};

export function Spinner({
  className,
  size = 'md',
  label = 'Loading',
  ...props
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn('inline-flex items-center justify-center', className)}
      {...props}
    >
      <Loader2
        className={cn('animate-spin text-[var(--color-brand)]', sizeMap[size])}
        aria-hidden
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
