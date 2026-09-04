import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useSignIn, useSignUp } from '@clerk/clerk-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'register' | 'forgot_password';
}

export default function AuthModal({ isOpen, onClose, initialMode }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    code: '',
  });
  const [pendingVerification, setPendingVerification] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [forgotStep, setForgotStep] = useState<'request' | 'verify_code' | 'set_password'>('request');
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || (import.meta.env.DEV ? '' : 'https://forestspark.onrender.com');

  // Dynamic Policy state
  const [policy, setPolicy] = useState<{ title: string; content: string; requireAcceptance: boolean; lastUpdated?: string } | null>(null);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/policies`)
      .then(res => {
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          return res.json();
        }
        return null;
      })
      .then(data => {
        if (data && data.title) setPolicy(data);
      })
      .catch(() => {});
  }, [API_URL]);

  const { signIn, setActive: setSignInActive, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();

  if (!isOpen) return null;

  // 1. Clerk Email Registration Submit (with Password Confirmation)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (policy?.requireAcceptance && !agreedToPolicy) {
      setError(`Please agree to the ${policy?.title || "Terms of Service & Privacy Policy"}`);
      return;
    }

    setError('');
    setIsLoading(true);

    if (isSignUpLoaded && signUp) {
      try {
        const [firstName, ...rest] = formData.fullName.trim().split(' ');
        await signUp.create({
          emailAddress: formData.email,
          password: formData.password,
          firstName: firstName || formData.fullName,
          lastName: rest.join(' ') || undefined,
        });

        // Send email verification code
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setPendingVerification(true);
        setInfoMessage(`Verification code sent to ${formData.email}`);
        setIsLoading(false);
        return;
      } catch (clerkErr: any) {
        setError(clerkErr?.errors?.[0]?.message || 'Registration failed');
        setIsLoading(false);
        return;
      }
    }

    // Fallback to legacy backend
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Server error');
      setPendingVerification(false);
      setRegistrationSuccess(true);
      setError('');
      setInfoMessage('Registration successful!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Verify Clerk Registration Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (isSignUpLoaded && signUp) {
      try {
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code: formData.code,
        });

        if (completeSignUp.status === 'complete') {
          setPendingVerification(false);
          setRegistrationSuccess(true);
          setError('');
          setInfoMessage('Email verification successful! Your account is ready.');
          return;
        } else {
          setError('Verification could not be completed. Please try again.');
        }
      } catch (err: any) {
        setError(err?.errors?.[0]?.message || 'Invalid verification code');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 3. Clerk Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (isSignInLoaded && signIn) {
      try {
        const result = await signIn.create({
          identifier: formData.email,
          password: formData.password,
        });

        if (result.status === 'complete') {
          await setSignInActive({ session: result.createdSessionId });
          onClose();
          navigate('/app');
          setIsLoading(false);
          return;
        }
      } catch (clerkErr: any) {
        console.log("Clerk sign-in notice:", clerkErr?.errors?.[0]?.message);
      }
    }

    // Fallback to legacy backend
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
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
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Clerk Forgot Password Flow: Step 1 - Send Code
  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setIsLoading(true);

    if (isSignInLoaded && signIn) {
      try {
        await signIn.create({
          strategy: 'reset_password_email_code',
          identifier: formData.email,
        });
        setForgotStep('verify_code');
        setInfoMessage(`Reset code sent to ${formData.email}`);
      } catch (err: any) {
        setError(err?.errors?.[0]?.message || 'Unable to request password reset');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Step 2: Validate code is entered before setting password
  const handleCheckResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || formData.code.trim().length < 4) {
      setError('Please enter the valid verification code sent to your email');
      return;
    }
    setError('');
    setInfoMessage('Code verified. Now set your new password.');
    setForgotStep('set_password');
  };

  // Step 3: Check passwords match and submit final reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill both password fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setError('');
    setIsLoading(true);

    if (isSignInLoaded && signIn) {
      try {
        const result = await signIn.attemptFirstFactor({
          strategy: 'reset_password_email_code',
          code: formData.code,
          password: formData.password,
        });

        if (result.status === 'complete') {
          await setSignInActive({ session: result.createdSessionId });
          onClose();
          navigate('/app');
        } else {
          setError('Password reset incomplete');
        }
      } catch (err: any) {
        setError(err?.errors?.[0]?.message || 'Invalid reset code or request expired');
        if (err?.errors?.[0]?.code === 'form_code_incorrect') {
          setForgotStep('verify_code');
        }
      } finally {
        setIsLoading(false);
      }
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
            {registrationSuccess && 'Registration Successful! 🎉'}
            {!registrationSuccess && mode === 'login' && 'Welcome Back'}
            {!registrationSuccess && mode === 'register' && (pendingVerification ? 'Verify Email' : 'Create Account')}
            {!registrationSuccess && mode === 'forgot_password' && 'Reset Password'}
          </h2>
          {error && <p className="text-red-500 text-xs mt-2 font-bold uppercase tracking-widest">{error}</p>}
          {infoMessage && <p className="text-emerald-600 text-xs mt-2 font-bold tracking-wide">{infoMessage}</p>}
        </div>

        {/* --- REGISTRATION SUCCESSFUL VIEW --- */}
        {registrationSuccess ? (
          <div className="text-center py-2 space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Your account for <span className="font-bold text-slate-900">{formData.email}</span> has been created successfully.
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-4 rounded-2xl">
              Please click below to proceed to the login page and sign in with your email and password.
            </div>
            <button
              type="button"
              onClick={() => {
                setRegistrationSuccess(false);
                setPendingVerification(false);
                setMode('login');
                setError('');
                setInfoMessage('Registration successful! Please enter your password to sign in.');
                setFormData((prev) => ({ ...prev, password: '', confirmPassword: '', code: '' }));
                if (window.location.pathname === '/register') {
                  navigate('/auth');
                }
              }}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg transition-all active:scale-95 text-xs uppercase tracking-widest"
            >
              Click to Login
            </button>
          </div>
        ) : (
          <>
            {/* Google SSO Button (only in login & register before verification) */}
            {mode !== 'forgot_password' && !pendingVerification && (
              <div className="mb-8">
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (signIn) {
                        signIn.authenticateWithRedirect({
                          strategy: "oauth_google",
                          redirectUrl: "/app",
                          redirectUrlComplete: "/app",
                        });
                      }
                    }}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm text-slate-700 font-semibold text-sm transition-all active:scale-98"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>
                {/* Google Policy Disclaimer */}
                <p className="text-[11px] text-slate-400 text-center mt-2.5 px-2">
                  By continuing with Google, you agree to our{' '}
                  <button
                    type="button"
                    onClick={() => setShowPolicyModal(true)}
                    className="text-emerald-600 font-bold hover:underline"
                  >
                    {policy?.title || "Terms of Service & Privacy Policy"}
                  </button>
                </p>
              </div>
            )}

            {/* --- REGISTER VERIFY CODE FORM --- */}
            {mode === 'register' && pendingVerification && (
              <form className="space-y-4" onSubmit={handleVerifyCode}>
                <input 
                  type="text" 
                  placeholder="Enter 6-digit Code" 
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none border border-slate-100 focus:border-emerald-500 font-mono tracking-widest text-center text-lg" 
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  required
                />
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg mt-4 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Complete'}
                </button>
              </form>
            )}

            {/* --- MAIN LOGIN / REGISTER FORM --- */}
            {((mode === 'login') || (mode === 'register' && !pendingVerification)) && (
              <form className="space-y-4" onSubmit={mode === 'login' ? handleLogin : handleRegister}>
                {mode === 'register' && (
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none border border-slate-100 focus:border-emerald-500" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                )}
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none border border-slate-100 focus:border-emerald-500" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none border border-slate-100 focus:border-emerald-500" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
                {mode === 'register' && (
                  <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none border border-slate-100 focus:border-emerald-500" 
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                  />
                )}

                {/* Dynamic Policy Agreement Checkbox */}
                {mode === 'register' && (
                  <div className="flex items-start gap-3 pt-1 px-1">
                    <input
                      type="checkbox"
                      id="web-policy-agreement"
                      checked={agreedToPolicy}
                      onChange={(e) => setAgreedToPolicy(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                    />
                    <label htmlFor="web-policy-agreement" className="text-xs text-slate-500 leading-snug cursor-pointer select-none">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPolicyModal(true);
                        }}
                        className="text-emerald-600 font-bold hover:underline"
                      >
                        {policy?.title || "Terms of Service & Privacy Policy"}
                      </button>
                    </label>
                  </div>
                )}

                {mode === 'login' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setError('');
                        setInfoMessage('');
                        setMode('forgot_password');
                        setForgotStep('request');
                      }}
                      className="text-xs font-semibold text-emerald-600 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg mt-4 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Join ForeSpark')}
                </button>
              </form>
            )}

            {/* --- FORGOT PASSWORD FLOW (3 Controlled Steps) --- */}
            {mode === 'forgot_password' && (
              <div className="space-y-4">
                {forgotStep === 'request' && (
                  <form className="space-y-4" onSubmit={handleRequestPasswordReset}>
                    <input 
                      type="email" 
                      placeholder="Enter your Email" 
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none border border-slate-100 focus:border-emerald-500" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg mt-4 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isLoading ? 'Sending Code...' : 'Send Reset Code'}
                    </button>
                  </form>
                )}

                {forgotStep === 'verify_code' && (
                  <form className="space-y-4" onSubmit={handleCheckResetCode}>
                    <input 
                      type="text" 
                      placeholder="Enter 6-digit Reset Code" 
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none border border-slate-100 focus:border-emerald-500 font-mono tracking-widest text-center text-lg" 
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      required
                    />
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg mt-4 transition-all active:scale-95 disabled:opacity-50"
                    >
                      Verify Code
                    </button>
                  </form>
                )}

                {forgotStep === 'set_password' && (
                  <form className="space-y-4" onSubmit={handleResetPassword}>
                    <input 
                      type="password" 
                      placeholder="New Password" 
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none border border-slate-100 focus:border-emerald-500" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                    <input 
                      type="password" 
                      placeholder="Confirm New Password" 
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 outline-none border border-slate-100 focus:border-emerald-500" 
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      required
                    />
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg mt-4 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isLoading ? 'Updating Password...' : 'Reset & Sign In'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Footer Navigation */}
            <div className="mt-8 text-center text-sm">
              {mode === 'login' && (
                <>
                  <span className="text-slate-500">Don't have an account?</span>
                  <button 
                    onClick={() => { setError(''); setInfoMessage(''); setMode('register'); setPendingVerification(false); }}
                    className="ml-2 font-bold text-emerald-600"
                  >
                    Register Now
                  </button>
                </>
              )}

              {mode === 'register' && (
                <>
                  <span className="text-slate-500">Already a member?</span>
                  <button 
                    onClick={() => { setError(''); setInfoMessage(''); setMode('login'); setPendingVerification(false); }}
                    className="ml-2 font-bold text-emerald-600"
                  >
                    Login
                  </button>
                </>
              )}

              {mode === 'forgot_password' && (
                <button 
                  onClick={() => { setError(''); setInfoMessage(''); setMode('login'); }}
                  className="font-bold text-emerald-600"
                >
                  ← Back to Login
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Dynamic Policy Modal Overlay */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {policy?.title || 'Terms of Service & Privacy Policy'}
                </h3>
                {policy?.lastUpdated && (
                  <p className="text-xs text-slate-400 mt-1">
                    Last updated: {new Date(policy.lastUpdated).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowPolicyModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
              {policy?.content || 'Please review the terms and policies before proceeding.'}
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPolicyModal(false)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95"
              >
                I Understand & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}