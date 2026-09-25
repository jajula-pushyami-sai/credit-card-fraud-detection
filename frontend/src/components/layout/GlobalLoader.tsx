import React from 'react';
import { motion } from 'framer-motion';

export function GlobalLoader() {
 return (
 <div className="fixed inset-0 z-[9999] bg-[#F8F6F1] flex items-center justify-center">
 <div className="flex flex-col items-center gap-6">
 <div className="relative flex items-center justify-center">
 <div className="w-16 h-16 rounded-full border-4 border-[#E5E7EB]" />
 <motion.div 
 className="absolute inset-0 rounded-full border-4 border-[#0F766E] border-t-transparent"
 animate={{ rotate: 360 }}
 transition={{ duration: 1, repeat: Infinity, ease:"linear" }}
 />
 </div>
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.2 }}
 className="text-sm font-bold text-[#111827] uppercase tracking-widest"
 >
 Loading Environment
 </motion.div>
 </div>
 </div>
 );
}
