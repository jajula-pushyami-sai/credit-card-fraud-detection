import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Network, Lock, Cpu, Activity, AlertTriangle } from 'lucide-react';

const FEATURES = [
 {
 title:"Predictive Analytics",
 description:"Provide our AI with your historical transaction data and it will autonomously identify new fraud patterns before they hit your network.",
 icon: Activity
 },
 {
 title:"Real-Time Decisioning",
 description:"The FraudShield AI engine evaluates transactions quickly, coordinating multiple neural networks for a rapid response.",
 icon: Cpu
 },
 {
 title:"Cross-Border Security",
 description:"Securely analyze IP geolocation, device fingerprinting, and merchant history without disrupting legitimate user flows.",
 icon: Network
 }
];

export function PlatformOverview() {
 return (
 <section id="platform" className="py-24 relative overflow-hidden bg-background">
 <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
 
 <div>
 <motion.h2 
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6"
 >
 How FraudShield AI secures your ecosystem.
 </motion.h2>
 <motion.p 
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ delay: 0.1 }}
 className="text-lg text-muted-foreground leading-relaxed mb-12"
 >
 Our platform orchestrates specialized AI models to analyze, score, and block fraudulent transactions instantly. It's not just a rule engine—it's an autonomous security analyst.
 </motion.p>

 <div className="space-y-10">
 {FEATURES.map((feature, i) => (
 <motion.div 
 key={i}
 initial={{ opacity: 0, x: -15 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin:"-50px" }}
 transition={{ delay: i * 0.1 }}
 className="flex gap-5"
 >
 <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
 <feature.icon className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
 <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
 </div>
 </motion.div>
 ))}
 </div>
 </div>

 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true, margin:"-100px" }}
 className="relative h-[600px] rounded-[32px] bg-card border border-border shadow-xl overflow-hidden flex items-center justify-center"
 >
 {/* Minimalist Graphic representation of fraud detection */}
 <div className="absolute inset-0 bg-grid-pattern opacity-50" />
 
 <div className="relative z-10 flex flex-col items-center gap-8 w-full px-12">
 <div className="w-full bg-background border border-border rounded-2xl p-6 shadow-sm flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
 <Lock className="w-5 h-5" />
 </div>
 <div>
 <div className="font-bold text-foreground">Transaction ID: #889412</div>
 <div className="text-sm text-muted-foreground">$12,450.00 • International Transfer</div>
 </div>
 </div>
 <div className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-bold uppercase">
 Verified Safe
 </div>
 </div>

 <div className="w-0.5 h-8 bg-border" />

 <div className="w-full bg-background border border-destructive/20 rounded-2xl p-6 shadow-sm flex items-center justify-between relative overflow-hidden">
 <div className="absolute inset-0 bg-destructive/5 pointer-events-none" />
 <div className="flex items-center gap-4 relative z-10">
 <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
 <AlertTriangle className="w-5 h-5" />
 </div>
 <div>
 <div className="font-bold text-foreground">Transaction ID: #889413</div>
 <div className="text-sm text-muted-foreground">$4,500.00 • High-Risk Electronics</div>
 </div>
 </div>
 <div className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-bold uppercase relative z-10">
 Blocked
 </div>
 </div>

 </div>
 </motion.div>

 </div>
 </div>
 </section>
 );
}
