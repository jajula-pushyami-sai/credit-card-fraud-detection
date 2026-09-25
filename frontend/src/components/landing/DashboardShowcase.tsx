import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function DashboardShowcase() {
 const { scrollYProgress } = useScroll();
 const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
 const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

 return (
 <section id="dashboards" className="py-32 overflow-hidden relative w-full bg-primary/5">
 <div className="max-w-[1600px] mx-auto px-8 md:px-12 flex flex-col lg:flex-row items-center gap-16">
 
 <div className="flex-1">
 <motion.h2 
 initial={{ opacity: 0, x: -30 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 className="text-4xl md:text-5xl font-medium tracking-tight text-primary mb-6"
 >
 A Dashboard for Every Detail.
 </motion.h2>
 <motion.p 
 initial={{ opacity: 0, x: -30 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.1 }}
 className="text-lg text-muted-foreground max-w-lg mb-8"
 >
 Monitor live transactions, view risk heatmaps, and dive deep into historical analytics. Built for analysts who need speed and clarity.
 </motion.p>
 </div>

 <div className="flex-1 relative h-[500px] w-full perspective-[1000px]">
 <motion.div 
 style={{ y: y1 }}
 className="absolute right-10 top-10 w-[400px] h-[250px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-border/40 p-4 rotate-y-[-15deg] rotate-z-[5deg]"
 >
 <div className="w-full h-8 bg-muted rounded-lg mb-4" />
 <div className="w-full h-full bg-accent/5 rounded-lg border border-accent/10" />
 </motion.div>
 <motion.div 
 style={{ y: y2 }}
 className="absolute left-10 bottom-10 w-[350px] h-[300px] bg-white rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-border/40 p-4 rotate-y-[-10deg] rotate-z-[-5deg] z-10"
 >
 <div className="w-1/2 h-8 bg-success/10 rounded-lg mb-4" />
 <div className="w-full h-32 bg-success/5 rounded-lg border border-success/10 mb-4" />
 <div className="w-full h-16 bg-muted rounded-lg" />
 </motion.div>
 </div>
 
 </div>
 </section>
 );
}
