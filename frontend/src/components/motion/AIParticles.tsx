import React from 'react';
import { motion } from 'framer-motion';

export const AIParticles: React.FC = () => {
  const particles = Array.from({ length: 6 });

  return (
    <div className="relative w-full h-12 flex items-center justify-center overflow-hidden">
      {/* Central glowing core */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-8 h-8 rounded-full bg-primary/20 blur-md"
      />
      
      {/* Orbiting particles */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(15,118,110,0.8)]"
          initial={{
            x: Math.cos((i * Math.PI * 2) / particles.length) * 10,
            y: Math.sin((i * Math.PI * 2) / particles.length) * 10,
            scale: 0.5,
            opacity: 0,
          }}
          animate={{
            x: [
              Math.cos((i * Math.PI * 2) / particles.length) * 10,
              Math.cos(((i * Math.PI * 2) / particles.length) + Math.PI) * 20,
              Math.cos((i * Math.PI * 2) / particles.length) * 10,
            ],
            y: [
              Math.sin((i * Math.PI * 2) / particles.length) * 10,
              Math.sin(((i * Math.PI * 2) / particles.length) + Math.PI) * 5,
              Math.sin((i * Math.PI * 2) / particles.length) * 10,
            ],
            scale: [0.5, 1, 0.5],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
      <span className="relative z-10 text-xs font-medium text-primary dark:text-indigo-400 mt-8 tracking-widest uppercase">
        Synthesizing
      </span>
    </div>
  );
};
