import { useState, useEffect, useCallback } from 'react';
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('grim_session');
  });
  const login = useCallback((token: string) => {
    localStorage.setItem('grim_session', token);
    setIsAuthenticated(true);
  }, []);
  const logout = useCallback(() => {
    localStorage.removeItem('grim_session');
    setIsAuthenticated(false);
  }, []);
  return {
    isAuthenticated,
    login,
    logout
  };
}