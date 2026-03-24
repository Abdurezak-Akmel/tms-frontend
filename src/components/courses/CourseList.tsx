import { CourseCard } from './CourseCard';
import { EmptyState } from '../feedback/EmptyState';
import type { CourseSummary } from './types';

export type CourseListProps = {
  courses: CourseSummary[];
  linkPrefix?: string;
};

export function CourseList({ courses, linkPrefix }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <EmptyState
        title="No courses match"
        description="Try another search term or clear the category filter."
      />
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <li key={course.id}>
          <CourseCard 
            course={course} 
            href={linkPrefix ? `${linkPrefix}/${course.id}` : undefined} 
          />
        </li>
      ))}
    </ul>
  );
}

