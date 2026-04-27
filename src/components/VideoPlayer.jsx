// src/components/VideoPlayer.jsx
import { useEffect, useRef } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import Hls from 'hls.js';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const hlsRef = useRef(null);
  const videoSrc = "https://giatv.bozztv.com/giatv/giatv-digimediosstreamavc/digimediosstreamavc/playlist.m3u8";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Configuración de Plyr con estética premium
    const plyrOptions = {
      autoplay: true,
      muted: true,
      controls: [
        'play-large', 
        'play', 
        'mute', 
        'volume', 
        'settings', 
        'fullscreen'
      ],
      settings: ['quality', 'speed'],
      quality: {
        default: 720,
        options: [1080, 720, 480, 360],
      },
      i18n: {
        play: 'Reproducir',
        pause: 'Pausa',
        mute: 'Silenciar',
        unmute: 'Activar sonido',
        settings: 'Ajustes',
        quality: 'Calidad',
        fullscreen: 'Pantalla completa',
      },
    };

    const initPlayer = () => {
      playerRef.current = new Plyr(video, plyrOptions);
    };

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false, // Desactivamos baja latencia para priorizar estabilidad
        backBufferLength: 90,
        maxBufferLength: 40,    // Aumentamos el buffer máximo a 40 segundos
        maxMaxBufferLength: 60,
        liveSyncDurationCount: 5, // Empezamos 5 segmentos por detrás del "vivo" real para tener margen
        liveMaxLatencyDurationCount: 10,
        manifestLoadingMaxRetry: 10,
        levelLoadingMaxRetry: 10,
      });
      hlsRef.current = hls;
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        initPlayer();
      });

      // Manejo de errores agresivo para mantener la señal viva
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.warn('Error de red, reintentando...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn('Error de media, recuperando...');
              hls.recoverMediaError();
              break;
            default:
              console.error('Error fatal, reiniciando reproductor...');
              hls.destroy();
              setTimeout(initPlayer, 2000);
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Para Safari nativo
      video.src = videoSrc;
      video.addEventListener('loadedmetadata', initPlayer);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="video-container relative group w-full bg-black rounded-2xl overflow-hidden shadow-2xl shadow-red-900/30 border border-white/5 transition-all duration-500 hover:border-red-500/30">
      <video
        ref={videoRef}
        className="plyr-react plyr"
        playsInline
        poster={`${import.meta.env.BASE_URL}3.png`}
      />
      
      {/* Badge de EN VIVO optimizado */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-red-500/50 pointer-events-none shadow-lg">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
        </span>
        <span className="text-white text-[10px] font-black uppercase tracking-widest">EN VIVO</span>
      </div>

      <style>{`
        /* Personalización de Plyr para matching de marca (Rojo) */
        :root {
          --plyr-color-main: #ef4444; /* red-500 */
          --plyr-video-background: #000;
          --plyr-menu-background: rgba(0, 0, 0, 0.9);
          --plyr-menu-color: #fff;
          --plyr-badge-border-radius: 4px;
        }

        .video-container .plyr--video {
          border-radius: 1rem;
        }

        .plyr--full-ui.plyr--video .plyr__control--overlaid {
          background: rgba(239, 68, 68, 0.85);
        }

        .plyr--full-ui.plyr--video .plyr__control--overlaid:hover {
          background: #ef4444;
        }

        /* Ocultar barra de progreso si es un stream en vivo puro (opcional) */
        /* .plyr__progress__container { display: none; } */
        
        .plyr__controls {
          background: linear-gradient(transparent, rgba(0,0,0,0.8)) !important;
          padding-top: 20px !important;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;