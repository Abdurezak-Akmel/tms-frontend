import { useMemo, useState } from 'react';
import { BookOpen } from 'lucide-react';
import {
  CourseList,
  CoursesToolbar,
  MOCK_COURSES,
} from '../../components/courses';
import { Callout } from '../../components/feedback';
import { PageHeader, Stack } from '../../components/layout';

function useUniqueCategories() {
  return useMemo(() => {
    const set = new Set(MOCK_COURSES.map((c) => c.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);
}

const Courses = () => {
  const categories = useUniqueCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MOCK_COURSES.filter((course) => {
      if (activeCategory && course.category !== activeCategory) return false;
      if (!q) return true;
      return (
        course.title.toLowerCase().includes(q) ||
        course.shortDescription.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, activeCategory]);

  return (
    <Stack gap="lg" className="pb-10">
      <PageHeader
        title="Courses"
        description="Browse the catalog and open any course for a full overview, modules, and next steps. All links stay inside your workspace sidebar."
        actions={
          <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
            <BookOpen className="size-4 text-[var(--color-brand)]" aria-hidden />
            {MOCK_COURSES.length} courses
          </span>
        }
      />

      <Callout variant="info" title="Demo catalog">
        Course data is static for now—swap <code className="rounded bg-white/80 px-1 py-0.5 text-xs">MOCK_COURSES</code> for
        your API when you wire the backend.
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

export default Courses;
