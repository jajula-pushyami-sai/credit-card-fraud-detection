import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, CreditCard, Lock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { NeuralNetworkBackground } from "@/components/landing/NeuralNetworkBackground";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const Hero3DScene = React.lazy(() => import('@/components/3d/Hero3DScene').then(m => ({ default: m.Hero3DScene })));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export function EnterpriseHero() {
  const [load3D, setLoad3D] = React.useState(false);

  // Mouse Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-500, 500], [5, -5]);
  const rotateY = useTransform(mouseX, [-500, 500], [-5, 5]);
  const x = useTransform(mouseX, [-500, 500], [-20, 20]);
  const y = useTransform(mouseY, [-500, 500], [-20, 20]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPos = e.clientX - rect.left - rect.width / 2;
    const yPos = e.clientY - rect.top - rect.height / 2;
    mouseX.set(xPos);
    mouseY.set(yPos);
  };

  React.useEffect(() => {
    const handleInteraction = () => {
      if (!load3D) {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => setLoad3D(true));
        } else {
          setLoad3D(true);
        }
      }
    };

    window.addEventListener('mousemove', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    window.addEventListener('scroll', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    const timer = setTimeout(handleInteraction, 5000);

    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      clearTimeout(timer);
    };
  }, [load3D]);

  const titleWords = "Security, Redefined by AI.".split(" ");

  return (
    <section 
      id="hero" 
      className="relative w-full min-h-[95vh] flex items-center bg-background overflow-hidden border-b border-border"
      onMouseMove={handleMouseMove}
      style={{ willChange: 'transform' }}
    >
      <NeuralNetworkBackground />
      
      {/* Animated Background AI Network SVG */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 1000 1000" fill="none">
          <motion.circle cx="500" cy="500" r="300" stroke="#0F766E" strokeWidth="2" strokeDasharray="10 20"
            animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
          <motion.circle cx="500" cy="500" r="450" stroke="#14B8A6" strokeWidth="1" strokeDasharray="5 30"
            animate={{ rotate: -360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>
      
      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 pt-24 lg:pt-0 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full min-h-[80vh]">
          
          {/* Left Content */}
          <motion.div 
            className="flex flex-col z-10 max-w-2xl relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center text-xs font-semibold text-primary uppercase tracking-widest mb-6 glass px-4 py-2 rounded-full shadow-sm hover:scale-105 transition-transform cursor-default">
                <Sparkles className="w-4 h-4 mr-2" />
                Next-Gen Financial Intelligence
              </div>
            </motion.div>

            <motion.h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-foreground flex flex-wrap gap-x-4 gap-y-2"
              variants={containerVariants}
            >
              {titleWords.map((word, i) => (
                <motion.span key={i} variants={itemVariants} className={word.includes('AI') ? 'text-primary' : ''}>
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-[90%] font-medium">
              Protect your enterprise with autonomous neural networks. Real-time transaction monitoring, predictive fraud analysis, and unparalleled security architecture.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-16">
              <Button size="lg" className="h-14 px-8 text-base rounded-2xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 font-semibold group overflow-hidden relative" asChild>
                <Link to="/register">
                  <span className="relative z-10 flex items-center">
                    Get Started <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
              </Button>
            </motion.div>

            {/* Mini Premium Stats */}
            <motion.div variants={containerVariants} className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              <motion.div variants={itemVariants} className="flex flex-col gap-1.5 group cursor-default">
                <div className="font-bold text-foreground text-xl flex items-center gap-2 group-hover:text-primary transition-colors">
                  <ShieldCheck className="w-5 h-5 text-primary" /> Advanced
                </div>
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Threat Detection</div>
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-col gap-1.5 group cursor-default">
                <div className="font-bold text-foreground text-xl flex items-center gap-2 group-hover:text-primary transition-colors">
                  <Lock className="w-5 h-5 text-primary" /> Security Principles
                </div>
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Enterprise Design</div>
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-col gap-1.5 group cursor-default">
                <div className="font-bold text-foreground text-xl flex items-center gap-2 group-hover:text-primary transition-colors">
                  <CreditCard className="w-5 h-5 text-primary" /> Fast
                </div>
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Transaction Evaluation</div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Content - Premium 3D Scene with Parallax */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, type: "spring" }}
            style={{ x, y, rotateX, rotateY }}
            className="relative w-full h-[500px] lg:h-[800px] flex items-center justify-center pointer-events-auto"
          >
            {load3D ? (
              <React.Suspense fallback={
                <div className="w-64 h-96 rounded-2xl bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-md border border-white/20 shadow-2xl animate-pulse flex flex-col justify-between p-6">
                  <div className="w-12 h-8 rounded bg-white/20" />
                  <div className="w-24 h-4 rounded bg-white/20" />
                </div>
              }>
                <Hero3DScene />
              </React.Suspense>
            ) : (
              <div className="w-64 h-96 rounded-2xl bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-md border border-white/20 shadow-2xl animate-pulse flex flex-col justify-between p-6">
                <div className="w-12 h-8 rounded bg-white/20" />
                <div className="w-24 h-4 rounded bg-white/20" />
              </div>
            )}
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div 
          className="w-px h-12 bg-primary/30 origin-top"
          animate={{ scaleY: [0, 1, 0], translateY: [0, 0, 12] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
