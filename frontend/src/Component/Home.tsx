import Navbar from './Nav';
import Hero from './Hero';
import About from './About';
import Contact from './Contact';
import { Element } from 'react-scroll';
import { Link } from 'react-router-dom';

interface HomeProps {
  onStart: () => void;
}

export default function Home({ onStart }: HomeProps) {
  return (
<div className="min-h-screen w-full bg-white overflow-y-auto overflow-x-hidden">
        <Navbar />
      
      <main>
        {/* We keep Hero wrapped in Element here if name is defined in Navbar */}
        <Element name="hero">
          <Hero onStart={onStart} />    
        </Element>

        <About />
        
        <Contact />
      </main>

      <footer className="py-14 text-center text-slate-500 border-t border-slate-100 bg-slate-50">
        <div className="mb-2 font-black tracking-tight text-xl text-emerald-600">FORESPARK AI</div>
        <p className="text-xs uppercase tracking-widest text-slate-400">© 2026 Protecting our Green Future</p>
        <div className="mt-4 flex items-center justify-center gap-6 text-xs font-semibold text-slate-600">
          <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          <Link to="/documentation" className="hover:text-emerald-600 transition-colors">Documentation</Link>
          <Link to="/privacy" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-emerald-600 transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}