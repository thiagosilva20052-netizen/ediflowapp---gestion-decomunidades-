import React from 'react';

export const EmailTemplatePreview: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-100 dark:bg-[#000000] p-4 md:p-8 rounded-3xl border-2 border-gray-200 dark:border-gray-800">
      <div className="text-center mb-4">
        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Vista Previa de Correo</span>
      </div>
      
      {/* Email Container */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200 font-sans text-gray-900">
        
        {/* Header */}
        <div className="bg-[#121212] py-8 px-6 text-center border-b-4 border-[#00AEEF]">
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase m-0">EDIFLOW</h1>
        </div>

        {/* Body */}
        <div className="p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">¡Hola, Juan Pérez!</h2>
          
          <p className="text-[18px] leading-relaxed text-gray-700 mb-8">
            Tienes una nueva notificación importante en tu comunidad. Ha llegado un paquete a tu nombre y está esperando en conserjería.
          </p>

          <div className="bg-gray-50 border-l-4 border-[#00AEEF] p-6 mb-8 rounded-r-xl">
            <p className="text-[18px] font-bold text-gray-900 m-0">Detalle: Paquete de MercadoLibre</p>
            <p className="text-[16px] text-gray-600 mt-2 m-0">Recibido hoy a las 14:30 hrs.</p>
          </div>

          <div className="text-center mt-10">
            <a 
              href="#" 
              className="inline-block bg-[#00AEEF] hover:bg-[#0090C5] text-white font-bold text-[18px] py-4 px-10 rounded-full text-decoration-none transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Acceder a la Web
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 py-8 px-6 text-center border-t-2 border-gray-200">
          <p className="text-[14px] text-gray-500 mb-4">
            Este es un correo automático, por favor no respondas a esta dirección.
          </p>
          <p className="text-[14px] text-gray-500">
            ¿No quieres recibir estas alertas? <a href="#" className="text-[#00AEEF] font-bold underline" onClick={(e) => e.preventDefault()}>Gestionar mis notificaciones</a>
          </p>
        </div>
      </div>
    </div>
  );
};
