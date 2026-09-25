import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Activity, Network, Fingerprint } from 'lucide-react';

export function AIDecisionEngine() {
 return (
 <section id="ai-engine" className="py-24 relative bg-zinc-50 overflow-hidden mx-4 md:mx-12 my-12 rounded-[2.5rem] border border-zinc-200 shadow-sm">
 <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
 
 {/* Text Content */}
 <div className="flex flex-col">
 <motion.div
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase mb-4"
 >
 AI Decision Engine
 </motion.div>
 
 <motion.h2
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ delay: 0.1 }}
 className="text-3xl md:text-5xl font-semibold tracking-tight text-primary mb-6 leading-tight"
 >
 Intelligence that <br />
 <span className="text-zinc-500">adapts to threats.</span>
 </motion.h2>

 <motion.p
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ delay: 0.2 }}
 className="text-lg text-zinc-500 mb-10 leading-relaxed max-w-xl"
 >
 Our proprietary meta-learner dynamically analyzes transactions across multiple dimensions, orchestrating specialized models to produce a single, unified Risk Score with absolute certainty.
 </motion.p>

 <div className="space-y-4">
 {[
 { title:"Machine Learning (ML)", desc:"Extra Trees algorithms process structured tabular data with lightning speed.", icon: <Activity className="w-5 h-5 text-zinc-900" /> },
 { title:"Deep Learning (DL)", desc:"Multilayer Perceptrons identify complex, non-linear fraud patterns over time.", icon: <Network className="w-5 h-5 text-zinc-900" /> },
 { title:"Explainability (SHAP)", desc:"Every model output is reverse-engineered to provide human-readable reasoning.", icon: <Fingerprint className="w-5 h-5 text-zinc-900" /> }
 ].map((item, idx) => (
 <motion.div 
 key={idx}
 initial={{ opacity: 0, x: -15 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin:"-50px" }}
 transition={{ delay: 0.3 + (idx * 0.05) }}
 className="flex items-start gap-4 p-4 rounded-xl border border-transparent hover:border-zinc-200 :border-zinc-800 hover:bg-white :bg-zinc-900 transition-colors duration-200"
 >
 <div className="mt-1 p-2 rounded-lg bg-zinc-100 border border-zinc-200 shadow-sm">
 {item.icon}
 </div>
 <div>
 <h3 className="text-primary font-semibold mb-1 text-sm">{item.title}</h3>
 <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
 </div>
 </motion.div>
 ))}
 </div>
 </div>

 {/* Animated Workflow Visualization (Minimalist) */}
 <div className="relative h-[550px] w-full rounded-2xl border border-zinc-200 bg-white overflow-hidden flex items-center justify-center p-8 shadow-sm">
 <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] (#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
 
 <div className="relative w-full h-full flex flex-col justify-between max-w-sm mx-auto">
 
 {/* Input */}
 <motion.div 
 className="w-full bg-white border border-zinc-200 p-4 rounded-xl flex items-center justify-between shadow-sm relative z-10"
 animate={{ y: [0, -4, 0] }}
 transition={{ duration: 4, repeat: Infinity, ease:"easeInOut" }}
 >
 <div className="flex flex-col">
 <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Input Data</span>
 <span className="text-sm font-semibold text-primary">Live Transaction Stream</span>
 </div>
 <Activity className="text-zinc-500 w-5 h-5" />
 </motion.div>

 {/* Base Models */}
 <div className="flex justify-between w-full relative z-10 py-12">
 <motion.div 
 className="bg-white border border-zinc-200 p-3 rounded-xl flex flex-col items-center gap-2 shadow-sm w-32"
 animate={{ y: [0, 4, 0] }}
 transition={{ duration: 3, repeat: Infinity, ease:"easeInOut", delay: 0.5 }}
 >
 <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
 <Activity className="w-4 h-4 text-zinc-600" />
 </div>
 <span className="text-xs font-semibold text-primary">Extra Trees</span>
 </motion.div>

 <motion.div 
 className="bg-white border border-zinc-200 p-3 rounded-xl flex flex-col items-center gap-2 shadow-sm w-32"
 animate={{ y: [0, 4, 0] }}
 transition={{ duration: 3.5, repeat: Infinity, ease:"easeInOut", delay: 1 }}
 >
 <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
 <Network className="w-4 h-4 text-zinc-600" />
 </div>
 <span className="text-xs font-semibold text-primary">MLP</span>
 </motion.div>
 </div>

 {/* Meta Learner */}
 <motion.div 
 className="w-full bg-zinc-900 p-4 rounded-xl flex items-center justify-between shadow-md relative z-10 border border-zinc-800"
 animate={{ scale: [1, 1.01, 1] }}
 transition={{ duration: 2, repeat: Infinity, ease:"easeInOut" }}
 >
 <div className="flex flex-col">
 <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">Meta-Learner</span>
 <span className="text-sm font-semibold text-white">XGBoost Engine</span>
 </div>
 <BrainCircuit className="text-white w-5 h-5" />
 </motion.div>

 {/* Output */}
 <div className="flex justify-between items-end w-full relative z-10 pt-12">
 <div className="bg-white border border-zinc-200 p-4 rounded-xl flex flex-col gap-1 w-[45%] shadow-sm">
 <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Risk Score</span>
 <span className="text-xl font-bold text-primary">0.02</span>
 <div className="w-full bg-zinc-100 h-1 rounded-full mt-1 overflow-hidden">
 <div className="bg-zinc-900 h-full w-[10%] rounded-full"></div>
 </div>
 </div>
 
 <div className="bg-white border border-zinc-200 p-4 rounded-xl flex flex-col gap-1 w-[45%] shadow-sm">
 <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Explanation</span>
 <div className="flex items-center gap-2 mt-1">
 <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
 <div className="bg-zinc-900 h-full w-[80%] rounded-full"></div>
 </div>
 <span className="text-[10px] text-primary font-semibold">SHAP</span>
 </div>
 </div>
 </div>

 </div>
 </div>

 </div>
 </div>
 </section>
 );
}
