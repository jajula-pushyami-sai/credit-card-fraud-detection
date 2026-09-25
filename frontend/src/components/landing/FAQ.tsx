import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
 {
 question:"How do FraudShield AI agents collaborate?",
 answer:"Our system coordinates multiple specialized subagents (e.g., Frontend, Backend, QA) using a unified reasoning engine. The planner breaks down complex tasks into subtasks, and agents execute them concurrently while sharing context."
 },
 {
 question:"What languages and frameworks are supported?",
 answer:"FraudShield AI supports all major languages (Python, TypeScript, Go, Rust) and frameworks (React, Next.js, Express, FastAPI). Agents can read package.json or requirements.txt to automatically understand your stack."
 },
 {
 question:"How does FraudShield AI handle code quality?",
 answer:"Agents don't just write code; they run your test suite, perform static analysis, and fix linting errors before proposing a Pull Request. You can configure strictness levels for automated QA."
 },
 {
 question:"Is my codebase secure?",
 answer:"The project implements enterprise-oriented security controls including JWT-based authentication, RBAC, secure password hashing, and security-focused application practices. It is an academic/portfolio project and is not independently SOC 2 certified."
 },
 {
 question:"Can I extend the SDK with custom tools?",
 answer:"Absolutely. The FraudShield AI allows you to define custom Python or TypeScript functions that agents can invoke. If you have internal CLI tools or APIs, you can easily expose them to your agents."
 }
];

export function FAQ() {
 const [openIndex, setOpenIndex] = useState<number | null>(0);

 return (
 <section className="py-24 relative bg-background border-t border-border" id="faq">
 <div className="max-w-[800px] mx-auto px-6 relative z-10">
 <div className="text-center mb-16">
 <motion.h2 
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4"
 >
 Frequently Asked Questions
 </motion.h2>
 <motion.p 
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ delay: 0.1 }}
 className="text-lg text-muted-foreground"
 >
 Everything you need to know about building with FraudShield AI.
 </motion.p>
 </div>

 <div className="space-y-4">
 {faqs.map((faq, index) => (
 <motion.div 
 key={index}
 initial={{ opacity: 0, y: 10 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1 }}
 className={`border border-border bg-card rounded-2xl transition-all duration-300 overflow-hidden ${openIndex === index ? 'shadow-md' : 'shadow-sm hover:shadow-md'}`}
 >
 <button
 className="w-full px-8 py-6 text-left flex justify-between items-center focus:outline-none"
 onClick={() => setOpenIndex(openIndex === index ? null : index)}
 >
 <span className="font-semibold text-base text-foreground">
 {faq.question}
 </span>
 <ChevronDown 
 className={`w-5 h-5 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} 
 />
 </button>
 
 <AnimatePresence>
 {openIndex === index && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height:"auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.3, ease:"easeInOut" }}
 >
 <div className="px-8 pb-8 pt-2 text-base text-muted-foreground leading-relaxed">
 {faq.answer}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 );
}
