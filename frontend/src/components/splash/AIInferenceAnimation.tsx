import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, BrainCircuit } from 'lucide-react';

export function AIInferenceAnimation() {
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setPhase(2), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center w-full h-full"
    >
      {/* Background Scanning Wave */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-[#124E66]/20 to-transparent w-full h-[200%]"
        animate={{ y: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <BrainCircuit className="w-96 h-96 text-[#124E66]" />
      </div>

      <AnimatePresence mode="wait">
        {phase === 1 && (
          <motion.div 
            key="phase1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="z-10 flex flex-col items-center"
          >
            <div className="grid grid-cols-2 gap-8 mb-12">
              {[15, 28, 54, 91].map((score, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.3 }}
                  className={`flex items-center justify-center w-24 h-24 rounded-full border-4 ${score > 80 ? 'border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'border-[#124E66] text-[#124E66] shadow-[0_0_20px_rgba(18,78,102,0.5)]'} text-2xl font-bold bg-[#212A31]`}
                >
                  {score}%
                </motion.div>
              ))}
            </div>
            <motion.h2 className="text-3xl md:text-4xl font-light text-[#D3D9D4]">
              Artificial Intelligence begins learning.
            </motion.h2>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div 
            key="phase2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="z-10 flex flex-col items-center w-full max-w-2xl px-8"
          >
            {/* SHAP Chart Mockup */}
            <div className="w-full bg-[#2E3944]/50 border border-[#748092]/30 p-6 rounded-2xl backdrop-blur-xl mb-12 shadow-2xl">
              <h3 className="text-[#D3D9D4] font-semibold flex items-center gap-2 mb-6 border-b border-[#748092]/30 pb-3">
                <Activity className="w-5 h-5 text-[#124E66]"/> SHAP Explainability
              </h3>
              
              <div className="space-y-4">
                {[
                  { name: "Location Mismatch", width: "85%", color: "bg-red-500" },
                  { name: "Velocity Spike", width: "70%", color: "bg-red-400" },
                  { name: "Device Age", width: "45%", color: "bg-red-300" },
                  { name: "Past History", width: "20%", color: "bg-emerald-500" }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-xs text-[#748092] w-32 text-right">{feature.name}</span>
                    <div className="flex-1 h-2 bg-[#212A31] rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${feature.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: feature.width }}
                        transition={{ duration: 1, delay: i * 0.2, type: "spring" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <motion.h2 className="text-4xl md:text-5xl font-bold text-white text-center">
              Every prediction is explainable.
            </motion.h2>
            <div className="flex gap-4 mt-6">
              {['SHAP Explainability', 'Hybrid Ensemble', 'Real-Time Risk Analysis'].map((tag, i) => (
                <motion.span 
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + (i * 0.2) }}
                  className="text-xs font-mono uppercase tracking-widest text-[#124E66] bg-[#124E66]/10 px-3 py-1 rounded-full border border-[#124E66]/30"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
