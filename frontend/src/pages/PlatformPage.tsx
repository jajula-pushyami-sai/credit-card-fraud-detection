import React from 'react';
import { StickyNav } from "@/components/landing/StickyNav";
import { motion } from 'framer-motion';
import { Bot, Cpu, Network, Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumFooter } from '@/components/landing/FinalCTA';

export const PlatformPage = () => {
  return (
    <div className="min-h-screen bg-background relative flex flex-col font-sans text-foreground">
      <StickyNav />
      
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto w-full">

        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-primary text-primary-foreground p-12 rounded-[2rem] text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to hire AI Engineers?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto relative z-10">Integrate the FraudShield AI into your pipeline and start shipping features 10x faster.</p>
          <div className="flex gap-4 justify-center relative z-10">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-zinc-100 px-8 h-12 rounded-xl font-medium">Developer Docs</Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 h-12 rounded-xl font-medium">Contact Engineering</Button>
          </div>
        </motion.div>
      </main>
      
      <PremiumFooter />
    </div>
  );
};
