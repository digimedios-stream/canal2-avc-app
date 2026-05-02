// src/components/VideoPlayer.jsx
import { useEffect, useRef, useState } from 'react';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const videoSrc = "https://giatv.bozztv.com/giatv/giatv-digimediosstreamavc/digimediosstreamavc/playlist.m3u8";
  const [isNative, setIsNative] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 1. Detectar si el dispositivo es móvil o tablet
    const isMobileOrTablet = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent)
      || (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);

    // 2. Intentar con el reproductor nativo PRIMERO
    const tryNativePlayback = () => {
      // Verificamos si el navegador soporta HLS de forma nativa (Safari, iOS, Android moderno)
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        setIsNative(true);
        video.src = videoSrc;
        video.play().catch(e => console.warn("Reproducción automática bloqueada:", e));
      } else {
        // Si no soporta nativo, recurrimos a hls.js
        console.warn("HLS nativo no soportado, intentando con librería externa...");
        loadHlsJs();
      }
    };

    // 3. Fallback con Hls.js (plan B, solo si no es móvil o falla lo nativo)
    const loadHlsJs = async () => {
      try {
        const Hls = (await import('hls.js')).default;
        if (Hls.isSupported()) {
          const hls = new Hls({
            debug: false,
            enableWorker: true,
            lowLatencyMode: false,
            backBufferLength: 30,
            maxBufferLength: 18,
            maxMaxBufferLength: 30,
            liveSyncDurationCount: 3,
          });
          hls.loadSource(videoSrc);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(e => console.warn("Reproducción automática bloqueada:", e));
          });
          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              console.error("Error fatal con hls.js", data);
              setError("Error al cargar el stream de video.");
            }
          });
        } else {
          console.error("Hls.js no es soportado en este navegador.");
          setError("Tu navegador no puede reproducir este stream.");
        }
      } catch (e) {
        console.error("Error cargando hls.js:", e);
        setError("Error al cargar el reproductor de video.");
      }
    };

    // Lógica principal
    if (isMobileOrTablet) {
      tryNativePlayback();
    } else {
      // En PC, la librería funciona bien, así que la usamos como plan principal
      loadHlsJs();
    }

    return () => {
      // Limpieza
    };
  }, []);

  return (
    <div className="video-container relative group w-full bg-black rounded-2xl overflow-hidden shadow-2xl shadow-red-900/30 border border-white/5 transition-all duration-500 hover:border-red-500/30">
      <video
        ref={videoRef}
        className="w-full aspect-video"
        controls
        playsInline
        autoPlay
        muted
        preload="auto"
        poster={`${import.meta.env.BASE_URL}3.png`}
      />
      
      {/* Badge de EN VIVO optimizado con diseño premium */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-red-500/50 pointer-events-none shadow-lg">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
        </span>
        <span className="text-white text-[10px] font-black uppercase tracking-widest">EN VIVO</span>
      </div>

      {error && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-sm z-20">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;