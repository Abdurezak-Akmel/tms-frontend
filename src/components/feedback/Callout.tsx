import { type HTMLAttributes, type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { cn } from '../../utils/cn';

export type CalloutVariant = 'info' | 'success' | 'warning' | 'danger';

const styles: Record<
  CalloutVariant,
  { wrap: string; icon: typeof Info; iconClass: string }
> = {
  info: {
    wrap: 'border-sky-200/80 bg-sky-50 text-sky-900 dark:border-sky-800/60 dark:bg-sky-950/30 dark:text-sky-200',
    icon: Info,
    iconClass: 'text-sky-500 dark:text-sky-400',
  },
  success: {
    wrap: 'border-emerald-200/80 bg-emerald-50 text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-200',
    icon: CheckCircle2,
    iconClass: 'text-emerald-500 dark:text-emerald-400',
  },
  warning: {
    wrap: 'border-amber-200/80 bg-amber-50 text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-200',
    icon: TriangleAlert,
    iconClass: 'text-amber-500 dark:text-amber-400',
  },
  danger: {
    wrap: 'border-rose-200/80 bg-rose-50 text-rose-900 dark:border-rose-800/60 dark:bg-rose-950/30 dark:text-rose-200',
    icon: AlertCircle,
    iconClass: 'text-rose-500 dark:text-rose-400',
  },
};

export type CalloutProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CalloutVariant;
  title?: string;
  icon?: ReactNode;
};

export function Callout({
  className,
  variant = 'info',
  title,
  icon,
  children,
  ...props
}: CalloutProps) {
  const cfg = styles[variant];
  const Icon = cfg.icon;

  return (
    <div
      role="note"
      className={cn(
        'flex gap-3 rounded-xl border px-4 py-3.5 text-sm transition-colors',
        cfg.wrap,
        className,
      )}
      {...props}
    >
      <span className={cn('mt-0.5 shrink-0', cfg.iconClass)} aria-hidden>
        {icon ?? <Icon className="size-5" strokeWidth={1.75} />}
      </span>
      <div className="min-w-0 space-y-1">
        {title ? (
          <p className="font-semibold leading-tight">{title}</p>
        ) : null}
        <div className="leading-relaxed opacity-95 [&_p]:m-0">{children}</div>
      </div>
    </div>
  );
}
