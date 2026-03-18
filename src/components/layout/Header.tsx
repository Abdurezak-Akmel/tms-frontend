import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'TMS - Tutorial Management System' }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {isAuthenticated && (
              <>
                <a href="/courses" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Courses
                </a>
                <a href="/videos" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Videos
                </a>
                <a href="/files" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Files
                </a>
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700">
                  Welcome, {user?.name || 'User'}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" href="/user-login">
                  Login
                </Button>
                <Button size="sm" href="/register">
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
