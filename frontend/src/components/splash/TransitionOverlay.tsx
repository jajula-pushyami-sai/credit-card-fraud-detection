import React from 'react';
import { motion } from 'framer-motion';

export function TransitionOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 mt-48"
    >
      <div className="flex gap-2 text-3xl font-bold tracking-tight">
        <span className="text-[#1E293B]">FraudShield</span>
        <span className="text-[#14B8A6]">AI</span>
      </div>
      
      <motion.p 
        className="mt-3 text-sm tracking-[0.2em] uppercase text-[#64748B] font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        Enterprise Fraud Intelligence
      </motion.p>
    </motion.div>
  );
}
