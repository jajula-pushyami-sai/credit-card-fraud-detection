import React from 'react';
import { StickyNav } from "@/components/landing/StickyNav";
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumFooter } from '@/components/landing/FinalCTA';

export const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background relative flex flex-col font-sans text-foreground">
      <StickyNav />
      
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto w-full">

      </main>
      
      <PremiumFooter />
    </div>
  );
};
