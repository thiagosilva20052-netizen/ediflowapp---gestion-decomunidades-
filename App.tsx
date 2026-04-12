import React, { useState, useEffect } from 'react';
import ConciergeDashboard from './screens/ConciergeDashboard';
import PackageEntry from './screens/PackageEntry';
import CommunityWall from './screens/CommunityWall';
import ResidentServices from './screens/ResidentServices';
import AdminDashboard from './screens/AdminDashboard';
import QRCodeScreen from './screens/QRCodeScreen';
import AccessControl from './screens/AccessControl';
import NotificationSettings from './screens/NotificationSettings';
import MessagesScreen from './screens/MessagesScreen';
import PaymentsScreen from './screens/PaymentsScreen';
import HistoryScreen from './screens/HistoryScreen';
import UserProfile from './screens/UserProfile';
import RegisterNovelty from './screens/RegisterNovelty';
import LoginScreen from './screens/LoginScreen';
import ManageExpenses from './screens/ManageExpenses';
import ManualVisitorRegistration from './screens/ManualVisitorRegistration';
import StaffManagement from './screens/StaffManagement';
import RegisterPayment from './screens/RegisterPayment';
import ResidentDirectory from './screens/ResidentDirectory';
import { useAppContext } from './src/context/AppContext';
import { User, UserRole } from './src/types';

// Navigation types
export type ScreenName = 
  | 'ConciergeDashboard' 
  | 'PackageEntry' 
  | 'CommunityWall' 
  | 'ResidentServices' 
  | 'AdminDashboard'
  | 'QRCodeScreen'
  | 'AccessControl'
  | 'NotificationSettings'
  | 'MessagesScreen'
  | 'PaymentsScreen'
  | 'HistoryScreen'
  | 'UserProfile'
  | 'RegisterNovelty'
  | 'ManageExpenses'
  | 'ManualVisitorRegistration'
  | 'StaffManagement'
  | 'RegisterPayment'
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
      admin: ['AdminDashboard', 'ManageExpenses', 'CommunityWall', 'MessagesScreen', 'PaymentsScreen', 'HistoryScreen', 'UserProfile', 'NotificationSettings', 'StaffManagement', 'ResidentDirectory'],
      concierge: ['ConciergeDashboard', 'PackageEntry', 'AccessControl', 'RegisterNovelty', 'MessagesScreen', 'HistoryScreen', 'UserProfile', 'NotificationSettings', 'ManualVisitorRegistration', 'RegisterPayment', 'ResidentDirectory'],
      resident: ['ResidentServices', 'CommunityWall', 'MessagesScreen', 'PaymentsScreen', 'UserProfile', 'NotificationSettings', 'QRCodeScreen']
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
      case 'NotificationSettings': return <NotificationSettings navigate={setCurrentScreen} role={currentUser.role} />;
      case 'MessagesScreen': return <MessagesScreen navigate={setCurrentScreen} role={currentUser.role} />;
      case 'PaymentsScreen': return <PaymentsScreen navigate={setCurrentScreen} role={currentUser.role} />;
      case 'HistoryScreen': return <HistoryScreen navigate={setCurrentScreen} role={currentUser.role} />;
      case 'UserProfile': return <UserProfile navigate={setCurrentScreen} onLogout={handleLogout} role={currentUser.role} />;
      case 'RegisterNovelty': return <RegisterNovelty navigate={setCurrentScreen} />;
      case 'ManageExpenses': return <ManageExpenses navigate={setCurrentScreen} />;
      case 'ManualVisitorRegistration': return <ManualVisitorRegistration navigate={setCurrentScreen} />;
      case 'StaffManagement': return <StaffManagement navigate={setCurrentScreen} />;
      case 'RegisterPayment': return <RegisterPayment navigate={setCurrentScreen} />;
      case 'ResidentDirectory': return <ResidentDirectory navigate={setCurrentScreen} role={currentUser.role} />;
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
      { id: 'RegisterNovelty', label: 'Registrar Novedad', roles: ['concierge'] },
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

        {/* Floating Navigation Menu Trigger (For Demo Purposes) */}
        {currentUser && (
          <div className="absolute bottom-6 right-6 z-50">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-200 transition-all active:scale-90 active:bg-gray-300"
            >
              <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        )}

        {/* Navigation Overlay */}
        {isMenuOpen && currentUser && (
          <div className="absolute inset-0 bg-black/90 z-40 flex flex-col items-center justify-center space-y-4 backdrop-blur-sm p-6 animate-fade-in">
            <h2 className="text-ediflow-primary text-xl font-bold mb-4">Menú ({currentUser.role})</h2>
            {getMenuItems().map((screen) => (
              <button
                key={screen.id}
                onClick={() => {
                  setCurrentScreen(screen.id as ScreenName);
                  setIsMenuOpen(false);
                }}
                className={`w-full py-3 px-6 rounded-xl font-medium transition-all active:scale-[0.98] ${
                  currentScreen === screen.id 
                    ? 'bg-ediflow-primary text-black' 
                    : 'bg-ediflow-surface text-white hover:bg-ediflow-surfaceHighlight'
                }`}
              >
                {screen.label}
              </button>
            ))}
            
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="w-full py-3 px-6 rounded-xl font-medium transition-all active:scale-[0.98] mt-4 bg-red-500/10 text-red-500 hover:bg-red-500/20"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;