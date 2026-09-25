import React from 'react';
import { motion } from 'framer-motion';
import { Database, Server, Cpu, Globe, Lock, Workflow } from 'lucide-react';

export function PlatformArchitecture() {
 return (
 <section className="py-24 relative overflow-hidden bg-zinc-950 mx-4 md:mx-12 my-12 rounded-[2.5rem] shadow-sm">
 <div className="absolute inset-0 z-0">
 <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
 </div>

 <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
 <motion.div
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-4 flex items-center justify-center gap-2"
 >
 <Workflow className="w-3 h-3" />
 Architecture
 </motion.div>

 <motion.h2
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ delay: 0.1 }}
 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-20"
 >
 Engineered for <span className="text-zinc-500">Mission-Critical Scale.</span>
 </motion.h2>

 <div className="relative max-w-4xl mx-auto h-[550px] flex flex-col justify-between hidden md:flex">
 
 {/* Top Layer: Ingestion */}
 <div className="flex justify-between items-center w-full relative z-20">
 <motion.div 
 className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl w-56 shadow-sm flex flex-col items-center"
 whileHover={{ y: -2 }}
 >
 <Globe className="w-6 h-6 text-zinc-100 mb-3" />
 <h3 className="text-white font-medium text-sm mb-1">Global Gateways</h3>
 <p className="text-xs text-zinc-500">REST & GraphQL APIs</p>
 </motion.div>
 
 <motion.div 
 className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl w-56 shadow-sm flex flex-col items-center"
 whileHover={{ y: -2 }}
 >
 <Server className="w-6 h-6 text-zinc-100 mb-3" />
 <h3 className="text-white font-medium text-sm mb-1">Event Streaming</h3>
 <p className="text-xs text-zinc-500">Apache Kafka</p>
 </motion.div>
 
 <motion.div 
 className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl w-56 shadow-sm flex flex-col items-center"
 whileHover={{ y: -2 }}
 >
 <Database className="w-6 h-6 text-zinc-100 mb-3" />
 <h3 className="text-white font-medium text-sm mb-1">Feature Store</h3>
 <p className="text-xs text-zinc-500">Redis & PostgreSQL</p>
 </motion.div>
 </div>

 {/* Animated Connecting Lines (Vertical) */}
 <div className="absolute top-[100px] bottom-[100px] left-0 w-full flex justify-around px-28 z-10">
 <div className="w-px h-full bg-zinc-800 relative">
 <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-12 bg-white rounded-full" animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, ease:"linear" }} />
 </div>
 <div className="w-px h-full bg-zinc-800 relative">
 <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-12 bg-white rounded-full" animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease:"linear", delay: 0.5 }} />
 </div>
 <div className="w-px h-full bg-zinc-800 relative">
 <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-12 bg-white rounded-full" animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease:"linear", delay: 1 }} />
 </div>
 </div>

 {/* Middle Layer: Engine */}
 <div className="w-full flex justify-center relative z-20">
 <motion.div 
 className="bg-white text-zinc-900 p-8 rounded-[2rem] w-full max-w-xl shadow-lg flex flex-col items-center relative overflow-hidden"
 whileHover={{ scale: 1.02 }}
 transition={{ duration: 0.3 }}
 >
 <Cpu className="w-8 h-8 text-zinc-900 mb-4 relative z-10" />
 <h3 className="text-xl font-bold mb-1 relative z-10 tracking-tight">Hybrid AI Engine</h3>
 <p className="text-zinc-500 text-sm font-medium relative z-10">Distributed Meta-Learning Cluster</p>
 
 <div className="flex gap-3 mt-6 relative z-10">
 <span className="px-3 py-1 bg-zinc-100 rounded-md text-[10px] font-bold uppercase tracking-widest text-zinc-600">Extra Trees</span>
 <span className="px-3 py-1 bg-zinc-100 rounded-md text-[10px] font-bold uppercase tracking-widest text-zinc-600">MLP Networks</span>
 <span className="px-3 py-1 bg-zinc-100 rounded-md text-[10px] font-bold uppercase tracking-widest text-zinc-600">XGBoost</span>
 </div>
 </motion.div>
 </div>

 {/* Bottom Layer: Output */}
 <div className="flex justify-center gap-16 w-full relative z-20">
 <motion.div 
 className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl w-56 shadow-sm flex flex-col items-center"
 whileHover={{ y: 2 }}
 >
 <Lock className="w-6 h-6 text-zinc-100 mb-3" />
 <h3 className="text-white font-medium text-sm mb-1">Decision Webhooks</h3>
 <p className="text-xs text-zinc-500">Block / Allow / Challenge</p>
 </motion.div>
 
 <motion.div 
 className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl w-56 shadow-sm flex flex-col items-center"
 whileHover={{ y: 2 }}
 >
 <Database className="w-6 h-6 text-zinc-100 mb-3" />
 <h3 className="text-white font-medium text-sm mb-1">Data Warehouse</h3>
 <p className="text-xs text-zinc-500">Snowflake / BigQuery</p>
 </motion.div>
 </div>
 
 </div>

 {/* Mobile View */}
 <div className="md:hidden flex flex-col gap-4">
 <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
 <Globe className="w-6 h-6 text-zinc-100 mx-auto mb-2" />
 <h3 className="text-white text-sm font-medium">Global Gateways</h3>
 </div>
 <div className="bg-white p-8 rounded-3xl text-zinc-900">
 <Cpu className="w-8 h-8 mx-auto mb-2" />
 <h3 className="text-lg font-bold">Hybrid AI Engine</h3>
 </div>
 <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
 <Lock className="w-6 h-6 text-zinc-100 mx-auto mb-2" />
 <h3 className="text-white text-sm font-medium">Decision Webhooks</h3>
 </div>
 </div>

 </div>
 </section>
 );
}
