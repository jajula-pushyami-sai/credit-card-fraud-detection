import React from 'react';
import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    author: "Representative analyst scenario",
    role: "Fraud Analyst Workflow",
    quote: "Example workflow showing how a fraud analyst could use local model explanations to cross-reference transactions and block anomalies.",
    avatar: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    author: "Illustrative security scenario",
    role: "Enterprise Security Integration",
    quote: "Example workflow showing authentication, RBAC, and audit capabilities within a simulated payment gateway environment.",
    avatar: "https://i.pravatar.cc/150?u=marcus"
  },
  {
    author: "Demonstration workflow",
    role: "System Administrator",
    quote: "Example of how the platform could support transaction review, role management, and scalable security patterns.",
    avatar: "https://i.pravatar.cc/150?u=emily"
  }
];

export function Testimonials() {
 return (
 <section id="testimonials" className="py-24 relative overflow-hidden bg-background">
 <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
 <div className="text-center max-w-3xl mx-auto mb-16">
 <motion.h2 
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6"
 >
 Representative Demo Scenarios
 </motion.h2>
 <motion.p 
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ delay: 0.1 }}
 className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
 >
 Explore illustrative workflows demonstrating how FraudShield AI could be utilized in an enterprise environment.
 </motion.p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {TESTIMONIALS.map((t, i) => (
 <motion.div 
 key={i}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-50px" }}
 transition={{ delay: i * 0.1 }}
 className="bg-card border border-border p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
 >
 <p className="text-muted-foreground leading-relaxed mb-8">"{t.quote}"</p>
 <div className="flex items-center gap-4">
 <img loading="lazy" src={t.avatar} alt={t.author} className="w-12 h-12 rounded-full border border-border" />
 <div>
 <div className="font-bold text-foreground">{t.author}</div>
 <div className="text-sm text-primary font-medium">{t.role}</div>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 );
}
