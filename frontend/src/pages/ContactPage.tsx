import React from 'react';
import { StickyNav } from "@/components/landing/StickyNav";
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PremiumFooter } from '@/components/landing/FinalCTA';
import { Mail, MessageSquare, MapPin } from 'lucide-react';

export const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background relative flex flex-col font-sans text-foreground">
      <StickyNav />
      
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Let's talk about Agent-Driven Development.</h1>
            <p className="text-lg text-muted-foreground mb-12">
              Whether you're looking to scale your engineering team with autonomous agents or need a custom integration, our team is here to help.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Sales & Partnerships</h3>
                  <p className="text-sm text-muted-foreground">hello@fraudshield.dev</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Technical Support</h3>
                  <p className="text-sm text-muted-foreground">support@fraudshield.dev</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Headquarters</h3>
                  <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card border border-border p-8 rounded-3xl shadow-sm"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">First Name</label>
                  <input type="text" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Last Name</label>
                  <input type="text" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Work Email</label>
                <input type="email" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="john@company.com" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Company Size</label>
                <select className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors">
                  <option>1-50 employees</option>
                  <option>51-200 employees</option>
                  <option>201-1000 employees</option>
                  <option>1000+ employees</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">How can we help?</label>
                <textarea rows={4} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Tell us about your engineering workflows..."></textarea>
              </div>

              <Button className="w-full h-12 rounded-xl text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </main>

      <PremiumFooter />
    </div>
  );
};
