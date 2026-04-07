import { useMemo, useState, useEffect, useCallback } from 'react';
import { BookOpen } from 'lucide-react';
import {
  CourseList,
  CoursesToolbar,
} from '../../components/courses';
import type { CourseSummary, CourseLevel } from '../../components/courses/types';
import { Callout } from '../../components/feedback';
import { PageHeader, Stack } from '../../components/layout';
import { Button } from '../../components/ui/Button';
import { courseService } from '../../services/courseService';
import { roleCourseService } from '../../services/roleCourseService';
import { accessRequestService } from '../../services/accessRequestService';
import { useAuth } from '../../hooks/useAuth';

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // role_id 1 is admin — admins have full access to all courses
  const isAdmin = user?.role_id === 1;

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch all courses from the database
      // 2. Fetch courses assigned to the user's role (unless admin)
      // 3. Fetch user's approved access requests
      const [allCoursesRes, roleCoursesRes, accessRequestsRes] = await Promise.all([
        courseService.getAllCourses(),
        !isAdmin && user?.role_id ? roleCourseService.getCoursesByRoleId(user.role_id) : Promise.resolve({ success: true, courses: [] }),
        !isAdmin ? accessRequestService.getUserAccessRequests() : Promise.resolve({ success: true, data: [] })
      ]);

      if (!allCoursesRes.success || !allCoursesRes.courses) {
        setError(allCoursesRes.message || 'Failed to fetch courses.');
        return;
      }

      let assignedIds = new Set<number>();
      if (isAdmin) {
        // Admins see everything as unlocked
        assignedIds = new Set(allCoursesRes.courses.map((c) => c.course_id));
      } else {
        // Add role-assigned courses
        if (roleCoursesRes.success && roleCoursesRes.courses) {
          roleCoursesRes.courses.forEach((c: any) => assignedIds.add(c.course_id));
        }

        // Add approved access requests
        if (accessRequestsRes.success && accessRequestsRes.data) {
          const requests = Array.isArray(accessRequestsRes.data) ? accessRequestsRes.data : [accessRequestsRes.data];
          requests.forEach((req: any) => {
            if (req.status === 'approved') {
              assignedIds.add(req.course_id);
            }
          });
        }
      }

      // 3. Map database courses to the UI summary format
      const mappedCourses: CourseSummary[] = allCoursesRes.courses.map((c) => ({
        id: c.course_id.toString(),
        title: c.title,
        shortDescription: c.description || 'No description provided.',
        category: c.category || 'Uncategorized',
        level: (c.level
          ? c.level.charAt(0).toUpperCase() + c.level.slice(1).toLowerCase()
          : 'Beginner') as CourseLevel,
        duration: c.duration || 'N/A',
        moduleCount: 10,     // Placeholder as not in DB
        price: c.price || 'Free',
        locked: !assignedIds.has(c.course_id),
      }));

      setCourses(mappedCourses);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.role_id, isAdmin]);

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

  const accessibleCount = courses.filter((c) => !c.locked).length;

  return (
    <Stack gap="lg" className="pb-10 animate-fade-in-up">
      <PageHeader
        title="Courses"
        description="Browse the full catalog. Courses assigned to your role are fully accessible; others require admin access."
        actions={
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#21262d] px-3 py-2 text-sm font-medium text-slate-700 dark:text-[#e6edf3] shadow-sm transition-colors">
              <BookOpen className="size-4 text-[var(--color-brand)] dark:text-indigo-400" aria-hidden />
              {accessibleCount} / {courses.length} accessible
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
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-brand)] border-t-transparent" />
            </div>
          ) : (
            <CourseList courses={filtered} linkPrefix="/courses" />
          )}
        </>
      )}
    </Stack>
  );
};

export default Courses;