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
  | 'UserProfile';

const App: React.FC = () => {
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

  const renderScreen = () => {
    switch (currentScreen) {
      case 'ConciergeDashboard': return <ConciergeDashboard navigate={setCurrentScreen} />;
      case 'PackageEntry': return <PackageEntry navigate={setCurrentScreen} />;
      case 'CommunityWall': return <CommunityWall navigate={setCurrentScreen} />;
      case 'ResidentServices': return <ResidentServices navigate={setCurrentScreen} />;
      case 'AdminDashboard': return <AdminDashboard navigate={setCurrentScreen} />;
      case 'QRCodeScreen': return <QRCodeScreen navigate={setCurrentScreen} />;
      case 'AccessControl': return <AccessControl navigate={setCurrentScreen} />;
      case 'NotificationSettings': return <NotificationSettings navigate={setCurrentScreen} />;
      case 'MessagesScreen': return <MessagesScreen navigate={setCurrentScreen} />;
      case 'PaymentsScreen': return <PaymentsScreen navigate={setCurrentScreen} />;
      case 'HistoryScreen': return <HistoryScreen navigate={setCurrentScreen} />;
      case 'UserProfile': return <UserProfile navigate={setCurrentScreen} />;
      default: return <ConciergeDashboard navigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen dark:bg-black bg-gray-200 flex justify-center items-center font-sans transition-colors duration-300">
      
      {/* Mobile Frame Container */}
      <div className="relative w-full max-w-[420px] h-[100dvh] max-h-[900px] dark:bg-ediflow-dark bg-gray-50 overflow-hidden shadow-2xl sm:rounded-[30px] sm:border-[8px] dark:border-[#333] border-gray-300 transition-colors duration-300">
        {/* Screen Content */}
        <div className="h-full w-full overflow-y-auto no-scrollbar dark:bg-ediflow-dark bg-gray-50 dark:text-ediflow-text text-gray-900 relative transition-colors duration-300">
          {renderScreen()}
        </div>

        {/* Floating Navigation Menu Trigger (For Demo Purposes) */}
        <div className="absolute bottom-6 right-6 z-50">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-200 transition-all active:scale-90 active:bg-gray-300"
          >
            <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>

        {/* Navigation Overlay */}
        {isMenuOpen && (
          <div className="absolute inset-0 bg-black/90 z-40 flex flex-col items-center justify-center space-y-4 backdrop-blur-sm p-6 animate-fade-in">
            <h2 className="text-ediflow-primary text-xl font-bold mb-4">Seleccionar Pantalla</h2>
            {[
              { id: 'ConciergeDashboard', label: 'Panel Conserje' },
              { id: 'ResidentServices', label: 'Servicios Residente' },
              { id: 'UserProfile', label: 'Mi Perfil' },
              { id: 'AdminDashboard', label: 'Panel Admin' },
              { id: 'CommunityWall', label: 'Muro Comunidad' },
              { id: 'PackageEntry', label: 'Ingresar Encomienda' },
              { id: 'AccessControl', label: 'Control Visitas' },
              { id: 'MessagesScreen', label: 'Mensajería' },
              { id: 'PaymentsScreen', label: 'Pagos / Finanzas' },
              { id: 'HistoryScreen', label: 'Historial' },
            ].map((screen) => (
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
          </div>
        )}
      </div>
    </div>
  );
};

export default App;