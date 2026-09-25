import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function StickyNav() {
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollState = () => {
      const currentScrollY = window.scrollY;
      // Hide when scrolling down past 150px, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setIsScrolled(currentScrollY > 50);
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    // Use passive listener — critical for performance, never blocks scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      style={{
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.35s ease-in-out',
        willChange: 'transform',
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-border shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 select-none group">
          <motion.svg 
            width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 3 }}
          >
            <motion.path 
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 3.2 }}
            />
            <motion.path 
              d="M9 12l2 2 4-4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 4 }}
            />
          </motion.svg>
          <motion.span 
            className="font-bold text-lg tracking-tight text-primary"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 3.5 }}
          >
            FraudShield AI
          </motion.span>
        </Link>



 {/* Actions */}
 <div className="flex items-center gap-3">
 <Button variant="ghost" className="hidden md:flex text-primary hover:bg-primary/5 rounded-full h-10 px-6 text-sm font-medium transition-all" asChild>
 <Link to="/login">Login</Link>
 </Button>
 <Button variant="default" className="rounded-full shadow-sm h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-all" asChild>
 <Link to="/register">Get Started</Link>
 </Button>
 </div>
 </div>
 </nav>
 );
}
