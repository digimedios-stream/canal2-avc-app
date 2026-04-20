// src/components/VideoPlayer.jsx
import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const videoSrc = "https://giatv.bozztv.com/giatv/giatv-digimediosstreamavc/digimediosstreamavc/playlist.m3u8";

  useEffect(() => {
    // Asegurarse de que el elemento existe
    if (!videoRef.current) return;

    // Configuración de Video.js
    const videoJsOptions = {
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      muted: true, // Necesario para autoplay
      preload: 'auto',
      sources: [{
        src: videoSrc,
        type: 'application/x-mpegURL'
      }],
      liveui: true, // Interfaz específica para en vivo
      html5: {
        vhs: {
          overrideNative: true, // Usar nuestro motor de HLS en vez del nativo para mas control
          fastQualityChange: true,
        },
        nativeAudioTracks: false,
        nativeVideoTracks: false
      },
      controlBar: {
        children: [
          'playToggle',
          'volumePanel',
          'progressControl',
          'liveDisplay',
          'remainingTimeDisplay',
          'fullscreenToggle',
        ],
      },
    };

    // Inicializar el reproductor
    const player = playerRef.current = videojs(videoRef.current, videoJsOptions, () => {
      console.log('Video.js Player listo');
    });

    // Lógica de recuperación de errores (muy importante para evitar cortes de 17s)
    player.on('error', () => {
      const error = player.error();
      console.warn('Error detectado en Video.js, intentando recuperar...', error);
      
      // Esperar un segundo y reintentar la carga de la fuente
      setTimeout(() => {
        player.src({ src: videoSrc, type: 'application/x-mpegURL' });
        player.load();
        player.play().catch(e => console.log('Error al reanudar:', e));
      }, 2000);
    });

    // Limpieza al desmontar
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full relative bg-black rounded-xl overflow-hidden shadow-2xl shadow-red-900/20 border border-gray-800 video-js-container">
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered vjs-theme-city"
          playsInline
        />
      </div>
      <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg pointer-events-none">
        🔴 EN VIVO
      </div>

      <style>{`
        /* Estilos personalizados para que Video.js combine con la App */
        .video-js {
          background-color: #000;
          font-family: 'Inter', sans-serif;
        }
        .vjs-control-bar {
          background-color: rgba(0, 0, 0, 0.7) !important;
          backdrop-filter: blur(5px);
        }
        .vjs-play-progress, .vjs-volume-level {
          background-color: #ef4444 !important; /* Rojo Tailwind 500 */
        }
        .vjs-big-play-button {
          background-color: rgba(239, 68, 68, 0.8) !important;
          border-color: #ef4444 !important;
          border-radius: 50% !important;
          width: 2em !important;
          height: 2em !important;
          line-height: 2em !important;
          margin-top: -1em !important;
          margin-left: -1em !important;
        }
        .vjs-live-display {
          font-weight: bold;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;