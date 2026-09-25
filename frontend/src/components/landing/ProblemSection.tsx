import React from 'react';
import { AlertTriangle, TrendingUp, ShieldOff, Brain } from 'lucide-react';
import { GlobalFraudGlobe } from '@/components/3d/GlobalFraudGlobe';
import { FadeIn } from '@/components/motion/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerContainer';
import { InteractiveCard } from '@/components/motion/InteractiveCard';

const problems = [
 {
 icon: <TrendingUp className="w-6 h-6 text-destructive" />,
 title:"Increasing Online Fraud",
 desc:"Global card fraud losses are projected to reach $38.5B by 2027, driven by sophisticated AI-generated synthetic identities."
 },
 {
 icon: <ShieldOff className="w-6 h-6 text-warning" />,
 title:"False Positives",
 desc:"Traditional rules-based engines block legitimate transactions, costing merchants more in lost sales than actual fraud."
 },
 {
 icon: <Brain className="w-6 h-6 text-primary" />,
 title:"Black Box AI Challenges",
 desc:"Modern ML detects fraud, but compliance teams cannot explain WHY a transaction was flagged, leading to regulatory risk."
 }
];

export function ProblemSection() {
 return (
 <section id="problem" className="py-32 px-8 md:px-12 max-w-[1600px] mx-auto w-full relative z-20">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
 <div>
 <FadeIn direction="up" className="mb-12">
 <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-6">
 Financial Fraud is Evolving <br className="hidden md:block"/>
 <span className="text-muted-foreground">Faster Than Traditional Systems</span>
 </h2>
 <p className="text-lg text-muted-foreground leading-relaxed">
 Legacy detection engines rely on rigid rulesets and lack the intelligence to catch zero-day fraud patterns, while black-box AI creates compliance nightmares.
 </p>
 </FadeIn>

 <StaggerContainer className="space-y-6" delayChildren={0.3}>
 {problems.map((prob, i) => (
 <StaggerItem key={i}>
 <InteractiveCard tilt={false} className="flex gap-6 p-6 bg-white/40 border border-border/40 backdrop-blur-sm shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
 <div className="w-12 h-12 shrink-0 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-border/20">
 {prob.icon}
 </div>
 <div>
 <h3 className="text-xl font-semibold mb-2 text-primary">{prob.title}</h3>
 <p className="text-muted-foreground leading-relaxed text-sm">
 {prob.desc}
 </p>
 </div>
 </InteractiveCard>
 </StaggerItem>
 ))}
 </StaggerContainer>
 </div>

 {/* 3D Global Earth */}
 <FadeIn direction="none" duration={1.2} className="w-full h-full min-h-[600px]">
 <GlobalFraudGlobe />
 </FadeIn>
 </div>
 </section>
 );
}
