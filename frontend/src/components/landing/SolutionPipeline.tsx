import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { ModelGalaxy } from '@/components/3d/ModelGalaxy';
import { FadeIn } from '@/components/motion/FadeIn';

const stages = [
 { name:"Transaction Input", desc:"Raw features injected into the pipeline", color:"bg-muted" },
 { name:"Data Preprocessing", desc:"Scaling & SMOTE balancing applied", color:"bg-muted" },
 { name:"Base Learners", desc:"Extra Trees & Multilayer Perceptron", color:"bg-primary text-primary-foreground" },
 { name:"Meta-Learner", desc:"XGBoost interprets base probabilities", color:"bg-accent text-accent-foreground" },
 { name:"Explainability Layer", desc:"SHAP extracts feature importance", color:"bg-success text-success-foreground" },
 { name:"Risk Decision", desc:"Final confident classification", color:"bg-primary text-primary-foreground" }
];

export function SolutionPipeline() {
 return (
 <section id="solution" className="py-24 px-8 md:px-12 max-w-[1600px] mx-auto w-full relative z-20">
 <div className="text-center mb-16">
 <FadeIn direction="up">
 <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-6">
 Meet FraudShield AI
 </h2>
 </FadeIn>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
 {/* Left: 3D Orbit */}
 <FadeIn direction="none" duration={1.2} className="w-full h-full min-h-[500px]">
 <ModelGalaxy />
 </FadeIn>

 {/* Right: Pipeline */}
 <div className="flex flex-col items-center max-w-xl mx-auto w-full">
 {stages.map((stage, i) => (
 <React.Fragment key={i}>
 <motion.div
 initial={{ opacity: 0, scale: 0.9, y: 20 }}
 whileInView={{ opacity: 1, scale: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ duration: 0.5, delay: i * 0.15 }}
 whileHover={{ scale: 1.02 }}
 className={`w-full p-6 rounded-[20px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-border/40 text-center backdrop-blur-sm relative overflow-hidden group ${stage.color}`}
 >
 {/* Flowing background highlight */}
 <motion.div 
 className="absolute inset-0 bg-white/20 -translate-x-full"
 animate={{ translateX: ['-100%', '100%'] }}
 transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: i * 0.2, ease:"easeInOut" }}
 />
 <h3 className="text-lg font-semibold mb-1 relative z-10">{stage.name}</h3>
 <p className="text-sm opacity-80 relative z-10">{stage.desc}</p>
 </motion.div>

 {i < stages.length - 1 && (
 <div className="flex items-center justify-center my-2 relative h-10 w-px">
 <motion.div
 initial={{ height: 0 }}
 whileInView={{ height: '100%' }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ duration: 0.4, delay: (i * 0.15) + 0.2 }}
 className="absolute top-0 w-px bg-primary/20 h-full"
 />
 {/* Data traveling pulse */}
 <motion.div
 animate={{ y: [0, 40], opacity: [0, 1, 0] }}
 transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
 className="absolute top-0 w-1 h-3 bg-accent rounded-full shadow-[0_0_10px_rgba(217,164,65,0.8)]"
 />
 </div>
 )}
 </React.Fragment>
 ))}
 </div>
 </div>
 </section>
 );
}
