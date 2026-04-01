import { useMemo, useState, useEffect, useCallback } from 'react';
import { GraduationCap } from 'lucide-react';
import {
  CourseList,
  CoursesToolbar,
} from '../../components/courses';
import type { CourseSummary, CourseLevel } from '../../components/courses/types';
import { Callout } from '../../components/feedback';
import { PageHeader, Stack } from '../../components/layout';
import { courseService } from '../../services/courseService';
import { roleCourseService } from '../../services/roleCourseService';
import { accessRequestService } from '../../services/accessRequestService';
import { useAuth } from '../../hooks/useAuth';

const MyCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const fetchMyCourses = useCallback(async () => {
    if (!user?.role_id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch all courses
      // 2. Fetch courses assigned to the user's role
      // 3. Fetch user's approved access requests
      const [allCoursesRes, roleCoursesRes, accessRequestsRes] = await Promise.all([
        courseService.getAllCourses(),
        roleCourseService.getCoursesByRoleId(user.role_id),
        accessRequestService.getUserAccessRequests()
      ]);

      if (!allCoursesRes.success || !allCoursesRes.courses) {
        setError(allCoursesRes.message || 'Failed to fetch courses.');
        return;
      }

      // Identify which IDs are assigned or approved
      const assignedIds = new Set<number>();

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

      // Filter and map matching courses
      const myCourses = allCoursesRes.courses.filter(c => assignedIds.has(c.course_id));
      const mappedCourses: CourseSummary[] = myCourses.map((c) => ({
        id: c.course_id.toString(),
        title: c.title,
        shortDescription: c.description || 'No description provided.',
        category: c.category || 'Uncategorized',
        level: (c.level
          ? c.level.charAt(0).toUpperCase() + c.level.slice(1).toLowerCase()
          : 'Beginner') as CourseLevel,
        duration: '8 weeks', // Placeholder
        moduleCount: 10,     // Placeholder
        price: c.price || 'Free',
        locked: false,
      }));

      setCourses(mappedCourses);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.role_id]);

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

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
    <Stack gap="lg" className="pb-10 animate-fade-in-up">
      <PageHeader
        title="My Courses"
        description="Continue learning from the courses assigned to your professional role."
        actions={
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#21262d] px-3 py-2 text-sm font-medium text-slate-700 dark:text-[#e6edf3] shadow-sm transition-colors">
              <GraduationCap className="size-4 text-[var(--color-brand)] dark:text-indigo-400" aria-hidden />
              {courses.length} {courses.length === 1 ? 'course' : 'courses'}
            </span>
          </div>
        }
      />

      {error && (
        <Callout variant="danger" title="Error loading your courses">
          {error}
        </Callout>
      )}

      {user?.role_id === 1 && (
        <Callout variant="info" title="Administrator view">
          As an administrator, you can view all courses in the catalog, but this page only shows those explicitly assigned to your admin role.
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

          {!isLoading && courses.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-[#30363d] bg-slate-50/50 dark:bg-[#0d1117]/40 py-20 text-center transition-colors">
              <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-white dark:bg-[#21262d] shadow-sm ring-1 ring-slate-200/80 dark:ring-[#30363d]">
                <GraduationCap className="size-8 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-[#f0f6fc]">No courses assigned yet</h3>
              <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-[#8b949e]">
                You haven't been assigned any courses for your current role. Please check the main
                catalog to request access or contact your admin.
              </p>
            </div>
          )}
        </>
      )}
    </Stack>
  );
};

export default MyCourses;