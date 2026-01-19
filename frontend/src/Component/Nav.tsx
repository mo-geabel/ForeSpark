import { Link as ScrollLink } from 'react-scroll';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-[100] border-b border-emerald-100 bg-transparent/15 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
       {/* Brand Logo */}
<div 
  className="flex items-center gap-2 group cursor-pointer" 
  onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
>
  <div className="flex items-center gap-2"> {/* Changed span to div for flex control */}
    <img
      src={logo}
      alt="ForeSpark Logo"
      className="w-8 h-8 object-contain transition-transform group-hover:scale-110"
    />
    <span className="text-2xl font-black tracking-tighter text-emerald-600 group-hover:text-emerald-500 transition-colors">
      FORESPARK
    </span>
  </div>
</div>

        {/* Navigation Links - Hidden on Mobile */}
        <div className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-widest text-slate-900">
          <ScrollLink to="hero" spy={true} smooth={true} offset={-80} duration={500} className="hover:text-emerald-600 cursor-pointer transition-colors">Home</ScrollLink>
          <ScrollLink to="about" spy={true} smooth={true} offset={-80} duration={500} className="hover:text-emerald-600 cursor-pointer transition-colors">About</ScrollLink>
          <ScrollLink to="contact" spy={true} smooth={true} offset={-80} duration={500} className="hover:text-emerald-600 cursor-pointer transition-colors">Contact</ScrollLink>
          {isAuthenticated && (
            <Link to="/history" className="hover:text-emerald-600 cursor-pointer transition-colors">
              {user?.role === 'admin' ? 'Scan Users History' : 'My History'}
            </Link>
          )}
        </div>

        {/* Auth Tabs */}
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
            <Link to="/auth" className="hover:text-emerald-600 cursor-pointer transition-colors">
          <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-emerald-600 transition-colors">
            Sign In
          </button>
            </Link>
          
        <Link to="/register" className="hover:text-emerald-600 cursor-pointer transition-colors">
          <button 
            
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
            Register
          </button>
          </Link>
          </>
          ) : (
            <div className="flex items-center gap-4">
              {/* Display User Name */}
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {user?.fullName.split(' ')[0]}
              </span>

              {/* DESIGN: Logout Button (Matching your styling) */}
              <button 
                onClick={handleLogout}
                className="bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}