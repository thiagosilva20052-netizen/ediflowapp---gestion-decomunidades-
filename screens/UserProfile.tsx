import React, { useState, useRef, useEffect } from 'react';
import { ScreenName } from '../App';

interface Props {
  navigate: (screen: ScreenName) => void;
}

const UserProfile: React.FC<Props> = ({ navigate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDark, setIsDark] = useState(true);
  
  // Initial state has an image, but logic handles null/empty
  const [avatar, setAvatar] = useState<string | null>("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80");
  const [coverPhoto, setCoverPhoto] = useState<string | null>("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80");

  const [userData, setUserData] = useState({
    name: "Juan Pérez",
    role: "Conserje Titular",
    email: "juan.perez@ediflow.cl",
    phone: "+56 9 8765 4321",
    rut: "12.345.678-9",
    unit: "Administración"
  });

  // Load saved data and theme from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('ediflow_user_profile');
    if (savedData) {
        try {
            setUserData(JSON.parse(savedData));
        } catch (error) {
            console.error('Error loading profile data:', error);
        }
    }

    // Sync theme state with DOM
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  // Default placeholder based on user initials
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=1c262c&color=EAB308&size=256&font-size=0.4`;
  const defaultCover = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverPhoto(imageUrl);
    }
  };

  const handleDeleteImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering file input
    setAvatar(null);
  };
  
  const handleDeleteCover = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCoverPhoto(null);
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Save to localStorage
    try {
        localStorage.setItem('ediflow_user_profile', JSON.stringify(userData));
    } catch (error) {
        console.error('Error saving profile data:', error);
    }
    
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleClearForm = () => {
    setUserData(prev => ({
        ...prev,
        name: "",
        email: "",
        phone: "",
        rut: ""
    }));
  };

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
  };

  const handleDownloadData = () => {
    const dataStr = JSON.stringify(userData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `perfil_${userData.name.replace(/\s+/g, '_').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-full dark:bg-[#101c22] bg-gray-50 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 pt-6 pb-4 dark:bg-[#101c22] bg-white sticky top-0 z-30 border-b dark:border-white/5 border-gray-200 transition-colors duration-300">
        <button 
            onClick={() => !isSaving && navigate('ConciergeDashboard')} 
            className={`w-8 h-8 flex items-center justify-center rounded-full dark:hover:bg-white/10 hover:bg-gray-100 active:scale-90 transition-all dark:text-white text-gray-800 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight dark:text-white text-gray-900">Mi Perfil</h1>
        <div className="ml-auto flex items-center gap-4">
             {!isEditing ? (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="text-ediflow-primary text-sm font-bold active:scale-95 transition-transform"
                >
                    Editar
                </button>
             ) : (
                 <>
                    <button 
                        onClick={handleClearForm}
                        disabled={isSaving}
                        className={`text-red-400 text-sm font-bold active:scale-95 transition-transform ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Limpiar
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`text-green-400 text-sm font-bold active:scale-95 transition-transform flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSaving ? (
                            <>
                                <span className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></span>
                                Guardando
                            </>
                        ) : (
                            'Listo'
                        )}
                    </button>
                 </>
             )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        
        {/* Cover Photo Section */}
        <div 
            className={`relative w-full h-48 dark:bg-[#1c262c] bg-gray-200 overflow-hidden ${isEditing && !isSaving ? 'cursor-pointer group' : ''}`}
            onClick={() => isEditing && !isSaving && coverInputRef.current?.click()}
        >
            <img 
                src={coverPhoto || defaultCover} 
                className={`w-full h-full object-cover transition-opacity duration-300 ${isSaving ? 'opacity-70' : ''}`}
                alt="Cover"
            />
             {isEditing && !isSaving && (
                <>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <div className="bg-black/50 p-2 rounded-full backdrop-blur-sm">
                            <span className="material-symbols-outlined text-white text-2xl">add_a_photo</span>
                        </div>
                    </div>
                    {coverPhoto && (
                        <button 
                            onClick={handleDeleteCover}
                            className="absolute top-4 right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white z-20 hover:scale-110 transition-transform shadow-lg"
                            title="Eliminar portada"
                        >
                            <span className="material-symbols-outlined text-sm font-bold">close</span>
                        </button>
                    )}
                </>
            )}
            <input 
                type="file" 
                ref={coverInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleCoverUpload}
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
        </div>

        <div className="px-5">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-8 -mt-16 relative z-10">
                <div className={`relative group ${isEditing && !isSaving ? 'cursor-pointer' : ''}`} onClick={() => isEditing && !isSaving && fileInputRef.current?.click()}>
                    <div className={`w-32 h-32 rounded-full border-[5px] dark:border-[#101c22] border-white p-0.5 relative overflow-hidden dark:bg-[#1c262c] bg-white ${isEditing && !isSaving ? 'dark:hover:border-[#25323a] hover:border-gray-200' : ''} transition-colors shadow-xl`}>
                        <img 
                            src={avatar || defaultAvatar} 
                            className={`w-full h-full rounded-full object-cover ${isSaving ? 'opacity-50' : ''}`}
                            alt="Profile"
                        />
                        
                        {/* Edit Overlay */}
                        {isEditing && !isSaving && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full z-10">
                                <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                            </div>
                        )}
                        
                        {/* Saving Overlay */}
                        {isSaving && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full z-10">
                                <span className="material-symbols-outlined text-white text-3xl animate-pulse">cloud_upload</span>
                            </div>
                        )}
                    </div>

                    {/* Edit Actions */}
                    {isEditing && !isSaving && (
                        <>
                            <button className="absolute bottom-1 right-1 w-8 h-8 bg-ediflow-primary rounded-full flex items-center justify-center border-4 dark:border-[#101c22] border-white text-black z-20 hover:scale-110 transition-transform shadow-sm">
                                <span className="material-symbols-outlined text-sm font-bold">edit</span>
                            </button>
                            
                            {avatar && (
                                <button 
                                    onClick={handleDeleteImage}
                                    className="absolute top-1 right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center border-4 dark:border-[#101c22] border-white text-white z-20 hover:scale-110 transition-transform shadow-sm"
                                    title="Eliminar foto"
                                >
                                    <span className="material-symbols-outlined text-sm font-bold">close</span>
                                </button>
                            )}
                        </>
                    )}

                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>
                <h2 className="text-2xl font-bold dark:text-white text-gray-900 mt-3">{userData.name}</h2>
                <span className="text-sm dark:text-gray-400 text-gray-500 dark:bg-white/5 bg-gray-200 px-3 py-1 rounded-full mt-1 border dark:border-white/5 border-transparent">{userData.role}</span>
            </div>

            {/* Data Form */}
            <div className="space-y-5">
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Información Personal</h3>
                    
                    <div className="space-y-4">
                        <div className={`dark:bg-[#1c262c] bg-white rounded-xl border dark:border-white/5 border-gray-200 px-4 py-2 relative transition-colors ${isEditing && !isSaving ? 'focus-within:border-ediflow-primary/50 ring-1 ring-transparent focus-within:ring-ediflow-primary/50' : ''} shadow-sm`}>
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Nombre Completo</label>
                            <input 
                                type="text" 
                                value={userData.name}
                                readOnly={!isEditing || isSaving}
                                onChange={(e) => setUserData({...userData, name: e.target.value})}
                                className={`w-full bg-transparent border-none p-0 dark:text-white text-gray-900 font-medium focus:ring-0 ${(!isEditing || isSaving) && 'opacity-70'}`}
                            />
                        </div>

                        <div className={`dark:bg-[#1c262c] bg-white rounded-xl border dark:border-white/5 border-gray-200 px-4 py-2 relative transition-colors ${isEditing && !isSaving ? 'focus-within:border-ediflow-primary/50 ring-1 ring-transparent focus-within:ring-ediflow-primary/50' : ''} shadow-sm`}>
                            <label className="text-[10px] text-gray-400 font-bold uppercase">RUT / Identificación</label>
                            <input 
                                type="text" 
                                value={userData.rut}
                                readOnly={!isEditing || isSaving}
                                onChange={(e) => setUserData({...userData, rut: e.target.value})}
                                className={`w-full bg-transparent border-none p-0 dark:text-white text-gray-900 font-medium focus:ring-0 ${(!isEditing || isSaving) && 'opacity-70'}`}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contacto</h3>
                    
                    <div className="space-y-4">
                        <div className={`dark:bg-[#1c262c] bg-white rounded-xl border dark:border-white/5 border-gray-200 px-4 py-2 relative transition-colors ${isEditing && !isSaving ? 'focus-within:border-ediflow-primary/50 ring-1 ring-transparent focus-within:ring-ediflow-primary/50' : ''} shadow-sm`}>
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Correo Electrónico</label>
                            <input 
                                type="email" 
                                value={userData.email}
                                readOnly={!isEditing || isSaving}
                                onChange={(e) => setUserData({...userData, email: e.target.value})}
                                className={`w-full bg-transparent border-none p-0 dark:text-white text-gray-900 font-medium focus:ring-0 ${(!isEditing || isSaving) && 'opacity-70'}`}
                            />
                        </div>

                        <div className={`dark:bg-[#1c262c] bg-white rounded-xl border dark:border-white/5 border-gray-200 px-4 py-2 relative transition-colors ${isEditing && !isSaving ? 'focus-within:border-ediflow-primary/50 ring-1 ring-transparent focus-within:ring-ediflow-primary/50' : ''} shadow-sm`}>
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Teléfono</label>
                            <input 
                                type="tel" 
                                value={userData.phone}
                                readOnly={!isEditing || isSaving}
                                onChange={(e) => setUserData({...userData, phone: e.target.value})}
                                className={`w-full bg-transparent border-none p-0 dark:text-white text-gray-900 font-medium focus:ring-0 ${(!isEditing || isSaving) && 'opacity-70'}`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Settings Access */}
            <div className={`mt-8 space-y-3 transition-opacity duration-300 ${isEditing ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                
                {/* Dark Mode Toggle */}
                <div className="w-full flex items-center justify-between p-4 dark:bg-[#1c262c] bg-white hover:bg-gray-50 dark:hover:bg-[#25323a] transition-all rounded-xl border dark:border-white/5 border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg dark:bg-white/10 bg-gray-100 dark:text-white text-gray-600 flex items-center justify-center">
                            <span className="material-symbols-outlined">{isDark ? 'dark_mode' : 'light_mode'}</span>
                        </div>
                        <span className="text-sm font-bold dark:text-white text-gray-900">Modo Oscuro</span>
                    </div>
                    
                    <button 
                        onClick={toggleTheme}
                        className={`w-12 h-7 rounded-full relative transition-colors duration-300 active:scale-105 ${isDark ? 'bg-ediflow-primary' : 'bg-gray-300'}`}
                    >
                        <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${isDark ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                </div>

                <button 
                    onClick={() => navigate('NotificationSettings')}
                    className="w-full flex items-center justify-between p-4 dark:bg-[#1c262c] bg-white hover:bg-gray-50 dark:hover:bg-[#25323a] active:scale-[0.99] transition-all rounded-xl border dark:border-white/5 border-gray-200 shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                            <span className="material-symbols-outlined">notifications</span>
                        </div>
                        <span className="text-sm font-bold dark:text-white text-gray-900">Configurar Notificaciones</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-500">chevron_right</span>
                </button>

                <button className="w-full flex items-center justify-between p-4 dark:bg-[#1c262c] bg-white hover:bg-gray-50 dark:hover:bg-[#25323a] active:scale-[0.99] transition-all rounded-xl border dark:border-white/5 border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <span className="material-symbols-outlined">lock</span>
                        </div>
                        <span className="text-sm font-bold dark:text-white text-gray-900">Cambiar Contraseña</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-500">chevron_right</span>
                </button>

                <button 
                    onClick={handleDownloadData}
                    className="w-full flex items-center justify-between p-4 dark:bg-[#1c262c] bg-white hover:bg-gray-50 dark:hover:bg-[#25323a] active:scale-[0.99] transition-all rounded-xl border dark:border-white/5 border-gray-200 shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                            <span className="material-symbols-outlined">download</span>
                        </div>
                        <span className="text-sm font-bold dark:text-white text-gray-900">Descargar mis datos</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-500">chevron_right</span>
                </button>

                <button className="w-full flex items-center justify-center gap-2 p-4 mt-6 text-red-500 font-bold text-sm active:scale-95 transition-transform">
                    <span className="material-symbols-outlined">logout</span>
                    Cerrar Sesión
                </button>
            </div>

            {/* About Us Section */}
            <div className="mt-8 pt-6 border-t dark:border-white/5 border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-ediflow-primary/20 text-ediflow-primary flex items-center justify-center">
                        <span className="material-symbols-outlined">apartment</span>
                    </div>
                    <h3 className="text-sm font-bold dark:text-white text-gray-900 uppercase tracking-wider">Sobre Ediflow</h3>
                </div>
                
                <div className="dark:bg-[#1c262c] bg-white rounded-xl border dark:border-white/5 border-gray-200 p-4 space-y-4 shadow-sm">
                    <p className="text-sm dark:text-gray-400 text-gray-500 leading-relaxed">
                        Ediflow es la plataforma integral líder para la gestión inteligente de comunidades y edificios. Conectamos a conserjes, administradores y residentes en un solo lugar.
                    </p>
                    <div>
                        <h4 className="text-xs font-bold dark:text-white text-gray-900 mb-1">Nuestra Misión</h4>
                        <p className="text-xs text-gray-500">
                            Simplificar la vida en comunidad mediante tecnología accesible, transparente y eficiente.
                        </p>
                    </div>
                    <div className="pt-2 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                        <span>Versión 2.4.0</span>
                        <span>© 2024 Ediflow Inc.</span>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;