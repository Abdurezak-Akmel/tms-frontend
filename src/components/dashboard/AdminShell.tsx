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
  ChevronRight,
} from 'lucide-react';

import { AppNavLink } from '../navigation';
import { cn } from '../../utils/cn';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';

const navClass = 'group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200';

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
    icon: <LayoutDashboard className="size-5 shrink-0 opacity-80" aria-hidden />,
    end: true,
  },
  {
    to: '/admin/courses',
    label: 'Courses',
    icon: <BookOpen className="size-5 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/admin/videos',
    label: 'Videos',
    icon: <MonitorPlay className="size-5 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/admin/files',
    label: 'Files',
    icon: <FolderOpen className="size-5 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/admin/users',
    label: 'Users',
    icon: <UsersIcon className="size-5 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/admin/roles',
    label: 'Roles',
    icon: <ShieldCheck className="size-5 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/admin/access-requests',
    label: 'Access Requests',
    icon: <ClipboardList className="size-5 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/admin/analytics',
    label: 'Analytics',
    icon: <BarChart3 className="size-5 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/admin/reports',
    label: 'Reports',
    icon: <FileText className="size-5 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/admin/profile',
    label: 'Profile',
    icon: <UserRound className="size-5 shrink-0 opacity-80" aria-hidden />,
  },
  {
    to: '/admin/settings',
    label: 'Settings',
    icon: <SettingsIcon className="size-5 shrink-0 opacity-80" aria-hidden />,
  },
];


export function AdminShell() {
  return (
    <div className="flex min-h-dvh bg-slate-50/50">
      {/* Sidebar Sidebar sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-slate-200 bg-white transition-all duration-300 lg:flex lg:w-72',
        )}
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-200 ring-4 ring-slate-50">
            <ShieldCheck className="size-6" aria-hidden />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold tracking-tight text-slate-900">TMS Admin</h1>
            <p className="truncate text-[11px] font-bold uppercase tracking-wider text-slate-400">System Management</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6" aria-label="Admin Navigation">
          <div className="mb-4 px-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 opacity-70">
              Overview
            </span>
          </div>

          <div className="space-y-1">
            {adminNav.map((item) => (
              <AppNavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navClass}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                <ChevronRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </AppNavLink>
            ))}
          </div>
        </nav>

        <div className="p-4">
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-100">
            <Link
              to="/"
              className="group flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-900 hover:text-white hover:shadow-md"
            >
              <span>View Main Website</span>
              <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Areas */}
      <div className="flex flex-1 flex-col lg:pl-72">
        <AdminHeader />

        <main className="flex-1">
          <div className="mx-auto max-w-7xl">
            <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}
