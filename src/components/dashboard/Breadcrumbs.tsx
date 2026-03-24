import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // If path is just /admin-dashboard, show simple breadcrumb
  if (location.pathname === '/admin-dashboard') {
    return (
      <nav className="flex items-center text-xs font-semibold text-slate-400">
        <Home className="mr-1.5 size-3.5" />
        <span>Dashboard</span>
      </nav>
    );
  }

  return (
    <nav className="flex items-center space-x-2 text-xs font-semibold" aria-label="Breadcrumb">
      <Link
        to="/admin-dashboard"
        className="flex items-center text-slate-400 transition-colors hover:text-slate-900"
      >
        <Home className="mr-1.5 size-3.5" />
        <span>Admin</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        
        // Skip 'admin' in the path as we already have it
        if (value === 'admin') return null;

        const label = value
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        return (
          <React.Fragment key={to}>
            <ChevronRight className="size-3.5 text-slate-300" />
            {last ? (
              <span className="text-slate-900">{label}</span>
            ) : (
              <Link
                to={to}
                className="text-slate-400 transition-colors hover:text-slate-900"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
