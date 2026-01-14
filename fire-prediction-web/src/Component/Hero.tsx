import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
interface HeroProps {
  onStart: () => void;
}

export default function Hero({}: HeroProps) {
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const handleStartAnalysis = () => {
    if (isAuthenticated) {
      // User is logged in, proceed to the map
      navigate('/app');
    } else {
      // User is NOT logged in, open the login modal
      navigate('/auth');
    }
  };
  return (
    <header className="relative h-screen w-full flex items-center justify-center px-6 overflow-hidden bg-white">
      {/* BACKGROUND IMAGE - Low Opacity */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2000" 
          className="w-full h-full object-cover opacity-100" 
          alt="Forest"
        />
        {/* Light Fade: Top is white, middle is clear, bottom is white */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/20 to-white" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mt-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[12px] -[0.2em] mb-8 uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            TÜRKIYE REGION 
          </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8 text-slate-900">
          AI <span className='text-emerald-600'>Wild</span><span className='text-orange-500'>Fire</span> <br /> 
          <span className="text-slate-900">Prediction</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
          Advanced deep CNN model analyzing satellite images to protect our green future
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={handleStartAnalysis} className="w-full sm:w-auto px-10 py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 shadow-sm shadow-emerald-100">
            Start Analysis
          </button>
          <button onClick={() => navigate('/documentation')} className="w-full sm:w-auto px-10 py-5 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200">
            Read Documentation
          </button>
        </div>
      </div>
    </header>
  );
}