// src/components/RadioPlayer.jsx
import { useState, useRef, useEffect } from 'react';

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(null);
  const audioSrc = "https://stream.zeno.fm/qepqdbfb0k8uv";

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioRef.current.volume = val;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-800 shadow-xl">
      <div className="flex items-center gap-4">
        {/* Logo de la radio FM */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-900/30 overflow-hidden p-2">
          <img 
            src={`${import.meta.env.BASE_URL}FM radio 2.png`} 
            alt="FM Radio 2" 
            className="w-full h-full object-contain"
            onerror="this.style.display='none'"
          />
          {/* Fallback si no carga el logo */}
          <span className="text-white font-black text-xl hidden">FM</span>
        </div>
        
        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-900/30 transition-all hover:scale-105"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <h3 className="text-white font-bold text-lg">FM RADIO 2</h3>
              {/* Ecualizador Animado */}
              <div className="flex items-end gap-[2px] h-4 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-[3px] bg-red-500 rounded-full transition-all duration-300 ${
                      isPlaying ? `animate-eq bar-${i}` : 'h-[3px]'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <a 
              href="https://wa.me/5493775438505" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1ebd5e] p-2 rounded-full text-white transition-all hover:scale-110 shadow-lg shadow-green-900/30"
              title="WhatsApp Radio"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.237 3.483 8.42-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.499-5.688-1.447l-6.308 1.647zm6.357-3.912c1.533.908 3.391 1.446 5.488 1.446 5.454 0 9.893-4.438 9.893-9.892 0-2.652-1.031-5.145-2.901-7.016-1.871-1.871-4.365-2.903-7.01-2.903-5.454 0-9.891 4.438-9.891 9.892 0 2.13.633 4.145 1.83 5.867l-1.101 4.02 4.125-1.077zm11.376-7.234c-.313-.156-1.85-.912-2.138-1.016-.288-.104-.499-.156-.708.156-.21.312-.81 1.016-.991 1.225-.182.208-.364.234-.677.078-.313-.156-1.32-.486-2.515-1.553-.929-.828-1.556-1.852-1.738-2.164-.182-.312-.019-.481.137-.636.141-.14.313-.365.469-.547.156-.182.208-.312.313-.52.104-.208.052-.39-.026-.547-.078-.156-.708-1.705-.97-2.33-.255-.611-.514-.528-.708-.538-.182-.01-.39-.011-.599-.011-.208 0-.547.078-.832.39-.286.312-1.093 1.066-1.093 2.6s1.119 3.016 1.275 3.224c.156.208 2.193 3.344 5.312 4.692.742.321 1.321.513 1.771.656.745.237 1.423.204 1.958.124.597-.089 1.85-.756 2.112-1.446.262-.69.262-1.281.185-1.406-.078-.125-.288-.198-.602-.353z" />
              </svg>
            </a>
          </div>
          <p className="text-gray-400 text-sm">Monte Caseros • Señal en Vivo</p>
          <div className="flex items-center gap-2 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={audioSrc} preload="none" />
      
      <style>{`
        @keyframes eq {
          0% { height: 3px; }
          50% { height: 16px; }
          100% { height: 3px; }
        }
        .animate-eq {
          animation: eq 0.8s infinite ease-in-out;
        }
        .bar-1 { animation-delay: 0.1s; }
        .bar-2 { animation-delay: 0.3s; }
        .bar-3 { animation-delay: 0.2s; }
        .bar-4 { animation-delay: 0.4s; }
        .bar-5 { animation-delay: 0.1s; }
      `}</style>
    </div>
  );
};

export default RadioPlayer;