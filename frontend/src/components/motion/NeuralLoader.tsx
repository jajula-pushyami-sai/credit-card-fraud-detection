import React from 'react';
import { motion } from 'framer-motion';

export const NeuralLoader: React.FC = () => {
  return (
    <div className="w-full h-[400px] flex flex-col items-center justify-center gap-6">
      <div className="relative w-24 h-24">
        {/* Core Node */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-primary shadow-[0_0_20px_rgba(15,118,110,0.6)]"
        />
        
        {/* Orbiting Particles */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
            style={{ originX: 0.5, originY: 0.5 }}
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              className="absolute top-0 left-1/2 -ml-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
              style={{ y: - (20 + i * 10) }}
            />
          </motion.div>
        ))}

        {/* Pulse Rings */}
        <motion.div
          animate={{ scale: [1, 3], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 m-auto w-6 h-6 rounded-full border border-primary/50"
        />
      </div>
      
      <div className="flex flex-col items-center">
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-sm font-medium tracking-widest uppercase text-primary/80 mb-1"
        >
          Analyzing
        </motion.p>
        <p className="text-xs text-slate-400">Assembling FraudShield AI Components</p>
      </div>
    </div>
  );
};
