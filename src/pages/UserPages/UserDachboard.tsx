import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Target,
} from 'lucide-react';

import { Link } from 'react-router-dom';

import {
  Badge,
  ButtonLink,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui';

import { PageHeader, Stack } from '../../components/layout';

import { useAuth } from '../../hooks/useAuth';
import { courseService } from '../../services/courseService';
import { roleCourseService } from '../../services/roleCourseService';
import { accessRequestService } from '../../services/accessRequestService';
import { videoService } from '../../services/videoService';
import { courseMaterialService } from '../../services/courseMaterialService';
import { useState, useEffect } from 'react';

const UserDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    enrolledCourses: 0,
    totalVideos: 0,
    totalFiles: 0,
    pendingRequests: 0,
  });

  const [activeCourses, setActiveCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.role_id) return;

      setIsLoading(true);
      try {
        const [allCoursesRes, roleCoursesRes, accessRequestsRes] = await Promise.all([
          courseService.getAllCourses(),
          roleCourseService.getCoursesByRoleId(user.role_id),
          accessRequestService.getUserAccessRequests()
        ]);

        const assignedIds = new Set<number>();
        let pendingCount = 0;

        if (roleCoursesRes.success && roleCoursesRes.courses) {
          roleCoursesRes.courses.forEach((c: any) => assignedIds.add(c.course_id));
        }

        if (accessRequestsRes.success && accessRequestsRes.data) {
          const requests = Array.isArray(accessRequestsRes.data) ? accessRequestsRes.data : [accessRequestsRes.data];
          requests.forEach((req: any) => {
            if (req.status === 'approved') {
              assignedIds.add(req.course_id);
            } else if (req.status === 'pending') {
              pendingCount++;
            }
          });
        }

        let myCourses: any[] = [];
        if (allCoursesRes.success && allCoursesRes.courses) {
          myCourses = allCoursesRes.courses.filter(c => assignedIds.has(c.course_id));
        }

        // Fetch videos and materials for enrolled courses
        let videoCount = 0;
        let fileCount = 0;

        // In a real robust system, this might be a single aggregate API call.
        // For now, we perform parallel calls for each enrolled course.
        await Promise.all(myCourses.map(async (c) => {
          const [videosRes, materialsRes] = await Promise.all([
            videoService.getVideosByCourseId(c.course_id),
            courseMaterialService.getMaterialsByCourseId(c.course_id).catch(() => ({ success: false, materials: [] })) // catch if none
          ]);

          if (videosRes.success && videosRes.videos) videoCount += videosRes.videos.length;
          if (materialsRes.success && materialsRes.materials) fileCount += materialsRes.materials.length;
        }));

        setStats({
          enrolledCourses: myCourses.length,
          totalVideos: videoCount,
          totalFiles: fileCount,
          pendingRequests: pendingCount,
        });

        // Use up to 3 courses for the "Continue learning" section
        setActiveCourses(myCourses.slice(0, 3));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const statCards = [
    { label: 'Enrolled courses', value: stats.enrolledCourses.toString(), hint: 'Total access', tone: 'success' as const },
    { label: 'Unlocked Videos', value: stats.totalVideos.toString(), hint: 'Available to watch', tone: 'default' as const },
    { label: 'Unlocked Files', value: stats.totalFiles.toString(), hint: 'Downloadable resources', tone: 'default' as const },
    { label: 'Pending Requests', value: stats.pendingRequests.toString(), hint: 'Enrollments under review', tone: 'warning' as const },
  ];

  return (
    <Stack gap="lg" className="pb-8">
      <PageHeader
        title="Dashboard"
        description="Pick up where you left off, track progress, and jump into courses, videos, and files from one place."
        actions={
          <div className="flex items-center gap-3">
            <ButtonLink to="/courses" variant="primary" size="md" rightIcon={<ArrowRight className="size-4" />}>
              Browse courses
            </ButtonLink>
          </div>
        }
      />


      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label} padding="md" className="border-slate-200/90 shadow-sm">
            <CardContent className="pt-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums text-slate-900">{s.value}</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-xs text-slate-500">{s.hint}</p>
                <Badge variant={s.tone === 'warning' ? 'warning' : s.tone === 'success' ? 'success' : 'outline'}>
                  {s.tone === 'warning' ? 'Action' : s.tone === 'success' ? 'On track' : 'Live'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-slate-200/90 shadow-sm lg:col-span-2" padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="size-5 text-[var(--color-brand)]" aria-hidden />
              Continue learning
            </CardTitle>
            <CardDescription>
              Your most recent modules — open the course catalog or my courses for the full list.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-brand)] border-t-transparent"></div>
              </div>
            ) : activeCourses.length === 0 ? (
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-6 text-center text-slate-500">
                You haven't enrolled in any courses yet.
                <div className="mt-3">
                  <ButtonLink to="/courses" variant="outline" size="sm">
                    Browse Catalog
                  </ButtonLink>
                </div>
              </div>
            ) : (
              activeCourses.map((c) => (
                <div
                  key={c.course_id}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 transition-colors hover:border-slate-200/90"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-1">
                      <p className="font-medium text-slate-900">{c.title}</p>
                      <p className="text-sm text-slate-500">{c.category || 'Uncategorized'}</p>
                    </div>
                    <ButtonLink to={`/courses/${c.course_id}`} variant="outline" size="sm" className="shrink-0">
                      View
                    </ButtonLink>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 shadow-sm" padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="size-5 text-[var(--color-brand)]" aria-hidden />
              This week
            </CardTitle>
            <CardDescription>A focused checklist to stay on schedule.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex gap-2 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
                <span>Check newly assigned courses</span>
              </li>
              <li className="flex gap-2 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
                <span>Review new files and notes uploaded</span>
              </li>
              <li className="flex gap-2 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
                <span>Stay up-to-date with course videos</span>
              </li>
            </ul>
            <div className="mt-6 rounded-lg border border-dashed border-slate-200 bg-white/80 p-3 text-xs text-slate-600">
              <p className="flex items-center gap-2 font-medium text-slate-800">
                <Calendar className="size-4 text-slate-400" aria-hidden />
                Tip: block 25 minutes daily for video lessons.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200/90 shadow-sm" padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="size-5 text-[var(--color-brand)]" aria-hidden />
              Recent activity
            </CardTitle>
            <CardDescription>Illustrative timeline — connect real data when your API is ready.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {stats.pendingRequests > 0 && (
                <li
                  className="flex flex-col gap-0.5 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <p className="text-sm font-medium text-slate-900">Pending Requests</p>
                  <p className="text-sm text-slate-600">You have {stats.pendingRequests} enrollment requests under admin review.</p>
                </li>
              )}
              {activeCourses.length > 0 && (
                <li
                  className="flex flex-col gap-0.5 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <p className="text-sm font-medium text-slate-900">Enrolled</p>
                  <p className="text-sm text-slate-600">You now have access to {stats.enrolledCourses} courses.</p>
                </li>
              )}
              {stats.pendingRequests === 0 && activeCourses.length === 0 && (
                <p className="text-sm text-slate-500">No recent activity detected. Enroll in a course to get started!</p>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 bg-gradient-to-br from-indigo-50/80 via-white to-white shadow-sm" padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="size-5 text-[var(--color-brand)]" aria-hidden />
              Explore resources
            </CardTitle>
            <CardDescription>Shortcuts to the main areas of your workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link
                to="/videos"
                className="rounded-xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm transition hover:border-[var(--color-brand)]/30 hover:shadow"
              >
                Watch videos →
              </Link>
              <Link
                to="/files"
                className="rounded-xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm transition hover:border-[var(--color-brand)]/30 hover:shadow"
              >
                Open files →
              </Link>
              <Link
                to="/profile"
                className="rounded-xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm transition hover:border-[var(--color-brand)]/30 hover:shadow"
              >
                Edit profile →
              </Link>
              <Link
                to="/my-courses"
                className="rounded-xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm transition hover:border-[var(--color-brand)]/30 hover:shadow"
              >
                My courses →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Stack>
  );
};

export default UserDashboard;
