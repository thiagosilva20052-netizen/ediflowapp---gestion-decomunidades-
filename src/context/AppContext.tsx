import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Tenant } from '../types';

interface AppContextType {
  currentUser: User | null;
  currentTenant: Tenant | null;
  isGlobalMenuOpen: boolean;
  theme: 'light' | 'dark';
  setCurrentUser: (user: User | null) => void;
  setCurrentTenant: (tenant: Tenant | null) => void;
  setIsGlobalMenuOpen: (isOpen: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isGlobalMenuOpen, setIsGlobalMenuOpen] = useState(false);
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  const [currentTenant, setCurrentTenant] = useState<Tenant | null>({
    id: 'tenant-1',
    name: 'Edificio Central',
    address: 'Av. Providencia 1234'
  });

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, 
      currentTenant, 
      isGlobalMenuOpen, 
      theme,
      setCurrentUser, 
      setCurrentTenant, 
      setIsGlobalMenuOpen,
      setTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
