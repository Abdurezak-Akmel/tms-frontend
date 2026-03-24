import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import authService from '../../services/authService';
import Breadcrumbs from './Breadcrumbs';

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      authService.clearTokens();
      navigate('/admin-login');
    } catch (error) {
      console.error('Logout failed:', error);
      authService.clearTokens();
      navigate('/admin-login');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 lg:hidden">
        <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
          <ShieldCheck className="size-5" aria-hidden />
        </div>
        <span className="font-semibold text-slate-900">Admin Control</span>
      </div>

      <div className="hidden items-center lg:flex">
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-3">
        <button className="relative flex size-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900">
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        
        <div className="h-6 w-px bg-slate-200 mx-1"></div>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<LogOut className="size-4" />}
          onClick={handleLogout}
          className="text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-100 border-slate-200"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
