// src/components/VideoPlayer.jsx
import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import Plyr from 'plyr';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const videoSrc = "https://giatv.bozztv.com/giatv/giatv-digimediosstreamavc/digimediosstreamavc/playlist.m3u8";

  useEffect(() => {
    const video = videoRef.current;
    let player;

    const setupPlayer = () => {
      player = new Plyr(video, {
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'airplay', 'fullscreen'],
        settings: ['quality', 'speed'],
        autoplay: true,
        muted: true, // Muteado para permitir autoplay segun politicas del navegador
      });
    };

    if (Hls.isSupported()) {
      const hls = new Hls({
        debug: false,
        enableWorker: true,
      });
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setupPlayer();
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error("Error fatal HLS, intentando recargar...", data);
          // Fallback simple si falla HLS
        }
      });

      return () => {
        hls.destroy();
        if (player) player.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari nativo
      video.src = videoSrc;
      video.addEventListener('loadedmetadata', () => {
        setupPlayer();
      });
    } else {
      console.error("Este navegador no soporta HLS");
      video.src = videoSrc;
      setupPlayer();
    }
  }, []);

  return (
    <div className="w-full relative bg-black rounded-xl overflow-hidden shadow-2xl shadow-red-900/20 border border-gray-800">
      <video
        ref={videoRef}
        className="w-full aspect-video"
        controls={false} // Plyr maneja los controles
        playsInline
        x-webkit-airplay="allow"
      />
      <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
        🔴 EN VIVO
      </div>
    </div>
  );
};

export default VideoPlayer;