import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, ShieldCheck, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LiveDemo() {
 const [analyzing, setAnalyzing] = useState(false);
 const [result, setResult] = useState<any>(null);

 const [formData, setFormData] = useState({
 amount: '1247',
 merchant: 'Orbit Wire Transfer',
 country: 'NG',
 device: 'iOS',
 ipAddress: '203.0.113.42',
 velocity: 11,
 card: 'Visa',
 hour: 3
 });

 const runAnalysis = () => {
 setAnalyzing(true);
 setResult(null);
 
 setTimeout(() => {
 setAnalyzing(false);
 
 setResult({
 success: false, // It's fraud
 time: '32ms',
 confidence: 0.99,
 action_taken: 'Blocked',
 steps: [
 { name: 'Analyze IP Geolocation', status: 'done', time: '5ms' },
 { name: 'Cross-reference Merchant History', status: 'done', time: '8ms' },
 { name: 'Evaluate Velocity Rules', status: 'done', time: '4ms' },
 { name: 'Run Deep Neural Network', status: 'done', time: '12ms' },
 { name: 'Execute Block Policy', status: 'done', time: '3ms' }
 ]
 });
 }, 1500);
 };

 return (
 <section id="demo" className="py-24 relative overflow-hidden bg-background border-t border-border">
 <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
 
 <div className="text-center max-w-3xl mx-auto mb-16">
 <motion.h2 
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6"
 >
 Test the AI Decision Engine
 </motion.h2>
 <motion.p 
 initial={{ opacity: 0, y: 15 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin:"-100px" }}
 transition={{ delay: 0.1 }}
 className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
 >
 Enter simulated transaction details below to see how FraudShield AI analyzes patterns, detects anomalies, and prevents fraud in real-time.
 </motion.p>
 </div>

 <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden flex flex-col lg:flex-row max-w-5xl mx-auto">
 
 {/* Left Column: Form */}
 <div className="lg:w-1/2 p-6 md:p-8 bg-background border-b lg:border-b-0 lg:border-r border-border rounded-t-[24px] lg:rounded-tr-none lg:rounded-l-[24px]">
 <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">
 Transaction
 </h3>
 
 <div className="space-y-6">
 
 {/* Amount */}
 <div className="bg-muted/30 p-4 rounded-xl border border-transparent hover:border-border transition-colors">
 <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Amount</label>
 <div className="flex items-center text-2xl font-semibold text-foreground">
 <span className="text-muted-foreground mr-2">$</span>
 <input 
 type="text" 
 value={formData.amount}
 onChange={(e) => setFormData({...formData, amount: e.target.value})}
 className="bg-transparent border-none outline-none w-full p-0 m-0"
 />
 </div>
 </div>

 {/* Merchant & Country & Device */}
 <div className="bg-muted/30 p-4 rounded-xl space-y-5 border border-transparent hover:border-border transition-colors">
 <div>
 <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Merchant</label>
 <select 
 value={formData.merchant}
 onChange={(e) => setFormData({...formData, merchant: e.target.value})}
 className="w-full bg-transparent text-sm font-medium text-foreground outline-none border-b border-border pb-2 focus:border-primary cursor-pointer appearance-none"
 >
 <option>Kestrel Crypto</option>
 <option>Northwind Grocery</option>
 <option>Aurora Airlines</option>
 <option>Halcyon Hotel</option>
 <option>Vantage Gift Cards</option>
 <option>Orbit Wire Transfer</option>
 </select>
 </div>
 
 <div className="grid grid-cols-2 gap-6">
 <div>
 <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Country</label>
 <div className="flex flex-wrap gap-1.5">
 {['US', 'GB', 'DE', 'JP', 'SG', 'NG', 'RU', 'BR'].map((c) => (
 <button
 key={c}
 onClick={() => setFormData({...formData, country: c})}
 className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${
 formData.country === c 
 ? 'bg-[#10b981] text-white shadow-sm' 
 : 'text-muted-foreground hover:bg-muted'
 }`}
 >
 {c}
 </button>
 ))}
 </div>
 </div>
 <div>
 <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Device</label>
 <select 
 value={formData.device}
 onChange={(e) => setFormData({...formData, device: e.target.value})}
 className="w-full bg-transparent text-sm font-medium text-foreground outline-none border-b border-border pb-2 focus:border-primary cursor-pointer appearance-none"
 >
 <option>Unknown</option>
 <option>iOS</option>
 <option>Android</option>
 </select>
 </div>
 </div>
 </div>

 {/* IP Address & Velocity */}
 <div className="bg-muted/30 p-4 rounded-xl space-y-5 border border-transparent hover:border-border transition-colors">
 <div>
 <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">IP Address</label>
 <input 
 type="text"
 value={formData.ipAddress}
 onChange={(e) => setFormData({...formData, ipAddress: e.target.value})}
 className="w-full bg-transparent text-sm font-medium text-foreground outline-none border-b border-border pb-2 focus:border-primary"
 />
 </div>
 <div>
 <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
 Velocity — {formData.velocity} TXN/HR
 </label>
 <input 
 type="range"
 min="1" max="100"
 value={formData.velocity}
 onChange={(e) => setFormData({...formData, velocity: parseInt(e.target.value)})}
 className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-[#10b981]"
 />
 </div>
 </div>

 {/* Card & Hour */}
 <div className="grid grid-cols-2 gap-4">
 <div className="bg-muted/30 p-4 rounded-xl border border-transparent hover:border-border transition-colors">
 <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Card</label>
 <div className="flex gap-1.5">
 {['Visa', 'Mastercard', 'Amex'].map((c) => (
 <button
 key={c}
 onClick={() => setFormData({...formData, card: c})}
 className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all ${
 formData.card === c 
 ? 'bg-[#0f172a] text-white shadow-sm' 
 : 'text-muted-foreground hover:bg-muted'
 }`}
 >
 {c}
 </button>
 ))}
 </div>
 </div>
 
 <div className="bg-muted/30 p-4 rounded-xl border border-transparent hover:border-border transition-colors">
 <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
 Hour — {formData.hour.toString().padStart(2, '0')}:00
 </label>
 <input 
 type="range"
 min="0" max="23"
 value={formData.hour}
 onChange={(e) => setFormData({...formData, hour: parseInt(e.target.value)})}
 className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-[#10b981]"
 />
 </div>
 </div>

 <div className="pt-2">
 <Button onClick={runAnalysis} disabled={analyzing} className="w-full h-14 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white transition-all shadow-md font-bold text-[15px] flex items-center justify-center gap-2">
 {analyzing ? (
 <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
 ) : (
 <>
 <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
 Analyze transaction
 </>
 )}
 </Button>
 </div>
 </div>
 </div>

 {/* Right Column: Results */}
 <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col min-h-[400px] bg-background">
 
 {!analyzing && !result && (
 <div className="flex flex-col items-center justify-center h-full text-center">
 <Activity className="w-12 h-12 text-zinc-400 mb-4 stroke-[1.5]" />
 <p className="text-sm font-medium text-zinc-700">Run execution to view the AI decision engine's response</p>
 </div>
 )}

 {analyzing && (
 <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
 <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
 <p className="text-sm text-muted-foreground font-medium">Engine is scoring transaction risk...</p>
 </div>
 )}

 {result && !analyzing && (
 <motion.div 
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="flex flex-col h-full"
 >
 <div className="flex items-start justify-between mb-8 pb-6 border-b border-border">
 <div className="flex items-center gap-3">
 <div className={`p-2.5 rounded-xl border ${result.success ? 'bg-success/10 border-success/20 text-success' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
 {result.success ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
 </div>
 <div>
 <h3 className={`text-lg font-bold tracking-tight ${result.success ? 'text-success' : 'text-destructive'}`}>
 {result.success ? 'Transaction Approved' : 'High Risk Detected'}
 </h3>
 <p className="text-xs text-muted-foreground font-medium mt-0.5">Response Time: {result.time} | Confidence: {result.confidence * 100}%</p>
 </div>
 </div>
 </div>

 <div>
 <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Decision Trace</h4>
 <div className="space-y-4">
 {result.steps.map((step: any, i: number) => (
 <div key={i} className="flex items-center gap-4">
 <div className={`flex items-center justify-center w-5 h-5 rounded-full ${result.success ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
 {result.success ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
 </div>
 <div className="flex-1 text-sm font-medium text-foreground">{step.name}</div>
 <div className="text-xs font-bold text-muted-foreground">
 {step.time}
 </div>
 </div>
 ))}
 </div>
 </div>

 <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
 <div className="text-sm text-muted-foreground">
 Action Taken: <span className={`font-semibold ${result.success ? 'text-success' : 'text-destructive'}`}>{result.action_taken}</span>
 </div>
 <Button variant="outline" size="sm" className="h-8 text-xs font-medium">View Full Audit Log</Button>
 </div>

 </motion.div>
 )}
 </div>
 </div>
 </div>
 </section>
 );
}
