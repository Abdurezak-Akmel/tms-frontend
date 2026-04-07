import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Lock, Tag } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';
import type { CourseSummary } from './types';

const levelVariant: Record<CourseSummary['level'], 'success' | 'warning' | 'danger'> = {
  Beginner: 'success',
  Intermediate: 'warning',
  Advanced: 'danger',
};

export type CourseCardProps = {
  course: CourseSummary;
  className?: string;
  href?: string;
};

export function CourseCard({ course, className, href }: CourseCardProps) {
  const isLocked = course.locked === true;
  const destination = isLocked
    ? `/courses/${course.id}?locked=true`
    : href || `/courses/${course.id}`;

  return (
    <Link
      to={destination}
      className={cn(
        'group block rounded-2xl outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2',
        isLocked ? 'opacity-80 hover:opacity-100' : '',
        className,
      )}
    >
      <div
        className={cn(
          'relative h-full overflow-hidden rounded-2xl border bg-white dark:bg-[#161b22] shadow-sm transition-all duration-200',
          isLocked
            ? 'border-slate-200 dark:border-slate-800 group-hover:border-rose-200 dark:group-hover:border-rose-900/60 group-hover:shadow-md group-hover:shadow-rose-100/50 dark:group-hover:shadow-rose-950/30'
            : 'border-slate-200/80 dark:border-slate-800 group-hover:border-indigo-200 dark:group-hover:border-indigo-900/60 group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:shadow-indigo-100/50 dark:group-hover:shadow-indigo-950/30',
        )}
      >
        {/* Lock overlay badge */}
        {isLocked && (
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 shadow-sm ring-1 ring-rose-200 dark:ring-rose-900/60">
            <Lock className="size-3.5" aria-hidden />
            Access Required
          </div>
        )}

        {/* Card header / accent band */}
        <div
          className={cn(
            'border-b border-slate-100 dark:border-slate-800/80 px-5 pb-4 pt-5 transition-colors',
            isLocked
              ? 'bg-gradient-to-br from-rose-50/70 via-white to-white dark:from-rose-950/20 dark:via-[#161b22] dark:to-[#161b22]'
              : 'bg-gradient-to-br from-slate-50/90 via-white to-indigo-50/30 dark:from-slate-800/40 dark:via-[#161b22] dark:to-indigo-950/20',
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <Badge variant="outline" className="font-medium text-xs">
              {course.category}
            </Badge>
            <Badge variant={levelVariant[course.level]}>{course.level}</Badge>
          </div>
          <h3
            className={cn(
              'mt-3 text-base font-semibold leading-snug transition-colors',
              isLocked
                ? 'text-slate-600 dark:text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400'
                : 'text-slate-800 dark:text-[#e6edf3] group-hover:text-[var(--color-brand)] dark:group-hover:text-indigo-400',
            )}
          >
            {course.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-slate-500 dark:text-[#8b949e]">
            {course.shortDescription}
          </p>
        </div>

        {/* Card footer */}
        <div className="px-5 py-4 dark:bg-[#161b22]">
          <dl className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 dark:text-[#8b949e]">
            {/* Duration chip */}
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 px-2.5 py-1 text-slate-600 dark:text-slate-400 font-medium text-xs ring-1 ring-slate-200/60 dark:ring-slate-800/40">
              <Clock className="size-3" aria-hidden />
              <dt className="sr-only">Duration</dt>
              <dd>{course.duration}</dd>
            </div>

            {/* Price chip */}
            <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-emerald-700 dark:text-emerald-400 font-semibold text-xs ring-1 ring-emerald-200/60 dark:ring-emerald-800/40">
              <Tag className="size-3" aria-hidden />
              <dt className="sr-only">Price</dt>
              <dd>{course.price || 'Free'}</dd>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Action label */}
            <div className="flex w-full items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-3">
              {isLocked ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-500 dark:text-rose-400">
                  <Lock className="size-3.5" aria-hidden />
                  Locked
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brand)] dark:text-indigo-400">
                  <BookOpen className="size-3.5" aria-hidden />
                  View course
                </span>
              )}
              <ArrowRight
                className={cn(
                  'size-4 transition-transform duration-150 group-hover:translate-x-0.5',
                  isLocked
                    ? 'text-rose-300 dark:text-rose-700 group-hover:text-rose-500 dark:group-hover:text-rose-400'
                    : 'text-slate-300 dark:text-slate-600 group-hover:text-[var(--color-brand)] dark:group-hover:text-indigo-400',
                )}
                aria-hidden
              />
            </div>
          </dl>
        </div>
      </div>
    </Link>
  );
}
