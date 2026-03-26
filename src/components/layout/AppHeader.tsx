import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, ShieldCheck, Moon, Sun, GraduationCap } from 'lucide-react';
import { Button } from '../ui/Button';
import authService from '../../services/authService';
import Breadcrumbs from '../dashboard/Breadcrumbs';
import { useTheme } from '../../context/ThemeContext';

interface AppHeaderProps {
  isAdmin?: boolean;
}

const AppHeader = ({ isAdmin = false }: AppHeaderProps) => {
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 backdrop-blur-md sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="flex items-center gap-4 lg:hidden">
        <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-800 text-white">
          {isAdmin ? <ShieldCheck className="size-5" aria-hidden /> : <GraduationCap className="size-5" aria-hidden />}
        </div>
        <span className="font-semibold text-slate-900 dark:text-slate-100">{isAdmin ? 'Admin Control' : 'Learning Hub'}</span>
      </div>

      <div className="hidden items-center lg:flex">
        {isAdmin && <Breadcrumbs />}
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button 
          onClick={toggleTheme}
          className="relative flex size-10 items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
          aria-label="Toggle themes"
        >
          {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>

        <button className="relative flex size-10 items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100">
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-brand-500 dark:bg-brand-400 ring-2 ring-white dark:ring-slate-900"></span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<LogOut className="size-4" />}
          onClick={handleLogout}
          className="text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-100 border-slate-200 dark:border-slate-700 dark:text-red-400 dark:hover:bg-red-400/10 dark:hover:text-red-300 bg-transparent"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
