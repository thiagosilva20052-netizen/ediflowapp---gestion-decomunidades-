import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Users, 
  BookOpen, 
  CreditCard, 
  Calendar, 
  Wrench, 
  Contact2, 
  Vote, 
  AlertTriangle, 
  FileText, 
  MessageSquare, 
  Settings,
  X
} from 'lucide-react';
import { ScreenName } from '../App';

import { UserRole } from '../src/types';

interface ModuleHubProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenName) => void;
  onLogout: () => void;
  currentScreen: ScreenName;
  role: UserRole;
}

export const ModuleHub: React.FC<ModuleHubProps> = ({ isOpen, onClose, onNavigate, onLogout, currentScreen, role }) => {
  const getModuleId = (baseId: string): ScreenName => {
    switch (baseId) {
      case 'paquetes':
        return role === 'concierge' ? 'PackageEntry' : 'Emergency';
      case 'visitas':
        return role === 'resident' ? 'QRCodeScreen' : (role === 'concierge' ? 'AccessControl' : 'ManualVisitorRegistration');
      case 'pagos':
        return 'PaymentsScreen';
      case 'reservas':
        return 'Reservations';
      case 'mantencion':
        return 'Maintenance';
      case 'emergencia':
        return 'Emergency';
      case 'comunidad':
        return role === 'concierge' ? 'BitacoraScreen' : 'CommunityWall';
      case 'mensajes':
        return 'MessagesScreen';
      case 'directorio':
        return role === 'resident' ? 'ResidentServices' : 'ResidentDirectory';
      default:
        return 'AdminDashboard' as ScreenName;
    }
  };

  const modules = [
    { id: 'paquetes', label: 'Paquetes', icon: Package, color: '#FBBF24' },
    { id: 'visitas', label: 'Visitas', icon: Users, color: '#EC4899' },
    { id: 'pagos', label: 'Pagos GC', icon: CreditCard, color: '#10B981' },
    { id: 'reservas', label: 'Reservas', icon: Calendar, color: '#F97316' },
    { id: 'mantencion', label: 'Mantención', icon: Wrench, color: '#EF4444' },
    { id: 'emergencia', label: 'Emergencia', icon: AlertTriangle, color: '#EAB308' },
    { id: 'comunidad', label: 'Comunidad', icon: BookOpen, color: '#8B5CF6' },
    { id: 'mensajes', label: 'Mensajes', icon: MessageSquare, color: '#06B6D4' },
    { id: 'directorio', label: 'Directorio', icon: Contact2, color: '#3B82F6' },
  ].filter(m => {
    // Filter out modules that don't make sense for the role
    if (role === 'resident' && m.id === 'directorio') return false;
    return true;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[20px] flex flex-col items-center justify-center p-6"
        >
          <div className="max-w-md w-full">
            <motion.div 
              className="grid grid-cols-3 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              {modules.map((module) => {
                const targetScreen = getModuleId(module.id);
                const isActive = currentScreen === targetScreen;

                return (
                  <motion.button
                    key={module.id}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8, y: 20 },
                      visible: { opacity: 1, scale: 1, y: 0 }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onNavigate(targetScreen);
                      onClose();
                    }}
                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-[20px] bg-[#0A0A0A] border transition-all duration-300 group ${
                      isActive ? 'border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110 group-active:scale-95"
                      style={{ 
                        backgroundColor: `${module.color}10`, 
                        color: module.color,
                      }}
                    >
                      <module.icon size={24} strokeWidth={2} />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-center leading-tight text-gray-500 group-hover:text-white transition-colors">
                      {module.label}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>

            <motion.button
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full mt-6 py-2.5 rounded-xl bg-red-500/5 border border-red-500/20 text-red-500 text-[11px] font-semibold uppercase tracking-widest hover:bg-red-500/10 transition-all active:scale-[0.98]"
            >
              Cerrar Sesión
            </motion.button>
          </div>

          {/* Close Button - Positioned like the FAB */}
          <motion.button
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            onClick={onClose}
            className="absolute bottom-6 right-6 w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:bg-gray-200 transition-all active:scale-90"
          >
            <X size={32} strokeWidth={3} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
