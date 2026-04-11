import React from 'react';
import { Logo } from '../components/Logo';

export type UserRole = 'admin' | 'concierge' | 'resident';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  buildingId: string;
  buildingName: string;
}

interface Props {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  // Mock users for prototyping
  const mockUsers: Record<UserRole, User> = {
    admin: {
      id: '1',
      name: 'Carlos Admin',
      role: 'admin',
      buildingId: 'bldg-001',
      buildingName: 'Edificio Los Alpes'
    },
    concierge: {
      id: '2',
      name: 'Juan Pérez',
      role: 'concierge',
      buildingId: 'bldg-001',
      buildingName: 'Edificio Los Alpes'
    },
    resident: {
      id: '3',
      name: 'María González',
      role: 'resident',
      buildingId: 'bldg-001',
      buildingName: 'Edificio Los Alpes'
    }
  };

  const handleLogin = (role: UserRole) => {
    // Simulate API delay
    setTimeout(() => {
      onLogin(mockUsers[role]);
    }, 500);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#101c22] p-6 justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-ediflow-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col items-center mb-12">
        <Logo variant="vertical" className="mb-4" />
        <p className="text-gray-400 text-center">Gestión inteligente para tu comunidad</p>
      </div>

      <div className="relative z-10 space-y-4 w-full max-w-sm mx-auto">
        <div className="bg-[#1c262c] p-6 rounded-3xl border border-white/5 shadow-xl">
          <h2 className="text-white font-bold mb-6 text-center">Selecciona un perfil de prueba</h2>
          
          <div className="space-y-3">
            <button 
              onClick={() => handleLogin('admin')}
              className="w-full bg-[#25323a] hover:bg-[#2d3d46] active:scale-[0.98] transition-all p-4 rounded-xl flex items-center gap-4 border border-white/5 group"
            >
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">admin_panel_settings</span>
              </div>
              <div className="text-left">
                <p className="text-white font-bold">Administrador</p>
                <p className="text-xs text-gray-400">Gestión del edificio</p>
              </div>
            </button>

            <button 
              onClick={() => handleLogin('concierge')}
              className="w-full bg-[#25323a] hover:bg-[#2d3d46] active:scale-[0.98] transition-all p-4 rounded-xl flex items-center gap-4 border border-white/5 group"
            >
              <div className="w-10 h-10 rounded-full bg-ediflow-primary/20 flex items-center justify-center text-ediflow-primary group-hover:bg-ediflow-primary group-hover:text-black transition-colors">
                <span className="material-symbols-outlined">support_agent</span>
              </div>
              <div className="text-left">
                <p className="text-white font-bold">Conserje</p>
                <p className="text-xs text-gray-400">Control y registro</p>
              </div>
            </button>

            <button 
              onClick={() => handleLogin('resident')}
              className="w-full bg-[#25323a] hover:bg-[#2d3d46] active:scale-[0.98] transition-all p-4 rounded-xl flex items-center gap-4 border border-white/5 group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div className="text-left">
                <p className="text-white font-bold">Residente</p>
                <p className="text-xs text-gray-400">Servicios y pagos</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
