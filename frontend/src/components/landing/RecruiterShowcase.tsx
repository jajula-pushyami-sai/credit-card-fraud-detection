import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Briefcase, Code, Database, LineChart, Shield, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

export const RecruiterShowcase: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
 return (
 <AnimatePresence>
 {isOpen && (
 <>
 {/* Backdrop */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={onClose}
 className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
 />

 {/* Drawer */}
 <motion.div
 initial={{ x: '100%', opacity: 0.5 }}
 animate={{ x: 0, opacity: 1 }}
 exit={{ x: '100%', opacity: 0.5 }}
 transition={{ type:"spring", damping: 25, stiffness: 200 }}
 className="fixed top-0 right-0 z-50 h-full w-full sm:w-[450px] bg-white border-l border-slate-200 shadow-2xl overflow-y-auto"
 >
 {/* Header */}
 <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Sparkles className="w-5 h-5 text-primary" />
 <h2 className="font-semibold text-lg text-slate-900 tracking-tight">Portfolio Showcase</h2>
 </div>
 <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
 <X className="w-4 h-4" />
 </Button>
 </div>

 {/* Content */}
 <div className="p-6 space-y-8">
 
 <section className="space-y-3">
 <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">
 <Award className="w-3.5 h-3.5" /> Project Status: Completed (v12.0)
 </div>
 <h3 className="text-xl font-bold tracking-tight text-slate-900">FraudShield AI Enterprise</h3>
 <p className="text-sm text-slate-600 leading-relaxed">
 An academic and portfolio demonstration of full-stack engineering, machine learning, and enterprise UX design. This platform solves the complex issue of credit card fraud detection using an Explainable Hybrid Ensemble Framework.
 </p>
 </section>

 <section className="space-y-4">
 <h4 className="font-semibold text-sm flex items-center gap-2 uppercase tracking-wider text-slate-500"><Code className="w-4 h-4" /> Tech Stack Mastery</h4>
 <div className="grid grid-cols-2 gap-3">
 {[
 { label: 'Frontend', value: 'React, Tailwind, Framer Motion' },
 { label: '3D WebGL', value: 'React Three Fiber' },
 { label: 'Backend', value: 'Flask (Python)' },
 { label: 'Machine Learning', value: 'XGBoost, scikit-learn' },
 ].map((stack, i) => (
 <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
 <div className="text-[10px] uppercase text-slate-500 font-semibold mb-1">{stack.label}</div>
 <div className="text-xs font-medium">{stack.value}</div>
 </div>
 ))}
 </div>
 </section>

 <section className="space-y-4">
 <h4 className="font-semibold text-sm flex items-center gap-2 uppercase tracking-wider text-slate-500"><Database className="w-4 h-4" /> ML Architecture</h4>
 <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl space-y-3">
 <p className="text-sm text-primary-foreground">
 <strong>Stacking Ensemble Strategy:</strong>
 <br />
 We process synthetic transaction data. To handle the massive class imbalance (0.1% positive class), we apply SMOTE strictly on the training set to prevent data leakage.
 </p>
 <p className="text-sm text-primary-foreground">
 The ensemble utilizes Extra Trees and MLP base learners, with an XGBoost Meta-Learner making the final prediction. We optimize for <strong>PR-AUC</strong> rather than ROC-AUC due to the severe imbalance.
 </p>
 </div>
 </section>

 <section className="space-y-4">
 <h4 className="font-semibold text-sm flex items-center gap-2 uppercase tracking-wider text-slate-500"><LineChart className="w-4 h-4" /> Explainability & Copilot</h4>
 <p className="text-sm text-slate-600 leading-relaxed">
 Financial institutions cannot use"black box" models due to regulatory requirements. FraudShield implements SHAP to provide local feature importance (e.g.,"Why was this specific transaction blocked?").
 <br /><br />
 This is augmented by the <strong>Enterprise AI Copilot</strong>, a context-aware LLM interface that explains the SHAP values to non-technical fraud analysts.
 </p>
 </section>

 <section className="space-y-4">
 <h4 className="font-semibold text-sm flex items-center gap-2 uppercase tracking-wider text-slate-500"><Shield className="w-4 h-4" /> DevSecOps & Governance</h4>
 <p className="text-sm text-slate-600 leading-relaxed">
 The platform is designed with enterprise security considerations. It features an immutable Audit Log, a live Security SOC dashboard, OWASP Top 10 defenses (JWTs in HttpOnly cookies), and a Model Governance portal documenting fairness (Disparate Impact ratio).
 </p>
 </section>

 <div className="pt-6 border-t border-slate-200">
 <Button className="w-full gap-2 bg-slate-900 hover:bg-slate-800 text-white :bg-slate-200" onClick={onClose}>
 <Briefcase className="w-4 h-4" /> Close Showcase
 </Button>
 </div>

 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 );
};
