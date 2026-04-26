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
import BitacoraScreen from './screens/BitacoraScreen';
import UserProfile from './screens/UserProfile';
import LoginScreen from './screens/LoginScreen';
import ManageExpenses from './screens/ManageExpenses';
import ManualVisitorRegistration from './screens/ManualVisitorRegistration';
import StaffManagement from './screens/StaffManagement';
import RegisterPayment from './screens/RegisterPayment';
import NovedadEntry from './screens/NovedadEntry';
import ResidentDirectory from './screens/ResidentDirectory';
import Emergency from './screens/Emergency';
import Maintenance from './screens/Maintenance';
import Reservations from './screens/Reservations';
import LandingPage from './screens/LandingPage';
import SolutionsPage from './screens/SolutionsPage';
import ResourcesPage from './screens/ResourcesPage';
import OS10SimulatorPublic from './screens/OS10SimulatorPublic';
import PricingPage from './screens/PricingPage';
import BookDemoPage from './screens/BookDemoPage';
import BuildingSettings from './screens/BuildingSettings';
import PrivacyPage from './screens/PrivacyPage';
import TermsPage from './screens/TermsPage';
import NoiseGuidePage from './screens/NoiseGuidePage';
import ProrrationTemplatePage from './screens/ProrrationTemplatePage';
import ChecklistLeyPage from './screens/ChecklistLeyPage';
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
  | 'BitacoraScreen'
  | 'UserProfile'
  | 'ManageExpenses'
  | 'ManualVisitorRegistration'
  | 'StaffManagement'
  | 'RegisterPayment'
  | 'NovedadEntry'
  | 'Reservations'
  | 'Maintenance'
  | 'Emergency'
  | 'ResidentDirectory'
  | 'BuildingSettings'
  | 'Landing'
  | 'Solutions'
  | 'Resources'
  | 'OS10Simulator'
  | 'Pricing'
  | 'BookDemo'
  | 'Privacy'
  | 'Terms'
  | 'Login'
  | 'Register'
  | 'NoiseGuide'
  | 'ProrrationTemplate'
  | 'ChecklistLey';

const App: React.FC = () => {
  const { currentUser, setCurrentUser, isGlobalMenuOpen, setIsGlobalMenuOpen, theme } = useAppContext();
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Landing');
  const [previousScreen, setPreviousScreen] = useState<ScreenName | null>(null);

  const handleNavigate = (screen: ScreenName) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // Route to default screen based on role
    if (user.role === 'admin') setCurrentScreen('AdminDashboard');
    else if (user.role === 'concierge') setCurrentScreen('ConciergeDashboard');
    else if (user.role === 'resident') setCurrentScreen('ResidentServices');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('Landing');
  };

  const renderScreen = () => {
    if (!currentUser) {
      if (currentScreen === 'Login') {
        return <LoginScreen onLogin={handleLogin} onBack={() => setCurrentScreen('Landing')} initialMode="login" />;
      }
      if (currentScreen === 'Register') {
        return <LoginScreen onLogin={handleLogin} onBack={() => setCurrentScreen('Landing')} initialMode="register" />;
      }
      if (currentScreen === 'Solutions') {
        return <SolutionsPage onLoginClick={() => setCurrentScreen('Login')} onNavigate={setCurrentScreen} />;
      }
      if (currentScreen === 'Resources') {
        return <ResourcesPage onLoginClick={() => setCurrentScreen('Login')} onNavigate={setCurrentScreen} />;
      }
      if (currentScreen === 'OS10Simulator') {
        return <OS10SimulatorPublic onNavigate={setCurrentScreen} />;
      }
      if (currentScreen === 'Pricing') {
        return <PricingPage onLoginClick={() => setCurrentScreen('Login')} onNavigate={setCurrentScreen} />;
      }
      if (currentScreen === 'BookDemo') {
        return <BookDemoPage onNavigate={setCurrentScreen} />;
      }
      if (currentScreen === 'Privacy') {
        return <PrivacyPage onLoginClick={() => setCurrentScreen('Login')} onNavigate={setCurrentScreen} />;
      }
      if (currentScreen === 'Terms') {
        return <TermsPage onLoginClick={() => setCurrentScreen('Login')} onNavigate={setCurrentScreen} />;
      }
      if (currentScreen === 'NoiseGuide') {
        return <NoiseGuidePage onNavigate={setCurrentScreen} />;
      }
      if (currentScreen === 'ProrrationTemplate') {
        return <ProrrationTemplatePage onNavigate={setCurrentScreen} />;
      }
      if (currentScreen === 'ChecklistLey') {
        return <ChecklistLeyPage onNavigate={setCurrentScreen} />;
      }
      return <LandingPage onLoginClick={() => setCurrentScreen('Login')} onNavigate={setCurrentScreen} />;
    }

    const roleAccess: Record<UserRole, ScreenName[]> = {
      admin: ['AdminDashboard', 'ManageExpenses', 'CommunityWall', 'MessagesScreen', 'PaymentsScreen', 'BitacoraScreen', 'UserProfile', 'StaffManagement', 'ResidentDirectory', 'Reservations', 'Maintenance', 'Emergency', 'NovedadEntry', 'BuildingSettings'],
      concierge: ['ConciergeDashboard', 'PackageEntry', 'AccessControl', 'MessagesScreen', 'BitacoraScreen', 'UserProfile', 'ManualVisitorRegistration', 'RegisterPayment', 'ResidentDirectory', 'Reservations', 'Maintenance', 'Emergency', 'NovedadEntry'],
      resident: ['ResidentServices', 'CommunityWall', 'MessagesScreen', 'PaymentsScreen', 'UserProfile', 'QRCodeScreen', 'Reservations', 'Maintenance', 'Emergency']
    };

    if (!roleAccess[currentUser.role].includes(currentScreen)) {
      // Fallback to default screen for role
      return currentUser.role === 'admin' ? <AdminDashboard navigate={handleNavigate} onLogout={handleLogout} /> :
             currentUser.role === 'concierge' ? <ConciergeDashboard navigate={handleNavigate} onLogout={handleLogout} /> :
             <ResidentServices navigate={handleNavigate} onLogout={handleLogout} />;
    }

    switch (currentScreen) {
      case 'ConciergeDashboard': return <ConciergeDashboard navigate={handleNavigate} onLogout={handleLogout} />;
      case 'PackageEntry': return <PackageEntry navigate={handleNavigate} from={previousScreen} />;
      case 'CommunityWall': return <CommunityWall navigate={handleNavigate} role={currentUser.role} />;
      case 'ResidentServices': return <ResidentServices navigate={handleNavigate} onLogout={handleLogout} />;
      case 'AdminDashboard': return <AdminDashboard navigate={handleNavigate} onLogout={handleLogout} />;
      case 'QRCodeScreen': return <QRCodeScreen navigate={handleNavigate} />;
      case 'AccessControl': return <AccessControl navigate={handleNavigate} />;
      case 'MessagesScreen': return <MessagesScreen navigate={handleNavigate} role={currentUser.role} />;
      case 'PaymentsScreen': return <PaymentsScreen navigate={handleNavigate} role={currentUser.role} />;
      case 'BitacoraScreen': return <BitacoraScreen navigate={handleNavigate} role={currentUser.role} />;
      case 'UserProfile': return <UserProfile navigate={handleNavigate} onLogout={handleLogout} role={currentUser.role} />;
      case 'ManageExpenses': return <ManageExpenses navigate={handleNavigate} />;
      case 'ManualVisitorRegistration': return <ManualVisitorRegistration navigate={handleNavigate} from={previousScreen} />;
      case 'StaffManagement': return <StaffManagement navigate={handleNavigate} />;
      case 'RegisterPayment': return <RegisterPayment navigate={handleNavigate} from={previousScreen} />;
      case 'NovedadEntry': return <NovedadEntry navigate={handleNavigate} from={previousScreen} />;
      case 'ResidentDirectory': return <ResidentDirectory navigate={handleNavigate} role={currentUser.role} />;
      case 'Emergency': return <Emergency navigate={handleNavigate} from={previousScreen} role={currentUser.role} />;
      case 'BuildingSettings': return <BuildingSettings navigate={handleNavigate} />;
      case 'Reservations': return <Reservations navigate={handleNavigate} role={currentUser.role} from={previousScreen} />;
      case 'Maintenance':
        return <Maintenance navigate={handleNavigate} role={currentUser.role} from={previousScreen} />;
      default: 
        return currentUser.role === 'admin' ? <AdminDashboard navigate={handleNavigate} onLogout={handleLogout} /> :
               currentUser.role === 'concierge' ? <ConciergeDashboard navigate={handleNavigate} onLogout={handleLogout} /> :
               <ResidentServices navigate={handleNavigate} onLogout={handleLogout} />;
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
    <div className="min-h-screen bg-white text-gray-900 font-sans tracking-tight">
      <div className="flex h-screen overflow-hidden">
        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
          {renderScreen()}
        </div>

        {currentUser && (
          <ModuleHub 
            isOpen={isGlobalMenuOpen} 
            onClose={() => setIsGlobalMenuOpen(false)} 
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            currentScreen={currentScreen}
            role={currentUser.role}
          />
        )}
      </div>
    </div>
  );
};

export default App;