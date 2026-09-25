import React from 'react';
import { motion } from 'framer-motion';
import { SHAPScene } from '@/components/3d/SHAPScene';
import { LIMEScene } from '@/components/3d/LIMEScene';

export function ExplainabilityStory() {
 return (
 <section id="explainability" className="py-32 px-8 md:px-12 max-w-[1600px] mx-auto w-full relative z-20">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
 
 {/* Story Text */}
 <div className="max-w-xl">
 <motion.div
 initial={{ opacity: 0, x: -30 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ duration: 0.6 }}
 >
 <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-6">
 Never Trust a <br /> Black Box Again.
 </h2>
 <p className="text-lg text-muted-foreground leading-relaxed mb-6">
 FraudShield AI integrates <strong className="text-primary font-semibold">SHAP</strong> at the core of its architecture. Every single prediction is accompanied by a mathematical breakdown of why the decision was made.
 </p>
 <p className="text-lg text-muted-foreground leading-relaxed mb-8">
 Compliance teams no longer have to guess. They can see exactly how transaction amounts, timing, and anonymized features pushed the model towards a fraud classification.
 </p>

 <div className="flex gap-4 mb-12">
 <div className="flex-1 p-6 rounded-2xl bg-success/10 border border-success/20">
 <h4 className="text-success font-semibold text-xl mb-1">Fully</h4>
 <p className="text-xs text-success/80 uppercase tracking-widest font-medium">Explainable Decisions</p>
 </div>
 <div className="flex-1 p-6 rounded-2xl bg-accent/10 border border-accent/20">
 <h4 className="text-accent font-semibold text-xl mb-1">0</h4>
 <p className="text-xs text-accent/80 uppercase tracking-widest font-medium">Black Box Approvals</p>
 </div>
 </div>
 </motion.div>
 </div>

 {/* 3D Visualization Grid */}
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ duration: 0.8, delay: 0.2 }}
 className="w-full flex flex-col gap-6"
 >
 <div className="w-full bg-white/40 border border-border/60 rounded-[32px] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.03)] backdrop-blur-md">
 <h4 className="text-sm font-semibold text-primary mb-4">SHAP Feature Importance (Global)</h4>
 <SHAPScene />
 </div>

 <div className="w-full bg-white/40 border border-border/60 rounded-[32px] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.03)] backdrop-blur-md">
 <h4 className="text-sm font-semibold text-primary mb-4">Local Neighborhood Visualization</h4>
 <LIMEScene />
 </div>
 </motion.div>
 </div>
 </section>
 );
}
