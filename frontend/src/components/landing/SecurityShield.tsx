import React from 'react';
import { motion } from 'framer-motion';
import { Lock, UserCheck, Key } from 'lucide-react';
import { SecurityShield3D } from '@/components/3d/SecurityShield3D';

export function SecurityShield() {
 return (
 <section className="py-24 px-8 md:px-12 max-w-[1200px] mx-auto w-full relative z-20">
 <div className="bg-primary rounded-[40px] p-12 md:p-20 overflow-hidden relative shadow-[0_20px_80px_rgba(22,42,43,0.3)]">
 {/* Background glow */}
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px]" />

 <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
 <div className="flex-1 text-primary-foreground">
 <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6">Bank-Grade Security.</h2>
 <p className="text-lg opacity-80 mb-8 max-w-md">
 FraudShield AI is built on Zero Trust architecture. Every request, prediction, and dashboard view is strictly authenticated and logged.
 </p>
 <ul className="space-y-4">
 {[
 { icon: <Lock className="w-5 h-5 text-accent" />, text:"Bcrypt Password Hashing" },
 { icon: <Key className="w-5 h-5 text-accent" />, text:"JWT Stateless Authentication" },
 { icon: <UserCheck className="w-5 h-5 text-accent" />, text:"Role-Based Access Control (RBAC)" },
 ].map((item, i) => (
 <li key={i} className="flex items-center gap-4">
 <div className="p-2 bg-white/10 rounded-lg">{item.icon}</div>
 <span className="font-medium">{item.text}</span>
 </li>
 ))}
 </ul>
 </div>

 <div className="flex-1 flex justify-center w-full min-h-[400px]">
 <SecurityShield3D />
 </div>
 </div>
 </div>
 </section>
 );
}
