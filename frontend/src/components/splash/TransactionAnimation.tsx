import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, MapPin, Clock, DollarSign, ShoppingCart } from 'lucide-react';

export function TransactionAnimation() {
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowCards(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center w-full h-full"
    >
      {/* Raining Transactions (Nodes) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => {
          const isRed = i % 15 === 0;
          return (
            <motion.div
              key={i}
              className={`absolute rounded-sm ${isRed ? 'bg-red-500' : 'bg-[#124E66]'}`}
              style={{
                width: isRed ? 6 : 4,
                height: isRed ? 24 : 12,
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                boxShadow: isRed ? '0 0 15px red' : '0 0 10px #124E66'
              }}
              animate={{ 
                y: ['0vh', '105vh'],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear"
              }}
            />
          );
        })}
      </div>

      {/* Fraud Cards Popups */}
      <AnimatePresence>
        {showCards && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Left Card */}
            <motion.div
              initial={{ opacity: 0, x: -100, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, x: -150, scale: 1, rotate: -5 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="absolute bg-[#2E3944]/80 backdrop-blur-xl border border-red-500/50 p-4 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.2)] w-64"
            >
              <div className="flex items-center gap-2 text-red-400 mb-3 border-b border-red-500/30 pb-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">High Risk</span>
              </div>
              <div className="space-y-2 text-sm text-[#D3D9D4]">
                <div className="flex justify-between"><span className="flex items-center gap-1 text-[#748092]"><DollarSign className="h-3 w-3"/>Amount</span> <span className="font-mono text-red-300">$12,450</span></div>
                <div className="flex justify-between"><span className="flex items-center gap-1 text-[#748092]"><ShoppingCart className="h-3 w-3"/>Merchant</span> <span>CryptoEx</span></div>
                <div className="flex justify-between"><span className="flex items-center gap-1 text-[#748092]"><MapPin className="h-3 w-3"/>Location</span> <span>Moscow, RU</span></div>
                <div className="flex justify-between"><span className="flex items-center gap-1 text-[#748092]"><Clock className="h-3 w-3"/>Time</span> <span className="font-mono">03:14 AM</span></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cinematic Text */}
      <div className="z-10 flex flex-col items-center justify-center space-y-6 text-center mt-32">
        <motion.h2 
          className="text-4xl md:text-5xl font-light tracking-wide text-[#D3D9D4]"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Among them...
        </motion.h2>

        <motion.h1 
          className="text-5xl md:text-7xl font-bold tracking-tight text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]"
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, delay: 1.5, ease: "easeOut", type: "spring" }}
        >
          Fraud hides.
        </motion.h1>
      </div>

      {/* Red Warning Pulses */}
      <motion.div
        className="absolute inset-0 border-[10px] border-red-500/0 pointer-events-none"
        animate={{ borderColor: ['rgba(239,68,68,0)', 'rgba(239,68,68,0.2)', 'rgba(239,68,68,0)'] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
      />
    </motion.div>
  );
}
