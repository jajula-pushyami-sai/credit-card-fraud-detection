import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BrainCircuit, Activity, FileCode, Users, Code2 } from 'lucide-react';

const features = [
 {
 title:"Autonomous Coding",
 description:"Subagents write, review, and test code concurrently.",
 icon: <Code2 className="w-5 h-5 text-primary" />
 },
 {
 title:"Context-Aware Planning",
 description:"Agents understand your entire codebase before typing a single character.",
 icon: <BrainCircuit className="w-5 h-5 text-primary" />
 },
 {
 title:"Continuous Execution",
 description:"Monitor agent tasks, CPU usage, and terminal output in real-time.",
 icon: <Activity className="w-5 h-5 text-primary" />
 },
 {
 title:"Multi-Agent Collaboration",
 description:"Designate specialists (e.g., UI, Backend, DevOps) to work together.",
 icon: <Users className="w-5 h-5 text-primary" />
 },
 {
 title:"Automated Pull Requests",
 description:"Agents create explainable diffs and self-documenting PRs.",
 icon: <FileCode className="w-5 h-5 text-primary" />
 },
 {
 title:"FraudShield AI",
 description:"Extend core capabilities with custom Python and TypeScript plugins.",
 icon: <Zap className="w-5 h-5 text-primary" />
 }
];

export function EnterpriseFeatures() {
 return (
 <section className="py-24 bg-background relative z-10 border-t border-border">
 <div className="max-w-[1200px] mx-auto px-6 md:px-12">
 <div className="mb-16 text-center">
 <motion.h2 
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4"
 >
 Platform Capabilities
 </motion.h2>
 <motion.p 
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ delay: 0.1 }}
 className="text-lg text-muted-foreground max-w-2xl mx-auto"
 >
 Everything you need to accelerate your software delivery.
 </motion.p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {features.map((feature, index) => (
 <motion.div
 key={index}
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-50px" }}
 transition={{ delay: index * 0.05 }}
 className="bg-card p-8 rounded-[18px] border border-border hover:-translate-y-1 hover:shadow-md transition-all duration-300"
 >
 <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
 {feature.icon}
 </div>
 <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
 <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 );
}
