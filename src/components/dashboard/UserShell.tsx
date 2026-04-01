import { useState, type ReactNode } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  BookMarked,
  BookOpen,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  MonitorPlay,
  UserRound,
  X,
} from 'lucide-react';
import { AppNavLink } from '../navigation';
import { Separator } from '../ui';
import { cn } from '../../utils/cn';
import AppHeader from '../layout/AppHeader';
import AppFooter from '../layout/AppFooter';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 dark:bg-slate-900 lg:flex-row transition-colors">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 lg:static lg:flex',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-4 lg:px-5">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[var(--color-brand)]/10 dark:bg-[var(--color-brand)]/20 text-[var(--color-brand)] dark:text-brand-400">
              <GraduationCap className="size-5" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">HabeshaTech</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">Learning Hub</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="size-5" />
          </button>
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
              onClick={() => setIsSidebarOpen(false)}
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
            className="block rounded-lg px-3 py-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
          >
            ← Back to website
          </Link>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col transition-colors">
        <AppHeader isAdmin={false} onMenuOpen={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto w-full">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 text-slate-900 dark:text-slate-100">
            <Outlet />
          </div>
        </main>
        <AppFooter isAdmin={false} />
      </div>
    </div>
  );
}
