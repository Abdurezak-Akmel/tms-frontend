import { type ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '../../utils/cn';

export type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700/60 bg-slate-50/50 dark:bg-[#161b22]/50 px-6 py-14 text-center transition-colors',
        className,
      )}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white dark:bg-[#21262d] shadow-sm ring-1 ring-slate-200/80 dark:ring-slate-700/60">
        {icon ?? (
          <Inbox className="size-6 text-slate-400 dark:text-slate-500" strokeWidth={1.5} aria-hidden />
        )}
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-[#e6edf3]">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-[#8b949e]">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
