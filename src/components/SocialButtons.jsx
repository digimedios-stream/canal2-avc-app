// src/components/SocialButtons.jsx
const SocialButtons = () => {
  return (
    <div className="flex gap-3">
      <a
        href="https://www.facebook.com/canal2AVCMonteCaseros"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#1877F2] hover:bg-[#0e5ab3] p-3 rounded-xl flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-blue-900/30"
      >
        <img 
          src="/face 225.fw.png" 
          alt="Facebook" 
          className="w-6 h-6 object-contain"
          onerror="this.style.display='none'"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
        <span className="font-semibold hidden sm:inline">Facebook</span>
      </a>
      
      <a
        href="https://www.youtube.com/@canal2avcmontecaseros/streams"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#FF0000] hover:bg-[#cc0000] p-3 rounded-xl flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-red-900/30"
      >
        <img 
          src="/hd-youtube-logo.png" 
          alt="YouTube" 
          className="w-6 h-6 object-contain"
          onerror="this.style.display='none'"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
        <span className="font-semibold hidden sm:inline">YouTube</span>
      </a>
    </div>
  );
};

export default SocialButtons;