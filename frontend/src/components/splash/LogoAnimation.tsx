import React from 'react';
import { motion } from 'framer-motion';

export function LogoAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
    >
      <div className="relative flex items-center justify-center">
        {/* Soft rotating ring */}
        <motion.div
          className="absolute w-32 h-32 rounded-full border border-t-[#0F766E] border-r-[#14B8A6] border-b-transparent border-l-transparent opacity-60"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* The Logo Container */}
        <div className="w-24 h-24 bg-white rounded-full shadow-[0_8px_32px_rgba(15,23,42,0.08)] flex items-center justify-center relative overflow-hidden z-20">
          <img src="/logo.svg" alt="FraudShield AI Logo" className="w-12 h-12 text-[#0F766E]" />
          
          {/* Light Sweep */}
          <motion.div
            className="absolute top-0 -inset-full h-full w-1/2 z-30 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
            animate={{ left: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
