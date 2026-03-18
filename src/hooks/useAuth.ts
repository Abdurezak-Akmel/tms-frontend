import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      const userInfo = localStorage.getItem('userInfo');
      
      if (token && userInfo) {
        try {
          const parsedUser = JSON.parse(userInfo);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user info:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userInfo');
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string, userInfo: any) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setUser(userInfo);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = () => {
    return user?.role?.toLowerCase() === 'admin';
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    isAdmin
  };
};
