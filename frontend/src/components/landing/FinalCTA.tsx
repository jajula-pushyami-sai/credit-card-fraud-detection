import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Twitter, Linkedin, TerminalSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function FinalCTA() {
 return (
 <section className="py-24 px-6 md:px-12 w-full relative z-20 overflow-hidden bg-background">
 <div className="max-w-[1200px] mx-auto text-center">
 <motion.div
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 className="relative rounded-[3rem] bg-primary border border-primary/20 shadow-2xl overflow-hidden p-16 md:p-24 flex flex-col items-center"
 >
 {/* Subtle abstract shapes for premium feel */}
 <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
 <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-white/5 rotate-12 blur-3xl rounded-full"></div>
 <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[150%] bg-white/5 -rotate-12 blur-3xl rounded-full"></div>
 <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
 </div>

 <div className="relative z-10 w-full max-w-3xl">
 <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/20">
 <TerminalSquare className="w-8 h-8" />
 </div>
 <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
 Ready to ship faster?
 </h2>
 <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
 Join leading engineering teams using FraudShield AI to automate development, enhance QA, and orchestrate autonomous agents.
 </p>
 
 <div className="flex flex-col sm:flex-row justify-center gap-4">
 <Link to="/register">
 <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all bg-white text-primary hover:bg-zinc-50">
 Start Building
 </Button>
 </Link>
 <Link to="/contact">
 <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-semibold gap-2 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white transition-all group">
 Contact Sales <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
 </Button>
 </Link>
 </div>
 </div>
 </motion.div>
 </div>
 </section>
 );
}

export function PremiumFooter() {
 return (
 <footer className="bg-background border-t border-border pt-20 pb-10 px-6 md:px-12 relative z-20">
 <div className="max-w-[1200px] mx-auto">
 <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
 
 {/* Brand Col */}
 <div className="col-span-2 md:col-span-2">
 <div className="flex items-center gap-2 mb-6 select-none">
 <img src="/logo.svg" alt="FraudShield AI Logo" className="w-6 h-6" />
 <span className="font-bold text-xl tracking-tight text-primary">FraudShield AI</span>
 </div>
 <p className="text-base text-muted-foreground mb-8 max-w-sm leading-relaxed">
 The standard in Agent-Driven Development. Autonomous engineering for modern software teams.
 </p>
 <div className="flex gap-4">
 <a href="https://twitter.com/fraudshield" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors" aria-label="Twitter"><Twitter className="w-4 h-4" /></a>
 <a href="https://github.com/fraudshield" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors" aria-label="GitHub"><Github className="w-4 h-4" /></a>
 <a href="https://linkedin.com/company/fraudshield" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors" aria-label="LinkedIn"><Linkedin className="w-4 h-4" /></a>
 </div>
 </div>

 {/* Links */}
 <div>
 <h3 className="font-bold text-foreground text-sm mb-6 uppercase tracking-wider">Product</h3>
 <ul className="space-y-4 text-sm text-muted-foreground font-medium">
 <li><Link to="/platform" className="hover:text-primary transition-colors">Platform Overview</Link></li>
 <li><Link to="/explainability" className="hover:text-primary transition-colors">Agent Workspace</Link></li>
 <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
 </ul>
 </div>

 <div>
 <h3 className="font-bold text-foreground text-sm mb-6 uppercase tracking-wider">Company</h3>
 <ul className="space-y-4 text-sm text-muted-foreground font-medium">
 <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
 <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Sales</Link></li>
 </ul>
 </div>

 <div>
 <h3 className="font-bold text-foreground text-sm mb-6 uppercase tracking-wider">Legal</h3>
 <ul className="space-y-4 text-sm text-muted-foreground font-medium">
 <li><Link to="/platform" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">Security</Link></li>
 <li><Link to="/about" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">Terms of Service</Link></li>
 <li><Link to="/about" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">Privacy Policy</Link></li>
 </ul>
 </div>

 </div>

 <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
 <p className="text-sm font-medium text-muted-foreground">
 &copy; {new Date().getFullYear()} FraudShield AI, Inc. All rights reserved.
 </p>
 <div className="flex items-center gap-2 bg-success/10 px-3 py-1.5 rounded-full border border-success/20">
 <span className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
 </span>
 <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider">All systems operational</span>
 </div>
 </div>
 </div>
 </footer>
 );
}
