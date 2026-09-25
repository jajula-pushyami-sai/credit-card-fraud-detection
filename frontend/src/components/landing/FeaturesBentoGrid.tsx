import React from 'react';
import { motion } from 'framer-motion';
import { NeuralNetwork3D } from '@/components/3d/NeuralNetwork3D';
import { CreditCardScene } from '@/components/3d/CreditCardScene';
import { AuditTimelineRing } from '@/components/3d/AuditTimelineRing';
import { ComplianceGrid3D } from '@/components/3d/ComplianceGrid3D';
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerContainer';
import { InteractiveCard } from '@/components/motion/InteractiveCard';
import { FadeIn } from '@/components/motion/FadeIn';

import batchImg from '@/assets/illustrations/bento_batch.png';
import adminImg from '@/assets/illustrations/bento_admin.png';

const bentoItems = [
 { title:"Explainability", span:"md:col-span-2 md:row-span-2", bg:"bg-white/60", content:"SHAP native integration.", scene: null, image: null },
 { title:"Batch Prediction", span:"md:col-span-1 md:row-span-1", bg:"bg-primary text-primary-foreground relative overflow-hidden", content:"Process millions of rows instantly.", scene: null, image: batchImg },
 { title:"Admin Portal", span:"md:col-span-1 md:row-span-1", bg:"bg-white/40 relative overflow-hidden", content:"Manage system configurations.", scene: null, image: adminImg },
 { title:"Fraud Network", span:"md:col-span-1 md:row-span-2", bg:"bg-accent/10 p-0 overflow-hidden relative", content:"Advanced topology mapping.", scene: <NeuralNetwork3D />, image: null },
 { title:"Secure Card Identity", span:"md:col-span-2 md:row-span-2", bg:"bg-white/40 p-0 overflow-hidden relative", content:"Tokenized transaction flows.", scene: <CreditCardScene />, image: null },
 { title:"Immutable Audit Trails", span:"md:col-span-1 md:row-span-2", bg:"bg-success/10 p-0 overflow-hidden relative", content:"Track every decision.", scene: <ComplianceGrid3D />, image: null },
 { title:"Risk Timeline", span:"md:col-span-1 md:row-span-2", bg:"bg-white/50 p-0 overflow-hidden relative", content:"Event-driven architecture.", scene: <AuditTimelineRing />, image: null }
];

export function FeaturesBentoGrid() {
 return (
 <section id="features" className="py-24 px-8 md:px-12 max-w-[1600px] mx-auto w-full relative z-20">
 <FadeIn direction="up" className="mb-16">
 <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-4">Complete Fraud Suite</h2>
 <p className="text-lg text-muted-foreground max-w-2xl">Everything your team needs to manage, detect, and explain fraudulent transactions at enterprise scale.</p>
 </FadeIn>

 <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-6" staggerChildren={0.05}>
 {bentoItems.map((item, i) => (
 <StaggerItem key={i} className={item.span}>
 <InteractiveCard tilt={!item.scene} className={`w-full h-full border border-border/40 shadow-[0_4px_30px_rgba(0,0,0,0.02)] backdrop-blur-md flex flex-col justify-between group overflow-hidden ${item.bg}`}>
 {item.scene ? (
 <>
 <div className="absolute inset-0 z-0 scale-[1.2] opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none md:pointer-events-auto">
 {item.scene}
 </div>
 <div className="relative z-10 p-8 bg-gradient-to-b from-white/80 to-transparent pointer-events-none rounded-t-[32px]">
 <h3 className="text-xl font-semibold text-primary">{item.title}</h3>
 <p className="opacity-80 text-sm mt-2 text-primary">{item.content}</p>
 </div>
 </>
 ) : item.image ? (
 <>
 <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none mix-blend-overlay">
 <img loading="lazy" src={item.image} alt={item.title} className="w-full h-full object-cover" />
 </div>
 <div className="relative z-10 p-8 h-full flex flex-col justify-between">
 <h3 className="text-xl font-semibold">{item.title}</h3>
 <p className="opacity-80 text-sm mt-4">{item.content}</p>
 </div>
 </>
 ) : (
 <div className="p-8 h-full flex flex-col justify-between">
 <h3 className="text-xl font-semibold">{item.title}</h3>
 <p className="opacity-80 text-sm mt-4">{item.content}</p>
 </div>
 )}
 </InteractiveCard>
 </StaggerItem>
 ))}
 </StaggerContainer>
 </section>
 );
}
