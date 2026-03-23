import { useMemo, useState } from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';
import {
  CourseList,
  CoursesToolbar,
  MOCK_COURSES,
} from '../../components/courses';
import { Callout } from '../../components/feedback';
import { PageHeader, Stack } from '../../components/layout';


// Mock list of bought courses by selecting some IDs from MOCK_COURSES
const BOUGHT_COURSE_IDS = ['1', '3', '6'];

function useBoughtCourses() {
  return useMemo(() => {
    return MOCK_COURSES.filter((course) => BOUGHT_COURSE_IDS.includes(course.id));
  }, []);
}

function useUniqueCategories(courses: typeof MOCK_COURSES) {
  return useMemo(() => {
    const set = new Set(courses.map((c) => c.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [courses]);
}

const MyCourses = () => {
  const boughtCourses = useBoughtCourses();
  const categories = useUniqueCategories(boughtCourses);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return boughtCourses.filter((course) => {
      if (activeCategory && course.category !== activeCategory) return false;
      if (!q) return true;
      return (
        course.title.toLowerCase().includes(q) ||
        course.shortDescription.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, activeCategory, boughtCourses]);

  return (
    <Stack gap="lg" className="pb-10">
      <PageHeader
        title="My Courses"
        description="View all the courses you have purchased. Continue learning where you left off or explore content at your own pace."
        actions={
          <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
            <GraduationCap className="size-4 text-[var(--color-brand)]" aria-hidden />
            {boughtCourses.length} courses
          </span>
        }
      />

      <Callout variant="info" title="My purchased courses">
        This page shows courses you have already bought. In a real application, this would be
        fetched from the backend based on your user ID.
      </Callout>

      <CoursesToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <CourseList courses={filtered} />
    </Stack>
  );
};

export default MyCourses;
