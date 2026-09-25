import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle2, Circle, Loader2, Cpu } from 'lucide-react';

const pipelineStages = [
  "Data Ingestion",
  "Feature Extraction",
  "SMOTE Balancing",
  "Extra Trees Classifier",
  "MLP Neural Net",
  "Stacking Layer",
  "XGBoost Meta-Learner",
  "Isotonic Calibration",
  "SHAP Explainer",
  "Risk Decision"
];

export function MLPipeline() {
  const [currentStage, setCurrentStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= pipelineStages.length - 1) {
          setIsComplete(true);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isComplete]);

  // To restart animation on click (optional)
  const handleRestart = () => {
    setCurrentStage(0);
    setIsComplete(false);
  };

  const progress = ((currentStage + (isComplete ? 1 : 0)) / pipelineStages.length) * 100;

  return (
    <section className="py-24 px-8 md:px-12 max-w-[1200px] mx-auto w-full relative z-20">
      <div className="text-center mb-12 flex flex-col items-center">
        <motion.div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4 cursor-pointer"
          onClick={handleRestart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Cpu className="w-4 h-4" /> Neural Ensemble Active
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight">AI Pipeline Execution</h2>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Brain Background Animation */}
        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.03, 0.06, 0.03] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Brain size={600} />
          </motion.div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden relative">
            <motion.div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>

          {/* Stages List */}
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {pipelineStages.map((stage, i) => {
                const status = isComplete ? 'completed' : (i < currentStage ? 'completed' : i === currentStage ? 'current' : 'pending');
                
                // Only show a sliding window of stages for a cleaner UI
                if (Math.abs(i - currentStage) > 3 && !isComplete) return null;

                return (
                  <motion.div 
                    key={i}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border ${
                      status === 'current' ? 'bg-primary/5 border-primary/20 shadow-sm' : 
                      status === 'completed' ? 'bg-slate-50 border-transparent opacity-60' : 'bg-transparent border-transparent opacity-40'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {status === 'completed' && <CheckCircle2 className="w-6 h-6 text-success" />}
                      {status === 'current' && <Loader2 className="w-6 h-6 text-primary animate-spin" />}
                      {status === 'pending' && <Circle className="w-6 h-6 text-slate-300" />}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-semibold ${status === 'current' ? 'text-primary' : 'text-slate-700'}`}>
                        {stage}
                      </h3>
                    </div>

                    <div className="text-xs font-mono text-slate-400">
                      {status === 'current' ? 'PROCESSING' : status === 'completed' ? 'DONE' : 'WAITING'}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
