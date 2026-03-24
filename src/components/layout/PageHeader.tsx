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
        'flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
      {...props}
    >
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-3">
          {backPath && (
            <Link
              to={backPath}
              className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95 sm:hidden xl:flex"
              aria-label="go back"
            >
              <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-0.5" />
            </Link>
          )}
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h1>
        </div>
        {description ? (
          <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
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
