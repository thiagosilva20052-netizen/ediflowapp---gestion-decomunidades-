import React, { useState } from 'react';
import { ScreenName } from '../App';
import { Logo } from '../components/Logo';
import { Card } from '../src/components/ui/Card';
import { Button } from '../src/components/ui/Button';

interface Props {
  navigate: (screen: ScreenName) => void;
}

interface Task {
  id: string;
  label: string;
  urgent: boolean;
  completed: boolean;
}

const AdminDashboard: React.FC<Props> = ({ navigate }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', label: 'Revisar conciliación bancaria Marzo', urgent: true, completed: false },
    { id: '2', label: 'Aprobar presupuesto pintura fachada', urgent: false, completed: false },
    { id: '3', label: 'Entrevista nuevo conserje nocturno', urgent: false, completed: false },
    { id: '4', label: 'Responder reclamo Depto 804', urgent: true, completed: false },
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.urgent !== b.urgent) return a.urgent ? -1 : 1;
    return 0;
  });

  const urgentCount = tasks.filter(t => t.urgent && !t.completed).length;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white font-sans">
      
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0A0A0A] border-r border-white/5 p-6 sticky top-0 h-screen">
        <Logo variant="horizontal" className="mb-10 scale-90 origin-left" />
        
        <nav className="flex-1 space-y-2">
          <SidebarButton icon="dashboard" label="Resumen" active />
          <SidebarButton icon="account_balance_wallet" label="Finanzas" onClick={() => navigate('ManageExpenses')} />
          <SidebarButton icon="contacts" label="Directorio" onClick={() => navigate('ResidentDirectory')} />
          <SidebarButton icon="badge" label="Personal" onClick={() => navigate('StaffManagement')} />
          <SidebarButton icon="chat" label="Mensajería" onClick={() => navigate('MessagesScreen')} />
          <SidebarButton icon="campaign" label="Comunidad" onClick={() => navigate('CommunityWall')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#00AEEF]/20 flex items-center justify-center font-bold text-[#00AEEF]">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Administrador</p>
              <p className="text-[10px] text-gray-500 font-light tracking-wide">Premium Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-full pb-20 md:pb-8">
        
        {/* Header */}
        <header className="px-6 md:px-10 pt-8 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6 sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-white/5">
          <div className="md:hidden flex justify-between items-center w-full">
            <Logo variant="horizontal" className="scale-[0.8] origin-left" />
            <button onClick={() => navigate('UserProfile')} className="w-10 h-10 rounded-full bg-[#0A0A0A] flex items-center justify-center border border-white/5">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
          </div>
          
          <div className="hidden md:block">
            <h1 className="text-3xl font-light tracking-tight">Panel de Control</h1>
            <p className="text-sm text-gray-500 font-light mt-1">Bienvenido de nuevo, Administrador.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-[#0A0A0A] border border-white/5 rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">Sistema Online</span>
            </div>
            <Button 
              onClick={() => navigate('ManageExpenses')}
              className="bg-white hover:bg-gray-200 text-black px-6 py-2 h-10 text-sm font-medium border-none"
              icon="add"
            >
              Nuevo Gasto
            </Button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="px-6 md:px-10 py-6 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              label="Balance Mensual" 
              value="$4.250.000" 
              trend="+12.5%" 
              trendUp={true}
              icon="account_balance"
              color="text-green-500"
              onClick={() => navigate('ManageExpenses')}
            />
            <MetricCard 
              label="Gastos Pendientes" 
              value="$850.200" 
              trend="5 Deptos" 
              trendUp={false}
              icon="pending_actions"
              color="text-amber-500"
              onClick={() => navigate('ManageExpenses')}
            />
            <MetricCard 
              label="Ocupación" 
              value="94%" 
              trend="152/160" 
              trendUp={true}
              icon="home"
              color="text-[#00AEEF]"
              onClick={() => navigate('ResidentDirectory')}
            />
            <MetricCard 
              label="Personal Activo" 
              value="8" 
              trend="En turno" 
              trendUp={true}
              icon="badge"
              color="text-purple-500"
              onClick={() => navigate('StaffManagement')}
            />
          </div>

          {/* Main Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Financial Health - Large Card */}
            <Card className="lg:col-span-2 p-6 flex flex-col h-full bg-[#0A0A0A] border border-white/5 rounded-[24px]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-light">Salud Financiera</h2>
                  <p className="text-xs text-gray-500">Ingresos vs Gastos (Últimos 6 meses)</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span className="text-[10px] font-medium text-green-500 uppercase tracking-wide">Ingresos</span>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-red-500/10 rounded-full border border-red-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    <span className="text-[10px] font-medium text-red-500 uppercase tracking-wide">Gastos</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 min-h-[250px]">
                <FinancialChart />
              </div>
            </Card>

            {/* Quick Actions & Modules */}
            <div className="space-y-4">
              <Card className="p-6 bg-[#00AEEF] border-none text-white overflow-hidden relative group cursor-pointer rounded-[24px]" onClick={() => navigate('ResidentDirectory')}>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold mb-2">Directorio Inteligente</h3>
                  <p className="text-white/80 text-sm font-light mb-6">Gestiona residentes y vehículos.</p>
                  <span className="inline-flex items-center gap-2 bg-white text-[#00AEEF] px-4 py-2 rounded-full font-medium text-xs group-hover:bg-gray-100 transition-colors">
                    Abrir Directorio
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </span>
                </div>
                <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[120px] text-white/20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  contacts
                </span>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <QuickModuleButton 
                  icon="badge" 
                  label="Personal" 
                  onClick={() => navigate('StaffManagement')}
                  color="bg-purple-500/10 text-purple-500 border-purple-500/20"
                />
                <QuickModuleButton 
                  icon="campaign" 
                  label="Anuncios" 
                  onClick={() => navigate('CommunityWall')}
                  color="bg-amber-500/10 text-amber-500 border-amber-500/20"
                />
                <QuickModuleButton 
                  icon="chat" 
                  label="Mensajes" 
                  onClick={() => navigate('MessagesScreen')}
                  color="bg-blue-500/10 text-blue-500 border-blue-500/20"
                />
                <QuickModuleButton 
                  icon="person" 
                  label="Perfil" 
                  onClick={() => navigate('UserProfile')}
                  color="bg-gray-500/10 text-gray-500 border-gray-500/20"
                />
              </div>
            </div>

          </div>

          {/* Bottom Row: Recent Activity & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6 bg-[#0A0A0A] border border-white/5 rounded-[24px]">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400 text-xl">history</span>
                Actividad Reciente
              </h3>
              <div className="space-y-4">
                <ActivityItem 
                  icon="payments" 
                  title="Gasto Común Registrado" 
                  desc="Depto 402 - $125.000" 
                  time="Hace 10 min" 
                  color="bg-green-500/10 text-green-500"
                  onClick={() => navigate('ManageExpenses')}
                />
                <ActivityItem 
                  icon="person_add" 
                  title="Nuevo Residente" 
                  desc="Depto 1105 - Carlos Rodríguez" 
                  time="Hace 2 horas" 
                  color="bg-[#00AEEF]/10 text-[#00AEEF]"
                  onClick={() => navigate('ResidentDirectory')}
                />
                <ActivityItem 
                  icon="warning" 
                  title="Alerta de Mantenimiento" 
                  desc="Ascensor Torre B - Reportado por Conserje" 
                  time="Hace 4 horas" 
                  color="bg-red-500/10 text-red-500"
                  onClick={() => navigate('Maintenance')}
                />
              </div>
            </Card>

            <Card className="p-6 bg-[#0A0A0A] border border-white/5 rounded-[24px]">
              <h3 className="text-lg font-medium mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500 text-xl">assignment_late</span>
                  Tareas Pendientes
                </div>
                {urgentCount > 0 && (
                  <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-1 rounded-full">
                    {urgentCount} URGENTE
                  </span>
                )}
              </h3>
              <div className="space-y-3">
                {sortedTasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    label={task.label} 
                    urgent={task.urgent} 
                    completed={task.completed}
                    onToggle={() => toggleTask(task.id)}
                  />
                ))}
              </div>
            </Card>

            {/* Emergency Card for Admin */}
            <Card 
              onClick={() => navigate('Emergency')}
              className="p-6 bg-[#0A0A0A] border border-red-500/10 flex items-center justify-between group cursor-pointer hover:border-red-500/30 transition-all duration-300 rounded-[24px] overflow-hidden lg:col-span-2"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-2xl font-normal">emergency</span>
                </div>
                <div>
                  <h4 className="font-semibold text-red-500 uppercase tracking-widest text-[9px] mb-0.5">Emergencia</h4>
                  <h3 className="text-lg font-light text-white leading-tight">Acceso Directo a Centro</h3>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-red-500 group-hover:border-red-500 transition-all duration-300">
                <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors text-lg">arrow_forward</span>
              </div>
            </Card>
          </div>

        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden fixed bottom-0 w-full bg-black border-t border-white/5 pb-6 pt-3 px-6 flex justify-between items-center z-30">
          <NavButton icon="dashboard" label="Resumen" active />
          <NavButton icon="account_balance_wallet" label="Finanzas" onClick={() => navigate('ManageExpenses')} />
          <NavButton icon="contacts" label="Directorio" onClick={() => navigate('ResidentDirectory')} />
          <NavButton icon="chat" label="Mensajes" onClick={() => navigate('MessagesScreen')} />
          <NavButton icon="person" label="Perfil" onClick={() => navigate('UserProfile')} />
        </nav>

      </main>
    </div>
  );
};

const MetricCard = ({ label, value, trend, trendUp, icon, color, onClick }: any) => (
  <Card 
    onClick={onClick}
    className={`p-5 bg-[#0A0A0A] border border-white/5 flex flex-col justify-between h-32 relative overflow-hidden group hover:border-[#00AEEF]/50 transition-colors rounded-[20px] ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div className="flex justify-between items-start relative z-10">
      <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${color} border border-white/5`}>
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${trendUp ? 'text-green-500 border-green-500/20 bg-green-500/10' : 'text-amber-500 border-amber-500/20 bg-amber-500/10'}`}>
        <span className="material-symbols-outlined text-[12px]">{trendUp ? 'trending_up' : 'info'}</span>
        {trend}
      </div>
    </div>
    <div className="relative z-10">
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-0.5">{label}</p>
      <h3 className="text-2xl font-light">{value}</h3>
    </div>
  </Card>
);

const FinancialChart = () => {
  const data = [
    { month: 'Oct', in: 85, out: 65 },
    { month: 'Nov', in: 92, out: 70 },
    { month: 'Dic', in: 78, out: 85 },
    { month: 'Ene', in: 95, out: 60 },
    { month: 'Feb', in: 88, out: 75 },
    { month: 'Mar', in: 100, out: 68 },
  ];

  return (
    <div className="flex items-end justify-between h-full gap-4 pt-10">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-4 h-full group">
          <div className="flex-1 w-full flex items-end justify-center gap-1.5 relative">
            <div 
              className="w-3 bg-green-500 rounded-t-full transition-all duration-1000 ease-out group-hover:brightness-125"
              style={{ height: `${d.in}%` }}
            ></div>
            <div 
              className="w-3 bg-red-500 rounded-t-full transition-all duration-1000 ease-out group-hover:brightness-125"
              style={{ height: `${d.out}%` }}
            ></div>
            
            {/* Tooltip */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-3 py-1.5 rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 z-10 pointer-events-none whitespace-nowrap">
              <span className="text-green-600">+{d.in}%</span> / <span className="text-red-600">-{d.out}%</span>
              <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
            </div>
          </div>
          <span className="text-xs font-black text-gray-500 group-hover:text-white transition-colors uppercase tracking-widest">{d.month}</span>
        </div>
      ))}
    </div>
  );
};

const QuickModuleButton = ({ icon, label, onClick, color }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-[20px] bg-[#0A0A0A] border border-white/5 transition-all active:scale-95 hover:bg-white/5 ${color.replace('border- ', '')}`}
  >
    <span className={`material-symbols-outlined text-2xl ${color.split(' ')[1]}`}>{icon}</span>
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{label}</span>
  </button>
);

const ActivityItem = ({ icon, title, desc, time, color, onClick }: any) => (
  <div className="flex items-center gap-3 group cursor-pointer p-2 hover:bg-white/5 rounded-xl transition-colors -mx-2" onClick={onClick}>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5 group-hover:border-white/20 transition-colors ${color}`}>
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-xs font-medium truncate text-gray-200">{title}</h4>
      <p className="text-[10px] text-gray-500 truncate">{desc}</p>
    </div>
    <span className="text-[9px] font-medium text-gray-600 uppercase whitespace-nowrap">{time}</span>
  </div>
);

const TaskItem = ({ label, urgent, completed, onToggle }: any) => (
  <div 
    onClick={onToggle}
    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group 
      ${completed ? 'bg-black border-white/5 opacity-50' : 
        urgent ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40' : 'bg-[#0A0A0A] border-white/5 hover:border-white/20'}`}
  >
    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all 
      ${completed ? 'bg-green-500/20 border-green-500' : 
        urgent ? 'border-red-500/50 group-hover:bg-red-500/20' : 'border-gray-700 group-hover:border-white/40'}`}
    >
      <span className={`material-symbols-outlined text-[12px] transition-opacity ${completed ? 'opacity-100 text-green-500' : 'opacity-0'}`}>
        check
      </span>
    </div>
    <span className={`text-xs font-light flex-1 transition-all ${completed ? 'text-gray-600 line-through' : urgent ? 'text-red-200' : 'text-gray-300'}`}>
      {label}
    </span>
    {urgent && !completed && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>}
  </div>
);

const SidebarButton = ({ icon, label, active = false, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${active ? 'bg-white text-black' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
  >
    <span className={`material-symbols-outlined text-[20px]`}>{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const NavButton = ({ icon, label, active = false, onClick }: { icon: string, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 active:scale-90 transition-all ${active ? 'text-[#00AEEF]' : 'text-gray-500 hover:text-white'}`}>
    <span className={`material-symbols-outlined text-2xl ${active ? 'fill-current' : ''}`}>{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
  </button>
);

export default AdminDashboard;