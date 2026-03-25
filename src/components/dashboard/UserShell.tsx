import type { ReactNode } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  BookMarked,
  BookOpen,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  MonitorPlay,
  UserRound,
} from 'lucide-react';
import { AppNavLink } from '../navigation';
import { Separator } from '../ui';
import { cn } from '../../utils/cn';

const navClass = 'w-full justify-start';

type NavItem = {
  to: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
};

const mainNav: NavItem[] = [
  {
    to: '/user-dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="size-4 shrink-0 opacity-80" aria-hidden />,
    end: true,
  },
  {
    to: '/courses',
    label: 'Courses',
    icon: <BookOpen className="size-4 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/my-courses',
    label: 'My Courses',
    icon: <BookMarked className="size-4 shrink-0 opacity-80" aria-hidden />,
    end: true,
  },
  {
    to: '/videos',
    label: 'Videos',
    icon: <MonitorPlay className="size-4 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/files',
    label: 'Files',
    icon: <FolderOpen className="size-4 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: <UserRound className="size-4 shrink-0 opacity-80" aria-hidden />,
    end: true,
  },
];

export function UserShell() {
  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b from-slate-50 to-slate-100/90 lg:flex-row">
      <aside
        className={cn(
          'flex flex-col border-b border-slate-200/90 bg-white shadow-sm',
          'lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:border-slate-200/90',
        )}
      >
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-4 lg:px-5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[var(--color-brand)]/10 text-[var(--color-brand)]">
            <GraduationCap className="size-5" strokeWidth={1.75} aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">Learning hub</p>
            <p className="truncate text-xs text-slate-500">Tutorial portal</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-3 lg:overflow-y-auto" aria-label="Main">
          <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Navigate
          </p>
          {mainNav.map((item) => (
            <AppNavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={navClass}
            >
              {item.icon}
              {item.label}
            </AppNavLink>
          ))}
        </nav>

        <div className="mt-auto p-3">
          <Separator className="mb-3" />
          <Link
            to="/"
            className="block rounded-lg px-3 py-2 text-center text-xs font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
          >
            ← Back to website
          </Link>
        </div>
      </aside>

      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
