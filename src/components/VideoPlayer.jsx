// src/components/VideoPlayer.jsx
import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const videoSrc = "https://giatv.bozztv.com/giatv/giatv-digimediosstreamavc/digimediosstreamavc/playlist.m3u8";

  useEffect(() => {
    if (!videoRef.current) return;

    // Detectamos si es móvil, tablet o iPad para habilitar la reproducción nativa
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
      || (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);

    const videoJsOptions = {
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      muted: true,
      preload: 'auto',
      sources: [{
        src: videoSrc,
        type: 'application/x-mpegURL'
      }],
      liveui: true,
      html5: {
        vhs: {
          // En móviles/tablets le decimos que NO use el motor propio y deje usar el nativo (overrideNative: false).
          // En PC/Escritorio usamos el motor técnico VHS (overrideNative: true).
          overrideNative: !isMobile,
          fastQualityChange: true,
        },
        nativeAudioTracks: isMobile,
        nativeVideoTracks: isMobile,
      },
      controlBar: {
        children: [
          'playToggle',
          'volumePanel',
          'progressControl',
          'liveDisplay',
          'fullscreenToggle',
        ],
      },
    };

    const player = playerRef.current = videojs(videoRef.current, videoJsOptions, () => {
      console.log('Video.js cargado. Modo Híbrido - Móvil:', isMobile);
    });

    // Recuperación agresiva de errores para mantener la señal viva en PC
    player.on('error', () => {
      console.warn('Error en la señal, intentando reconectar...');
      setTimeout(() => {
        player.src({ src: videoSrc, type: 'application/x-mpegURL' });
        player.load();
        player.play().catch(() => {});
      }, 2000);
    });

    // Recarga en caso de congelamiento (stalled)
    player.on('stalled', () => {
      console.warn('Señal estancada, refrescando buffer...');
      player.load();
      player.play().catch(() => {});
    });

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="video-container relative group w-full bg-black rounded-2xl overflow-hidden shadow-2xl shadow-red-900/30 border border-white/5 transition-all duration-500 hover:border-red-500/30">
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered vjs-theme-city"
          playsInline
          poster={`${import.meta.env.BASE_URL}3.png`}
        />
      </div>
      
      {/* Badge de EN VIVO optimizado */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-red-500/50 pointer-events-none shadow-lg">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
        </span>
        <span className="text-white text-[10px] font-black uppercase tracking-widest">EN VIVO</span>
      </div>

      <style>{`
        /* Personalización de Video.js para matching de marca premium (Rojo) */
        .video-js {
          background-color: #000;
          font-family: 'Inter', sans-serif;
          border-radius: 1rem;
        }

        .video-js .vjs-control-bar {
          background-color: rgba(0, 0, 0, 0.75) !important;
          backdrop-filter: blur(8px);
          border-bottom-left-radius: 1rem;
          border-bottom-right-radius: 1rem;
          height: 3.5em;
        }

        .video-js .vjs-play-progress, 
        .video-js .vjs-volume-level {
          background-color: #ef4444 !important; /* red-500 */
        }

        .video-js .vjs-big-play-button {
          background-color: rgba(239, 68, 68, 0.85) !important;
          border-color: #ef4444 !important;
          border-radius: 50% !important;
          width: 2.2em !important;
          height: 2.2em !important;
          line-height: 2.2em !important;
          margin-top: -1.1em !important;
          margin-left: -1.1em !important;
          transition: transform 0.3s ease, background-color 0.3s ease;
        }

        .video-js .vjs-big-play-button:hover {
          background-color: #ef4444 !important;
          transform: scale(1.1);
        }

        .video-js .vjs-load-progress {
          background: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;