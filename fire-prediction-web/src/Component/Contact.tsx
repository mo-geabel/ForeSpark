import React, { useRef, useState } from 'react';
import { Element } from 'react-scroll';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;

    setStatus('sending');

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID, 
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
      form.current, 
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => {
        setStatus('success');
        form.current?.reset();
    }, (error) => {
        console.log(error.text);
        setStatus('error');
    });
  };

  return (
    <Element name="contact" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative group p-1">
          <div className={`absolute inset-0 blur-3xl rounded-[3rem] -z-10 transition-all duration-700 ${status === 'success' ? 'bg-emerald-500/40' : 'bg-white group-hover:bg-emerald-600/20'}`} />
          
          <div className="bg-white/80 backdrop-blur-2xl border border-slate-200 p-12 rounded-[3rem] shadow-sm">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black mb-4 text-black tracking-tight">Get in Touch</h2>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Collaborate with our AI team</p>
            </div>

            <form ref={form} className="grid md:grid-cols-2 gap-6" onSubmit={sendEmail}>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-4 tracking-widest">Full Name</label>
                <input name="from_name" required type="text" placeholder="Jeff Dalton" className="w-full bg-white border border-slate-200 p-4 rounded-2xl outline-none focus:border-emerald-500/50 transition-all text-black"/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-4 tracking-widest">Email Address</label>
                <input name="reply_to" required type="email" placeholder="dalton@example.com" className="w-full bg-white border border-slate-200 p-4 rounded-2xl outline-none focus:border-emerald-500/50 transition-all text-black"/>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-4 tracking-widest">Message</label>
                <textarea name="message" required placeholder="Tell us about your project..." className="w-full bg-white border border-slate-200 p-4 rounded-2xl h-40 outline-none focus:border-emerald-500/50 transition-all text-black resize-none"></textarea>
              </div>
              
              <button 
                disabled={status === 'sending'}
                className={`md:col-span-2 mt-4 py-5 rounded-2xl tracking-[0.2em] transition-all shadow-lg active:scale-95 text-white uppercase text-xs font-bold
                ${status === 'success' ? 'bg-emerald-500' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'}`}
              >
                {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Analysis Request'}
              </button>
              
              {status === 'error' && <p className="text-red-500 text-center text-xs mt-2 md:col-span-2">Something went wrong. Please try again.</p>}
            </form>
          </div>
        </div>
      </div>
    </Element>
  );
}