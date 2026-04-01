import { forwardRef, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[var(--color-brand)] text-white shadow-sm hover:bg-[var(--color-brand-dark)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2',
  secondary:
    'bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 shadow-sm hover:bg-slate-800 dark:hover:bg-slate-300 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2',
  outline:
    'border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#21262d] text-slate-800 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-[#30363d] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2',
  ghost:
    'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#21262d] hover:text-slate-900 dark:hover:text-slate-100 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 gap-1.5 px-3 text-xs font-semibold rounded-lg',
  md: 'h-10 gap-2 px-4 text-sm font-semibold rounded-xl',
  lg: 'h-12 gap-2 px-6 text-sm font-semibold rounded-xl',
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
          'inline-flex items-center justify-center font-semibold transition-all duration-150',
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
