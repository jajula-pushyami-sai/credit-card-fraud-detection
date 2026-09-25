import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Database, GitBranch } from 'lucide-react';

const researchItems = [
 { icon: <Database className="w-6 h-6 text-primary" />, title:"Kaggle Dataset", desc:"Trained on European credit card transactions with PCA transformation." },
 { icon: <FileText className="w-6 h-6 text-accent" />, title:"Scientific Report", desc:"Detailed breakdown of the Hybrid Ensemble performance metrics." },
 { icon: <GitBranch className="w-6 h-6 text-success" />, title:"Architecture Diagram", desc:"Complete view of the Flask + React + XGBoost pipeline." }
];

export function ResearchCards() {
 return (
 <section id="research" className="py-24 px-8 md:px-12 max-w-[1600px] mx-auto w-full relative z-20">
 <div className="mb-16">
 <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">Open Research</h2>
 <p className="text-lg text-muted-foreground">Transparency is our core principle.</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {researchItems.map((item, i) => (
 <motion.div
 key={i}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: i * 0.1 }}
 className="group p-8 rounded-[24px] bg-white/40 border border-border/40 hover:bg-white/70 transition-colors shadow-sm hover:shadow-md cursor-pointer backdrop-blur-sm"
 >
 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
 {item.icon}
 </div>
 <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
 <p className="text-sm text-muted-foreground">{item.desc}</p>
 </motion.div>
 ))}
 </div>
 </section>
 );
}
