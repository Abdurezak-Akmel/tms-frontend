import { type HTMLAttributes, type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { cn } from '../../utils/cn';

export type CalloutVariant = 'info' | 'success' | 'warning' | 'danger';

const styles: Record<
  CalloutVariant,
  { wrap: string; icon: typeof Info; iconClass: string }
> = {
  info: {
    wrap: 'border-sky-200 bg-sky-50/90 text-sky-950',
    icon: Info,
    iconClass: 'text-sky-600',
  },
  success: {
    wrap: 'border-emerald-200 bg-emerald-50/90 text-emerald-950',
    icon: CheckCircle2,
    iconClass: 'text-emerald-600',
  },
  warning: {
    wrap: 'border-amber-200 bg-amber-50/90 text-amber-950',
    icon: TriangleAlert,
    iconClass: 'text-amber-600',
  },
  danger: {
    wrap: 'border-rose-200 bg-rose-50/90 text-rose-950',
    icon: AlertCircle,
    iconClass: 'text-rose-600',
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
        'flex gap-3 rounded-xl border px-4 py-3 text-sm',
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
