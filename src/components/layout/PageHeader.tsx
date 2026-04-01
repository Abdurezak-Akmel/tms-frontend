import { type HTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { cn } from '../../utils/cn';

export type PageHeaderProps = HTMLAttributes<HTMLElement> & {
  title: string;
  description?: string;
  /** Link to a previous page */
  backPath?: string;
  /** Actions aligned to the right on larger screens */
  actions?: ReactNode;
};

export function PageHeader({
  className,
  title,
  description,
  backPath,
  actions,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-4 border-b border-slate-200/80 dark:border-[#30363d] pb-6 sm:flex-row sm:items-start sm:justify-between transition-colors',
        className,
      )}
      {...props}
    >
      <div className="min-w-0 space-y-1.5">
        <div className="flex items-center gap-3">
          {backPath && (
            <Link
              to={backPath}
              className="group flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-[#21262d] border border-slate-200 dark:border-[#30363d] text-slate-500 dark:text-slate-400 shadow-sm transition-all duration-150 hover:bg-slate-50 dark:hover:bg-[#30363d] hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-100 active:scale-95 sm:hidden xl:flex"
              aria-label="go back"
            >
              <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
            </Link>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#f0f6fc] sm:text-3xl">
            {title}
          </h1>
        </div>
        {description ? (
          <p className="max-w-2xl text-sm text-slate-500 dark:text-[#8b949e] sm:text-base leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          {actions}
        </div>
      ) : null}
    </header>
  );
}
