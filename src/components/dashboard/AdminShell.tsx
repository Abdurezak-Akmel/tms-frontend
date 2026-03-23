import type { ReactNode } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  FileText,
  FolderOpen,
  LayoutDashboard,
  MonitorPlay,
  Settings as SettingsIcon,
  ShieldCheck,
  UserRound,
  Users as UsersIcon,
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

const adminNav: NavItem[] = [
  {
    to: '/admin-dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="size-4 shrink-0 opacity-80" aria-hidden />,
    end: true,
  },
  {
    to: '/admin/access-requests',
    label: 'Access Requests',
    icon: <ClipboardList className="size-4 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/admin/courses',
    label: 'Courses',
    icon: <BookOpen className="size-4 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/admin/analytics',
    label: 'Analytics',
    icon: <BarChart3 className="size-4 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/admin/reports',
    label: 'Reports',
    icon: <FileText className="size-4 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/admin/users',
    label: 'Users',
    icon: <UsersIcon className="size-4 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/admin/roles',
    label: 'Roles',
    icon: <ShieldCheck className="size-4 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/admin/settings',
    label: 'Settings',
    icon: <SettingsIcon className="size-4 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/admin/profile',
    label: 'Profile',
    icon: <UserRound className="size-4 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/admin/videos',
    label: 'Videos',
    icon: <MonitorPlay className="size-4 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/admin/files',
    label: 'Files',
    icon: <FolderOpen className="size-4 shrink-0 opacity-80" aria-hidden />,
  },
];


export function AdminShell() {
  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 lg:flex-row">
      <aside
        className={cn(
          'flex flex-col border-b border-slate-200 bg-white shadow-sm',
          'lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:border-slate-200',
        )}
      >
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-4 lg:px-5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
            <ShieldCheck className="size-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">Admin Control</p>
            <p className="truncate text-xs text-slate-500">System management</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-3 lg:overflow-y-auto" aria-label="Admin">
          <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Management
          </p>
          {adminNav.map((item) => (
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
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
