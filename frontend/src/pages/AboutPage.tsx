import React from 'react';
import { StickyNav } from "@/components/landing/StickyNav";
import { motion } from 'framer-motion';
import { PremiumFooter } from '@/components/landing/FinalCTA';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background relative flex flex-col font-sans text-foreground">
      <StickyNav />
      
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-[1000px] mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="text-sm font-bold text-primary tracking-widest uppercase mb-4">Our Mission</div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">
            Accelerating Human Progress through Agent-Driven Development.
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
            <p className="text-xl mb-6 font-medium text-foreground">
              Software engineering hasn't fundamentally changed in decades. Developers still spend 80% of their time reading undocumented code, fixing environment issues, and writing boilerplate.
            </p>
            <p className="mb-6">
              At FraudShield AI, we believe the next era of software development will be autonomous. We are building the foundational infrastructure for Agent-Driven Development, allowing engineering teams to scale their output 10x by hiring AI subagents that can read, reason, and write code securely alongside human developers.
            </p>
            <p>
              Our team consists of veteran engineers and AI researchers from top tech companies who are obsessed with developer experience, security, and the future of work.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-16 border-t border-border"
        >
          <div>
            <h3 className="text-2xl font-bold mb-4">Engineering First</h3>
            <p className="text-muted-foreground leading-relaxed">
              We build tools for developers, by developers. We understand the importance of strict typing, comprehensive testing, and zero-trust security environments.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Open Extensibility</h3>
            <p className="text-muted-foreground leading-relaxed">
              No black boxes. The FraudShield AI is designed to be fully extensible, allowing you to plug your own APIs, databases, and custom tools directly into the agent reasoning loop.
            </p>
          </div>
        </motion.div>
      </main>

      <PremiumFooter />
    </div>
  );
};
