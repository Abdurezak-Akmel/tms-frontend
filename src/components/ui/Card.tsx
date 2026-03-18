import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  padding = 'md' 
}) => {
  const baseClasses = 'bg-white shadow rounded-lg';
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const classes = `${baseClasses} ${paddingClasses[padding]} ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`border-t border-gray-200 pt-4 mt-4 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
