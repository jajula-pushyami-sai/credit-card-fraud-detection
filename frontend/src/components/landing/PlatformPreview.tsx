import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import analystImg from '@/assets/illustrations/mockup_analyst.png';
import customerImg from '@/assets/illustrations/mockup_customer.png';
import adminImg from '@/assets/illustrations/mockup_admin.png';

const tabs = [
 { id: 'analyst', label: 'Analyst Portal', image: analystImg },
 { id: 'customer', label: 'Customer View', image: customerImg },
 { id: 'admin', label: 'Admin Settings', image: adminImg },
];

export function PlatformPreview() {
 const [activeTab, setActiveTab] = useState(tabs[0].id);

 return (
 <section className="py-24 px-8 md:px-12 max-w-[1400px] mx-auto w-full relative z-20">
 <div className="flex flex-col items-center mb-12">
 <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-primary mb-8 text-center">
 One Platform. <br className="md:hidden" /> Three Perspectives.
 </h2>
 
 {/* Tabs */}
 <div className="flex p-1 bg-white/40 border border-border/60 rounded-full backdrop-blur-md shadow-sm">
 {tabs.map((tab) => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
 activeTab === tab.id ?"text-primary-foreground" :"text-muted-foreground hover:text-primary"
 }`}
 >
 {activeTab === tab.id && (
 <motion.div
 layoutId="activePlatformTab"
 className="absolute inset-0 bg-primary rounded-full shadow-sm"
 transition={{ type:"spring", bounce: 0.2, duration: 0.6 }}
 />
 )}
 <span className="relative z-10">{tab.label}</span>
 </button>
 ))}
 </div>
 </div>

 {/* Interactive Mockup Display */}
 <div className="w-full aspect-[16/10] max-w-5xl mx-auto relative rounded-[24px] md:rounded-[40px] border border-border/40 shadow-[0_20px_80px_rgba(22,42,43,0.15)] bg-white overflow-hidden group">
 
 {/* Top window bar */}
 <div className="absolute top-0 left-0 right-0 h-12 bg-white/80 backdrop-blur-md border-b border-border/40 flex items-center px-6 gap-2 z-20">
 <div className="w-3 h-3 rounded-full bg-destructive/80" />
 <div className="w-3 h-3 rounded-full bg-warning/80" />
 <div className="w-3 h-3 rounded-full bg-success/80" />
 </div>

 {/* Content */}
 <div className="w-full h-full bg-muted/20 relative pt-12">
 <AnimatePresence mode="wait">
 {tabs.map((tab) => tab.id === activeTab && (
 <motion.div
 key={tab.id}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 transition={{ duration: 0.3 }}
 className="absolute inset-0 pt-12 flex items-center justify-center p-4 md:p-8"
 >
 <img loading="lazy" 
 src={tab.image} 
 alt={`${tab.label} Mockup`} 
 className="w-full h-full object-cover rounded-[16px] shadow-sm border border-border/40 object-top"
 />
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 </div>
 </section>
 );
}
