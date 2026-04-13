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
    <div className="flex flex-col md:flex-row min-h-screen bg-[#000000] text-white">
      
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex flex-col w-72 bg-[#121212] border-r-2 border-gray-800 p-8 sticky top-0 h-screen">
        <Logo variant="horizontal" className="mb-12" />
        
        <nav className="flex-1 space-y-4">
          <SidebarButton icon="dashboard" label="Resumen" active />
          <SidebarButton icon="account_balance_wallet" label="Finanzas" onClick={() => navigate('ManageExpenses')} />
          <SidebarButton icon="contacts" label="Directorio" onClick={() => navigate('ResidentDirectory')} />
          <SidebarButton icon="badge" label="Personal" onClick={() => navigate('StaffManagement')} />
          <SidebarButton icon="chat" label="Mensajería" onClick={() => navigate('MessagesScreen')} />
          <SidebarButton icon="campaign" label="Comunidad" onClick={() => navigate('CommunityWall')} />
        </nav>

        <div className="mt-auto pt-8 border-t-2 border-gray-800">
          <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-2xl border-2 border-gray-800">
            <div className="w-12 h-12 rounded-full bg-[#00AEEF] flex items-center justify-center font-black text-white">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">Administrador</p>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Premium Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-full pb-24 md:pb-10">
        
        {/* Header */}
        <header className="px-6 md:px-10 pt-10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6 sticky top-0 z-20 bg-[#000000]/80 backdrop-blur-md border-b-2 border-gray-800 md:border-none">
          <div className="md:hidden flex justify-between items-center w-full">
            <Logo variant="horizontal" className="scale-90 origin-left" />
            <button onClick={() => navigate('UserProfile')} className="w-12 h-12 rounded-full bg-[#121212] flex items-center justify-center border-2 border-gray-800">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
          
          <div className="hidden md:block">
            <h1 className="text-4xl font-black tracking-tight">Panel de Control</h1>
            <p className="text-gray-500 font-medium mt-1">Bienvenido de nuevo, Administrador.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 bg-[#121212] border-2 border-gray-800 rounded-full px-6 py-3">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-bold uppercase tracking-widest">Sistema Online</span>
            </div>
            <Button 
              onClick={() => navigate('ManageExpenses')}
              className="bg-[#00AEEF] hover:bg-[#0090C5] text-white border-none px-8"
              icon="add"
            >
              Nuevo Gasto
            </Button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="px-6 md:px-10 py-6 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <Card className="lg:col-span-2 p-8 flex flex-col h-full bg-[#121212] border-gray-800">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black">Salud Financiera</h2>
                  <p className="text-gray-500">Ingresos vs Gastos (Últimos 6 meses)</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-[10px] font-bold text-green-500 uppercase">Ingresos</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-[10px] font-bold text-red-500 uppercase">Gastos</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 min-h-[300px]">
                <FinancialChart />
              </div>
            </Card>

            {/* Quick Actions & Modules */}
            <div className="space-y-6">
              <Card className="p-8 bg-[#00AEEF] border-none text-white overflow-hidden relative group cursor-pointer" onClick={() => navigate('ResidentDirectory')}>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-2">Directorio Inteligente</h3>
                  <p className="text-white/80 font-medium mb-6">Gestiona residentes, vehículos y mascotas con un solo clic.</p>
                  <span className="inline-flex items-center gap-2 bg-white text-[#00AEEF] px-6 py-3 rounded-full font-black text-sm group-hover:scale-105 transition-transform">
                    Abrir Directorio
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </span>
                </div>
                <span className="material-symbols-outlined absolute -right-8 -bottom-8 text-[180px] text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-8 bg-[#121212] border-gray-800">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00AEEF]">history</span>
                Actividad Reciente
              </h3>
              <div className="space-y-6">
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

            <Card className="p-8 bg-[#121212] border-gray-800">
              <h3 className="text-xl font-black mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500">assignment_late</span>
                  Tareas Pendientes
                </div>
                {urgentCount > 0 && (
                  <span className="text-xs font-black bg-amber-500 text-black px-3 py-1 rounded-full">
                    {urgentCount} {urgentCount === 1 ? 'URGENTE' : 'URGENTES'}
                  </span>
                )}
              </h3>
              <div className="space-y-4">
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
              className="p-8 bg-[#0A0A0A] border-2 border-white/5 flex items-center justify-between group cursor-pointer hover:border-red-500/50 transition-all duration-500 rounded-[32px] overflow-hidden lg:col-span-2"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[22px] bg-red-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(239,68,68,0.3)] group-hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-4xl font-bold">emergency</span>
                </div>
                <div>
                  <h4 className="font-black text-red-500 uppercase tracking-[0.2em] text-[10px] mb-1">Emergencia</h4>
                  <h3 className="text-2xl font-black text-white leading-tight">Acceso Directo a<br />Centro de Emergencias</h3>
                </div>
              </div>
              <div className="w-12 h-20 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-red-500 group-hover:border-red-500 transition-all duration-500">
                <span className="material-symbols-outlined text-red-500 group-hover:text-white transition-colors text-3xl">arrow_forward</span>
              </div>
            </Card>
          </div>

        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden fixed bottom-0 w-full bg-[#121212] border-t-2 border-gray-800 pb-8 pt-4 px-6 flex justify-between items-center z-30">
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
    className={`p-6 bg-[#121212] border-gray-800 flex flex-col justify-between h-40 relative overflow-hidden group hover:border-[#00AEEF] transition-colors ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div className="flex justify-between items-start relative z-10">
      <div className={`w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center ${color} border-2 border-gray-800`}>
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <div className={`flex items-center gap-1 text-xs font-black ${trendUp ? 'text-green-500' : 'text-amber-500'}`}>
        <span className="material-symbols-outlined text-sm">{trendUp ? 'trending_up' : 'info'}</span>
        {trend}
      </div>
    </div>
    <div className="relative z-10">
      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-3xl font-black">{value}</h3>
    </div>
    <span className={`material-symbols-outlined absolute -right-4 -bottom-4 text-[100px] opacity-5 ${color} group-hover:scale-110 transition-transform duration-500`}>
      {icon}
    </span>
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
    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all active:scale-95 hover:brightness-125 ${color}`}
  >
    <span className="material-symbols-outlined text-3xl">{icon}</span>
    <span className="text-sm font-black uppercase tracking-widest">{label}</span>
  </button>
);

const ActivityItem = ({ icon, title, desc, time, color, onClick }: any) => (
  <div className="flex items-center gap-4 group cursor-pointer" onClick={onClick}>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 border-transparent group-hover:border-current transition-colors ${color}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold truncate">{title}</h4>
      <p className="text-xs text-gray-500 truncate">{desc}</p>
    </div>
    <span className="text-[10px] font-black text-gray-600 uppercase whitespace-nowrap">{time}</span>
  </div>
);

const TaskItem = ({ label, urgent, completed, onToggle }: any) => (
  <div 
    onClick={onToggle}
    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer group 
      ${completed ? 'bg-gray-900/20 border-gray-800/50 opacity-50' : 
        urgent ? 'bg-red-500/5 border-red-500/20 hover:border-red-500' : 'bg-gray-900/50 border-gray-800 hover:border-gray-600'}`}
  >
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all 
      ${completed ? 'bg-green-500 border-green-500' : 
        urgent ? 'border-red-500 group-hover:bg-red-500' : 'border-gray-600 group-hover:border-[#00AEEF]'}`}
    >
      <span className={`material-symbols-outlined text-[14px] text-white transition-opacity ${completed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        check
      </span>
    </div>
    <span className={`text-sm font-bold flex-1 transition-all ${completed ? 'text-gray-600 line-through' : urgent ? 'text-red-200' : 'text-gray-300'}`}>
      {label}
    </span>
    {urgent && !completed && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>}
  </div>
);

const SidebarButton = ({ icon, label, active = false, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${active ? 'bg-[#00AEEF] text-white shadow-lg shadow-[#00AEEF]/20' : 'text-gray-500 hover:bg-gray-800 hover:text-white'}`}
  >
    <span className={`material-symbols-outlined text-2xl ${active ? 'fill-current' : ''}`}>{icon}</span>
    <span className="text-lg font-bold">{label}</span>
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