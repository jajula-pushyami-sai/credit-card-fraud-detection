import React from 'react';
import { motion } from 'framer-motion';

const enterpriseLogos = [
"FinTrust BANKING","SecurePay PAYMENTS","TrustNext FINTECH","NovaBank DIGITAL","PayGuard SECURITY"
];

export function TrustBar() {
 return (
 <section className="w-full bg-white rounded-3xl mx-6 md:mx-12 my-12 py-12 flex flex-col items-center relative z-20 shadow-sm border border-slate-200">
 <div className="mb-10 text-xs font-semibold tracking-widest text-slate-500 uppercase">
 Trusted by innovative teams
 </div>
 
 <div className="w-full flex justify-center">
 <div className="flex flex-wrap justify-center gap-10 sm:gap-20 items-center px-4">
 {enterpriseLogos.map((logo, index) => (
 <div 
 key={index} 
 className="flex-shrink-0 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-default"
 >
 <span className="text-lg font-bold tracking-tight text-slate-800">
 {logo}
 </span>
 </div>
 ))}
 </div>
 </div>
 </section>
 );
}
