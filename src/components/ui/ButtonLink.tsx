import { forwardRef, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[var(--color-brand)] text-white shadow-sm hover:bg-[var(--color-brand-dark)] focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2',
  secondary:
    'bg-slate-900 text-white shadow-sm hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2',
  outline:
    'border border-slate-300 bg-white text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2',
  ghost:
    'text-slate-700 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 gap-1.5 px-3 text-sm rounded-lg',
  md: 'h-10 gap-2 px-4 text-sm rounded-xl',
  lg: 'h-12 gap-2 px-6 text-base rounded-xl',
};

export type ButtonLinkProps = LinkProps & {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    {
      className,
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <Link
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {leftIcon && <span className="shrink-0 [&_svg]:size-4">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="shrink-0 [&_svg]:size-4">{rightIcon}</span>}
      </Link>
    );
  },
);
