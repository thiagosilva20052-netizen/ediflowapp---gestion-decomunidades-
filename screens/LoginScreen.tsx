import React from 'react';
import { Logo } from '../components/Logo';
import { User, UserRole } from '../src/types';

interface Props {
  onLogin: (user: User) => void;
  onBack?: () => void;
}

const LoginScreen: React.FC<Props> = ({ onLogin, onBack }) => {
  // Mock users for prototyping
  const mockUsers: Record<UserRole, User> = {
    admin: {
      id: '1',
      name: 'Carlos Admin',
      email: 'admin@ediflow.cl',
      role: 'admin',
      tenantId: 'tenant-1'
    },
    concierge: {
      id: '2',
      name: 'Juan Pérez',
      email: 'conserje@ediflow.cl',
      role: 'concierge',
      tenantId: 'tenant-1'
    },
    resident: {
      id: '3',
      name: 'María González',
      email: 'residente@ediflow.cl',
      role: 'resident',
      tenantId: 'tenant-1',
      apartment: '402'
    }
  };

  const handleLogin = (role: UserRole) => {
    // Simulate API delay
    setTimeout(() => {
      onLogin(mockUsers[role]);
    }, 500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black p-6 justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-ediflow-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col items-center mb-12">
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        )}
        <Logo variant="vertical" className="mb-4" />
        <p className="text-gray-400 text-center">Gestión inteligente para tu comunidad</p>
      </div>

      <div className="relative z-10 space-y-4 w-full max-w-sm mx-auto">
        <div className="bg-[#0A0A0A] p-6 rounded-[24px] border border-white/5 shadow-2xl">
          <h2 className="text-white font-medium mb-6 text-center text-lg">Selecciona un perfil de prueba</h2>
          
          <div className="space-y-3">
            <button 
              onClick={() => handleLogin('admin')}
              className="w-full bg-black hover:bg-white/5 active:scale-[0.98] transition-all p-4 rounded-xl flex items-center gap-4 border border-white/5 group"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors border border-purple-500/20">
                <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
              </div>
              <div className="text-left">
                <p className="text-white font-medium text-sm">Administrador</p>
                <p className="text-xs text-gray-500 font-light mt-0.5">Gestión del edificio</p>
              </div>
            </button>

            <button 
              onClick={() => handleLogin('concierge')}
              className="w-full bg-black hover:bg-white/5 active:scale-[0.98] transition-all p-4 rounded-xl flex items-center gap-4 border border-white/5 group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#00AEEF]/10 flex items-center justify-center text-[#00AEEF] group-hover:bg-[#00AEEF] group-hover:text-black transition-colors border border-[#00AEEF]/20">
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
              </div>
              <div className="text-left">
                <p className="text-white font-medium text-sm">Conserje</p>
                <p className="text-xs text-gray-500 font-light mt-0.5">Control y registro</p>
              </div>
            </button>

            <button 
              onClick={() => handleLogin('resident')}
              className="w-full bg-black hover:bg-white/5 active:scale-[0.98] transition-all p-4 rounded-xl flex items-center gap-4 border border-white/5 group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors border border-blue-500/20">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </div>
              <div className="text-left">
                <p className="text-white font-medium text-sm">Residente</p>
                <p className="text-xs text-gray-500 font-light mt-0.5">Servicios y pagos</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
