import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  LogOut,
  Sparkles,
  Target,
} from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';

import {
  Badge,
  Button,
  ButtonLink,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui';

import { PageHeader, Stack } from '../../components/layout';
import { authService } from '../../services/authService';


const statCards = [
  { label: 'Enrolled courses', value: '4', hint: 'Active this term', tone: 'default' as const },
  { label: 'Hours this week', value: '6.5', hint: 'Study time tracked', tone: 'default' as const },
  { label: 'Due soon', value: '2', hint: 'Assignments & quizzes', tone: 'warning' as const },
  { label: 'Completed', value: '12', hint: 'Lessons finished', tone: 'success' as const },
];

const continueItems = [
  {
    title: 'React patterns & hooks',
    course: 'Frontend fundamentals',
    progress: 68,
    href: '/courses',
  },
  {
    title: 'REST APIs & security basics',
    course: 'Backend essentials',
    progress: 41,
    href: '/courses',
  },
  {
    title: 'Data modeling workshop',
    course: 'Database track',
    progress: 15,
    href: '/my-courses',
  },
];

const weekFocus = [
  'Finish Module 3 quiz for Frontend fundamentals',
  'Upload receipt for Spring cohort (if applicable)',
  'Watch “Deployment checklist” in Videos',
  'Review file notes in the Files library',
];

const activity = [
  { label: 'Marked lesson complete', detail: 'State & effects — Frontend fundamentals', when: 'Today' },
  { label: 'Opened course catalog', detail: 'Browsed new electives', when: 'Yesterday' },
  { label: 'Profile updated', detail: 'Notification preferences saved', when: 'This week' },
];

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      authService.clearTokens();
      navigate('/user-login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API fails, clear tokens and redirect
      authService.clearTokens();
      navigate('/user-login');
    }
  };

  return (
    <Stack gap="lg" className="pb-8">
      <PageHeader
        title="Dashboard"
        description="Pick up where you left off, track progress, and jump into courses, videos, and files from one place."
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              leftIcon={<LogOut className="size-4" />}
              onClick={handleLogout}
            >
              Logout
            </Button>
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
            {continueItems.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 transition-colors hover:border-slate-200/90"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.course}</p>
                  </div>
                  <ButtonLink to={item.href} variant="outline" size="sm" className="shrink-0">
                    Resume
                  </ButtonLink>
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>Progress</span>
                    <span className="font-medium text-slate-700">{item.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200/80">
                    <div
                      className="h-full rounded-full bg-[var(--color-brand)] transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
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
              {weekFocus.map((line) => (
                <li key={line} className="flex gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
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
              {activity.map((row) => (
                <li
                  key={row.label}
                  className="flex flex-col gap-0.5 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <p className="text-sm font-medium text-slate-900">{row.label}</p>
                  <p className="text-sm text-slate-600">{row.detail}</p>
                  <p className="text-xs text-slate-400">{row.when}</p>
                </li>
              ))}
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
