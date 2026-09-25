import React from 'react';
import { motion } from 'framer-motion';
import { RiskSphere } from '@/components/3d/RiskSphere';
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerContainer';
import { InteractiveCard } from '@/components/motion/InteractiveCard';
import { FadeIn } from '@/components/motion/FadeIn';

const features = [
 { title:"Hybrid Ensemble", text:"Combining neural networks with tree-based models ensures non-linear relationships and strict rules are both captured." },
 { title:"Explainability", text:"Compliance is guaranteed. Every prediction comes with a SHAP waterfall chart detailing exact feature influences." },
 { title:"Fast Inference", text:"Optimized for extreme throughput, scoring transactions quickly using efficient caching." },
 { title:"High Recall", text:"Optimized to detect fraudulent transactions while maintaining a manageable false positive rate for analysts." },
 { title:"SMOTE", text:"Synthetic Minority Over-sampling Technique handles class imbalance, preventing the model from ignoring rare fraud types." },
 { title:"Risk Scoring", text:"Not just binary classification. Detailed risk scoring (Low, Review, High) allows for dynamic business logic." }
];

export function WhyOurModel() {
 return (
 <section className="py-24 px-8 md:px-12 max-w-[1600px] mx-auto w-full relative z-20">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
 
 {/* Left: Text Features */}
 <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6" delayChildren={0.2} staggerChildren={0.1}>
 {features.map((feat, i) => (
 <StaggerItem key={i}>
 <InteractiveCard className="p-6 bg-white/30 backdrop-blur-md border border-border/40 h-full flex flex-col justify-center">
 <h3 className="text-lg font-semibold mb-2 text-primary">{feat.title}</h3>
 <p className="text-muted-foreground leading-relaxed text-sm">
 {feat.text}
 </p>
 </InteractiveCard>
 </StaggerItem>
 ))}
 </StaggerContainer>

 {/* Right: 3D Risk Sphere */}
 <FadeIn direction="none" duration={1.2} className="w-full h-full min-h-[500px]">
 <RiskSphere />
 </FadeIn>
 
 </div>
 </section>
 );
}
