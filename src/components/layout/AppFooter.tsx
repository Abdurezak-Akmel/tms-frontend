import { ShieldCheck, Mail, HelpCircle, GraduationCap } from 'lucide-react';

interface AppFooterProps {
  isAdmin?: boolean;
}

const AppFooter = ({ isAdmin = false }: AppFooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-4 py-8 backdrop-blur-sm sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="mx-auto flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-800 text-white shadow-sm">
            {isAdmin ? <ShieldCheck className="size-4" aria-hidden /> : <GraduationCap className="size-4" aria-hidden />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {isAdmin ? 'Admin Control Center' : 'HabeshaTech'}
            </p>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {isAdmin ? 'Monitoring system health and operations.' : 'Your path to knowledge.'}
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href="mailto:support@tms.com"
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-slate-200"
          >
            <Mail className="size-3.5" />
            Support
          </a>
          <a
            href={isAdmin ? "/admin/help" : "/help"}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-slate-200"
          >
            <HelpCircle className="size-3.5" />
            Help Center
          </a>
        </nav>

        <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
          <p>© {currentYear} TMS. All rights reserved.</p>
          <div className="size-1 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          <p>Version 1.0.0 (Stable)</p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
