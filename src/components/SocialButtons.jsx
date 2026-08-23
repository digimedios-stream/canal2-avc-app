// src/components/SocialButtons.jsx
const SocialButtons = () => {
  const handleShare = async () => {
    const shareData = {
      title: 'Canal 2 AVC',
      text: 'Mirá Canal 2 AVC en vivo',
      url: 'https://canal2avcmontecaseros.com.ar/'
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Enlace copiado al portapapeles');
      }
    } catch (err) {
      console.error('Error al compartir:', err);
    }
  };

  return (
    <div className="flex gap-2 sm:gap-3">
      <button
        onClick={handleShare}
        className="bg-[#6B7280] hover:bg-[#4B5563] text-white p-3 rounded-xl flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-gray-900/30"
        aria-label="Compartir"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span className="font-semibold hidden sm:inline">Compartir</span>
      </button>

      <a
        href="https://www.facebook.com/canal2AVCMonteCaseros"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#1877F2] hover:bg-[#0e5ab3] text-white p-3 rounded-xl flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-blue-900/30"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
        <span className="font-semibold hidden sm:inline">Facebook</span>
      </a>
      
      <a
        href="https://www.youtube.com/@canal2avcmontecaseros/streams"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#FF0000] hover:bg-[#cc0000] text-white p-3 rounded-xl flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-red-900/30"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
        <span className="font-semibold hidden sm:inline">YouTube</span>
      </a>
    </div>
  );
};

export default SocialButtons;