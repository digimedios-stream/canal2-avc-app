import React, { useState, useEffect } from 'react';

const PWAInstall = ({ type = 'popup' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkStandalone = () => {
      return (
        window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator.standalone) ||
        document.referrer.includes('android-app://')
      );
    };

    if (checkStandalone()) {
      setIsStandalone(true);
      return;
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (type === 'popup') {
        // Show popup after a delay to not be intrusive
        const timer = setTimeout(() => setIsVisible(true), 5000);
        return () => clearTimeout(timer);
      } else {
        setIsVisible(true);
      }
    };

    // If iOS, we show the message because there is no 'beforeinstallprompt' event
    if (isIOSDevice) {
       if (type === 'popup') {
        const timer = setTimeout(() => setIsVisible(true), 8000);
        return () => clearTimeout(timer);
      } else {
        setIsVisible(true);
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [type]);

  const handleInstallClick = async () => {
    if (isIOS) {
      // For iOS, the popup already shows the instructions, but we can also trigger a helper
      return;
    }

    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsVisible(false);
      setDeferredPrompt(null);
    }
  };

  // Do not show if already installed
  if (isStandalone) return null;
  
  // For popup type, only show if isVisible is true
  if (type === 'popup' && !isVisible) return null;
  
  // For header type, only show if we have a prompt or it's iOS
  if (type === 'header' && !deferredPrompt && !isIOS) return null;

  if (type === 'header') {
    return (
      <button 
        onClick={handleInstallClick}
        className="bg-red-600 hover:bg-red-700 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all hover:scale-105 shadow-lg shadow-red-900/40 flex items-center gap-2"
        title="Instalar Aplicación"
      >
        <span className="text-sm">📲</span>
        <span className="hidden xs:inline">Instalar App</span>
      </button>
    );
  }

  // Popup / Snackbar style
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-md animate-[slideUp_0.5s_ease-out]">
      <div className="bg-[#121212]/95 border border-red-600/30 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-red-600 to-red-800 p-3 rounded-2xl shadow-lg flex-shrink-0">
            <span className="text-2xl">📲</span>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-white tracking-tight">AVC HD en tu pantalla</h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Instala nuestra App para acceso directo y una experiencia sin publicidad del navegador.
            </p>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-white transition-colors self-start p-1"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {isIOS ? (
           <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-xs text-blue-100 flex items-start gap-3">
             <span className="text-lg">💡</span>
             <p className="leading-relaxed">
               Para instalar en iPhone/iPad: pulsa el botón <strong>compartir</strong> <span className="inline-block px-1 bg-white/10 rounded">⎋</span> y luego selecciona <strong>"Añadir a la pantalla de inicio"</strong>.
             </p>
           </div>
        ) : (
          <div className="flex gap-3 mt-1">
            <button 
              onClick={() => setIsVisible(false)}
              className="flex-1 text-gray-400 hover:text-white text-sm font-semibold py-2.5 transition-colors"
            >
              Más tarde
            </button>
            <button 
              onClick={handleInstallClick}
              className="flex-[2] bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-3 rounded-2xl transition-all hover:scale-[1.02] shadow-xl shadow-red-900/30 active:scale-95"
            >
              Instalar Ahora
            </button>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          from { transform: translate(-50%, 100%) scale(0.9); opacity: 0; }
          to { transform: translate(-50%, 0) scale(1); opacity: 1; }
        }
        @media (max-width: 380px) {
          .xs\\:inline { display: none; }
        }
      `}} />
    </div>
  );
};

export default PWAInstall;
