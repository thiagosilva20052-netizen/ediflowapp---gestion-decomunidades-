import React, { useState } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  isUrgent: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Nueva Encomienda',
    message: 'Ha llegado un paquete de MercadoLibre para el Depto 402.',
    time: 'Hace 5 min',
    isRead: false,
    isUrgent: false,
  },
  {
    id: '2',
    title: 'Visita en Puerta',
    message: 'Juan Pérez solicita acceso al Depto 105.',
    time: 'Hace 12 min',
    isRead: false,
    isUrgent: true,
  },
  {
    id: '3',
    title: 'Mantenimiento',
    message: 'Corte de agua programado para mañana a las 10:00 AM.',
    time: 'Ayer',
    isRead: true,
    isUrgent: false,
  }
];

type FilterType = 'todas' | 'urgentes' | 'mensajes';

export const NotificationDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>(DUMMY_NOTIFICATIONS);
  const [filter, setFilter] = useState<FilterType>('todas');

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, isRead: true } : notif)
    );
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'urgentes') return notif.isUrgent;
    if (filter === 'mensajes') return !notif.isUrgent; // Simplification for demo
    return true;
  });

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full md:w-[450px] bg-white dark:bg-[#121212] border-l-2 border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b-2 border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#1A1A1A]">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Notificaciones</h2>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white dark:bg-[#121212] border-2 border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Quick Filters */}
        <div className="p-6 border-b-2 border-gray-200 dark:border-gray-800 flex gap-4 overflow-x-auto no-scrollbar">
          {(['todas', 'urgentes', 'mensajes'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-3 rounded-2xl font-bold text-lg capitalize whitespace-nowrap transition-all border-2 ${
                filter === f 
                  ? 'bg-[#00AEEF]/10 border-[#00AEEF] text-[#00AEEF]' 
                  : 'bg-white dark:bg-[#121212] border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
              <span className="material-symbols-outlined text-8xl text-[#00AEEF] mb-6">task_alt</span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Todo en orden por ahora</h3>
              <p className="text-lg text-gray-500">No tienes notificaciones pendientes.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => handleMarkAsRead(notif.id)}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${
                  notif.isRead 
                    ? 'bg-gray-50 dark:bg-[#1A1A1A] border-gray-200 dark:border-gray-800 opacity-60' 
                    : 'bg-white dark:bg-[#121212] border-[#00AEEF] shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    {!notif.isRead && (
                      <div className="w-3 h-3 rounded-full bg-[#00AEEF]"></div>
                    )}
                    <h4 className={`text-xl font-bold ${notif.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                      {notif.title}
                    </h4>
                  </div>
                  <span className="text-sm font-bold text-gray-500">{notif.time}</span>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 ml-6">
                  {notif.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
