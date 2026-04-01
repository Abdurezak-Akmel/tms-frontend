import { Search, X } from 'lucide-react';
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
    <div className={cn('space-y-3', className)}>
      {/* Search */}
      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-[#484f58]"
          aria-hidden
        />
        <Input
          type="search"
          placeholder="Search by title or topic…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 pl-10 pr-9"
          aria-label="Search courses"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex size-5 items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button
            type="button"
            onClick={() => onCategoryChange(null)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-95',
              activeCategory === null
                ? 'border-[var(--color-brand)] bg-[var(--color-brand)] text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-950'
                : 'border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#21262d] text-slate-600 dark:text-[#8b949e] hover:bg-slate-50 dark:hover:bg-[#30363d] hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600',
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
                'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-95',
                activeCategory === cat
                  ? 'border-[var(--color-brand)] bg-[var(--color-brand)] text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-950'
                  : 'border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#21262d] text-slate-600 dark:text-[#8b949e] hover:bg-slate-50 dark:hover:bg-[#30363d] hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
