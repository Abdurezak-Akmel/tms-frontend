import { type LabelHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export function Label({
  className,
  children,
  required,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        'text-sm font-medium leading-none text-slate-800',
        className,
      )}
      {...props}
    >
      {children}
      {required ? (
        <span className="ml-0.5 text-rose-600" aria-hidden>
          *
        </span>
      ) : null}
    </label>
  );
}
