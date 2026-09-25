import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Total duration 3 seconds before starting exit animation
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // 800ms exit animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const title = "FraudShield AI".split('');

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#F8FAF9]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
          {/* Animated Background Network SVG */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.circle 
                cx="300" cy="300" r="150" 
                stroke="#14B8A6" strokeWidth="1" strokeDasharray="4 4"
                initial={{ rotate: 0, opacity: 0 }}
                animate={{ rotate: 360, opacity: 1 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.circle 
                cx="300" cy="300" r="220" 
                stroke="#0F766E" strokeWidth="1" strokeDasharray="6 6"
                initial={{ rotate: 360, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Shield Logo Animation */}
            <motion.div 
              className="w-24 h-24 mb-6 relative flex items-center justify-center"
              initial={{ scale: 0, rotate: -45, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-[#10B981] rounded-2xl rotate-45 opacity-20 animate-pulse" />
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <motion.path 
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                />
                <motion.path 
                  d="M9 12l2 2 4-4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                />
              </svg>
            </motion.div>

            {/* Letter-by-letter Title Reveal */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0F172A] mb-3 flex overflow-hidden">
              {title.map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.05 }}
                  className={char === " " ? "w-3" : ""}
                >
                  {char}
                </motion.span>
              ))}
            </h1>

            {/* Tagline Reveal */}
            <motion.p
              className="text-[#64748B] font-medium tracking-wide uppercase text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              Enterprise Security Intelligence
            </motion.p>

            {/* Loading Dots */}
            <motion.div 
              className="flex gap-2 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#14B8A6]"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
