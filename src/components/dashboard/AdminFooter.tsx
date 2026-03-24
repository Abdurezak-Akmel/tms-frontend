import { ShieldCheck, Mail, HelpCircle, FileText } from 'lucide-react';

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white/50 px-4 py-8 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm">
            <ShieldCheck className="size-4" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight text-slate-900">
              Admin Control Center
            </p>
            <p className="text-[11px] font-medium text-slate-500">
              Monitoring system health and operations.
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href="mailto:support@tms.com"
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900"
          >
            <Mail className="size-3.5" />
            Support
          </a>
          <a
            href="/admin/help"
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900"
          >
            <HelpCircle className="size-3.5" />
            Help Center
          </a>
          <a
            href="/admin/docs"
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900"
          >
            <FileText className="size-3.5" />
            Documentation
          </a>
        </nav>

        <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
          <p>© {currentYear} TMS. All rights reserved.</p>
          <div className="size-1 rounded-full bg-slate-200"></div>
          <p>Version 2.4.0 (Stable)</p>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
