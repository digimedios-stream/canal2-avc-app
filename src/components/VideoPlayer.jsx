// src/components/VideoPlayer.jsx
import { useEffect, useRef } from 'react';
import shaka from 'shaka-player/dist/shaka-player.compiled.js';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const videoSrc = "https://giatv.bozztv.com/giatv/giatv-digimediosstreamavc/digimediosstreamavc/playlist.m3u8";

  useEffect(() => {
    // Instalar pollyfills para compatibilidad maxima
    shaka.polyfill.installAll();

    if (!shaka.Player.isBrowserSupported()) {
      console.error('Shaka Player no es soportado en este navegador');
      return;
    }

    const initPlayer = async () => {
      const video = videoRef.current;
      const player = new shaka.Player(video);

      // Configuración de robustez (Buffer agresivo)
      player.configure({
        streaming: {
          bufferingGoal: 20, // 20 segundos de buffer acumulado
          rebufferingGoal: 2,
          bufferBehind: 10,
          retryParameters: {
            maxAttempts: 5,
            baseDelay: 1000,
            backoffFactor: 2,
          },
          // Ignorar errores de texto/subtitulos para que no corten el video
          ignoreTextStreamFailures: true,
        },
        manifest: {
          retryParameters: {
            maxAttempts: 5,
          }
        }
      });

      // Escuchar errores
      player.addEventListener('error', (event) => {
        console.error('Error en Shaka Player:', event.detail);
        // Intentar recuperar si es un error critico
        if (event.detail.severity === 2) {
          player.load(videoSrc).catch(e => console.error('Error al reintentar:', e));
        }
      });

      try {
        await player.load(videoSrc);
        console.log('Shaka Player cargado exitosamente');
        video.play().catch(e => {
          console.log('Autoplay bloqueado, esperando interacción');
        });
      } catch (e) {
        console.error('Error al cargar la fuente en Shaka:', e);
      }

      return player;
    };

    let currentPlayer;
    initPlayer().then(player => {
      currentPlayer = player;
    });

    return () => {
      if (currentPlayer) {
        currentPlayer.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full relative bg-black rounded-xl overflow-hidden shadow-2xl shadow-red-900/20 border border-gray-800">
      <video
        ref={videoRef}
        className="w-full aspect-video outline-none"
        poster={`${import.meta.env.BASE_URL}3.png`}
        controls
        playsInline
        muted
        autoPlay
      />
      <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg pointer-events-none">
        🔴 EN VIVO
      </div>
      
      <style>{`
        /* Personalización de los controles nativos para que se vean mejor */
        video::-webkit-media-controls-panel {
          background-image: linear-gradient(transparent, rgba(0,0,0,0.8)) !important;
        }
        video.vjs-waiting {
          filter: grayscale(1) blur(2px);
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;