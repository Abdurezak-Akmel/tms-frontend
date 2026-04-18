import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Target,
  TrendingUp,
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

        let videoCount = 0;
        let fileCount = 0;

        await Promise.all(myCourses.map(async (c) => {
          const [videosRes, materialsRes] = await Promise.all([
            videoService.getVideosByCourseId(c.course_id),
            courseMaterialService.getMaterialsByCourseId(c.course_id).catch(() => ({ success: false, materials: [] }))
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
    {
      label: 'Enrolled Courses',
      value: stats.enrolledCourses.toString(),
      hint: 'Total access',
      tone: 'success' as const,
      icon: BookOpen,
      iconBg: 'bg-emerald-50/50 dark:bg-emerald-950/40',
      iconColor: 'text-emerald-700 dark:text-emerald-400',
    },
    {
      label: 'Unlocked Videos',
      value: stats.totalVideos.toString(),
      hint: 'Available to watch',
      tone: 'default' as const,
      icon: TrendingUp,
      iconBg: 'bg-indigo-50/50 dark:bg-indigo-950/40',
      iconColor: 'text-indigo-700 dark:text-indigo-400',
    },
    {
      label: 'Unlocked Files',
      value: stats.totalFiles.toString(),
      hint: 'Downloadable resources',
      tone: 'default' as const,
      icon: Target,
      iconBg: 'bg-violet-50/50 dark:bg-violet-950/40',
      iconColor: 'text-violet-700 dark:text-violet-400',
    },
    {
      label: 'Pending Requests',
      value: stats.pendingRequests.toString(),
      hint: 'Enrollments under review',
      tone: 'warning' as const,
      icon: Clock,
      iconBg: 'bg-amber-50/50 dark:bg-amber-950/40',
      iconColor: 'text-amber-700 dark:text-amber-400',
    },
  ];

  return (
    <Stack gap="lg" className="pb-8 animate-fade-in-up">
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

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} padding="md" className="border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-0">
                <div className="flex items-start justify-between gap-3">
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${s.iconBg}`}>
                    <Icon className={`size-5 ${s.iconColor}`} strokeWidth={1.75} />
                  </div>
                  <Badge variant={s.tone === 'warning' ? 'warning' : s.tone === 'success' ? 'success' : 'info'}>
                    {s.tone === 'warning' ? 'Pending' : s.tone === 'success' ? 'Enrolled' : 'Live'}
                  </Badge>
                </div>
                <div className="mt-3">
                  <p className="text-3xl font-black tabular-nums text-black dark:text-[#f0f6fc]">{s.value}</p>
                  <p className="mt-0.5 text-xs font-black uppercase tracking-widest text-black/60 dark:text-[#8b949e]">{s.label}</p>
                  <p className="mt-1 text-xs font-bold text-black/70 dark:text-[#8b949e]">{s.hint}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Continue learning */}
        <Card className="border-slate-200/80 dark:border-[#30363d] bg-white dark:bg-slate-900 shadow-sm lg:col-span-2" padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-black dark:text-slate-100">
              <BookOpen className="size-6 text-indigo-600 dark:text-indigo-400" aria-hidden />
              Continue learning
            </CardTitle>
            <CardDescription className="text-black font-bold">
              Your most recent modules — open the course catalog or my courses for the full list.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-brand)] border-t-transparent" />
              </div>
            ) : activeCourses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-10 text-center">
                <BookOpen className="mx-auto mb-3 size-10 text-slate-300 dark:text-slate-600" />
                <p className="text-base font-bold text-black dark:text-slate-300">
                  You haven't enrolled in any courses yet.
                </p>
                <div className="mt-4">
                  <ButtonLink to="/courses" variant="primary" size="md">
                    Browse Catalog
                  </ButtonLink>
                </div>
              </div>
            ) : (
              activeCourses.map((c) => (
                <div
                  key={c.course_id}
                  className="group rounded-xl border border-slate-100 dark:border-[#30363d] bg-slate-50/60 dark:bg-[#0d1117]/40 p-4 transition-all duration-150 hover:border-indigo-200 dark:hover:border-indigo-900/60 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-1">
                      <p className="text-base font-black text-black dark:text-slate-100 group-hover:text-indigo-600 transition-colors">{c.title}</p>
                      <p className="text-xs font-black uppercase tracking-wider text-black/40 dark:text-slate-400">{c.category || 'Uncategorized'}</p>
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

        {/* This week checklist */}
        <Card className="border-slate-200/80 dark:border-[#30363d] bg-white dark:bg-slate-900 shadow-sm" padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-black text-black dark:text-slate-100">
              <Target className="size-6 text-indigo-600 dark:text-indigo-400" aria-hidden />
              This week
            </CardTitle>
            <CardDescription className="text-black font-bold">A focused checklist to stay on schedule.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {[
                'Check newly assigned courses',
                'Review new files and notes uploaded',
                'Stay up-to-date with course videos',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm font-black text-black dark:text-[#8b949e]">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm">
              <p className="flex items-center gap-3 text-sm font-black text-black dark:text-slate-300">
                <Calendar className="size-5 text-indigo-600" aria-hidden />
                Tip: block 25 minutes daily for video lessons.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent activity */}
        <Card className="border-slate-200/80 dark:border-[#30363d] bg-white dark:bg-slate-900 shadow-sm" padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-black text-black dark:text-slate-100">
              <Clock className="size-6 text-indigo-600 dark:text-indigo-400" aria-hidden />
              Recent activity
            </CardTitle>
            <CardDescription className="text-black font-bold">Your latest enrollment and access events.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {stats.pendingRequests > 0 && (
                <li className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 pb-5 last:border-0 last:pb-0">
                  <p className="text-base font-black text-black dark:text-slate-100">Pending Requests</p>
                  <p className="text-sm font-bold text-black/80 dark:text-slate-400">
                    You have {stats.pendingRequests} enrollment {stats.pendingRequests === 1 ? 'request' : 'requests'} under admin review.
                  </p>
                </li>
              )}
              {activeCourses.length > 0 && (
                <li className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 pb-5 last:border-0 last:pb-0">
                  <p className="text-base font-black text-black dark:text-slate-100">Enrolled</p>
                  <p className="text-sm font-bold text-black/80 dark:text-slate-400">
                    You now have access to {stats.enrolledCourses} {stats.enrolledCourses === 1 ? 'course' : 'courses'}.
                  </p>
                </li>
              )}
              {stats.pendingRequests === 0 && activeCourses.length === 0 && (
                <p className="text-sm font-black text-black/60 dark:text-slate-400">
                  No recent activity detected. Enroll in a course to get started!
                </p>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Explore resources */}
        <Card className="border-slate-200/80 dark:border-[#30363d] bg-gradient-to-br from-indigo-50/60 via-white to-violet-50/30 dark:from-indigo-950/20 dark:via-[#161b22] dark:to-violet-950/10 shadow-sm" padding="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-black text-black dark:text-slate-100">
              <Sparkles className="size-6 text-indigo-600 dark:text-indigo-400" aria-hidden />
              Explore resources
            </CardTitle>
            <CardDescription className="text-black font-bold">Shortcuts to the main areas of your workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                { to: '/videos', label: 'Watch videos' },
                { to: '/files', label: 'Open files' },
                { to: '/profile', label: 'My Profile' },
                { to: '/my-courses', label: 'My courses' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group flex items-center justify-between rounded-2xl border border-slate-100 dark:border-[#30363d] bg-white dark:bg-[#21262d] px-5 py-4 text-base font-bold text-black dark:text-[#e6edf3] shadow-sm transition-all duration-300 hover:border-indigo-600/40 dark:hover:border-indigo-700/60 hover:bg-slate-50 dark:hover:bg-indigo-950/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
                >
                  {link.label}
                  <ArrowRight className="size-5 text-slate-300 dark:text-slate-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Stack>
  );
};

export default UserDashboard;
