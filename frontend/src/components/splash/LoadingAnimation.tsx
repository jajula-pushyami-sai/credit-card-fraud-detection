import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Shield } from 'lucide-react';

const loadingSteps = [
  "Initializing AI Engine...",
  "Loading Hybrid Ensemble Model...",
  "Loading Explainability Module...",
  "Connecting Risk Engine...",
  "Preparing Dashboard...",
  "System Ready"
];

export function LoadingAnimation() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= loadingSteps.length) return;

    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, currentStep === loadingSteps.length - 2 ? 800 : 500);

    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="absolute inset-0 flex flex-col items-center justify-center w-full h-full"
    >
      <div className="flex flex-col items-center">
        {/* Minimized Logo */}
        <motion.div 
          className="bg-gradient-to-b from-[#124E66] to-[#212A31] p-4 rounded-2xl mb-12 shadow-[0_0_30px_rgba(18,78,102,0.5)] border border-[#124E66]/50"
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Shield className="w-16 h-16 text-emerald-400" />
        </motion.div>

        {/* Loading Terminal */}
        <div className="w-96 bg-[#2E3944]/30 backdrop-blur-md rounded-xl border border-[#748092]/20 p-6 font-mono text-sm shadow-xl min-h-[220px]">
          {loadingSteps.map((step, index) => {
            const isVisible = index <= currentStep;
            const isCompleted = index < currentStep;
            const isLast = index === loadingSteps.length - 1;

            if (!isVisible) return null;

            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-3 mb-3 ${isLast ? 'mt-6 text-emerald-400 font-bold text-lg' : 'text-[#D3D9D4]'}`}
              >
                {isCompleted || (isLast && index === currentStep) ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    <CheckCircle2 className={`w-5 h-5 ${isLast ? 'text-emerald-400' : 'text-emerald-500'}`} />
                  </motion.div>
                ) : (
                  <div className="w-5 h-5 border-2 border-[#124E66] border-t-emerald-400 rounded-full animate-spin" />
                )}
                <span>{step}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
