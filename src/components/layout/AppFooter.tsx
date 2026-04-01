import { ShieldCheck, Mail, HelpCircle, GraduationCap, Heart } from 'lucide-react';

interface AppFooterProps {
  isAdmin?: boolean;
}

const AppFooter = ({ isAdmin = false }: AppFooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-[#30363d] bg-white/60 dark:bg-[#161b22]/60 px-4 py-6 backdrop-blur-sm sm:px-6 lg:px-8 transition-all duration-300">
      <div className="mx-auto flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex size-8 items-center justify-center rounded-lg text-white shadow-sm ${isAdmin ? 'bg-gradient-to-br from-violet-600 to-indigo-700' : 'bg-gradient-to-br from-indigo-600 to-violet-600'}`}>
            {isAdmin ? <ShieldCheck className="size-4" aria-hidden /> : <GraduationCap className="size-4" aria-hidden />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-[#f0f6fc]">
              {isAdmin ? 'Admin Control Center' : 'HabeshaTech'}
            </p>
            <p className="text-[11px] font-medium text-slate-400 dark:text-[#8b949e]">
              {isAdmin ? 'Monitoring system health and operations.' : 'Your path to knowledge.'}
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a
            href="mailto:support@tms.com"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-[#8b949e] transition-colors hover:text-[var(--color-brand)] dark:hover:text-[var(--color-brand-light)]"
          >
            <Mail className="size-3.5" />
            Support
          </a>
          <a
            href={isAdmin ? "/admin/help" : "/help"}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-[#8b949e] transition-colors hover:text-[var(--color-brand)] dark:hover:text-[var(--color-brand-light)]"
          >
            <HelpCircle className="size-3.5" />
            Help Center
          </a>
        </nav>

        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400 dark:text-[#484f58]">
          <p className="flex items-center gap-1">
            Made with <Heart className="size-3 text-rose-400 fill-rose-400" /> © {currentYear} TMS
          </p>
          <div className="size-1 rounded-full bg-slate-200 dark:bg-[#30363d]" />
          <p>v1.0.0</p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
