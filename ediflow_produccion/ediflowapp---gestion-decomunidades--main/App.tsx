import React, { useState, useEffect, Suspense, lazy } from 'react';
import { supabase } from './src/lib/supabase-client';
import { useAppContext } from './src/context/AppContext';
import { User, UserRole } from './src/types';
import { ModuleHub } from './components/ModuleHub';

const ConciergeDashboard = lazy(() => import('./screens/ConciergeDashboard'));
const PackageEntry = lazy(() => import('./screens/PackageEntry'));
const CommunityWall = lazy(() => import('./screens/CommunityWall'));
const ResidentServices = lazy(() => import('./screens/ResidentServices'));
const AdminDashboard = lazy(() => import('./screens/AdminDashboard'));
const QRCodeScreen = lazy(() => import('./screens/QRCodeScreen'));
const AccessControl = lazy(() => import('./screens/AccessControl'));
const MessagesScreen = lazy(() => import('./screens/MessagesScreen'));
const PaymentsScreen = lazy(() => import('./screens/PaymentsScreen'));
const BitacoraScreen = lazy(() => import('./screens/BitacoraScreen'));
const UserProfile = lazy(() => import('./screens/UserProfile'));
const LoginScreen = lazy(() => import('./screens/LoginScreen'));
const ManageExpenses = lazy(() => import('./screens/ManageExpenses'));
const EgresosPage = lazy(() => import('./screens/EgresosPage'));
const ProrrateoPage = lazy(() => import('./screens/ProrrateoPage'));
const MapConfigPage = lazy(() => import('./screens/MapConfigPage'));
const RecaudacionPage = lazy(() => import('./screens/RecaudacionPage'));
const FinanceCommunicationsPage = lazy(() => import('./screens/FinanceCommunicationsPage'));
const MorosidadPage = lazy(() => import('./screens/MorosidadPage'));
const MultasPage = lazy(() => import('./screens/MultasPage'));
const ReportesFinancierosPage = lazy(() => import('./screens/ReportesFinancierosPage'));
const MedidoresPage = lazy(() => import('./screens/MedidoresPage'));
const ManualVisitorRegistration = lazy(() => import('./screens/ManualVisitorRegistration'));
const StaffManagement = lazy(() => import('./screens/StaffManagement'));
const RegisterPayment = lazy(() => import('./screens/RegisterPayment'));
const NovedadEntry = lazy(() => import('./screens/NovedadEntry'));
const ResidentDirectory = lazy(() => import('./screens/ResidentDirectory'));
const Emergency = lazy(() => import('./screens/Emergency'));
const Maintenance = lazy(() => import('./screens/Maintenance'));
const Reservations = lazy(() => import('./screens/Reservations'));
const LandingPage = lazy(() => import('./screens/LandingPage'));
const SolutionsPage = lazy(() => import('./screens/SolutionsPage'));
const ResourcesPage = lazy(() => import('./screens/ResourcesPage'));
const OS10SimulatorPublic = lazy(() => import('./screens/OS10SimulatorPublic'));
const PricingPage = lazy(() => import('./screens/PricingPage'));
const BookDemoPage = lazy(() => import('./screens/BookDemoPage'));
const BuildingSettings = lazy(() => import('./screens/BuildingSettings'));
const PrivacyPage = lazy(() => import('./screens/PrivacyPage'));
const TermsPage = lazy(() => import('./screens/TermsPage'));
const NoiseGuidePage = lazy(() => import('./screens/NoiseGuidePage'));
const ProrrationTemplatePage = lazy(() => import('./screens/ProrrationTemplatePage'));
const ChecklistLeyPage = lazy(() => import('./screens/ChecklistLeyPage'));
const RegisterScreen = lazy(() => import('./screens/RegisterScreen').then(m => ({ default: m.RegisterScreen })));
const OnboardingScreen = lazy(() => import('./screens/OnboardingScreen').then(m => ({ default: m.OnboardingScreen })));
const AuditLogsPage = lazy(() => import('./screens/AuditLogsPage').then(m => ({ default: m.AuditLogsPage })));
const BillingPage = lazy(() => import('./screens/BillingPage').then(m => ({ default: m.BillingPage })));


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
  | 'ChecklistLey'
  | 'EgresosPage'
  | 'ProrrateoPage'
  | 'MapConfigPage'
  | 'RecaudacionPage'
  | 'FinanceCommunicationsPage'
  | 'MorosidadPage'
  | 'MultasPage'
  | 'ReportesFinancierosPage'
  | 'MedidoresPage'
  | 'Onboarding'
  | 'AuditLogs'
  | 'Billing';

const App: React.FC = () => {
  const { currentUser, setCurrentUser, isGlobalMenuOpen, setIsGlobalMenuOpen, theme, setCurrentTenant, currentTenant } = useAppContext();
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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user && !currentUser) {
        // Auto login on start if session exists
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            handleLogin({
              id: session.user.id,
              email: session.user.email!,
              name: profile.full_name || session.user.email!.split('@')[0],
              role: profile.role,
              tenantId: profile.tenant_id,
              apartment: profile.apartment
            });
          }
        } catch (err) {
          console.error("Error loading user profile on auth state change", err);
        }
      } else if (event === 'SIGNED_OUT') {
        handleLogout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser]);

  // Subscription Guard Logic
  useEffect(() => {
    if (currentUser && currentTenant) {
      // If subscription_status is missing or 'trial', check for expiration
      const status = currentTenant.subscription_status || 'trial';
      const trialStartedStr = currentTenant.trial_started_at;
      
      if (status === 'trial') {
        if (!trialStartedStr) return; // Don't block if date is unknown
        
        const trialStarted = new Date(trialStartedStr);
        const daysPassed = (Date.now() - trialStarted.getTime()) / (1000 * 3600 * 24);
        
        if (daysPassed > 15 && ['admin', 'concierge'].includes(currentUser.role)) {
          if (currentScreen !== 'Billing') setCurrentScreen('Billing');
        }
      } else if (status === 'past_due' && ['admin', 'concierge'].includes(currentUser.role)) {
        if (currentScreen !== 'Billing') setCurrentScreen('Billing');
      }
    }
  }, [currentScreen, currentUser, currentTenant]);

  const handleLogin = async (user: User) => {
    // Load saved profile data if exists
    const savedDataStr = localStorage.getItem(`ediflow_user_profile_${user.id}`);
    let enhancedUser = { ...user };
    
    if (savedDataStr) {
      try {
        const savedData = JSON.parse(savedDataStr);
        enhancedUser = {
          ...enhancedUser,
          name: savedData.name || user.name,
          phone: savedData.phone || user.phone,
          rut: savedData.rut || user.rut
        };
      } catch (e) {
        console.error('Error loading saved profile on login');
      }
    }

    setCurrentUser(enhancedUser);
    
    // Set the tenant context
    const { data: tenantData } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', enhancedUser.tenantId)
      .single();
    
    if (tenantData) {
      setCurrentTenant({
        id: tenantData.id,
        name: tenantData.name,
        address: tenantData.address,
        subscription_status: tenantData.subscription_status || 'trial',
        trial_started_at: tenantData.trial_started_at
      });
    } else {
      // Fallback if tenant not found (shouldn't happen in production)
      setCurrentTenant({
        id: enhancedUser.tenantId,
        name: 'Comunidad en Configuración',
        address: 'Dirección pendiente',
        subscription_status: 'trial'
      });
    }

    // Route to default screen based on role
    if (enhancedUser.role === 'admin') {
      if (!enhancedUser.tenantId) {
        setCurrentScreen('Onboarding');
      } else {
        setCurrentScreen('AdminDashboard');
      }
    } else if (enhancedUser.role === 'concierge') {
      setCurrentScreen('ConciergeDashboard');
    } else if (enhancedUser.role === 'resident') {
      setCurrentScreen('ResidentServices');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('Landing');
  };

  const renderScreen = () => {
    if (!currentUser) {
      if (currentScreen === 'Login') {
        return (
          <LoginScreen 
            onLogin={handleLogin} 
            onRegisterClick={() => setCurrentScreen('Register')}
            onBack={() => setCurrentScreen('Landing')} 
          />
        );
      }
      if (currentScreen === 'Register') {
        return <RegisterScreen onRegisterDetails={() => {}} navigate={setCurrentScreen} />;
      }
      if (currentScreen === 'Onboarding') {
        return <OnboardingScreen onComplete={handleLogin} />;
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

    if (!currentUser?.tenantId) {
      return <OnboardingScreen onComplete={handleLogin} />;
    }

    const roleAccess: Record<UserRole, ScreenName[]> = {
      admin: ['AdminDashboard', 'ManageExpenses', 'EgresosPage', 'ProrrateoPage', 'RecaudacionPage', 'ReportesFinancierosPage', 'RegisterPayment', 'BitacoraScreen', 'UserProfile', 'AuditLogs', 'BuildingSettings', 'StaffManagement', 'Billing', 'ResidentDirectory', 'FinanceCommunicationsPage', 'Reservations'],
      concierge: ['ConciergeDashboard', 'PackageEntry', 'AccessControl', 'MessagesScreen', 'BitacoraScreen', 'UserProfile', 'ManualVisitorRegistration', 'RegisterPayment', 'ResidentDirectory', 'Reservations', 'Maintenance', 'Emergency', 'NovedadEntry', 'Billing'],
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
      case 'EgresosPage': return <EgresosPage navigate={handleNavigate} />;
      case 'ProrrateoPage': return <ProrrateoPage navigate={handleNavigate} />;
      case 'RecaudacionPage': return <RecaudacionPage navigate={handleNavigate} />;
      case 'MapConfigPage': return <MapConfigPage navigate={handleNavigate} />;
      case 'FinanceCommunicationsPage': return <FinanceCommunicationsPage navigate={handleNavigate} />;
      case 'MorosidadPage': return <MorosidadPage navigate={handleNavigate} />;
      case 'MultasPage': return <MultasPage navigate={handleNavigate} />;
      case 'ReportesFinancierosPage': return <ReportesFinancierosPage navigate={handleNavigate} />;
      case 'MedidoresPage': return <MedidoresPage navigate={handleNavigate} />;
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
      case 'AuditLogs':
        return <AuditLogsPage navigate={handleNavigate} />;
      case 'Billing':
        return <BillingPage onLogout={handleLogout} navigate={handleNavigate} />;
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
          <Suspense fallback={<div className="flex h-full items-center justify-center bg-black text-white">Cargando...</div>}>
            {renderScreen()}
          </Suspense>
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