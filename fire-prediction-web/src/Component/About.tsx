import React from 'react';
import { Element } from 'react-scroll';

export default function About() {
  return (
    <Element name="about" className="py-32 px-6 bg-slate-50 border-y border-white/5">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Stats/Visuals */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-[2.5rem] text-center">
            <h4 className="text-4xl font-black text-emerald-500 mb-2">94%</h4>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Accuracy</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-[2.5rem] text-center mt-8">
            <h4 className="text-4xl font-black bg-transparent mb-2">24/7</h4>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Monitoring</p>
          </div>
        </div>

        {/* Right Side: Text */}
        <div>
          <h2 className="text-emerald-500 font-bold uppercase tracking-[0.3em] text-xs mb-4">Our Technology</h2>
          <h3 className="text-4xl md:text-5xl font-black mb-8 leading-tight bg-slate-50">
            Intelligence that <br/>Protects Nature.
          </h3>
          <p className="text-slate-400 text-lg leading-relaxed mb-6">
            FireForest utilizes a Convolutional Neural Network (CNN) architecture specifically trained on thousands of satellite spectral bands from Turkish forest regions.
          </p>
          <ul className="space-y-4 text-slate-300">
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Real-time vegetation moisture analysis
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Automated alert systems for local authorities
            </li>
          </ul>
        </div>

      </div>
    </Element>
  );
}