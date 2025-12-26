import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'employee' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole;
  login: (password: string) => { success: boolean; role: UserRole };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as UserRole;
    if (savedRole) {
      setIsAuthenticated(true);
      setRole(savedRole);
    }
  }, []);

  const login = (password: string): { success: boolean; role: UserRole } => {
    if (password === 'admin1234') {
      setIsAuthenticated(true);
      setRole('admin');
      localStorage.setItem('userRole', 'admin');
      return { success: true, role: 'admin' };
    } else if (password === '1234') {
      setIsAuthenticated(true);
      setRole('employee');
      localStorage.setItem('userRole', 'employee');
      return { success: true, role: 'employee' };
    }
    return { success: false, role: null };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
