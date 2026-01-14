import { Element } from 'react-scroll';
import { Map, Target } from 'lucide-react';

export default function About() {

  return (
    <Element name="about" className="py-20 px-6 bg-slate-50 border-y border-white/5">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

        {/* Left Side: Stats / Visuals */}
        <div className="relative py-8">
          {/* Decorative connecting line */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-emerald-500/50 via-blue-500/50 to-emerald-500/50 blur-sm" />
          
          <div className="space-y-16">
            {/* Accuracy Stat */}
            <div className="flex items-center gap-6 group cursor-default">
              <div className="p-5 bg-emerald-500/5 rounded-full">
                <Target size={56} className="text-emerald-500" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-6xl font-black text-emerald-500">
                  99.5%
                </h4>
                <p className="text-sm text-slate-600 uppercase tracking-[0.2em] font-bold mt-2">
                  Test Accuracy
                </p>
              </div>
            </div>

            {/* Coverage Stat */}
            <div className="flex items-center gap-6 group cursor-default ml-auto w-fit">
              <div className="order-2 p-5 bg-blue-500/5 rounded-full">
                <Map size={56} className="text-blue-500" strokeWidth={2} />
              </div>
              <div className="order-1 text-right">
                <h4 className="text-6xl font-black text-blue-500">
                  3.7 Km²
                </h4>
                <p className="text-sm text-slate-600 uppercase tracking-[0.2em] font-bold mt-2">
                  Spatial Coverage
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Text */}
        <div>
          <h2 className="text-emerald-500 font-bold uppercase tracking-[0.3em] text-xs mb-4">
            Our Technology
          </h2>

          <h3 className="text-4xl md:text-5xl font-black mb-8 leading-tight bg-slate-50">
            Spatial Intelligence <br /> for Wildfire Risk
          </h3>

          <p className="text-slate-400 text-lg leading-relaxed mb-6">
            ForeSpark is a deep learning–based wildfire risk prediction system that processes
            satellite imagery of forested regions to produce both a binary risk indication and
            an associated confidence percentage. Unlike approaches that
            rely on a single image patch, the proposed system incorporates spatial context by
            jointly evaluating the target area together with its surrounding neighboring regions,
            enabling more reliable and environmentally consistent wildfire risk estimation.
          </p>


          <ul className="space-y-4 text-slate-300">
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              CNN-based analysis of RGB satellite imagery
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Spatial risk estimation using neighboring region context
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Mobile-oriented and lightweight model design
            </li>
          </ul>
        </div>

      </div>
    </Element>
  );
}
