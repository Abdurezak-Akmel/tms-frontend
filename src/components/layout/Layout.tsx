import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../hooks/useAuth';

interface LayoutProps {
  showSidebar?: boolean;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  showSidebar = true, 
  showFooter = true 
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {isAuthenticated && showSidebar && <Sidebar />}
        
        <main className={`flex-1 ${isAuthenticated && showSidebar ? 'md:ml-0' : ''}`}>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
