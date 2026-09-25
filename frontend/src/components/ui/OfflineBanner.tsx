import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, AlertCircle } from 'lucide-react';
import { Button } from './button';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-rose-500 text-white rounded-xl shadow-2xl backdrop-blur-md border border-rose-400/50 min-w-[320px]"
        >
          <WifiOff className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold">Connection Lost</h4>
            <p className="text-xs text-rose-100">FraudShield AI is operating in offline cache mode. Live predictions are suspended.</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.location.reload()} 
            className="text-white hover:bg-rose-600 rounded-lg px-3 py-1 h-auto text-xs font-semibold shrink-0"
          >
            Retry
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
