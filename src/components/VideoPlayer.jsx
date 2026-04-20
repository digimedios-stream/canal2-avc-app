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

    // Detectar si es Android para usar una estrategia distinta
    const isAndroid = /Android/i.test(navigator.userAgent);

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
          // Si es Android, dejamos que el sistema maneje mas la señal (Native HLS)
          // Si es PC/iOS, usamos el motor VHS para mas control
          overrideNative: !isAndroid,
          fastQualityChange: true,
        },
        nativeAudioTracks: isAndroid,
        nativeVideoTracks: isAndroid,
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

    const player = playerRef.current = videojs(videoRef.current, videoJsOptions, () => {
      console.log('Video.js reinstalado. Modo Android:', isAndroid);
    });

    // Recuperación agresiva de errores
    player.on('error', () => {
      console.warn('Error en la señal, intentando reconectar...');
      setTimeout(() => {
        player.src({ src: videoSrc, type: 'application/x-mpegURL' });
        player.load();
        player.play().catch(() => {});
      }, 1500);
    });

    // Si la imagen se congela (stalling), forzamos recarga
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
    <div className="w-full relative bg-black rounded-xl overflow-hidden shadow-2xl shadow-red-900/20 border border-gray-800">
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered vjs-theme-city"
          playsInline
          poster={`${import.meta.env.BASE_URL}3.png`}
        />
      </div>
      <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg pointer-events-none">
        🔴 EN VIVO
      </div>

      <style>{`
        .video-js { background-color: #000; font-family: 'Inter', sans-serif; }
        .vjs-control-bar { background-color: rgba(0, 0, 0, 0.7) !important; backdrop-filter: blur(5px); }
        .vjs-play-progress, .vjs-volume-level { background-color: #ef4444 !important; }
        .vjs-big-play-button { 
          background-color: rgba(239, 68, 68, 0.8) !important; 
          border-color: #ef4444 !important;
          border-radius: 50% !important;
          width: 2em !important; height: 2em !important;
          line-height: 2em !important; margin-top: -1em !important; margin-left: -1em !important;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;