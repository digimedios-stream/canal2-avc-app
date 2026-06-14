// src/components/VideoPlayer.jsx
import { useEffect, useRef, useState } from 'react';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const videoSrcHD = "https://giatv.bozztv.com/giatv/giatv-digimediosstreamavc/digimediosstreamavc/playlist.m3u8";
  // Reemplaza esta URL con el enlace .m3u8 de 480p cuando lo tengas
  const videoSrcMobile = "https://lbgo.bozztv.com/ssh101/ssh101/avchomero3/playlist.m3u8";

  const [isNative, setIsNative] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(36);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCastAvailable, setIsCastAvailable] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 1. Detectar si el dispositivo es móvil o tablet
    const isMobileOrTablet = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent)
      || (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);

    const activeVideoSrc = isMobileOrTablet ? videoSrcMobile : videoSrcHD;

    // 2. Intentar con el reproductor nativo PRIMERO
    const tryNativePlayback = () => {
      // Verificamos si el navegador soporta HLS de forma nativa (Safari, iOS, Android moderno)
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        setIsNative(true);
        video.src = activeVideoSrc;
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
          hls.loadSource(activeVideoSrc);
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

    // Lógica principal de reproducción
    if (isMobileOrTablet) {
      tryNativePlayback();
    } else {
      // En PC, la librería funciona bien, así que la usamos como plan principal
      loadHlsJs();
    }

    // Detectar cuando el video realmente empieza a reproducirse para ocultar el contador
    const handlePlay = () => setIsLoaded(true);
    const handlePlaying = () => setIsLoaded(true);
    const handleTimeUpdate = () => {
      if (video.currentTime > 0) {
        setIsLoaded(true);
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  // Inicialización de Chromecast
  useEffect(() => {
    // Configurar el callback global de Cast SDK
    window.__onGCastApiAvailable = function (isAvailable) {
      if (isAvailable && window.chrome && window.chrome.cast && window.chrome.cast.media) {
        setIsCastAvailable(true);
        const castContext = cast.framework.CastContext.getInstance();
        castContext.setOptions({
          receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
          autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
        });

        // Escuchar cambios de sesión para cargar el stream cuando se conecte
        castContext.addEventListener(
          cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
          (event) => {
            if (
              event.sessionState === cast.framework.SessionState.SESSION_STARTED ||
              event.sessionState === cast.framework.SessionState.SESSION_RESUMED
            ) {
              const castSession = castContext.getCurrentSession();
              if (castSession) {
                // Siempre enviamos la calidad HD (videoSrcHD) al Chromecast
                const mediaInfo = new chrome.cast.media.MediaInfo(videoSrcHD, 'application/x-mpegURL');
                mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
                mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
                mediaInfo.metadata.title = "AVC HD en Vivo";
                // Imagen opcional para la TV
                const baseUrl = window.location.origin + import.meta.env.BASE_URL;
                mediaInfo.metadata.images = [{ url: `${baseUrl}3.png` }];

                const request = new chrome.cast.media.LoadRequest(mediaInfo);
                request.autoplay = true;

                castSession.loadMedia(request).then(
                  () => console.log('Chromecast: Carga exitosa'),
                  (errorCode) => console.error('Chromecast error:', errorCode)
                );
              }
            }
          }
        );
      }
    };

    // Inyectar script de Cast SDK
    if (!document.getElementById('cast-sdk-script')) {
      const script = document.createElement('script');
      script.id = 'cast-sdk-script';
      script.src = "https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Intervalo del temporizador en retroceso
  useEffect(() => {
    if (isLoaded) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoaded]);

  return (
    <div className="video-container relative group w-full bg-black rounded-2xl overflow-hidden shadow-2xl shadow-red-900/30 border border-white/5 transition-all duration-500 hover:border-red-500/30">
      <style>{`
        @keyframes custom-shimmer {
          0% { transform: translateX(-150%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(150%); }
        }
        .animate-shimmer {
          animation: custom-shimmer 2.5s infinite linear;
        }
        google-cast-launcher {
          width: 28px !important;
          height: 28px !important;
          cursor: pointer;
          display: block;
        }
      `}</style>

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
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-red-500/50 pointer-events-none shadow-lg">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
        </span>
        <span className="text-white text-[10px] font-black uppercase tracking-widest">EN VIVO</span>
      </div>

      {/* Botón de Chromecast */}
      {isCastAvailable && (
        <div className="absolute top-4 right-4 z-30 bg-black/60 backdrop-blur-md rounded-full p-2 flex items-center justify-center shadow-xl border border-white/10 hover:border-red-500/50 transition-all hover:scale-105">
          <google-cast-launcher
            style={{
              '--connected-color': '#EF4444',
              '--disconnected-color': '#ffffff'
            }}
          ></google-cast-launcher>
        </div>
      )}

      {error && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-sm z-20">
          ⚠️ {error}
        </div>
      )}

      {/* Barra de progreso y contador debajo del video */}
      {!isLoaded && (
        <div className="w-full bg-black/50 backdrop-blur-md border-t border-white/5 px-4 py-3.5 transition-all duration-500 ease-in-out">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <p className="text-gray-300 text-xs font-bold tracking-wide uppercase">
                Estableciendo conexión en vivo...
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400 font-medium">Sincronizando señal:</span>
              <span className="text-xs font-black font-mono text-red-500 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-md shadow-inner">
                {timeLeft > 0 ? `${timeLeft}s` : 'Iniciando...'}
              </span>
            </div>
          </div>

          {/* Barra de progreso premium (retroceso de 100% a 0%) */}
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative shadow-inner border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-red-500 to-amber-500 rounded-full transition-all duration-1000 ease-linear shadow-lg shadow-red-500/40 relative overflow-hidden"
              style={{ width: `${(timeLeft / 36) * 100}%` }}
            >
              {/* Efecto de brillo animado en la barra */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.25)_50%,transparent_100%)] animate-shimmer w-1/2"></div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-400 text-[10px] font-medium">
              * Optimizando búfer para transmisión HD sin cortes
            </p>
            {timeLeft === 0 && (
              <span className="text-[10px] text-amber-500 font-semibold animate-pulse">
                Si no inicia automáticamente, presiona el botón Play
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;