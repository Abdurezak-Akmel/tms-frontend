import { useMemo, useState, useEffect, useCallback } from 'react';
import { BookOpen, Plus, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CourseList,
  CoursesToolbar,
} from '../../components/courses';
import type { CourseSummary, CourseLevel } from '../../components/courses/types';
import { Callout } from '../../components/feedback';
import { PageHeader, Stack } from '../../components/layout';
import { Button } from '../../components/ui/Button';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../hooks/useAuth';

const Courses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const isAdminView = location.pathname.startsWith('/admin') || (isAdmin && isAdmin());

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await courseService.getAllCourses();
      if (response.success && response.courses) {
        const mappedCourses: CourseSummary[] = response.courses.map((c) => ({
          id: c.course_id.toString(),
          title: c.title,
          shortDescription: c.description || 'No description provided.',
          category: c.category || 'Uncategorized',
          level: (c.level ? (c.level.charAt(0).toUpperCase() + c.level.slice(1).toLowerCase()) : 'Beginner') as CourseLevel,
          duration: 'NA', // Mocked as requested
          moduleCount: 0,     // Mocked as requested
          price: c.price
        }));
        setCourses(mappedCourses);
      } else {
        setError(response.message || 'Failed to fetch courses');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const categories = useMemo(() => {
    const set = new Set(courses.map((c) => c.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [courses]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return courses.filter((course) => {
      if (activeCategory && course.category !== activeCategory) return false;
      if (!q) return true;
      return (
        course.title.toLowerCase().includes(q) ||
        course.shortDescription.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, activeCategory, courses]);

  return (
    <Stack gap="lg" className="pb-10">
      <PageHeader
        title="Courses"
        description="Browse the catalog and open any course for a full overview, modules, and next steps. All links stay inside your workspace sidebar."
        actions={
          <div className="flex items-center gap-3">
            {isAdminView && (
              <Button
                onClick={() => navigate('/admin/add-course')}
                leftIcon={<Plus className="size-4" />}
                variant="primary"
                size="sm"
              >
                Create Course
              </Button>
            )}
            <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
              <BookOpen className="size-4 text-[var(--color-brand)]" aria-hidden />
              {courses.length} courses
            </span>
          </div>
        }
      />


      {error && (
        <Callout variant="danger" title="Error loading courses">
          {error}
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={fetchCourses}>
              Try Again
            </Button>
          </div>
        </Callout>
      )}

      {!error && (
        <>
          <CoursesToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-slate-300" />
            </div>
          ) : (
            <CourseList courses={filtered} linkPrefix="/admin/courses" />
          )}
        </>
      )}
    </Stack>
  );
};

export default Courses;

