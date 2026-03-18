import React from 'react';
import { CourseCard } from '../data-display';
import { LoadingSpinner } from '../ui';
import type { Course } from '../../services/courseService';

interface CourseListProps {
  courses: Course[];
  loading?: boolean;
  onEnroll?: (courseId: number) => void;
  onView?: (courseId: number) => void;
  emptyMessage?: string;
  columns?: number;
}

const CourseList: React.FC<CourseListProps> = ({
  courses,
  loading = false,
  onEnroll,
  onView,
  emptyMessage = 'No courses available',
  columns = 3
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols] || gridCols[3]} gap-6`}>
      {courses.map((course) => (
        <CourseCard
          key={course.course_id}
          course={course}
          onEnroll={onEnroll}
          onView={onView}
        />
      ))}
    </div>
  );
};

export default CourseList;
