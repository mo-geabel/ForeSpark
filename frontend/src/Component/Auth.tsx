import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode }: AuthModalProps) {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({email: '', password: '' , fullName: ''});
  const [error, setError] = useState('');
  const [_, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  if (!isOpen) return null;

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });

      // Debugging Step: Log the text before parsing
      const text = await response.text(); 
      console.log("Raw response:", text);
      const data = JSON.parse(text);

      if (!response.ok) throw new Error(data.message || 'Google Auth Failed');

      localStorage.setItem('fireforest_token', data.token);
      login(data.user);
      onClose();
      navigate('/app');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const endpoint = mode === 'login' ? '/login' : '/register';
    
    try {
      const response = await fetch(`${API_URL}/api/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Server error');

      localStorage.setItem('fireforest_token', data.token);
      login(data.user); 
      onClose();
      navigate('/app'); 
    } catch (err: any) {
      setError(err.message || 'Could not connect to server');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-emerald-100 p-10">
        <Link to="/">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 text-xl">✕</button>
        </Link>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          {error && <p className="text-red-500 text-xs mt-2 font-bold uppercase tracking-widest">{error}</p>}
        </div>

        {/* Google Login Section */}
        <div className="flex justify-center mb-8">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Login Failed')}
            useOneTap
            shape="pill"
            theme="outline"
            text={mode === 'login' ? 'signin_with' : 'signup_with'}
            width="320"
          />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <input 
              type="text" 
              placeholder="Full Name" 
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none border border-slate-100 focus:border-emerald-500" 
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none border border-slate-100 focus:border-emerald-500" 
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none border border-slate-100 focus:border-emerald-500" 
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          
          <button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg mt-4 transition-all active:scale-95">
            {mode === 'login' ? 'Sign In' : 'Join ForeSpark'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-slate-500">
            {mode === 'login' ? "Don't have an account?" : "Already a member?"}
          </span>
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="ml-2 font-bold text-emerald-600"
          >
            {mode === 'login' ? 'Register Now' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}