import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { cn } from '../../utils/cn';

export type CoursesToolbarProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  className?: string;
};

export function CoursesToolbar({
  searchQuery,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
  className,
}: CoursesToolbarProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <Input
          type="search"
          placeholder="Search by title or topic…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 pl-10"
          aria-label="Search courses"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onCategoryChange(null)}
          className={cn(
            'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
            activeCategory === null
              ? 'border-[var(--color-brand)] bg-indigo-50 dark:bg-brand-900/30 text-[var(--color-brand)] dark:text-brand-400'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100',
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              activeCategory === cat
                ? 'border-[var(--color-brand)] bg-indigo-50 dark:bg-brand-900/30 text-[var(--color-brand)] dark:text-brand-400'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100',
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
