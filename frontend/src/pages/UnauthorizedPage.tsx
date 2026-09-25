import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft, Home, LogIn } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const currentRole = user?.role || 'Guest';

  const handleSwitchAccount = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-300">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-6 shadow-sm">
        <ShieldAlert className="w-8 h-8 text-amber-600" />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold tracking-tight text-slate-900 mb-3"
      >
        Access Restricted
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-base text-slate-500 mb-2 max-w-md"
      >
        This section is reserved for <strong className="text-slate-700">Fraud Analysts</strong> and <strong className="text-slate-700">Administrators</strong>.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 mb-8"
      >
        Current Role: <span className="text-primary font-bold">{currentRole}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Button>
        <Button onClick={() => navigate('/dashboard')} variant="outline" className="gap-2">
          <Home className="w-4 h-4" /> Dashboard
        </Button>
        <Button onClick={handleSwitchAccount} className="gap-2 bg-primary text-white hover:bg-primary/90">
          <LogIn className="w-4 h-4" /> Log In as Analyst / Admin
        </Button>
      </motion.div>
    </div>
  );
};
