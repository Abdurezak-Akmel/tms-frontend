import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';
import type { FileCatalogItem } from './types';
import { fileKindAccent, fileKindIcon } from './fileKindMeta';

export type FileCardProps = {
  file: FileCatalogItem;
  className?: string;
  basePath?: string;
};

export function FileCard({ file, className, basePath = '/files' }: FileCardProps) {
  const Icon = fileKindIcon(file.kind);
  const accent = fileKindAccent(file.kind);

  return (
    <Link
      to={`${basePath}/${file.id}`}
      className={cn(
        'group block rounded-2xl outline-none transition-[transform,box-shadow] focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2',
        className,
      )}
    >
      <Card
        padding="none"
        className="h-full overflow-hidden border-slate-200/90 shadow-sm transition-all group-hover:border-slate-300/90 group-hover:shadow-md"
      >
        <div
          className={cn(
            'relative flex items-center gap-4 border-b border-slate-100/80',
            'bg-gradient-to-br px-5 py-5',
            accent,
          )}
        >
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/90 shadow-sm ring-1 ring-slate-200/80">
            <Icon className="size-7 text-[var(--color-brand)]" strokeWidth={1.5} aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-white/60 bg-white/60 font-normal backdrop-blur">
                {file.kind}
              </Badge>
              <span className="text-xs font-medium opacity-80">{file.sizeLabel}</span>
            </div>
            <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-slate-900 group-hover:text-[var(--color-brand)]">
              {file.name}
            </h3>
          </div>
          <ArrowUpRight
            className="size-5 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden
          />
        </div>
        <div className="space-y-3 p-5">
          <p className="line-clamp-2 text-sm text-slate-600">{file.description}</p>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 sm:pt-4">
            <div className="flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
              <span className="truncate font-medium text-slate-700">{file.courseName}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="size-3.5" aria-hidden />
              {file.updatedLabel}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
