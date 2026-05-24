import { Link as ScrollLink } from 'react-scroll';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/logo.png';


export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="fixed top-0 w-full z-[100] border-b border-emerald-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">

        {/* Brand Logo */}
        <div
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="flex items-center gap-2"> {/* Changed span to div for flex control */}
            <img
              src={logo}
              alt="ForeSpark Logo"
              className="w-6 h-6 md:w-8 md:h-8 object-contain transition-transform group-hover:scale-110"
            />
            <span className="text-xl md:text-2xl font-black tracking-tighter text-emerald-600 group-hover:text-emerald-500 transition-colors">
              FORESPARK
            </span>
          </div>
        </div>

        {/* Navigation Links - Hidden on Mobile */}
        <div className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-widest text-slate-900">
          <ScrollLink to="hero" spy={true} smooth={true} offset={-80} duration={500} className="hover:text-emerald-600 cursor-pointer transition-colors">Home</ScrollLink>
          <ScrollLink to="about" spy={true} smooth={true} offset={-80} duration={500} className="hover:text-emerald-600 cursor-pointer transition-colors">About</ScrollLink>
          <ScrollLink to="contact" spy={true} smooth={true} offset={-80} duration={500} className="hover:text-emerald-600 cursor-pointer transition-colors">Contact</ScrollLink>
          <Link to="/presentation" className="hover:text-emerald-600 cursor-pointer transition-colors">Presentation</Link>
          {isAuthenticated && (
            <Link to="/history" className="hover:text-emerald-600 cursor-pointer transition-colors">
              {user?.role === 'admin' ? 'Scan Users History' : 'My History'}
            </Link>
          )}
        </div>

        {/* Mobile Menu Button & Auth Tabs Container */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link to="/auth" className="hover:text-emerald-600 cursor-pointer transition-colors">
                  <button className="px-2 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-emerald-600 transition-colors">
                    Sign In
                  </button>
                </Link>

                <Link to="/register" className="hover:text-emerald-600 cursor-pointer transition-colors">
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg md:rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                    Register
                  </button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2 md:gap-4">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">
                  {user?.fullName.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg md:rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all active:scale-95"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-emerald-100 shadow-xl py-4 px-4 flex flex-col gap-4">
          <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-4">
            <ScrollLink to="hero" onClick={closeMenu} spy={true} smooth={true} offset={-80} duration={500} className="hover:text-emerald-600 cursor-pointer transition-colors">Home</ScrollLink>
            <ScrollLink to="about" onClick={closeMenu} spy={true} smooth={true} offset={-80} duration={500} className="hover:text-emerald-600 cursor-pointer transition-colors">About</ScrollLink>
            <ScrollLink to="contact" onClick={closeMenu} spy={true} smooth={true} offset={-80} duration={500} className="hover:text-emerald-600 cursor-pointer transition-colors">Contact</ScrollLink>
            <Link to="/presentation" onClick={closeMenu} className="hover:text-emerald-600 cursor-pointer transition-colors">Presentation</Link>
            {isAuthenticated && (
              <Link to="/history" onClick={closeMenu} className="hover:text-emerald-600 cursor-pointer transition-colors">
                {user?.role === 'admin' ? 'Scan Users History' : 'My History'}
              </Link>
            )}
          </div>

          <div className="sm:hidden flex flex-col gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/auth" onClick={closeMenu}>
                  <button className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest">Sign In</button>
                </Link>
                <Link to="/register" onClick={closeMenu}>
                  <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20">Register</button>
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold text-xs uppercase tracking-widest">
                Logout
              </button>
            )}
          </div>
        </div>
      )}


    </nav>
  );
}