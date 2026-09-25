import React from 'react';
import { motion } from 'framer-motion';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#F8FAF9]">
      {/* Dot grid */}
      <div 
        className="absolute inset-0 opacity-[0.25]" 
        style={{ 
          backgroundImage: 'radial-gradient(#0F766E 1px, transparent 1px)', 
          backgroundSize: '32px 32px' 
        }} 
      />
      
      {/* Floating Blobs */}
      <motion.div
        animate={{
          x: ['0%', '100%', '0%'],
          y: ['0%', '50%', '0%'],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{ willChange: 'transform' }}
        className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-30 bg-[#0F766E]"
      />
      <motion.div
        animate={{
          x: ['100%', '0%', '100%'],
          y: ['0%', '100%', '0%'],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{ willChange: 'transform' }}
        className="absolute top-[20%] right-[0%] w-[45vw] h-[45vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 bg-[#14B8A6]"
      />
      <motion.div
        animate={{
          x: ['50%', '0%', '50%'],
          y: ['100%', '0%', '100%'],
          rotate: [0, 180, 0]
        }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        style={{ willChange: 'transform' }}
        className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[150px] opacity-20 bg-[#5EEAD4]"
      />
    </div>
  );
}
