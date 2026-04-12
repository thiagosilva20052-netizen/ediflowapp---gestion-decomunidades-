import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Tenant } from '../types';

interface AppContextType {
  currentUser: User | null;
  currentTenant: Tenant | null;
  setCurrentUser: (user: User | null) => void;
  setCurrentTenant: (tenant: Tenant | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>({
    id: 'tenant-1',
    name: 'Edificio Central',
    address: 'Av. Providencia 1234'
  });

  return (
    <AppContext.Provider value={{ currentUser, currentTenant, setCurrentUser, setCurrentTenant }}>
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
