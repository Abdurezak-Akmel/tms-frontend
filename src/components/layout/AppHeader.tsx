import { useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck, Moon, Sun, GraduationCap, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import authService from '../../services/authService';
import Breadcrumbs from '../dashboard/Breadcrumbs';
import { useTheme } from '../../context/ThemeContext';

interface AppHeaderProps {
  isAdmin?: boolean;
  onMenuOpen?: () => void;
  isSidebarOpen?: boolean;
}

const AppHeader = ({ isAdmin = false, onMenuOpen, isSidebarOpen = false }: AppHeaderProps) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await authService.logout();
      authService.clearTokens();
      navigate(isAdmin ? '/admin-login' : '/user-login');
    } catch (error) {
      console.error('Logout failed:', error);
      authService.clearTokens();
      navigate(isAdmin ? '/admin-login' : '/user-login');
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200/80 dark:border-[#30363d] bg-white/80 dark:bg-[#161b22]/90 px-4 backdrop-blur-md sm:px-6 lg:px-8 transition-all duration-300 shadow-sm dark:shadow-[0_1px_0_0_#30363d]">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuOpen}
          className="flex lg:hidden size-9 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <div className="flex items-center gap-3 lg:hidden">
          <div className={`flex size-9 items-center justify-center rounded-xl text-white shadow-inner ${isAdmin ? 'bg-gradient-to-br from-violet-600 to-indigo-700' : 'bg-gradient-to-br from-indigo-600 to-violet-600'}`}>
            {isAdmin ? <ShieldCheck className="size-5" aria-hidden /> : <GraduationCap className="size-5" aria-hidden />}
          </div>
          <span className="font-semibold text-slate-900 dark:text-[#f0f6fc] tracking-tight">
            {isAdmin ? 'Admin Control' : 'Learning Hub'}
          </span>
        </div>
      </div>

      <div className="hidden items-center lg:flex flex-1">
        {isAdmin && <Breadcrumbs />}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={toggleTheme}
          className="relative flex size-9 items-center justify-center rounded-lg border border-transparent text-slate-500 dark:text-slate-400 transition-all duration-150 hover:bg-slate-100 dark:hover:bg-[#21262d] hover:border-slate-200 dark:hover:border-[#30363d] hover:text-slate-900 dark:hover:text-slate-100 active:scale-95"
          aria-label="Toggle themes"
        >
          {theme === 'dark'
            ? <Sun className="size-4.5" />
            : <Moon className="size-4.5" />
          }
        </button>

        <div className="h-5 w-px bg-slate-200 dark:bg-[#30363d] mx-1" />

        <Button
          variant="outline"
          size="sm"
          leftIcon={<LogOut className="size-3.5" />}
          onClick={handleLogout}
          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 dark:text-rose-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-300 dark:hover:border-rose-800/60 dark:border-[#30363d] dark:bg-transparent"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
