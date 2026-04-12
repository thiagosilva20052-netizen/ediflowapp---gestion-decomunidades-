import React, { useState, useEffect } from 'react';
import ConciergeDashboard from './screens/ConciergeDashboard';
import PackageEntry from './screens/PackageEntry';
import CommunityWall from './screens/CommunityWall';
import ResidentServices from './screens/ResidentServices';
import AdminDashboard from './screens/AdminDashboard';
import QRCodeScreen from './screens/QRCodeScreen';
import AccessControl from './screens/AccessControl';
import MessagesScreen from './screens/MessagesScreen';
import PaymentsScreen from './screens/PaymentsScreen';
import HistoryScreen from './screens/HistoryScreen';
import UserProfile from './screens/UserProfile';
import LoginScreen from './screens/LoginScreen';
import ManageExpenses from './screens/ManageExpenses';
import ManualVisitorRegistration from './screens/ManualVisitorRegistration';
import StaffManagement from './screens/StaffManagement';
import RegisterPayment from './screens/RegisterPayment';
import ResidentDirectory from './screens/ResidentDirectory';
import { useAppContext } from './src/context/AppContext';
import { User, UserRole } from './src/types';
import { ModuleHub } from './components/ModuleHub';

// Navigation types
export type ScreenName = 
  | 'ConciergeDashboard' 
  | 'PackageEntry' 
  | 'CommunityWall' 
  | 'ResidentServices' 
  | 'AdminDashboard'
  | 'QRCodeScreen'
  | 'AccessControl'
  | 'MessagesScreen'
  | 'PaymentsScreen'
  | 'HistoryScreen'
  | 'UserProfile'
  | 'ManageExpenses'
  | 'ManualVisitorRegistration'
  | 'StaffManagement'
  | 'RegisterPayment'
  | 'Reservations'
  | 'Maintenance'
  | 'Emergency'
  | 'ResidentDirectory';

const App: React.FC = () => {
  const { currentUser, setCurrentUser } = useAppContext();
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('ConciergeDashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize theme from localStorage
    const storedTheme = localStorage.getItem('theme');
    // Default to dark if no preference is set, or if explicitly set to dark
    if (storedTheme === 'light') {
        document.documentElement.classList.remove('dark');
    } else {
        document.documentElement.classList.add('dark');
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // Route to default screen based on role
    if (user.role === 'admin') setCurrentScreen('AdminDashboard');
    else if (user.role === 'concierge') setCurrentScreen('ConciergeDashboard');
    else if (user.role === 'resident') setCurrentScreen('ResidentServices');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const renderScreen = () => {
    if (!currentUser) {
      return <LoginScreen onLogin={handleLogin} />;
    }

    const roleAccess: Record<UserRole, ScreenName[]> = {
      admin: ['AdminDashboard', 'ManageExpenses', 'CommunityWall', 'MessagesScreen', 'PaymentsScreen', 'HistoryScreen', 'UserProfile', 'StaffManagement', 'ResidentDirectory', 'Reservations', 'Maintenance', 'Emergency'],
      concierge: ['ConciergeDashboard', 'PackageEntry', 'AccessControl', 'MessagesScreen', 'HistoryScreen', 'UserProfile', 'ManualVisitorRegistration', 'RegisterPayment', 'ResidentDirectory', 'Reservations', 'Maintenance', 'Emergency'],
      resident: ['ResidentServices', 'CommunityWall', 'MessagesScreen', 'PaymentsScreen', 'UserProfile', 'QRCodeScreen', 'Reservations', 'Emergency']
    };

    if (!roleAccess[currentUser.role].includes(currentScreen)) {
      // Fallback to default screen for role
      return currentUser.role === 'admin' ? <AdminDashboard navigate={setCurrentScreen} /> :
             currentUser.role === 'concierge' ? <ConciergeDashboard navigate={setCurrentScreen} onLogout={handleLogout} /> :
             <ResidentServices navigate={setCurrentScreen} />;
    }

    switch (currentScreen) {
      case 'ConciergeDashboard': return <ConciergeDashboard navigate={setCurrentScreen} onLogout={handleLogout} />;
      case 'PackageEntry': return <PackageEntry navigate={setCurrentScreen} />;
      case 'CommunityWall': return <CommunityWall navigate={setCurrentScreen} role={currentUser.role} />;
      case 'ResidentServices': return <ResidentServices navigate={setCurrentScreen} />;
      case 'AdminDashboard': return <AdminDashboard navigate={setCurrentScreen} />;
      case 'QRCodeScreen': return <QRCodeScreen navigate={setCurrentScreen} />;
      case 'AccessControl': return <AccessControl navigate={setCurrentScreen} />;
      case 'MessagesScreen': return <MessagesScreen navigate={setCurrentScreen} role={currentUser.role} />;
      case 'PaymentsScreen': return <PaymentsScreen navigate={setCurrentScreen} role={currentUser.role} />;
      case 'HistoryScreen': return <HistoryScreen navigate={setCurrentScreen} role={currentUser.role} />;
      case 'UserProfile': return <UserProfile navigate={setCurrentScreen} onLogout={handleLogout} role={currentUser.role} />;
      case 'ManageExpenses': return <ManageExpenses navigate={setCurrentScreen} />;
      case 'ManualVisitorRegistration': return <ManualVisitorRegistration navigate={setCurrentScreen} />;
      case 'StaffManagement': return <StaffManagement navigate={setCurrentScreen} />;
      case 'RegisterPayment': return <RegisterPayment navigate={setCurrentScreen} />;
      case 'ResidentDirectory': return <ResidentDirectory navigate={setCurrentScreen} role={currentUser.role} />;
      case 'Reservations':
      case 'Maintenance':
      case 'Emergency':
        return (
          <div className="flex flex-col items-center justify-center h-full bg-black text-white p-10 text-center">
            <span className="material-symbols-outlined text-6xl mb-4 text-[#00AEEF]">construction</span>
            <h2 className="text-3xl font-black mb-2">Módulo en Desarrollo</h2>
            <p className="text-gray-500 max-w-xs">Estamos trabajando para traerte la mejor experiencia en este módulo muy pronto.</p>
            <button 
              onClick={() => {
                if (currentUser.role === 'admin') setCurrentScreen('AdminDashboard');
                else if (currentUser.role === 'concierge') setCurrentScreen('ConciergeDashboard');
                else setCurrentScreen('ResidentServices');
              }}
              className="mt-8 bg-[#00AEEF] text-white px-8 py-3 rounded-xl font-bold"
            >
              Volver al Inicio
            </button>
          </div>
        );
      default: 
        return currentUser.role === 'admin' ? <AdminDashboard navigate={setCurrentScreen} /> :
               currentUser.role === 'concierge' ? <ConciergeDashboard navigate={setCurrentScreen} onLogout={handleLogout} /> :
               <ResidentServices navigate={setCurrentScreen} />;
    }
  };

  // Define which screens are accessible to which roles
  const getMenuItems = () => {
    if (!currentUser) return [];

    const allItems = [
      { id: 'AdminDashboard', label: 'Panel Admin', roles: ['admin'] },
      { id: 'ConciergeDashboard', label: 'Panel Conserje', roles: ['concierge'] },
      { id: 'ResidentServices', label: 'Servicios Residente', roles: ['resident'] },
      { id: 'ResidentDirectory', label: 'Directorio', roles: ['admin', 'concierge'] },
      { id: 'CommunityWall', label: 'Muro Comunidad', roles: ['admin', 'resident'] },
      { id: 'PackageEntry', label: 'Ingresar Encomienda', roles: ['concierge'] },
      { id: 'AccessControl', label: 'Control Visitas', roles: ['concierge'] },
      { id: 'ManageExpenses', label: 'Gestión de Gastos', roles: ['admin'] },
      { id: 'StaffManagement', label: 'Gestión de Personal', roles: ['admin'] },
      { id: 'MessagesScreen', label: 'Mensajería', roles: ['concierge', 'resident', 'admin'] },
      { id: 'PaymentsScreen', label: 'Pagos / Finanzas', roles: ['resident', 'admin'] },
      { id: 'HistoryScreen', label: 'Historial', roles: ['concierge', 'admin'] },
      { id: 'UserProfile', label: 'Mi Perfil', roles: ['admin', 'concierge', 'resident'] },
    ];

    return allItems.filter(item => item.roles.includes(currentUser.role));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#000000] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500">
      <div className="flex h-screen overflow-hidden">
        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
          {renderScreen()}
        </div>

        {/* Floating Navigation Menu Trigger */}
        {currentUser && (
          <div className="absolute bottom-6 right-6 z-50">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-14 h-14 bg-[#00AEEF] text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-400 transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-3xl">{isMenuOpen ? 'close' : 'grid_view'}</span>
            </button>
          </div>
        )}

        <ModuleHub 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
          onNavigate={setCurrentScreen}
          onLogout={handleLogout}
          currentScreen={currentScreen}
        />
      </div>
    </div>
  );
};

export default App;