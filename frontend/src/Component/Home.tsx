import Navbar from './Nav';
import Hero from './Hero';
import About from './About';
import Contact from './Contact';
import { Element } from 'react-scroll';

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

      <footer className="py-16 text-center text-slate-600 border-t border-white/5">
        <div className="mb-4 font-black tracking-tighter text-xl text-emerald-500/50">FORESPARK</div>
        <p className="text-[10px] uppercase tracking-[0.5em]">© 2026 Protecting our Green Future</p>
      </footer>
    </div>
  );
}