import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';

export function ShieldAnimation() {
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center w-full h-full"
    >
      <AnimatePresence mode="wait">
        {phase === 1 && (
          <motion.div 
            key="phase1"
            className="z-10 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="relative flex items-center justify-center w-64 h-64">
              <motion.div 
                className="absolute inset-0 border-4 border-emerald-500/30 rounded-full"
                animate={{ scale: [1, 1.5, 2], opacity: [1, 0, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <Lock className="w-20 h-20 text-emerald-400" />
            </div>

            <div className="flex gap-6 mt-12 text-3xl font-light text-[#D3D9D4]">
              {['Detect', 'Explain', 'Prevent'].map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.5 }}
                >
                  {word}{i < 2 ? <span className="text-[#124E66] ml-6">•</span> : ''}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {phase >= 2 && (
          <motion.div 
            key="phase2"
            className="z-10 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {/* The FraudShield Logo */}
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="bg-gradient-to-b from-[#124E66] to-[#212A31] p-6 rounded-3xl border border-[#124E66]/50 shadow-2xl relative z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5" />
                <Shield className="w-32 h-32 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
              </div>
            </div>

            <AnimatePresence>
              {phase === 3 && (
                <motion.div 
                  className="mt-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  <div className="flex justify-center items-baseline gap-3">
                    <h1 className="text-6xl font-black text-white tracking-tight">
                      FraudShield
                    </h1>
                    <h1 className="text-6xl font-black text-emerald-400 tracking-tight">
                      AI
                    </h1>
                  </div>
                  <motion.p 
                    className="mt-6 text-xl text-[#748092] tracking-widest uppercase font-semibold"
                    initial={{ opacity: 0, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ delay: 0.5, duration: 1 }}
                  >
                    AI Powered Fraud Intelligence Platform
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-emerald-500"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 10px rgba(52,211,153,0.8)'
            }}
            animate={{ 
              y: [0, -100],
              x: [0, Math.random() * 50 - 25],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
