import React from 'react';
import { motion } from 'framer-motion';

const techOrbit = [
"React","Framer Motion","TailwindCSS","Lucide",
"Flask","TensorFlow","XGBoost","Scikit-Learn",
"SHAP","SQLite","Imbalanced-Learn"
];

export function TechStackOrbit() {
 return (
 <section id="tech" className="py-32 px-8 md:px-12 w-full relative z-20 overflow-hidden bg-white/20 border-y border-border/40 backdrop-blur-md">
 <div className="text-center mb-16">
 <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-primary">Powered By Best-In-Class Tech</h2>
 </div>

 <div className="relative w-full max-w-4xl mx-auto h-[600px] flex items-center justify-center">
 {/* Core Center */}
 <div className="absolute w-32 h-32 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-xl shadow-[0_0_50px_rgba(22,42,43,0.3)] z-20">
 Core
 </div>

 {/* Orbit Rings */}
 {[1, 2, 3].map((ring) => (
 <div key={ring} className={`absolute rounded-full border border-primary/10`} style={{ width: `${ring * 200 + 100}px`, height: `${ring * 200 + 100}px` }} />
 ))}

 {/* Orbiting Elements */}
 {techOrbit.map((tech, i) => {
 const radius = i < 4 ? 150 : i < 8 ? 250 : 350;
 const angle = (i % 4) * (Math.PI / 2) + (i > 3 ? Math.PI / 4 : 0);
 const x = Math.cos(angle) * radius;
 const y = Math.sin(angle) * radius;

 return (
 <motion.div
 key={i}
 initial={{ opacity: 0, scale: 0 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 transition={{ delay: i * 0.1 }}
 style={{ x, y }}
 className="absolute px-4 py-2 bg-white rounded-full shadow-sm border border-border text-sm font-medium text-primary cursor-default hover:scale-110 transition-transform z-30"
 >
 {tech}
 </motion.div>
 );
 })}
 </div>
 </section>
 );
}
