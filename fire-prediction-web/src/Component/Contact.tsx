import React from 'react';
import { Element } from 'react-scroll';

export default function Contact() {
  return (
    <Element name="contact" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative group p-1 bg-white">
          {/* Animated Glow behind the form */}
          <div className="absolute inset-0 bg-white blur-3xl rounded-[3rem] -z-10 group-hover:bg-emerald-600/20 transition-all duration-700" />
          
          <div className="bg-white backdrop-blur-2xl border border-slate-200 p-12 rounded-[3rem] shadow-sm">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black mb-4 text-black tracking-tight">Get in Touch</h2>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Collaborate with our AI team</p>
            </div>

            <form className="grid md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-4 tracking-widest">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-white border border-slate-200 p-4 rounded-2xl outline-none focus:border-emerald-500/50 transition-all text-black"/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-4 tracking-widest">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full bg-white border border-slate-200 p-4 rounded-2xl outline-none focus:border-emerald-500/50 transition-all text-black"/>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-4 tracking-widest">Message</label>
                <textarea placeholder="Tell us about your project..." className="w-full bg-white border border-slate-200 p-4 rounded-2xl h-40 outline-none focus:border-emerald-500/50 transition-all text-black resize-none"></textarea>
              </div>
              <button className="md:col-span-2 mt-4 bg-emerald-600 hover:bg-emerald-500 py-5 rounded-2xl tracking-[0.2em] transition-all shadow-lg shadow-emerald-900/30 active:scale-95 text-white uppercase text-xs">
                Send Analysis Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </Element>
  );
}