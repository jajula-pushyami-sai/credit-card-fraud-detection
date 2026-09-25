import React from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, CheckCircle2, BarChart3 } from 'lucide-react';

export function ExplainableAI() {
 return (
 <section id="how-it-works" className="py-24 relative overflow-hidden bg-white border-t border-zinc-200">
 <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
 
 <div className="flex flex-col lg:flex-row gap-16 items-center">
 
 {/* Left Content */}
 <div className="lg:w-1/2">
 <motion.div
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase mb-4"
 >
 Explainable AI (XAI)
 </motion.div>
 
 <motion.h2
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ delay: 0.1 }}
 className="text-3xl md:text-5xl font-semibold tracking-tight text-primary mb-6 leading-tight"
 >
 Don't just detect fraud. <br />
 <span className="text-zinc-400">Understand it.</span>
 </motion.h2>

 <motion.p
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ delay: 0.2 }}
 className="text-lg text-zinc-500 mb-10 leading-relaxed"
 >
 Black-box models are a liability in regulated industries. FraudShield AI integrates SHAP to provide human-readable explanations for every single decision, satisfying compliance requirements instantly.
 </motion.p>

 <div className="space-y-6">
 {[
 { title:"SHAP Values", desc:"Understand exactly how much each feature contributed to the final risk score globally and locally." },
 { title:"Risk Explanations", desc:"Generate intuitive approximations for complex neural network decisions." },
 { title:"Interpretability", desc:"SHAP provides local feature attributions that help analysts interpret model predictions." }
 ].map((item, idx) => (
 <motion.div 
 key={idx}
 initial={{ opacity: 0, y: 10 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-50px" }}
 transition={{ delay: 0.3 + (idx * 0.1) }}
 className="flex gap-4 group"
 >
 <div className="mt-0.5">
 <CheckCircle2 className="w-5 h-5 text-zinc-900" />
 </div>
 <div>
 <h3 className="text-primary font-semibold text-sm mb-1">{item.title}</h3>
 <p className="text-sm text-zinc-500">{item.desc}</p>
 </div>
 </motion.div>
 ))}
 </div>
 </div>

 {/* Right Content - Visuals */}
 <div className="lg:w-1/2 w-full">
 <motion.div 
 initial={{ opacity: 0, scale: 0.98 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ duration: 0.4 }}
 className="relative rounded-2xl bg-zinc-50 border border-zinc-200 p-8 shadow-sm"
 >
 {/* Feature Importance Mockup */}
 <div className="mb-8 flex items-center justify-between border-b border-zinc-200 pb-4">
 <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
 <BarChart3 className="w-4 h-4 text-zinc-500" />
 Local Feature Importance
 </h3>
 <span className="text-[10px] font-bold bg-white px-2 py-1 rounded border border-zinc-200 text-zinc-500 uppercase tracking-widest">
 TXN-9124
 </span>
 </div>

 <div className="space-y-5">
 {[
 { label:"IP Location Distance", value: 85, color:"bg-zinc-900", impact:"High positive contribution" },
 { label:"Transaction Amount", value: 65, color:"bg-zinc-700", impact:"Moderate positive contribution" },
 { label:"Time of Day", value: 40, color:"bg-zinc-500", impact:"+0.12" },
 { label:"Device Fingerprint", value: 20, color:"bg-zinc-300", impact:"-0.08" },
 { label:"Account Age", value: 15, color:"bg-zinc-200", impact:"-0.05" },
 ].map((feature, i) => (
 <div key={i} className="flex items-center gap-4">
 <div className="w-32 text-xs font-medium text-zinc-500 truncate text-right">
 {feature.label}
 </div>
 <div className="flex-1 h-2 bg-zinc-200/50 rounded-full relative">
 {/* Midpoint line */}
 <div className="absolute top-[-4px] bottom-[-4px] left-1/2 w-px bg-zinc-300 z-10" />
 
 {/* Bar */}
 <motion.div 
 initial={{ scaleX: 0 }}
 whileInView={{ scaleX: feature.value / 100 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8, delay: 0.3 + (i * 0.1), ease:"easeOut" }}
 className={`h-full rounded-full w-1/2 ${feature.color} ${feature.impact.startsWith('+') ? 'ml-[50%] origin-left' : 'ml-[50%] -scale-x-100 origin-left'}`}
 />
 </div>
 <div className={`w-12 text-xs font-semibold ${feature.impact.startsWith('+') ? 'text-primary' : 'text-zinc-400'}`}>
 {feature.impact}
 </div>
 </div>
 ))}
 </div>

 <div className="mt-8 pt-6 border-t border-zinc-200 flex gap-3">
 <Fingerprint className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
 <p className="text-xs text-zinc-600 leading-relaxed">
 <span className="font-semibold text-primary">Illustrative SHAP visualization showing how feature attributions can be presented to analysts.</span>
 </p>
 </div>
 </motion.div>
 </div>

 </div>
 </div>
 </section>
 );
}
