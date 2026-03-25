import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Layers, Lock } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
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
        'group block rounded-2xl outline-none transition-[transform,box-shadow] focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2',
        isLocked && 'opacity-75',
        className,
      )}
    >
      <Card
        padding="none"
        className={cn(
          'relative h-full overflow-hidden border-slate-200/90 shadow-sm transition-shadow',
          isLocked
            ? 'group-hover:border-red-200 group-hover:shadow-md'
            : 'group-hover:border-slate-300/90 group-hover:shadow-md',
        )}
      >
        {/* Lock overlay badge */}
        {isLocked && (
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 shadow-sm ring-1 ring-red-200">
            <Lock className="size-3.5" aria-hidden />
            Access Required
          </div>
        )}

        <CardHeader
          className={cn(
            'border-b border-slate-100 px-5 pb-4 pt-5',
            isLocked
              ? 'bg-gradient-to-br from-red-50/60 to-white'
              : 'bg-gradient-to-br from-slate-50/90 to-white',
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <Badge variant="outline" className="font-normal">
              {course.category}
            </Badge>
            <Badge variant={levelVariant[course.level]}>{course.level}</Badge>
          </div>
          <CardTitle
            className={cn(
              'mt-3 text-lg leading-snug',
              isLocked
                ? 'text-slate-500 group-hover:text-red-600'
                : 'group-hover:text-[var(--color-brand)]',
            )}
          >
            {course.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-sm">{course.shortDescription}</CardDescription>
        </CardHeader>

        <CardContent className="px-5 py-4">
          <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <Clock className="size-4 shrink-0 text-slate-400" aria-hidden />
              <dt className="sr-only">Duration</dt>
              <dd>{course.duration}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="size-4 shrink-0 text-slate-400" aria-hidden />
              <dt className="sr-only">Modules</dt>
              <dd>{course.moduleCount} modules</dd>
            </div>
            <div className="flex w-full items-center justify-between border-t border-slate-100 pt-3 sm:w-auto sm:border-0 sm:pt-0">
              {isLocked ? (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-red-500">
                  <Lock className="size-4" aria-hidden />
                  Locked
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-brand)]">
                  <BookOpen className="size-4" aria-hidden />
                  View course
                </span>
              )}
              <ArrowRight
                className={cn(
                  'size-4 transition-transform group-hover:translate-x-0.5',
                  isLocked ? 'text-red-300 group-hover:text-red-500' : 'text-slate-400 group-hover:text-[var(--color-brand)]',
                )}
                aria-hidden
              />
            </div>
          </dl>
        </CardContent>
      </Card>
    </Link>
  );
}
