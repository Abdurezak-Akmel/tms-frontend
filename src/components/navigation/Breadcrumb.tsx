import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  separator?: string;
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items, 
  separator = '/',
  className = '' 
}) => {
  const location = useLocation();
  
  // Generate breadcrumb items from current path if not provided
  const generateItemsFromPath = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        label,
        href: index === pathSegments.length - 1 ? undefined : currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateItemsFromPath();

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400" aria-hidden="true">
                {separator}
              </span>
            )}
            
            {item.href ? (
              <Link
                to={item.href}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm font-medium text-gray-500" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
