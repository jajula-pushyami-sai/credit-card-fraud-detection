import React, { Suspense, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { StickyNav } from "@/components/landing/StickyNav";

import { EnterpriseHero } from '@/components/landing/EnterpriseHero';

import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

// Lazy load below-the-fold components for better performance
const PlatformOverview = React.lazy(() => import('@/components/landing/PlatformOverview').then(m => ({ default: m.PlatformOverview })));
const AIDecisionEngine = React.lazy(() => import('@/components/landing/AIDecisionEngine').then(m => ({ default: m.AIDecisionEngine })));
const LiveDemo = React.lazy(() => import('@/components/landing/LiveDemo').then(m => ({ default: m.LiveDemo })));
const EnterpriseFeatures = React.lazy(() => import('@/components/landing/EnterpriseFeatures').then(m => ({ default: m.EnterpriseFeatures })));
const FinalCTA = React.lazy(() => import('@/components/landing/FinalCTA').then(m => ({ default: m.FinalCTA })));
const PremiumFooter = React.lazy(() => import('@/components/landing/FinalCTA').then(m => ({ default: m.PremiumFooter })));

const SectionLoader = () => (
  <div className="w-full h-32 flex items-center justify-center bg-background">
    <div className="w-5 h-5 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
  </div>
);

function LazySection({ children, minHeight = "10vh" }: { children: React.ReactNode, minHeight?: string }) {
  const [inView, setInView] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { rootMargin: '300px' });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} style={{ minHeight }}>{inView ? children : null}</div>;
}

export function LandingPage() {
  const [showSplash, setShowSplash] = useState(() => {
    return sessionStorage.getItem("splashPlayed") !== "true";
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem("splashPlayed", "true");
    setShowSplash(false);
  };

  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSplash]);

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden flex flex-col font-sans text-foreground">
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" onComplete={handleSplashComplete} />}
      </AnimatePresence>
      
      {/* Global Background Depth Layers */}
      <AnimatedBackground />
      
      <StickyNav />

      {/* ASSEMBLED ENTERPRISE SECTIONS */}
      <main className="relative z-10 w-full flex-1 flex flex-col gap-24 pb-24">
        {/* Hero is above the fold, no Suspense boundary to ensure instant LCP */}
        <EnterpriseHero />
        
      </main>


    </div>
  );
}
