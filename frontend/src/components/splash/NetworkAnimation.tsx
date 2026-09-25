import React from 'react';
import { motion } from 'framer-motion';

export function NetworkAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center w-full h-full"
    >
      {/* Background Neural Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#124E66]"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 10px #124E66, 0 0 20px #124E66'
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Cinematic Text */}
      <div className="z-10 flex flex-col items-center justify-center space-y-6 text-center">
        <motion.h2 
          className="text-4xl md:text-5xl font-light tracking-wide text-[#D3D9D4]"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          Every second...
        </motion.h2>

        <motion.h1 
          className="text-5xl md:text-6xl font-semibold tracking-tight text-white"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
        >
          Millions of financial transactions occur.
        </motion.h1>
      </div>
    </motion.div>
  );
}
