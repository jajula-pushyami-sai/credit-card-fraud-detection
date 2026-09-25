import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, Eye, EyeOff, AlertCircle, BarChart2, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/core/api/client';

// ─── Zod schemas ──────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name:  z.string().min(1, 'Last name is required'),
  email:      z.string().email('Enter a valid email address'),
  password:   z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFields    = z.infer<typeof loginSchema>;
type RegisterFields = z.infer<typeof registerSchema>;

// ─── Field component ─────────────────────────────────────────────────────────
function Field({
  id, label, type = 'text', placeholder, error,
  registration
}: {
  id: string; label: string; type?: string; placeholder?: string;
  error?: string; registration: any;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs font-semibold text-slate-800">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={isPassword ? (show ? 'text' : 'password') : type}
          placeholder={placeholder}
          autoComplete={isPassword ? 'current-password' : type === 'email' ? 'email' : 'off'}
          className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-colors pr-${isPassword ? '10' : '4'} ${
            error ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'
          }`}
          {...registration}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5 font-medium">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export const LoginPage = () => {
  const location = useLocation();
  const [mode, setMode] = useState<'login' | 'register'>(location.pathname === '/register' ? 'register' : 'login');
  const [serverError, setServerError] = useState('');

  const setUser    = useAuthStore(s => s.setUser);
  const setTokens  = useAuthStore(s => s.setTokens);
  const navigate   = useNavigate();
  const from       = (location.state as any)?.from || '/calculate';

  // ── Login form ──────────────────────────────────────────────────────────────
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  const loginForm = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: { 
      email: isDemoMode ? 'demo@fraudshield.dev' : '', 
      password: isDemoMode ? 'Demo@1234' : '' 
    },
  });

  const handleLogin = async (data: LoginFields) => {
    setServerError('');
    try {
      const res = await apiClient.post('/auth/login', data);
      const { user, access_token, refresh_token } = res.data.data;
      setUser(user);
      setTokens(access_token, refresh_token);
      navigate(from, { replace: true });
    } catch (err: any) {
      setServerError(err?.response?.data?.message || 'Invalid credentials. Please try again.');
    }
  };

  // ── Register form ───────────────────────────────────────────────────────────
  const registerForm = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegister = async (data: RegisterFields) => {
    setServerError('');
    try {
      await apiClient.post('/auth/register', data);
      // Auto-login after registration to obtain tokens
      const res = await apiClient.post('/auth/login', { email: data.email, password: data.password });
      const { user, access_token, refresh_token } = res.data.data;
      setUser(user);
      setTokens(access_token, refresh_token);
      navigate('/calculate', { replace: true });
    } catch (err: any) {
      const msgs = err?.response?.data?.errors;
      if (msgs) {
        const first = Object.values(msgs).flat()[0] as string;
        setServerError(first);
      } else {
        setServerError(err?.response?.data?.message || 'Registration failed. Please try again.');
      }
    }
  };

  const switchMode = (m: 'login' | 'register') => {
    setMode(m);
    setServerError('');
    loginForm.clearErrors();
    registerForm.clearErrors();
  };

  const isLoginLoading    = loginForm.formState.isSubmitting;
  const isRegisterLoading = registerForm.formState.isSubmitting;

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col md:flex-row font-sans overflow-x-hidden">
      
      {/* ── Left panel — Enterprise Security (40%) ──────────────────────── */}
      <div className="hidden md:flex flex-col w-[40%] bg-gradient-to-br from-[#0F766E] to-[#115E59] text-white p-10 lg:p-12 relative overflow-hidden shrink-0 min-h-screen">
        
        {/* Animated Digital Shield/Network Background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
          />
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-teal-800/40 rounded-full blur-[120px]" />
        </div>

        {/* Floating Particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
          />
        ))}

        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 select-none w-max group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md overflow-hidden">
              <img src="/logo.svg" alt="FraudShield AI Logo" className="w-6 h-6 invert relative z-10 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">FraudShield AI</span>
          </Link>

          {/* Value props */}
          <div className="space-y-10 my-auto py-8">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4 text-white"
              >
                Secure Financial <br />Intelligence.
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="text-white/80 text-base lg:text-lg leading-relaxed max-w-sm"
              >
                Protect every transaction with enterprise-grade AI fraud detection and real-time explainability.
              </motion.p>
            </div>

            <div className="space-y-5">
              {[
                { icon: ShieldCheck, title: 'Real-Time Fraud Detection', desc: 'Sub-millisecond processing' },
                { icon: BarChart2, title: 'Explainable AI Predictions', desc: 'SHAP value transparency' },
                { icon: Lock, title: 'Enterprise Security', desc: 'SOC 2-ready architecture' },
              ].map(({ icon: Icon, title, desc }, idx) => (
                <motion.div 
                  key={title} 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                  className="flex items-center gap-4 group cursor-default"
                >
                  <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0 backdrop-blur-md group-hover:bg-white/20 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm lg:text-base">{title}</h4>
                    <p className="text-white/60 text-xs lg:text-sm mt-0.5">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-xs text-white/50 font-medium tracking-wider uppercase">
            © {new Date().getFullYear()} FraudShield AI Platform
          </div>
        </div>
      </div>

      {/* ── Right panel — Form (60%) ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative bg-[#F8FAF9] min-h-screen overflow-y-auto">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

        <div className="flex-1 p-4 sm:p-8 z-10 flex flex-col justify-center items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[460px] my-auto py-4"
          >
            {/* Mode toggle */}
            <div className="flex bg-slate-100 rounded-xl p-1 mb-6 shadow-inner">
              {(['login', 'register'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                    mode === m
                      ? 'bg-white text-slate-900 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 font-semibold'
                  }`}
                >
                  {m === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            {/* Auth Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_10px_35px_-10px_rgba(15,118,110,0.08)] p-6 sm:p-8 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {mode === 'login' ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="mb-6 text-center">
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Welcome Back</h1>
                      <p className="text-xs sm:text-sm text-slate-500">Sign in to continue to FraudShield AI</p>
                    </div>

                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                      <Field
                        id="login-email"
                        label="Email Address"
                        type="email"
                        placeholder="you@company.com"
                        error={loginForm.formState.errors.email?.message}
                        registration={loginForm.register('email')}
                      />
                      <Field
                        id="login-password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        error={loginForm.formState.errors.password?.message}
                        registration={loginForm.register('password')}
                      />

                      <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className="relative flex items-center justify-center w-4 h-4 border border-slate-300 rounded overflow-hidden bg-white group-hover:border-[#0F766E] transition-colors">
                            <input type="checkbox" className="absolute opacity-0 w-full h-full cursor-pointer peer" />
                            <div className="w-full h-full bg-[#0F766E] scale-0 peer-checked:scale-100 transition-transform flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                          </div>
                          <span className="text-slate-600 font-medium select-none group-hover:text-slate-900 transition-colors">Remember me</span>
                        </label>
                        <a href="#" className="font-semibold text-[#0F766E] hover:text-[#0F766E]/80 transition-colors">Forgot password?</a>
                      </div>

                      {serverError && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-700 font-medium">
                          <AlertCircle className="w-4 h-4 shrink-0" /> {serverError}
                        </motion.div>
                      )}

                      <Button type="submit" disabled={isLoginLoading} className="w-full h-11 rounded-xl text-sm font-semibold bg-[#0F766E] hover:bg-[#0F766E]/90 text-white shadow-sm mt-1">
                        {isLoginLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Signing in…</> : 'Sign In'}
                      </Button>

                      <div className="relative flex items-center py-2.5">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink-0 mx-3 text-slate-400 text-[11px] font-medium uppercase tracking-wider">or continue with</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                      </div>

                      <Button type="button" variant="outline" className="w-full h-11 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 bg-white">
                        <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        Google
                      </Button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="mb-6 text-center">
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Create Account</h1>
                      <p className="text-xs sm:text-sm text-slate-500">Join FraudShield AI in seconds</p>
                    </div>

                    <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-3.5">
                      <div className="grid grid-cols-2 gap-3">
                        <Field id="reg-fname" label="First Name" placeholder="Jane" error={registerForm.formState.errors.first_name?.message} registration={registerForm.register('first_name')} />
                        <Field id="reg-lname" label="Last Name" placeholder="Doe" error={registerForm.formState.errors.last_name?.message} registration={registerForm.register('last_name')} />
                      </div>
                      <Field id="reg-email" label="Work Email" type="email" placeholder="you@company.com" error={registerForm.formState.errors.email?.message} registration={registerForm.register('email')} />
                      <Field id="reg-password" label="Password" type="password" placeholder="Min 8 characters" error={registerForm.formState.errors.password?.message} registration={registerForm.register('password')} />

                      {serverError && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-700 font-medium">
                          <AlertCircle className="w-4 h-4 shrink-0" /> {serverError}
                        </motion.div>
                      )}

                      <Button type="submit" disabled={isRegisterLoading} className="w-full h-11 rounded-xl text-sm font-semibold bg-[#0F766E] hover:bg-[#0F766E]/90 text-white shadow-sm mt-2">
                        {isRegisterLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating account…</> : 'Create Account'}
                      </Button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="text-center mt-6 text-xs sm:text-sm text-slate-500">
              {mode === 'login'
                ? <>Don't have an account? <button onClick={() => switchMode('register')} className="font-semibold text-[#0F766E] hover:text-[#0F766E]/80 transition-colors">Sign up</button></>
                : <>Already have an account? <button onClick={() => switchMode('login')} className="font-semibold text-[#0F766E] hover:text-[#0F766E]/80 transition-colors">Sign in</button></>
              }
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
